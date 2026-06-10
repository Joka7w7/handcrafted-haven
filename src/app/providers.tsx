// ─────────────────────────────────────────────────────
// FILE 3: src/app/providers.tsx
// Wraps the app with NextAuth SessionProvider
// ─────────────────────────────────────────────────────
 
"use client";
 
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
 
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </SessionProvider>
  );
}