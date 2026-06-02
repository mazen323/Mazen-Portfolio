import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

/**
 * Full-screen constellation network: floating nodes connected by lines that
 * appear when nodes are near each other (the classic "net" background).
 * Vanilla three.js so it stays compatible with React 17. Theme-aware.
 */
function ParticleField() {
  const mountRef = useRef(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
    camera.position.z = 600;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // size of the visible plane at z = 0
    const fovRad = (camera.fov * Math.PI) / 180;
    let visH = 2 * Math.tan(fovRad / 2) * camera.position.z;
    let visW = visH * camera.aspect;

    const isMobile = width < 768;
    const COUNT = isMobile ? 55 : 120;
    const DEPTH = 260;
    const LINK_DIST = isMobile ? 150 : 175;
    const LINK_DIST_SQ = LINK_DIST * LINK_DIST;

    // node state
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    const half = { x: visW / 2 + 80, y: visH / 2 + 80, z: DEPTH };

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 2 * half.x;
      pos[i3 + 1] = (Math.random() - 0.5) * 2 * half.y;
      pos[i3 + 2] = (Math.random() - 0.5) * 2 * half.z;
      vel[i3] = (Math.random() - 0.5) * 0.32;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.32;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.12;
    }

    // --- node points ------------------------------------------------------
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const sprite = createCircleTexture();
    const nodeMat = new THREE.PointsMaterial({
      size: 6,
      map: sprite,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color("#7dd3fc"),
      opacity: 0.95,
    });
    const points = new THREE.Points(nodeGeo, nodeMat);
    scene.add(points);

    // --- link lines (rebuilt every frame) --------------------------------
    const MAX_LINKS = COUNT * 8;
    const linkPos = new Float32Array(MAX_LINKS * 6);
    const linkGeo = new THREE.BufferGeometry();
    linkGeo.setAttribute("position", new THREE.BufferAttribute(linkPos, 3));
    const linkMat = new THREE.LineBasicMaterial({
      color: new THREE.Color("#6366f1"),
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const links = new THREE.LineSegments(linkGeo, linkMat);
    scene.add(links);

    // --- interaction ------------------------------------------------------
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      visH = 2 * Math.tan(fovRad / 2) * camera.position.z;
      visW = visH * camera.aspect;
      half.x = visW / 2 + 80;
      half.y = visH / 2 + 80;
    };
    window.addEventListener("resize", onResize);

    // --- render loop ------------------------------------------------------
    let frameId;
    let wasLight = null;

    const step = () => {
      // move nodes + bounce within bounds
      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        pos[i3] += vel[i3];
        pos[i3 + 1] += vel[i3 + 1];
        pos[i3 + 2] += vel[i3 + 2];
        if (pos[i3] > half.x || pos[i3] < -half.x) vel[i3] *= -1;
        if (pos[i3 + 1] > half.y || pos[i3 + 1] < -half.y) vel[i3 + 1] *= -1;
        if (pos[i3 + 2] > half.z || pos[i3 + 2] < -half.z) vel[i3 + 2] *= -1;
      }
      nodeGeo.attributes.position.needsUpdate = true;

      // rebuild nearby links
      let v = 0;
      let count = 0;
      for (let i = 0; i < COUNT && count < MAX_LINKS; i++) {
        const ai = i * 3;
        for (let j = i + 1; j < COUNT && count < MAX_LINKS; j++) {
          const bj = j * 3;
          const dx = pos[ai] - pos[bj];
          const dy = pos[ai + 1] - pos[bj + 1];
          const dz = pos[ai + 2] - pos[bj + 2];
          if (dx * dx + dy * dy + dz * dz < LINK_DIST_SQ) {
            linkPos[v++] = pos[ai];
            linkPos[v++] = pos[ai + 1];
            linkPos[v++] = pos[ai + 2];
            linkPos[v++] = pos[bj];
            linkPos[v++] = pos[bj + 1];
            linkPos[v++] = pos[bj + 2];
            count++;
          }
        }
      }
      linkGeo.setDrawRange(0, count * 2);
      linkGeo.attributes.position.needsUpdate = true;

      // subtle parallax toward the mouse
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      camera.position.x += (mouse.x * 60 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 60 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      // theme-aware colours/blending so the net stays readable in both modes.
      // Additive blending on a light background is nearly invisible (adding
      // light to white does nothing), so light mode switches to normal blending
      // with a darker, more opaque line colour.
      const light = themeRef.current === "light";
      if (light !== wasLight) {
        wasLight = light;
        if (light) {
          nodeMat.color.set("#4f46e5");
          nodeMat.blending = THREE.NormalBlending;
          linkMat.color.set("#4f46e5");
          linkMat.blending = THREE.NormalBlending;
        } else {
          nodeMat.color.set("#7dd3fc");
          nodeMat.blending = THREE.AdditiveBlending;
          linkMat.color.set("#6366f1");
          linkMat.blending = THREE.AdditiveBlending;
        }
        nodeMat.needsUpdate = true;
        linkMat.needsUpdate = true;
      }
      nodeMat.opacity = light ? 0.85 : 0.95;
      linkMat.opacity = light ? 0.5 : 0.24;

      renderer.render(scene, camera);
    };

    const loop = () => {
      step();
      frameId = window.requestAnimationFrame(loop);
    };

    if (prefersReduced) {
      step();
    } else {
      loop();
    }

    // --- cleanup ----------------------------------------------------------
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      nodeGeo.dispose();
      linkGeo.dispose();
      nodeMat.dispose();
      linkMat.dispose();
      sprite.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="particle-field" aria-hidden="true" />;
}

function createCircleTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,255,255,0.85)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default ParticleField;
