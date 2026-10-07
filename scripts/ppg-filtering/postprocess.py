"""
Post-process the generator output for the web page:
- re-centre the excerpt's ECG beat times on the median offset to the model-selected filter's beats
  (the E4/Polar clock offset is arbitrary; this only affects the excerpt display), and
- drop the per-filter F1 field (not shown on the page; Q already incorporates beat-timing accuracy).

Usage: python postprocess.py <dir with u007_*.json>   (edits files in place)
"""
import json
import sys

LOWS = [round(0.4 + i * 0.1, 1) for i in range(14)]
HIGHS = [round(1.2 + i * 0.1, 1) for i in range(39)]
CFGS = [(l, h) for l in LOWS for h in HIGHS if l < h]

for task in ["rest", "mental", "startle", "cold"]:
    path = f"{sys.argv[1]}/u007_{task}.json"
    d = json.load(open(path))
    acc, beats = 0, []
    for step in d["filters"][CFGS.index(tuple(d["optuna"]["best"]))]["beats_ex"]:
        acc += step
        beats.append(acc / d["fs"])
    ecg = d["excerpt"]["ecg"]
    diffs = sorted(min(ecg, key=lambda e: abs(e - b)) - b for b in beats)
    diffs = [x for x in diffs if abs(x) < 0.3]
    med = diffs[len(diffs) // 2]
    d["excerpt"]["ecg"] = [round(e - med, 3) for e in ecg if 0 <= e - med < d["excerpt"]["len"]]
    d["lag_excerpt"] = round(d["lag_excerpt"] + med, 3)
    for f in d["filters"]:
        f.pop("f1", None)
    json.dump(d, open(path, "w"), separators=(",", ":"))
