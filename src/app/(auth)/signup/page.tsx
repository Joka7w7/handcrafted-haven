// src/app/(auth)/signup/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account — Handcrafted Haven",
  description: "Join Handcrafted Haven to buy or sell unique handcrafted goods.",
};

export default function SignupPage() {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">🧶</div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Join thousands of artisans and buyers</p>

        <form className="auth-form" action="/api/auth/signup" method="POST">
          <div className="field-row-half">
            <div className="field">
              <label htmlFor="firstName">First name</label>
              <input id="firstName" type="text" name="firstName" placeholder="Jose" required autoComplete="given-name" />
            </div>
            <div className="field">
              <label htmlFor="lastName">Last name</label>
              <input id="lastName" type="text" name="lastName" placeholder="Chanax" required autoComplete="family-name" />
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
            <label className="field-label-row">
              Account type
              <span className="field-hint">You can also sell later from your settings</span>
            </label>
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
              <span>I agree to the <a href="/terms" className="link-accent">Terms of Service</a> and <a href="/privacy" className="link-accent">Privacy Policy</a></span>
            </label>
          </div>

          <button type="submit" className="btn-auth">Create account</button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <a href="/login" className="link-accent">Log in</a>
        </p>
      </div>
    </div>
  );
}