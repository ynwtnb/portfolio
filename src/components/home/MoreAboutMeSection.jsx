import React from "react";
import SectionTitle from "../common/SectionTitle";

export default function MoreAboutMeSection() {
  return (
    <div className="more-aboutme">
      <SectionTitle
        id="more-aboutme-title-link"
        title="More about me"
        className="more-aboutme-title"
        lineClassName="more-aboutme-line"
      />

      <div className="more-aboutme-container">
        <div className="more-aboutme-content">
          <p>Things I love: </p>
          <ul className="things-love">
            <li>Cooking</li>
            <li>Workout (Yoga & Pilates)</li>
            <li>Piano</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
