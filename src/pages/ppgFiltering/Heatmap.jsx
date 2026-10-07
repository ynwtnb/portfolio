import React, { useRef } from "react";
import { CFGS, LOWS, HIGHS, cfgIndex } from "./data";

const W = 760;
const M = { l: 46, r: 10, t: 10, b: 38 };
const CW = (W - M.l - M.r) / HIGHS.length;
const CH = 15;
const H = M.t + CH * LOWS.length + M.b;

const col = (high) => Math.round((high - HIGHS[0]) * 10);
const row = (low) => Math.round((low - LOWS[0]) * 10);
// low cut increases upward
const cx = (high) => M.l + col(high) * CW;
const cy = (low) => M.t + (LOWS.length - 1 - row(low)) * CH;

/**
 * Grid of the 525 band-pass configurations (x = high cut, y = low cut).
 * `fill(i)` returns the color for configuration i (or null for "no data").
 * `markers`: [{cfg:[l,h], color, shape:'ring'|'diamond'|'dot', label}]
 */
export default function Heatmap({ fill, markers = [], selected, onSelect, onHover, ariaLabel, dots }) {
  const ref = useRef(null);

  const hover = (i, e) => {
    if (!onHover) return;
    if (i == null) return onHover(null);
    const box = ref.current?.getBoundingClientRect();
    onHover({ i, x: e.clientX - (box?.left ?? 0), y: e.clientY - (box?.top ?? 0), w: box?.width ?? W });
  };

  const onKey = (e) => {
    if (!onSelect || selected == null) return;
    const [l, h] = CFGS[selected];
    let nl = l;
    let nh = h;
    if (e.key === "ArrowLeft") nh = h - 0.1;
    else if (e.key === "ArrowRight") nh = h + 0.1;
    else if (e.key === "ArrowUp") nl = l + 0.1;
    else if (e.key === "ArrowDown") nl = l - 0.1;
    else return;
    e.preventDefault();
    const j = cfgIndex(+nl.toFixed(1), +nh.toFixed(1));
    if (j >= 0) onSelect(j);
  };

  const sel = selected != null ? CFGS[selected] : null;

  return (
    <div className="ppgf-scroll">
      <svg
        ref={ref}
        className="ppgf-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="grid"
        aria-label={ariaLabel}
        tabIndex={onSelect ? 0 : -1}
        onKeyDown={onKey}
        onMouseLeave={() => hover(null)}
      >
        {/* cells */}
        {CFGS.map(([l, h], i) => (
          <rect
            key={i}
            className={onSelect ? "ppgf-cell" : undefined}
            x={cx(h) + 0.5}
            y={cy(l) + 0.5}
            width={CW - 1}
            height={CH - 1}
            rx={1.5}
            fill={fill(i) ?? "#f1efeb"}
            onMouseMove={(e) => hover(i, e)}
            onClick={onSelect ? () => onSelect(i) : undefined}
          />
        ))}

        {/* optional scatter overlay (e.g. search trials) */}
        {dots}

        {/* axes */}
        {HIGHS.filter((h) => Math.abs((h * 10) % 5) < 1e-6).map((h) => (
          <text key={h} x={cx(h) + CW / 2} y={H - M.b + 16} fontSize="11" textAnchor="middle">
            {h.toFixed(1)}
          </text>
        ))}
        <text x={M.l + (W - M.l - M.r) / 2} y={H - 6} fontSize="12" textAnchor="middle">
          High cut-off (Hz)
        </text>
        {LOWS.filter((_, k) => k % 2 === 0).map((l) => (
          <text key={l} x={M.l - 6} y={cy(l) + CH / 2 + 4} fontSize="11" textAnchor="end">
            {l.toFixed(1)}
          </text>
        ))}
        <text transform={`translate(12 ${M.t + (CH * LOWS.length) / 2}) rotate(-90)`} fontSize="12" textAnchor="middle">
          Low cut-off (Hz)
        </text>

        {/* markers */}
        {markers.map((m) => {
          const x = cx(m.cfg[1]) + CW / 2;
          const y = cy(m.cfg[0]) + CH / 2;
          if (m.shape === "diamond") {
            return (
              <g key={m.label} pointerEvents="none">
                <path
                  d={`M${x} ${y - 7} L${x + 7} ${y} L${x} ${y + 7} L${x - 7} ${y} Z`}
                  fill={m.color}
                  stroke="#fff"
                  strokeWidth="2"
                />
              </g>
            );
          }
          return (
            <circle
              key={m.label}
              cx={x}
              cy={y}
              r={7.5}
              fill="none"
              stroke="#fff"
              strokeWidth="5"
              pointerEvents="none"
            />
          );
        })}
        {markers
          .filter((m) => m.shape !== "diamond")
          .map((m) => (
            <circle
              key={`${m.label}-ring`}
              cx={cx(m.cfg[1]) + CW / 2}
              cy={cy(m.cfg[0]) + CH / 2}
              r={7.5}
              fill="none"
              stroke={m.color}
              strokeWidth="2.5"
              pointerEvents="none"
            />
          ))}

        {/* selection */}
        {sel && (
          <rect
            x={cx(sel[1]) - 1}
            y={cy(sel[0]) - 1}
            width={CW + 2}
            height={CH + 2}
            rx={2.5}
            fill="none"
            stroke="#111"
            strokeWidth="2"
            pointerEvents="none"
          />
        )}
      </svg>
    </div>
  );
}

Heatmap.geometry = { W, H, cx, cy, CW, CH };
