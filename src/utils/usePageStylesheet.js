import { useLayoutEffect } from "react";

const LOADING_ATTR = "data-page-styles-loading";
const LOAD_TIMEOUT_MS = 3000;

let pendingStylesheets = 0;

/**
 * Hide the page (see the inline style in index.html) until the link has loaded.
 * Returns a function that stops waiting for it.
 */
function holdPageUntilLoaded(link) {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    pendingStylesheets -= 1;
    if (pendingStylesheets === 0) {
      document.documentElement.removeAttribute(LOADING_ATTR);
    }
  };
  // Never leave the page hidden if the request hangs.
  const timer = setTimeout(finish, LOAD_TIMEOUT_MS);

  pendingStylesheets += 1;
  document.documentElement.setAttribute(LOADING_ATTR, "");
  link.addEventListener("load", finish);
  link.addEventListener("error", finish);
  return finish;
}

/**
 * Load a page-specific stylesheet from /public at runtime,
 * and remove it when the page unmounts.
 * Uses a layout effect so the page is hidden before the browser paints it unstyled.
 */
export function usePageStylesheet(href) {
  useLayoutEffect(() => {
    if (!href) return;

    const existing = document.querySelector(`link[data-page-style="${href}"]`);
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-page-style", href);
    const stopHolding = holdPageUntilLoaded(link);
    document.head.appendChild(link);

    return () => {
      stopHolding();
      const el = document.querySelector(`link[data-page-style="${href}"]`);
      if (el) el.remove();
    };
  }, [href]);
}
