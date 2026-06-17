// src/app/products/[id]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/AddToCartButton";

// ── helpers ──────────────────────────────────────────────────────────────────

async function getProduct(id: string) {
  return prisma.product.findFirst({
    where: { id, status: "active" },
    include: {
      seller: {
        select: { id: true, name: true },
      },
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

// ── metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product Not Found — Handcrafted Haven" };
  return {
    title:       `${product.name} — Handcrafted Haven`,
    description: product.description.slice(0, 160),
  };
}

// ── page ─────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const avgRating =
    product.reviews.length
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;
  const roundedRating = Math.round(avgRating);

  return (
    <main>
      <div className="container">
        <div className="detail-layout">

          {/* Image */}
          <div className="detail-images">
            <div
              className="main-image"
              style={{
                background:    "var(--sand-light)",
                display:       "flex",
                alignItems:    "center",
                justifyContent: "center",
                aspectRatio:   "1",
                borderRadius:  "var(--radius-md)",
                overflow:      "hidden",
              }}
              aria-label={product.name}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "5rem" }}>🛍️</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="detail-eyebrow">
              <a href={`/sellers/${product.seller.id}`}>{product.seller.name}</a>
              {" · "}
              {product.category}
            </p>

            <h1 className="detail-title">{product.name}</h1>

            {product.reviews.length > 0 && (
              <div className="detail-rating">
                <span className="stars" aria-hidden="true">
                  {"★".repeat(roundedRating)}{"☆".repeat(5 - roundedRating)}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-mid)" }}>
                  {avgRating.toFixed(1)} ({product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            <p className="detail-price">${product.price.toFixed(2)}</p>
            <p className="detail-desc">{product.description}</p>

            <p style={{
              fontSize:     "0.82rem",
              color:        product.stock > 0 ? "var(--sage)" : "var(--terracotta)",
              marginBottom: "1rem",
            }}>
              {product.stock > 0 ? `✓ ${product.stock} in stock` : "✗ Out of stock"}
            </p>

            <AddToCartButton
              id={product.id}
              name={product.name}
              seller={product.seller.name ?? ""}
              price={product.price}
              emoji="🛍️"
              bg="var(--terracotta)"
            />

            {/* Reviews */}
            {product.reviews.length > 0 && (
              <div style={{ marginTop: "2.5rem" }}>
                <h2 style={{
                  fontFamily:   "'Playfair Display', serif",
                  fontSize:     "1.1rem",
                  color:        "var(--brown-deep)",
                  marginBottom: "1.25rem",
                }}>
                  Customer Reviews ({product.reviews.length})
                </h2>

                {product.reviews.map((r) => (
                  <div key={r.id} style={{ padding: "1rem 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-dark)" }}>
                        {r.user.name ?? "Anonymous"}
                      </span>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>
                        {r.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div
                      className="stars"
                      aria-label={`${r.rating} out of 5 stars`}
                      style={{ fontSize: "0.8rem", marginBottom: "0.4rem" }}
                    >
                      {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                    </div>
                    {r.comment && (
                      <p style={{ fontSize: "0.9rem", color: "var(--text-mid)", lineHeight: 1.6 }}>
                        {r.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {product.reviews.length === 0 && (
              <p style={{ marginTop: "2.5rem", fontSize: "0.9rem", color: "var(--text-mid)" }}>
                No reviews yet — be the first!
              </p>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}