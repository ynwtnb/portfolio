import React from "react";
import { MY_NAME_PATTERNS } from "../../data/publications";

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightName(text) {
  if (!text) return text;
  const patterns = MY_NAME_PATTERNS.filter(Boolean).map(escapeRegExp);
  if (patterns.length === 0) return text;

  const re = new RegExp(`(${patterns.join("|")})`, "g");
  const parts = text.split(re);

  return parts.map((part, idx) => {
    const isMe = MY_NAME_PATTERNS.includes(part);
    if (!isMe) return <React.Fragment key={idx}>{part}</React.Fragment>;
    return (
      <span key={idx} className="author-me">
        {part}
      </span>
    );
  });
}

export default function PublicationCard({ pub }) {
  return (
    <article className="pub-card">
      <a className="pub-card-link" href={pub.link}>
        <div className="pub-card-title">
          <strong>{pub.title}</strong>
        </div>
        <div className="pub-card-meta">
          <span className="pub-venue">{pub.venue}</span>
          <span className="pub-meta-sep">•</span>
          <span className="pub-year">{pub.year}</span>
        </div>
        <div className="pub-card-authors">{highlightName(pub.authors)}</div>
      </a>
    </article>
  );
}
