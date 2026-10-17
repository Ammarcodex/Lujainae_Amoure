"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const PerfumeBottleViewer = dynamic(() => import("./PerfumeBottleViewer"), {
  ssr: false,
});
const ARPerfumePreview = dynamic(() => import("./ARPerfumePreview"), {
  ssr: false,
});

export default function PerfumeExperience({ product }) {
  const [experience, setExperience] = useState("");

  useEffect(() => {
    if (!experience) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") setExperience("");
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [experience]);

  return (
    <div className="product-visual-experience">
      <img src={product.image} alt={product.alt} />
      {product.label ? <span className="product-label">{product.label}</span> : null}
      <div className="product-experience-actions">
        <button type="button" aria-label={`Explore ${product.name} in 3D`} onClick={() => setExperience("3d")}>
          Explore in 3D <span aria-hidden="true">↗</span>
        </button>
        <button type="button" aria-label={`Preview ${product.name} in your space`} onClick={() => setExperience("ar")}>
          Try in your space <span aria-hidden="true">⌖</span>
        </button>
      </div>
      {experience === "3d" ? (
        <PerfumeBottleViewer name={product.name} onClose={() => setExperience("")} />
      ) : null}
      {experience === "ar" ? (
        <ARPerfumePreview name={product.name} onClose={() => setExperience("")} />
      ) : null}
    </div>
  );
}
