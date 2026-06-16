// src/app/seller/products/new/NewProductForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Pottery", "Jewelry", "Textiles", "Candles",
  "Art", "Woodwork", "Toys", "Botanicals", "Other",
];

interface Props {
  sellerId: string;
}

export function NewProductForm({ sellerId }: Props) {
  const router  = useRouter();
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      sellerId,
      name:        form.get("name"),
      description: form.get("description"),
      price:       Number(form.get("price")),
      category:    form.get("category"),
      stock:       Number(form.get("stock")),
      image:       form.get("image") || null,
      status:      form.get("status"),
    };

    try {
      const res  = await fetch("/api/products", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      router.push("/seller/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {error && (
        <div role="alert" style={{ background: "#FAECE7", color: "#4A1B0C", border: "1px solid #F0997B", borderRadius: "6px", padding: "0.65rem 0.85rem", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      {/* Name */}
      <div className="field">
        <label htmlFor="name">Product name <span style={{ color: "#C0392B" }}>*</span></label>
        <input id="name" type="text" name="name" required placeholder="e.g. Hand-thrown Terracotta Bowl" maxLength={100} />
      </div>

      {/* Description */}
      <div className="field">
        <label htmlFor="description">Description <span style={{ color: "#C0392B" }}>*</span></label>
        <textarea
          id="description" name="description" required
          placeholder="Describe your product — materials, dimensions, care instructions..."
          rows={4}
          style={{
            padding: "0.65rem 0.85rem",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "'Lato', sans-serif",
            fontSize: "0.9rem",
            color: "var(--text-dark)",
            resize: "vertical",
            outline: "none",
            width: "100%",
          }}
        />
      </div>

      {/* Price + Stock */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="field">
          <label htmlFor="price">Price (USD) <span style={{ color: "#C0392B" }}>*</span></label>
          <input id="price" type="number" name="price" required min="0.01" step="0.01" placeholder="0.00" />
        </div>
        <div className="field">
          <label htmlFor="stock">Stock quantity <span style={{ color: "#C0392B" }}>*</span></label>
          <input id="stock" type="number" name="stock" required min="0" step="1" placeholder="1" defaultValue={1} />
        </div>
      </div>

      {/* Category */}
      <div className="field">
        <label htmlFor="category">Category <span style={{ color: "#C0392B" }}>*</span></label>
        <select
          id="category" name="category" required
          style={{
            padding: "0.65rem 0.85rem",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "'Lato', sans-serif",
            fontSize: "0.9rem",
            color: "var(--text-dark)",
            background: "var(--white)",
            outline: "none",
            width: "100%",
          }}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Image URL */}
      <div className="field">
        <label htmlFor="image">
          Product image URL
          <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--text-light)", marginLeft: 8 }}>
            optional — paste a direct image link
          </span>
        </label>
        <input
          id="image" type="url" name="image"
          placeholder="https://example.com/my-product.jpg"
          onChange={(e) => setPreview(e.target.value)}
        />
        {/* Image preview */}
        {preview && (
          <div style={{ marginTop: "0.75rem", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border)", height: 180, background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
              src={preview}
              alt="Product preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
        <p style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "0.35rem" }}>
          Tip: upload your image to <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brown-deep)" }}>imgur.com</a> or <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brown-deep)" }}>Cloudinary</a> and paste the direct link here.
        </p>
      </div>

      {/* Status */}
      <div className="field">
        <label>Listing status</label>
        <div style={{ display: "flex", gap: "1rem", marginTop: 4 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", cursor: "pointer" }}>
            <input type="radio" name="status" value="active" defaultChecked />
            <span>Active — visible to buyers</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", cursor: "pointer" }}>
            <input type="radio" name="status" value="draft" />
            <span>Draft — hidden for now</span>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
        <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
          {loading ? "Saving product…" : "Publish product"}
        </button>
        <a
          href="/seller/dashboard"
          className="btn-outline"
          style={{ flex: 1, textAlign: "center" }}
        >
          Cancel
        </a>
      </div>

    </form>
  );
}