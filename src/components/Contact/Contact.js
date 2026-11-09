import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { FiMail, FiCopy, FiCheck, FiPhone, FiGithub, FiLinkedin, FiDownload } from "react-icons/fi";
import SectionHeader from "../ui/SectionHeader";
import { PROFILE, CV_FILE } from "../../data/profile";

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    return false;
  }
}

function Contact() {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (await copyText(PROFILE.email)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <Container className="section-wrap">
      <div className="contact-card reveal">
        <SectionHeader
          index="06"
          eyebrow="contact"
          title="Got a role or a product in mind?"
          accent="Let's build it."
          lead="I'm always glad to talk about front-end roles, e-commerce products and performance work. Email is the fastest way to reach me."
          align="center"
        />

        <div className="contact-actions">
          <a className="btn-gradient btn-lg" href={`mailto:${PROFILE.email}`}>
            <FiMail /> {PROFILE.email}
          </a>
          <button
            type="button"
            className="hero-ghost-btn"
            onClick={onCopy}
            aria-live="polite"
          >
            {copied ? (
              <>
                <FiCheck /> Copied
              </>
            ) : (
              <>
                <FiCopy /> Copy email
              </>
            )}
          </button>
        </div>

        <ul className="contact-links">
          <li>
            <a href={PROFILE.phoneHref}>
              <FiPhone /> {PROFILE.phone}
            </a>
          </li>
          <li>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
              <FiLinkedin /> LinkedIn
            </a>
          </li>
          <li>
            <a href={PROFILE.github} target="_blank" rel="noreferrer">
              <FiGithub /> GitHub
            </a>
          </li>
          <li>
            <a href={CV_FILE} target="_blank" rel="noreferrer">
              <FiDownload /> CV (PDF)
            </a>
          </li>
        </ul>
      </div>
    </Container>
  );
}

export default Contact;
