import React from "react";
import { Container } from "react-bootstrap";
import { AiFillGithub } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { FiArrowDown, FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import AuditCard from "./AuditCard";
import Ticker from "./Ticker";
import useCairoTime from "../../hooks/useCairoTime";
import { PROFILE } from "../../data/profile";
import cvThumb from "../../Assets/cv-preview.webp";

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function Home() {
  const time = useCairoTime();

  return (
    <div className="hero">
      {/* signature name — first in the DOM for SEO; placed visually by CSS order */}
      <h1 className="hero-name" aria-label={`${PROFILE.name}, Front-End Developer`}>
        <span className="hero-name-row" aria-hidden="true">
          <span className="hero-name-solid">Mazen</span>
          <span className="hero-name-outline">Ahmed</span>
          <a
            className="hero-name-arrow"
            href="#about"
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              scrollTo("about");
            }}
          >
            <FiArrowUpRight />
          </a>
        </span>
      </h1>

      <Container className="hero-inner">
        {/* status bar */}
        <div className="hero-meta hero-anim">
          <span className="hero-meta-item">
            <span className="hero-badge-dot" />
            <span>
              <span className="hide-sm">Front-End Developer @ </span>
              {PROFILE.company}
            </span>
          </span>
          <span className="hero-meta-item hero-meta-time">
            <span>
              Cairo<span className="hide-sm">, Egypt</span> · <time>{time}</time>
              <span className="hide-sm"> GMT+2</span>
            </span>
          </span>
        </div>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker hero-anim">
              React.js <span>/</span> Next.js <span>/</span> Magento 2
            </p>
            <p className="hero-statement hero-anim">
              I build storefronts and platforms that{" "}
              <em className="hero-hl">load fast</em>, read well and{" "}
              <em className="hero-hl hero-hl--alt">ship to production.</em>
            </p>
            <ul className="hero-proof hero-anim" aria-label="Highlights">
              <li>
                <strong>2+</strong>
                <span>years at {PROFILE.company}</span>
              </li>
              <li>
                <strong>5</strong>
                <span>apps in production</span>
              </li>
              <li>
                <strong className="is-accent">98</strong>
                <span>top Lighthouse score</span>
              </li>
            </ul>

            <div className="hero-cta-row hero-anim">
              <button type="button" className="btn-gradient btn-lg" onClick={() => scrollTo("projects")}>
                See the work <FiArrowDownRight />
              </button>
              <button
                type="button"
                className="cv-teaser"
                onClick={() => scrollTo("resume")}
                aria-label="Jump to résumé section"
              >
                <span className="cv-teaser-paper" aria-hidden="true">
                  <img src={cvThumb} alt="" width="820" height="1160" />
                </span>
                <span className="cv-teaser-text">
                  <strong>My résumé</strong>
                  <span>1 page · PDF · ATS-friendly</span>
                </span>
                <span className="cv-teaser-go" aria-hidden="true">
                  <FiArrowDown />
                </span>
              </button>
              <div className="hero-social">
                <a href={PROFILE.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <AiFillGithub />
                </a>
                <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>

          <div className="hero-audit hero-anim">
            <AuditCard />
          </div>
        </div>
      </Container>


      <Ticker />
    </div>
  );
}

export default Home;
