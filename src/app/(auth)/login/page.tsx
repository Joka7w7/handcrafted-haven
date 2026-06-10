// src/app/(auth)/login/page.tsx

import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="auth-wrapper">
      <Suspense fallback={
        <div className="auth-card" style={{ textAlign: "center", padding: "3rem" }}>
          <div className="auth-logo">🧶</div>
          <p style={{ color: "var(--text-mid)" }}>Loading…</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}