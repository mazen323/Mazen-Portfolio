import { useEffect, useState } from "react";
import useInView, { prefersReducedMotion } from "../../hooks/useInView";

/** Counts from 0 to `value` once visible (eased, ~1.2s). */
function CountUp({ value, suffix = "", duration = 1200 }) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (prefersReducedMotion()) {
      setN(value);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export default CountUp;
