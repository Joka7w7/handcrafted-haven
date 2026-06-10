// src/app/sellers/[id]/page.tsx

import type { Metadata } from "next";
import { AddToCartButton } from "@/components/AddToCartButton";

const MOCK_SELLERS: Record<string, {
  id: string; name: string; craft: string; location: string;
  joined: string; bio: string; items: number; sales: number;
  rating: number; reviews: number; emoji: string; bg: string;
}> = {
  "maria-santos": {
    id: "maria-santos", name: "Maria Santos", craft: "Pottery",
    location: "Antigua, Guatemala", joined: "March 2022",
    bio: "I've been throwing pottery for over 12 years, inspired by the earthy textures and warm tones of the Guatemalan highlands. Each piece I create is one-of-a-kind — shaped by hand, fired in a wood kiln, and glazed using natural pigments sourced locally.",
    items: 34, sales: 210, rating: 4.9, reviews: 86, emoji: "👩‍🎨", bg: "#E8C4A0",
  },
  "luna-jewelry": {
    id: "luna-jewelry", name: "Luna Park", craft: "Jewelry",
    location: "Seoul, South Korea", joined: "June 2021",
    bio: "Jewelry designer specializing in sterling silver and semi-precious stones. Every piece is handcrafted in my small studio and inspired by organic shapes found in nature.",
    items: 51, sales: 340, rating: 4.8, reviews: 120, emoji: "💎", bg: "#D4C4E0",
  },
  "woven-stories": {
    id: "woven-stories", name: "Anya Weaver", craft: "Textiles",
    location: "Oaxaca, Mexico", joined: "January 2023",
    bio: "Traditional weaver using a backstrap loom passed down through four generations. My textiles blend ancient patterns with contemporary color palettes.",
    items: 22, sales: 98, rating: 4.7, reviews: 45, emoji: "🧶", bg: "#C4D4B0",
  },
  "oak-grain": {
    id: "oak-grain", name: "James Oak", craft: "Woodwork",
    location: "Portland, Oregon", joined: "September 2020",
    bio: "Furniture maker and woodworker with a focus on reclaimed and sustainably sourced materials. Every piece tells the story of the wood it came from.",
    items: 18, sales: 76, rating: 4.9, reviews: 52, emoji: "🔨", bg: "#D0B8A0",
  },
  "calm-craft": {
    id: "calm-craft", name: "Calm & Craft", craft: "Candles",
    location: "Austin, Texas", joined: "April 2022",
    bio: "Small-batch soy candle maker using botanicals and essential oils. Every candle is hand-poured in small runs to ensure consistent quality.",
    items: 15, sales: 430, rating: 5.0, reviews: 210, emoji: "🕯️", bg: "#F5E6C8",
  },
};

const MOCK_PRODUCTS: Record<string, Array<{
  id: number; emoji: string; bg: string; name: string; price: number; rating: number; reviews: number;
}>> = {
  "maria-santos":  [
    { id: 1, emoji: "🏺", bg: "#C4956A", name: "Hand-thrown Terracotta Bowl", price: 48, rating: 5, reviews: 42 },
    { id: 9, emoji: "🏺", bg: "#B8836A", name: "Speckled Glaze Mug Set",      price: 55, rating: 4, reviews: 24 },
  ],
  "luna-jewelry":  [
    { id: 2, emoji: "💍", bg: "#D4A76A", name: "Sterling Silver Leaf Pendant", price: 72, rating: 5, reviews: 28 },
  ],
  "woven-stories": [
    { id: 3, emoji: "🧵", bg: "#A8836A", name: "Hand-woven Merino Throw",      price: 125, rating: 4, reviews: 17 },
  ],
  "oak-grain":     [
    { id: 6, emoji: "🪵", bg: "#8B6347", name: "Reclaimed Oak Serving Board",  price: 64, rating: 4, reviews: 33 },
  ],
  "calm-craft":    [
    { id: 4, emoji: "🕯️", bg: "#C9A87C", name: "Soy Lavender Pillar Candle",  price: 28, rating: 5, reviews: 64 },
  ],
};

// ── Next.js 15+: params is a Promise ──
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const seller = MOCK_SELLERS[id];
  if (!seller) return { title: "Seller Not Found — Handcrafted Haven" };
  return {
    title:       `${seller.name} — Handcrafted Haven`,
    description: seller.bio.slice(0, 160),
  };
}

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seller   = MOCK_SELLERS[id];
  const products = MOCK_PRODUCTS[id] ?? [];

  if (!seller) {
    return (
      <main>
        <div className="container" style={{ padding: "5rem 1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "var(--brown-deep)", marginBottom: "0.5rem" }}>
            Seller not found
          </h1>
          <p style={{ color: "var(--text-mid)", marginBottom: "1.5rem" }}>
            This artisan profile may have been removed or the link is incorrect.
          </p>
          <a href="/shop" className="btn-primary">Browse products</a>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>

        {/* Cover + avatar */}
        <div style={{ position: "relative", marginBottom: "2rem" }}>
          <div className="profile-cover" />
          <div
            className="profile-avatar-wrap"
            aria-hidden="true"
            style={{ background: seller.bg }}
          >
            {seller.emoji}
          </div>
        </div>

        {/* Profile info */}
        <div className="profile-card">
          <h1 className="profile-name">{seller.name}</h1>
          <p className="profile-craft">{seller.craft} Artisan</p>
          <p className="profile-bio">{seller.bio}</p>
          <div className="profile-meta">
            <span className="profile-meta-item">📍 {seller.location}</span>
            <span className="profile-meta-item">📅 Joined {seller.joined}</span>
            <span className="profile-meta-item">
              <strong>{seller.items}</strong> listings
            </span>
            <span className="profile-meta-item">
              <strong>{seller.sales}</strong> sales
            </span>
            <span className="profile-meta-item">
              <strong>{seller.rating}★</strong> ({seller.reviews} reviews)
            </span>
          </div>
        </div>

        {/* Products */}
        {products.length > 0 && (
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              color: "var(--brown-deep)",
              marginBottom: "1.25rem",
            }}>
              {seller.name}&apos;s Products
            </h2>
            <div className="products-grid" role="list">
              {products.map((p) => (
                <article key={p.id} className="product-card" role="listitem">
                  <div className="product-img">
                    <div
                      className="product-img-bg"
                      style={{ background: p.bg }}
                      aria-hidden="true"
                    >
                      {p.emoji}
                    </div>
                  </div>
                  <div className="product-info">
                    <p className="product-seller">{seller.name}</p>
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
                      seller={seller.name}
                      price={p.price}
                      emoji={p.emoji}
                      bg={p.bg}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}