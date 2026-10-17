"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return undefined;
    }

    function updateScroll() {
      setScrolled(window.scrollY > 40);
    }

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, [isHome]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("nav-open");
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("nav-open");
    };
  }, [menuOpen]);

  return (
    <div
      className={`header-wrap${isHome ? " header-home" : ""}${scrolled ? " header-scrolled" : ""}${menuOpen ? " mobile-menu-open" : ""}`}
    >
      {menuOpen ? (
        <button
          className="mobile-menu-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
      <div className="utility-strip">
        <a className="utility-contact" href="mailto:hello@lujainaeamoure.com">
          hello@lujainaeamoure.com
        </a>
        <p>Complimentary delivery on orders over PKR 100</p>
        <div className="utility-links">
          <Link href="/#story">Our story</Link>
          <Link href="/admin">Admin</Link>
        </div>
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
        <Link className="wordmark" href="/" aria-label="Lujainae Amoure home">
          <span>LUJAINAE</span>
          <i>AMOURE</i>
        </Link>
        <nav
          className={`main-nav${menuOpen ? " is-open" : ""}`}
          aria-label="Main navigation"
        >
          <div className="mobile-menu-heading">
            <span>LUJAINAE <i>AMOURE</i></span>
            <button
              className="mobile-menu-close"
              type="button"
              aria-label="Close navigation"
              onClick={() => setMenuOpen(false)}
            >
              ×
            </button>
          </div>
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/perfumes" onClick={() => setMenuOpen(false)}>Shop all</Link>
          <Link href="/#story" onClick={() => setMenuOpen(false)}>Our story</Link>
          <Link className="nav-hot-deals" href="/hot-deals" onClick={() => setMenuOpen(false)}>Hot deals</Link>
          <Link href="/#journal" onClick={() => setMenuOpen(false)}>Journal</Link>
        </nav>
        <div className="header-actions">
          <Link className="search-link" href="/perfumes" aria-label="Search perfumes">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" />
            </svg>
          </Link>
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
    </div>
  );
}
