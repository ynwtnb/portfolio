import React from "react";
import SectionTitle from "../common/SectionTitle";

export default function AwardsSection() {
  return (
    <div className="awards">
      <SectionTitle
        id="awards-title-link"
        title="Awards"
        className="awards-title"
        lineClassName="awards-line"
      />

      <div className="awardlist-container">
        <ul className="award-list">
          <li className="award">
            <a href="">Japan Student Services Organization (JASSO) Scholarship</a> (2025-2028)
            <ul className="award-exp">
              <li>Japanese government scholarship for international students</li>
              <li>Granted approx. 97000 USD</li>
            </ul>
          </li>
          <li className="award">
            <a href="https://cra.org/cra-wp/grad-cohort-for-women/">Grad Cohort for Women</a> (2024)
            <ul className="award-exp">
              <li>Selected as a student for Grad Cohort for Women 2024</li>
            </ul>
          </li>
          <li className="award">
            <a href="http://www.hnf.jp/shogaku/index.html">Heiwa Nakajima Foundation Scholarship</a>{" "}
            (2023-2025)
            <ul className="award-exp">
              <li>Granted approx. 50000 USD</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
