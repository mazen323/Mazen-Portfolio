import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import pdf from "../../Assets/Mazen_Ahmed_Frontend_Developer.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import { FiFileText } from "react-icons/fi";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ResumeNew() {
  const [width, setWidth] = useState(1200);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Scale the page to comfortably fit the viewer on each breakpoint.
  const pageScale = width > 1200 ? 1.5 : width > 786 ? 1.2 : 0.58;

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
            <span className="resume-viewer__name">
              Mazen_Ahmed_Frontend_Developer.pdf
            </span>
          </div>
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
        </div>

        <div className="resume-viewer__doc">
          <Document
            file={pdf}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            loading={<div className="resume-loading">Loading résumé…</div>}
            error={
              <div className="resume-loading">Couldn’t load the résumé.</div>
            }
            className="resume-doc"
          >
            {Array.from({ length: numPages || 1 }, (_, i) => (
              <Page
                key={`page_${i + 1}`}
                pageNumber={i + 1}
                scale={pageScale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="resume-page"
              />
            ))}
          </Document>
        </div>
      </div>
    </Container>
  );
}

export default ResumeNew;
