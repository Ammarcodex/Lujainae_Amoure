"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  {
    eyebrow: "Scent, with a sense of place",
    title: <>A little closer<br />to <em>yourself.</em></>,
    description:
      "Quietly distinctive fragrances, composed to stay with you long after the moment has passed.",
    action: "Explore the collection",
    href: "/perfumes",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=2200&q=90",
    note: "Made to be remembered",
  },
  {
    eyebrow: "A little something lovely",
    title: <>A new season<br />of <em>good scents.</em></>,
    description:
      "Find your next signature in a collection made for the moods, places, and moments that make you.",
    action: "Shop hot deals",
    href: "/hot-deals",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=2200&q=90",
    note: "A few favourites, for less",
  },
  {
    eyebrow: "The art of wearing a feeling",
    title: <>Find a feeling<br />that <em>stays.</em></>,
    description:
      "From soft florals to warm woods, explore thoughtful compositions to make entirely your own.",
    action: "Find your fragrance",
    href: "/perfumes",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=2200&q=90",
    note: "Composed with care",
  },
];

export default function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || paused) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  function showSlide(index) {
    setActive((index + slides.length) % slides.length);
  }

  const slide = slides[active];

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured fragrances"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div
        className="hero-image"
        key={slide.image}
        style={{ backgroundImage: `linear-gradient(90deg, rgba(30,27,23,.66) 0%, rgba(34,30,27,.36) 44%, rgba(37,31,26,.04) 100%), url("${slide.image}")` }}
      />
      <div className="hero-copy" key={`copy-${active}`}>
        <p className="eyebrow light">{slide.eyebrow}</p>
        <h1>{slide.title}</h1>
        <p>{slide.description}</p>
        <Link className="button button-light" href={slide.href}>
          {slide.action} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="hero-controls" aria-label="Slideshow controls">
        <button type="button" aria-label="Previous slide" onClick={() => showSlide(active - 1)}>
          ←
        </button>
        <div className="hero-dots">
          {slides.map((item, index) => (
            <button
              type="button"
              key={item.eyebrow}
              aria-label={`Show slide ${index + 1} of ${slides.length}`}
              aria-current={active === index ? "true" : undefined}
              onClick={() => showSlide(index)}
            />
          ))}
        </div>
        <button type="button" aria-label="Next slide" onClick={() => showSlide(active + 1)}>
          →
        </button>
      </div>
      <div className="hero-note" aria-live="polite">
        <span>{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
        <span>{slide.note}</span>
      </div>
      <div className="hero-stamp" aria-hidden="true">
        <span>EAU DE PARFUM</span>
        <b>LA</b>
        <span>EST. 2024</span>
      </div>
    </section>
  );
}
