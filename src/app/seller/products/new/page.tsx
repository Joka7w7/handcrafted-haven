// src/app/seller/products/new/page.tsx

import type { Metadata } from "next";
import { NewProductForm } from "./NewProductForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Add New Product — Handcrafted Haven",
};

export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?redirect=/seller/products/new");

  return (
    <main>
      <div className="container" style={{ padding: "3rem 1.5rem", maxWidth: 680 }}>
        <div style={{ marginBottom: "2rem" }}>
          <a
            href="/seller/dashboard"
            style={{ fontSize: "0.85rem", color: "var(--text-mid)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}
          >
            ← Back to dashboard
          </a>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", color: "var(--brown-deep)", marginBottom: "0.4rem" }}>
            Add New Product
          </h1>
          <p style={{ color: "var(--text-mid)", fontSize: "0.9rem" }}>
            Fill in the details below to list your handcrafted item for sale.
          </p>
        </div>
        <NewProductForm sellerId={session.user.id} />
      </div>
    </main>
  );
}