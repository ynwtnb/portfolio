import React from "react";
import SectionTitle from "../common/SectionTitle";

export default function ContactSection() {
  return (
    <div className="contact">
      <SectionTitle
        id="contact-title-link"
        title="Contact"
        className="contact-title"
        lineClassName="contact-line"
      />

      <div className="contact-contents">
        <ul className="contact-info">
          <li>Yuna Watanabe</li>
          <li>email: watanabe.y [at] northeastern.edu</li>
        </ul>
      </div>
    </div>
  );
}
