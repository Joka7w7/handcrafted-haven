// src/app/checkout/confirmation/page.tsx

"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function ConfirmationPage() {
  const { clearCart } = useCart();

  // Clear cart on arrival to this page
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const orderNumber = Math.random().toString(36).slice(2, 10).toUpperCase();

  return (
    <main>
      <div
        className="container"
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            width: "100%",
            textAlign: "center",
            background: "var(--white)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "3rem 2.5rem",
          }}
        >
          {/* Success icon */}
          <div
            style={{
              width: 72, height: 72,
              borderRadius: "50%",
              background: "#E1F5EE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              fontSize: "2rem",
            }}
            aria-hidden="true"
          >
            ✓
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.75rem",
              color: "var(--brown-deep)",
              marginBottom: "0.75rem",
            }}
          >
            Thank you for your order!
          </h1>

          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text-mid)",
              lineHeight: 1.7,
              marginBottom: "1.5rem",
            }}
          >
            Your order has been placed and the artisan has been notified.
            You'll receive a confirmation email shortly.
          </p>

          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "1rem 1.5rem",
              marginBottom: "2rem",
            }}
          >
            <p style={{ fontSize: "0.78rem", color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>
              Order reference
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--brown-deep)" }}>
              #{orderNumber}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <a href="/shop" className="btn-primary" style={{ display: "block" }}>
              Continue shopping
            </a>
            <a
              href="/"
              style={{
                fontSize: "0.85rem",
                color: "var(--text-mid)",
                display: "block",
              }}
            >
              Back to home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}