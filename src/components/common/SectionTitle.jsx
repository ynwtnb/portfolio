import React from "react";

export default function SectionTitle({ id, title, className, lineClassName, lineWidth = "250px" }) {
  return (
    <>
      <section id={id}>
        <div className={className}>{title}</div>
      </section>
      <hr className={lineClassName} width={lineWidth} />
    </>
  );
}
