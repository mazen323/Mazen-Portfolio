import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import pdf from "../../Assets/Mazen_Ahmed_Frontend_Developer.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import { FiFileText, FiMaximize2, FiX } from "react-icons/fi";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FILE_NAME = "Mazen_Ahmed_Frontend_Developer.pdf";

function ResumeNew() {
  const [width, setWidth] = useState(1200);
  const [numPages, setNumPages] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock background scroll and close on Escape while the modal is open.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Fit each page to the container width so nothing overflows horizontally.
  const previewWidth = Math.min(width - 80, 800);
  const modalWidth = Math.min(width - 80, 820);

  const DownloadButton = (
    <a
      className="resume-download-btn"
      href={pdf}
      target="_blank"
      rel="noreferrer"
      aria-label="Download Mazen Ahmed's CV"
    >
      <AiOutlineDownload />
      <span>Download</span>
    </a>
  );

  return (
    <Container fluid className="resume-section">
      <h1 className="project-heading reveal">
        My <strong className="purple">Resume</strong>
      </h1>
      <p className="resume-subtitle reveal">
        A quick look at my experience, skills, and background.
      </p>

      <div className="resume-viewer reveal">
        <div className="resume-viewer__bar">
          <div className="resume-viewer__meta">
            <FiFileText className="resume-viewer__icon" />
            <span className="resume-viewer__name">{FILE_NAME}</span>
          </div>
          {DownloadButton}
        </div>

        <button
          type="button"
          className="resume-preview"
          onClick={() => setOpen(true)}
          aria-label="Open full résumé"
        >
          <Document
            file={pdf}
            loading={<div className="resume-loading">Loading résumé…</div>}
            error={
              <div className="resume-loading">Couldn’t load the résumé.</div>
            }
            className="resume-doc"
          >
            <Page
              pageNumber={1}
              width={previewWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="resume-page"
            />
          </Document>
          <span className="resume-preview__overlay">
            <FiMaximize2 />
            View full CV
          </span>
        </button>
      </div>

      {open && (
        <div
          className="resume-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Résumé"
          onClick={() => setOpen(false)}
        >
          <div
            className="resume-modal__panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resume-modal__bar">
              <div className="resume-viewer__meta">
                <FiFileText className="resume-viewer__icon" />
                <span className="resume-viewer__name">{FILE_NAME}</span>
              </div>
              <div className="resume-modal__actions">
                {DownloadButton}
                <button
                  type="button"
                  className="resume-modal__close"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <FiX />
                </button>
              </div>
            </div>

            <div className="resume-modal__doc">
              <Document
                file={pdf}
                onLoadSuccess={({ numPages: n }) => setNumPages(n)}
                loading={<div className="resume-loading">Loading résumé…</div>}
                error={
                  <div className="resume-loading">
                    Couldn’t load the résumé.
                  </div>
                }
                externalLinkTarget="_blank"
                externalLinkRel="noopener noreferrer"
                className="resume-doc"
              >
                {Array.from({ length: numPages || 1 }, (_, i) => (
                  <Page
                    key={`page_${i + 1}`}
                    pageNumber={i + 1}
                    width={modalWidth}
                    renderTextLayer={false}
                    renderAnnotationLayer
                    className="resume-page"
                  />
                ))}
              </Document>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default ResumeNew;
