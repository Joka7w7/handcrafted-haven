// src/app/cart/page.tsx
// Full cart page with order summary
 
"use client";
 
import { useCart } from "@/context/CartContext";
import type { Metadata } from "next";
 
export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, clearCart } = useCart();
 
  const shipping = subtotal > 75 ? 0 : 8.99;
  const tax      = subtotal * 0.08;
  const total    = subtotal + shipping + tax;
 
  return (
    <main>
      <div className="container" style={{ padding: "3rem 1.5rem" }}>
 
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", color: "var(--brown-deep)", marginBottom: "2rem" }}>
          Shopping Cart
        </h1>
 
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛍️</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--brown-deep)", marginBottom: "0.5rem" }}>
              Your cart is empty
            </h2>
            <p style={{ color: "var(--text-mid)", marginBottom: "1.5rem" }}>
              Discover unique handcrafted items from talented artisans.
            </p>
            <a href="/shop" className="btn-primary">Browse products</a>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>
 
            {/* Cart items */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--text-mid)" }}>
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </p>
                <button
                  onClick={clearCart}
                  style={{ background: "none", border: "none", fontSize: "0.82rem", color: "var(--text-light)", cursor: "pointer" }}
                >
                  Clear cart
                </button>
              </div>
 
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "72px 1fr auto",
                    gap: "1rem",
                    padding: "1.25rem 0",
                    borderBottom: "1px solid var(--border)",
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      width: 72, height: 72,
                      borderRadius: "var(--radius-md)",
                      background: item.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.8rem",
                    }}
                    aria-hidden="true"
                  >
                    {item.emoji}
                  </div>
 
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-dark)", marginBottom: "2px" }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-light)", marginBottom: "10px" }}>
                      {item.seller}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden", width: "fit-content" }}>
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        style={{ width: 32, height: 32, background: "var(--surface)", border: "none", cursor: "pointer", fontSize: "1rem", color: "var(--brown-deep)" }}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span style={{ width: 36, textAlign: "center", fontSize: "0.88rem", fontWeight: 700, color: "var(--text-dark)" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        style={{ width: 32, height: 32, background: "var(--surface)", border: "none", cursor: "pointer", fontSize: "1rem", color: "var(--brown-deep)" }}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                  </div>
 
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 700, color: "var(--brown-deep)", fontSize: "1rem", marginBottom: "8px" }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ background: "none", border: "none", fontSize: "0.78rem", color: "var(--text-light)", cursor: "pointer" }}
                      aria-label={`Remove ${item.name}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
 
            {/* Order summary */}
            <div
              style={{
                background: "var(--white)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "1.5rem",
                position: "sticky",
                top: "80px",
              }}
            >
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "var(--brown-deep)", marginBottom: "1.25rem" }}>
                Order summary
              </h2>
 
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.25rem" }}>
                {[
                  { label: "Subtotal", value: `$${subtotal.toFixed(2)}` },
                  { label: "Shipping", value: shipping === 0 ? "Free" : `$${shipping.toFixed(2)}` },
                  { label: "Estimated tax", value: `$${tax.toFixed(2)}` },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "var(--text-mid)" }}>
                    <span>{row.label}</span>
                    <span style={{ color: row.value === "Free" ? "var(--sage)" : "var(--text-dark)", fontWeight: row.value === "Free" ? 700 : 400 }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
 
              {subtotal < 75 && (
                <p style={{ fontSize: "0.78rem", color: "var(--sage)", background: "#E1F5EE", padding: "0.5rem 0.75rem", borderRadius: "6px", marginBottom: "1rem" }}>
                  Add ${(75 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
 
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", marginBottom: "1.25rem" }}>
                <span style={{ color: "var(--text-dark)" }}>Total</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--brown-deep)" }}>
                  ${total.toFixed(2)}
                </span>
              </div>
 
              <a href="/checkout" className="btn-primary" style={{ display: "block", textAlign: "center", width: "100%" }}>
                Proceed to Checkout
              </a>
 
              <a href="/shop" style={{ display: "block", textAlign: "center", marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--text-mid)" }}>
                ← Continue shopping
              </a>
            </div>
 
          </div>
        )}
      </div>
    </main>
  );
}