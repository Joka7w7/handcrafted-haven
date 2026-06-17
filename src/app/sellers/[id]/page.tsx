// src/app/sellers/[id]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/AddToCartButton";

// ── helpers ──────────────────────────────────────────────────────────────────

async function getSeller(id: string) {
  return prisma.user.findFirst({
    where: {
      id,
      role:   "seller",
      seller: { isNot: null },
    },
    include: {
      seller: true,
      products: {
        where: { status: "active" },
        include: {
          reviews:    { select: { rating: true } },
          orderItems: { select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

function avgRating(reviews: { rating: number }[]) {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

// ── metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await getSeller(id);
  if (!user) return { title: "Seller Not Found — Handcrafted Haven" };

  const displayName = user.seller?.shopName ?? user.name ?? "Artisan";
  return {
    title:       `${displayName} — Handcrafted Haven`,
    description: (user.seller?.bio ?? "").slice(0, 160),
  };
}

// ── page ─────────────────────────────────────────────────────────────────────

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSeller(id);

  if (!user) notFound();

  const profile       = user.seller!;
  const displayName   = profile.shopName ?? user.name ?? "Artisan";
  const allReviews    = user.products.flatMap((p) => p.reviews);
  const overallRating = avgRating(allReviews);
  const totalSales    = user.products.reduce((sum, p) => sum + p.orderItems.length, 0);

  // Enrich each product with its computed rating
  const products = user.products.map((p) => ({
    ...p,
    avgRating:   Math.round(avgRating(p.reviews)),
    reviewCount: p.reviews.length,
  }));

  // Joined date formatted nicely
  const joinedLabel = profile.createdAt.toLocaleDateString("en-US", {
    month: "long",
    year:  "numeric",
  });

  return (
    <main>
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>

        {/* Cover + avatar */}
        <div style={{ position: "relative", marginBottom: "2rem" }}>
          {profile.banner ? (
            <div
              className="profile-cover"
              style={{ backgroundImage: `url(${profile.banner})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
          ) : (
            <div className="profile-cover" />
          )}
          <div
            className="profile-avatar-wrap"
            aria-hidden="true"
            style={{ background: "var(--sand-light)", overflow: "hidden" }}
          >
            {user.image ? (
              <img
                src={user.image}
                alt={displayName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: "2.5rem" }}>👤</span>
            )}
          </div>
        </div>

        {/* Profile info */}
        <div className="profile-card">
          <h1 className="profile-name">{displayName}</h1>
          {profile.craft && (
            <p className="profile-craft">{profile.craft} Artisan</p>
          )}
          {profile.bio && (
            <p className="profile-bio">{profile.bio}</p>
          )}
          <div className="profile-meta">
            {profile.location && (
              <span className="profile-meta-item">📍 {profile.location}</span>
            )}
            <span className="profile-meta-item">📅 Joined {joinedLabel}</span>
            <span className="profile-meta-item">
              <strong>{user.products.length}</strong> listings
            </span>
            {totalSales > 0 && (
              <span className="profile-meta-item">
                <strong>{totalSales}</strong> sales
              </span>
            )}
            {allReviews.length > 0 && (
              <span className="profile-meta-item">
                <strong>{overallRating.toFixed(1)}★</strong> ({allReviews.length} review{allReviews.length !== 1 ? "s" : ""})
              </span>
            )}
          </div>
        </div>

        {/* Products */}
        {products.length > 0 && (
          <div>
            <h2 style={{
              fontFamily:   "'Playfair Display', serif",
              fontSize:     "1.3rem",
              color:        "var(--brown-deep)",
              marginBottom: "1.25rem",
            }}>
              {displayName}&apos;s Products
            </h2>
            <div className="products-grid" role="list">
              {products.map((p) => (
                <article key={p.id} className="product-card" role="listitem">
                  <div className="product-img">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="product-img-bg"
                        style={{ background: "var(--border)", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}
                        aria-hidden="true"
                      >
                        🛍️
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    <p className="product-seller">{displayName}</p>
                    <h3 className="product-name">
                      <a href={`/products/${p.id}`}>{p.name}</a>
                    </h3>
                    <div className="product-footer">
                      <p className="product-price">${p.price.toFixed(2)}</p>
                      {p.reviewCount > 0 && (
                        <div className="product-rating" aria-label={`${p.avgRating} out of 5 stars`}>
                          <span className="stars" aria-hidden="true">
                            {"★".repeat(p.avgRating)}{"☆".repeat(5 - p.avgRating)}
                          </span>
                          <span className="rating-count">({p.reviewCount})</span>
                        </div>
                      )}
                    </div>
                    <AddToCartButton
                      id={p.id}
                      name={p.name}
                      seller={displayName}
                      price={p.price}
                      emoji="🛍️"
                      bg="var(--terracotta)"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {products.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-mid)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📦</div>
            <p>This artisan hasn&apos;t listed any products yet.</p>
          </div>
        )}

      </div>
    </main>
  );
}