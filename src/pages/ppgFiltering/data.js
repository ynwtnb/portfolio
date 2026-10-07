import { useEffect, useState } from "react";

const BASE = `${import.meta.env.BASE_URL}data/ppg-filtering/`;
const cache = new Map();

function load(name) {
  if (!cache.has(name)) {
    cache.set(
      name,
      fetch(`${BASE}${name}`).then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${name}`);
        return r.json();
      }),
    );
  }
  return cache.get(name);
}

/** Load the shared filter bank plus one task's precomputed data. */
export function useTaskData(task) {
  const [state, setState] = useState({ task: null, data: null, bank: null, error: null });
  useEffect(() => {
    let alive = true;
    Promise.all([load(`u007_${task}.json`), load("filters.json")])
      .then(([data, bank]) => alive && setState({ task, data, bank, error: null }))
      .catch((error) => alive && setState({ task, data: null, bank: null, error }));
    return () => {
      alive = false;
    };
  }, [task]);
  return state.task === task ? state : { task, data: null, bank: null, error: null };
}

// 0.1 Hz grid used by the paper: low 0.4–1.7 Hz, high 1.2–5.0 Hz, low < high (525 filters).
export const LOWS = Array.from({ length: 14 }, (_, i) => +(0.4 + i * 0.1).toFixed(1));
export const HIGHS = Array.from({ length: 39 }, (_, i) => +(1.2 + i * 0.1).toFixed(1));
export const CFGS = [];
for (const l of LOWS) for (const h of HIGHS) if (l < h - 1e-9) CFGS.push([l, h]);

export const cfgIndex = (low, high) =>
  CFGS.findIndex(([l, h]) => Math.abs(l - low) < 1e-6 && Math.abs(h - high) < 1e-6);

export const FIXED = [0.5, 4.0];

export const fmtHz = ([l, h]) => `${l.toFixed(1)}–${h.toFixed(1)} Hz`;

/** Cumulative beat sample indices from the delta-encoded excerpt beats. */
export function excerptBeats(filter) {
  const out = [];
  let acc = 0;
  for (const d of filter.beats_ex) {
    acc += d;
    out.push(acc);
  }
  return out;
}

// Sequential single-hue ramp (light → dark teal) for "goodness" heatmaps.
const RAMP = [
  [244, 248, 249],
  [205, 229, 235],
  [150, 201, 214],
  [88, 165, 186],
  [32, 124, 152],
  [10, 86, 110],
  [6, 52, 68],
];
export function rampColor(t) {
  if (t == null || Number.isNaN(t)) return "#f1efeb";
  const x = Math.max(0, Math.min(1, t)) * (RAMP.length - 1);
  const i = Math.min(RAMP.length - 2, Math.floor(x));
  const f = x - i;
  const c = RAMP[i].map((v, k) => Math.round(v + (RAMP[i + 1][k] - v) * f));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
export const RAMP_CSS = `linear-gradient(90deg, ${[0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => rampColor(t)).join(",")})`;

export function quantile(arr, q) {
  const v = arr.filter((x) => x != null && !Number.isNaN(x)).sort((a, b) => a - b);
  if (!v.length) return 0;
  const pos = (v.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return v[lo] + (v[hi] - v[lo]) * (pos - lo);
}
