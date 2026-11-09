import React from "react";

/** Consistent section heading: code-comment eyebrow, title with gradient accent, lead. */
function SectionHeader({ index, eyebrow, title, accent, lead, align = "left" }) {
  return (
    <header className={`section-header section-header--${align} reveal`}>
      <span className="section-eyebrow">
        <span className="eyebrow-slash" aria-hidden="true">
          {"//"}
        </span>
        <span className="section-index">{index}</span>
        <span className="eyebrow-text">{eyebrow}</span>
      </span>
      <h2 className="section-title">
        {title} {accent && <span className="gradient-text">{accent}</span>}
      </h2>
      {lead && <p className="section-lead">{lead}</p>}
    </header>
  );
}

export default SectionHeader;
