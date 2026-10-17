"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  DEFAULT_PRODUCTS,
  isProductList,
  NEW_DEFAULT_PRODUCTS,
  PRODUCT_MIGRATION_KEY,
  PRODUCT_MIGRATION_VERSION,
  PRODUCT_STORAGE_KEY,
} from "./products";

const ProductsContext = createContext(null);
const BAG_STORAGE_KEY = "lujainae-amoure-bag";

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [bag, setBag] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bagLoaded, setBagLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedProducts = window.localStorage.getItem(PRODUCT_STORAGE_KEY);
      if (savedProducts !== null) {
        const parsedProducts = JSON.parse(savedProducts);
        if (!isProductList(parsedProducts)) {
          throw new Error("Saved perfume data has an invalid format.");
        }
        const migrationVersion = window.localStorage.getItem(PRODUCT_MIGRATION_KEY);
        const productsToMigrate =
          migrationVersion === PRODUCT_MIGRATION_VERSION
            ? []
            : NEW_DEFAULT_PRODUCTS.filter(
                (product) =>
                  !parsedProducts.some((saved) => saved.id === product.id),
              );
        const defaultProductsById = new Map(
          DEFAULT_PRODUCTS.map((product) => [product.id, product]),
        );
        const correctedImages = {
          "amber-veil": {
            previous:
              "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=900&q=85",
            current: defaultProductsById.get("amber-veil").image,
          },
          "desert-bloom": {
            previous:
              "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85",
            current: defaultProductsById.get("desert-bloom").image,
          },
        };
        const migratedSavedProducts = parsedProducts.map((product) => {
          const imageCorrection = correctedImages[product.id];
          return imageCorrection?.previous === product.image
            ? { ...product, image: imageCorrection.current }
            : product;
        });
        const migratedProducts = [
          ...migratedSavedProducts,
          ...productsToMigrate,
        ];
        setProducts(
          migratedProducts.map((product) => ({
            ...defaultProductsById.get(product.id),
            ...product,
            description:
              product.description ??
              defaultProductsById.get(product.id)?.description ??
              "",
          })),
        );
        if (migrationVersion !== PRODUCT_MIGRATION_VERSION) {
          window.localStorage.setItem(
            PRODUCT_STORAGE_KEY,
            JSON.stringify(migratedProducts),
          );
          window.localStorage.setItem(PRODUCT_MIGRATION_KEY, PRODUCT_MIGRATION_VERSION);
        }
      } else {
        window.localStorage.setItem(PRODUCT_MIGRATION_KEY, PRODUCT_MIGRATION_VERSION);
      }
    } catch (loadError) {
      console.error("Unable to load saved perfumes.", loadError);
      setError("Saved perfumes could not be loaded. Your changes are not available.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const savedBag = window.localStorage.getItem(BAG_STORAGE_KEY);
      if (savedBag !== null) {
        const parsedBag = JSON.parse(savedBag);
        if (
          !Array.isArray(parsedBag) ||
          parsedBag.some(
            (item) =>
              !item ||
              typeof item.id !== "string" ||
              typeof item.name !== "string" ||
              typeof item.price !== "number" ||
              !Number.isFinite(item.price) ||
              !Number.isInteger(item.quantity) ||
              item.quantity < 1,
          )
        ) {
          throw new Error("Saved shopping bag has an invalid format.");
        }
        setBag(parsedBag);
      }
    } catch (loadError) {
      console.error("Unable to load the saved shopping bag.", loadError);
      setError("Your saved shopping bag could not be loaded.");
    } finally {
      setBagLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!bagLoaded) return;
    try {
      window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(bag));
    } catch (saveError) {
      console.error("Unable to save the shopping bag.", saveError);
      setError("Your shopping bag could not be saved in this browser.");
    }
  }, [bag, bagLoaded]);

  function saveProducts(nextProducts) {
    try {
      window.localStorage.setItem(
        PRODUCT_STORAGE_KEY,
        JSON.stringify(nextProducts),
      );
      setProducts(nextProducts);
      setError("");
      return true;
    } catch (saveError) {
      console.error("Unable to save perfume changes.", saveError);
      setError("Perfume changes could not be saved in this browser.");
      return false;
    }
  }

  function addProduct(product) {
    return saveProducts([...products, product]);
  }

  function updateProduct(product) {
    const saved = saveProducts(
      products.map((current) =>
        current.id === product.id ? product : current,
      ),
    );
    if (saved) {
      setBag((current) =>
        current.map((item) =>
          item.id === product.id
            ? { ...product, quantity: item.quantity }
            : item,
        ),
      );
    }
    return saved;
  }

  function deleteProduct(id) {
    const saved = saveProducts(products.filter((product) => product.id !== id));
    if (saved) removeFromBag(id);
    return saved;
  }

  function addToBag(product) {
    setBag((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function removeFromBag(id) {
    setBag((current) => current.filter((item) => item.id !== id));
  }

  function clearBag() {
    setBag([]);
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        bag,
        addToBag,
        removeFromBag,
        clearBag,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === null) {
    throw new Error("useProducts must be used inside ProductsProvider.");
  }
  return context;
}
