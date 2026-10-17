"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProducts } from "../ProductsProvider";
import AdminSkeleton from "./AdminSkeleton";
import { formatPrice } from "../currency";

const emptyForm = {
  name: "",
  notes: "",
  description: "",
  price: "",
  compareAtPrice: "",
  label: "",
  image: "",
  alt: "",
};

function createSlug(name) {
  return name
    .normalize("NFKD")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminPage() {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } =
    useProducts();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [access, setAccess] = useState("checking");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/session", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!active) return;
        if (!result.configured) {
          setAccess("unconfigured");
        } else {
          setAccess(result.authenticated ? "authenticated" : "locked");
        }
      })
      .catch((requestError) => {
        console.error("Unable to verify admin session.", requestError);
        if (active) {
          setAccess("error");
          setAuthError("Unable to verify admin access. Please try again.");
        }
      });
    return () => {
      active = false;
    };
  }, []);

  async function login(event) {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setAuthError(result.error || "Unable to sign in.");
        return;
      }
      setPassword("");
      setAccess("authenticated");
    } catch (requestError) {
      console.error("Unable to sign in to admin.", requestError);
      setAuthError("Unable to sign in. Check your connection and try again.");
    } finally {
      setAuthBusy(false);
    }
  }

  async function logout() {
    try {
      const response = await fetch("/api/admin/session", { method: "DELETE" });
      if (!response.ok) throw new Error("Admin sign-out failed.");
      setAccess("locked");
      resetForm();
    } catch (requestError) {
      console.error("Unable to sign out of admin.", requestError);
      setAuthError("Unable to sign out. Please try again.");
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEditing(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      notes: product.notes,
      description: product.description || "",
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
      label: product.label,
      image: product.image,
      alt: product.alt,
    });
    setFormError("");
    setNotice("");
    document.querySelector("#perfume-name")?.focus();
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
  }

  function submitForm(event) {
    event.preventDefault();
    const name = form.name.trim();
    const price = Number(form.price);
    const compareAtPrice = form.compareAtPrice.trim()
      ? Number(form.compareAtPrice)
      : undefined;
    if (!name || !form.notes.trim() || !form.image.trim() || !form.alt.trim()) {
      setFormError("Complete all required fields before saving.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setFormError("Enter a price greater than zero.");
      return;
    }
    if (
      compareAtPrice !== undefined &&
      (!Number.isFinite(compareAtPrice) || compareAtPrice <= price)
    ) {
      setFormError("The regular price must be greater than the sale price.");
      return;
    }
    if (
      products.some(
        (product) =>
          product.id !== editingId &&
          product.name.trim().toLocaleLowerCase() === name.toLocaleLowerCase(),
      )
    ) {
      setFormError("A perfume with that name already exists.");
      return;
    }

    const product = {
      id: editingId || `${createSlug(name)}-${crypto.randomUUID().slice(0, 8)}`,
      name,
      notes: form.notes.trim(),
      description: form.description.trim(),
      price,
      ...(compareAtPrice === undefined ? {} : { compareAtPrice }),
      label: form.label.trim(),
      image: form.image.trim(),
      alt: form.alt.trim(),
    };
    const saved = editingId ? updateProduct(product) : addProduct(product);
    if (!saved) return;

    setNotice(editingId ? "Perfume updated." : "Perfume added to the collection.");
    resetForm();
  }

  function removeProduct(product) {
    if (!window.confirm(`Remove ${product.name} from the collection?`)) return;
    if (deleteProduct(product.id)) {
      if (editingId === product.id) resetForm();
      setNotice(`${product.name} removed.`);
    }
  }

  if (access === "checking") {
    return (
      <main id="main" className="admin-page">
        <section className="admin-panel admin-access-panel" aria-label="Checking admin access">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-notes" />
        </section>
      </main>
    );
  }

  if (access !== "authenticated") {
    const unconfigured = access === "unconfigured";
    return (
      <main id="main" className="admin-page">
        <section className="admin-panel admin-login-panel">
          <p className="eyebrow">Private access</p>
          <h1>Admin <em>sign in.</em></h1>
          <p>Enter the store admin password to manage fragrances.</p>
          {unconfigured ? (
            <p className="form-error" role="alert">
              Admin access is not configured. Add ADMIN_PASSWORD and
              ADMIN_SESSION_SECRET to the server environment, then restart the
              app.
            </p>
          ) : (
            <form className="admin-form" onSubmit={login}>
              <label htmlFor="admin-password">Admin password</label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoFocus
              />
              {authError ? <p className="form-error" role="alert">{authError}</p> : null}
              <button className="button button-dark" type="submit" disabled={authBusy}>
                {authBusy ? "Checking…" : "Sign in"}
              </button>
            </form>
          )}
          <Link className="text-link admin-login-back" href="/perfumes">
            Back to fragrances <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main id="main" className="admin-page">
      <section className="admin-heading">
        <div>
          <p className="eyebrow">Store management</p>
          <h1>Perfume <em>inventory.</em></h1>
          <p>Add, edit, or remove items from your public collection.</p>
          <p className="admin-storage-note">Signed in to the store admin.</p>
        </div>
        <div className="admin-heading-actions">
          <Link className="text-link" href="/perfumes">
            View storefront <span aria-hidden="true">↗</span>
          </Link>
          <button className="text-link-button" onClick={logout}>Sign out</button>
        </div>
      </section>

      <div className="admin-layout">
        <section className="admin-panel inventory-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Your collection</p>
              <h2>{loading ? "Loading inventory" : `${products.length} perfumes`}</h2>
            </div>
            {!loading && (
              <button className="text-link-button" onClick={resetForm}>
                + Add perfume
              </button>
            )}
          </div>
          {error ? <p className="store-error">{error}</p> : null}
          {loading ? (
            <AdminSkeleton />
          ) : products.length ? (
            <div className="inventory-list">
              {products.map((product) => (
                <article className="inventory-item" key={product.id}>
                  <img src={product.image} alt="" loading="lazy" />
                  <div className="inventory-description">
                    <h3>{product.name}</h3>
                    <p>{product.notes}</p>
                    <span>
                      {product.compareAtPrice ? (
                        <del>{formatPrice(product.compareAtPrice)}</del>
                      ) : null}
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="inventory-actions">
                    <button
                      className="inventory-edit"
                      onClick={() => startEditing(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="inventory-delete"
                      onClick={() => removeProduct(product)}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="inventory-empty">
              There are no perfumes yet. Use the form to add your first one.
            </p>
          )}
        </section>

        <section className="admin-panel editor-panel">
          <p className="eyebrow">{editingId ? "Edit details" : "New fragrance"}</p>
          <h2>{editingId ? "Update perfume" : "Add a perfume"}</h2>
          {notice ? <p className="admin-notice" role="status">{notice}</p> : null}
          {formError ? <p className="form-error" role="alert">{formError}</p> : null}
          <form className="admin-form" onSubmit={submitForm}>
            <label htmlFor="perfume-name">Perfume name</label>
            <input
              id="perfume-name"
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="e.g. Saffron Dusk"
              required
            />
            <label htmlFor="perfume-notes">Fragrance notes</label>
            <input
              id="perfume-notes"
              name="notes"
              value={form.notes}
              onChange={updateField}
              placeholder="Amber · Saffron · Vanilla"
              required
            />
            <label htmlFor="perfume-description">Short description</label>
            <textarea
              id="perfume-description"
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="Describe the character and feeling of this fragrance"
              rows={3}
            />
            <div className="admin-form-row">
              <div>
                <label htmlFor="perfume-price">Price (PKR)</label>
                <input
                  id="perfume-price"
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={updateField}
                  placeholder="88"
                  required
                />
              </div>
              <div>
                <label htmlFor="perfume-compare-price">Regular price (PKR, optional)</label>
                <input
                  id="perfume-compare-price"
                  name="compareAtPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.compareAtPrice}
                  onChange={updateField}
                  placeholder="Leave blank for no deal"
                />
              </div>
            </div>
            <label htmlFor="perfume-label">Product label</label>
            <input
              id="perfume-label"
              name="label"
              value={form.label}
              onChange={updateField}
              placeholder="NEW ARRIVAL"
            />
            <label htmlFor="perfume-image">Image URL</label>
            <input
              id="perfume-image"
              name="image"
              type="url"
              value={form.image}
              onChange={updateField}
              placeholder="https://example.com/perfume.jpg"
              required
            />
            <label htmlFor="perfume-alt">Image description</label>
            <input
              id="perfume-alt"
              name="alt"
              value={form.alt}
              onChange={updateField}
              placeholder="Describe the bottle for accessibility"
              required
            />
            <div className="admin-form-actions">
              <button className="button button-dark" type="submit">
                {editingId ? "Save changes" : "Add perfume"}
              </button>
              {editingId ? (
                <button className="cancel-edit" type="button" onClick={resetForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
          <p className="admin-storage-note">
            Changes are saved in this browser and appear in the storefront.
          </p>
        </section>
      </div>
    </main>
  );
}
