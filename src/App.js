import React, { useState, useEffect } from "react";
import Preloader from "./components/Pre";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Experience from "./components/Experience/Experience";
import Projects from "./components/Projects/Projects";
import Skills from "./components/Skills/Skills";
import Resume from "./components/Resume/ResumeNew";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer";
import ParticleField from "./components/three/ParticleField";
import CursorFollower from "./components/CursorFollower";
import CommandPalette from "./components/CommandPalette";
import ChapterBreak from "./components/ui/ChapterBreak";
import { BrowserRouter as Router } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import "./sections.css";

function App() {
  const [load, updateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => updateLoad(false), 900);
    return () => clearTimeout(timer);
  }, []);

  // Reveal sections on scroll.
  useEffect(() => {
    if (load) return undefined;

    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [load]);

  // Spotlight glow: cards with .spotlight track the pointer via CSS vars.
  useEffect(() => {
    const onMove = (e) => {
      const card = e.target.closest && e.target.closest(".spotlight");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Preloader load={load} />
      <ParticleField />
      <CursorFollower />
      <CommandPalette />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <Navbar />
        <ScrollToTop />

        <main id="main">
          <section id="home" aria-label="Intro">
            <Home />
          </section>
          <ChapterBreak command="whoami" output="mazen-ahmed · front-end developer · cairo" />
          <section id="about" className="page-section" aria-label="About">
            <About />
          </section>
          <ChapterBreak command="git log --graph" output="may 2024 → present · 5 products shipped" />
          <section id="experience" className="page-section" aria-label="Experience">
            <Experience />
          </section>
          <ChapterBreak command="ls ~/projects" output="5 client products · 6 personal projects" />
          <section id="projects" className="page-section" aria-label="Selected work">
            <Projects />
          </section>
          <ChapterBreak command="npm ls --depth=0" output="react · next · magento2 · graphql · typescript" />
          <section id="skills" className="page-section" aria-label="Skills">
            <Skills />
          </section>
          <ChapterBreak command="open resume.pdf" output="1 page · pdf · ats-friendly" />
          <section id="resume" className="page-section" aria-label="Resume">
            <Resume />
          </section>
          <ChapterBreak command="mail mazen" output="→ mazen.ahmed.dev@gmail.com" />
          <section id="contact" className="page-section" aria-label="Contact">
            <Contact />
          </section>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
