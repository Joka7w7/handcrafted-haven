// ─────────────────────────────────────────────────────────
// FILE 1: src/app/seller/dashboard/page.tsx
// Protected page — shows logged-in seller's stats & listings
// ─────────────────────────────────────────────────────────
import type { Metadata } from "next";
 
export const metadata: Metadata = {
  title: "Seller Dashboard — Handcrafted Haven",
};
 
const MOCK_LISTINGS = [
  { id: 1, emoji: "🏺", bg: "#C4956A", name: "Hand-thrown Terracotta Bowl",  category: "Pottery",  price: 48,  stock: 12, status: "active",  orders: 7  },
  { id: 2, emoji: "🌿", bg: "#8BAB7E", name: "Dried Lavender Bundle",         category: "Botanicals", price: 18, stock: 30, status: "active", orders: 14 },
  { id: 3, emoji: "🕯️", bg: "#C9A87C", name: "Soy Lavender Pillar Candle",   category: "Candles",  price: 28,  stock: 0,  status: "draft",   orders: 0  },
];
 
export default function SellerDashboard() {
  return (
    <main>
      <div className="container dashboard-layout">
 
        <div className="dashboard-header">
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "0.25rem" }}>
              Seller dashboard
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", color: "var(--brown-deep)" }}>
              Welcome back, Jose
            </h1>
          </div>
          <a href="/seller/products/new" className="btn-primary">
            + Add new product
          </a>
        </div>
 
        {/* Stats */}
        <div className="stats-grid" role="region" aria-label="Sales statistics">
          {[
            { label: "Total sales",    value: "$842",  change: "+12% this month" },
            { label: "Active listings", value: "3",    change: "1 draft" },
            { label: "Total orders",    value: "21",   change: "+4 this week" },
            { label: "Avg. rating",     value: "4.8★", change: "From 32 reviews" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <p className="stat-card-label">{s.label}</p>
              <p className="stat-card-value">{s.value}</p>
              <p className="stat-card-change">{s.change}</p>
            </div>
          ))}
        </div>
 
        {/* Listings table */}
        <div className="listings-table" role="region" aria-label="Your product listings">
          <div className="listings-table-header" aria-hidden="true">
            <span>Product</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {MOCK_LISTINGS.map((item) => (
            <div key={item.id} className="listings-table-row" role="row">
              <div className="listing-product">
                <div className="listing-thumb" style={{ background: item.bg }} aria-hidden="true">
                  {item.emoji}
                </div>
                <div>
                  <p className="listing-name">{item.name}</p>
                  <p className="listing-category">{item.category}</p>
                </div>
              </div>
              <span>${item.price.toFixed(2)}</span>
              <span>{item.stock} left</span>
              <span>
                <span className={`status-pill ${item.status === "active" ? "status-active" : "status-draft"}`}>
                  {item.status}
                </span>
              </span>
              <div className="row-actions">
                <a href={`/seller/products/${item.id}/edit`} className="action-btn">Edit</a>
                <button className="action-btn" aria-label={`Delete ${item.name}`}>Del</button>
              </div>
            </div>
          ))}
        </div>
 
      </div>
    </main>
  );
}
 