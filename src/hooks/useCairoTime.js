import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Africa/Cairo",
});

/** Current time in Cairo as "HH:MM", ticking every 20s. */
export default function useCairoTime() {
  const [time, setTime] = useState(() => fmt.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(fmt.format(new Date())), 20000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/** "2 yrs 6 mos" since a given ISO month, e.g. "2024-05". */
export function tenureSince(isoMonth) {
  const [y, m] = isoMonth.split("-").map(Number);
  const now = new Date();
  let months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
  if (months < 0) months = 0;
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  const parts = [];
  if (yrs) parts.push(`${yrs} yr${yrs > 1 ? "s" : ""}`);
  if (mos) parts.push(`${mos} mo${mos > 1 ? "s" : ""}`);
  return parts.join(" ") || "New";
}
