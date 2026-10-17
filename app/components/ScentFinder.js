"use client";

import { useState } from "react";
import PerfumeCard from "./PerfumeCard";

const moods = [
  {
    id: "grounded",
    name: "Grounded",
    description: "Warm woods and glowing amber",
    notes: ["oud", "amber", "wood", "cedar", "vetiver", "sandalwood", "tonka"],
  },
  {
    id: "radiant",
    name: "Radiant",
    description: "Bright citrus and sunlit greens",
    notes: ["citrus", "bergamot", "neroli", "orange", "fig", "saffron"],
  },
  {
    id: "romantic",
    name: "Romantic",
    description: "Soft petals and skin-close musk",
    notes: ["rose", "peony", "jasmine", "floral", "musk", "plum"],
  },
];

export default function ScentFinder({ products, onAdd }) {
  const [moodId, setMoodId] = useState("");
  const mood = moods.find((item) => item.id === moodId);

  const matches = mood
    ? [...products]
        .map((product) => ({
          product,
          score: mood.notes.reduce(
            (total, note) =>
              total + (product.notes.toLocaleLowerCase().includes(note) ? 1 : 0),
            0,
          ),
        }))
        .filter(({ score }) => score > 0)
        .sort((first, second) => second.score - first.score)
        .slice(0, 3)
        .map(({ product }) => product)
    : [];

  return (
    <section className="scent-finder" aria-labelledby="scent-finder-title">
      <div className="scent-finder-heading">
        <p className="eyebrow">A little instinct, a little insight</p>
        <h2 id="scent-finder-title">Find the scent that <em>feels like you.</em></h2>
        <p>Choose the mood you want to carry. We’ll find a few notes to match it.</p>
      </div>
      <div className="scent-mood-options" role="group" aria-label="Choose a scent mood">
        {moods.map((item, index) => (
          <button
            className={`scent-mood-option${moodId === item.id ? " is-selected" : ""}`}
            type="button"
            key={item.id}
            aria-pressed={moodId === item.id}
            onClick={() => setMoodId(item.id)}
          >
            <span className={`scent-mood-orb scent-mood-orb-${item.id}`} aria-hidden="true">
              <span />
            </span>
            <span className="scent-mood-copy">
              <span className="scent-mood-index">0{index + 1}</span>
              <strong>{item.name}</strong>
              <span>{item.description}</span>
            </span>
            <span className="scent-mood-arrow" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      {mood ? (
        <div className="scent-finder-results" aria-live="polite">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your mood, translated</p>
              <h3>{mood.name} <em>notes.</em></h3>
            </div>
            <button className="text-link scent-finder-reset" type="button" onClick={() => setMoodId("")}>
              Start again <span aria-hidden="true">×</span>
            </button>
          </div>
          {matches.length ? (
            <div className="product-grid">
              {matches.map((product) => (
                <PerfumeCard key={product.id} product={product} onAdd={onAdd} />
              ))}
            </div>
          ) : (
            <p className="scent-finder-empty">
              No exact note match yet. Browse the full collection to explore every fragrance.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
