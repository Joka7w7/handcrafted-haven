// src/middleware.ts
// Edge-compatible — does NOT import Prisma or auth.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /seller routes
  if (!pathname.startsWith("/seller")) {
    return NextResponse.next();
  }

  // NextAuth uses different cookie names depending on environment:
  // - Development (HTTP):  next-auth.session-token
  // - Production (HTTPS):  __Secure-next-auth.session-token
  const sessionToken =
    request.cookies.get("__Secure-next-auth.session-token")?.value ??
    request.cookies.get("next-auth.session-token")?.value;

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