// src/app/api/debug-session/route.ts
// TEMPORARY - delete this after debugging

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  
  const cookies = req.cookies.getAll().map((c) => ({
    name: c.name,
    hasValue: !!c.value,
    valueLength: c.value?.length ?? 0,
  }));

  return NextResponse.json({
    session: session ? {
      userId: session.user?.id,
      email:  session.user?.email,
      name:   session.user?.name,
    } : null,
    cookies,
    nodeEnv: process.env.NODE_ENV,
  });
}