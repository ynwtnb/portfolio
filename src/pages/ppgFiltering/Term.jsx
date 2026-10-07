import React, { useId } from "react";
import { GLOSSARY } from "./content";

/** Inline jargon term with a plain-language definition on hover, focus, or tap. */
export default function Term({ k, children }) {
  const id = useId();
  return (
    <span className="ppgf-term" tabIndex={0} aria-describedby={id}>
      {children}
      <span className="tip" role="tooltip" id={id}>
        {GLOSSARY[k]}
      </span>
    </span>
  );
}
