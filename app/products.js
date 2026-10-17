export const DEFAULT_PRODUCTS = [
  {
    id: "saffron-dusk",
    name: "Saffron Dusk",
    notes: "Amber · Saffron · Vanilla",
    price: 88,
    label: "BESTSELLER",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85",
    alt: "Amber glass perfume bottle in warm sunlight",
  },
  {
    id: "rosewater-no-4",
    name: "Rosewater No. 4",
    notes: "Rose · Pink pepper · Musk",
    price: 92,
    label: "NEW ARRIVAL",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",
    alt: "Sculptural perfume bottle against a soft neutral backdrop",
  },
  {
    id: "fig-and-cedar",
    name: "Fig & Cedar",
    notes: "Green fig · Cedar · Vetiver",
    price: 86,
    label: "A QUIET FAVORITE",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85",
    alt: "Minimal glass fragrance bottle with botanical accents",
  },
];

export const PRODUCT_STORAGE_KEY = "lujainae-amoure-products";

export function isProductList(value) {
  return (
    Array.isArray(value) &&
    new Set(value.map((product) => product?.id)).size === value.length &&
    value.every(
      (product) =>
        product &&
        typeof product.id === "string" &&
        typeof product.name === "string" &&
        typeof product.notes === "string" &&
        typeof product.price === "number" &&
        Number.isFinite(product.price) &&
        product.price > 0 &&
        typeof product.label === "string" &&
        typeof product.image === "string" &&
        typeof product.alt === "string",
    )
  );
}
