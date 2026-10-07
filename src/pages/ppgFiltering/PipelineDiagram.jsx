import React from "react";
import Term from "./Term";

const GATE_COLORS = ["#a9d3de", "#0a6f8a", "#a9d3de", "#d9d5cf"];

function WaveGlyph({ dots = false, color = "#8a8782", noisy = false }) {
  const pts = Array.from({ length: 90 }, (_, i) => {
    const t = i / 89;
    const ph = (t * 5) % 1;
    let v = Math.exp(-(((ph - 0.25) / 0.09) ** 2)) + 0.3 * Math.exp(-(((ph - 0.6) / 0.1) ** 2));
    if (noisy) v += 0.35 * Math.sin(t * 9) + 0.12 * Math.sin(t * 140);
    return [8 + t * 124, 34 - v * 20];
  });
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
  return (
    <>
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" />
      {dots &&
        [0, 1, 2, 3, 4].map((k) => {
          const x = 8 + ((k + 0.25) / 5) * 124;
          return <circle key={k} cx={x} cy={14} r="3" fill={color} stroke="#fff" strokeWidth="1" />;
        })}
    </>
  );
}

const ICONS = [
  // 1. gate: a window split into 1-min segments with quality labels
  <svg key="g" viewBox="0 0 140 62" className="ppgf-diagram-icon" aria-hidden="true">
    <WaveGlyph noisy />
    {GATE_COLORS.map((c, i) => (
      <rect key={i} x={8 + i * 31.5} y={42} width={29} height={14} rx="3" fill={c} />
    ))}
    <path d="M102.5 56 l12 -14 M108.5 56 l12 -14 M114.5 56 l12 -14" stroke="#b3ada5" strokeWidth="1" />
  </svg>,
  // 2. search: grid of candidate filters, a few tried, best ringed
  <svg key="s" viewBox="0 0 140 62" className="ppgf-diagram-icon" aria-hidden="true">
    {Array.from({ length: 6 }, (_, r) =>
      Array.from({ length: 12 }, (_, c) => (
        <rect
          key={`${r}-${c}`}
          x={10 + c * 10}
          y={4 + r * 9}
          width={8.5}
          height={7.5}
          rx="1.5"
          fill={
            ["#eaf2f4", "#cfe6ec", "#a9d3de", "#5fa8bd"][
              Math.max(0, 3 - Math.abs(r - 2) - Math.floor(Math.abs(c - 3) / 2))
            ]
          }
        />
      )),
    )}
    {[
      [1, 9],
      [4, 2],
      [2, 6],
      [3, 3],
      [2, 2],
    ].map(([r, c], k) => (
      <circle key={k} cx={14.25 + c * 10} cy={7.75 + r * 9} r="2.2" fill="#222" />
    ))}
    <circle cx={14.25 + 3 * 10} cy={7.75 + 2 * 9} r="5.5" fill="none" stroke="var(--accent)" strokeWidth="2" />
  </svg>,
  // 3. apply: whole window filtered with the winner, beats detected
  <svg key="a" viewBox="0 0 140 62" className="ppgf-diagram-icon" aria-hidden="true">
    <WaveGlyph dots color="var(--accent)" />
    <text x={70} y={55} fontSize="7.5" textAnchor="middle">
      beats → IBIs → RMSSD
    </text>
  </svg>,
];

export const DIAGRAM_STEPS = [
  {
    t: "Gate segments",
    s: (
      <>
        Split the <Term k="window">window</Term> into 1-minute segments and label each{" "}
        <Term k="cleanable">clean, cleanable, or uncleanable</Term>. Uncleanable ones are set aside.
      </>
    ),
    model: "Segment quality model",
  },
  {
    t: "Search filters",
    s: (
      <>
        Try candidate band-pass filters on clean and cleanable segments only, so unfixable minutes can't push the
        choice toward over-filtering, and predict how close each would come to ECG.
      </>
    ),
    model: "Filter quality model",
  },
  {
    t: "Apply & extract",
    s: <>Filter the whole window with the best-scoring filter, then detect beats and compute HRV.</>,
    model: null,
  },
];

/**
 * Three-step overview of the framework. Each step is also a tab that selects the
 * matching walkthrough panel below it.
 */
export default function PipelineDiagram({ step, setStep }) {
  return (
    <div className="ppgf-diagram">
      <div className="ppgf-diagram-io">
        <div className="lbl">Input</div>
        <div>
          Wrist PPG, one 5–15 min <Term k="window">window</Term>
        </div>
      </div>
      <div className="ppgf-diagram-arrow" aria-hidden="true" />
      <div className="ppgf-diagram-steps" role="tablist" aria-label="Pipeline steps">
        {DIAGRAM_STEPS.map((s, i) => (
          <React.Fragment key={s.t}>
            {i > 0 && <div className="ppgf-diagram-arrow" aria-hidden="true" />}
            <div
              className="ppgf-diagram-step"
              role="tab"
              tabIndex={0}
              aria-selected={step === i}
              onClick={() => setStep(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setStep(i);
                }
              }}
            >
              <div className="n">Step {i + 1}</div>
              <div className="t">{s.t}</div>
              {ICONS[i]}
              <div className="s">{s.s}</div>
              <div className={`m${s.model ? "" : " none"}`}>{s.model ?? "No model needed"}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="ppgf-diagram-arrow" aria-hidden="true" />
      <div className="ppgf-diagram-io">
        <div className="lbl">Output</div>
        <div>Beats, IBIs, and HRV from the chosen filter</div>
      </div>
    </div>
  );
}
