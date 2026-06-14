// src/app/seller/dashboard/page.tsx

import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Seller Dashboard — Handcrafted Haven",
};

export default async function SellerDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?redirect=/seller/dashboard");
  }

  const products = await prisma.product.findMany({
    where:   { sellerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const firstName = session.user.name?.split(" ")[0] ?? "there";
  const active    = products.filter((p) => p.status === "active").length;
  const drafts    = products.filter((p) => p.status === "draft").length;

  return (
    <main>
      <div className="container dashboard-layout">

        <div className="dashboard-header">
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "0.25rem" }}>
              Seller dashboard
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", color: "var(--brown-deep)" }}>
              Welcome back, {firstName}
            </h1>
          </div>
          <a href="/seller/products/new" className="btn-primary">
            + Add new product
          </a>
        </div>

        {/* Stats */}
        <div className="stats-grid" role="region" aria-label="Sales statistics">
          {[
            { label: "Active listings", value: String(active),          change: `${drafts} draft${drafts !== 1 ? "s" : ""}` },
            { label: "Total products",  value: String(products.length), change: "All time"           },
            { label: "Total orders",    value: "0",                     change: "Orders coming soon" },
            { label: "Avg. rating",     value: "—",                     change: "No reviews yet"     },
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

          {products.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-mid)" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", color: "var(--brown-deep)", marginBottom: "0.5rem" }}>
                No products yet
              </p>
              <p style={{ fontSize: "0.88rem", marginBottom: "1rem" }}>
                Add your first product to start selling.
              </p>
              <a href="/seller/products/new" className="btn-primary">
                + Add product
              </a>
            </div>
          ) : (
            products.map((item) => (
              <div key={item.id} className="listings-table-row" role="row">
                <div className="listing-product">
                  <div
                    className="listing-thumb"
                    style={{ background: "var(--terracotta)" }}
                    aria-hidden="true"
                  >
                    🏺
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
            ))
          )}
        </div>

      </div>
    </main>
  );
}