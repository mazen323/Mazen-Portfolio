import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";
import { FiCommand, FiArrowUpRight, FiArrowRight, FiFileText } from "react-icons/fi";
import { AiFillGithub } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";
import { NAV_LINKS, PROFILE } from "../data/profile";
import cvThumb from "../Assets/cv-preview.webp";
import { OPEN_PALETTE_EVENT } from "./CommandPalette";
import Logo from "./Logo";

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - (id === "home" ? 0 : 80);
  window.scrollTo({ top, behavior: "smooth" });
}

function ThemeSwitch({ theme, toggleTheme }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === "light"}
      className={`theme-toggle ${theme === "light" ? "is-light" : ""}`}
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="theme-toggle-icon theme-toggle-moon">
        <BsMoonStarsFill />
      </span>
      <span className="theme-toggle-icon theme-toggle-sun">
        <BsSunFill />
      </span>
      <span className="theme-toggle-thumb" aria-hidden="true" />
    </button>
  );
}

/** Floating "island" navigation with a sliding active pill + full-screen mobile menu. */
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });
  const linkRefs = useRef({});
  const menuBtnRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  // scroll state: shrink, progress, active section
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      let current = "home";
      NAV_LINKS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = id;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // sliding pill under the active link
  const measure = useCallback(() => {
    const el = linkRefs.current[active];
    if (!el) {
      setPill((p) => ({ ...p, visible: false }));
      return;
    }
    setPill({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
  }, [active]);

  useLayoutEffect(() => {
    measure();
  }, [measure, scrolled]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    // fonts can change link widths after first paint
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // mobile menu: lock scroll, close on Escape, restore focus
  useEffect(() => {
    if (!menuOpen) return undefined;
    const btn = menuBtnRef.current;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      if (btn) btn.focus();
    };
  }, [menuOpen]);

  const go = (id) => {
    setMenuOpen(false);
    // let the overlay close before scrolling so the body is scrollable again
    setTimeout(() => scrollToSection(id), menuOpen ? 220 : 0);
  };

  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <>
      <header className={`site-nav ${scrolled ? "is-scrolled" : ""} ${menuOpen ? "is-open" : ""}`}>
        <div className="nav-island">
          <a
            href="#home"
            className="nav-brand"
            onClick={(e) => {
              e.preventDefault();
              go("home");
            }}
            aria-label="Mazen Ahmed — back to top"
          >
            <Logo size={34} />
            <span className="brand-text">
              Mazen<span className="brand-dot">.</span>
            </span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            <span
              className="nav-pill"
              aria-hidden="true"
              style={{
                transform: `translateX(${pill.left}px)`,
                width: pill.width,
                opacity: pill.visible ? 1 : 0,
              }}
            />
            {NAV_LINKS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                ref={(el) => (linkRefs.current[id] = el)}
                className={`nav-link-item ${active === id ? "is-active" : ""}`}
                aria-current={active === id ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  go(id);
                }}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="cmdk-trigger"
              onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
              aria-label="Open command palette"
            >
              <FiCommand className="cmdk-trigger-icon" />
              <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
              <kbd>K</kbd>
            </button>
            <ThemeSwitch theme={theme} toggleTheme={toggleTheme} />
            <a
              href="#resume"
              className="nav-cv"
              onClick={(e) => {
                e.preventDefault();
                go("resume");
              }}
            >
              <FiFileText /> <span>Résumé</span>
            </a>
            <button
              type="button"
              ref={menuBtnRef}
              className={`burger ${menuOpen ? "is-open" : ""}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        <span className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      </header>

      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
        inert={menuOpen ? undefined : ""}
      >
        <nav aria-label="Mobile">
          <ol className="mobile-links">
            {NAV_LINKS.map(({ id, label }, i) => (
              <li key={id} style={{ transitionDelay: menuOpen ? `${80 + i * 45}ms` : "0ms" }}>
                <a
                  href={`#${id}`}
                  className={active === id ? "is-active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    go(id);
                  }}
                >
                  <span className="mobile-n">0{i + 1}</span>
                  {label}
                  <FiArrowUpRight className="mobile-arrow" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mobile-foot">
          <button type="button" className="cv-teaser cv-teaser--block" onClick={() => go("resume")}>
            <span className="cv-teaser-paper" aria-hidden="true">
              <img src={cvThumb} alt="" width="820" height="1160" />
            </span>
            <span className="cv-teaser-text">
              <strong>View my résumé</strong>
              <span>1 page · PDF · ATS-friendly</span>
            </span>
            <FiArrowRight className="cv-teaser-arrow" aria-hidden="true" />
          </button>
          <div className="mobile-social">
            <a href={PROFILE.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <AiFillGithub />
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href={`mailto:${PROFILE.email}`} className="mobile-mail">
              {PROFILE.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
