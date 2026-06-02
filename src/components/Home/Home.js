import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { AiOutlineDownload, AiFillGithub, AiOutlineMail } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { FiArrowDown, FiArrowRight } from "react-icons/fi";
import pdf from "../../Assets/Mazen_Ahmed_FrontEnd.pdf";
import Particle from "../Particle";
import Terminal from "./Terminal";
import Home2 from "./Home2";
import Type from "./Type";

const STATS = [
  { value: "2+", label: "Years Experience" },
  { value: "4", label: "E-commerce Platforms" },
  { value: "8+", label: "Projects Built" },
];

function Home() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section>
      <Container fluid className="home-section" id="home">
        <Particle />
        <Container className="home-content">
          <Row className="align-items-center">
            <Col md={7} className="home-header">
              <span className="hero-badge hero-anim">
                <span className="hero-badge-dot" /> Available for opportunities
              </span>

              <p className="hero-greeting hero-anim">
                Hi there, I'm{" "}
                <span className="wave" role="img" aria-label="wave">
                  👋🏻
                </span>
              </p>

              <h1 className="heading-name hero-anim">
                <span className="main-name">Mazen Ahmed</span>
              </h1>

              <div className="hero-role hero-anim">
                <span className="hero-role-label">&lt;/&gt;</span>
                <div className="hero-type-wrap">
                  <Type />
                </div>
              </div>

              <p className="hero-sub hero-anim">
                Front-End Developer building scalable, high-performance
                e-commerce experiences with React.js, Next.js &amp; Magento 2.
              </p>

              <div className="hero-stats hero-anim">
                {STATS.map((s) => (
                  <div className="hero-stat" key={s.label}>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="hero-cta-row hero-anim">
                <Button
                  variant="primary"
                  href={pdf}
                  target="_blank"
                  className="cv-download-btn-web"
                  aria-label="Download Mazen Ahmed's CV"
                >
                  <AiOutlineDownload style={{ marginRight: "8px" }} />
                  Download CV
                </Button>
                <button
                  type="button"
                  className="hero-ghost-btn"
                  onClick={() => scrollTo("projects")}
                >
                  View My Work <FiArrowRight style={{ marginBottom: "2px" }} />
                </button>

                <div className="hero-social">
                  <a
                    href="https://github.com/mazen323"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                  >
                    <AiFillGithub />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/mazen-elbardan-364061250/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn />
                  </a>
                  <a
                    href="mailto:mazen.ahmed.dev@gmail.com"
                    aria-label="Email"
                  >
                    <AiOutlineMail />
                  </a>
                </div>
              </div>
            </Col>

            <Col md={5} className="hero-visual-col">
              <Terminal />
            </Col>
          </Row>
        </Container>

        <button
          type="button"
          className="scroll-cue"
          onClick={() => scrollTo("about")}
          aria-label="Scroll down"
        >
          <FiArrowDown />
        </button>
      </Container>

      <Home2 />
    </section>
  );
}

export default Home;
