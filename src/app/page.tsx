// src/app/page.tsx

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/AddToCartButton";

export const metadata: Metadata = {
  title: "Handcrafted Haven — Discover Unique Artisan Goods",
  description:
    "A marketplace connecting talented artisans with customers who appreciate the beauty and quality of handmade products.",
  keywords: ["handcrafted", "artisan", "marketplace", "handmade", "crafts"],
};

/* ─── Static Data ─────────────────────────────────────── */

const categories = [
  { icon: "🏺", name: "Pottery",    count: 124 },
  { icon: "💍", name: "Jewelry",    count: 238 },
  { icon: "🧵", name: "Textiles",   count: 95  },
  { icon: "🕯️", name: "Candles",    count: 77  },
  { icon: "🖼️", name: "Art",        count: 183 },
  { icon: "🪵", name: "Woodwork",   count: 61  },
  { icon: "🧸", name: "Toys",       count: 44  },
  { icon: "🌿", name: "Botanicals", count: 59  },
];

const artisans = [
  { emoji: "👩‍🎨", bg: "#E8C4A0", name: "Maria Santos", craft: "Pottery",  items: 34 },
  { emoji: "💎",  bg: "#D4C4E0", name: "Luna Park",    craft: "Jewelry",  items: 51 },
  { emoji: "🧶",  bg: "#C4D4B0", name: "Anya Weaver",  craft: "Textiles", items: 22 },
  { emoji: "🔨",  bg: "#D0B8A0", name: "James Oak",    craft: "Woodwork", items: 18 },
];

/* ─── Category emoji fallback map ────────────────────── */

const categoryEmoji: Record<string, string> = {
  Pottery:    "🏺",
  Jewelry:    "💍",
  Textiles:   "🧵",
  Candles:    "🕯️",
  Art:        "🖼️",
  Woodwork:   "🪵",
  Toys:       "🧸",
  Botanicals: "🌿",
  Other:      "🛍️",
};

/* ─── Component ───────────────────────────────────────── */

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where:   { status: "active" },
    orderBy: { createdAt: "desc" },
    take:    6,
    include: { seller: { select: { name: true } } },
  });

  return (
    <>
      <main id="main-content">

        {/* ── Hero ── */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="container hero-inner">
            <div>
              <p className="hero-eyebrow">Handmade with love</p>
              <h1 id="hero-heading" className="fade-up">
                Discover <em>Unique</em> Artisan Treasures
              </h1>
              <p className="hero-desc fade-up fade-up-1">
                Connect with talented creators worldwide. Every item tells a story — find
                pieces that are as individual as you are.
              </p>
              <div className="hero-ctas fade-up fade-up-2">
                <a href="/shop" className="btn-primary">Shop Now</a>
                <a href="/seller/dashboard" className="btn-outline">Start Selling</a>
              </div>
              <div className="hero-stats fade-up fade-up-3" aria-label="Platform statistics">
                <div>
                  <p className="stat-val">2,400+</p>
                  <p className="stat-lbl">Artisans</p>
                </div>
                <div>
                  <p className="stat-val">18k+</p>
                  <p className="stat-lbl">Products</p>
                </div>
                <div>
                  <p className="stat-val">94%</p>
                  <p className="stat-lbl">5-Star Reviews</p>
                </div>
              </div>
            </div>

            <div className="hero-image-grid" aria-hidden="true">
              <div className="hero-img-card img-pottery">
                <span className="img-icon">🏺</span>
                <span className="img-label">Pottery</span>
              </div>
              <div className="hero-img-card img-jewelry">
                <span className="img-icon">💍</span>
                <span className="img-label">Jewelry</span>
              </div>
              <div className="hero-img-card img-textile">
                <span className="img-icon">🧵</span>
                <span className="img-label">Textiles</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Categories ── */}
        <section className="categories-section" aria-labelledby="categories-heading">
          <div className="container">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Browse by craft</p>
                <h2 className="section-title" id="categories-heading">Shop by Category</h2>
                <p className="section-sub">Explore our curated collections of handcrafted goods.</p>
              </div>
              <a href="/shop" className="btn-outline">View all</a>
            </div>
            <div className="categories-grid" role="list">
              {categories.map((cat) => (
                <a
                  key={cat.name}
                  href={`/shop?category=${cat.name}`}
                  className="category-card"
                  role="listitem"
                  aria-label={`${cat.name} — ${cat.count} products`}
                >
                  <div className="category-icon" aria-hidden="true">{cat.icon}</div>
                  <p className="category-name">{cat.name}</p>
                  <p className="category-count">{cat.count} items</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Products ── */}
        <section className="products-section" aria-labelledby="products-heading">
          <div className="container">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Handpicked for you</p>
                <h2 className="section-title" id="products-heading">Featured Products</h2>
                <p className="section-sub">Fresh finds from our most-loved artisans this week.</p>
              </div>
              <a href="/shop" className="btn-outline">View all products</a>
            </div>

            {featuredProducts.length === 0 ? (
              <div className="empty-state" role="status">
                <div className="empty-state-icon">🛍️</div>
                <h3>No products yet</h3>
                <p>Check back soon — artisans are adding new items daily.</p>
              </div>
            ) : (
              <div className="products-grid" role="list">
                {featuredProducts.map((p) => (
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
                          style={{
                            background: "var(--border)",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "3rem",
                          }}
                          aria-hidden="true"
                        >
                          {categoryEmoji[p.category] ?? "🛍️"}
                        </div>
                      )}
                      <button
                        className="product-wishlist"
                        aria-label={`Save ${p.name} to wishlist`}
                      >
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
                      </div>
                      <AddToCartButton
                        id={p.id}
                        name={p.name}
                        seller={p.seller.name ?? ""}
                        price={p.price}
                        emoji={categoryEmoji[p.category] ?? "🛍️"}
                        bg="var(--terracotta)"
                      />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Featured Artisans ── */}
        <section className="artisans-section" aria-labelledby="artisans-heading">
          <div className="container">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Meet the makers</p>
                <h2 className="section-title" id="artisans-heading">Featured Artisans</h2>
                <p className="section-sub">Real people, real craft — discover the stories behind the pieces.</p>
              </div>
              <a href="/artisans" className="btn-outline">All artisans</a>
            </div>
            <div className="artisans-grid" role="list">
              {artisans.map((a) => (
                <a
                  key={a.name}
                  href={`/sellers/${a.name.toLowerCase().replace(" ", "-")}`}
                  className="artisan-card"
                  role="listitem"
                  aria-label={`${a.name} — ${a.craft} seller with ${a.items} items`}
                >
                  <div
                    className="artisan-avatar"
                    style={{ background: a.bg }}
                    aria-hidden="true"
                  >
                    {a.emoji}
                  </div>
                  <p className="artisan-name">{a.name}</p>
                  <p className="artisan-craft">{a.craft}</p>
                  <p className="artisan-items">{a.items} listings</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="banner-section" aria-labelledby="cta-heading">
          <div className="container banner-inner">
            <div className="banner-text">
              <h2 id="cta-heading">Are you an artisan?</h2>
              <p>Join thousands of creators selling their handcrafted goods on Handcrafted Haven.</p>
            </div>
            <a href="/seller/dashboard" className="btn-cream">Start Selling Today</a>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-grid">
            <div>
              <p className="footer-brand">🧶 Handcrafted Haven</p>
              <p className="footer-desc">
                A marketplace dedicated to connecting talented artisans with
                customers who value the beauty and quality of handmade goods.
              </p>
            </div>
            <div>
              <p className="footer-col-title">Shop</p>
              <ul className="footer-links">
                <li><a href="/shop">All Products</a></li>
                <li><a href="/shop?sort=new">New Arrivals</a></li>
                <li><a href="/shop?sort=bestseller">Bestsellers</a></li>
                <li><a href="/artisans">Artisans</a></li>
              </ul>
            </div>
            <div>
              <p className="footer-col-title">Sell</p>
              <ul className="footer-links">
                <li><a href="/signup?role=seller">Start Selling</a></li>
                <li><a href="/seller-guide">Seller Guide</a></li>
                <li><a href="/seller-faq">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="footer-col-title">Company</p>
              <ul className="footer-links">
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Handcrafted Haven. All rights reserved.</p>
            <p>Made with ♥ for artisans everywhere.</p>
          </div>
        </div>
      </footer>
    </>
  );
}