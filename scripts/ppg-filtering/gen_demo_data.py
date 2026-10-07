"""
Generate precomputed demo data for the /ppg-filtering page from Stress-free participant u007,
using the research pipeline (heartview_dev) and the u007 LOSO models (no leakage).
Run with heartview_dev/.venv/bin/python from a directory whose ../data links to the SSD data folder,
then run postprocess.py on the output and copy the JSON files to public/data/ppg-filtering/.
"""
import sys, os, pickle, json, copy, time, warnings
warnings.filterwarnings('ignore')
sys.path.insert(0, '/Users/yuna.w/Research/CBSL/heartview_dev/scripts')
sys.path.insert(0, '/Users/yuna.w/Research/CBSL/heartview_dev/src')

import numpy as np
import pandas as pd
import xgboost as xgb
import optuna
from joblib import Parallel, delayed
from scipy.signal import cheby2, sosfilt_zi

from calculate_sqis import load_data_stressfree
from calculate_sqis_segment import get_segments, get_features_from_default_per_seg
from my_packages import sqi
from my_packages import dataprocessing as dp

UID = 'u007'
FS = 64
SEG = 60
TASKS = ['rest', 'mental', 'startle', 'cold']
OUT = sys.argv[1] if len(sys.argv) > 1 else 'out'
CACHE = 'signals_u007.pkl'
MODEL_DIR = '/Users/yuna.w/Research/CBSL/heartview_dev/results/model'
GT_CSV = '/Users/yuna.w/Research/CBSL/heartview_dev/results/sqis/251007_Stressfree_heartview/251007_Stressfree_heartview_recording_level_sqis_quality_score_labeled.csv'

FEATURE_ORDER = ['skewness', 'kurtosis', 'entropy', 'zero_crossing_rate', 'rsqi', 'artifact_percentage',
                 'max_amplitude', 'mean_bvp', 'std_bvp', 'mean_hr', 'mean_ibi', 'mean_rmssd', 'std_ibi',
                 'min_ibi', 'max_ibi', 'median_ibi', 'ibi_range', 'energy_loss', 'beat_ratio', 'hr_ratio']
ACC_ORDER = ['mims_auc', 'mean_magnitude', 'std_magnitude', 'max_magnitude', 'min_magnitude', 'corr_mims_artifact']

LOW = np.round(np.arange(0.4, 1.8, 0.1), 1)
HIGH = np.round(np.arange(1.2, 5.1, 0.1), 1)
CFGS = [(float(l), float(h)) for l in LOW for h in HIGH if l < h]


def load_signals():
    if os.path.exists(CACHE):
        with open(CACHE, 'rb') as f:
            return pickle.load(f)
    signals, _ = load_data_stressfree(id=UID, seg_size=SEG, output_dir='', rest_trim=False)
    with open(CACHE, 'wb') as f:
        pickle.dump(signals, f)
    return signals


def per_seg_prv(df_ibi, colname):
    """Per-segment HR / mean IBI / RMSSD (FLIRT-cleaned), as in the paper's evaluation."""
    if df_ibi.empty:
        return None
    prv, _ = dp.calculate_hr_hrv_ibi(df_ibi.set_index('Timestamp'), unit='ms', seg_size=SEG, step_size=SEG,
                                     ibi_colname=colname, clean_data=True, clean_method='flirt', threshold=0.2,
                                     print_status=False, seg_size_threshold=None)
    if prv is None:
        return None
    return prv.set_index('segment')


def eval_filter(ppg, df_mims, default_features, segments, hrv, low, high):
    """Filter + detect beats, then compute per-segment model features and ECG-referenced errors."""
    fp = sqi.get_filtered_ppg(ppg=ppg, low=low, high=high, fs_ppg=FS, beat_detection_method='heartview',
                              beat_adjustment=True, fiducial_point='middle')
    raw = fp.rawdata
    beats = np.flatnonzero(raw['Peak'].to_numpy() == 1)
    df_ibi = fp.extract_IBI(corrected=False)

    rows = []
    for i, seg in enumerate(segments):
        if seg['duration'] < SEG * 0.95:
            continue
        segdata = raw[(raw['Timestamp'] >= seg['start']) & (raw['Timestamp'] < seg['end'])].reset_index(drop=True)
        ibi_seg = df_ibi[(df_ibi['Timestamp'] >= seg['start']) & (df_ibi['Timestamp'] < seg['end'])].reset_index(drop=True)
        mims_seg = df_mims[(df_mims['Timestamp'] >= seg['start']) & (df_mims['Timestamp'] < seg['end'])].reset_index(drop=True)
        drow = default_features.loc[default_features['seg'] == i]
        chd = drow['clean_hr_default'].iloc[0] if not drow.empty else None
        nbd = drow['n_beats_default'].iloc[0] if not drow.empty else None
        feats = {
            **sqi.get_sqis(df_ppg=segdata, fs_ppg=FS),
            **sqi.get_additional_features_ppg(df_ppg=segdata),
            **sqi.get_additional_features_ibi(df_ibi=ibi_seg, seg_size=SEG, step_size=SEG, ibi_colname='IBI',
                                              clean_data=True, clean_method='flirt', threshold=0.2),
            **sqi.get_custom_features(df_ppg=segdata, fs_ppg=FS, critical_band_low=0.5, critical_band_high=2.0,
                                      clean_hr_default=chd, n_beats_default=nbd),
            **sqi.get_acc_features(df_ppg=segdata, df_mims=mims_seg, fs_ppg=FS, seg_size=SEG,
                                   seg_size_threshold=0.95, rolling_size=10),
        }
        feats.pop('perfusion', None)
        feats = {k: (v[0] if isinstance(v, (list, np.ndarray)) else v) for k, v in feats.items()}
        rows.append({'seg': i, **feats})
    df_feats = pd.DataFrame(rows)
    if not df_feats.empty:
        df_feats['included_freq_range'] = round(high - low, 1)

    prv = per_seg_prv(df_ibi, 'IBI')
    seg_rmssd, seg_ibi = {}, {}
    mae_ibi = mae_rmssd = np.nan
    if prv is not None and hrv is not None:
        d = (prv[['mean_ibi', 'rmssd']] - hrv[['mean_ibi', 'rmssd']]).dropna()
        if not d.empty:
            mae_ibi = float(d['mean_ibi'].abs().mean())
            mae_rmssd = float(d['rmssd'].abs().mean())
        seg_rmssd = prv['rmssd'].to_dict()
        seg_ibi = prv['mean_ibi'].to_dict()
    return {'low': low, 'high': high, 'beats': beats, 'feats': df_feats, 'mae_ibi': mae_ibi,
            'mae_rmssd': mae_rmssd, 'seg_rmssd': seg_rmssd, 'seg_ibi': seg_ibi}


def match_f1(ppg_t, ecg_t, tol=0.15):
    """Beat-location F1 with nearest-neighbour matching (no lag search; lag applied beforehand)."""
    if len(ppg_t) == 0 or len(ecg_t) == 0:
        return 0.0
    used = set()
    correct = 0
    for t in ppg_t:
        j = int(np.argmin(np.abs(ecg_t - t)))
        if abs(ecg_t[j] - t) <= tol and j not in used:
            used.add(j)
            correct += 1
    se = correct / len(ecg_t)
    ppv = correct / len(ppg_t)
    return 0.0 if se + ppv == 0 else 2 * se * ppv / (se + ppv)


def best_lag(ppg_t, ecg_t):
    lags = np.arange(-2.0, 2.0001, 0.02)
    scores = [match_f1(ppg_t + lag, ecg_t) for lag in lags]
    return float(lags[int(np.argmax(scores))])


def f1_per_minute(ppg_t, ecg_t, dur, tol=0.15):
    """Beat F1 over the task with the PPG-ECG lag re-estimated per minute (absorbs clock drift)."""
    lags = np.arange(-2.0, 2.0001, 0.02)
    n_corr = n_ppg = n_ecg = 0
    for s0 in np.arange(0, dur - 30, 60.0):
        e = ecg_t[(ecg_t >= s0) & (ecg_t < s0 + 60)]
        p = ppg_t[(ppg_t >= s0) & (ppg_t < s0 + 60)]
        n_ppg += len(p); n_ecg += len(e)
        if len(p) == 0 or len(e) == 0:
            continue
        best = 0
        for lag in lags:
            q = p + lag
            j = np.clip(np.searchsorted(e, q), 1, len(e) - 1)
            nearest = np.where(np.abs(e[j - 1] - q) <= np.abs(e[j] - q), j - 1, j)
            ok = np.abs(e[nearest] - q) <= tol
            best = max(best, len(np.unique(nearest[ok])))
        n_corr += best
    if n_ppg == 0 or n_ecg == 0:
        return 0.0
    se, ppv = n_corr / n_ecg, n_corr / n_ppg
    return 0.0 if se + ppv == 0 else 200 * se * ppv / (se + ppv)


def main():
    os.makedirs(OUT, exist_ok=True)
    signals = load_signals()

    clf_clean = xgb.XGBClassifier(); clf_clean.load_model(f'{MODEL_DIR}/251007_step1_xgboost/step1_xgb_clean_{UID}.json')
    clf_cleanable = xgb.XGBClassifier(); clf_cleanable.load_model(f'{MODEL_DIR}/251007_step1_xgboost/step1_xgb_cleanable_{UID}.json')
    th_clean = float(open(f'{MODEL_DIR}/251007_step1_xgboost/best_thresh_clean.txt').read().strip())
    th_cleanable = float(open(f'{MODEL_DIR}/251007_step1_xgboost/best_thresh_cleanable.txt').read().strip())
    reg = xgb.XGBRegressor(); reg.load_model(f'{MODEL_DIR}/251007_step2_predict_quality_score/step2_xgb_{UID}.json')

    gt = pd.read_csv(GT_CSV)
    gt = gt[gt['id'] == UID]

    # Filter coefficients for client-side zero-phase filtering (scipy.signal.sosfiltfilt equivalent).
    filt_out = []
    for low, high in CFGS:
        sos = cheby2(4, 20, Wn=[low / (FS / 2), high / (FS / 2)], btype='bandpass', output='sos')
        zi = sosfilt_zi(sos)
        filt_out.append({'low': low, 'high': high, 'sos': np.round(sos, 12).tolist(), 'zi': np.round(zi, 12).tolist()})
    with open(f'{OUT}/filters.json', 'w') as f:
        json.dump({'fs': FS, 'filters': filt_out}, f, separators=(',', ':'))

    summary = {}
    for task in TASKS:
        t_start = time.time()
        ppg = signals[task]['PPG']
        df_mims = signals[task]['MIMS']
        ecg = signals[task]['ECG'].copy()
        ecg['RR'] = ecg['RR'] * 1000
        t0 = ppg.rawdata['Timestamp'].iloc[0]
        n = len(ppg.rawdata)
        ecg_t = (ecg['Timestamp'] - t0).dt.total_seconds().to_numpy()
        ecg_t = ecg_t[(ecg_t >= 0) & (ecg_t <= n / FS)]
        hrv = per_seg_prv(ecg[['Timestamp', 'RR']], 'RR')

        segments = get_segments(df=ppg.rawdata, seg_size=SEG, step_size=SEG)
        default_features = get_features_from_default_per_seg(ppg=copy.deepcopy(ppg), fs_ppg=FS, segments=segments,
                                                             low=0.5, high=4.0, beat_detection_method='heartview')

        results = Parallel(n_jobs=-1)(delayed(eval_filter)(ppg, df_mims, default_features, segments, hrv, low, high)
                                      for low, high in CFGS)
        res = {(r['low'], r['high']): r for r in results}
        print(task, 'filters done', round(time.time() - t_start), 's', flush=True)

        # Step 1: gating with default-filtered segment features.
        dfd = res[(0.5, 4.0)]['feats']
        X1 = dfd[FEATURE_ORDER + ACC_ORDER]
        p_clean = clf_clean.predict_proba(X1)[:, 1]
        p_cleanable = clf_cleanable.predict_proba(X1)[:, 1]
        seg_info = []
        gated = []
        for k, s in enumerate(dfd['seg'].tolist()):
            is_clean = p_clean[k] >= th_clean
            is_cleanable = p_cleanable[k] >= th_cleanable
            label = 'clean' if is_clean else ('cleanable' if is_cleanable else 'uncleanable')
            if is_clean or is_cleanable:
                gated.append(s)
            seg = segments[s]
            seg_info.append({'seg': int(s), 'start': round((seg['start'] - t0).total_seconds(), 2),
                             'end': round((seg['end'] - t0).total_seconds(), 2),
                             'p_clean': round(float(p_clean[k]), 3), 'p_cleanable': round(float(p_cleanable[k]), 3),
                             'label': label})

        # Step 2: model-estimated quality for every filter, averaged over gated segments.
        order2 = ['included_freq_range'] + FEATURE_ORDER + ACC_ORDER
        model_q = {}
        for key, r in res.items():
            df = r['feats']
            df = df[df['seg'].isin(gated)] if not df.empty else df
            if df.empty:
                model_q[key] = None
                continue
            mean = df[order2].mean(numeric_only=True).to_frame().T[order2]
            model_q[key] = float(reg.predict(mean)[0])

        # Optuna search over the precomputed model scores (TPE, seed 42, patience 20, cap 100 — as in the paper).
        optuna.logging.set_verbosity(optuna.logging.WARNING)
        sampler = optuna.samplers.TPESampler(multivariate=True, n_startup_trials=6, seed=42)
        study = optuna.create_study(direction='minimize', sampler=sampler)
        study.enqueue_trial({'f_low': 0.5, 'f_high': 4.0})
        trials = []

        def objective(trial):
            low = round(trial.suggest_float('f_low', 0.4, 1.7, step=0.1), 1)
            high = round(trial.suggest_float('f_high', 1.2, 5.0, step=0.1), 1)
            if low >= high:
                raise optuna.TrialPruned()
            q = model_q.get((low, high))
            trials.append([low, high, None if q is None else round(q, 2)])
            return float('inf') if q is None else -q

        state = {'n': 0}

        def early_stop(study, trial):
            if trial.state != optuna.trial.TrialState.COMPLETE:
                return
            state['n'] = 0 if study.best_trial.number == trial.number else state['n'] + 1
            if state['n'] >= 20:
                study.stop()

        study.optimize(objective, n_trials=100, callbacks=[early_stop])
        opt = (round(study.best_params['f_low'], 1), round(study.best_params['f_high'], 1))
        full_best = max((k for k in model_q if model_q[k] is not None), key=lambda k: model_q[k])

        # Ground-truth quality score / F1 from the paper's labeling.
        gtt = gt[gt['task'] == task]
        gt_map = {(round(r.lowcut, 1), round(r.highcut, 1)): (r.quality_score, r.f1_score_150) for r in gtt.itertuples()}

        # Lag (PPG vs ECG clock) estimated with the optimized filter over the whole task.
        opt_t = res[opt]['beats'] / FS
        lag = best_lag(opt_t, ecg_t)

        # Pick a 30 s excerpt where the default filter misbehaves and the optimized one doesn't.
        win = 30
        best_score, ex_start = -1e9, 0.0
        def_t = res[(0.5, 4.0)]['beats'] / FS + lag
        opt_tl = opt_t + lag
        for s0 in np.arange(0, n / FS - win, 5.0):
            e = ecg_t[(ecg_t >= s0) & (ecg_t < s0 + win)]
            d = def_t[(def_t >= s0) & (def_t < s0 + win)]
            o = opt_tl[(opt_tl >= s0) & (opt_tl < s0 + win)]
            sc = match_f1(o, e) - match_f1(d, e)
            if sc > best_score:
                best_score, ex_start = sc, float(s0)
        i0, i1 = int(ex_start * FS), int((ex_start + win) * FS)
        # Refine the lag locally so ECG ticks line up within the excerpt despite clock drift.
        e_win = ecg_t[(ecg_t >= ex_start - 3) & (ecg_t < ex_start + win + 3)]
        o_win = opt_t[(opt_t >= ex_start - lag) & (opt_t < ex_start + win - lag)]
        lag_ex = best_lag(o_win, e_win)

        filters = []
        for low, high in CFGS:
            r = res[(low, high)]
            b = r['beats']
            bx = b[(b >= i0) & (b < i1)] - i0
            gq, gf1 = gt_map.get((low, high), (None, None))
            gf1 = f1_per_minute(b / FS, ecg_t, n / FS)
            filters.append({
                'q_gt': None if gq is None or pd.isna(gq) else round(float(gq), 2),
                'f1': None if gf1 is None or pd.isna(gf1) else round(float(gf1), 2),
                'mae_ibi': None if pd.isna(r['mae_ibi']) else round(r['mae_ibi'], 2),
                'mae_rmssd': None if pd.isna(r['mae_rmssd']) else round(r['mae_rmssd'], 2),
                'q_model': None if model_q[(low, high)] is None else round(model_q[(low, high)], 2),
                'seg_rmssd': [None if pd.isna(r['seg_rmssd'].get(s)) else round(float(r['seg_rmssd'][s]), 1)
                              for s in range(len(segments))],
                'beats_ex': np.diff(np.concatenate([[0], bx])).astype(int).tolist(),
                'n_beats': int(len(b)),
            })

        ecg_seg_rmssd = [None if hrv is None or pd.isna(hrv['rmssd'].get(s, np.nan)) else round(float(hrv['rmssd'][s]), 1)
                         for s in range(len(segments))]
        ecg_ex = ecg_t - lag_ex
        ecg_ex = ecg_ex[(ecg_ex >= ex_start) & (ecg_ex < ex_start + win)] - ex_start

        bvp = ppg.rawdata['BVP'].to_numpy()
        out = {
            'task': task, 'fs': FS, 'duration': round(n / FS, 2), 't0': str(t0), 'lag': round(lag, 3), 'lag_excerpt': round(lag_ex, 3),
            'bvp': np.round(bvp, 1).tolist(),
            'ecg_beats': np.round(ecg_t - lag, 3).tolist(),
            'ecg_seg_rmssd': ecg_seg_rmssd,
            'segments': seg_info,
            'excerpt': {'start': ex_start, 'len': win, 'ecg': np.round(ecg_ex, 3).tolist()},
            'optuna': {'trials': trials, 'best': list(opt), 'n_trials': len(trials)},
            'full_best': list(full_best),
            'filters': filters,
        }
        with open(f'{OUT}/u007_{task}.json', 'w') as f:
            json.dump(out, f, separators=(',', ':'))

        def_m = res[(0.5, 4.0)]
        summary[task] = {
            'default': {'mae_ibi': def_m['mae_ibi'], 'mae_rmssd': def_m['mae_rmssd'], 'q_gt': gt_map[(0.5, 4.0)][0]},
            'optuna': {'cfg': opt, 'mae_ibi': res[opt]['mae_ibi'], 'mae_rmssd': res[opt]['mae_rmssd'], 'q_gt': gt_map[opt][0], 'n_trials': len(trials)},
            'full': {'cfg': full_best, 'mae_ibi': res[full_best]['mae_ibi'], 'mae_rmssd': res[full_best]['mae_rmssd']},
            'gt_best': max(gt_map, key=lambda k: gt_map[k][0]),
            'segments': [s['label'] for s in seg_info], 'lag': lag, 'excerpt': ex_start,
        }
        print(task, json.dumps(summary[task], default=str), round(time.time() - t_start), 's', flush=True)

    with open(f'{OUT}/summary.json', 'w') as f:
        json.dump(summary, f, indent=1, default=str)


if __name__ == '__main__':
    main()
