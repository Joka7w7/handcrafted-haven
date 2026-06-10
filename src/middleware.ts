// src/middleware.ts
// Edge-compatible middleware — does NOT import Prisma or auth.ts
// Uses NextAuth's built-in JWT cookie check instead

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /seller routes
  if (!pathname.startsWith("/seller")) {
    return NextResponse.next();
  }

  // NextAuth stores the session token in one of these cookies
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ??
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/seller/:path*"],
};