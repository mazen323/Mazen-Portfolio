import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillGithub, AiOutlineMail } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row className="footer-top align-items-center">
          <Col md={7} className="footer-brand">
            <span className="brand-mark">&lt;/&gt;</span>
            <div>
              <h3 className="footer-name">Mazen Ahmed</h3>
              <p className="footer-tagline">
                Front-End Developer · Cairo, Egypt
              </p>
            </div>
          </Col>

          <Col md={5} className="footer-social-col">
            <ul className="footer-icons">
              <li className="social-icons">
                <a
                  href="https://github.com/mazen323"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/in/mazen-elbardan-364061250/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="mailto:mazen.ahmed.dev@gmail.com"
                  aria-label="Email"
                >
                  <AiOutlineMail />
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="footer-divider" />

        <Row className="footer-bottom">
          <Col md={6} className="footer-copywright">
            <p>© {year} Mazen Ahmed. All rights reserved.</p>
          </Col>
          <Col md={6} className="footer-credit">
            <p>Built with React &amp; Three.js</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
