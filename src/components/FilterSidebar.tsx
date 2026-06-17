// src/components/FilterSidebar.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const CATEGORIES = [
  "Pottery", "Jewelry", "Textiles", "Candles",
  "Art", "Woodwork", "Toys", "Botanicals", "Other",
];

export function FilterSidebar() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const activeCats    = searchParams.getAll("category");
  const currentMin    = searchParams.get("minPrice") ?? "";
  const currentMax    = searchParams.get("maxPrice") ?? "";
  const currentRating = searchParams.get("rating")   ?? "0";
  const currentSort   = searchParams.get("sort")     ?? "newest";

  const [categories, setCategories] = useState<string[]>(activeCats);
  const [minPrice,   setMinPrice]   = useState(currentMin);
  const [maxPrice,   setMaxPrice]   = useState(currentMax);
  const [rating,     setRating]     = useState(currentRating);
  const [sort,       setSort]       = useState(currentSort);

  function applyFilters() {
    const params = new URLSearchParams();
    categories.forEach((cat) => params.append("category", cat));
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (rating && rating !== "0") params.set("rating", rating);
    if (sort && sort !== "newest") params.set("sort", sort);
    router.push(`/shop?${params.toString()}`);
  }

  function clearFilters() {
    setCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setRating("0");
    setSort("newest");
    router.push("/shop");
  }

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  const hasActiveFilters =
    categories.length > 0 || minPrice || maxPrice || rating !== "0";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.45rem 0.5rem",
    border: "1.5px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    fontFamily: "'Lato', sans-serif",
    fontSize: "0.85rem",
    color: "var(--text-dark)",
    outline: "none",
    minWidth: 0,
    background: "var(--white)",
  };

  return (
    <aside aria-label="Product filters">
      <div className="filter-sidebar">

        {/* Header */}
        <div className="filter-title">
          Filters
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="filter-clear"
              aria-label="Clear all filters"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Category */}
        <div className="filter-group">
          <p className="filter-group-title">Category</p>
          <div className="filter-options">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="filter-option">
                <input
                  type="checkbox"
                  checked={categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div className="filter-group">
          <p className="filter-group-title">Price range</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
              min={0}
              aria-label="Minimum price"
              style={inputStyle}
            />
            <span style={{ color: "var(--text-light)", flexShrink: 0, fontSize: "0.85rem" }}>
              –
            </span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
              min={0}
              aria-label="Maximum price"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Rating */}
        <div className="filter-group">
          <p className="filter-group-title">Minimum rating</p>
          <div className="rating-options">
            {[
              { value: "0", label: "Any rating",  stars: 0 },
              { value: "3", label: "3★ & up",     stars: 3 },
              { value: "4", label: "4★ & up",     stars: 4 },
            ].map((r) => (
              <label key={r.value} className="rating-option">
                <input
                  type="radio"
                  name="rating-filter"
                  value={r.value}
                  checked={rating === r.value}
                  onChange={() => setRating(r.value)}
                />
                {r.stars > 0 && (
                  <span className="rating-stars" aria-hidden="true">
                    {"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}
                  </span>
                )}
                <span>{r.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="filter-group" style={{ borderBottom: "none", marginBottom: 0, paddingBottom: 0 }}>
          <p className="filter-group-title">Sort by</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ ...inputStyle, marginTop: 6 }}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Highest rated</option>
          </select>
        </div>

        {/* Apply button */}
        <button
          onClick={applyFilters}
          className="btn-primary"
          style={{ width: "100%", marginTop: "1.25rem", border: "none" }}
        >
          Apply filters
        </button>

      </div>
    </aside>
  );
}