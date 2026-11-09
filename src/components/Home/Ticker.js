import React from "react";

const ITEMS = [
  ["crocoit.com", "98 perf · 100 a11y · 100 seo"],
  ["online.spc-eg.com", "LCP 1.1s · CLS 0"],
  ["almasrypharmacy.com", "98 perf · PWA"],
  ["alsannat.com", "96 perf · GraphQL"],
  ["etlala.sa", "100 seo · Magento 2"],
  ["stack", "React.js · Next.js · TypeScript"],
  ["shipped", "5 apps in production"],
];

/** Infinite marquee of real production metrics. */
function Ticker() {
  const row = (hidden) => (
    <ul className="ticker-row" aria-hidden={hidden || undefined}>
      {ITEMS.map(([k, v]) => (
        <li key={k}>
          <span className="ticker-k">{k}</span>
          <span className="ticker-v">{v}</span>
          <span className="ticker-sep" aria-hidden="true">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="ticker" aria-label="Production metrics">
      <div className="ticker-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export default Ticker;
