import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { AiOutlineDownload } from "react-icons/ai";
import homeLogo from "../../Assets/home-main.svg";
import pdf from "../../Assets/Mazen_Ahmed_FrontEnd.pdf";
import Particle from "../Particle";
import Home2 from "./Home2";
import Type from "./Type";

function Home() {
  return (
    <section>
      <Container fluid className="home-section" id="home">
        <Particle />
        <Container className="home-content">
          <Row>
            <Col md={7} className="home-header">
              <h1 style={{ paddingBottom: 15 }} className="heading">
                Hi There!{" "}
                <span className="wave" role="img" aria-label="wave">
                  👋🏻
                </span>
              </h1>

              <h1 className="heading-name">
                I'M
                <strong className="main-name"> Mazen Ahmed</strong>
              </h1>

              <div
                style={{
                  padding: 50,
                  textAlign: "left",
                  position: "relative",
                  zIndex: 1000,
                }}
              >
                <Type />
                <Button
                  variant="primary"
                  href={pdf}
                  target="_blank"
                  style={{
                    maxWidth: "250px",
                    marginTop: "20px",
                    background:
                      "linear-gradient(to bottom right, #a855f7, #ec4899)",
                    borderColor: "transparent",
                    padding: "8px 16px",
                    fontSize: "1.1rem",
                    zIndex: 1000,
                  }}
                  className="cv-download-btn-web"
                  aria-label="Download Mazen Ahmed's CV"
                >
                  <AiOutlineDownload style={{ marginRight: "8px" }} />
                  Download CV
                </Button>
              </div>
            </Col>

            <Col md={5} style={{ paddingBottom: 20 }}>
              <img
                src={homeLogo}
                alt="home pic"
                className="img-fluid"
                style={{ maxHeight: "450px" }}
              />
            </Col>
          </Row>
        </Container>
      </Container>
      <Button
        variant="primary"
        href={pdf}
        target="_blank"
        style={{
          maxWidth: "250px",
          marginTop: "20px",
          background: "linear-gradient(to bottom right, #a855f7, #ec4899)",
          borderColor: "transparent",
          padding: "8px 16px",
          fontSize: "1.1rem",
          zIndex: 1000,
        }}
        className="cv-download-btn-mob"
        aria-label="Download Mazen Ahmed's CV"
      >
        <AiOutlineDownload style={{ marginRight: "8px" }} />
        Download CV
      </Button>
      <Home2 />
    </section>
  );
}

export default Home;
