// src/app/shop/page.tsx

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/AddToCartButton";

export const metadata: Metadata = {
  title: "Shop — Handcrafted Haven",
  description: "Browse unique handcrafted items from talented artisans.",
};

const CATEGORIES = [
  "Pottery", "Jewelry", "Textiles", "Candles",
  "Art", "Woodwork", "Toys", "Botanicals", "Other",
];

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

  const minPrice  = params.minPrice ? Number(params.minPrice) : 0;
  const maxPrice  = params.maxPrice ? Number(params.maxPrice) : 99999;

  // Fetch real products from DB
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
      seller: { select: { name: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: params.sort === "price-asc"
      ? { price: "asc" }
      : params.sort === "price-desc"
      ? { price: "desc" }
      : { createdAt: "desc" },
  });

  // Calculate average rating per product
  const productsWithRating = products.map((p) => {
    const avg = p.reviews.length
      ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
      : 0;
    return { ...p, avgRating: Math.round(avg), reviewCount: p.reviews.length };
  });

  const sorted = params.sort === "rating"
    ? [...productsWithRating].sort((a, b) => b.avgRating - a.avgRating)
    : productsWithRating;

  return (
    <main>
      <div className="container">
        <div className="shop-layout">

          {/* Filter sidebar */}
          <aside aria-label="Product filters">
            <div className="filter-sidebar">
              <div className="filter-title">
                Filters
                <a href="/shop" className="filter-clear">Clear all</a>
              </div>

              <fieldset className="filter-group" style={{ border: "none", padding: 0 }}>
                <legend className="filter-group-title">Category</legend>
                <div className="filter-options">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="filter-option">
                      <input
                        type="checkbox"
                        name="category"
                        value={cat}
                        defaultChecked={activeCategories.includes(cat)}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="filter-group">
                <p className="filter-group-title">Price range</p>
                <div className="price-inputs">
                  <input type="number" name="minPrice" placeholder="$0"   min={0} defaultValue={minPrice || ""} aria-label="Minimum price" />
                  <span>–</span>
                  <input type="number" name="maxPrice" placeholder="$500" min={0} defaultValue={maxPrice === 99999 ? "" : maxPrice} aria-label="Maximum price" />
                </div>
              </div>

              <fieldset className="filter-group" style={{ border: "none", padding: 0 }}>
                <legend className="filter-group-title">Minimum rating</legend>
                <div className="rating-options">
                  {[0, 3, 4].map((r) => (
                    <label key={r} className="rating-option">
                      <input type="radio" name="rating" value={r} defaultChecked={Number(params.rating ?? 0) === r} />
                      {r === 0 ? "Any rating" : <><span className="rating-stars">{"★".repeat(r)}{"☆".repeat(5 - r)}</span><span>{r}★ & up</span></>}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </aside>

          {/* Product grid */}
          <section aria-labelledby="catalog-heading">
            <div className="catalog-header">
              <div>
                <h1 id="catalog-heading" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "var(--brown-deep)" }}>
                  All Products
                </h1>
                <p className="catalog-count">{sorted.length} item{sorted.length !== 1 ? "s" : ""}</p>
              </div>
              <select className="sort-select" name="sort" defaultValue={params.sort || "newest"}>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating">Highest rated</option>
              </select>
            </div>

            {sorted.length === 0 ? (
              <div className="empty-state" role="status">
                <div className="empty-state-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting or clearing your filters.</p>
                <a href="/shop" className="btn-outline" style={{ marginTop: "1rem", display: "inline-block" }}>Clear filters</a>
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
                        <div className="product-img-bg" style={{ background: "var(--border)", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }} aria-hidden="true">
                          🏺
                        </div>
                      )}
                      <button className="product-wishlist" aria-label={`Save ${p.name} to wishlist`}>🤍</button>
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
                            <span className="stars" aria-hidden="true">{"★".repeat(p.avgRating)}{"☆".repeat(5 - p.avgRating)}</span>
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