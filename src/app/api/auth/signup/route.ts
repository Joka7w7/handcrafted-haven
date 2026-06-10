// src/app/api/auth/signup/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, role } = body;

    // Validate required fields
    if (!email || !password || !firstName) {
      return NextResponse.json(
        { error: "First name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name:     `${firstName} ${lastName ?? ""}`.trim(),
        email,
        password: hashed,
        role:     role ?? "buyer",
      },
    });

    // Create seller profile if role is seller
    if (role === "seller") {
      await prisma.sellerProfile.create({
        data: { userId: user.id, shopName: "" },
      });
    }

    return NextResponse.json(
      { success: true, userId: user.id },
      { status: 201 }
    );

  } catch (err: any) {
    // Log the real error in terminal so you can see it
    console.error("[signup error]", err?.message ?? err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}