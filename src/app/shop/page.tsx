// src/app/shop/page.tsx

import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/AddToCartButton";
import { FilterSidebar } from "@/components/FilterSidebar";

export const metadata: Metadata = {
  title: "Shop — Handcrafted Haven",
  description: "Browse unique handcrafted items from talented artisans.",
};

interface SearchParams {
  category?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  rating?:   string;
  sort?:     string;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const activeCategories = Array.isArray(params.category)
    ? params.category
    : params.category ? [params.category] : [];

  const minPrice = params.minPrice ? Number(params.minPrice) : 0;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : 99999;
  const minRating = params.rating  ? Number(params.rating)  : 0;

  const products = await prisma.product.findMany({
    where: {
      status: "active",
      ...(activeCategories.length ? { category: { in: activeCategories } } : {}),
      price: {
        gte: minPrice,
        ...(params.maxPrice ? { lte: maxPrice } : {}),
      },
    },
    include: {
      seller:  { select: { name: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: params.sort === "price-asc"
      ? { price: "asc" }
      : params.sort === "price-desc"
      ? { price: "desc" }
      : { createdAt: "desc" },
  });

  const productsWithRating = products
    .map((p) => {
      const avg = p.reviews.length
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : 0;
      return { ...p, avgRating: Math.round(avg), reviewCount: p.reviews.length };
    })
    .filter((p) => minRating === 0 || p.avgRating >= minRating);

  const sorted = params.sort === "rating"
    ? [...productsWithRating].sort((a, b) => b.avgRating - a.avgRating)
    : productsWithRating;

  return (
    <main>
      <div className="container">
        <div className="shop-layout">

          {/* Filter sidebar — client component wrapped in Suspense */}
          <Suspense fallback={<div style={{ width: 260 }} />}>
            <FilterSidebar />
          </Suspense>

          {/* Product grid */}
          <section aria-labelledby="catalog-heading">
            <div className="catalog-header">
              <div>
                <h1
                  id="catalog-heading"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "var(--brown-deep)" }}
                >
                  All Products
                </h1>
                <p className="catalog-count">
                  {sorted.length} item{sorted.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {sorted.length === 0 ? (
              <div className="empty-state" role="status">
                <div className="empty-state-icon" aria-hidden="true">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting or clearing your filters.</p>
                <a href="/shop" className="btn-outline" style={{ marginTop: "1rem", display: "inline-block" }}>
                  Clear filters
                </a>
              </div>
            ) : (
              <div className="products-grid" role="list">
                {sorted.map((p) => (
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
                          🏺
                        </div>
                      )}
                      <button className="product-wishlist" aria-label={`Save ${p.name} to wishlist`}>
                        🤍
                      </button>
                    </div>
                    <div className="product-info">
                      <p className="product-seller">{p.seller.name}</p>
                      <h2 className="product-name">
                        <a href={`/products/${p.id}`}>{p.name}</a>
                      </h2>
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
            )}
          </section>

        </div>
      </div>
    </main>
  );
}