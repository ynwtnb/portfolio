import React, { useState } from "react";
import { TABLE7 } from "./content";

/** Horizontal bars: median change in a metric vs. the fixed filter (Table 7). */
export function Table7Chart() {
  const [row, setRow] = useState(2);
  const r = TABLE7.rows[row];
  const vals = r.values;
  const lo = Math.min(0, ...vals);
  const hi = Math.max(0, ...vals);
  const span = hi - lo || 1;
  const W = 480;
  const L = 150;
  const PADL = lo < 0 ? 48 : 6; // room for value labels left of negative bars
  const PADR = hi > 0 ? 48 : 6;
  const BH = 22;
  const GAP = 8;
  const H = vals.length * (BH + GAP) + 30;
  const sx = (v) => L + PADL + ((v - lo) / span) * (W - L - PADL - PADR - 8);
  const zero = sx(0);

  return (
    <div className="ppgf-demo" style={{ margin: 0 }}>
      <div className="ppgf-demo-head" style={{ marginBottom: 6 }}>
        <div className="ppgf-demo-title">Median change vs. fixed filter</div>
        <div className="ppgf-seg" role="group" aria-label="Metric">
          {TABLE7.rows.map((rr, i) => (
            <button key={rr.metric} aria-pressed={row === i} onClick={() => setRow(i)}>
              {rr.metric.replace(/ \(.*\)/, "")}
            </button>
          ))}
        </div>
      </div>
      <div className="ppgf-scroll narrow">
        {" "}
        <svg className="ppgf-svg" viewBox={`0 0 ${W} ${H}`} aria-label={`Median change in ${r.metric}`}>
          <line x1={zero} x2={zero} y1={0} y2={H - 24} stroke="#bdb8b1" />
          {vals.map((v, i) => {
            const y = i * (BH + GAP) + 4;
            const ours = TABLE7.proposed[i];
            const good = r.better === "up" ? v > 0 : v < 0;
            const x0 = Math.min(sx(0), sx(v));
            const w = Math.max(2, Math.abs(sx(v) - sx(0)));
            return (
              <g key={i}>
                <text
                  x={L - 8}
                  y={y + BH / 2 + 4}
                  fontSize="12"
                  textAnchor="end"
                  style={{ fill: ours ? "var(--ink)" : "var(--ink-2)", fontWeight: ours ? 600 : 400 }}
                >
                  {TABLE7.methods[i]}
                </text>
                <rect x={x0} y={y} width={w} height={BH} rx={3} fill={ours ? "var(--accent)" : "#b9b4ad"}>
                  <title>{`${TABLE7.methods[i]}: ${v > 0 ? "+" : ""}${v}`}</title>
                </rect>
                <text
                  x={v < 0 ? x0 - 5 : x0 + w + 5}
                  y={y + BH / 2 + 4}
                  fontSize="11.5"
                  textAnchor={v < 0 ? "end" : "start"}
                  style={{ fill: "var(--ink)" }}
                >
                  {v > 0 ? "+" : v < 0 ? "−" : ""}
                  {Math.abs(v).toFixed(2)}
                  {!good && Math.abs(v) > 0.001 ? " ✕" : ""}
                </text>
              </g>
            );
          })}
          <text x={zero} y={H - 6} fontSize="11" textAnchor="middle">
            {r.better === "down" ? "← lower error is better" : "higher is better →"} ({r.metric.match(/\((.*)\)/)?.[1]})
          </text>
        </svg>
      </div>
      <div className="ppgf-legend">
        <span>
          <i className="ppgf-swatch" style={{ background: "var(--accent)", borderRadius: 2 }} /> Our four variants
        </span>
        <span>
          <i className="ppgf-swatch" style={{ background: "#b9b4ad", borderRadius: 2 }} /> Baseline adaptive methods
        </span>
        <span>✕ = worse than the fixed filter</span>
      </div>
    </div>
  );
}

/** Percentage of clean IBIs relative to ECG (Section 6.2.3). */
export function CleanIbiChart() {
  const groups = [
    { name: "WESAD", e4: 49.9, fixed: 68.8 },
    { name: "Stress-free", e4: 69.6, fixed: 76.7 },
  ];
  const ours = [87.9, 94.8];
  const W = 480;
  const L = 150;
  const R = 56;
  const BH = 18;
  const H = 230;
  const sx = (v) => L + (v / 100) * (W - L - R);
  const rows = [];
  groups.forEach((g, gi) => {
    const y0 = gi * 98 + 22;
    rows.push(
      <text
        key={`g${gi}`}
        x={L - 8}
        y={y0 - 6}
        fontSize="12"
        textAnchor="end"
        style={{ fill: "var(--ink)", fontWeight: 600 }}
      >
        {g.name}
      </text>,
    );
    [
      { k: "E4 built-in", v: g.e4, c: "#b9b4ad" },
      { k: "Fixed filter", v: g.fixed, c: "var(--fixed)" },
    ].forEach((b, bi) => {
      const y = y0 + bi * (BH + 6);
      rows.push(
        <g key={`${gi}-${bi}`}>
          <text x={L - 8} y={y + BH / 2 + 4} fontSize="12" textAnchor="end">
            {b.k}
          </text>
          <rect x={L} y={y} width={sx(b.v) - L} height={BH} rx={3} fill={b.c} />
          <text x={sx(b.v) + 5} y={y + BH / 2 + 4} fontSize="11.5" style={{ fill: "var(--ink)" }}>
            {b.v}%
          </text>
        </g>,
      );
    });
    const y = y0 + 2 * (BH + 6);
    rows.push(
      <g key={`${gi}-o`}>
        <text
          x={L - 8}
          y={y + BH / 2 + 4}
          fontSize="12"
          textAnchor="end"
          style={{ fill: "var(--ink)", fontWeight: 600 }}
        >
          Ours
        </text>
        <rect x={L} y={y} width={sx(ours[0]) - L} height={BH} rx={3} fill="var(--accent)" />
        <rect
          x={sx(ours[0])}
          y={y}
          width={sx(ours[1]) - sx(ours[0])}
          height={BH}
          rx={3}
          fill="var(--accent)"
          opacity="0.4"
        />
        <text x={sx(ours[1]) + 5} y={y + BH / 2 + 4} fontSize="11.5" style={{ fill: "var(--ink)" }}>
          {ours[0]}–{ours[1]}%
        </text>
      </g>,
    );
  });

  return (
    <div className="ppgf-demo" style={{ margin: 0 }}>
      <div className="ppgf-demo-title" style={{ marginBottom: 6 }}>
        Usable beats: % of clean IBIs vs. ECG
      </div>
      <div className="ppgf-scroll narrow">
        {" "}
        <svg
          className="ppgf-svg"
          viewBox={`0 0 ${W} ${H}`}
          aria-label="Percentage of clean inter-beat intervals by method"
        >
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line className="gridline" x1={sx(v)} x2={sx(v)} y1={8} y2={H - 20} />
              <text x={sx(v)} y={H - 4} fontSize="11" textAnchor="middle">
                {v}%
              </text>
            </g>
          ))}
          {rows}
        </svg>
      </div>
      <div className="ppgf-legend">
        <span>Range for ours spans all four model × search variants (both datasets).</span>
      </div>
    </div>
  );
}
