import React from "react";
import ProjectPageLayout from "../components/ProjectPageLayout";
import { getProjectById } from "../data/projects";

export default function Openrbsync() {
  const project = getProjectById("openrbsync");

  return (
    <ProjectPageLayout>
      <div className="project-top">
        <div className="project-title">{project?.title ?? "OpenRBSync"}</div>
        <hr width="250px" />
        <div className="project-period">June 2022 - July 2022</div>
        <div className="project-type">
          Research Assistantship at Human Augmentation Lab, The University of Tokyo
          <br />
          <div className="supervisors">
            <div className="supervisor">Prof. Jun Rekimoto</div>
          </div>
        </div>
        <div className="project-thumbnail">
          <img src={`${import.meta.env.BASE_URL}img/openrbsync.png`} width="40%" alt="OpenRBSync" />
        </div>
      </div>

      <div className="project-section">
        <div className="project-section-title">Keywords</div>
        <hr width="250px" />
        <div className="section-contents">
          <div className="keywords">
            <div className="tag">Biosignals</div>
            <div className="tag">Sensors</div>
            <div className="tag">Communication</div>
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
        <div className="project-thumbnail">
          <img src={`${import.meta.env.BASE_URL}img/openrbsync-system-config.jpeg`} alt="OpenRBSync system config" />
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/r4I2nQhg39Q"
            title="OpenRBSync demo video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </ProjectPageLayout>
  );
}
