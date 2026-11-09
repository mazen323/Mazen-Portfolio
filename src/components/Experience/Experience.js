import React from "react";
import { Container } from "react-bootstrap";
import { FiArrowUpRight, FiCalendar, FiMapPin } from "react-icons/fi";
import SectionHeader from "../ui/SectionHeader";
import { JOB, CASE_STUDIES } from "../../data/profile";

const SHORT = {
  Performance: "perf",
  Accessibility: "a11y",
  SEO: "seo",
  "Best Practices": "bp",
};

/** Performance when we have it, otherwise the project's best real score. */
function headlineMetric(p) {
  if (p.lighthouse.length === 0) return null;
  const perf = p.lighthouse.find((m) => m.label === "Performance");
  const m = perf || p.lighthouse.reduce((a, b) => (b.score > a.score ? b : a));
  return `${m.score} ${SHORT[m.label]}`;
}

function Experience() {
  const jump = (id) => {
    const el = document.getElementById(`case-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <Container className="section-wrap">
      <SectionHeader
        index="02"
        eyebrow="experience"
        title="Two years in,"
        accent="five products live."
        lead="At CrocoIT I own the front end end-to-end — from mapping user flows to deploying to production. Five products so far, all live."
      />

      <div className="job-card reveal">
        <div className="job-head">
          <div>
            <h3 className="job-title">{JOB.title}</h3>
            <span className="job-company">{JOB.company}</span>
          </div>
          <div className="job-meta">
            <span>
              <FiCalendar /> {JOB.period}
            </span>
            <span>
              <FiMapPin /> {JOB.location}
            </span>
          </div>
        </div>

        <ul className="job-points">
          {JOB.points.map((pt) => (
            <li key={pt}>{pt}</li>
          ))}
        </ul>

        <div className="ship-label">Products I shipped</div>
        <ol className="ship-list">
          {CASE_STUDIES.map((p, i) => {
            const metric = headlineMetric(p);
            return (
              <li key={p.id} className="ship-item">
                <button type="button" className="ship-row" onClick={() => jump(p.id)}>
                  <span className="ship-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ship-main">
                    <span className="ship-name">{p.name}</span>
                    <span className="ship-cat">{p.category}</span>
                  </span>
                  <span className="ship-stack">
                    {p.stack.slice(0, 3).map((s) => (
                      <span className="chip" key={s}>
                        {s}
                      </span>
                    ))}
                  </span>
                  {metric ? (
                    <span className="ship-metric">● {metric}</span>
                  ) : (
                    <span className="ship-metric ship-metric--muted">live</span>
                  )}
                  <FiArrowUpRight className="ship-arrow" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </Container>
  );
}

export default Experience;
