import React from "react";
import ProjectPageLayout from "../components/ProjectPageLayout";
import { getProjectById } from "../data/projects";

export default function VirtualCoembodiment() {
  const project = getProjectById("virtual-coembodiment");

  return (
    <ProjectPageLayout>
      <div className="project-top">
        <div className="project-title">Virtual Co-embodiment and we-mode</div>
        <hr width="250px" />
        <div className="project-period">August 2021 - February 2022</div>
        <div className="project-type">
          Research Internship at Cyber Interface Lab, The University of Tokyo
          <br />
          <div className="supervisors">
            <div className="supervisor">Prof. Takuji Narumi</div>
          </div>
        </div>
        <div className="project-thumbnail">
          <img src={`${import.meta.env.BASE_URL}img/virtual-coembodiment.jpg`} width="40%" alt="Virtual Co-embodiment" />
        </div>
      </div>

      <div className="project-section">
        <div className="project-section-title">Keywords</div>
        <hr width="250px" />
        <div className="section-contents">
          <div className="keywords">
            <div className="tag">Virtual Reality</div>
            <div className="tag">Psychology</div>
            <div className="tag">Collaboration</div>
          </div>
        </div>
      </div>

      <div className="project-section">
        <div className="project-section-title">Research Summary</div>
        <hr width="250px" />
        <div className="section-contents">
          <div className="research-summary">
            <p>{project?.summary}</p>
          </div>

          <div className="project-thumbnail">
            <img src={`${import.meta.env.BASE_URL}img/virtual-coembodiment-gif.gif`} width="40%" alt="Co-embodiment demo" />
          </div>
          <br />
          <div className="project-thumbnail">
            <img src={`${import.meta.env.BASE_URL}img/simontask.png`} width="80%" alt="Study task" />
          </div>
        </div>
      </div>
    </ProjectPageLayout>
  );
}
