"use client";

import Link from "next/link";
import { useState } from "react";

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h14l1 13H4L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

export default function SiteHeader({ count, onOpenBag }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="announcement">
        <span>Complimentary delivery on orders over $100</span>
        <Link href="/perfumes">
          Discover the collection <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <header className="site-header">
        <button
          className="icon-button menu-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 7h18M3 12h18M3 17h18" />
          </svg>
        </button>
        <nav
          className={`main-nav${menuOpen ? " is-open" : ""}`}
          aria-label="Main navigation"
        >
          <Link href="/perfumes" onClick={() => setMenuOpen(false)}>
            Shop all
          </Link>
          <Link href="/#story" onClick={() => setMenuOpen(false)}>
            Our story
          </Link>
          <Link href="/#journal" onClick={() => setMenuOpen(false)}>
            The journal
          </Link>
        </nav>
        <Link className="wordmark" href="/" aria-label="Lujainae Amoure home">
          <span>LUJAINAE</span>
          <i>AMOURE</i>
        </Link>
        <div className="header-actions">
          <Link className="search-link" href="/perfumes" aria-label="Search perfumes">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" />
            </svg>
          </Link>
          <Link className="admin-link" href="/admin">Admin</Link>
          <button
            className="icon-button bag-toggle"
            aria-label={`Open shopping bag, ${count} items`}
            onClick={onOpenBag}
          >
            <BagIcon />
            <span className="bag-count" aria-live="polite">{count}</span>
          </button>
        </div>
      </header>
    </>
  );
}
