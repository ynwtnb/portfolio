import React from "react";
import Term from "./Term";

// Illustrative synthetic pulse wave (not real data) used to explain the processing chain.
const IBIS = [820, 780, 850, 800, 760, 830];
const BEATS = IBIS.reduce((acc, ibi) => [...acc, acc[acc.length - 1] + ibi / 1000], [0.25]);
const T = 4.6;
const N = 280;

const pulse = (t) =>
  BEATS.reduce(
    (s, b) => s + Math.exp(-(((t - b - 0.12) / 0.07) ** 2)) + 0.35 * Math.exp(-(((t - b - 0.38) / 0.09) ** 2)),
    0,
  );
const raw = (t) =>
  pulse(t) +
  0.75 * Math.sin(2 * Math.PI * 0.22 * t + 1) +
  0.09 * Math.sin(2 * Math.PI * 9.3 * t) +
  0.07 * Math.sin(2 * Math.PI * 13.7 * t + 2);

const W = 240;
const H = 120;
const PAD = 8;
const sx = (t) => PAD + (t / T) * (W - 2 * PAD);

function wavePath(fn, top, h) {
  const ys = Array.from({ length: N }, (_, i) => fn((i / (N - 1)) * T));
  const lo = Math.min(...ys);
  const hi = Math.max(...ys);
  const sy = (v) => top + h - ((v - lo) / (hi - lo)) * h;
  return {
    d: ys.map((v, i) => `${i ? "L" : "M"}${sx((i / (N - 1)) * T).toFixed(1)} ${sy(v).toFixed(1)}`).join(""),
    sy,
  };
}

function RawIcon() {
  const { d } = wavePath(raw, 16, 80);
  return (
    <svg className="ppgf-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <path d={d} fill="none" stroke="#8a8782" strokeWidth="1.6" />
      <text x={PAD} y={H - 4} fontSize="10.5">
        slow drift + fast noise + pulses
      </text>
    </svg>
  );
}

function FilterIcon() {
  // Schematic spectrum: breathing drift (low), pulse (around 1.2 Hz) and harmonics, broadband noise.
  const fx = (f) => PAD + 6 + (f / 8) * (W - 2 * PAD - 12);
  const base = 92;
  const bars = [
    { f: 0.22, h: 58, c: "#b9b4ad" },
    { f: 1.2, h: 70, c: "var(--accent)" },
    { f: 2.4, h: 30, c: "var(--accent)" },
    { f: 3.6, h: 14, c: "var(--accent)" },
    ...[5.2, 6.1, 6.9, 7.6].map((f) => ({ f, h: 12, c: "#b9b4ad" })),
  ];
  return (
    <svg className="ppgf-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <rect x={fx(0.5)} y={14} width={fx(4) - fx(0.5)} height={base - 14} fill="var(--accent-soft)" rx="3" />
      <line x1={fx(0.5)} x2={fx(0.5)} y1={10} y2={base} stroke="var(--fixed)" strokeWidth="2" />
      <line x1={fx(4)} x2={fx(4)} y1={10} y2={base} stroke="var(--fixed)" strokeWidth="2" />
      <text x={fx(0.5) + 3} y={22} fontSize="10">
        low
      </text>
      <text x={fx(4) - 3} y={22} fontSize="10" textAnchor="end">
        high
      </text>
      {bars.map((b) => (
        <rect key={b.f} x={fx(b.f) - 3} y={base - b.h} width={6} height={b.h} rx="2" fill={b.c} />
      ))}
      <line x1={PAD} x2={W - PAD} y1={base} y2={base} stroke="#bdb8b1" />
      {[0, 2, 4, 6, 8].map((f) => (
        <text key={f} x={fx(f)} y={base + 13} fontSize="10" textAnchor="middle">
          {f}
        </text>
      ))}
      <text x={W - PAD} y={H - 1} fontSize="10" textAnchor="end">
        frequency (Hz)
      </text>
    </svg>
  );
}

function BeatsIcon() {
  const { d, sy } = wavePath(pulse, 26, 62);
  const peaks = BEATS.slice(0, 6).map((b) => b + 0.12);
  return (
    <svg className="ppgf-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="1.6" />
      {peaks.map((p) => (
        <circle key={p} cx={sx(p)} cy={sy(pulse(p))} r="3.6" fill="var(--accent)" stroke="#fff" strokeWidth="1.2" />
      ))}
      <text x={W - PAD} y={H - 1} fontSize="10" textAnchor="end">
        IBI (ms)
      </text>
      {peaks.slice(0, 3).map((p, i) => {
        const x1 = sx(p);
        const x2 = sx(peaks[i + 1]);
        return (
          <g key={p}>
            <path d={`M${x1} 104 V98 H${x2} V104`} fill="none" stroke="var(--ink-2)" strokeWidth="1" />
            <text x={(x1 + x2) / 2} y={H - 1} fontSize="10" textAnchor="middle">
              {IBIS[i + 1]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function RmssdIcon() {
  const vals = IBIS;
  const x = (i) => PAD + 14 + (i / (vals.length - 1)) * (W - 2 * PAD - 28);
  const y = (v) => 18 + (1 - (v - 740) / 130) * 60;
  return (
    <svg className="ppgf-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {vals.slice(1).map((v, i) => (
        <line key={i} x1={x(i)} x2={x(i + 1)} y1={y(vals[i])} y2={y(v)} stroke="var(--ink-3)" strokeDasharray="3 2" />
      ))}
      {vals.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="3.6" fill="var(--ink)" />
      ))}
      {vals.slice(1).map((v, i) => (
        <text key={i} x={(x(i) + x(i + 1)) / 2} y={92} fontSize="9.5" textAnchor="middle">
          {v - vals[i] > 0 ? "+" : "−"}
          {Math.abs(v - vals[i])}
        </text>
      ))}
      <text x={W / 2} y={H - 1} fontSize="10.5" textAnchor="middle" style={{ fill: "var(--ink)", fontWeight: 600 }}>
        RMSSD ≈ 56 ms
      </text>
    </svg>
  );
}

const CARDS = [
  {
    n: 1,
    title: "Record wrist PPG",
    icon: <RawIcon />,
    body: (
      <>
        The <Term k="ppg">PPG</Term> sensor sees each pulse, mixed with slow breathing drift and fast noise.
      </>
    ),
  },
  {
    n: 2,
    title: "Filtering",
    focus: true,
    icon: <FilterIcon />,
    body: (
      <>
        The most commonly-used method is band-pass filtering, which
        keeps only frequencies between a low and a high <Term k="cutoff">cut-off</Term>. Most studies use one fixed
        setting, such as 0.5–4 Hz.
      </>
    ),
  },
  {
    n: 3,
    title: "Detect beats → IBIs",
    icon: <BeatsIcon />,
    body: (
      <>
        Find each beat. The gaps between beats are <Term k="ibi">inter-beat intervals</Term> (IBIs).
      </>
    ),
  },
  {
    n: 4,
    title: "Compute HRV",
    icon: <RmssdIcon />,
    body: (
      <>
        <Term k="rmssd">RMSSD</Term> summarizes how much consecutive IBIs differ, a common <Term k="hrv">HRV</Term>{" "}
        measure for stress.
      </>
    ),
  },
];

export default function Primer() {
  return (
    <div>
      <div className="ppgf-primer" role="list">
        {CARDS.map((c) => (
          <div key={c.n} className={`ppgf-primer-card${c.focus ? " focus" : ""}`} role="listitem">
            {c.focus && <div className="ppgf-primer-flag">The step this paper is about</div>}
            <div className="ppgf-primer-n">{c.n}</div>
            <div className="ppgf-primer-t">{c.title}</div>
            {c.icon}
            <div className="ppgf-primer-b">{c.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
