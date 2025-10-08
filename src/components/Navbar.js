import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import {
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
  AiOutlineDownload,
} from "react-icons/ai";

import { CgFileDocument } from "react-icons/cg";

import pdf from "../Assets/Mazen_Ahmed_FrontEnd.pdf";

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    function scrollHandler() {
      if (window.scrollY >= 20) {
        updateNavbar(true);
      } else {
        updateNavbar(false);
      }

      const sections = ["home", "about", "projects", "resume"];

      let currentSection = "home";

      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();

          console.log(
            `${sectionId}: top=${Math.round(rect.top)}, bottom=${Math.round(
              rect.bottom
            )}`
          );

          if (rect.top <= 250) {
            currentSection = sectionId;
          }
        }
      });

      console.log("Active Section:", currentSection);
      setActiveSection(currentSection);
    }

    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition +
        window.pageYOffset -
        (sectionId === "home" ? 0 : navbarHeight);

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    updateExpanded(false);
  };

  return (
    <Navbar
      expanded={expand}
      fixed="top"
      expand="md"
      className={navColour ? "sticky" : "navbar"}
    >
      <Container>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => {
            updateExpanded(expand ? false : "expanded");
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        {!expand && (
          <Button
            variant="primary"
            href={pdf}
            target="_blank"
            className="cv-download-btn-navMob"
            style={{
              background: "linear-gradient(to bottom right, #a855f7, #ec4899)",
              borderColor: "transparent",
              padding: "6px 12px",
              fontSize: "1rem",
              marginLeft: "10px",
              zIndex: 2000,
            }}
            aria-label="Download Mazen Ahmed's CV"
          >
            <AiOutlineDownload
              style={{ marginRight: "6px", marginBottom: "2px" }}
            />
            CV
          </Button>
        )}
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" defaultActiveKey="#home">
            <Nav.Item>
              <Nav.Link
                onClick={() => scrollToSection("home")}
                className={activeSection === "home" ? "active-nav-link" : ""}
              >
                <AiOutlineHome style={{ marginBottom: "2px" }} /> Home
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                onClick={() => scrollToSection("about")}
                className={activeSection === "about" ? "active-nav-link" : ""}
              >
                <AiOutlineUser style={{ marginBottom: "2px" }} /> About
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                onClick={() => scrollToSection("projects")}
                className={
                  activeSection === "projects" ? "active-nav-link" : ""
                }
              >
                <AiOutlineFundProjectionScreen
                  style={{ marginBottom: "2px" }}
                />{" "}
                Projects
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                onClick={() => scrollToSection("resume")}
                className={activeSection === "resume" ? "active-nav-link" : ""}
              >
                <CgFileDocument style={{ marginBottom: "2px" }} /> Resume
              </Nav.Link>
            </Nav.Item>
          </Nav>
          {activeSection !== "home" && (
            <Nav.Item className="cv-download-nav">
              <Button
                variant="primary"
                href={pdf}
                target="_blank"
                className="cv-download-btn"
              >
                <AiOutlineDownload
                  style={{ marginBottom: "2px", marginRight: "5px" }}
                />
              </Button>
            </Nav.Item>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
