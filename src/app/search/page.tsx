// src/app/search/page.tsx

import type { Metadata } from "next";
import { AddToCartButton } from "@/components/AddToCartButton";

const ALL_PRODUCTS = [
  { id: 1,  emoji: "🏺", bg: "#C4956A", seller: "Maria's Studio",  name: "Hand-thrown Terracotta Bowl",   price: 48,  rating: 5, reviews: 42, category: "Pottery"    },
  { id: 2,  emoji: "💍", bg: "#D4A76A", seller: "Luna Jewelry",    name: "Sterling Silver Leaf Pendant",  price: 72,  rating: 5, reviews: 28, category: "Jewelry"    },
  { id: 3,  emoji: "🧵", bg: "#A8836A", seller: "Woven Stories",   name: "Hand-woven Merino Throw",       price: 125, rating: 4, reviews: 17, category: "Textiles"   },
  { id: 4,  emoji: "🕯️", bg: "#C9A87C", seller: "Calm & Craft",    name: "Soy Lavender Pillar Candle",    price: 28,  rating: 5, reviews: 64, category: "Candles"    },
  { id: 5,  emoji: "🖼️", bg: "#9E7A5E", seller: "Canvas & Clay",   name: "Abstract Watercolor Print",     price: 95,  rating: 5, reviews: 11, category: "Art"        },
  { id: 6,  emoji: "🪵", bg: "#8B6347", seller: "Oak & Grain",     name: "Reclaimed Oak Serving Board",   price: 64,  rating: 4, reviews: 33, category: "Woodwork"   },
  { id: 7,  emoji: "🧸", bg: "#D4A878", seller: "Cozy Crafts",     name: "Hand-knit Amigurumi Bear",      price: 36,  rating: 5, reviews: 19, category: "Toys"       },
  { id: 8,  emoji: "🌿", bg: "#8BAB7E", seller: "Herb Haven",      name: "Dried Lavender Bundle",         price: 18,  rating: 5, reviews: 52, category: "Botanicals" },
  { id: 9,  emoji: "🏺", bg: "#B8836A", seller: "Clay & Fire",     name: "Speckled Glaze Mug Set",        price: 55,  rating: 4, reviews: 24, category: "Pottery"    },
];

const ALL_SELLERS = [
  { id: "maria-santos",  emoji: "👩‍🎨", bg: "#E8C4A0", name: "Maria Santos",  craft: "Pottery",    items: 34 },
  { id: "luna-jewelry",  emoji: "💎",   bg: "#D4C4E0", name: "Luna Jewelry",  craft: "Jewelry",    items: 51 },
  { id: "woven-stories", emoji: "🧶",   bg: "#C4D4B0", name: "Anya Weaver",   craft: "Textiles",   items: 22 },
  { id: "oak-grain",     emoji: "🔨",   bg: "#D0B8A0", name: "James Oak",     craft: "Woodwork",   items: 18 },
];

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
  const query = q?.trim().toLowerCase() ?? "";

  const matchedProducts = query
    ? ALL_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.seller.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
    : [];

  const matchedSellers = query
    ? ALL_SELLERS.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.craft.toLowerCase().includes(query)
      )
    : [];

  const totalResults = matchedProducts.length + matchedSellers.length;

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
        {matchedSellers.length > 0 && (
          <section aria-labelledby="sellers-heading" style={{ marginBottom: "3rem" }}>
            <h2
              id="sellers-heading"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--brown-deep)", marginBottom: "1.25rem" }}
            >
              Artisans
            </h2>
            <div className="artisans-grid" role="list">
              {matchedSellers.map((s) => (
                <a
                  key={s.id}
                  href={`/sellers/${s.id}`}
                  className="artisan-card"
                  role="listitem"
                  aria-label={`${s.name} — ${s.craft}`}
                >
                  <div className="artisan-avatar" style={{ background: s.bg }} aria-hidden="true">
                    {s.emoji}
                  </div>
                  <p className="artisan-name">{s.name}</p>
                  <p className="artisan-craft">{s.craft}</p>
                  <p className="artisan-items">{s.items} listings</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Matched products */}
        {matchedProducts.length > 0 && (
          <section aria-labelledby="products-heading">
            <h2
              id="products-heading"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--brown-deep)", marginBottom: "1.25rem" }}
            >
              Products
            </h2>
            <div className="products-grid" role="list">
              {matchedProducts.map((p) => (
                <article key={p.id} className="product-card" role="listitem">
                  <div className="product-img">
                    <div
                      className="product-img-bg"
                      style={{ background: p.bg }}
                      aria-hidden="true"
                    >
                      {p.emoji}
                    </div>
                    <button className="product-wishlist" aria-label={`Save ${p.name} to wishlist`}>
                      🤍
                    </button>
                  </div>
                  <div className="product-info">
                    <p className="product-seller">{p.seller}</p>
                    <h3 className="product-name">
                      <a href={`/products/${p.id}`}>{p.name}</a>
                    </h3>
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
                      price={p.price}
                      emoji={p.emoji}
                      bg={p.bg}
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