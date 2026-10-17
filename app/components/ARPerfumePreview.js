"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createPerfumeBottle, disposeObject } from "./perfume-bottle";

export default function ARPerfumePreview({ name, onClose }) {
  const containerRef = useRef(null);
  const mountedRef = useRef(false);
  const sessionRef = useRef(null);
  const cleanupRef = useRef(null);
  const [support, setSupport] = useState("checking");
  const [starting, setStarting] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    mountedRef.current = true;

    async function checkSupport() {
      if (!navigator.xr?.isSessionSupported) {
        setSupport("unsupported");
        return;
      }
      try {
        const supported = await navigator.xr.isSessionSupported("immersive-ar");
        if (!cancelled) setSupport(supported ? "supported" : "unsupported");
      } catch (error) {
        if (!cancelled) {
          console.error("Unable to check AR support.", error);
          setSupport("unsupported");
        }
      }
    }

    checkSupport();
    return () => {
      cancelled = true;
      mountedRef.current = false;
      sessionRef.current?.end();
      cleanupRef.current?.();
    };
  }, []);

  async function startAR() {
    setMessage("");
    let renderer;
    let bottle;
    let reticle;
    let hitTestSource;
    let cleaned = false;

    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      renderer?.setAnimationLoop(null);
      hitTestSource?.cancel();
      if (bottle) disposeObject(bottle);
      if (reticle) disposeObject(reticle);
      renderer?.dispose();
      renderer?.domElement.remove();
      sessionRef.current = null;
      cleanupRef.current = null;
      if (mountedRef.current) setSessionActive(false);
    }

    setStarting(true);
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.xr.enabled = true;
      renderer.xr.setReferenceSpaceType("local");
      cleanupRef.current = cleanup;

      const sessionPromise = navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test"],
        optionalFeatures: ["dom-overlay"],
        domOverlay: { root: containerRef.current },
      });

      const session = await sessionPromise;
      sessionRef.current = session;
      session.addEventListener("end", cleanup, { once: true });
      if (!mountedRef.current) {
        await session.end();
        cleanup();
        return;
      }
      await renderer.xr.setSession(session);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera();
      scene.add(new THREE.HemisphereLight(0xffffff, 0x514234, 2));
      const light = new THREE.DirectionalLight(0xffe2bb, 2);
      light.position.set(1, 3, 2);
      scene.add(light);

      bottle = createPerfumeBottle(THREE, name);
      bottle.scale.setScalar(0.12);
      bottle.visible = false;
      scene.add(bottle);

      reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.12, 0.16, 32),
        new THREE.MeshBasicMaterial({ color: 0xe8d3b2, side: THREE.DoubleSide }),
      );
      reticle.rotation.x = -Math.PI / 2;
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      scene.add(reticle);

      const viewerSpace = await session.requestReferenceSpace("viewer");
      hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
      const referenceSpace = renderer.xr.getReferenceSpace();
      let currentHitMatrix = null;

      session.addEventListener(
        "select",
        () => {
          if (!currentHitMatrix) return;
          bottle.position.setFromMatrixPosition(currentHitMatrix);
          bottle.quaternion.setFromRotationMatrix(currentHitMatrix);
          bottle.position.add(
            new THREE.Vector3(0, 0.13, 0).applyQuaternion(bottle.quaternion),
          );
          bottle.visible = true;
        },
      );

      containerRef.current.appendChild(renderer.domElement);
      renderer.setAnimationLoop((_time, frame) => {
        if (frame && hitTestSource && referenceSpace) {
          const hit = frame.getHitTestResults(hitTestSource)[0];
          const pose = hit?.getPose(referenceSpace);
          if (pose) {
            currentHitMatrix = new THREE.Matrix4().fromArray(pose.transform.matrix);
            reticle.matrix.copy(currentHitMatrix);
            reticle.visible = true;
          } else {
            currentHitMatrix = null;
            reticle.visible = false;
          }
        }
        renderer.render(scene, camera);
      });
      if (mountedRef.current) {
        setSessionActive(true);
        setStarting(false);
      }
    } catch (error) {
      console.error("Unable to start the AR preview.", error);
      if (mountedRef.current) {
        setMessage(
          error instanceof Error
            ? `AR preview could not start: ${error.message}`
            : "AR preview could not start on this device.",
        );
      }
      if (sessionRef.current) await sessionRef.current.end();
      cleanup();
      if (mountedRef.current) {
        setSessionActive(false);
        setStarting(false);
      }
    }
  }

  async function endAR() {
    if (sessionRef.current) await sessionRef.current.end();
    onClose();
  }

  return (
    <div
      className={`ar-preview-overlay${sessionActive ? " is-active" : ""}`}
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} AR preview`}
    >
      {sessionActive ? (
        <>
          <p className="ar-preview-instruction">
            Move your camera to find a surface, then tap to place the bottle.
          </p>
          <button className="ar-preview-exit" type="button" onClick={endAR}>
            Exit AR
          </button>
        </>
      ) : (
        <div className="ar-preview-panel">
          <button className="experience-close" type="button" onClick={onClose} aria-label="Close AR preview">
            ×
          </button>
          <p className="eyebrow">See it in your space</p>
          <h2>{name}</h2>
          {support === "checking" ? (
            <p>Checking whether this device supports AR…</p>
          ) : support === "unsupported" ? (
            <p role="status">
              Live AR requires a compatible mobile browser, camera access, and
              an HTTPS connection. You can still explore the 3D bottle preview.
            </p>
          ) : (
            <>
              <p>Place a stylized bottle concept on a flat surface around you.</p>
              <button className="button button-dark" type="button" disabled={starting} onClick={startAR}>
                {starting ? "Starting AR…" : "Start camera preview"} <span aria-hidden="true">↗</span>
              </button>
            </>
          )}
          {message ? <p className="ar-preview-error" role="alert">{message}</p> : null}
        </div>
      )}
    </div>
  );
}
