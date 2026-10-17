export const DEFAULT_PRODUCTS = [
  {
    id: "saffron-dusk",
    name: "Saffron Dusk",
    notes: "Amber · Saffron · Vanilla",
    description:
      "A warm, golden scent that opens with saffron and settles into soft amber and creamy vanilla. Made for the last light of the day.",
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
    description:
      "Fresh rose petals meet a lively touch of pink pepper, softened by a clean musk. A modern floral with an easy, luminous finish.",
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
    description:
      "Green fig and dry cedar create a calm, quietly earthy blend, finished with smooth vetiver. Familiar, grounded, and easy to wear.",
    price: 86,
    label: "A QUIET FAVORITE",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85",
    alt: "Minimal glass fragrance bottle with botanical accents",
  },
  {
    id: "oud-reverie",
    name: "Oud Reverie",
    notes: "Oud · Rose · Smoked woods",
    description:
      "Velvety rose and rich oud settle into smoky woods for a deep, elegant fragrance made for evenings that linger.",
    price: 96,
    compareAtPrice: 120,
    label: "HOT DEAL",
    image:
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=900&q=85",
    alt: "Dark glass perfume bottle with a warm, elegant glow",
  },
  {
    id: "velvet-bloom",
    name: "Velvet Bloom",
    notes: "Peony · Jasmine · White musk",
    description:
      "Airy peony and luminous jasmine unfold over a soft musk base, bringing an effortless floral warmth to every day.",
    price: 78,
    compareAtPrice: 98,
    label: "HOT DEAL",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85",
    alt: "Elegant perfume bottle in a softly lit floral setting",
  },
  {
    id: "citrus-no-9",
    name: "Citrus No. 9",
    notes: "Bergamot · Neroli · Cedar",
    description:
      "Bright bergamot and delicate neroli open with a clean sparkle before meeting smooth cedar and a sunlit, lasting finish.",
    price: 72,
    compareAtPrice: 90,
    label: "HOT DEAL",
    image:
      "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=900&q=85",
    alt: "Clear fragrance bottle with crisp, fresh styling",
  },
  {
    id: "midnight-rose",
    name: "Midnight Rose",
    notes: "Black rose · Plum · Patchouli",
    description:
      "A dramatic rose accord meets ripe plum and earthy patchouli for a rich, modern floral with a mysterious edge.",
    price: 84,
    compareAtPrice: 105,
    label: "HOT DEAL",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85",
    alt: "Sculptural fragrance bottle with a moody, dark backdrop",
  },
  {
    id: "amber-veil",
    name: "Amber Veil",
    notes: "Amber · Tonka · Sandalwood",
    description:
      "Golden amber and smooth sandalwood are wrapped in the gentle sweetness of tonka for a comforting, skin-close scent.",
    price: 89,
    compareAtPrice: 112,
    label: "HOT DEAL",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",
    alt: "Amber perfume bottle surrounded by soft golden light",
  },
  {
    id: "desert-bloom",
    name: "Desert Bloom",
    notes: "Orange blossom · Fig · Vetiver",
    description:
      "Fresh orange blossom and green fig bring a sun-warmed brightness, balanced by dry vetiver and a quietly earthy trail.",
    price: 76,
    compareAtPrice: 95,
    label: "HOT DEAL",
    image:
      "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=900&q=85",
    alt: "Minimal fragrance bottle in warm desert-inspired tones",
  },
];

export const PRODUCT_STORAGE_KEY = "lujainae-amoure-products";
export const PRODUCT_MIGRATION_KEY = "lujainae-amoure-products-migration";
export const PRODUCT_MIGRATION_VERSION = "hot-deals-2";
export const NEW_DEFAULT_PRODUCTS = DEFAULT_PRODUCTS.slice(3);

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
        (product.description === undefined ||
          typeof product.description === "string") &&
        typeof product.price === "number" &&
        Number.isFinite(product.price) &&
        product.price > 0 &&
        (product.compareAtPrice === undefined ||
          (typeof product.compareAtPrice === "number" &&
            Number.isFinite(product.compareAtPrice) &&
            product.compareAtPrice > product.price)) &&
        typeof product.label === "string" &&
        typeof product.image === "string" &&
        typeof product.alt === "string",
    )
  );
}
