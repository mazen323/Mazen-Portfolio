import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

/**
 * "Scroll story": one particle system behind the whole page that morphs into
 * a different 3D form for each section as you scroll.
 *   home → wave terrain · about → </> · experience → git branch graph
 *   projects → responsive devices · skills → React atom
 *   resume → a sheet of paper · contact → @
 * Morphing runs in the vertex shader (per-point staggered), so the CPU only
 * swaps two target buffers when the section changes. Vanilla three.js.
 */

const SECTIONS = ["home", "about", "experience", "projects", "skills", "resume", "contact"];

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uMix;
  uniform float uWave;
  uniform float uSize;
  uniform vec2  uMouse;
  uniform vec2  uOffA;
  uniform vec2  uOffB;
  uniform float uRotY;
  uniform float uRotX;
  uniform float uScaleA;
  uniform float uScaleB;
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aSeed;
  varying float vFog;
  varying float vSignal;
  varying float vLift;
  varying float vFlight;

  vec3 rot(vec3 p) {
    float cy = cos(uRotY), sy = sin(uRotY);
    p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
    float cx = cos(uRotX), sx = sin(uRotX);
    return vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
  }

  void main() {
    // staggered morph: each point leaves at a slightly different moment
    float s = aSeed * 0.45;
    float m = smoothstep(s, s + 0.55, uMix);
    vec3 p = mix(aFrom * uScaleA, aTo * uScaleB, m);

    // mid-flight swirl so the transition feels like a flow, not a lerp
    float flight = sin(m * 3.14159);
    vFlight = flight;
    p.x += sin(aSeed * 40.0 + uTime) * 40.0 * flight;
    p.y += cos(aSeed * 31.0 + uTime) * 40.0 * flight;

    // living surface: terrain waves on the hero, a soft breath elsewhere
    float t = uTime * 0.35;
    float h = sin(p.x * 0.018 + t) * 14.0
            + sin(p.z * 0.022 + t * 1.3) * 12.0
            + sin((p.x + p.z) * 0.011 - t * 0.7) * 20.0;
    float d = distance(p.xz, uMouse);
    h += sin(d * 0.06 - uTime * 3.2) * 18.0 * exp(-d * 0.008);
    p.y += h * uWave;
    p += normalize(p + 0.001) * sin(uTime * 1.2 + aSeed * 12.0) * 3.0 * (1.0 - uWave);

    p = rot(p);
    p.xy += mix(uOffA, uOffB, m);

    vLift = h * uWave;
    vSignal = step(0.985, aSeed);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    vFog = smoothstep(2000.0, 200.0, depth);
    gl_PointSize = uSize * (420.0 / depth) * (1.0 + vSignal * 1.6);
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uSignal;
  uniform float uOpacity;
  uniform float uWave;
  varying float vFog;
  varying float vSignal;
  varying float vLift;
  varying float vFlight;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, r);
    float crest = mix(1.0, 0.4 + smoothstep(-20.0, 34.0, vLift) * 0.6, uWave);
    vec3 col = mix(uColor, uSignal, max(vSignal, vFlight * 0.75));
    col *= mix(0.55, 1.0, vFog);
    float a = soft * vFog * crest * uOpacity;
    a = max(a, vSignal * soft * vFog * uOpacity);
    gl_FragColor = vec4(col, a);
  }
`;

const PALETTE = {
  dark: { color: "#d4ff3a", signal: "#ff6a3d", opacity: 0.8, blending: THREE.AdditiveBlending },
  light: { color: "#3d3d36", signal: "#e8501f", opacity: 0.38, blending: THREE.NormalBlending },
};

// ---------------------------------------------------------------------------
// Shape generators — each fills `n` xyz triples centred on the origin.
// ---------------------------------------------------------------------------
function terrain(n) {
  const out = new Float32Array(n * 3);
  const cols = Math.round(Math.sqrt(n * 1.4));
  const rows = Math.ceil(n / cols);
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    out[i * 3] = (c / cols - 0.5) * 2000;
    out[i * 3 + 1] = -230;
    out[i * 3 + 2] = 260 - (r / rows) * 1500;
  }
  return out;
}


// --- helpers -------------------------------------------------------------
const rand = (a, b) => a + Math.random() * (b - a);

/** sample points from text drawn on an offscreen canvas (gives 3D "type") */
function glyph(n, text, worldW, font = '700 220px "JetBrains Mono", ui-monospace, monospace') {
  const out = new Float32Array(n * 3);
  const cw = 640;
  const ch = 320;
  const cv = document.createElement("canvas");
  cv.width = cw;
  cv.height = ch;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, cw / 2, ch / 2);
  const data = ctx.getImageData(0, 0, cw, ch).data;
  const px = [];
  let minX = cw;
  let maxX = 0;
  for (let y = 0; y < ch; y += 2) {
    for (let x = 0; x < cw; x += 2) {
      if (data[(y * cw + x) * 4 + 3] > 128) {
        px.push(x, y);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
  }
  const count = px.length / 2;
  const scale = worldW / Math.max(1, maxX - minX);
  const cx = (minX + maxX) / 2;
  for (let i = 0; i < n; i++) {
    const k = count ? Math.floor(Math.random() * count) * 2 : 0;
    out[i * 3] = (px[k] - cx + rand(-1, 1)) * scale;
    out[i * 3 + 1] = -(px[k + 1] - ch / 2 + rand(-1, 1)) * scale;
    out[i * 3 + 2] = rand(-28, 28); // extrusion depth
  }
  return out;
}

/** points along a polyline with slight thickness */
function alongPath(pts) {
  const segs = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    const len = Math.hypot(bx - ax, by - ay);
    segs.push({ ax, ay, bx, by, len });
    total += len;
  }
  return () => {
    let d = Math.random() * total;
    for (const s of segs) {
      if (d <= s.len) {
        const t = d / s.len;
        return [s.ax + (s.bx - s.ax) * t, s.ay + (s.by - s.ay) * t];
      }
      d -= s.len;
    }
    const s = segs[segs.length - 1];
    return [s.bx, s.by];
  };
}

/** outline of a rounded-ish rectangle (sampled on the perimeter) */
function rectEdge(w, h) {
  const e = Math.random() * 2 * (w + h);
  if (e < w) return [e - w / 2, h / 2];
  if (e < w + h) return [w / 2, h / 2 - (e - w)];
  if (e < 2 * w + h) return [w / 2 - (e - w - h), -h / 2];
  return [-w / 2, -h / 2 + (e - 2 * w - h)];
}

// --- front-end forms ------------------------------------------------------
function tag(n) {
  return glyph(n, "</>", 560);
}

function at(n) {
  return glyph(n, "@", 430, '700 260px "JetBrains Mono", ui-monospace, monospace');
}

function gitGraph(n) {
  // main line with two feature branches that fork and merge back
  const out = new Float32Array(n * 3);
  const curve = (x0, x1, y1) => {
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const x = x0 + (x1 - x0) * t;
      const lift = t < 0.25 ? Math.sin((t / 0.25) * (Math.PI / 2)) : t > 0.75 ? Math.sin(((1 - t) / 0.25) * (Math.PI / 2)) : 1;
      pts.push([x, y1 * lift]);
    }
    return pts;
  };
  const lines = [
    { f: alongPath([[-340, 0], [340, 0]]), w: 0.4 },
    { f: alongPath(curve(-250, 60, 120)), w: 0.3 },
    { f: alongPath(curve(-20, 290, -115)), w: 0.3 },
  ];
  const commits = [
    [-340, 0], [-250, 0], [-130, 0], [-20, 0], [60, 0], [170, 0], [290, 0], [340, 0],
    [-170, 120], [-70, 120], [-10, 120],
    [60, -115], [150, -115], [230, -115],
  ];
  const headIdx = 7; // HEAD commit gets the signal colour via seed? keep geometry only
  for (let i = 0; i < n; i++) {
    let x;
    let y;
    let z;
    if (Math.random() < 0.42) {
      // commit nodes: small dense spheres (HEAD is larger)
      const k = Math.floor(Math.random() * commits.length);
      const R = k === headIdx ? 22 : 13;
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      const r = R * Math.cbrt(Math.random());
      x = commits[k][0] + r * Math.sin(v) * Math.cos(u);
      y = commits[k][1] + r * Math.sin(v) * Math.sin(u);
      z = r * Math.cos(v);
    } else {
      const pick = Math.random();
      const line = pick < lines[0].w ? lines[0] : pick < lines[0].w + lines[1].w ? lines[1] : lines[2];
      [x, y] = line.f();
      x += rand(-2.5, 2.5);
      y += rand(-2.5, 2.5);
      z = rand(-3, 3);
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

function devices(n) {
  // desktop monitor + tablet + phone, each with a frame and "content" lines
  const out = new Float32Array(n * 3);
  const devs = [
    { x: -110, y: 30, z: -40, w: 330, h: 205, stand: true, share: 0.5 },
    { x: 170, y: -10, z: 30, w: 135, h: 180, stand: false, share: 0.28 },
    { x: 285, y: -40, z: 80, w: 66, h: 132, stand: false, share: 0.22 },
  ];
  for (let i = 0; i < n; i++) {
    const p = Math.random();
    const d = p < devs[0].share ? devs[0] : p < devs[0].share + devs[1].share ? devs[1] : devs[2];
    let lx;
    let ly;
    const q = Math.random();
    if (q < 0.42) {
      [lx, ly] = rectEdge(d.w, d.h);
    } else if (d.stand && q < 0.5) {
      // monitor stand
      if (Math.random() < 0.5) [lx, ly] = [rand(-6, 6), -d.h / 2 - rand(0, 34)];
      else [lx, ly] = [rand(-48, 48), -d.h / 2 - 34];
    } else if (q < 0.6) {
      // top bar / header block
      lx = rand(-d.w / 2 + 10, d.w / 2 - 10);
      ly = d.h / 2 - 14 + rand(-3, 3);
    } else {
      // stacked content rows (mobile = narrower, more rows)
      const rows = Math.max(4, Math.floor(d.h / 22));
      const r = Math.floor(Math.random() * rows);
      const len = [0.9, 0.6, 0.75, 0.5][r % 4];
      lx = -d.w / 2 + 12 + Math.random() * (d.w - 24) * len;
      ly = d.h / 2 - 34 - r * ((d.h - 50) / rows);
    }
    out[i * 3] = d.x + lx;
    out[i * 3 + 1] = d.y + ly;
    out[i * 3 + 2] = d.z + rand(-2, 2);
  }
  return out;
}

function atom(n) {
  // the React mark: three elliptical orbits + nucleus
  const out = new Float32Array(n * 3);
  const RX = 300;
  const RY = 112;
  for (let i = 0; i < n; i++) {
    let x;
    let y;
    let z;
    if (Math.random() < 0.14) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      const r = 46 * Math.cbrt(Math.random());
      x = r * Math.sin(v) * Math.cos(u);
      y = r * Math.sin(v) * Math.sin(u);
      z = r * Math.cos(v);
    } else {
      const k = i % 3;
      const a = Math.random() * Math.PI * 2;
      const ex = Math.cos(a) * (RX + rand(-7, 7));
      const ey = Math.sin(a) * (RY + rand(-7, 7));
      const ang = (k * Math.PI) / 3;
      x = ex * Math.cos(ang) - ey * Math.sin(ang);
      y = ex * Math.sin(ang) + ey * Math.cos(ang);
      // give each orbit its own depth tilt so the atom reads as 3D
      z = ey * [0.45, -0.45, 0][k] + rand(-4, 4);
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

function paper(n) {
  // an A4 sheet, tilted, with header + lines of "text"
  const out = new Float32Array(n * 3);
  const W = 300;
  const H = 424;
  const tilt = -0.35;
  for (let i = 0; i < n; i++) {
    const pick = Math.random();
    let x;
    let y;
    if (pick < 0.3) {
      const e = Math.random() * 2 * (W + H);
      if (e < W) [x, y] = [e - W / 2, H / 2];
      else if (e < W + H) [x, y] = [W / 2, H / 2 - (e - W)];
      else if (e < 2 * W + H) [x, y] = [W / 2 - (e - W - H), -H / 2];
      else [x, y] = [-W / 2, -H / 2 + (e - 2 * W - H)];
    } else if (pick < 0.4) {
      // name heading
      x = -W / 2 + 28 + Math.random() * W * 0.5;
      y = H / 2 - 40 + Math.random() * 8;
    } else {
      const line = Math.floor(Math.random() * 22);
      const len = [0.9, 0.7, 0.8, 0.95, 0.6][line % 5];
      x = -W / 2 + 28 + Math.random() * (W - 56) * len;
      y = H / 2 - 78 - line * 15;
    }
    out[i * 3] = x * Math.cos(tilt);
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = x * Math.sin(tilt);
  }
  return out;
}

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

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    let width = window.innerWidth;
    let height = window.innerHeight;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch (e) {
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 4000);
    camera.position.set(0, 0, 720);

    const N = isMobile ? 8000 : 18000;
    const shapes = [terrain(N), tag(N), gitGraph(N), devices(N), atom(N), paper(N), at(N)];
    // where each form lives: peeking in from a screen edge, never under the text column
    const SIDE = [0, 1, -1, 1, -1, 1, 0];
    const SCALE = [1, 0.6, 0.58, 0.6, 0.58, 0.8, 0.72];
    // in a chapter break the form takes centre stage at full size
    const STAGE = [1, 0.82, 0.8, 0.82, 0.68, 0.7, 0.6];
    // shrink forms on narrow (portrait) viewports — recomputed live, so resizing works too
    const fit = () => Math.min(1, camera.aspect / 1.15);
    const narrow = () => camera.aspect < 0.9;
    const placement = (i, c) => {
      const visH = 2 * Math.tan((camera.fov * Math.PI) / 360) * 720;
      const half = (visH * camera.aspect) / 2;
      const x = narrow() ? 0 : SIDE[i] * half * 0.64 * (1 - c);
      // on stage the form rides with its chapter break (scrolls like content),
      // lifted a little above the caption
      const worldPerPx = visH / window.innerHeight;
      const ride = -stageShift * worldPerPx;
      return [x, i === 0 ? 0 : c * ((narrow() ? 70 : 55) + ride)];
    };
    const scaleOf = (i, c) => (i === 0 ? 1 : (SCALE[i] + (STAGE[i] - SCALE[i]) * c) * fit() * (narrow() ? 1.15 : 1));

    const seeds = new Float32Array(N);
    for (let i = 0; i < N; i++) seeds[i] = Math.random();

    const geo = new THREE.BufferGeometry();
    const fromAttr = new THREE.BufferAttribute(new Float32Array(shapes[0]), 3);
    const toAttr = new THREE.BufferAttribute(new Float32Array(shapes[1]), 3);
    fromAttr.setUsage(THREE.DynamicDrawUsage);
    toAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    geo.setAttribute("aFrom", fromAttr);
    geo.setAttribute("aTo", toAttr);
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 5000);

    const uniforms = {
      uTime: { value: 0 },
      uMix: { value: 0 },
      uWave: { value: 1 },
      uSize: { value: 4 },
      uMouse: { value: new THREE.Vector2(0, -600) },
      uOffA: { value: new THREE.Vector2() },
      uOffB: { value: new THREE.Vector2() },
      uRotY: { value: 0 },
      uRotX: { value: 0 },
      uScaleA: { value: 1 },
      uScaleB: { value: 1 },
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
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    let baseOpacity = 1;
    const applyTheme = (t) => {
      const p = PALETTE[t] || PALETTE.dark;
      uniforms.uColor.value.set(p.color);
      uniforms.uSignal.value.set(p.signal);
      baseOpacity = p.opacity;
      mat.blending = p.blending;
      mat.needsUpdate = true;
    };
    applyTheme(themeRef.current);
    applyThemeRef.current = applyTheme;

    // --- scroll → (section index, morph amount) ----------------------------
    let breaks = [];
    const measure = () => {
      breaks = Array.from(document.querySelectorAll(".chapter-break")).map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + window.scrollY + r.height / 2;
      });
    };
    measure();
    let target = 0; // continuous form index (0 = terrain … 6 = @)
    let stageTarget = 0; // 1 while a chapter break is centred on screen
    let stageShift = 0; // px the nearest break sits above/below its resting spot
    const ease = (k) => k * k * (3 - 2 * k);
    const onScroll = () => {
      const vh = window.innerHeight;
      let t = 0;
      let stage = 0;
      let nearest = Infinity;
      breaks.forEach((centre) => {
        const y = centre - window.scrollY; // break centre in viewport px
        // morph as the break rises from the bottom edge to ~40% of the screen
        t += ease(Math.min(1, Math.max(0, (vh * 0.98 - y) / (vh * 0.58))));
        const d = y - vh * 0.5;
        // leaving (break moving up) hands the screen back to content faster
        const k = d < 0 ? Math.min(1, Math.max(0, (-d - vh * 0.08) / (vh * 0.26))) : Math.min(1, Math.max(0, (d - vh * 0.18) / (vh * 0.42)));
        stage = Math.max(stage, 1 - ease(k));
        if (Math.abs(d) < Math.abs(nearest)) nearest = d;
      });
      target = Math.min(SECTIONS.length - 1, t);
      stageTarget = stage;
      stageShift = Number.isFinite(nearest) ? nearest : 0;
    };
    const remeasure = setInterval(() => {
      measure();
      onScroll();
    }, 1000); // layout shifts (preloader, images, fonts)

    // --- pointer --------------------------------------------------------------
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 230);
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const hit = new THREE.Vector3();
    const mouseTarget = new THREE.Vector2(0, -600);
    let px = 0;
    let py = 0;
    const onPointer = (e) => {
      px = (e.clientX / width) * 2 - 1;
      py = -(e.clientY / height) * 2 + 1;
      ndc.set(px, py);
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hit)) mouseTarget.set(hit.x, hit.z);
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      measure();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    // --- loop -------------------------------------------------------------------
    const clock = new THREE.Clock();
    let current = target;
    let loaded = 0; // which "from" index is in the buffers
    let frame;
    let running = true;
    let spin = 0;
    let lastVeil = -1;
    let stage = 0;

    const loadPair = (i) => {
      const a = shapes[i];
      const b = shapes[Math.min(i + 1, shapes.length - 1)];
      fromAttr.array.set(a);
      toAttr.array.set(b);
      fromAttr.needsUpdate = true;
      toAttr.needsUpdate = true;
      loaded = i;
    };
    loadPair(Math.floor(current));

    const render = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.elapsedTime;
      uniforms.uTime.value = reduced ? 0 : time;

      current += (target - current) * (reduced ? 1 : 0.07);
      const base = Math.min(Math.floor(current + 1e-4), SECTIONS.length - 1);
      if (base !== loaded) loadPair(base);
      const mix = base >= SECTIONS.length - 1 ? 0 : current - base;
      uniforms.uMix.value = mix;

      // terrain waves only while the hero form is showing
      const wave = base === 0 ? 1 - mix : 0;
      uniforms.uWave.value = wave;
      uniforms.uMouse.value.lerp(mouseTarget, 0.08);

      // non-terrain forms slowly rotate and lean toward the pointer
      if (!reduced) spin += dt;
      const formAmt = 1 - wave;
      // gentle sway (flat forms never turn edge-on) + pointer lean
      uniforms.uRotY.value = (Math.sin(spin * 0.3) * 0.42 + px * 0.3) * formAmt;
      uniforms.uRotX.value = (0.15 - py * 0.15) * formAmt;
      const nxt = Math.min(base + 1, SECTIONS.length - 1);
      stage += (stageTarget - stage) * (reduced ? 1 : 0.08);
      const [ax, ay] = placement(base, stage);
      const [bx, by] = placement(nxt, stage);
      uniforms.uOffA.value.set(ax, ay);
      uniforms.uOffB.value.set(bx, by);
      uniforms.uScaleA.value = scaleOf(base, stage);
      uniforms.uScaleB.value = scaleOf(nxt, stage);

      // veil: fade the content column once we leave the hero
      const veil = Math.round(formAmt * (1 - stage) * 100) / 100;
      if (veil !== lastVeil) {
        mount.style.setProperty("--veil", veil);
        lastVeil = veil;
      }

      // forms sit behind content: a touch dimmer than the hero
      // narrow screens have no side gutter: forms live only in their chapter breaks
      uniforms.uOpacity.value = baseOpacity * Math.max(wave, stage, narrow() ? 0.06 : 0.9);
      uniforms.uSize.value = (isMobile ? 4.4 : 4.0) * (1 + 0.15 * formAmt);

      // hero camera looks down at the terrain; forms are seen straight on
      camera.position.set(px * 30 * wave, 170 * wave + py * 14, 720 - 300 * wave);
      camera.lookAt(px * 20 * wave, -120 * wave, -300 * wave);

      renderer.render(scene, camera);
      if (running && !reduced) frame = requestAnimationFrame(render);
    };
    render();

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        clock.getDelta();
        render();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    const staticRender = () => reduced && render();
    window.addEventListener("scroll", staticRender, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      clearInterval(remeasure);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", staticRender);
      window.removeEventListener("pointermove", onPointer);
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
