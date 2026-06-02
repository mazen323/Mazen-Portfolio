import React, { useEffect, useRef } from "react";

/**
 * Simple cursor follower: one small dot that eases toward the pointer.
 * Disabled on touch devices and when the user prefers reduced motion.
 */
function CursorFollower() {
  const dotRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return undefined;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!finePointer || prefersReduced) return undefined;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let x = mouseX;
    let y = mouseY;
    let visible = false;
    let frameId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        dot.classList.add("is-visible");
      }
    };
    const onLeave = () => {
      visible = false;
      dot.classList.remove("is-visible");
    };

    const loop = () => {
      x += (mouseX - x) * 0.2;
      y += (mouseY - y) * 0.2;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frameId = window.requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}

export default CursorFollower;
