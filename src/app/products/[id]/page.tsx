// ─────────────────────────────────────────────────────────
// FILE 3: src/app/products/[id]/page.tsx
// Public product detail page
// ─────────────────────────────────────────────────────────
 
// Paste this into: src/app/products/[id]/page.tsx
 
import type { Metadata } from "next";
 
const MOCK_PRODUCT = {
  id: 1,
  name: "Hand-thrown Terracotta Bowl",
  seller: "Maria Santos",
  sellerId: "maria-santos",
  category: "Pottery",
  price: 48,
  stock: 12,
  rating: 5,
  reviews: 42,
  description: "Each bowl is hand-thrown on a kick wheel using locally sourced terracotta clay. The warm, earthy glaze is applied by hand, giving every piece a unique character. Oven-safe and food-safe, perfect for everyday use or as a decorative piece.",
  emoji: "🏺",
  bg: "#C4956A",
};
 
const MOCK_REVIEWS = [
  { id: 1, user: "Sarah M.", rating: 5, date: "May 2025", comment: "Absolutely beautiful bowl — the quality is outstanding and it arrived perfectly packaged." },
  { id: 2, user: "Tom R.",   rating: 5, date: "Apr 2025", comment: "This is my third purchase from Maria's studio. Every piece is unique and so well made." },
  { id: 3, user: "Ana G.",   rating: 4, date: "Mar 2025", comment: "Lovely craftsmanship. Slightly smaller than I expected but I still love it." },
];
 
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `${MOCK_PRODUCT.name} — Handcrafted Haven`,
    description: MOCK_PRODUCT.description.slice(0, 160),
  };
}
 
export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = MOCK_PRODUCT;
 
  return (
    <main>
      <div className="container">
        <div className="detail-layout">
 
          <div className="detail-images">
            <div className="main-image" style={{ background: product.bg }} aria-label={product.name}>
              {product.emoji}
            </div>
            <div className="detail-thumbs" aria-label="Product image thumbnails">
              {[product.emoji, "🫙", "✨"].map((e, i) => (
                <button key={i} className={`detail-thumb ${i === 0 ? "active" : ""}`} aria-label={`View image ${i + 1}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>
 
          <div>
            <p className="detail-eyebrow">
              <a href={`/sellers/${product.sellerId}`}>{product.seller}</a> · {product.category}
            </p>
            <h1 className="detail-title">{product.name}</h1>
 
            <div className="detail-rating">
              <span className="stars" aria-hidden="true">{"★".repeat(product.rating)}</span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-mid)" }}>
                {product.rating}.0 ({product.reviews} reviews)
              </span>
            </div>
 
            <p className="detail-price">${product.price.toFixed(2)}</p>
            <p className="detail-desc">{product.description}</p>
 
            <p style={{ fontSize: "0.82rem", color: product.stock > 0 ? "var(--sage)" : "var(--terracotta)", marginBottom: "1rem" }}>
              {product.stock > 0 ? `✓ ${product.stock} in stock` : "✗ Out of stock"}
            </p>
 
            <div className="qty-row">
              <div className="qty-control" role="group" aria-label="Quantity">
                <button className="qty-btn" aria-label="Decrease quantity">−</button>
                <span className="qty-val" aria-live="polite">1</span>
                <button className="qty-btn" aria-label="Increase quantity">+</button>
              </div>
              <button className="btn-add-to-cart" disabled={product.stock === 0}>
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
 
            <div style={{ marginTop: "2.5rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "var(--brown-deep)", marginBottom: "1.25rem" }}>
                Customer Reviews ({product.reviews})
              </h2>
              {MOCK_REVIEWS.map((r) => (
                <div key={r.id} style={{ padding: "1rem 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.88rem" }}>{r.user}</span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>{r.date}</span>
                  </div>
                  <div className="stars" aria-label={`${r.rating} out of 5 stars`} style={{ fontSize: "0.8rem", marginBottom: "0.4rem" }}>
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-mid)", lineHeight: 1.6 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
 
        </div>
      </div>
    </main>
  );
}