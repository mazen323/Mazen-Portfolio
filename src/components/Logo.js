import React from "react";

/**
 * Personal "MA" monogram: an M and an A that share their lower joint, set in a
 * rounded badge with the brand's indigo→sky gradient. Scales crisply at any
 * size; pass a `size` (px) to control it.
 */
function Logo({ size = 38, className = "" }) {
  return (
    <svg
      className={`brand-logo ${className}`}
      width={size}
      height={size}
      viewBox="0 0 44 44"
      role="img"
      aria-label="Mazen Ahmed logo"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ma-grad" x1="0" y1="0" x2="44" y2="44">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>

      {/* gradient badge */}
      <rect x="1" y="1" width="42" height="42" rx="12" fill="url(#ma-grad)" />

      {/* interlocking M + A monogram, drawn in white strokes */}
      <g
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* M — left stem, valley, mid-peak, right stem */}
        <path d="M10 32 V14 L17 24 L24 14 V32" />
        {/* A — left leg rises from the M's right-stem foot to the apex, then down */}
        <path d="M24 32 L29 13 L34 32" />
        {/* A crossbar */}
        <path d="M26.4 25 H31.6" />
      </g>
    </svg>
  );
}

export default Logo;
