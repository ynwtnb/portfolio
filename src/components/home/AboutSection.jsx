import React from "react";
import SectionTitle from "../common/SectionTitle";

export default function AboutSection() {
  return (
    <div className="about">
      <SectionTitle
        id="about-title-link"
        title="About me"
        className="about-title"
        lineClassName="about-line"
      />

      <div className="about-content">
        <div className="about-profile">
          <div className="about-name">
            <ul>
              <li className="eng-name">Yuna Watanabe</li>
            </ul>
            <br />
            <ul className="eng-profile">
              <li>
                Ph.D. student at Computational Behavioral Science Laboratory,
                advised by Professor{" "}
                <a href="https://www.khoury.northeastern.edu/people/matthew-goodwin/">
                  Matthew Goodwin
                </a> and Professor{" "}
                <a href="https://www.khoury.northeastern.edu/people/varun-mishra/">
                  Varun Mishra
                </a>
              </li>
              <br />
              <li>
                Khoury College of Computer Science and Bouve College of Health
                Science, Northeastern University
              </li>
            </ul>
          </div>

          <div className="resume-button">
            <button
              type="button"
              className="resume"
              onClick={() =>
                window.open(
                  "https://drive.google.com/file/d/1AC5oKfUAFUupE1CZEJ_IvwpSq4VhfmhP/view?usp=sharing",
                  "_blank",
                )
              }
            >
              Curriculum Vitae
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
