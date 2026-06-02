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
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";

import pdf from "../Assets/Mazen_Ahmed_Frontend_Developer.pdf";
import { useTheme } from "../context/ThemeContext";
import Logo from "./Logo";

const LINKS = [
  { id: "home", label: "Home", icon: <AiOutlineHome /> },
  { id: "about", label: "About", icon: <AiOutlineUser /> },
  {
    id: "projects",
    label: "Projects",
    icon: <AiOutlineFundProjectionScreen />,
  },
  { id: "resume", label: "Resume", icon: <CgFileDocument /> },
];

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    function scrollHandler() {
      updateNavbar(window.scrollY >= 20);

      let currentSection = "home";
      LINKS.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= 250) {
          currentSection = id;
        }
      });
      setActiveSection(currentSection);
    }

    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
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
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
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
        <Navbar.Brand
          className="nav-brand"
          onClick={() => scrollToSection("home")}
          role="button"
        >
          <Logo size={38} />
          <span className="brand-text">
            Mazen<span className="brand-dot">.</span>
          </span>
        </Navbar.Brand>

        <div className="nav-right-group">
          <button
            type="button"
            role="switch"
            aria-checked={theme === "light"}
            className={`theme-toggle ${theme === "light" ? "is-light" : ""}`}
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <span className="theme-toggle-icon theme-toggle-moon">
              <BsMoonStarsFill />
            </span>
            <span className="theme-toggle-icon theme-toggle-sun">
              <BsSunFill />
            </span>
            <span className="theme-toggle-thumb" aria-hidden="true" />
          </button>

          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={() => updateExpanded(expand ? false : "expanded")}
          >
            <span></span>
            <span></span>
            <span></span>
          </Navbar.Toggle>
        </div>

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto" defaultActiveKey="#home">
            {LINKS.map(({ id, label, icon }) => (
              <Nav.Item key={id}>
                <Nav.Link
                  onClick={() => scrollToSection(id)}
                  className={activeSection === id ? "active-nav-link" : ""}
                >
                  <span className="nav-link-icon">{icon}</span> {label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          <Button
            variant="primary"
            href={pdf}
            target="_blank"
            className="nav-cv-btn"
            aria-label="Download Mazen Ahmed's CV"
          >
            <AiOutlineDownload
              style={{ marginRight: "6px", marginBottom: "2px" }}
            />
            Download CV
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
