import React, { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import {
  FiArrowUpRight,
  FiCheck,
  FiGithub,
  FiExternalLink,
  FiLock,
  FiChevronDown,
} from "react-icons/fi";
import SectionHeader from "../ui/SectionHeader";
import LighthouseRing from "../ui/LighthouseRing";
import { CASE_STUDIES, SIDE_PROJECTS } from "../../data/profile";

function BrowserShot({ project }) {
  return (
    <a
      className="browser"
      href={project.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Visit ${project.name} (opens in a new tab)`}
    >
      <div className="browser-bar">
        <span className="terminal-dot red" />
        <span className="terminal-dot yellow" />
        <span className="terminal-dot green" />
        <span className="browser-url">
          <FiLock /> {project.domain}
        </span>
      </div>
      <div className="browser-view">
        <img
          src={project.image}
          alt={`${project.name} homepage`}
          loading="lazy"
        />
        <span className="browser-cta">
          Visit live site <FiArrowUpRight />
        </span>
      </div>
    </a>
  );
}

function CaseStudy({ project, index }) {
  const [open, setOpen] = useState(false);
  const articleRef = useRef(null);
  const pointsId = `case-points-${project.id}`;

  // Toggle via classList: re-rendering className would wipe the
  // "is-visible" class the reveal observer adds, hiding the card.
  useEffect(() => {
    articleRef.current?.classList.toggle("is-open", open);
  }, [open]);

  return (
    <article
      ref={articleRef}
      id={`case-${project.id}`}
      className={`case ${index % 2 ? "case--flip" : ""} reveal`}
    >
      <BrowserShot project={project} />

      <div className="case-body">
        <span className="case-cat">{project.category}</span>
        <h3 className="case-title">{project.name}</h3>
        <p className="case-summary">{project.summary}</p>

        <button
          type="button"
          className="case-more"
          aria-expanded={open}
          aria-controls={pointsId}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Hide details" : `What I did · ${project.points.length}`}
          <FiChevronDown aria-hidden="true" />
        </button>
        <ul className="case-points" id={pointsId}>
          {project.points.map((pt) => (
            <li key={pt}>
              <FiCheck aria-hidden="true" /> {pt}
            </li>
          ))}
        </ul>

        {(project.lighthouse.length > 0 || project.vitals) && (
          <div className="case-metrics">
            {project.lighthouse.map((m) => (
              <LighthouseRing key={m.label} score={m.score} label={m.label} />
            ))}
            {project.vitals &&
              project.vitals.map((v) => (
                <div className="vital" key={v.label}>
                  <strong>{v.value}</strong>
                  <span>{v.label}</span>
                </div>
              ))}
            <span className="case-metrics-note">Mobile Lighthouse</span>
          </div>
        )}

        {project.perfNote && (
          <p className="audit-note case-note">{project.perfNote}</p>
        )}

        <div className="case-foot">
          <div className="chip-row">
            {project.stack.map((s) => (
              <span className="chip" key={s}>
                {s}
              </span>
            ))}
          </div>
          <a
            className="text-link"
            href={project.url}
            target="_blank"
            rel="noreferrer"
          >
            {project.domain} <FiArrowUpRight />
          </a>
        </div>
      </div>
    </article>
  );
}

function SideProject({ p }) {
  return (
    <article className="mini-card spotlight reveal">
      <div className="mini-thumb">
        <img src={p.image} alt={`${p.name} screenshot`} loading="lazy" />
      </div>
      <div className="mini-body">
        <h4>{p.name}</h4>
        <p>{p.text}</p>
        <div className="chip-row chip-row--sm">
          {p.stack.map((s) => (
            <span className="chip" key={s}>
              {s}
            </span>
          ))}
        </div>
        <div className="mini-links">
          <a
            href={p.repo}
            target="_blank"
            rel="noreferrer"
            aria-label={`${p.name} source on GitHub`}
          >
            <FiGithub /> Code
          </a>
          <a
            href={p.demo}
            target="_blank"
            rel="noreferrer"
            aria-label={`${p.name} live demo`}
          >
            <FiExternalLink /> Demo
          </a>
        </div>
      </div>
    </article>
  );
}

function Projects() {
  return (
    <Container className="section-wrap">
      <SectionHeader
        index="03"
        eyebrow="selected work"
        title="Products I built,"
        accent="and how they perform."
        lead="Five client products I built and shipped at CrocoIT — from the first component to production. I measure every launch, so each one comes with its Lighthouse scores."
      />

      <div className="case-list">
        {CASE_STUDIES.map((p, i) => (
          <CaseStudy project={p} index={i} key={p.id} />
        ))}
      </div>

      <p className="case-footnote reveal">
        * Performance scores are from my launch audits. Accessibility, SEO and best-practice scores
        were re-checked on the live sites in Nov 2026.
      </p>

      <div className="playground">
        <h3 className="sub-heading reveal">
          <span className="section-index">03.1</span> Where I started
        </h3>
        <p className="sub-lead reveal">
          Personal projects from my early days, where I built my foundations in
          JavaScript, APIs and responsive layout.
          <span className="swipe-hint" aria-hidden="true">
            Swipe →
          </span>
        </p>
        <div className="mini-grid">
          {SIDE_PROJECTS.map((p) => (
            <SideProject p={p} key={p.name} />
          ))}
        </div>
      </div>
    </Container>
  );
}

export default Projects;
