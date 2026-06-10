// src/app/products/[id]/page.tsx

import type { Metadata } from "next";
import { AddToCartButton } from "@/components/AddToCartButton";

// Mock data — replace with prisma query once products are in DB
const MOCK_PRODUCTS: Record<string, {
  id: string; name: string; seller: string; sellerId: string;
  category: string; price: number; stock: number; rating: number;
  reviews: number; description: string; emoji: string; bg: string;
}> = {
  "1": { id: "1", name: "Hand-thrown Terracotta Bowl",   seller: "Maria Santos",  sellerId: "maria-santos",  category: "Pottery",  price: 48,  stock: 12, rating: 5, reviews: 42, description: "Each bowl is hand-thrown on a kick wheel using locally sourced terracotta clay. The warm, earthy glaze is applied by hand, giving every piece a unique character. Oven-safe and food-safe.", emoji: "🏺", bg: "#C4956A" },
  "2": { id: "2", name: "Sterling Silver Leaf Pendant",  seller: "Luna Jewelry",  sellerId: "luna-jewelry",  category: "Jewelry",  price: 72,  stock: 5,  rating: 5, reviews: 28, description: "Handcrafted sterling silver pendant shaped like a delicate leaf. Each piece is individually hammered and polished for a subtle organic texture.", emoji: "💍", bg: "#D4A76A" },
  "3": { id: "3", name: "Hand-woven Merino Throw",       seller: "Woven Stories", sellerId: "woven-stories", category: "Textiles", price: 125, stock: 8,  rating: 4, reviews: 17, description: "A luxuriously soft throw woven from 100% merino wool on a traditional floor loom. The natural dyes give each throw a unique, earthy palette.", emoji: "🧵", bg: "#A8836A" },
  "4": { id: "4", name: "Soy Lavender Pillar Candle",    seller: "Calm & Craft",  sellerId: "calm-craft",    category: "Candles",  price: 28,  stock: 30, rating: 5, reviews: 64, description: "Hand-poured soy wax candle scented with real dried lavender. Burns cleanly for up to 40 hours with a calming, natural fragrance.", emoji: "🕯️", bg: "#C9A87C" },
  "5": { id: "5", name: "Abstract Watercolor Print",     seller: "Canvas & Clay", sellerId: "canvas-clay",   category: "Art",      price: 95,  stock: 3,  rating: 5, reviews: 11, description: "Original watercolor painting printed on archival-quality paper. Each print captures the fluid, spontaneous beauty of watercolor in vivid detail.", emoji: "🖼️", bg: "#9E7A5E" },
  "6": { id: "6", name: "Reclaimed Oak Serving Board",   seller: "Oak & Grain",   sellerId: "oak-grain",     category: "Woodwork", price: 64,  stock: 7,  rating: 4, reviews: 33, description: "Handcrafted from reclaimed oak with a food-safe mineral oil finish. Each board has a unique grain pattern from the wood's previous life.", emoji: "🪵", bg: "#8B6347" },
  "7": { id: "7", name: "Hand-knit Amigurumi Bear",      seller: "Cozy Crafts",   sellerId: "cozy-crafts",   category: "Toys",     price: 36,  stock: 15, rating: 5, reviews: 19, description: "Adorable hand-knit teddy bear made from soft cotton yarn. Safety eyes and child-safe stuffing — perfect for all ages.", emoji: "🧸", bg: "#D4A878" },
  "8": { id: "8", name: "Dried Lavender Bundle",         seller: "Herb Haven",    sellerId: "herb-haven",    category: "Botanicals", price: 18, stock: 40, rating: 5, reviews: 52, description: "Freshly harvested and naturally dried lavender bundles. Perfect for home fragrance, sachets, or décor. Ships within 48 hours of harvest.", emoji: "🌿", bg: "#8BAB7E" },
  "9": { id: "9", name: "Speckled Glaze Mug Set",        seller: "Clay & Fire",   sellerId: "clay-fire",     category: "Pottery",  price: 55,  stock: 10, rating: 4, reviews: 24, description: "A set of two hand-thrown mugs with a speckled reactive glaze. Each mug holds 12oz and is microwave and dishwasher safe.", emoji: "🏺", bg: "#B8836A" },
};

const MOCK_REVIEWS = [
  { id: "r1", user: "Sarah M.", rating: 5, date: "May 2025", comment: "Absolutely beautiful — the quality is outstanding and it arrived perfectly packaged." },
  { id: "r2", user: "Tom R.",   rating: 5, date: "Apr 2025", comment: "This is my third purchase. Every piece is unique and so well made." },
  { id: "r3", user: "Ana G.",   rating: 4, date: "Mar 2025", comment: "Lovely craftsmanship. Slightly smaller than expected but I still love it." },
];

// ── Next.js 15+: params is a Promise ──
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = MOCK_PRODUCTS[id];
  if (!product) return { title: "Product Not Found — Handcrafted Haven" };
  return {
    title:       `${product.name} — Handcrafted Haven`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = MOCK_PRODUCTS[id];

  if (!product) {
    return (
      <main>
        <div className="container" style={{ padding: "5rem 1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "var(--brown-deep)", marginBottom: "0.5rem" }}>
            Product not found
          </h1>
          <p style={{ color: "var(--text-mid)", marginBottom: "1.5rem" }}>
            This product may have been removed or the link is incorrect.
          </p>
          <a href="/shop" className="btn-primary">Browse products</a>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        <div className="detail-layout">

          {/* Images */}
          <div className="detail-images">
            <div
              className="main-image"
              style={{ background: product.bg, fontSize: "5rem", display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "1", borderRadius: "var(--radius-md)" }}
              aria-label={product.name}
            >
              {product.emoji}
            </div>
            <div className="detail-thumbs" aria-label="Product thumbnails">
              {[product.emoji, "✨", "📦"].map((e, i) => (
                <button
                  key={i}
                  className={`detail-thumb ${i === 0 ? "active" : ""}`}
                  aria-label={`View image ${i + 1}`}
                  style={{ background: i === 0 ? product.bg : "var(--border)" }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="detail-eyebrow">
              <a href={`/sellers/${product.sellerId}`}>{product.seller}</a>
              {" · "}
              {product.category}
            </p>

            <h1 className="detail-title">{product.name}</h1>

            <div className="detail-rating">
              <span className="stars" aria-hidden="true">
                {"★".repeat(product.rating)}{"☆".repeat(5 - product.rating)}
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-mid)" }}>
                {product.rating}.0 ({product.reviews} reviews)
              </span>
            </div>

            <p className="detail-price">${product.price.toFixed(2)}</p>
            <p className="detail-desc">{product.description}</p>

            <p style={{
              fontSize: "0.82rem",
              color: product.stock > 0 ? "var(--sage)" : "var(--terracotta)",
              marginBottom: "1rem",
            }}>
              {product.stock > 0 ? `✓ ${product.stock} in stock` : "✗ Out of stock"}
            </p>

            <AddToCartButton
              id={product.id}
              name={product.name}
              seller={product.seller}
              price={product.price}
              emoji={product.emoji}
              bg={product.bg}
            />

            {/* Reviews */}
            <div style={{ marginTop: "2.5rem" }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.1rem",
                color: "var(--brown-deep)",
                marginBottom: "1.25rem",
              }}>
                Customer Reviews ({product.reviews})
              </h2>

              {MOCK_REVIEWS.map((r) => (
                <div key={r.id} style={{ padding: "1rem 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-dark)" }}>{r.user}</span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>{r.date}</span>
                  </div>
                  <div
                    className="stars"
                    aria-label={`${r.rating} out of 5 stars`}
                    style={{ fontSize: "0.8rem", marginBottom: "0.4rem" }}
                  >
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-mid)", lineHeight: 1.6 }}>
                    {r.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}