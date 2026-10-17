"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createPerfumeBottle, disposeObject } from "./perfume-bottle";

export default function PerfumeBottleViewer({ name, onClose }) {
  const containerRef = useRef(null);
  const [sceneError, setSceneError] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let animationFrame;
    let resizeObserver;
    let renderer;
    let bottle;
    let dragging = false;
    let previousX = 0;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch (error) {
      console.warn("The 3D bottle viewer is unavailable.", error);
      setSceneError("3D preview is unavailable in this browser.");
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(0, 0.2, 7);
    scene.add(new THREE.HemisphereLight(0xfff4df, 0x382e2a, 2));
    const keyLight = new THREE.DirectionalLight(0xffe4c2, 3);
    keyLight.position.set(-3, 4, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xe6c69c, 2);
    rimLight.position.set(4, 1, -2);
    scene.add(rimLight);

    bottle = createPerfumeBottle(THREE, name);
    scene.add(bottle);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    function resize() {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }

    function onPointerDown(event) {
      dragging = true;
      previousX = event.clientX;
      renderer.domElement.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event) {
      if (!dragging) return;
      bottle.rotation.y += (event.clientX - previousX) * 0.012;
      previousX = event.clientX;
      if (reducedMotion) renderer.render(scene, camera);
    }

    function onPointerUp() {
      dragging = false;
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function animate() {
      if (!dragging) bottle.rotation.y += 0.003;
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    }
    if (reducedMotion) renderer.render(scene, camera);
    else animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      disposeObject(bottle);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [name]);

  return (
    <div className="bottle-viewer-overlay" role="dialog" aria-modal="true" aria-label={`${name} 3D bottle preview`}>
      <button className="experience-close" type="button" onClick={onClose} aria-label="Close 3D preview">
        ×
      </button>
      <div className="bottle-viewer-canvas" ref={containerRef} />
      <div className="bottle-viewer-caption">
        <p className="eyebrow">Stylized 3D concept</p>
        <h2>{name}</h2>
        <p>Drag to turn the bottle.</p>
        {sceneError ? <p role="status">{sceneError}</p> : null}
      </div>
    </div>
  );
}
