import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Product, OrderItem, Review } from "@prisma/client";

export const metadata: Metadata = {
  title: "Seller Dashboard — Handcrafted Haven",
};

export default async function SellerDashboard() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const seller = await prisma.sellerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      products: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!seller) redirect("/");

  // ── Compute stats from real data ──────────────────────────────────────
  const activeListings = seller.products.filter((p: Product) => p.isActive).length;
  const draftListings  = seller.products.filter((p: Product) => !p.isActive).length;

  // Pull all orders for this seller's products
  const orderItems = await prisma.orderItem.findMany({
    where: { product: { sellerId: seller.id } },
    include: { order: true },
  });

  const totalOrders  = orderItems.length;
  const totalRevenue = orderItems.reduce(
  (sum: number, item: OrderItem) => sum + item.price * item.quantity, 0
);

  // Reviews across all products
  const reviews = await prisma.review.findMany({
    where: { product: { sellerId: seller.id } },
  });
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length
      : 0;

  const stats = [
    { label: "Total revenue",    value: `$${totalRevenue.toFixed(2)}`,              change: `${totalOrders} orders total` },
    { label: "Active listings",  value: String(activeListings),                     change: draftListings > 0 ? `${draftListings} draft` : "All active" },
    { label: "Total orders",     value: String(totalOrders),                        change: `Across ${seller.products.length} products` },
    { label: "Avg. rating",      value: avgRating > 0 ? `${avgRating.toFixed(1)}★` : "No reviews yet", change: `From ${reviews.length} reviews` },
  ];

  return (
    <main>
      <div className="container dashboard-layout">

        <div className="dashboard-header">
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)", marginBottom: "0.25rem" }}>
              Seller dashboard
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", color: "var(--brown-deep)" }}>
              Welcome back, {seller.shopName}
            </h1>
          </div>
          <a href="/seller/products/new" className="btn-primary">
            + Add new product
          </a>
        </div>

        {/* Stats */}
        <div className="stats-grid" role="region" aria-label="Sales statistics">
          {stats.map((s) => (
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

          {seller.products.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-mid)" }}>
              No products yet. <a href="/seller/products/new" style={{ color: "var(--brown-deep)" }}>Add your first listing →</a>
            </div>
          ) : (
            seller.products.map((item: Product) => {
              const firstImage = item.imageUrls?.split(",")[0] ?? null;
              return (
                <div key={item.id} className="listings-table-row" role="row">
                  <div className="listing-product">
                    <div className="listing-thumb" aria-hidden="true">
                      {firstImage ? (
                        <img src={firstImage} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }} />
                      ) : (
                        <span style={{ fontSize: "1.5rem" }}>🏺</span>
                      )}
                    </div>
                    <div>
                      <p className="listing-name">{item.title}</p>
                      <p className="listing-category">{item.category ?? "—"}</p>
                    </div>
                  </div>
                  <span>${item.price.toFixed(2)}</span>
                  <span>{item.stock} left</span>
                  <span>
                    <span className={`status-pill ${item.isActive ? "status-active" : "status-draft"}`}>
                      {item.isActive ? "active" : "draft"}
                    </span>
                  </span>
                  <div className="row-actions">
                    <a href={`/seller/products/${item.id}/edit`} className="action-btn">Edit</a>
                    <button className="action-btn" aria-label={`Delete ${item.title}`}>Del</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </main>
  );
}