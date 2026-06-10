// src/components/SearchBar.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form
      role="search"
      onSubmit={handleSearch}
      style={{ flex: 1, maxWidth: "420px", position: "relative" }}
    >
      <label htmlFor="site-search" className="sr-only">
        Search products and artisans
      </label>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "0.9rem",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-light)",
          pointerEvents: "none",
        }}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        id="site-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products, artisans…"
        aria-label="Search products and artisans"
        style={{
          width: "100%",
          padding: "0.6rem 1rem 0.6rem 2.75rem",
          border: "1.5px solid var(--border)",
          borderRadius: "50px",
          background: "var(--white)",
          fontFamily: "'Lato', sans-serif",
          fontSize: "0.9rem",
          color: "var(--text-dark)",
          outline: "none",
        }}
      />
    </form>
  );
}