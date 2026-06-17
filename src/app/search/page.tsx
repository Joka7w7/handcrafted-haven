// src/app/search/page.tsx

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/AddToCartButton";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — Search — Handcrafted Haven` : "Search — Handcrafted Haven",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  // Only hit the DB when there's actually a query
  const [products, sellers] = query
    ? await Promise.all([
        prisma.product.findMany({
          where: {
            status: "active",
            OR: [
              { name:        { contains: query } },
              { category:    { contains: query } },
              { description: { contains: query } },
              { seller: { name: { contains: query } } },
            ],
          },
          include: {
            seller:  { select: { id: true, name: true } },
            reviews: { select: { rating: true } },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.user.findMany({
          where: {
            role:   "seller",
            seller: { isNot: null },
            OR: [
              { name:   { contains: query } },
              { seller: { craft:    { contains: query } } },
              { seller: { shopName: { contains: query } } },
            ],
          },
          include: {
            seller:   true,
            products: { where: { status: "active" }, select: { id: true } },
          },
        }),
      ])
    : [[], []];

  // Compute average rating for each product
  const productsWithRating = products.map((p) => {
    const avg = p.reviews.length
      ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
      : 0;
    return { ...p, avgRating: Math.round(avg), reviewCount: p.reviews.length };
  });

  const totalResults = products.length + sellers.length;

  return (
    <main>
      <div className="container" style={{ padding: "3rem 1.5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          {query ? (
            <>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", color: "var(--brown-deep)", marginBottom: "0.4rem" }}>
                Results for &ldquo;{q}&rdquo;
              </h1>
              <p style={{ color: "var(--text-mid)", fontSize: "0.9rem" }}>
                {totalResults} result{totalResults !== 1 ? "s" : ""} found
              </p>
            </>
          ) : (
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", color: "var(--brown-deep)" }}>
              Search
            </h1>
          )}
        </div>

        {/* No query state */}
        {!query && (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-mid)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔍</div>
            <p>Type something in the search bar above to find products and artisans.</p>
          </div>
        )}

        {/* No results */}
        {query && totalResults === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>😔</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--brown-deep)", marginBottom: "0.5rem" }}>
              No results found
            </h2>
            <p style={{ color: "var(--text-mid)", marginBottom: "1.5rem" }}>
              Try a different keyword or browse our categories.
            </p>
            <a href="/shop" className="btn-primary">Browse all products</a>
          </div>
        )}

        {/* Matched sellers */}
        {sellers.length > 0 && (
          <section aria-labelledby="sellers-heading" style={{ marginBottom: "3rem" }}>
            <h2
              id="sellers-heading"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--brown-deep)", marginBottom: "1.25rem" }}
            >
              Artisans
            </h2>
            <div className="artisans-grid" role="list">
              {sellers.map((s) => (
                <a
                  key={s.id}
                  href={`/sellers/${s.id}`}
                  className="artisan-card"
                  role="listitem"
                  aria-label={`${s.name} — ${s.seller?.craft ?? "Artisan"}`}
                >
                  <div
                    className="artisan-avatar"
                    style={{ background: "var(--sand-light)" }}
                    aria-hidden="true"
                  >
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.name ?? ""}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                      />
                    ) : (
                      "👤"
                    )}
                  </div>
                  <p className="artisan-name">{s.seller?.shopName ?? s.name}</p>
                  <p className="artisan-craft">{s.seller?.craft ?? "Artisan"}</p>
                  <p className="artisan-items">{s.products.length} listings</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Matched products */}
        {productsWithRating.length > 0 && (
          <section aria-labelledby="products-heading">
            <h2
              id="products-heading"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--brown-deep)", marginBottom: "1.25rem" }}
            >
              Products
            </h2>
            <div className="products-grid" role="list">
              {productsWithRating.map((p) => (
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
                    <button className="product-wishlist" aria-label={`Save ${p.name} to wishlist`}>
                      🤍
                    </button>
                  </div>
                  <div className="product-info">
                    <p className="product-seller">{p.seller.name}</p>
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
                      seller={p.seller.name ?? ""}
                      price={p.price}
                      emoji="🛍️"
                      bg="var(--terracotta)"
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}