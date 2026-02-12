import React from "react";
import ProjectPageLayout from "../components/ProjectPageLayout";
import { getProjectById } from "../data/projects";

export default function Bdrum() {
  const project = getProjectById("bdrum");

  return (
    <ProjectPageLayout>
      <div className="project-top">
        <div className="project-title">{project?.title ?? "BDrum"}</div>
        <hr width="250px" />
        <div className="project-period">April 2021 - July 2021</div>
        <div className="project-type">
          Course Project
          <br />
          <div className="supervisors">
            <div className="supervisor">The University of Tokyo</div>
          </div>
        </div>
        <div className="project-thumbnail">
          <img src={`${import.meta.env.BASE_URL}img/bdrum.JPG`} width="40%" alt="BDrum device" />
        </div>
      </div>

      <div className="project-section">
        <div className="project-section-title">Keywords</div>
        <hr width="250px" />
        <div className="section-contents">
          <div className="keywords">
            <div className="tag">Device</div>
            <div className="tag">Sound</div>
            <div className="tag">Interaction</div>
          </div>
        </div>
      </div>

      <div className="project-section">
        <div className="project-section-title">Project Summary</div>
        <hr width="250px" />
        <div className="section-contents">
          <div className="research-summary">
            <p>{project?.summary}</p>
          </div>

          <div className="project-thumbnail">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/_k4vpZlWK-w"
              title="BDrum demo video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </ProjectPageLayout>
  );
}
