import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProjectRow({ project }) {
  const isExternal = project.href && /^https?:\/\//.test(project.href);
  const LinkComp = isExternal ? "a" : Link;
  const linkProps = isExternal ? { href: project.href } : { to: project.href };

  const [showTag, setShowTag] = useState(
    () => typeof window !== "undefined" ? !window.matchMedia("(max-width: 640px)").matches : true
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = (e) => setShowTag(!e.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const Tag = showTag ? (
    <div className={`lab-tag ${project.labTag.className}`}>{project.labTag.label}</div>
  ) : null;

  const StatusBadge = project.status ? (
    <span className={`status-badge status-badge--${project.status}`}>
      {project.status === "ongoing" ? "Ongoing" : "Past"}
    </span>
  ) : null;

  const Title = project.href ? (
    <LinkComp {...linkProps}>{project.title}</LinkComp>
  ) : (
    project.title
  );

  const Image = (
    <img
      src={project.image}
      alt={project.title}
      loading="lazy"
      className="project-row-img"
    />
  );

  const imageWrap = project.href ? (
    <LinkComp className="project-row-image" {...linkProps}>
      {Image}
    </LinkComp>
  ) : (
    <div className="project-row-image">{Image}</div>
  );

  return (
    <article className="project-row">
      {imageWrap}

      <div className="project-row-body">
        <div className="project-row-tags">
          {Tag}
          {StatusBadge}
        </div>
        <h3 className="project-row-title">{Title}</h3>
        <p className="project-row-desc">{project.summary}</p>
        {project.href ? (
          <LinkComp className="project-row-cta" {...linkProps}>
            Read more →
          </LinkComp>
        ) : null}
      </div>
    </article>
  );
}
