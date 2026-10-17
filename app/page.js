"use client";

import { useState } from "react";
import Link from "next/link";
import { useProducts } from "./ProductsProvider";
import ProductSkeleton from "./components/ProductSkeleton";
import PerfumeCard from "./components/PerfumeCard";

const stories = [
  {
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80",
    category: "THE ART OF SCENT · 4 MIN READ",
    title: "Finding a fragrance that feels like you",
  },
  {
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
    category: "FROM THE ATELIER · 3 MIN READ",
    title: "A softer way to think about layering",
  },
  {
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
    category: "RITUALS · 5 MIN READ",
    title: "Make a small ritual of getting ready",
  },
];

export default function Home() {
  const { products, loading, error, addToBag } = useProducts();
  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  function handleAddToBag(product) {
    addToBag(product);
    window.dispatchEvent(
      new CustomEvent("storefront-toast", {
        detail: `${product.name} added to your bag`,
      }),
    );
  }

  function subscribe(event) {
    event.preventDefault();
    setNewsletterMessage(`Thank you — we'll be in touch at ${email}.`);
    setEmail("");
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-image" />
          <div className="hero-copy">
            <p className="eyebrow light">Scent, with a sense of place</p>
            <h1 id="hero-title">
              A little closer
              <br />
              to <em>yourself.</em>
            </h1>
            <p>
              Quietly distinctive fragrances, composed to stay with you long
              after the moment has passed.
            </p>
            <a className="button button-light" href="#collection">
              Explore the collection <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="hero-note">
            <span>01 / 05</span>
            <span>Made to be remembered</span>
          </div>
          <div className="hero-stamp" aria-hidden="true">
            <span>EAU DE PARFUM</span>
            <b>LA</b>
            <span>EST. 2024</span>
          </div>
        </section>

        <section className="intro section-shell">
          <p className="eyebrow">The art of wearing a feeling</p>
          <h2>
            Not just a fragrance.
            <br />
            <em>A feeling you can return to.</em>
          </h2>
          <a className="text-link" href="#story">
            Get to know us <span aria-hidden="true">↗</span>
          </a>
        </section>

        <section className="collection section-shell" id="collection">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Find your signature</p>
              <h2>
                Scents for <em>every side.</em>
              </h2>
            </div>
            <Link className="text-link desktop-link" href="/perfumes">
              View all fragrances <span aria-hidden="true">→</span>
            </Link>
          </div>
          {error ? <p className="store-error">{error}</p> : null}
          {loading ? (
            <div className="product-grid" aria-label="Loading fragrances">
              {[0, 1, 2].map((item) => (
                <ProductSkeleton key={item} />
              ))}
            </div>
          ) : products.length ? (
            <div className="product-grid">
              {products.slice(0, 3).map((product) => (
                <PerfumeCard
                  product={product}
                  onAdd={handleAddToBag}
                  key={product.id}
                />
              ))}
            </div>
          ) : (
            <p className="empty-search">
              Our collection is being composed. Check back soon.
            </p>
          )}
          <Link className="text-link mobile-link" href="/perfumes">
            View all fragrances <span aria-hidden="true">→</span>
          </Link>
        </section>

        <section className="editorial" id="story">
          <div
            className="editorial-image"
            role="img"
            aria-label="Sunlit landscape and soft shadows"
          />
          <div className="editorial-copy">
            <p className="eyebrow">A note from our atelier</p>
            <h2>
              Made slowly.
              <br />
              <em>Worn your way.</em>
            </h2>
            <p>
              We believe the best fragrances leave room for you. Each
              composition begins with thoughtfully sourced ingredients and is
              shaped with care, balance, and a little bit of wonder.
            </p>
            <a className="button button-dark" href="#values">
              The Lujainae approach <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className="values section-shell" id="values">
          <div className="value-item">
            <span className="value-number">01</span>
            <h3>Thoughtful by nature</h3>
            <p>Considered ingredients, selected for character and quality.</p>
          </div>
          <div className="value-item">
            <span className="value-number">02</span>
            <h3>Made to linger</h3>
            <p>Beautifully layered scents that unfold throughout your day.</p>
          </div>
          <div className="value-item">
            <span className="value-number">03</span>
            <h3>Always personal</h3>
            <p>A fragrance wardrobe for wherever life takes you.</p>
          </div>
        </section>

        <section className="quote-section">
          <p className="eyebrow">A little love, from you</p>
          <blockquote>“It feels like a memory I haven't made yet.”</blockquote>
          <p className="quote-credit">MAYA R. &nbsp;·&nbsp; VERIFIED CUSTOMER</p>
          <div className="quote-dots" aria-hidden="true">
            <span className="active" />
            <span />
            <span />
          </div>
        </section>

        <section className="journal section-shell" id="journal">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Notes from the atelier</p>
              <h2>
                The <em>journal.</em>
              </h2>
            </div>
            <a className="text-link desktop-link" href="#journal">
              Read all stories <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="journal-grid">
            {stories.map((story) => (
              <article className="journal-card" key={story.title}>
                <div
                  className="journal-image"
                  style={{ backgroundImage: `url("${story.image}")` }}
                />
                <p className="eyebrow">{story.category}</p>
                <h3>{story.title}</h3>
                <a href="#collection" className="text-link">
                  Read the story <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="newsletter" id="newsletter">
          <p className="eyebrow light">A note, now and then</p>
          <h2>
            Stay a little <em>longer.</em>
          </h2>
          <p>New scents, thoughtful rituals, and a first look at what's next.</p>
          <form className="newsletter-form" onSubmit={subscribe}>
            <label className="visually-hidden" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit">
              Join us <span aria-hidden="true">→</span>
            </button>
          </form>
          <p className="newsletter-message" aria-live="polite">
            {newsletterMessage}
          </p>
        </section>
      </main>

    </>
  );
}
