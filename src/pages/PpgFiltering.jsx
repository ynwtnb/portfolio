import React, { useEffect, useRef, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { usePageStylesheet } from "../utils/usePageStylesheet";
import FilterExplorer from "./ppgFiltering/FilterExplorer";
import PipelineDemo from "./ppgFiltering/PipelineDemo";
import { Table7Chart, CleanIbiChart } from "./ppgFiltering/ResultsCharts";
import { PAPER, BIBTEX } from "./ppgFiltering/content";
import Primer from "./ppgFiltering/Primer";
import Term from "./ppgFiltering/Term";
import "./ppgFiltering/ppg-filtering.css";

const NAV = [
  ["tldr", "TL;DR"],
  ["background", "Background"],
  ["idea", "The idea"],
  ["how", "How it works"],
  ["results", "Results"],
  ["cite", "Cite"],
];

export default function PpgFiltering() {
  // Shared site header styles (fixed beige bar).
  usePageStylesheet(`${import.meta.env.BASE_URL}CSS/projects.css`);
  const [task, setTask] = useState("mental");
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState("tldr");
  const navRef = useRef(null);

  // On narrow screens the nav scrolls sideways: keep the active item in view (horizontal scroll only).
  useEffect(() => {
    const wrap = navRef.current;
    const el = wrap?.querySelector("a.active");
    if (!wrap || !el || wrap.scrollWidth <= wrap.clientWidth) return;
    wrap.scrollTo({ left: el.offsetLeft - wrap.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  // Highlight the section currently in the middle of the viewport in the sticky nav.
  useEffect(() => {
    const els = NAV.map(([id]) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const copyBib = async () => {
    try {
      await navigator.clipboard.writeText(BIBTEX);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const jump = (id) => (e) => {
    // HashRouter owns the URL hash, so scroll manually instead of using #anchors.
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <SiteHeader variant="project" />
      <div className="ppgf">
        <section className="ppgf-hero">
          <div className="ppgf-wrap">
            <span className="ppgf-badge">
              {PAPER.venue} · {PAPER.venueDetail}
            </span>
            <h1>{PAPER.title}</h1>
            <p className="ppgf-authors">
              {PAPER.authors.map((a) => (
                <span key={a.name} className={a.self ? "self" : undefined}>
                  {a.name}
                  {a.mark && <sup>{a.mark}</sup>}
                </span>
              ))}
            </p>
            <p className="ppgf-affil">{PAPER.affiliation}</p>
            <div className="ppgf-footnote">* Corresponding author · † Equal contribution</div>
            <div className="ppgf-buttons">
              <a className="ppgf-btn" href={PAPER.doi} target="_blank" rel="noreferrer">
                Paper (ACM DL)
              </a>
              <a className="ppgf-btn" href={PAPER.code} target="_blank" rel="noreferrer">
                Code &amp; models
              </a>
              <button className="ppgf-btn ghost" onClick={copyBib}>
                {copied ? "Copied ✓" : "Copy BibTeX"}
              </button>
            </div>
          </div>
        </section>

        <nav className="ppgf-nav" aria-label="Sections">
          <div className="ppgf-wrap" ref={navRef}>
            {NAV.map(([id, label], i) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={jump(id)}
                className={active === id ? "active" : undefined}
                aria-current={active === id ? "location" : undefined}
              >
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                {label}
              </a>
            ))}
            <a href="#demo-explorer" onClick={jump("demo-explorer")} style={{ color: "var(--accent)" }}>
              Try the demo ↓
            </a>
          </div>
        </nav>

        <div className="ppgf-wrap">
          <section className="ppgf-section" id="tldr">
            <div className="ppgf-kicker">TL;DR</div>
            <div className="ppgf-tldr">
              Smartwatch heart signals (<Term k="ppg">PPG</Term>) are almost always cleaned with one fixed filter before
              heartbeats are detected. We show that this one-size-fits-all filter can badly distort{" "}
              <Term k="hrv">heart rate variability</Term>, even when the wearer is sitting still. The best filter
              differs between people and between moments for the same person. Our framework picks the filter for each
              5–15-minute window from the PPG alone.
            </div>
            <div className="ppgf-stats">
              <div className="ppgf-stat">
                <div className="num">
                  279 <small>ms</small>
                </div>
                <div className="lbl">
                  largest reduction in RMSSD error vs. a fixed filter (typical RMSSD is only ~50 ms)
                </div>
              </div>
              <div className="ppgf-stat">
                <div className="num">
                  88–95<small>%</small>
                </div>
                <div className="lbl">
                  of IBIs usable after optimization, vs. 69–77% with a fixed filter and 50–70% from the E4's built-in
                  beats
                </div>
              </div>
              <div className="ppgf-stat">
                <div className="num">
                  ~48 <small>/ 525</small>
                </div>
                <div className="lbl">
                  filters evaluated on median by the adaptive search, with accuracy comparable to checking every one
                </div>
              </div>
            </div>
          </section>

          <section className="ppgf-section" id="background">
            <div className="ppgf-kicker">Background</div>
            <h2>From a wrist sensor to a stress measure</h2>
            <div className="ppgf-prose">
              <p>
                Wearables estimate heart rate variability, a widely used marker of stress, from the pulse they see at
                the wrist. Getting there takes four steps, and the second one decides what the third one sees.
              </p>
            </div>
            <Primer />
            <div className="ppgf-prose" style={{ marginTop: 16 }}>
              <p>
                Errors in filtering propagates through the subsequent steps, impacting the accuracy and validity of the derived metrics. 
                Choosing the appropriate cut-offs for each person and
                moment is the problem this paper addresses.
              </p>
            </div>
          </section>

          <section className="ppgf-section" id="idea">
            <div className="ppgf-kicker">The idea</div>
            <h2>There is no single “right” band-pass filter</h2>
            <div className="ppgf-prose">
              <p>
                Published studies use anything from 0–0.9 Hz for the low cut-off and 1.6–35 Hz for the high one, usually
                without clear justification. To see how much the choice matters, we filtered PPG from two stress datasets with
                525 different <Term k="bandpass">band-pass</Term> settings and checked the resulting beats against a
                simultaneously recorded ground-truth <Term k="ecg">ECG</Term>.
              </p>
              <p>
                Two things stood out. First, large errors appeared even in segments with almost no motion, so removing
                motion artifacts alone is not enough. Second, the filter that worked best varied across participants and
                also within the same participant from rest to stress. Below is one held-out participant from the
                Stress-free dataset. Switch between tasks and watch where the best region moves.
              </p>
            </div>
            <FilterExplorer task={task} setTask={setTask} />
            <div className="ppgf-callout" style={{ maxWidth: 760 }}>
              For this participant, the conventional 0.5–4.0 Hz filter (orange ring) leaves in enough waveform detail
              and noise that the beat detector adds and drops beats, giving RMSSD errors of roughly 100–200 ms. Narrower
              passbands around the pulse frequency work far better, but exactly which one depends on the task.
            </div>
          </section>

          <section className="ppgf-section" id="how">
            <div className="ppgf-kicker">How it works</div>
            <h2>Gate, search, apply — without ECG</h2>
            <div className="ppgf-prose">
              <p>
                In real life, nobody wears a chest ECG to check against. So we split the recording into{" "}
                <Term k="window">windows</Term> of 5–15 minutes, during which a person's state is fairly stable, and
                choose one filter per window using only the PPG.
              </p>
              <p>
                Two small models do the work. They learned what “close to ECG” looks like from labeled training data,
                but at run time they only see PPG features (and, optionally, accelerometer features). We provide a
                simple rule-based version and an XGBoost version of each. The search can either try every filter or use
                an <Term k="optuna">adaptive search</Term> that tries far fewer.
              </p>
            </div>
            <PipelineDemo task={task} setTask={setTask} />
          </section>

          <section className="ppgf-section" id="results">
            <div className="ppgf-kicker">Results</div>
            <h2>More accurate HRV, more usable beats</h2>
            <p className="ppgf-lede">
              Evaluated on WESAD (15 participants) and Stress-free (35 participants) using{" "}
              <Term k="loso">leave-one-subject-out</Term> models, compared with the fixed 0.5–4.0 Hz filter and other
              adaptive methods. Errors are <Term k="mae">mean absolute errors</Term> against ECG.
            </p>
            <div className="ppgf-results-grid">
              <Table7Chart />
              <CleanIbiChart />
            </div>
            <div className="ppgf-results-grid" style={{ marginTop: 22 }}>
              <div className="ppgf-prose">
                <ul className="ppgf-list">
                  <li>
                    <b>Accuracy.</b> All four variants improved beat F1, IBI, and RMSSD accuracy. The largest single
                    improvements were 29.8% F1, 490 ms IBI, and 279 ms RMSSD. Heart-rate-guided passbands and wavelet
                    denoising barely moved, or made things worse.
                  </li>
                  <li>
                    <b>Agreement with ECG.</b> The fixed filter tended to overestimate RMSSD, and its difference from
                    ECG was significant in every condition. After optimization, the remaining mean RMSSD difference was
                    4.7–18 ms.
                  </li>
                  <li>
                    <b>Downstream stress detection.</b> Per-participant AUROCs with optimized PPG were close to those
                    from ECG. Fixed-filter PPG lagged behind, especially on Stress-free.
                  </li>
                </ul>
              </div>
              <div className="ppgf-prose">
                <ul className="ppgf-list">
                  <li>
                    <b>Generalizes without retraining</b> to three other beat detectors (RMSSD error −13 to −28 ms),
                    across datasets, and zero-shot to two other wristbands (ActiGraph LEAP, Empatica EmbracePlus).
                  </li>
                  <li>
                    <b>Cost.</b> The adaptive search takes about 5–25 s per 5-minute window, compared with about 1 ms
                    for a fixed filter. That trade-off is reasonable when reliable HRV matters more than latency.
                  </li>
                  <li>
                    <b>Open source.</b> Install the package, pass your PPG, and get the selected filter, beats, IBIs,
                    and RMSSD:{" "}
                    <a href={PAPER.code} target="_blank" rel="noreferrer">
                      UbiWell/context-aware-ppg-filtering
                    </a>
                    .
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="ppgf-section" id="cite">
            <div className="ppgf-kicker">Cite</div>
            <h2>BibTeX</h2>
            <div className="ppgf-bib">
              <button onClick={copyBib}>{copied ? "Copied ✓" : "Copy"}</button>
              {BIBTEX}
            </div>
          </section>

          <footer className="ppgf-foot">
            The paper is licensed under{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
              CC BY 4.0
            </a>
            .
          </footer>
        </div>
      </div>
    </>
  );
}
