// src/app/(auth)/signup/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Metadata } from "next";

export default function SignupPage() {
  const router = useRouter();
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      firstName: form.get("firstName"),
      lastName:  form.get("lastName"),
      email:     form.get("email"),
      password:  form.get("password"),
      role:      form.get("role"),
    };

    try {
      const res = await fetch("/api/auth/signup", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      // Signup succeeded — redirect to login
      router.push("/login?signup=success");

    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">🧶</div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Join thousands of artisans and buyers</p>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            style={{
              background: "#FAECE7",
              color: "#4A1B0C",
              border: "1px solid #F0997B",
              borderRadius: "6px",
              padding: "0.65rem 0.85rem",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-row-half">
            <div className="field">
              <label htmlFor="firstName">First name</label>
              <input id="firstName" type="text" name="firstName" placeholder="Jose" required autoComplete="given-name" />
            </div>
            <div className="field">
              <label htmlFor="lastName">Last name</label>
              <input id="lastName" type="text" name="lastName" placeholder="Chanax" autoComplete="family-name" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" name="email" placeholder="you@example.com" required autoComplete="email" />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" placeholder="At least 8 characters" required minLength={8} autoComplete="new-password" />
          </div>

          <div className="field">
            <div className="field-label-row">
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-dark)" }}>Account type</span>
              <span className="field-hint">You can also sell later from settings</span>
            </div>
            <div className="role-grid">
              <label className="role-card">
                <input type="radio" name="role" value="buyer" defaultChecked />
                <span className="role-icon">🛍️</span>
                <span className="role-name">Buyer</span>
                <span className="role-desc">Browse & purchase</span>
              </label>
              <label className="role-card">
                <input type="radio" name="role" value="seller" />
                <span className="role-icon">🏺</span>
                <span className="role-name">Seller</span>
                <span className="role-desc">Sell your crafts</span>
              </label>
            </div>
          </div>

          <div className="field">
            <label className="checkbox-label">
              <input type="checkbox" name="terms" required />
              <span>
                I agree to the <a href="/terms" className="link-accent">Terms of Service</a> and{" "}
                <a href="/privacy" className="link-accent">Privacy Policy</a>
              </span>
            </label>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <a href="/login" className="link-accent">Log in</a>
        </p>
      </div>
    </div>
  );
}