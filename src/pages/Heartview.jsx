import React from "react";
import ProjectPageLayout from "../components/ProjectPageLayout";
import { getProjectById } from "../data/projects";

export default function Heartview() {
  const project = getProjectById("heartview");

  return (
    <ProjectPageLayout>
      <div className="project-top">
        <div className="project-title">{project?.title ?? "HeartView"}</div>
        <hr width="250px" />
        <div className="project-period">September 2023 - Current</div>
        <div className="project-type">
          Graduate Research Assistant at Computational Behavioral Science Lab, Northeastern University
          <br />
          <div className="supervisors">
            <div className="supervisor">Prof. Matthew Goodwin</div>
            <div className="supervisor">Prof. Varun Mishra</div>
          </div>
        </div>
        <div className="project-thumbnail">
          <img src="/img/heartview.jpg" width="40%" alt="HeartView" />
        </div>
      </div>

      <div className="project-section">
        <div className="project-section-title">Keywords</div>
        <hr width="250px" />
        <div className="section-contents">
          <div className="keywords">
            <div className="tag">Psychophysiology</div>
            <div className="tag">Sensors</div>
            <div className="tag">Signal Quality Assessment</div>
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
        </div>
      </div>
    </ProjectPageLayout>
  );
}
