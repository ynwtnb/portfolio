import React, { useEffect } from "react";
import { STUDENT, RESEARCH_CORE, HEALTH, TECHNICAL, UPDATED } from "./quals/content";
import "./quals/quals.css";

const TBD = () => <span className="quals-tbd">TBD</span>;

// Relative paths point into /public; absolute URLs are used as-is.
const resolve = (href) => (/^https?:\/\//.test(href) ? href : `${import.meta.env.BASE_URL}${href}`);

// HashRouter owns the URL hash, so scroll manually instead of using #anchors.
const jump = (id) => (e) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

// Multi-paragraph text: paragraphs separated by blank lines.
function Prose({ text }) {
  if (!text) return <p><TBD /></p>;
  return text.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>);
}

function Ext({ href, children }) {
  if (!href) return <TBD />;
  return (
    <a href={resolve(href)} target="_blank" rel="noreferrer">
      {children} ↗
    </a>
  );
}

// Short label/value pairs.
function Facts({ rows }) {
  return (
    <dl className="quals-facts">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v ?? <TBD />}</dd>
        </div>
      ))}
    </dl>
  );
}

function Block({ label, children }) {
  return (
    <>
      <h3>{label}</h3>
      {children}
    </>
  );
}

function ExamComponent({ id, num, heading, c }) {
  const e = c.examiner;
  return (
    <section id={id}>
      <h2>
        <span className="quals-num">{num}</span>
        {heading}
      </h2>
      <Facts
        rows={[
          [
            "Faculty examiner",
            e.name ? (
              <>
                {e.name}
                {e.title && <span className="quals-muted">{e.title}</span>}
              </>
            ) : null,
          ],
          ["Work product", <Ext href={c.workProduct}>View</Ext>],
          ...(c.presented ? [["Presented", c.presented]] : []),
          ["Completed", c.completedDate],
        ]}
      />
      <Block label="Exam topic and why it was selected">
        <Prose text={c.topic} />
      </Block>
      <Block label="Why this examiner">
        <Prose text={e.whySelected} />
      </Block>
      <Block label="Exam structure and rationale">
        <Prose text={c.structure} />
      </Block>
    </section>
  );
}

export default function Quals() {
  // Internal page: not linked from home, and kept out of search engines.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = `Qualifying Exam — ${STUDENT}`;
    return () => {
      meta.remove();
      document.title = prevTitle;
    };
  }, []);

  const r = RESEARCH_CORE;

  return (
    <main className="quals">
      <header className="quals-head">
        <p className="quals-kicker">Ph.D. Qualifying Exam</p>
        <h1>{STUDENT}</h1>
        <nav className="quals-toc">
          <a href="#/quals" onClick={jump("research")}>Research core</a>
          <a href="#/quals" onClick={jump("health")}>Health component</a>
          <a href="#/quals" onClick={jump("technical")}>Technical component</a>
        </nav>
      </header>

      <section id="research">
        <h2>
          <span className="quals-num">1</span>
          Research core
        </h2>
        <p className="quals-paper-title">{r.paper.title ?? <TBD />}</p>
        <p className="quals-authors">
          {r.paper.authors.length ? (
            r.paper.authors.map((a, i) => (
              <React.Fragment key={a}>
                {i > 0 && ", "}
                {a === STUDENT ? <strong>{a}</strong> : a}
              </React.Fragment>
            ))
          ) : (
            <TBD />
          )}
        </p>
        <Facts
          rows={[
            ["Examiners", r.examiners],
            ["Paper", <Ext href={r.paper.pdf}>ACM Digital Library</Ext>],
            ["Venue", r.venue],
            ["Status", r.status],
            ["Presentation", r.presentationDate],
          ]}
        />
        <Block label="Abstract">
          <Prose text={r.paper.abstract} />
        </Block>
        <Block label="Why this venue meets the paper requirement">
          <Prose text={r.venueJustification} />
        </Block>
        <Block label="Statement from the PHI examiner">
          <blockquote className="quals-quote">
            <Prose text={r.examinerStatement} />
            {r.examinerStatementBy && <cite>— {r.examinerStatementBy}</cite>}
          </blockquote>
        </Block>
      </section>

      <ExamComponent id="health" num="2" heading="Health component" c={HEALTH} />
      <ExamComponent id="technical" num="3" heading="Technical component" c={TECHNICAL} />

      <footer className="quals-footer">
        Last updated {UPDATED} · <a href="#/">{STUDENT}</a>
      </footer>
    </main>
  );
}
