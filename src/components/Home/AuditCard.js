import React, { useEffect, useRef, useState } from "react";
import { FiLock, FiPause, FiPlay } from "react-icons/fi";
import LighthouseRing from "../ui/LighthouseRing";
import { CASE_STUDIES } from "../../data/profile";

const ORDER = ["Performance", "Accessibility", "SEO", "Best Practices"];
const CYCLE_MS = 4200;

/**
 * Interactive "Lighthouse report" widget: pick a production site and its
 * real mobile scores animate in. Auto-cycles until the visitor interacts.
 */
function AuditCard() {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const tabsRef = useRef([]);
  const project = CASE_STUDIES[index];

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!auto || hover || reduced) return undefined;
    const id = setTimeout(() => setIndex((i) => (i + 1) % CASE_STUDIES.length), CYCLE_MS);
    return () => clearTimeout(id);
  }, [index, auto, hover]);

  // keep the active tab centred inside the scrollable strip (without moving the page)
  useEffect(() => {
    const tab = tabsRef.current[index];
    if (!tab) return;
    const strip = tab.parentElement;
    const left = tab.offsetLeft - strip.clientWidth / 2 + tab.offsetWidth / 2;
    strip.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [index]);

  const select = (i) => {
    setIndex(i);
    setAuto(false);
  };

  const onKeyDown = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + CASE_STUDIES.length) % CASE_STUDIES.length;
    select(next);
    if (tabsRef.current[next]) tabsRef.current[next].focus();
  };

  const scores = ORDER.map((label) => project.lighthouse.find((m) => m.label === label) || { label, score: null });

  const jump = () => {
    const el = document.getElementById(`case-${project.id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div
      className="audit"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="audit-head">
        <span className="audit-title">
          <span className="audit-live" aria-hidden="true" /> Lighthouse · mobile
        </span>
        <button
          type="button"
          className="audit-toggle"
          onClick={() => setAuto((a) => !a)}
          aria-label={auto ? "Pause auto-play" : "Resume auto-play"}
        >
          {auto ? <FiPause /> : <FiPlay />}
        </button>
      </div>

      <div className="audit-tabs" role="tablist" aria-label="Production sites" onKeyDown={onKeyDown}>
        {CASE_STUDIES.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => (tabsRef.current[i] = el)}
            type="button"
            role="tab"
            id={`audit-tab-${p.id}`}
            aria-selected={i === index}
            aria-controls="audit-panel"
            tabIndex={i === index ? 0 : -1}
            className={`audit-tab ${i === index ? "is-active" : ""}`}
            onClick={() => select(i)}
          >
            {p.name.replace(" Company Website", "").replace(" for Luggage", "").replace(" Online Academy", "")}
            {i === index && auto && !hover && (
              <span className="audit-progress" style={{ animationDuration: `${CYCLE_MS}ms` }} />
            )}
          </button>
        ))}
      </div>

      <div className="audit-url">
        <FiLock aria-hidden="true" /> https://{project.domain}
      </div>

      <div
        className="audit-panel"
        id="audit-panel"
        role="tabpanel"
        aria-labelledby={`audit-tab-${project.id}`}
        key={project.id}
      >
        {scores.map((s) =>
          s.score == null ? (
            <div className="lh-ring lh-na" key={s.label}>
              <div className="lh-gauge" style={{ width: 58, height: 58 }}>
                <span className="lh-score">N/A</span>
              </div>
              <span className="lh-label">{s.label}</span>
            </div>
          ) : (
            <LighthouseRing key={s.label} score={s.score} label={s.label} size={58} />
          )
        )}
      </div>

      {project.perfNote && <p className="audit-note">{project.perfNote}</p>}

      <div className="audit-foot">
        <span>{project.stack.slice(0, 3).join(" · ")}</span>
        <button type="button" className="text-link" onClick={jump}>
          Case study ↓
        </button>
      </div>
    </div>
  );
}

export default AuditCard;
