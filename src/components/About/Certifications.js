import React from "react";
import { Row, Col } from "react-bootstrap";
import {
  SiReact,
  SiMicrosoft,
  SiAmazonaws,
  SiCoursera,
  SiFreecodecamp,
  SiGoogle,
} from "react-icons/si";

function Certifications() {
  return (
    <Row
      style={{
        justifyContent: "center",
        paddingBottom: "40px",
        paddingTop: "20px",
      }}
    >
      <h1
        className="project-heading"
        style={{ paddingBottom: "30px", textAlign: "center" }}
      >
        <strong className="purple">Certifications</strong>
      </h1>
      <Col md={10}>
        <div className="certifications-container">
          <div className="certification-card">
            <div className="cert-icon">
              <SiReact className="icon-glow" />
            </div>
            <span className="cert-title">
              Full Stack Developer Course - Route Academy
            </span>
          </div>
          <div className="certification-card">
            <div className="cert-icon">
              <SiReact className="icon-glow" />
            </div>
            <span className="cert-title">
              Frontend React.js Course - Eraasoft Academy
            </span>
          </div>
          <div className="certification-card">
            <div className="cert-icon">
              <SiMicrosoft className="icon-glow" />
            </div>
            <span className="cert-title">
              Microsoft Technology Associate: Introduction to Programming Using
              Java
            </span>
          </div>
          <div className="certification-card">
            <div className="cert-icon">
              <SiMicrosoft className="icon-glow" />
            </div>
            <span className="cert-title">
              Microsoft Technology Associate: Office PowerPoint
            </span>
          </div>
          <div className="certification-card">
            <div className="cert-icon">
              <SiMicrosoft className="icon-glow" />
            </div>
            <span className="cert-title">
              Microsoft Technology Associate: Software Development Fundamentals
            </span>
          </div>
          <div className="certification-card">
            <div className="cert-icon">
              <SiMicrosoft className="icon-glow" />
            </div>
            <span className="cert-title">
              Microsoft Technology Associate: Network Fundamentals
            </span>
          </div>
          <div className="certification-card">
            <div className="cert-icon">
              <SiCoursera className="icon-glow" />
            </div>
            <span className="cert-title">
              Meta Front-End Developer Professional Certificate - Coursera
              (Meta)
            </span>
          </div>
          <div className="certification-card">
            <div className="cert-icon">
              <SiGoogle className="icon-glow" />
            </div>
            <span className="cert-title">
              Google UX Design Professional Certificate - Coursera (Google)
            </span>
          </div>
          <div className="certification-card">
            <div className="cert-icon">
              <SiFreecodecamp className="icon-glow" />
            </div>
            <span className="cert-title">
              freeCodeCamp Responsive Web Design Certification - freeCodeCamp
            </span>
          </div>
          <div className="certification-card">
            <div className="cert-icon">
              <SiAmazonaws className="icon-glow" />
            </div>
            <span className="cert-title">
              AWS Certified Developer – Associate - Amazon Web Services
            </span>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default Certifications;
