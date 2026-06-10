// ─────────────────────────────────────────────────────
// FILE 2: src/components/AddToCartButton.tsx
// Client component — used inside any Server Component page
// to wire up the cart context
// ─────────────────────────────────────────────────────
 
"use client";
 
import { useCart } from "@/context/CartContext";
 
interface Props {
  id:     string;
  name:   string;
  seller: string;
  price:  number;
  emoji:  string;
  bg:     string;
}
 
export function AddToCartButton({ id, name, seller, price, emoji, bg }: Props) {
  const { addItem } = useCart();
 
  return (
    <button
      className="product-cart-btn"
      onClick={() => addItem({ id, name, seller, price, emoji, bg })}
      aria-label={`Add ${name} to cart`}
    >
      Add to Cart
    </button>
  );
}