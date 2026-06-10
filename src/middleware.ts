// src/middleware.ts
// Protects /seller/* routes — redirects unauthenticated users to /login

export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/seller/:path*"],
};