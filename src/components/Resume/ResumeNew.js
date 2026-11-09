import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Container } from "react-bootstrap";
import {
  FiDownload,
  FiEye,
  FiLink,
  FiCheck,
  FiX,
  FiFileText,
  FiExternalLink,
} from "react-icons/fi";
import SectionHeader from "../ui/SectionHeader";
import { copyText } from "../Contact/Contact";
import { CV_FILE, CV_FILE_NAME } from "../../data/profile";
import cvPreview from "../../Assets/cv-preview.webp";
import cvFull from "../../Assets/cv-full.webp";

const CONTENTS = [
  ["Professional summary", "2+ yrs · React.js / Next.js / Magento 2"],
  ["Technical skills", "6 groups · 30+ skills"],
  ["Experience", "CrocoIT · 5 production apps"],
  ["Education", "B.Sc. Computer Science · GPA 3.22"],
  ["Certifications", "Route · Eraasoft · Microsoft"],
];

/** Résumé as a document on a desk: tilted paper stack + file details panel. */
function ResumeNew() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    if (closeRef.current) closeRef.current.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      if (trigger) trigger.focus();
    };
  }, [open]);

  const onCopy = async () => {
    const url = new URL(CV_FILE, window.location.href).href;
    if (await copyText(url)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <Container className="section-wrap">
      <SectionHeader
        index="05"
        eyebrow="resume"
        title="My experience,"
        accent="on one page."
        lead="Prefer the short version? Here is my CV — my experience, skills and education on a single page."
        align="center"
      />

      <div className="desk reveal">
        <button
          type="button"
          className="paper-stack"
          onClick={() => setOpen(true)}
          ref={triggerRef}
          aria-label="Preview résumé"
        >
          <span className="paper paper--back2" aria-hidden="true" />
          <span className="paper paper--back1" aria-hidden="true" />
          <span className="paper paper--front">
            <img
              src={cvPreview}
              alt="Page 1 of Mazen Ahmed's résumé"
              loading="lazy"
              width="820"
              height="1160"
            />
            <span className="paper-hint">
              <FiEye /> Preview
            </span>
          </span>
        </button>

        <aside className="file-panel">
          <div className="file-chip">
            <span className="file-icon">
              <FiFileText />
            </span>
            <span className="file-meta">
              <strong title={CV_FILE_NAME}>{CV_FILE_NAME}</strong>
              <span>PDF · 1 page · 52 KB · ATS-friendly</span>
            </span>
          </div>

          <ol className="file-toc">
            {CONTENTS.map(([title, detail], i) => (
              <li key={title}>
                <span className="file-toc-n">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="file-toc-t">{title}</span>
                <span className="file-toc-d">{detail}</span>
              </li>
            ))}
          </ol>

          <div className="file-actions">
            <a className="btn-gradient" href={CV_FILE} download={CV_FILE_NAME}>
              <FiDownload /> Download PDF
            </a>
            <button
              type="button"
              className="hero-ghost-btn"
              onClick={() => setOpen(true)}
            >
              <FiEye /> Preview
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={onCopy}
              aria-label="Copy link to CV"
              aria-live="polite"
            >
              {copied ? <FiCheck /> : <FiLink />}
            </button>
          </div>
        </aside>
      </div>

      {open &&
        createPortal(
          <div
            className="cv-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Résumé preview"
            onClick={() => setOpen(false)}
          >
            <div className="cv-modal-bar" onClick={(e) => e.stopPropagation()}>
              <span className="cv-modal-name">
                <FiFileText /> {CV_FILE_NAME}
              </span>
              <div className="cv-modal-actions">
                <a
                  className="icon-btn"
                  href={CV_FILE}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open PDF in new tab"
                >
                  <FiExternalLink />
                </a>
                <a
                  className="icon-btn"
                  href={CV_FILE}
                  download={CV_FILE_NAME}
                  aria-label="Download PDF"
                >
                  <FiDownload />
                </a>
                <button
                  type="button"
                  className="icon-btn"
                  ref={closeRef}
                  onClick={() => setOpen(false)}
                  aria-label="Close preview"
                >
                  <FiX />
                </button>
              </div>
            </div>
            <div className="cv-modal-scroll">
              <img
                src={cvFull}
                alt="Mazen Ahmed's résumé"
                className="cv-modal-page"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>,
          document.body,
        )}
    </Container>
  );
}

export default ResumeNew;
