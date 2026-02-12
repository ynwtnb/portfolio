import { useEffect } from "react";

/**
 * Load a page-specific stylesheet from /public at runtime,
 * and remove it when the page unmounts.
 */
export function usePageStylesheet(href) {
  useEffect(() => {
    if (!href) return;

    const existing = document.querySelector(`link[data-page-style="${href}"]`);
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-page-style", href);
    document.head.appendChild(link);

    return () => {
      const el = document.querySelector(`link[data-page-style="${href}"]`);
      if (el) el.remove();
    };
  }, [href]);
}
