import React, { useEffect, useMemo, useRef, useState } from "react";
import Heatmap from "./Heatmap";
import TaskTabs from "./TaskTabs";
import PipelineDiagram from "./PipelineDiagram";
import Term from "./Term";
import { CFGS, FIXED, cfgIndex, fmtHz, quantile, rampColor, RAMP_CSS, useTaskData } from "./data";
import { sosfiltfilt } from "./dsp";

export default function PipelineDemo({ task, setTask }) {
  const { data, bank, error } = useTaskData(task);
  // Optional deep link, e.g. #/ppg-filtering?step=2
  const [step, setStep] = useState(() => {
    const q = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
    const v = Number(q.get("step"));
    return v >= 1 && v <= 3 ? v - 1 : 0;
  });

  return (
    <div className="ppgf-demo" id="demo-pipeline">
      <div className="ppgf-demo-head">
        <div>
          <div className="ppgf-demo-title">Walk through the pipeline</div>
          <div className="ppgf-demo-sub">
            Here the models choose a filter from the PPG alone, with no ECG. They were trained without this participant
            (<Term k="loso">leave-one-subject-out</Term>), so this is a held-out prediction.
          </div>
        </div>
        <TaskTabs task={task} setTask={setTask} />
      </div>

      <PipelineDiagram step={step} setStep={setStep} />
      <div className="ppgf-diagram-hint">Click a step to see it run on the data below.</div>

      {error && <div className="ppgf-loading">Could not load demo data.</div>}
      {!data || !bank ? (
        !error && <div className="ppgf-loading">Loading signals…</div>
      ) : step === 0 ? (
        <GateStep data={data} bank={bank} />
      ) : step === 1 ? (
        <SearchStep data={data} key={task} />
      ) : (
        <ApplyStep data={data} />
      )}
    </div>
  );
}

/* ---------- Step 1 ---------- */

const GATE = {
  clean: { color: "#0a6f8a", text: "#fff", name: "Clean", desc: "already fine with the default filter" },
  cleanable: { color: "#a9d3de", text: "#0b3d4a", name: "Cleanable", desc: "a better filter can fix it" },
  uncleanable: { color: "#d9d5cf", text: "#4a4743", name: "Uncleanable", desc: "excluded from the search" },
};

function GateStep({ data, bank }) {
  const W = 760;
  const L = 46;
  const R = 10;
  const [tip, setTip] = useState(null);
  const ref = useRef(null);
  const dur = data.duration;
  const x = (t) => L + (t / dur) * (W - L - R);

  const env = useMemo(() => {
    const fb = bank.filters[cfgIndex(...FIXED)];
    const y = sosfiltfilt(fb.sos, fb.zi, Float64Array.from(data.bvp));
    const cols = 380;
    const per = Math.ceil(y.length / cols);
    const out = [];
    let lo = Infinity;
    let hi = -Infinity;
    const all = [];
    for (let c = 0; c < cols; c++) {
      let mn = Infinity;
      let mx = -Infinity;
      for (let i = c * per; i < Math.min(y.length, (c + 1) * per); i++) {
        if (y[i] < mn) mn = y[i];
        if (y[i] > mx) mx = y[i];
      }
      if (mn === Infinity) break;
      out.push([mn, mx]);
      all.push(mn, mx);
    }
    lo = quantile(all, 0.01);
    hi = quantile(all, 0.99);
    return { out, lo, hi, per };
  }, [data, bank]);

  const ey = (v) => 12 + (1 - (Math.max(env.lo, Math.min(env.hi, v)) - env.lo) / (env.hi - env.lo || 1)) * 90;
  let top = "";
  let bot = "";
  env.out.forEach(([mn, mx], c) => {
    const t = (c * env.per) / data.fs;
    top += `${c ? "L" : "M"}${x(t).toFixed(1)} ${ey(mx).toFixed(1)}`;
    bot = `L${x(t).toFixed(1)} ${ey(mn).toFixed(1)}` + bot;
  });

  const counts = { clean: 0, cleanable: 0, uncleanable: 0 };
  data.segments.forEach((s) => counts[s.label]++);
  const H = 190;
  const minutes = Array.from({ length: Math.floor(dur / 60) + 1 }, (_, i) => i * 60).filter((t) => t <= dur);

  return (
    <div>
      <div className="ppgf-panel-title">
        <span>Default-filtered (0.5–4.0 Hz) PPG for the whole task, with the segment-quality model's verdicts</span>
        <span className="note">hover a segment for its probabilities</span>
      </div>
      <div style={{ position: "relative" }}>
        <div className="ppgf-scroll">
          <svg ref={ref} className="ppgf-svg" viewBox={`0 0 ${W} ${H}`} onMouseLeave={() => setTip(null)}>
            <path d={`${top}${bot}Z`} fill="var(--fixed)" fillOpacity="0.55" stroke="var(--fixed)" strokeWidth="0.6" />
            <text x={4} y={60} fontSize="11">
              PPG
            </text>
            {data.segments.map((s) => {
              const g = GATE[s.label];
              const w = x(s.end) - x(s.start);
              return (
                <g
                  key={s.seg}
                  onMouseMove={(e) => {
                    const box = ref.current.getBoundingClientRect();
                    setTip({ s, px: e.clientX - box.left, py: e.clientY - box.top, w: box.width });
                  }}
                  style={{ cursor: "default" }}
                >
                  <rect x={x(s.start) + 1} y={116} width={w - 2} height={40} rx={4} fill={g.color} />
                  {s.label === "uncleanable" && (
                    <path
                      d={Array.from(
                        { length: Math.ceil(w / 8) + 6 },
                        (_, k) => `M${x(s.start) + k * 8 - 40} 156 l40 -40`,
                      ).join("")}
                      stroke="#b3ada5"
                      strokeWidth="1"
                      clipPath={`url(#clip-${s.seg})`}
                    />
                  )}
                  <clipPath id={`clip-${s.seg}`}>
                    <rect x={x(s.start) + 1} y={116} width={w - 2} height={40} rx={4} />
                  </clipPath>
                  {w > 44 && (
                    <text x={x(s.start) + w / 2} y={140} fontSize="11" textAnchor="middle" style={{ fill: g.text }}>
                      {g.name}
                    </text>
                  )}
                  <rect x={x(s.start)} y={8} width={w} height={150} fill="transparent" />
                </g>
              );
            })}
            {minutes.map((t) => (
              <text key={t} x={x(t)} y={H - 14} fontSize="11" textAnchor="middle">
                {t / 60} min
              </text>
            ))}
          </svg>
        </div>
        {tip && (
          <div className="ppgf-tooltip" style={{ left: Math.min(tip.px + 12, tip.w - 200), top: tip.py + 12 }}>
            <b>
              Minute {tip.s.seg + 1}: {GATE[tip.s.label].name}
            </b>
            <br />
            P(clean) {tip.s.p_clean.toFixed(2)} · P(cleanable) {tip.s.p_cleanable.toFixed(2)}
          </div>
        )}
      </div>
      <div className="ppgf-legend ppgf-gate-legend">
        {Object.entries(GATE).map(([k, g]) => (
          <span key={k}>
            <i className="ppgf-swatch" style={{ background: g.color }} /> {g.name}: {g.desc} ({counts[k]})
          </span>
        ))}
      </div>
      <div className="ppgf-callout">
        Even in a seated task, most minutes come out as <em>cleanable</em> rather than clean: the default filter is
        leaving errors on the table. Segments shorter than a minute at the end of the task are not scored. Uncleanable
        segments are left out of the filter search so they can't skew it, but the winning filter is still applied to
        them in step 3.
      </div>
    </div>
  );
}

/* ---------- Step 2 ---------- */

function SearchStep({ data }) {
  const trials = data.optuna.trials;
  const [k, setK] = useState(trials.length);
  const [playing, setPlaying] = useState(false);
  const [showLand, setShowLand] = useState(true);
  const { cx, cy, CW, CH } = Heatmap.geometry;

  useEffect(() => {
    if (!playing) return;
    if (k >= trials.length) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setK((v) => v + 1), 260);
    return () => clearTimeout(id);
  }, [playing, k, trials.length]);

  const play = () => {
    if (k >= trials.length) setK(0);
    setPlaying(true);
  };

  const shown = trials.slice(0, k);
  let best = null;
  const bestSeries = [];
  shown.forEach((t, i) => {
    if (t[2] != null && (best == null || t[2] > best[2])) best = t;
    bestSeries.push(best ? best[2] : null);
  });

  const qs = data.filters.map((f) => f.q_model);
  const lo = quantile(qs, 0.05);
  const hi = quantile(qs, 1);
  const tq = (v) => (v - lo) / (hi - lo || 1);
  const fullBest = data.full_best;

  const dots = (
    <g pointerEvents="none">
      {shown.map((t, i) => {
        const x = cx(t[1]) + CW / 2;
        const y = cy(t[0]) + CH / 2;
        const last = i === shown.length - 1 && playing;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={last ? 6 : 4}
            fill={last ? "var(--other)" : "#222"}
            stroke="#fff"
            strokeWidth="1.5"
          />
        );
      })}
      {best && (
        <circle
          cx={cx(best[1]) + CW / 2}
          cy={cy(best[0]) + CH / 2}
          r={9}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
        />
      )}
    </g>
  );

  // best-so-far chart
  const W = 360;
  const H = 210;
  const L = 40;
  const n = trials.length;
  const ymax = Math.max(...trials.map((t) => t[2] ?? 0)) * 1.08;
  const bx = (i) => L + (i / Math.max(1, n - 1)) * (W - L - 10);
  const by = (v) => 10 + (1 - v / ymax) * (H - 44);

  return (
    <div className="ppgf-search-grid">
      <div>
        <div className="ppgf-panel-title">
          <span>Filters tried by the adaptive search (Optuna)</span>
          <label className="note" style={{ cursor: "pointer" }}>
            <input type="checkbox" checked={showLand} onChange={(e) => setShowLand(e.target.checked)} /> show model's
            full landscape
          </label>
        </div>
        <Heatmap
          ariaLabel="Model-estimated filter quality with the adaptive search trials overlaid"
          fill={(i) => (showLand && qs[i] != null ? rampColor(tq(qs[i]) * 0.85) : "#f1efeb")}
          markers={[{ cfg: FIXED, color: "var(--fixed)", label: "fixed" }]}
          dots={dots}
        />
        <div className="ppgf-legend">
          <span>
            <i className="ppgf-swatch" style={{ background: "#222" }} /> trial
          </span>
          <span>
            <i className="ppgf-swatch ring" style={{ color: "var(--accent)" }} /> best so far
          </span>
          <span>
            <i className="ppgf-swatch ring" style={{ color: "var(--fixed)" }} /> fixed filter (always tried first)
          </span>
          {showLand && (
            <span>
              lower estimated Q <i className="ppgf-ramp" style={{ background: RAMP_CSS }} /> higher
            </span>
          )}
        </div>
      </div>
      <div className="ppgf-search-side">
        <div>
          <div className="ppgf-play">
            <button className="ppgf-btn" onClick={playing ? () => setPlaying(false) : play}>
              {playing ? "❚❚ Pause" : k >= trials.length ? "▶ Replay search" : "▶ Play"}
            </button>
            <input
              type="range"
              min={0}
              max={trials.length}
              value={k}
              onChange={(e) => {
                setPlaying(false);
                setK(+e.target.value);
              }}
              aria-label="Trial"
            />
          </div>
          <div className="ppgf-kv" style={{ marginBottom: 6 }}>
            Trial <b>{k}</b> / {trials.length}
            {best && (
              <>
                {" "}
                · best so far <b>{fmtHz([best[0], best[1]])}</b> (estimated Q {best[2].toFixed(1)})
              </>
            )}
          </div>
          <svg className="ppgf-svg" viewBox={`0 0 ${W} ${H}`} aria-label="Best estimated quality so far by trial">
            {[0, 0.25, 0.5, 0.75, 1].map((f) => (
              <g key={f}>
                <line className="gridline" x1={L} x2={W - 10} y1={by(ymax * f)} y2={by(ymax * f)} />
                <text x={L - 6} y={by(ymax * f) + 4} fontSize="11" textAnchor="end">
                  {(ymax * f).toFixed(0)}
                </text>
              </g>
            ))}
            {shown.map((t, i) =>
              t[2] == null ? null : <circle key={i} cx={bx(i)} cy={by(t[2])} r={2.6} fill="#9c9893" />,
            )}
            <path
              d={bestSeries
                .map((v, i) => (v == null ? "" : `${i ? "L" : "M"}${bx(i).toFixed(1)} ${by(v).toFixed(1)}`))
                .join("")}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
            />
            <text x={L} y={H - 8} fontSize="11">
              trial 1
            </text>
            <text x={W - 10} y={H - 8} fontSize="11" textAnchor="end">
              {n}
            </text>
            <text transform={`translate(11 ${(H - 34) / 2}) rotate(-90)`} fontSize="11" textAnchor="middle">
              estimated quality
            </text>
          </svg>
          <div className="ppgf-legend">
            <span>
              <i className="ppgf-swatch line" style={{ background: "var(--accent)" }} /> best so far
            </span>
            <span>
              <i className="ppgf-swatch" style={{ background: "#9c9893" }} /> each trial
            </span>
          </div>
        </div>
        <div>
          <div className="ppgf-callout" style={{ marginTop: 0 }}>
            The search stops after 20 trials without improvement. Here it took <b>{trials.length}</b> evaluations
            instead of all 525 and picked <b>{fmtHz(data.optuna.best)}</b>. Checking all 525 would have picked{" "}
            <b>{fmtHz(fullBest)}</b>.
          </div>
          <div className="ppgf-callout">
            Black dots on the grid are the filters the search tried. It concentrates its trials where the model expects
            high quality instead of sweeping the grid. Use the slider to scrub through the trials.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Step 3 ---------- */

function ApplyStep({ data }) {
  const fixed = data.filters[cfgIndex(...FIXED)];
  const ours = data.filters[cfgIndex(...data.optuna.best)];
  const nSeg = data.ecg_seg_rmssd.length;
  const rows = Array.from({ length: nSeg }, (_, s) => ({
    s,
    ecg: data.ecg_seg_rmssd[s],
    fixed: fixed.seg_rmssd[s],
    ours: ours.seg_rmssd[s],
  })).filter((r) => r.ecg != null);
  const [tip, setTip] = useState(null);
  const ref = useRef(null);

  const W = 760;
  const H = 240;
  const L = 50;
  const R = 110;
  const ymax = Math.max(60, ...rows.flatMap((r) => [r.ecg, r.fixed, r.ours].filter((v) => v != null))) * 1.1;
  const x = (s) => L + (rows.length === 1 ? 0.5 : rows.findIndex((r) => r.s === s) / (rows.length - 1)) * (W - L - R);
  const y = (v) => 12 + (1 - v / ymax) * (H - 46);
  const series = [
    { k: "fixed", name: "Fixed 0.5–4.0 Hz", color: "var(--fixed)", dash: null },
    { k: "ours", name: `Ours ${fmtHz(data.optuna.best)}`, color: "var(--accent)", dash: null },
    { k: "ecg", name: "ECG (truth)", color: "var(--ecg)", dash: "5 3" },
  ];
  const step = Math.pow(10, Math.floor(Math.log10(ymax / 2)));
  const yt = [];
  for (let v = 0; v <= ymax; v += step * (ymax / step > 6 ? 2 : 1)) yt.push(v);

  const last = rows[rows.length - 1];
  const fmt = (v) => (v == null ? "–" : v.toFixed(1));

  return (
    <div>
      <div className="ppgf-panel-title">
        <span>Per-minute RMSSD over the whole task</span>
        <span className="note">
          RMSSD error: fixed {fmt(fixed.mae_rmssd)} ms → ours {fmt(ours.mae_rmssd)} ms · IBI error: {fmt(fixed.mae_ibi)}{" "}
          → {fmt(ours.mae_ibi)} ms
        </span>
      </div>
      <div style={{ position: "relative" }}>
        <div className="ppgf-scroll">
          <svg
            ref={ref}
            className="ppgf-svg"
            viewBox={`0 0 ${W} ${H}`}
            onMouseLeave={() => setTip(null)}
            onMouseMove={(e) => {
              const box = ref.current.getBoundingClientRect();
              const px = ((e.clientX - box.left) / box.width) * W;
              const r = rows.reduce(
                (a, rr) => (a == null || Math.abs(x(rr.s) - px) < Math.abs(x(a.s) - px) ? rr : a),
                null,
              );
              setTip({ r, px: e.clientX - box.left, w: box.width });
            }}
            aria-label="Per-minute RMSSD from ECG, fixed-filtered PPG and optimized PPG"
          >
            {yt.map((v) => (
              <g key={v}>
                <line className="gridline" x1={L} x2={W - R} y1={y(v)} y2={y(v)} />
                <text x={L - 6} y={y(v) + 4} fontSize="11" textAnchor="end">
                  {v}
                </text>
              </g>
            ))}
            <text transform={`translate(13 ${(H - 34) / 2}) rotate(-90)`} fontSize="11" textAnchor="middle">
              RMSSD (ms)
            </text>
            {tip && <line x1={x(tip.r.s)} x2={x(tip.r.s)} y1={8} y2={H - 34} stroke="#111" strokeOpacity="0.3" />}
            {series.map((sr) => {
              const pts = rows.filter((r) => r[sr.k] != null);
              return (
                <g key={sr.k}>
                  <path
                    d={pts.map((r, i) => `${i ? "L" : "M"}${x(r.s).toFixed(1)} ${y(r[sr.k]).toFixed(1)}`).join("")}
                    fill="none"
                    stroke={sr.color}
                    strokeWidth="2"
                    strokeDasharray={sr.dash ?? undefined}
                  />
                  {pts.map((r) => (
                    <circle
                      key={r.s}
                      cx={x(r.s)}
                      cy={y(r[sr.k])}
                      r={4}
                      fill={sr.color}
                      stroke="#fff"
                      strokeWidth="1.5"
                    />
                  ))}
                </g>
              );
            })}
            {/* direct labels at the right end */}
            {(() => {
              const items = series
                .filter((sr) => last && last[sr.k] != null)
                .map((sr) => ({ ...sr, yy: y(last[sr.k]) }))
                .sort((a, b) => a.yy - b.yy);
              for (let i = 1; i < items.length; i++)
                if (items[i].yy - items[i - 1].yy < 14) items[i].yy = items[i - 1].yy + 14;
              return items.map((it) => (
                <text key={it.k} x={W - R + 8} y={it.yy + 4} fontSize="11.5" style={{ fill: "var(--ink)" }}>
                  {it.k === "ours" ? "Ours" : it.k === "fixed" ? "Fixed" : "ECG"}
                </text>
              ));
            })()}
            {rows.map((r) => (
              <text key={r.s} x={x(r.s)} y={H - 16} fontSize="11" textAnchor="middle">
                {r.s + 1}
              </text>
            ))}
            <text x={L + (W - L - R) / 2} y={H - 2} fontSize="11" textAnchor="middle">
              minute
            </text>
          </svg>
        </div>
        {tip && (
          <div className="ppgf-tooltip" style={{ left: Math.min(tip.px + 12, tip.w - 170), top: 8 }}>
            <b>Minute {tip.r.s + 1}</b>
            <br />
            ECG {fmt(tip.r.ecg)} ms
            <br />
            Fixed {fmt(tip.r.fixed)} ms
            <br />
            Ours {fmt(tip.r.ours)} ms
          </div>
        )}
      </div>
      <div className="ppgf-legend">
        {series.map((sr) => (
          <span key={sr.k}>
            <i className="ppgf-swatch line" style={{ background: sr.color }} /> {sr.name}
          </span>
        ))}
      </div>
      <div className="ppgf-callout">
        With the fixed filter, spurious and missed beats push RMSSD far above the ECG value, even after artifactual IBIs
        are removed. With the selected filter it stays close to the ECG, using only the PPG to decide.
      </div>
      <details>
        <summary>Show as table</summary>
        <table className="ppgf-table">
          <thead>
            <tr>
              <th>Minute</th>
              <th>ECG (ms)</th>
              <th>Fixed (ms)</th>
              <th>Ours (ms)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.s}>
                <td>{r.s + 1}</td>
                <td>{fmt(r.ecg)}</td>
                <td>{fmt(r.fixed)}</td>
                <td>{fmt(r.ours)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
