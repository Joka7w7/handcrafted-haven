// src/components/Navbar.tsx

import { NavCartButton }  from "@/components/NavCartButton";
import { NavAuthButtons } from "@/components/NavAuthButtons";
import { SearchBar }      from "@/components/SearchBar";

export function Navbar() {
  return (
    <header className="navbar" role="banner">
      <div className="container navbar-inner">
        <a href="/" className="navbar-logo" aria-label="Handcrafted Haven home">
          🧶 Handcrafted<span>Haven</span>
        </a>

        <SearchBar />

        <div className="navbar-actions">
          <a href="/shop"             className="nav-link">Shop</a>
          <a href="/seller/dashboard" className="nav-link">Sell</a>
          <NavCartButton />
          <NavAuthButtons />
        </div>
      </div>
    </header>
  );
}