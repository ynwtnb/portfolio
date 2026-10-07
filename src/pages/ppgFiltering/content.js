export const PAPER = {
  title:
    "A Context-Aware Framework for Optimal Filter Parameter Selection: Enhancing PRV Estimation in Wearable Wrist PPG Signals",
  venue: "Proc. ACM IMWUT",
  venueDetail: "Vol. 10, No. 3, Article 167 · September 2026",
  doi: "https://doi.org/10.1145/3831657",
  code: "https://github.com/UbiWell/context-aware-ppg-filtering",
  authors: [
    { name: "Yuna Naito", mark: "*", self: true },
    { name: "Natasha Yamane" },
    { name: "Aarti Sathyanarayana" },
    { name: "Matthew S. Goodwin", mark: "†" },
    { name: "Varun Mishra", mark: "†" },
  ],
  affiliation: "Northeastern University",
};

export const BIBTEX = `@article{naito2026contextaware,
  author    = {Naito, Yuna and Yamane, Natasha and Sathyanarayana, Aarti and Goodwin, Matthew S. and Mishra, Varun},
  title     = {A Context-Aware Framework for Optimal Filter Parameter Selection: Enhancing PRV Estimation in Wearable Wrist PPG Signals},
  journal   = {Proc. ACM Interact. Mob. Wearable Ubiquitous Technol.},
  volume    = {10},
  number    = {3},
  articleno = {167},
  numpages  = {34},
  year      = {2026},
  month     = sep,
  doi       = {10.1145/3831657},
  publisher = {Association for Computing Machinery}
}`;

export const TASK_LABELS = {
  rest: { name: "Rest", detail: "10-min seated baseline" },
  mental: { name: "Mental arithmetic", detail: "4-min math stressor" },
  startle: { name: "Startle", detail: "4-min startle response" },
  cold: { name: "Cold pressor", detail: "4-min ice-water stressor" },
};

export const TASKS = ["rest", "mental", "startle", "cold"];

// Table 7 (median improvement vs. the fixed 0.5–4.0 Hz filter; negative = smaller error).
export const TABLE7 = {
  methods: [
    "Rule · full",
    "Rule · Optuna",
    "ML · full",
    "ML · Optuna",
    "HR-guided passband",
    "Wavelet (universal)",
    "Wavelet (rigrsure)",
  ],
  proposed: [true, true, true, true, false, false, false],
  rows: [
    { metric: "F1 score (%)", values: [1.5, 1.5, 2.82, 2.25, 0.5, -0.26, -0.4], better: "up" },
    { metric: "MAE IBI (ms)", values: [-1.15, -1.33, -2.94, -3.27, 0.67, 0.03, 0.12], better: "down" },
    { metric: "MAE RMSSD (ms)", values: [-22.3, -20.8, -38.4, -32.3, -1.39, -0.1, 0.19], better: "down" },
  ],
};

// Mean % of clean IBIs relative to ECG (Section 6.2.3).
export const CLEAN_IBI = [
  { source: "Empatica E4 (built-in)", wesad: 49.9, stressfree: 69.6 },
  { source: "Fixed 0.5–4.0 Hz filter", wesad: 68.8, stressfree: 76.7 },
  { source: "Ours (all four variants)", range: [87.9, 94.8] },
];

// Plain-language definitions shown on hover/tap for jargon terms.
export const GLOSSARY = {
  ppg: "Photoplethysmography: the optical sensor (the green light on a smartwatch) that picks up each pulse of blood at the wrist.",
  ecg: "Electrocardiography: chest electrodes that record the heart's electrical activity. Its beat timing is precise, so we use it as ground truth.",
  ibi: "Inter-beat interval: the time between two consecutive heartbeats, in milliseconds.",
  hrv: "Heart rate variability: how much the time between beats fluctuates. It reflects nervous-system activity such as stress. Measured from PPG it is called pulse rate variability (PRV).",
  rmssd:
    "Root mean square of successive differences between IBIs, the most common short-term HRV measure. In these datasets it is around 50 ms, so a few wrong beats can distort it badly.",
  bandpass:
    "A filter that keeps only the frequencies between a low and a high cut-off, removing slow drift (e.g. from breathing) below and fast noise above.",
  cutoff: "The frequency where a filter starts removing signal. 1 Hz = 60 beats per minute.",
  q: "The paper's filter quality score: combines beat-timing F1 and IBI, RMSSD, and pulse-timing errors vs. ECG into one number (higher is better), with penalties for filters that only look good on a single measure.",
  mae: "Mean absolute error: the average size of the difference from ECG, ignoring its sign.",
  cleanable:
    "A 1-minute segment that isn't accurate with the default filter but could be with a better one. 'Uncleanable' segments are too corrupted for any filter to fix.",
  window:
    "A 5–15-minute stretch of recording during which the person's state is assumed to be fairly stable. One filter is chosen per window.",
  optuna:
    "An adaptive search library. Instead of trying all 525 filters, it proposes promising ones based on the scores it has seen so far.",
  loso: "Leave-one-subject-out: the models used for this participant were trained on everyone else, so the demo is a fair held-out test.",
};
