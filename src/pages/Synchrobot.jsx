import React from "react";
import ProjectPageLayout from "../components/ProjectPageLayout";
import { getProjectById } from "../data/projects";

export default function Synchrobot() {
  const project = getProjectById("synchrobot");

  return (
    <ProjectPageLayout>
      <div className="project-top">
        <div className="project-title">{project?.title ?? "Synchrobot"}</div>
        <hr width="250px" />
        <div className="project-period">May 2022 - April 2023</div>
        <div className="project-type">
          Research Internship at Sensory Perception &amp; Interaction Research Group,
          <br /> The University of British Columbia
          <br />
          <div className="supervisors">
            <div className="supervisor">Prof. Karon MacLean</div>
            <div className="supervisor">Prof. Jun Rekimoto</div>
          </div>
        </div>

        <div className="project-thumbnail">
          <img src={`${import.meta.env.BASE_URL}img/synchrobot.jpg`} width="40%" alt="Synchrobot" />
        </div>
      </div>

      <div className="project-section">
        <div className="project-section-title">Keywords</div>
        <hr width="250px" />
        <div className="section-contents">
          <div className="keywords">
            <div className="tag">Expressive Biosignals</div>
            <div className="tag">Collaboration</div>
            <div className="tag">Psychology</div>
            <div className="tag">Sensors</div>
            <div className="tag">Haptics</div>
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
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/VLMgpfpZChw"
            title="Synchrobots demo video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <br />
          <img src={`${import.meta.env.BASE_URL}img/synchrobot-setting.jpg`} alt="Synchrobot study setting" />
        </div>
      </div>

      <div className="project-section">
        <div className="project-section-title">Publication</div>
        <hr width="250px" />
        <div className="section-contents">
          <div className="publication">
            <ul>
              <li>
                <a href="https://dl.acm.org/doi/abs/10.1145/3544549.3583896">
                  <b>Yuna Watanabe</b>, Xi Laura Cang, Rúbia Reis Guerra, Devyani McLaren, Preeti
                  Vyas, Jun Rekimoto, and Karon E MacLean. (2023). “Demonstrating Virtual Teamwork
                  with Synchrobots: A Robot-Mediated Approach to Improving Connectedness,” CHI EA
                  '23: Extended Abstracts of the 2023 CHI Conference on Human Factors in Computing
                  Systems.
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ProjectPageLayout>
  );
}
