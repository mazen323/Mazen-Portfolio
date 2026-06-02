import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Interactive 3D "spider-web" constellation sphere for the hero section.
 * Nodes on a fibonacci sphere, nearby ones linked with glowing lines, forming
 * a web that surrounds the photo. Vanilla three.js (React 17 compatible).
 */
function HeroObject() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const getSize = () => {
      const rect = mount.getBoundingClientRect();
      return { w: rect.width || 420, h: rect.height || 420 };
    };

    let { w, h } = getSize();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // --- nodes on a fibonacci sphere --------------------------------------
    const NODE_COUNT = w < 600 ? 90 : 150;
    const RADIUS = 2.1;
    const nodes = [];
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < NODE_COUNT; i++) {
      const y = 1 - (i / (NODE_COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      nodes.push(
        new THREE.Vector3(
          Math.cos(theta) * r * RADIUS,
          y * RADIUS,
          Math.sin(theta) * r * RADIUS
        )
      );
    }

    const nodePositions = new Float32Array(NODE_COUNT * 3);
    nodes.forEach((vtx, i) => {
      nodePositions[i * 3] = vtx.x;
      nodePositions[i * 3 + 1] = vtx.y;
      nodePositions[i * 3 + 2] = vtx.z;
    });
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
    const nodeSprite = createCircleTexture();
    const nodeMat = new THREE.PointsMaterial({
      size: 0.12,
      map: nodeSprite,
      color: new THREE.Color("#7dd3fc"),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(nodeGeo, nodeMat);
    group.add(points);

    // --- connect nearby nodes (the web) -----------------------------------
    const linePositions = [];
    const maxDist = RADIUS * 0.62;
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (nodes[i].distanceTo(nodes[j]) < maxDist) {
          linePositions.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(linePositions), 3)
    );
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color("#6366f1"),
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
    });
    const web = new THREE.LineSegments(lineGeo, lineMat);
    group.add(web);

    // faint inner glow shell
    const glowGeo = new THREE.SphereGeometry(RADIUS * 0.96, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#38bdf8"),
      transparent: true,
      opacity: 0.05,
    });
    group.add(new THREE.Mesh(glowGeo, glowMat));

    // --- interaction ------------------------------------------------------
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      ({ w, h } = getSize());
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // --- render loop ------------------------------------------------------
    let frameId;
    const clock = new THREE.Clock();

    const render = () => {
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.18;
      group.rotation.x = Math.sin(t * 0.25) * 0.12;

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      group.rotation.y += mouse.x * 0.012;
      group.rotation.x += mouse.y * 0.25;

      nodeMat.size = 0.11 + Math.sin(t * 2) * 0.015;

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };

    if (prefersReduced) {
      renderer.render(scene, camera);
    } else {
      render();
    }

    // --- cleanup ----------------------------------------------------------
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      nodeGeo.dispose();
      lineGeo.dispose();
      glowGeo.dispose();
      nodeMat.dispose();
      lineMat.dispose();
      glowMat.dispose();
      nodeSprite.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="hero-web" aria-hidden="true" />;
}

function createCircleTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,255,255,0.9)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default HeroObject;
