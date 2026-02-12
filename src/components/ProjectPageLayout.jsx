import React from "react";
import SiteHeader from "./SiteHeader";
import { usePageStylesheet } from "../utils/usePageStylesheet";

export default function ProjectPageLayout({ children }) {
  usePageStylesheet("/CSS/projects.css");

  return (
    <>
      <SiteHeader variant="project" />
      <main className="project-page">{children}</main>
    </>
  );
}
