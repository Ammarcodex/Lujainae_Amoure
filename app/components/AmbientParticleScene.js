"use client";

import { useEffect, useRef } from "react";

export default function AmbientParticleScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    let disposed = false;
    let animationFrame;
    let renderer;
    let geometry;
    let material;
    let resizeObserver;

    async function createScene() {
      const THREE = await import("three");
      if (disposed || !containerRef.current) return;

      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: "low-power",
        });
      } catch (error) {
        console.warn("The 3D particle scene is unavailable.", error);
        return;
      }

      const container = containerRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
      camera.position.z = 14;

      const particleCount = window.matchMedia("(max-width: 760px)").matches ? 110 : 220;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const drift = new Float32Array(particleCount);

      for (let index = 0; index < particleCount; index += 1) {
        const offset = index * 3;
        positions[offset] = (Math.random() - 0.5) * 19;
        positions[offset + 1] = (Math.random() - 0.5) * 12;
        positions[offset + 2] = (Math.random() - 0.5) * 8;
        drift[index] = 0.0015 + Math.random() * 0.003;

        const color = new THREE.Color().setHSL(
          0.075 + Math.random() * 0.035,
          0.42 + Math.random() * 0.24,
          0.72 + Math.random() * 0.2,
        );
        colors[offset] = color.r;
        colors[offset + 1] = color.g;
        colors[offset + 2] = color.b;
      }

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      material = new THREE.PointsMaterial({
        size: 2.5,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.72,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      scene.add(new THREE.Points(geometry, material));

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

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      resize();

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reducedMotion) {
        function animate() {
          const particlePositions = geometry.attributes.position.array;
          for (let index = 0; index < particleCount; index += 1) {
            const offset = index * 3;
            particlePositions[offset + 1] += drift[index];
            if (particlePositions[offset + 1] > 6.5) {
              particlePositions[offset + 1] = -6.5;
            }
          }
          geometry.attributes.position.needsUpdate = true;
          renderer.render(scene, camera);
          animationFrame = window.requestAnimationFrame(animate);
        }

        animationFrame = window.requestAnimationFrame(animate);
      }
    }

    createScene().catch((error) => {
      if (!disposed) console.error("Unable to load the 3D particle scene.", error);
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  return <div className="ambient-scene" ref={containerRef} aria-hidden="true" />;
}
