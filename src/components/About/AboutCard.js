import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Greetings, I am <span className="purple">Mazen Ahmed </span>, a
            Front-End Developer based in{" "}
            <span className="purple">Cairo, Egypt</span>.
            <br />
            I currently serve as a Front-End Developer at Crocoit, where I play
            a key role in developing innovative e-commerce platforms, leveraging
            Magento, Progressive Web Apps (PWA), and GraphQL to deliver
            scalable, high-performance solutions.
            <br />
            I hold a Bachelor of Computer Science from Future Academy, earned
            with a GPA of 3.22, and am supported by certifications in Full Stack
            Development and React.js.
            <br />
            <br />
            Beyond my professional endeavors, I engage in activities that
            enhance my expertise and creativity.
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Researching and implementing cutting-edge web
              technologies
            </li>
            <li className="about-activity">
              <ImPointRight /> Developing personal projects such as Yummy and
              Game Over to showcase my skills
            </li>
            <li className="about-activity">
              <ImPointRight /> Continuously learning and mastering new tools and
              frameworks
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "Committed to designing web solutions that elevate user experience
            and drive technological innovation."
          </p>
          <footer className="blockquote-footer">Mazen Ahmed</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
