import React from "react";
import ProjectPageLayout from "../components/ProjectPageLayout";
import { getProjectById } from "../data/projects";

export default function Pseudo() {
  const project = getProjectById("pseudo");

  return (
    <ProjectPageLayout>
      <div className="project-top">
        <div className="project-title">Pseudo biofeedback</div>
        <hr width="250px" />
        <div className="project-period">December 2021 - January 2022</div>
        <div className="project-type">
          Short-term lab experience
          <br />
          <div className="supervisors">
            <div className="supervisor">Prof. Jun Rekimoto</div>
          </div>
        </div>
        <div className="project-thumbnail">
          <img src="/img/Pseudo-biofeedback.jpg" width="40%" alt="Pseudo biofeedback" />
        </div>
      </div>

      <div className="project-section">
        <div className="project-section-title">Keywords</div>
        <hr width="250px" />
        <div className="section-contents">
          <div className="keywords">
            <div className="tag">Psychology</div>
            <div className="tag">Biofeedback</div>
            <div className="tag">Sensors</div>
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
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/DKvKp2Z45S0"
              title="Pseudo biofeedback demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <img src="/img/pseudo-thermal.jpg" alt="Thermal feedback device" />
          </div>
        </div>
      </div>
    </ProjectPageLayout>
  );
}
