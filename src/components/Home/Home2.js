import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/Projects/Mazen_Elbardan.jpg";
import Tilt from "react-parallax-tilt";
import { AiFillGithub, AiOutlineMail } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              LET ME <span className="purple"> INTRODUCE </span> MYSELF
            </h1>
            <p className="home-about-body">
              As a passionate Front-End Developer, I've fallen in love with
              crafting elegant and responsive user interfaces that prioritize
              engagement and performance.
              <br />
              <br />
              With a strong foundation in classics like
              <i>
                <b className="purple">
                  {" "}
                  HTML5, CSS3, JavaScript (ES6), and TypeScript,{" "}
                </b>
              </i>
              I've built dynamic web applications leveraging modern tools.
              <br />
              <br />
              My expertise includes building innovative
              <i>
                <b className="purple">web technologies and products</b>
              </i>{" "}
              with a focus on
              <b className="purple">e-commerce platforms</b>, such as
              integrating Magento for scalable backend solutions, implementing
              Progressive Web Apps (PWA) for enhanced mobile performance and
              offline accessibility, and utilizing GraphQL and RESTful APIs for
              optimized data fetching and state management.
              <br />
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid MyPhoto" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <h1>FIND ME ON</h1>
            <p>
              Feel free to <span className="purple">connect </span>with me
            </p>
            <ul className="home-about-social-links">
              <li className="social-icons">
                <a
                  href="https://github.com/mazen323"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="mailto:mazeneb18@gmail.com"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiOutlineMail />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/in/mazen-elbardan-364061250/"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <FaLinkedinIn />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
