// src/components/NavAuthButtons.tsx

"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function NavAuthButtons() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  // Still loading session — show nothing to avoid flash
  if (status === "loading") return null;

  // Not logged in — show Login + Sign up
  if (!session?.user) {
    return (
      <>
        <a href="/login"  className="btn-outline">Log in</a>
        <a href="/signup" className="btn-primary">Sign up</a>
      </>
    );
  }

  // Logged in — show first name with dropdown
  const firstName = session.user.name?.split(" ")[0] ?? "Account";
  const initials  = session.user.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setMenuOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={menuOpen}
        aria-label={`Account menu for ${firstName}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "1.5px solid var(--border)",
          borderRadius: "50px",
          padding: "5px 12px 5px 6px",
          cursor: "pointer",
          transition: "border-color 0.2s",
        }}
      >
        {/* Avatar circle */}
        <div
          aria-hidden="true"
          style={{
            width: 28, height: 28,
            borderRadius: "50%",
            background: "var(--brown-deep)",
            color: "var(--cream)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.7rem",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {session.user.image
            ? <img src={session.user.image} alt="" width={28} height={28} style={{ borderRadius: "50%", objectFit: "cover" }} />
            : initials
          }
        </div>
        <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--brown-deep)" }}>
          {firstName}
        </span>
        {/* Chevron */}
        <svg
          width="12" height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
          style={{
            color: "var(--text-light)",
            transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 49 }}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            role="menu"
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              minWidth: 180,
              background: "var(--white)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              boxShadow: "0 8px 24px rgba(92,61,46,0.12)",
              zIndex: 50,
              overflow: "hidden",
            }}
          >
            {/* User info header */}
            <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", margin: 0 }}>
                {session.user.name}
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-light)", margin: 0 }}>
                {session.user.email}
              </p>
            </div>

            {/* Menu items */}
            {[
              { label: "My orders",        href: "/cart"           },
              { label: "Seller dashboard", href: "/seller/dashboard" },
              { label: "Settings",         href: "/settings"         },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "0.65rem 1rem",
                  fontSize: "0.88rem",
                  color: "var(--text-dark)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {item.label}
              </a>
            ))}

            <div style={{ borderTop: "1px solid var(--border)" }}>
              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.65rem 1rem",
                  fontSize: "0.88rem",
                  color: "#993C1D",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAECE7")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}