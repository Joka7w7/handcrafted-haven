// src/app/shop/page.tsx

import type { Metadata } from "next";
import type { FC } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";

export const metadata: Metadata = {
  title: "Shop — Handcrafted Haven",
  description: "Browse thousands of unique handcrafted items from talented artisans.",
};

const CATEGORIES = [
  "Pottery", "Jewelry", "Textiles", "Candles", "Art", "Woodwork", "Toys", "Botanicals",
];

const PRODUCTS = [
  { id: 1,  emoji: "🏺", bg: "#C4956A", badge: "Bestseller", seller: "Maria's Studio",  name: "Hand-thrown Terracotta Bowl",    price: 48,  rating: 5, reviews: 42, category: "Pottery"    },
  { id: 2,  emoji: "💍", bg: "#D4A76A", badge: "New",        seller: "Luna Jewelry",    name: "Sterling Silver Leaf Pendant",   price: 72,  rating: 5, reviews: 28, category: "Jewelry"    },
  { id: 3,  emoji: "🧵", bg: "#A8836A", badge: null,         seller: "Woven Stories",   name: "Hand-woven Merino Throw",        price: 125, rating: 4, reviews: 17, category: "Textiles"   },
  { id: 4,  emoji: "🕯️", bg: "#C9A87C", badge: null,         seller: "Calm & Craft",    name: "Soy Lavender Pillar Candle",     price: 28,  rating: 5, reviews: 64, category: "Candles"    },
  { id: 5,  emoji: "🖼️", bg: "#9E7A5E", badge: "Featured",   seller: "Canvas & Clay",   name: "Abstract Watercolor Print",      price: 95,  rating: 5, reviews: 11, category: "Art"        },
  { id: 6,  emoji: "🪵", bg: "#8B6347", badge: null,         seller: "Oak & Grain",     name: "Reclaimed Oak Serving Board",    price: 64,  rating: 4, reviews: 33, category: "Woodwork"   },
  { id: 7,  emoji: "🧸", bg: "#D4A878", badge: null,         seller: "Cozy Crafts",     name: "Hand-knit Amigurumi Bear",       price: 36,  rating: 5, reviews: 19, category: "Toys"       },
  { id: 8,  emoji: "🌿", bg: "#8BAB7E", badge: "New",        seller: "Herb Haven",      name: "Dried Lavender Bundle",          price: 18,  rating: 5, reviews: 52, category: "Botanicals" },
  { id: 9,  emoji: "🏺", bg: "#B8836A", badge: null,         seller: "Clay & Fire",     name: "Speckled Glaze Mug Set",         price: 55,  rating: 4, reviews: 24, category: "Pottery"    },
];

interface SearchParams {
  category?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  rating?:   string;
  sort?:     string;
}

// ── Next.js 15+: searchParams is a Promise ──
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Await the Promise before accessing any property
  const params = await searchParams;

  const activeCategories = Array.isArray(params.category)
    ? params.category
    : params.category
    ? [params.category]
    : [];

  const minPrice = params.minPrice ? Number(params.minPrice) : 0;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : 9999;
  const minRating = params.rating  ? Number(params.rating)   : 0;

  const filtered = PRODUCTS.filter((p) => {
    if (activeCategories.length && !activeCategories.includes(p.category)) return false;
    if (p.price < minPrice || p.price > maxPrice) return false;
    if (p.rating < minRating) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (params.sort) {
      case "price-asc":  return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "rating":     return b.rating - a.rating;
      default:           return b.id - a.id;
    }
  });

  return (
    <main>
      <div className="container">
        <div className="shop-layout">

          {/* Filter sidebar */}
          <aside aria-label="Product filters">
            <div className="filter-sidebar">
              <div className="filter-title">
                Filters
                <a href="/shop" className="filter-clear" aria-label="Clear all filters">
                  Clear all
                </a>
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
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="$0"
                    min={0}
                    defaultValue={minPrice || ""}
                    aria-label="Minimum price"
                  />
                  <span>–</span>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="$500"
                    min={0}
                    defaultValue={maxPrice === 9999 ? "" : maxPrice}
                    aria-label="Maximum price"
                  />
                </div>
              </div>

              <fieldset className="filter-group" style={{ border: "none", padding: 0 }}>
                <legend className="filter-group-title">Minimum rating</legend>
                <div className="rating-options">
                  {[0, 3, 4].map((r) => (
                    <label key={r} className="rating-option">
                      <input
                        type="radio"
                        name="rating"
                        value={r}
                        defaultChecked={minRating === r}
                      />
                      {r === 0 ? (
                        "Any rating"
                      ) : (
                        <>
                          <span className="rating-stars" aria-hidden="true">
                            {"★".repeat(r)}{"☆".repeat(5 - r)}
                          </span>
                          <span>{r}★ & up</span>
                        </>
                      )}
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
              <label htmlFor="sort-select" className="sr-only">Sort by</label>
              <select
                id="sort-select"
                className="sort-select"
                name="sort"
                defaultValue={params.sort || "newest"}
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating">Highest rated</option>
              </select>
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
                      <div
                        className="product-img-bg"
                        style={{ background: p.bg }}
                        aria-hidden="true"
                      >
                        {p.emoji}
                      </div>
                      {p.badge && <span className="product-badge">{p.badge}</span>}
                      <button className="product-wishlist" aria-label={`Save ${p.name} to wishlist`}>
                        🤍
                      </button>
                    </div>
                    <div className="product-info">
                      <p className="product-seller">{p.seller}</p>
                      <h2 className="product-name">
                        <a href={`/products/${p.id}`}>{p.name}</a>
                      </h2>
                      <div className="product-footer">
                        <p className="product-price">${p.price.toFixed(2)}</p>
                        <div className="product-rating" aria-label={`${p.rating} out of 5 stars`}>
                          <span className="stars" aria-hidden="true">
                            {"★".repeat(p.rating)}{"☆".repeat(5 - p.rating)}
                          </span>
                          <span className="rating-count">({p.reviews})</span>
                        </div>
                      </div>
                      <AddToCartButton
                        id={String(p.id)}
                        name={p.name}
                        seller={p.seller}
                        price={Number(p.price)}
                        emoji={p.emoji}
                        bg={p.bg}
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