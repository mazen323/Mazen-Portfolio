import React from "react";
import { Container } from "react-bootstrap";
import { AiFillGithub, AiOutlineMail } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { PROFILE } from "../data/profile";
import Logo from "./Logo";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <div className="footer-row">
          <div className="footer-brand">
            <Logo size={34} animated={false} />
            <div>
              <h3 className="footer-name">{PROFILE.fullName}</h3>
              <p className="footer-tagline">
                {PROFILE.role} · {PROFILE.location}
              </p>
            </div>
          </div>

          <ul className="footer-icons">
            <li>
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <AiFillGithub />
              </a>
            </li>
            <li>
              <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </li>
            <li>
              <a href={`mailto:${PROFILE.email}`} aria-label="Email">
                <AiOutlineMail />
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-divider" />

        <div className="footer-row footer-bottom">
          <p>© {year} Mazen Ahmed. All rights reserved.</p>
          <p className="footer-credit">
            Hand-built with React &amp; Three.js
            <span className="footer-kbd">
              {" "}
              · press <kbd>Ctrl</kbd> <kbd>K</kbd>
            </span>
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
