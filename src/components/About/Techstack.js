import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiReact,
} from "react-icons/si";
import {
  SiRedux,
  SiBootstrap,
  SiJquery,
  SiSass,
  SiGraphql,
  SiMysql,
} from "react-icons/si";
import { SiMagento } from "react-icons/si";

function Techstack() {
  return (
    <div>
      <Row style={{ justifyContent: "center", paddingBottom: "20px" }}>
        <Col xs={4} md={2} className="tech-icons">
          <SiHtml5 />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
          <SiCss3 />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
          <SiJavascript />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
          <SiTypescript />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
          <SiReact />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
          <SiRedux />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
          <SiBootstrap />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
          <SiJquery />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
          <SiSass />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
          <SiGraphql />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
          <SiMagento />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
          <SiMysql />
        </Col>
      </Row>
    </div>
  );
}

export default Techstack;
