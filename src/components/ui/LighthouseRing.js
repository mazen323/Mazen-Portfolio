import React from "react";
import useInView from "../../hooks/useInView";
import CountUp from "./CountUp";

const R = 26;
const CIRC = 2 * Math.PI * R;

function tone(score) {
  if (score >= 90) return "good";
  if (score >= 50) return "avg";
  return "poor";
}

/** A Lighthouse-style score gauge that fills when scrolled into view. */
function LighthouseRing({ score, label, size = 64 }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const offset = inView ? CIRC * (1 - score / 100) : CIRC;

  return (
    <div className={`lh-ring lh-${tone(score)}`} ref={ref}>
      <div className="lh-gauge" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle className="lh-track" cx="32" cy="32" r={R} />
          <circle
            className="lh-arc"
            cx="32"
            cy="32"
            r={R}
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="lh-score">
          <CountUp value={score} />
        </span>
      </div>
      <span className="lh-label">{label}</span>
      <span className="visually-hidden">
        {label} score {score} out of 100
      </span>
    </div>
  );
}

export default LighthouseRing;
