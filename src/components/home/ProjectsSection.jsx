import React from "react";
import SectionTitle from "../common/SectionTitle";
import ProjectRow from "./ProjectRow";
import { projects } from "../../data/projects";

export default function ProjectsSection() {
  return (
    <div className="projects">
      <SectionTitle
        id="projects-title-link"
        title="Projects"
        className="projects-title"
        lineClassName="projects-line"
      />

      <div className="projects-list-container">
        <div className="project-rows">
          {projects.map((p) => (
            <ProjectRow key={p.id} project={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
