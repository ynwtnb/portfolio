import React from "react";
import SectionTitle from "../common/SectionTitle";
import PublicationCard from "./PublicationCard";
import { publications } from "../../data/publications";

export default function PublicationsSection() {
  return (
    <div className="publications">
      <SectionTitle
        id="publications-title-link"
        title="Publications"
        className="publications-title"
        lineClassName="publications-line"
      />

      <div className="publist-container">
        <div className="pub-cards">
          {publications.map((pub) => (
            <PublicationCard key={pub.id} pub={pub} />
          ))}
        </div>
      </div>
    </div>
  );
}
