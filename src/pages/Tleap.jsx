import React from "react";
import ProjectPageLayout from "../components/ProjectPageLayout";
import { getProjectById } from "../data/projects";

export default function Tleap() {
  const project = getProjectById("tleap");

  return (
    <ProjectPageLayout>
      <div className="project-top">
        <div className="project-title">{project?.title ?? "T-Leap"}</div>
        <hr width="250px" />
        <div className="project-period">February 2022 - March 2023</div>
        <div className="project-type">
          Research Internship at Information Somatics Lab, The University of Tokyo
          <br />
          <div className="supervisors">
            <div className="supervisor">Prof. Daisuke Uriu</div>
            <div className="supervisor">Prof. Masahiko Inami</div>
          </div>
        </div>
        <div className="project-thumbnail">
          <img src="/img/tleap.jpg" width="40%" alt="T-Leap" />
        </div>
      </div>

      <div className="project-section">
        <div className="project-section-title">Keywords</div>
        <hr width="250px" />
        <div className="section-contents">
          <div className="keywords">
            <div className="tag">Communication</div>
            <div className="tag">Wearable Device</div>
            <div className="tag">Telepresence</div>
            <div className="tag">Human-centered design</div>
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
          <img src="/img/tleap-coretime.jpg" alt="T-Leap system in use" />
        </div>
      </div>

      <div className="project-section">
        <div className="project-section-title">Publication</div>
        <hr width="250px" />
        <div className="section-contents">
          <div className="publication">
            <ul>
              <li>
                <a href="https://dl.acm.org/doi/abs/10.1145/3626705.3627799">
                  Yazaki, T., Uriu, D., <b>Watanabe, Y.,</b> Takagi, R., Kashino, Z., &amp; Inami,
                  M. (2023, December). “Oh, could you also grab that?”: A case study on enabling
                  elderly person to remotely explore a supermarket using a wearable telepresence
                  system. In Proceedings of the 22nd International Conference on Mobile and
                  Ubiquitous Multimedia (pp. 340-352).
                </a>
              </li>
              <li>
                <a href="https://dl.acm.org/doi/abs/10.1145/3626705.3627772">
                  Yazaki, T., <b>Watanabe, Y.,</b> Kong, L., &amp; Inami, M. (2023, December).
                  Design and Field Study of Syn-Leap: A Symmetric Telepresence System for Immersion
                  Switching and Walking Across Multiple Locations. In Proceedings of the 22nd
                  International Conference on Mobile and Ubiquitous Multimedia (pp. 353-365).
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ProjectPageLayout>
  );
}
