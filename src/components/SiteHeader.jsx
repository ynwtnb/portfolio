import React from "react";

/**
 * Shared site header.
 * - variant="home": uses in-page anchors.
 * - variant="project": links back to home sections.
 */
export default function SiteHeader({ variant = "home" }) {
  const isHome = variant === "home";

  const homeLinks = [
    // { label: "About", href: "#about-title-link" },
    { label: "Education", href: "#education-title-link" },
    { label: "Projects", href: "#projects-title-link" },
    { label: "Publications", href: "#publications-title-link" },
    { label: "Awards", href: "#awards-title-link" },
    { label: "Contact", href: "#contact-title-link" },
    { label: "More", href: "#more-aboutme-title-link" },
  ];

  const projectLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/#projects-title-link" },
    { label: "Publications", href: "/#publications-title-link" },
    { label: "Awards", href: "/#awards-title-link" },
    { label: "Contact", href: "/#contact-title-link" },
  ];

  const links = isHome ? homeLinks : projectLinks;

  return (
    <header>
      <div className="header-title">
        {isHome ? "Yuna Watanabe" : <a href="/">Yuna Watanabe</a>}
      </div>
      <nav className="header-content">
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
