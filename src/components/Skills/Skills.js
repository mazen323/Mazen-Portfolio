import React from "react";
import { Container } from "react-bootstrap";
import {
  SiJavascript,
  SiReact,
  SiMagento,
  SiGraphql,
  SiGit,
} from "react-icons/si";
import { FiCheckCircle, FiAward, FiBookOpen } from "react-icons/fi";
import SectionHeader from "../ui/SectionHeader";
import { SKILL_GROUPS, EDUCATION, CERTIFICATIONS } from "../../data/profile";

const GROUP_ICONS = {
  lang: <SiJavascript />,
  fw: <SiReact />,
  ecom: <SiMagento />,
  api: <SiGraphql />,
  tools: <SiGit />,
  practice: <FiCheckCircle />,
};

function Skills() {
  return (
    <Container className="section-wrap">
      <SectionHeader
        index="04"
        eyebrow="skills"
        title="The tools I"
        accent="work with every day."
        lead="From React and Next.js to Magento 2 and GraphQL — the stack behind every product above."
      />

      <div className="skill-grid">
        {SKILL_GROUPS.map((g) => (
          <article className="skill-card spotlight reveal" key={g.key}>
            <div className="skill-card-head">
              <span className="skill-icon">{GROUP_ICONS[g.key]}</span>
              <h3>{g.title}</h3>
            </div>
            <div className="chip-row">
              {g.items.map((it) => (
                <span className="chip chip--lg" key={it}>
                  {it}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="cred-grid">
        <article className="cred-card reveal">
          <div className="skill-card-head">
            <span className="skill-icon">
              <FiBookOpen />
            </span>
            <h3>Education</h3>
          </div>
          <div className="edu">
            <div className="edu-top">
              <strong>{EDUCATION.degree}</strong>
              <span className="edu-period">{EDUCATION.period}</span>
            </div>
            <p>{EDUCATION.school}</p>
            <div className="chip-row">
              {EDUCATION.details.map((d) => (
                <span className="chip" key={d}>
                  {d}
                </span>
              ))}
            </div>
          </div>
        </article>

        <article className="cred-card reveal">
          <div className="skill-card-head">
            <span className="skill-icon">
              <FiAward />
            </span>
            <h3>Certifications</h3>
          </div>
          <ul className="cert-list">
            {CERTIFICATIONS.map((c) => (
              <li key={c.title}>
                <span className="cert-name">{c.title}</span>
                <span className="cert-issuer">{c.issuer}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </Container>
  );
}

export default Skills;
