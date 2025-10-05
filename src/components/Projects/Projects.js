import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import Alsannat from "../../Assets/Projects/Alsannat.png";
import elmasry from "../../Assets/Projects/elmasry.png";
import yummyImg from "../../Assets/Projects/yummy.png";
import bookStoreImg from "../../Assets/Projects/bookStoreImg.png";
import gameOverImg from "../../Assets/Projects/gameOverImg.png";
import weatherImg from "../../Assets/Projects/weatherImg.png";
import quizAppImg from "../../Assets/Projects/quizAppImg.png";
import crudsImg from "../../Assets/Projects/crudsImg.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={Alsannat}
              isBlog={false}
              title="Alsannat E-commerce Platform"
              description="Contributed to the front-end development of an e-commerce platform for luggage, leveraging Magento 2 for a scalable backend, implementing PWA for enhanced mobile performance and offline access, and utilizing GraphQL for optimized API data fetching, ensuring a user-centric experience."
              demoLink="https://alsannat.com/ar/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={elmasry}
              isBlog={false}
              title="elmasry Pharmacy E-commerce Platform"
              description="Contributed to the front-end development of a pharmacy e-commerce platform, utilizing Magento 2 for a robust backend, implementing PWA for improved mobile performance and offline capabilities, and employing GraphQL for efficient API data management, collaborating with teams for a high-performance solution."
              demoLink="https://almasrypharmacy.com/default/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={yummyImg}
              isBlog={false}
              title="Yummy"
              description="A web application delivering detailed meal and recipe information from global cuisines, built with Bootstrap 5, CSS3, HTML5, jQuery, and JavaScript, offering an intuitive user interface for culinary exploration."
              ghLink="https://github.com/mazen323/yummy-project"
              demoLink="https://mazen323.github.io/yummy-project/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={bookStoreImg}
              isBlog={false}
              title="Book Store"
              description="An e-commerce website for purchasing books with login and registration features, developed using CSS3, HTML5, and JavaScript, ensuring a secure and user-friendly shopping experience."
              ghLink="https://github.com/mazen323/Book-store"
              demoLink="https://mazen323.github.io/Book-store/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={gameOverImg}
              isBlog={false}
              title="Game Over"
              description="An ecosystem aggregating the best free-to-play and MMO games, built with Bootstrap 5, CSS3, HTML5, jQuery, and JavaScript, providing a centralized platform for gaming enthusiasts."
              ghLink="https://github.com/mazen323/Game-over"
              demoLink="https://mazen323.github.io/Game-over/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={quizAppImg}
              isBlog={false}
              title="Quiz App"
              description="An interactive quiz application allowing customizable question types and counts, built with Regular Expressions, jQuery, JavaScript (ES6), Bootstrap 5, CSS3, and HTML5, displaying accurate result summaries."
              ghLink="https://github.com/mazen323/Quiz"
              demoLink="https://mazen323.github.io/Quiz/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={weatherImg}
              isBlog={false}
              title="Weather"
              description="A static web page delivering comprehensive weather information with geolocation, developed using JavaScript (ES6), Bootstrap 5, CSS3, and HTML5, optimized for real-time data display."
              ghLink="https://github.com/mazen323/weather-App"
              demoLink="https://mazen323.github.io/weather-App/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={crudsImg}
              isBlog={false}
              title="CRUDS Project"
              description="A robust application for creating, reading, updating, and deleting data, developed with JavaScript (ES6), Bootstrap 5, CSS3, and HTML5, featuring efficient data management and search capabilities."
              ghLink="https://github.com/mazen323/CRUD-Syestem"
              demoLink="https://mazen323.github.io/CRUD-Syestem/"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
