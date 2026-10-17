import "./globals.css";
import { ProductsProvider } from "./ProductsProvider";
import StorefrontShell from "./components/StorefrontShell";

export const metadata = {
  title: "Lujainae Amoure — Fragrance, felt deeply",
  description:
    "Discover Lujainae Amoure, a considered collection of modern fragrances inspired by memory and place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <ProductsProvider>
          <StorefrontShell>{children}</StorefrontShell>
        </ProductsProvider>
      </body>
    </html>
  );
}
