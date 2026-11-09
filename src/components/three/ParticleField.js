import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

/**
 * "Signal terrain": a full-screen 3D field of points rolling like a wave
 * landscape. Displacement runs in a vertex shader (cheap even at ~20k points).
 * - pointer: a ripple travels out from where the cursor hovers the terrain
 * - scroll: the camera glides forward and tilts, so the page "flies" over it
 * Vanilla three.js (React 17 compatible). Theme-aware.
 */

const VERT = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;      // terrain-space xz of the pointer
  uniform float uMouseAmt;   // 0..1 ripple strength
  uniform float uScroll;     // 0..1 page progress
  uniform float uSize;
  attribute float aSeed;
  varying float vHeight;
  varying float vFog;
  varying float vSignal;

  void main() {
    vec3 p = position;
    float t = uTime * 0.35;

    // layered rolling waves
    float h = sin(p.x * 0.018 + t) * 14.0
            + sin(p.z * 0.022 + t * 1.3) * 12.0
            + sin((p.x + p.z) * 0.011 - t * 0.7) * 20.0
            + sin(p.x * 0.05 - p.z * 0.04 + t * 2.0) * 3.0;

    // pointer ripple
    float d = distance(p.xz, uMouse);
    h += sin(d * 0.06 - uTime * 3.2) * 18.0 * exp(-d * 0.008) * uMouseAmt;

    // the valley deepens as you scroll
    h *= 1.0 + uScroll * 0.6;
    p.y += h;

    vHeight = h;
    vSignal = step(0.985, aSeed);              // ~1.5% "signal" points

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    vFog = smoothstep(1700.0, 120.0, depth);
    gl_PointSize = uSize * (300.0 / depth) * (1.0 + vSignal * 1.6);
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uSignal;
  uniform float uOpacity;
  varying float vHeight;
  varying float vFog;
  varying float vSignal;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, r);
    float crest = smoothstep(-20.0, 34.0, vHeight);   // brighter on peaks
    vec3 col = mix(uColor, uSignal, vSignal);
    float a = soft * vFog * (0.4 + crest * 0.6) * uOpacity;
    a = max(a, vSignal * soft * vFog * uOpacity);
    gl_FragColor = vec4(col, a);
  }
`;

const PALETTE = {
  dark: { color: "#d4ff3a", signal: "#ff6a3d", opacity: 0.85, blending: THREE.AdditiveBlending },
  light: { color: "#1b1b17", signal: "#e8501f", opacity: 0.45, blending: THREE.NormalBlending },
};

function ParticleField() {
  const mountRef = useRef(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  const applyThemeRef = useRef(() => {});

  useEffect(() => {
    themeRef.current = theme;
    applyThemeRef.current(theme);
  }, [theme]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 3000);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch (e) {
      return undefined; // no WebGL: the CSS background still looks fine
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // --- terrain grid --------------------------------------------------
    const COLS = isMobile ? 100 : 180;
    const ROWS = isMobile ? 80 : 130;
    const SPACING = isMobile ? 20 : 15;
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    let k = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        positions[k * 3] = (c - COLS / 2) * SPACING;
        positions[k * 3 + 1] = 0;
        positions[k * 3 + 2] = -r * SPACING + 200;
        seeds[k] = Math.random();
        k++;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, -400) },
      uMouseAmt: { value: 0 },
      uScroll: { value: 0 },
      uSize: { value: isMobile ? 5.0 : 4.6 },
      uColor: { value: new THREE.Color() },
      uSignal: { value: new THREE.Color() },
      uOpacity: { value: 1 },
    };
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const applyTheme = (t) => {
      const p = PALETTE[t] || PALETTE.dark;
      uniforms.uColor.value.set(p.color);
      uniforms.uSignal.value.set(p.signal);
      uniforms.uOpacity.value = p.opacity;
      mat.blending = p.blending;
      mat.needsUpdate = true;
    };
    applyTheme(themeRef.current);
    applyThemeRef.current = applyTheme;

    // --- interaction -----------------------------------------------------
    const raycastPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const ndc = new THREE.Vector2();
    const ray = new THREE.Raycaster();
    const hit = new THREE.Vector3();
    const targetMouse = new THREE.Vector2(0, -400);
    let mouseActive = 0;
    let pointerX = 0;
    let pointerY = 0;

    const onPointer = (e) => {
      pointerX = (e.clientX / width) * 2 - 1;
      pointerY = -(e.clientY / height) * 2 + 1;
      ndc.set(pointerX, pointerY);
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(raycastPlane, hit)) {
        targetMouse.set(hit.x, hit.z);
        mouseActive = 1;
      }
    };
    const onLeave = () => {
      mouseActive = 0;
    };

    let scroll = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll = max > 0 ? window.scrollY / max : 0;
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    // --- loop ---------------------------------------------------------------
    const clock = new THREE.Clock();
    let smoothScroll = scroll;
    let frame;
    let running = true;

    const render = () => {
      const t = clock.getElapsedTime();
      uniforms.uTime.value = prefersReduced ? 0 : t;

      smoothScroll += (scroll - smoothScroll) * 0.06;
      uniforms.uScroll.value = smoothScroll;
      uniforms.uMouse.value.lerp(targetMouse, 0.08);
      uniforms.uMouseAmt.value += (mouseActive - uniforms.uMouseAmt.value) * 0.04;

      // camera glides forward and pitches down as the page scrolls
      const z = 420 - smoothScroll * 900;
      camera.position.set(pointerX * 40, 170 + smoothScroll * 60 + pointerY * 18, z);
      camera.lookAt(pointerX * 20, -120 - smoothScroll * 40, z - 600);

      renderer.render(scene, camera);
      if (running && !prefersReduced) frame = requestAnimationFrame(render);
    };
    render();

    // pause when the tab is hidden
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        render();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // reduced motion: still re-render on scroll/theme so it isn't frozen wrong
    const staticRender = () => prefersReduced && render();
    window.addEventListener("scroll", staticRender, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", staticRender);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      applyThemeRef.current = () => {};
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="particle-field" aria-hidden="true" />;
}

export default ParticleField;
