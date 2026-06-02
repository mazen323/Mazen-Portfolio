import React, { useEffect, useRef, useState } from "react";

/**
 * An animated terminal that types out a "profile" CLI session by itself,
 * showcasing Mazen's stack and experience. Pure React + setTimeout typing.
 */
const SCRIPT = [
  { type: "cmd", text: "whoami" },
  { type: "out", text: "Mazen Ahmed — Front-End Developer @ Crocoit" },
  { type: "blank" },
  { type: "cmd", text: "cat skills.json" },
  { type: "brace", text: "{" },
  { type: "kv", k: '"frameworks"', v: '["React.js", "Next.js", "Redux"]' },
  { type: "kv", k: '"ecommerce" ', v: '["Magento 2", "PWA Studio"]' },
  { type: "kv", k: '"apis"      ', v: '["GraphQL", "REST"]' },
  { type: "kv", k: '"languages" ', v: '["JavaScript", "TypeScript"]' },
  { type: "brace", text: "}" },
  { type: "blank" },
  { type: "cmd", text: "cat focus.txt" },
  { type: "out", text: "Building scalable, high-performance e-commerce apps" },
  { type: "out", text: "2+ years • PWA • SSR • optimized UI/UX 🚀" },
];

// flatten a script line into the plain string we type, for length tracking
function lineToText(line) {
  if (line.type === "kv") return `  ${line.k}: ${line.v},`;
  if (line.type === "blank") return "";
  return line.text;
}

function Terminal() {
  const [done, setDone] = useState([]); // completed line objects
  const [typing, setTyping] = useState(null); // { line, chars }
  const [finished, setFinished] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setDone(SCRIPT);
      setFinished(true);
      return undefined;
    }

    let li = 0;
    let ci = 0;
    let timer;

    const tick = () => {
      if (li >= SCRIPT.length) {
        setFinished(true);
        timer = setTimeout(() => {
          setDone([]);
          setTyping(null);
          setFinished(false);
          li = 0;
          ci = 0;
          timer = setTimeout(tick, 600);
        }, 6000);
        return;
      }

      const line = SCRIPT[li];

      if (line.type === "blank") {
        setDone((d) => [...d, line]);
        li += 1;
        ci = 0;
        timer = setTimeout(tick, 130);
        return;
      }

      const full = lineToText(line);
      if (ci <= full.length) {
        setTyping({ line, chars: ci });
        ci += 1;
        const speed = line.type === "cmd" ? 48 : 16;
        timer = setTimeout(tick, speed);
      } else {
        setDone((d) => [...d, line]);
        setTyping(null);
        li += 1;
        ci = 0;
        timer = setTimeout(tick, line.type === "cmd" ? 380 : 80);
      }
    };

    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, []);

  // keep scrolled to the newest line
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [done, typing]);

  const renderLine = (line, partial, withCursor) => {
    if (line.type === "blank") return <div className="t-line">&nbsp;</div>;

    if (line.type === "cmd") {
      const txt = partial != null ? partial : line.text;
      return (
        <div className="t-line t-cmd">
          <span className="t-prompt">mazen@portfolio</span>
          <span className="t-sep">:~$</span> <span className="t-cmdtxt">{txt}</span>
          {withCursor && <span className="t-cursor" />}
        </div>
      );
    }

    if (line.type === "brace") {
      const txt = partial != null ? partial : line.text;
      return (
        <div className="t-line t-json">
          {txt}
          {withCursor && <span className="t-cursor" />}
        </div>
      );
    }

    if (line.type === "kv") {
      if (partial != null) {
        // mid-typing: render the raw partial string (still readable)
        return (
          <div className="t-line t-json">
            {partial}
            {withCursor && <span className="t-cursor" />}
          </div>
        );
      }
      return (
        <div className="t-line t-json">
          {"  "}
          <span className="t-key">{line.k}</span>
          <span className="t-punc">: </span>
          <span className="t-val">{line.v}</span>
          <span className="t-punc">,</span>
        </div>
      );
    }

    // out
    const txt = partial != null ? partial : line.text;
    return (
      <div className="t-line t-out">
        <span className="t-arrow">→</span> {txt}
        {withCursor && <span className="t-cursor" />}
      </div>
    );
  };

  return (
    <div className="terminal-window" aria-hidden="true">
      <div className="terminal-bar">
        <span className="terminal-dot red" />
        <span className="terminal-dot yellow" />
        <span className="terminal-dot green" />
        <span className="terminal-title">mazen — zsh</span>
      </div>
      <div className="terminal-body" ref={bodyRef}>
        {done.map((line, i) => (
          <React.Fragment key={i}>{renderLine(line, null, false)}</React.Fragment>
        ))}
        {typing &&
          renderLine(
            typing.line,
            lineToText(typing.line).slice(0, typing.chars),
            true
          )}
        {finished && !typing && (
          <div className="t-line t-cmd">
            <span className="t-prompt">mazen@portfolio</span>
            <span className="t-sep">:~$</span> <span className="t-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Terminal;
