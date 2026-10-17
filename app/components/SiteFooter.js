import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="wordmark footer-wordmark" href="/">
            <span>LUJAINAE</span>
            <i>AMOURE</i>
          </Link>
          <p>Fragrance, felt deeply.</p>
        </div>
        <div className="footer-column">
          <h3>Explore</h3>
          <Link href="/perfumes">All fragrances</Link>
          <Link href="/#story">Our story</Link>
          <Link href="/#journal">The journal</Link>
        </div>
        <div className="footer-column">
          <h3>We&apos;re here</h3>
          <a href="mailto:hello@lujainaeamoure.com">Contact us</a>
          <Link href="/#newsletter">Shipping &amp; returns</Link>
          <Link href="/#newsletter">FAQs</Link>
        </div>
        <div className="footer-column footer-signoff">
          <h3>A slower kind of lovely.</h3>
          <p>Made with care, for wherever you are.</p>
          <div className="social-links">
            <a href="#instagram" aria-label="Instagram">
              ig
            </a>
            <a href="#pinterest" aria-label="Pinterest">
              p
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Lujainae Amoure</span>
        <span>Made for the moments that stay.</span>
        <Link href="/#newsletter">Privacy &amp; terms</Link>
      </div>
    </footer>
  );
}
