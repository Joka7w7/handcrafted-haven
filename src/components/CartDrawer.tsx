// ─────────────────────────────────────────────────────
// FILE 2: src/components/CartDrawer.tsx
// Slide-in cart drawer shown when isOpen = true
// ─────────────────────────────────────────────────────
 
"use client";
 
import { useCart } from "@/context/CartContext";
 
export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, itemCount } = useCart();
 
  if (!isOpen) return null;
 
  return (
    <>
      <div
        style={{
          position: "fixed", inset: 0,
          background: "rgba(44,44,42,0.4)",
          zIndex: 200,
        }}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(420px, 100vw)",
          background: "var(--surface)",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", background: "var(--white)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "var(--brown-deep)" }}>
            Your Cart {itemCount > 0 && <span style={{ fontSize: "0.8rem", color: "var(--text-light)", fontFamily: "'Lato', sans-serif" }}>({itemCount} items)</span>}
          </h2>
          <button onClick={closeCart} aria-label="Close cart" style={{ background: "none", border: "none", fontSize: "1.4rem", color: "var(--text-mid)", cursor: "pointer" }}>
            ✕
          </button>
        </div>
 
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-mid)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🛍️</div>
              <p style={{ fontFamily: "'Playfair Display', serif", color: "var(--brown-deep)", marginBottom: "0.5rem" }}>Your cart is empty</p>
              <p style={{ fontSize: "0.85rem" }}>Start shopping to add items here.</p>
              <a href="/shop" onClick={closeCart} className="btn-primary" style={{ display: "inline-block", marginTop: "1.25rem" }}>Browse products</a>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: "12px", padding: "1rem 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 56, height: 56, borderRadius: "8px", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }} aria-hidden="true">
                  {item.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-dark)", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-light)", marginBottom: "8px" }}>{item.seller}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ width: 28, height: 28, background: "var(--surface)", border: "none", cursor: "pointer", fontSize: "1rem", color: "var(--brown-deep)" }} aria-label="Decrease quantity">−</button>
                      <span style={{ width: 32, textAlign: "center", fontSize: "0.85rem", fontWeight: 700 }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ width: 28, height: 28, background: "var(--surface)", border: "none", cursor: "pointer", fontSize: "1rem", color: "var(--brown-deep)" }} aria-label="Increase quantity">+</button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontWeight: 700, color: "var(--brown-deep)" }}>${(item.price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: "var(--text-light)", cursor: "pointer", fontSize: "1rem" }} aria-label={`Remove ${item.name}`}>🗑</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
 
        {items.length > 0 && (
          <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--border)", background: "var(--white)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontWeight: 700, color: "var(--text-dark)" }}>Subtotal</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--brown-deep)" }}>${subtotal.toFixed(2)}</span>
            </div>
            <a href="/cart" onClick={closeCart} className="btn-primary" style={{ display: "block", textAlign: "center", width: "100%" }}>
              Proceed to Checkout
            </a>
            <button onClick={closeCart} style={{ display: "block", width: "100%", textAlign: "center", marginTop: "0.75rem", background: "none", border: "none", fontSize: "0.85rem", color: "var(--text-mid)", cursor: "pointer" }}>
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}