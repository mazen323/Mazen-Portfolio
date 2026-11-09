import React from "react";

/**
 * Brand mark — "Pixel M".
 * An M drawn on a 5×5 pixel grid (screens are made of pixels; front-end is
 * pixel-precise work). The centre pixel is signal-orange — the same dot that
 * ends the "Mazen." wordmark — and blinks like a caret in the navbar.
 * Theme-aware via CSS variables; blinking is disabled for reduced motion.
 */
const GRID = ["X...X", "XX.XX", "X.O.X", "X...X", "X...X"];
const CELL = 5;
const STEP = 6;
const START = 7.5;

function Logo({ size = 38, className = "", animated = true }) {
  const cells = [];
  GRID.forEach((row, r) =>
    row.split("").forEach((ch, c) => {
      if (ch === ".") return;
      cells.push(
        <rect
          key={`${r}-${c}`}
          className={ch === "O" ? "brand-caret" : undefined}
          x={START + c * STEP}
          y={START + r * STEP}
          width={CELL}
          height={CELL}
          rx="1"
          style={{ fill: ch === "O" ? "var(--accent-2)" : "var(--on-accent)" }}
        />
      );
    })
  );

  return (
    <svg
      className={`brand-logo ${animated ? "brand-logo--live" : ""} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 44 44"
      role="img"
      aria-label="Mazen Ahmed logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="44" height="44" rx="12" style={{ fill: "var(--accent-fill)" }} />
      {cells}
    </svg>
  );
}

export default Logo;
