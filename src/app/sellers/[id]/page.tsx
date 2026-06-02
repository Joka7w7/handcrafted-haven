// ─────────────────────────────────────────────────────────
// FILE 2: src/app/sellers/[id]/page.tsx
// Public seller profile page
// ─────────────────────────────────────────────────────────
 
// Paste this into: src/app/sellers/[id]/page.tsx
 
import type { Metadata } from "next";
 
const MOCK_SELLER = {
  name: "Maria Santos",
  craft: "Pottery",
  joined: "March 2022",
  location: "Antigua, Guatemala",
  bio: "I've been throwing pottery for over 12 years, inspired by the earthy textures and warm tones of the Guatemalan highlands. Each piece I create is one-of-a-kind — shaped by hand, fired in a wood kiln, and glazed using natural pigments sourced locally.",
  items: 34,
  sales: 210,
  rating: 4.9,
  reviews: 86,
  emoji: "👩‍🎨",
  bg: "#E8C4A0",
};
 
const MOCK_PRODUCTS = [
  { id: 1, emoji: "🏺", bg: "#C4956A", name: "Terracotta Bowl",      price: 48, rating: 5, reviews: 42 },
  { id: 9, emoji: "🏺", bg: "#B8836A", name: "Speckled Glaze Mugs",  price: 55, rating: 4, reviews: 24 },
  { id: 10, emoji: "🫙", bg: "#D4A870", name: "Handmade Storage Jar", price: 38, rating: 5, reviews: 15 },
];
 
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `${MOCK_SELLER.name} — Handcrafted Haven`,
    description: MOCK_SELLER.bio.slice(0, 160),
  };
}
 
export default function SellerProfilePage({ params }: { params: { id: string } }) {
  const seller = MOCK_SELLER;
 
  return (
    <main>
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
 
        <div style={{ position: "relative", marginBottom: "2rem" }}>
          <div className="profile-cover" />
          <div className="profile-avatar-wrap" aria-hidden="true">{seller.emoji}</div>
        </div>
 
        <div className="profile-card">
          <h1 className="profile-name">{seller.name}</h1>
          <p className="profile-craft">{seller.craft} Artisan</p>
          <p className="profile-bio">{seller.bio}</p>
          <div className="profile-meta">
            <span className="profile-meta-item">📍 {seller.location}</span>
            <span className="profile-meta-item">📅 Joined {seller.joined}</span>
            <span className="profile-meta-item"><strong>{seller.items}</strong> listings</span>
            <span className="profile-meta-item"><strong>{seller.sales}</strong> sales</span>
            <span className="profile-meta-item"><strong>{seller.rating}★</strong> ({seller.reviews} reviews)</span>
          </div>
        </div>
 
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "var(--brown-deep)", marginBottom: "1.25rem" }}>
            {seller.name}&apos;s Products
          </h2>
          <div className="products-grid" role="list">
            {MOCK_PRODUCTS.map((p) => (
              <article key={p.id} className="product-card" role="listitem">
                <div className="product-img">
                  <div className="product-img-bg" style={{ background: p.bg }} aria-hidden="true">
                    {p.emoji}
                  </div>
                </div>
                <div className="product-info">
                  <p className="product-seller">{seller.name}</p>
                  <h3 className="product-name"><a href={`/products/${p.id}`}>{p.name}</a></h3>
                  <div className="product-footer">
                    <p className="product-price">${p.price.toFixed(2)}</p>
                    <div className="product-rating" aria-label={`${p.rating} stars`}>
                      <span className="stars" aria-hidden="true">{"★".repeat(p.rating)}{"☆".repeat(5-p.rating)}</span>
                      <span className="rating-count">({p.reviews})</span>
                    </div>
                  </div>
                  <button className="product-cart-btn">Add to Cart</button>
                </div>
              </article>
            ))}
          </div>
        </div>
 
      </div>
    </main>
  );
}