"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createPerfumeBottle, disposeObject } from "./perfume-bottle";

function createPedestal() {
  const pedestal = new THREE.Group();
  const stone = new THREE.MeshStandardMaterial({
    color: 0x574448,
    metalness: 0.44,
    roughness: 0.31,
  });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.96, 0.19, 64), stone);
  base.position.y = -0.88;
  pedestal.add(base);
  return pedestal;
}

export default function HomeBottleScene({ products, selectedId, onSelect }) {
  const containerRef = useRef(null);
  const selectedIdRef = useRef(selectedId);
  const renderSelectionRef = useRef(null);
  const [sceneAvailable, setSceneAvailable] = useState(false);
  const selectedProduct = products.find((product) => product.id === selectedId) ?? products[0];

  selectedIdRef.current = selectedId;

  useEffect(() => {
    renderSelectionRef.current?.();
  }, [selectedId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !products.length) return undefined;

    let disposed = false;
    let visible = true;
    let animationFrame = 0;
    let renderer;
    let scene;
    let resizeObserver;
    let intersectionObserver;
    let visibilityChangeHandler;
    const bottleGroups = [];
    const pedestals = [];
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    async function createScene() {
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
      } catch (error) {
        console.warn("The homepage 3D bottle scene is unavailable.", error);
        return;
      }

      scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
      camera.position.set(0, 1.25, 8.8);
      camera.lookAt(0, 0.08, 0);

      scene.add(new THREE.HemisphereLight(0xfff1df, 0x30222a, 2.1));
      const keyLight = new THREE.DirectionalLight(0xffe4c4, 3.7);
      keyLight.position.set(-3, 5, 5);
      scene.add(keyLight);
      const rimLight = new THREE.PointLight(0xd7a77f, 45, 15);
      rimLight.position.set(4, 1.5, -2);
      scene.add(rimLight);
      const fillLight = new THREE.PointLight(0xa782a0, 28, 14);
      fillLight.position.set(-4, 0.3, 3);
      scene.add(fillLight);

      const floor = new THREE.Mesh(
        new THREE.CircleGeometry(5, 64),
        new THREE.MeshBasicMaterial({ color: 0x291f24, transparent: true, opacity: 0.5 }),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -1;
      scene.add(floor);

      const positions = new Float32Array(150 * 3);
      for (let index = 0; index < 150; index += 1) {
        const offset = index * 3;
        positions[offset] = Math.sin(index * 12.9898) * 4.6;
        positions[offset + 1] = ((index * 7.137) % 4.6) - 1.4;
        positions[offset + 2] = Math.cos(index * 4.141) * 2.4;
      }
      const particles = new THREE.BufferGeometry();
      particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xe6c9a7,
        size: 1.8,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.68,
        depthWrite: false,
      });
      scene.add(new THREE.Points(particles, particleMaterial));

      const spacing = window.matchMedia("(max-width: 760px)").matches ? 1.45 : 2.55;
      const initialSelectedIndex = Math.max(
        0,
        products.findIndex((product) => product.id === selectedIdRef.current),
      );
      products.forEach((product, index) => {
        const centeredIndex = index - (products.length - 1) / 2;
        const scale = index === initialSelectedIndex ? 0.91 : 0.68;
        const depth = index === initialSelectedIndex ? 0.55 : -0.2;
        const bottle = createPerfumeBottle(THREE, product.name);
        bottle.position.set(
          centeredIndex * spacing,
          0.195 * scale,
          depth,
        );
        bottle.userData.productId = product.id;
        bottle.scale.setScalar(scale);
        bottle.traverse((part) => {
          part.userData.productId = product.id;
        });
        scene.add(bottle);
        bottleGroups.push(bottle);

        const pedestal = createPedestal();
        pedestal.position.set(centeredIndex * spacing, 0, depth);
        pedestal.scale.setScalar(scale);
        scene.add(pedestal);
        pedestals.push(pedestal);
      });

      if (disposed) {
        disposeObject(scene);
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      container.appendChild(renderer.domElement);
      setSceneAvailable(true);

      function resize() {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.position.z = window.matchMedia("(max-width: 760px)").matches ? 10.6 : 8.8;
        camera.updateProjectionMatrix();
        render();
      }

      function render() {
        if (disposed) return;
        renderer.render(scene, camera);
      }

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      function updateSelection() {
        const selectedIndex = Math.max(
          0,
          products.findIndex((product) => product.id === selectedIdRef.current),
        );
        bottleGroups.forEach((bottle, index) => {
          const selected = index === selectedIndex;
          const scale = selected ? 1.04 : 0.68;
          bottle.scale.setScalar(scale);
          bottle.position.y = 0.195 * scale;
          bottle.position.z = selected ? 0.55 : -0.2;
          pedestals[index].position.z = selected ? 0.55 : -0.2;
          pedestals[index].scale.setScalar(scale);
        });
        render();
        if (visible && !reducedMotion) startLoop();
      }
      renderSelectionRef.current = updateSelection;
      function updatePointer(event) {
        const bounds = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(bottleGroups, true)[0];
        renderer.domElement.style.cursor = hit ? "pointer" : "default";
        return hit;
      }

      function selectBottleAtPointer(event) {
        const hit = updatePointer(event);
        let target = hit?.object;
        while (target && !target.userData.productId) target = target.parent;
        const productId = target?.userData.productId;
        if (productId && productId !== selectedIdRef.current) {
          onSelect(productId);
        }
      }

      function onPointerMove(event) {
        selectBottleAtPointer(event);
      }

      function onPointerLeave() {
        renderer.domElement.style.cursor = "default";
      }

      function onPointerDown(event) {
        selectBottleAtPointer(event);
      }

      function drawLoop() {
        if (disposed || !visible || document.hidden) return;
        const selectedIndex = Math.max(
          0,
          products.findIndex((product) => product.id === selectedIdRef.current),
        );
        bottleGroups.forEach((bottle, index) => {
          const selected = index === selectedIndex;
          const restingScale = selected ? 0.91 : 0.68;
          const targetScale = selected ? 1.04 : restingScale;
          bottle.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.075);
          bottle.position.z += ((selected ? 0.55 : -0.2) - bottle.position.z) * 0.075;
          pedestals[index].position.z +=
            ((selected ? 0.55 : -0.2) - pedestals[index].position.z) * 0.075;
          bottle.rotation.y += selected ? 0.004 : 0.002;
          bottle.position.y =
            0.195 * targetScale +
            0.025 +
            Math.sin(performance.now() * 0.0009 + index * 1.8) * 0.02;
          pedestals[index].scale.lerp(
            new THREE.Vector3(targetScale, targetScale, targetScale),
            0.075,
          );
        });
        render();
        if (!reducedMotion) {
          animationFrame = window.requestAnimationFrame(drawLoop);
        }
      }

      function startLoop() {
        window.cancelAnimationFrame(animationFrame);
        if (visible && !document.hidden) {
          if (reducedMotion) render();
          else animationFrame = window.requestAnimationFrame(drawLoop);
        }
      }

      renderer.domElement.addEventListener("pointermove", onPointerMove);
      renderer.domElement.addEventListener("pointerleave", onPointerLeave);
      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      intersectionObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        startLoop();
      });
      intersectionObserver.observe(container);
      visibilityChangeHandler = startLoop;
      document.addEventListener("visibilitychange", visibilityChangeHandler);
      startLoop();
      resize();
    }

    createScene().catch((error) => {
      if (!disposed) console.error("Unable to load the homepage 3D bottle scene.", error);
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      if (visibilityChangeHandler) {
        document.removeEventListener("visibilitychange", visibilityChangeHandler);
      }
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
      if (scene) disposeObject(scene);
      renderSelectionRef.current = null;
    };
  }, [products, onSelect]);

  return (
    <div className="home-bottle-canvas-wrap">
      {!sceneAvailable && selectedProduct ? (
        <img
          className="home-bottle-fallback"
          src={selectedProduct.image}
          alt={selectedProduct.alt}
        />
      ) : null}
      <div className="home-bottle-canvas" ref={containerRef} aria-hidden="true" />
    </div>
  );
}
