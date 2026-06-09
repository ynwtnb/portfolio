import React, { useState, useEffect } from "react";

export default function ProjectRow({ project }) {
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

  const Title = project.href ? (
    <a href={project.href}>{project.title}</a>
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
    <a className="project-row-image" href={project.href}>
      {Image}
    </a>
  ) : (
    <div className="project-row-image">{Image}</div>
  );

  return (
    <article className="project-row">
      {imageWrap}

      <div className="project-row-body">
        {Tag}
        <h3 className="project-row-title">{Title}</h3>
        <p className="project-row-desc">{project.summary}</p>
        {project.href ? (
          <a className="project-row-cta" href={project.href}>
            Read more →
          </a>
        ) : null}
      </div>
    </article>
  );
}
