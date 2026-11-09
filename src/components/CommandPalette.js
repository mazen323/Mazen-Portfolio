import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiSearch,
  FiArrowRight,
  FiDownload,
  FiCopy,
  FiGithub,
  FiLinkedin,
  FiMoon,
  FiMail,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { NAV_LINKS, PROFILE, CV_FILE } from "../data/profile";
import { copyText } from "./Contact/Contact";

export const OPEN_PALETTE_EVENT = "open-command-palette";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - (id === "home" ? 0 : 70);
  window.scrollTo({ top, behavior: "smooth" });
}

/** ⌘K / Ctrl+K command palette for keyboard-first navigation. */
function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const inputRef = useRef(null);
  const { toggleTheme } = useTheme();

  const commands = useMemo(
    () => [
      { group: "Navigate", label: "Home", icon: <FiArrowRight />, run: () => scrollToId("home") },
      ...NAV_LINKS.map((l) => ({
        group: "Navigate",
        label: l.label,
        icon: <FiArrowRight />,
        run: () => scrollToId(l.id),
      })),
      {
        group: "Actions",
        label: "Download CV",
        icon: <FiDownload />,
        run: () => window.open(CV_FILE, "_blank", "noopener"),
      },
      {
        group: "Actions",
        label: "Copy email address",
        icon: <FiCopy />,
        run: async () => {
          if (await copyText(PROFILE.email)) setToast("Email copied to clipboard");
        },
      },
      {
        group: "Actions",
        label: "Send an email",
        icon: <FiMail />,
        run: () => {
          window.location.href = `mailto:${PROFILE.email}`;
        },
      },
      { group: "Actions", label: "Toggle light / dark theme", icon: <FiMoon />, run: toggleTheme },
      {
        group: "Links",
        label: "GitHub — mazen323",
        icon: <FiGithub />,
        run: () => window.open(PROFILE.github, "_blank", "noopener"),
      },
      {
        group: "Links",
        label: "LinkedIn",
        icon: <FiLinkedin />,
        run: () => window.open(PROFILE.linkedin, "_blank", "noopener"),
      },
    ],
    [toggleTheme]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.group} ${c.label}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    setQuery("");
    setActive(0);
    const prev = document.activeElement;
    const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 10);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      if (prev && prev.focus) prev.focus();
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const run = (cmd) => {
    setOpen(false);
    setTimeout(cmd.run, 60);
  };

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (filtered.length ? (a + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (filtered.length ? (a - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter" && filtered[active]) {
      e.preventDefault();
      run(filtered[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  let lastGroup = null;

  return (
    <>
      {open && (
        <div className="cmdk-overlay" onClick={() => setOpen(false)}>
          <div
            className="cmdk"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cmdk-input">
              <FiSearch aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Type a command or search…"
                aria-label="Search commands"
                role="combobox"
                aria-expanded="true"
                aria-controls="cmdk-list"
                aria-activedescendant={filtered[active] ? `cmdk-item-${active}` : undefined}
              />
              <kbd>esc</kbd>
            </div>
            <ul className="cmdk-list" id="cmdk-list" role="listbox">
              {filtered.length === 0 && <li className="cmdk-empty">No results for “{query}”</li>}
              {filtered.map((c, i) => {
                const header = c.group !== lastGroup ? c.group : null;
                lastGroup = c.group;
                return (
                  <React.Fragment key={`${c.group}-${c.label}`}>
                    {header && <li className="cmdk-group" role="presentation">{header}</li>}
                    <li
                      id={`cmdk-item-${i}`}
                      role="option"
                      aria-selected={i === active}
                      className={`cmdk-item ${i === active ? "is-active" : ""}`}
                      onMouseMove={() => setActive(i)}
                      onClick={() => run(c)}
                    >
                      <span className="cmdk-icon">{c.icon}</span>
                      {c.label}
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
            <div className="cmdk-foot">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> select
              </span>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  );
}

export default CommandPalette;
