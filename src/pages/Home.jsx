import React from "react";
import SiteHeader from "../components/SiteHeader";
import { usePageStylesheet } from "../utils/usePageStylesheet";

import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import EducationSection from "../components/home/EducationSection";
import ProjectsSection from "../components/home/ProjectsSection";
import PublicationsSection from "../components/home/PublicationsSection";
import AwardsSection from "../components/home/AwardsSection";
import ContactSection from "../components/home/ContactSection";
import MoreAboutMeSection from "../components/home/MoreAboutMeSection";

export default function Home() {
  usePageStylesheet("/CSS/style.css");
  usePageStylesheet("/CSS/enhancements.css");

  return (
    <>
      <SiteHeader variant="home" />
      <main>
        <HeroSection />
        <EducationSection />
        <ProjectsSection />
        <PublicationsSection />
        <AwardsSection />
        <ContactSection />
        <MoreAboutMeSection />
      </main>
    </>
  );
}
