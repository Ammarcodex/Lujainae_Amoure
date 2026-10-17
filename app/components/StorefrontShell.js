"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "../ProductsProvider";
import CartDrawer from "./CartDrawer";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import WhatsAppButton from "./WhatsAppButton";

export default function StorefrontShell({ children }) {
  const { bag, removeFromBag } = useProducts();
  const router = useRouter();
  const [bagOpen, setBagOpen] = useState(false);
  const [toast, setToast] = useState("");
  const count = bag.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", bagOpen);
    if (!bagOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setBagOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("no-scroll");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [bagOpen]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const handleToast = (event) => setToast(event.detail);
    window.addEventListener("storefront-toast", handleToast);
    return () => window.removeEventListener("storefront-toast", handleToast);
  }, []);

  return (
    <>
      <SiteHeader count={count} onOpenBag={() => setBagOpen(true)} />
      {children}
      <SiteFooter />
      <CartDrawer
        items={bag}
        open={bagOpen}
        onClose={() => setBagOpen(false)}
        onRemove={removeFromBag}
        onCheckout={() => {
          setBagOpen(false);
          router.push("/checkout");
        }}
      />
      <WhatsAppButton />
      <div className={`toast${toast ? " is-visible" : ""}`} role="status">
        {toast}
      </div>
    </>
  );
}
