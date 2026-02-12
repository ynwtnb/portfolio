import React from "react";
import SectionTitle from "../common/SectionTitle";

const EDUCATION = [
  {
    years: "2023 – Current",
    title: "Northeastern University",
    detail: "Personal Health Informatics, Ph.D. student",
  },
  {
    years: "2022 – 2023",
    title: "The University of Tokyo",
    detail: "Reserch Assistant at the Sensory Perception & Interaction, Research Group, advised by Prof. Karon MacLean",
  },
  {
    years: "2022 – 2023",
    title: "The University of Tokyo",
    detail: "Reserch Assistant at the Human Augmentation Lab, advised by Prof. Jun Rekimoto",
  },
  {
    years: "2022 – 2023",
    title: "The University of Tokyo",
    detail: "Reserch Assistant at the Information Somatics Lab, advised by Prof. Daisuke Uriu",
  },
  {
    years: "2021 – 2022",
    title: "The University of Tokyo",
    detail: "Reserch Assistant at the Cyber Interface Lab, advised by Prof. Takuji Narumi",
  },
  {
    years: "2019 – 2023",
    title: "The University of Tokyo",
    detail: "Information Science Major, Bachelor of Arts and Sciences",
  },
];

export default function EducationSection() {
  return (
    <div className="education">
      <div className="timeline">
        <SectionTitle
          id="education-title-link"
          title="Education & Experience"
          className="education-title"
          lineClassName="education-line"
        />

        {EDUCATION.map((e) => (
          <div className="container right" key={e.years}>
            <div className="content">
              <div className="year-right">
                <p>
                  <b>{e.years}</b>
                </p>
              </div>
              <div className="education title">
                <p>
                  {e.title}
                  <br />
                  {e.detail}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
