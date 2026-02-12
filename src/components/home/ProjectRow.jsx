import React from "react";

export default function ProjectRow({ project }) {
  const Tag = (
    <div className={`lab-tag ${project.labTag.className}`}>{project.labTag.label}</div>
  );

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
