import React from "react";
import { Container } from "react-bootstrap";
import Tilt from "react-parallax-tilt";
import { FiZap, FiShoppingBag, FiLayout } from "react-icons/fi";
import myImg from "../../Assets/Projects/Mazen_Elbardan.jpg";
import SectionHeader from "../ui/SectionHeader";
import useCairoTime, { tenureSince } from "../../hooks/useCairoTime";
import { PROFILE, PILLARS, LANGUAGES, JOB } from "../../data/profile";

const PILLAR_ICONS = {
  perf: <FiZap />,
  commerce: <FiShoppingBag />,
  ux: <FiLayout />,
};

function About() {
  const time = useCairoTime();

  return (
    <Container className="section-wrap">
      <div className="bento">
        {/* portrait */}
        <figure className="bento-tile bento-photo reveal">
          <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            glareEnable={false}
            className="bento-photo-tilt"
          >
            <img src={myImg} alt="Mazen Ahmed" loading="lazy" />
          </Tilt>
          <figcaption>
            <strong>{PROFILE.fullName}</strong>
            <span>{PROFILE.role}</span>
          </figcaption>
        </figure>

        {/* bio */}
        <div className="bento-tile bento-bio reveal">
          <SectionHeader
            index="01"
            eyebrow="about me"
            title="A front-end developer who obsesses over"
            accent="speed & detail."
          />
          <p className="about-text">{PROFILE.summary}</p>
          <p className="about-text">{PROFILE.summary2}</p>
        </div>

        {/* live facts */}
        <div className="bento-tile bento-fact reveal">
          <span className="bento-label">Now</span>
          <strong className="bento-big">{PROFILE.company}</strong>
          <span className="bento-small">{JOB.title}</span>
          <span className="bento-chip">{tenureSince("2024-05")}</span>
          <span className="bento-pulse" aria-hidden="true" />
        </div>

        <div className="bento-tile bento-fact reveal">
          <span className="bento-label">Based in</span>
          <strong className="bento-big">Cairo</strong>
          <span className="bento-small">
            Egypt · <time>{time}</time> local
          </span>
        </div>

        <div className="bento-tile bento-fact bento-fact--langs reveal">
          <span className="bento-label">Speaks</span>
          <ul className="bento-langs">
            {LANGUAGES.map((l) => (
              <li key={l.name}>
                <strong>{l.name}</strong>
                <span>{l.level}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* what I bring */}
        <div className="bento-pillars">
          {PILLARS.map((p, i) => (
            <article
              className="bento-tile bento-pillar spotlight reveal"
              key={p.key}
            >
              <div className="bento-pillar-top">
                <span className="pillar-icon">{PILLAR_ICONS[p.key]}</span>
                <span className="bento-index">0{i + 1}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default About;
