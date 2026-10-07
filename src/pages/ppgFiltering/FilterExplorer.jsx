import React, { useEffect, useMemo, useRef, useState } from "react";
import Heatmap from "./Heatmap";
import TaskTabs from "./TaskTabs";
import Term from "./Term";
import { CFGS, FIXED, cfgIndex, excerptBeats, fmtHz, quantile, rampColor, RAMP_CSS, useTaskData } from "./data";
import { sosfiltfilt } from "./dsp";

const METRICS = {
  q_gt: {
    label: "Filter quality Q",
    short: "Q",
    unit: "",
    better: "up",
    digits: 1,
    help: "Ground-truth filter quality score (Sec. 5.3.1): combines beat F1, IBI, RMSSD and pulse-timing errors vs. ECG.",
  },
  mae_rmssd: {
    label: "RMSSD error",
    short: "MAE RMSSD",
    unit: "ms",
    better: "down",
    digits: 1,
    help: "Mean absolute error of per-minute RMSSD vs. ECG.",
  },
  mae_ibi: {
    label: "IBI error",
    short: "MAE IBI",
    unit: "ms",
    better: "down",
    digits: 1,
    help: "Mean absolute error of per-minute mean IBI vs. ECG.",
  },
};

const COLORS = { fixed: "var(--fixed)", ours: "var(--accent)", other: "var(--other)" };

function roleOf(i, fixedIdx, oursIdx) {
  if (i === oursIdx) return "ours";
  if (i === fixedIdx) return "fixed";
  return "other";
}

export default function FilterExplorer({ task, setTask }) {
  const { data, bank, error } = useTaskData(task);
  const [metric, setMetric] = useState("q_gt");
  const [sel, setSel] = useState(null);
  const [hover, setHover] = useState(null);

  const fixedIdx = cfgIndex(...FIXED);
  const oursIdx = data ? cfgIndex(...data.optuna.best) : null;
  useEffect(() => {
    if (data) setSel(cfgIndex(...data.optuna.best));
  }, [data]);

  const scale = useMemo(() => {
    if (!data) return null;
    const vals = data.filters.map((f) => f[metric]);
    const m = METRICS[metric];
    const lo = m.better === "up" ? quantile(vals, 0.05) : quantile(vals, 0);
    const hi = m.better === "up" ? quantile(vals, 1) : quantile(vals, 0.9);
    return {
      lo,
      hi,
      t: (v) => (v == null ? null : m.better === "up" ? (v - lo) / (hi - lo || 1) : 1 - (v - lo) / (hi - lo || 1)),
    };
  }, [data, metric]);

  if (error) return <div className="ppgf-demo ppgf-loading">Could not load demo data.</div>;

  const ready = data && bank && sel != null;
  const role = ready ? roleOf(sel, fixedIdx, oursIdx) : "other";
  const selColor = COLORS[role];

  return (
    <div className="ppgf-demo" id="demo-explorer">
      <div className="ppgf-demo-head">
        <div>
          <div className="ppgf-demo-title">Try every filter</div>
          <div className="ppgf-demo-sub">
            Each cell is one of the 525 band-pass filters we searched. Click a cell (or use the arrow keys) to re-filter
            the wrist PPG in your browser and compare the detected beats with ECG.
          </div>
        </div>
        <TaskTabs task={task} setTask={setTask} />
      </div>

      <ol className="ppgf-guide">
        <li>
          Each square is one filter: its high <Term k="cutoff">cut-off</Term> runs left to right and its low cut-off
          bottom to top.
        </li>
        <li>
          Darker squares agree better with ECG. The <b style={{ color: "var(--fixed)" }}>orange ring</b> is the common
          fixed filter; the <b style={{ color: "var(--accent)" }}>teal ring</b> is what our model picked without ECG.
        </li>
        <li>
          Click a square. In the waveform below, the gray lines are true heartbeats from ECG, and each detected dot
          should sit on one.
        </li>
      </ol>

      {!ready ? (
        <div className="ppgf-loading">Loading signals…</div>
      ) : (
        <div className="ppgf-explorer">
          <div>
            <div className="ppgf-controls" style={{ justifyContent: "space-between", marginBottom: 6 }}>
              <div className="ppgf-controls">
                <span className="ppgf-label">Color by</span>
                <div className="ppgf-seg" role="group" aria-label="Heatmap metric">
                  {Object.entries(METRICS).map(([k, m]) => (
                    <button key={k} aria-pressed={metric === k} onClick={() => setMetric(k)} title={m.help}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ppgf-controls">
                <span className="ppgf-label">Jump to</span>
                <button className="ppgf-chip" aria-pressed={sel === fixedIdx} onClick={() => setSel(fixedIdx)}>
                  <span className="ppgf-swatch ring" style={{ color: "var(--fixed)" }} /> Fixed 0.5–4.0 Hz
                </button>
                <button className="ppgf-chip" aria-pressed={sel === oursIdx} onClick={() => setSel(oursIdx)}>
                  <span className="ppgf-swatch ring" style={{ color: "var(--accent)" }} /> Our model's pick
                </button>
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <Heatmap
                ariaLabel={`Heatmap of ${METRICS[metric].label} for all 525 filters`}
                fill={(i) => {
                  const v = data.filters[i][metric];
                  return v == null ? null : rampColor(scale.t(v));
                }}
                selected={sel}
                onSelect={setSel}
                onHover={setHover}
                markers={[
                  { cfg: FIXED, color: "var(--fixed)", label: "fixed" },
                  { cfg: data.optuna.best, color: "var(--accent)", label: "ours" },
                ]}
              />
              {hover && <HeatTip hover={hover} f={data.filters[hover.i]} />}
            </div>
            {metric === "mae_rmssd" && (
              <div className="ppgf-callout" style={{ marginTop: 6 }}>
                Notice the dark band at the top: very narrow, high passbands turn the PPG into a near-sinusoid, so RMSSD
                error looks small even though individual beat timings are wrong. This over-filtering is why the paper's
                quality score Q also accounts for beat timing and IBI errors.
              </div>
            )}
            <div className="ppgf-legend" style={{ marginTop: 4 }}>
              <span>
                {METRICS[metric].better === "up" ? "lower" : "higher"} {METRICS[metric].short}
                <i className="ppgf-ramp" style={{ background: RAMP_CSS }} />
                better
              </span>
              <span>
                <i className="ppgf-swatch ring" style={{ color: "var(--fixed)" }} /> Fixed filter
              </span>
              <span>
                <i className="ppgf-swatch ring" style={{ color: "var(--accent)" }} /> Model's pick (no ECG used)
              </span>
            </div>
          </div>

          <Readout data={data} sel={sel} fixedIdx={fixedIdx} />

          <SignalPanels data={data} bank={bank} sel={sel} color={selColor} role={role} />
        </div>
      )}
    </div>
  );
}

function HeatTip({ hover, f }) {
  const [l, h] = CFGS[hover.i];
  const left = Math.min(hover.x + 14, hover.w - 190);
  const fmt = (v, d = 1) => (v == null ? "–" : v.toFixed(d));
  return (
    <div className="ppgf-tooltip" style={{ left, top: hover.y + 14 }}>
      <b>{fmtHz([l, h])}</b>
      <br />
      Quality Q {fmt(f.q_gt)}
      <br />
      RMSSD err {fmt(f.mae_rmssd)} ms
      <br />
      IBI err {fmt(f.mae_ibi)} ms
    </div>
  );
}

function Readout({ data, sel, fixedIdx }) {
  const f = data.filters[sel];
  const base = data.filters[fixedIdx];
  const items = ["q_gt", "mae_rmssd", "mae_ibi"].map((k) => {
    const m = METRICS[k];
    const v = f[k];
    const b = base[k];
    let delta = null;
    let cls = "";
    if (v != null && b != null && sel !== fixedIdx) {
      const d = v - b;
      const good = m.better === "up" ? d > 0 : d < 0;
      cls = Math.abs(d) < 1e-9 ? "" : good ? "good" : "bad";
      delta = `${d > 0 ? "+" : "−"}${Math.abs(d).toFixed(m.digits)}${m.unit ? ` ${m.unit}` : ""} vs. fixed`;
    }
    return { k, m, v, delta, cls };
  });
  return (
    <div>
      <div className="ppgf-panel-title">
        <span>Whole-task accuracy with {fmtHz(CFGS[sel])}</span>
        <span className="note">computed against ECG over the full task, 1-min windows</span>
      </div>
      <div className="ppgf-readout">
        {items.map(({ k, m, v, delta, cls }) => (
          <div className="ppgf-metric" key={k} title={m.help}>
            <div className="k">{m.label}</div>
            <div className="v">
              {v == null ? "–" : v.toFixed(m.digits)} {m.unit && <small>{m.unit}</small>}
            </div>
            <div className={`d ${cls}`}>{delta ?? (sel === fixedIdx ? "baseline" : " ")}</div>
          </div>
        ))}
      </div>
      <p className="ppgf-note">
        Errors are computed <b>after removing artifactual beats</b>. The fixed filter still falls short.
      </p>
    </div>
  );
}

/* ---------- waveform + IBI ---------- */

// FLIRT-style artifact rule, as used for all IBI/RMSSD numbers in the paper (heartview_dev
// dataprocessing.__clean_artifacts_flirt, threshold 0.2): drop an IBI if it differs from the previous
// (uncleaned) IBI by more than 20% of itself, then drop IBIs outside 250–2000 ms.
function markArtifacts(pts) {
  return pts.map((p, i) => ({
    ...p,
    bad: (i > 0 && Math.abs(p.v - pts[i - 1].v) > 0.2 * p.v) || p.v < 250 || p.v > 2000,
  }));
}

// RMSSD over the cleaned IBI list (successive differences of the remaining IBIs, as in the paper's code).
function cleanRmssd(pts) {
  const v = pts.filter((p) => !p.bad).map((p) => p.v);
  if (v.length < 3) return null;
  let s = 0;
  for (let i = 1; i < v.length; i++) s += (v[i] - v[i - 1]) ** 2;
  return Math.sqrt(s / (v.length - 1));
}

const PW = 760;
const PM = { l: 46, r: 10 };

function SignalPanels({ data, bank, sel, color, role }) {
  const fs = data.fs;
  const ex = data.excerpt;
  const i0 = Math.round(ex.start * fs);
  const n = Math.round(ex.len * fs);
  const [cross, setCross] = useState(null);
  const ibiRef = useRef(null);

  const bvp = useMemo(() => Float64Array.from(data.bvp), [data]);
  const filtered = useMemo(() => {
    const fb = bank.filters[sel];
    return sosfiltfilt(fb.sos, fb.zi, bvp).subarray(i0, i0 + n);
  }, [bank, sel, bvp, i0, n]);

  const raw = bvp.subarray(i0, i0 + n);
  const beats = excerptBeats(data.filters[sel]).filter((b) => b < n);
  const ecg = ex.ecg;

  const x = (t) => PM.l + (t / ex.len) * (PW - PM.l - PM.r);
  const lane = (arr, top, h) => {
    let mean = 0;
    for (const v of arr) mean += v;
    mean /= arr.length;
    let sd = 0;
    for (const v of arr) sd += (v - mean) ** 2;
    sd = Math.sqrt(sd / arr.length) || 1;
    const y = (v) => top + h / 2 - Math.max(-3.2, Math.min(3.2, (v - mean) / sd)) * (h / 6.6);
    let d = "";
    for (let i = 0; i < arr.length; i++) d += `${i ? "L" : "M"}${x(i / fs).toFixed(1)} ${y(arr[i]).toFixed(1)}`;
    return { d, y };
  };
  const rawLane = lane(raw, 18, 70);
  const filtLane = lane(filtered, 100, 96);
  const WH = 206;

  // IBIs (ms) at the time of the second beat
  const ppgT = beats.map((b) => b / fs);
  const ppgIbi = markArtifacts(ppgT.slice(1).map((t, k) => ({ t, v: (t - ppgT[k]) * 1000 })));
  const ecgIbi = markArtifacts(ecg.slice(1).map((t, k) => ({ t, v: (t - ecg[k]) * 1000 })));
  const yMin = 300;
  const yMax = 1600;
  const IH = 150;
  const iy = (v) => 10 + (1 - (Math.max(yMin, Math.min(yMax, v)) - yMin) / (yMax - yMin)) * (IH - 34);
  const path = (pts) => pts.map((p, k) => `${k ? "L" : "M"}${x(p.t).toFixed(1)} ${iy(p.v).toFixed(1)}`).join("");

  const rPPG = cleanRmssd(ppgIbi);
  const rECG = cleanRmssd(ecgIbi);

  const onMove = (e) => {
    const box = ibiRef.current.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * PW;
    const t = ((px - PM.l) / (PW - PM.l - PM.r)) * ex.len;
    if (t < 0 || t > ex.len) return setCross(null);
    const near = (pts) => pts.reduce((a, p) => (a == null || Math.abs(p.t - t) < Math.abs(a.t - t) ? p : a), null);
    setCross({ t, px: e.clientX - box.left, w: box.width, ppg: near(ppgIbi), ecg: near(ecgIbi) });
  };

  const ticks = [0, 5, 10, 15, 20, 25, 30];
  const roleName = role === "ours" ? "model's pick" : role === "fixed" ? "fixed filter" : "selected filter";

  return (
    <div>
      <div className="ppgf-panel-title">
        <span>
          30-s excerpt ({Math.floor(ex.start / 60)}:{String(Math.round(ex.start % 60)).padStart(2, "0")} into the task)
          · {fmtHz(CFGS[sel])}
        </span>
        <span className="note">
          {beats.length} PPG beats vs. {ecg.length} ECG beats in view
        </span>
      </div>
      <div className="ppgf-scroll">
        <svg
          className="ppgf-svg"
          viewBox={`0 0 ${PW} ${WH}`}
          aria-label="Raw and filtered PPG with detected beats and ECG beats"
        >
          {ecg.map((t, k) => (
            <line
              key={k}
              x1={x(t)}
              x2={x(t)}
              y1={14}
              y2={WH - 12}
              stroke="var(--ecg)"
              strokeOpacity="0.28"
              strokeWidth="1.2"
            />
          ))}
          <text x={4} y={56} fontSize="11">
            Raw
          </text>
          <text x={4} y={152} fontSize="11">
            Filtered
          </text>
          <path d={rawLane.d} fill="none" stroke="#9c9893" strokeWidth="1" />
          <path d={filtLane.d} fill="none" stroke={color} strokeWidth="1.6" />
          {beats.map((b) => (
            <circle
              key={b}
              cx={x(b / fs)}
              cy={filtLane.y(filtered[b])}
              r={4.5}
              fill={color}
              stroke="#fff"
              strokeWidth="1.5"
            />
          ))}
          {ticks.map((t) => (
            <text key={t} x={x(t)} y={WH} fontSize="11" textAnchor="middle">
              {t}s
            </text>
          ))}
        </svg>
      </div>
      <div className="ppgf-legend" style={{ margin: "2px 0 10px" }}>
        <span>
          <i className="ppgf-swatch tick" style={{ background: "var(--ecg)", opacity: 0.5 }} /> ECG beat (ground truth)
        </span>
        <span>
          <i className="ppgf-swatch" style={{ background: color }} /> PPG beat detected after filtering ({roleName})
        </span>
      </div>

      <div className="ppgf-panel-title">
        <span>Inter-beat intervals in the excerpt</span>
        <span className="note">
          RMSSD in this excerpt: PPG {rPPG == null ? "–" : rPPG.toFixed(0)} ms vs. ECG{" "}
          {rECG == null ? "–" : rECG.toFixed(0)} ms
        </span>
      </div>
      <div style={{ position: "relative" }}>
        <div className="ppgf-scroll">
          <svg
            ref={ibiRef}
            className="ppgf-svg"
            viewBox={`0 0 ${PW} ${IH}`}
            onMouseMove={onMove}
            onMouseLeave={() => setCross(null)}
            aria-label="Inter-beat interval series from PPG and ECG"
          >
            {[400, 800, 1200, 1600].map((v) => (
              <g key={v}>
                <line className="gridline" x1={PM.l} x2={PW - PM.r} y1={iy(v)} y2={iy(v)} />
                <text x={PM.l - 6} y={iy(v) + 4} fontSize="11" textAnchor="end">
                  {v}
                </text>
              </g>
            ))}
            <text transform={`translate(12 ${(IH - 24) / 2}) rotate(-90)`} fontSize="11" textAnchor="middle">
              IBI (ms)
            </text>
            <path d={path(ecgIbi)} fill="none" stroke="var(--ecg)" strokeWidth="2" strokeDasharray="5 3" />
            <path d={path(ppgIbi)} fill="none" stroke={color} strokeWidth="2" />
            {ppgIbi.map((p, k) =>
              p.bad ? (
                <circle key={k} cx={x(p.t)} cy={iy(p.v)} r={4} fill="#fff" stroke={color} strokeWidth="1.8" />
              ) : (
                <circle key={k} cx={x(p.t)} cy={iy(p.v)} r={3} fill={color} stroke="#fff" strokeWidth="1" />
              ),
            )}
            {ticks.map((t) => (
              <text key={t} x={x(t)} y={IH - 4} fontSize="11" textAnchor="middle">
                {t}s
              </text>
            ))}
            {cross && <line x1={x(cross.t)} x2={x(cross.t)} y1={8} y2={IH - 24} stroke="#111" strokeOpacity="0.4" />}
          </svg>
        </div>
        {cross && (
          <div className="ppgf-tooltip" style={{ left: Math.min(cross.px + 12, cross.w - 170), top: 6 }}>
            <b>{cross.t.toFixed(1)} s</b>
            <br />
            ECG IBI {cross.ecg ? cross.ecg.v.toFixed(0) : "–"} ms
            <br />
            PPG IBI {cross.ppg ? cross.ppg.v.toFixed(0) : "–"} ms
          </div>
        )}
      </div>
      <div className="ppgf-legend">
        <span>
          <i className="ppgf-swatch line" style={{ background: "var(--ecg)" }} /> ECG (dashed)
        </span>
        <span>
          <i className="ppgf-swatch line" style={{ background: color }} /> PPG
        </span>
        <span>
          <i className="ppgf-swatch ring" style={{ color }} /> removed as an artifact (changes by &gt;20% from the
          previous IBI, or outside 250–2000 ms), as in the paper
        </span>
        <span style={{ color: "var(--ink-3)" }}>
          Missed or doubled beats show up as spikes and dips. The ones that survive artifact removal still inflate
          RMSSD.
        </span>
      </div>
    </div>
  );
}
