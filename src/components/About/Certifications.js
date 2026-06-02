import React from "react";
import { Row, Col } from "react-bootstrap";
import { SiReact } from "react-icons/si";
import { FaMicrosoft } from "react-icons/fa";

const certifications = [
  { icon: <SiReact className="icon-glow" />, title: "Full Stack Developer Course - Route Academy" },
  { icon: <SiReact className="icon-glow" />, title: "Frontend React.js Course - Eraasoft Academy" },
  {
    icon: <FaMicrosoft className="icon-glow" />,
    title: "Microsoft Technology Associate: Introduction to Programming Using Java",
  },
  {
    icon: <FaMicrosoft className="icon-glow" />,
    title: "Microsoft Technology Associate: Software Development Fundamentals",
  },
  {
    icon: <FaMicrosoft className="icon-glow" />,
    title: "Microsoft Technology Associate: Office PowerPoint",
  },
  {
    icon: <FaMicrosoft className="icon-glow" />,
    title: "Microsoft Technology Associate: Network Fundamentals",
  },
];

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
          {certifications.map((cert) => (
            <div className="certification-card reveal" key={cert.title}>
              <div className="cert-icon">{cert.icon}</div>
              <span className="cert-title">{cert.title}</span>
            </div>
          ))}
        </div>
      </Col>
    </Row>
  );
}

export default Certifications;
