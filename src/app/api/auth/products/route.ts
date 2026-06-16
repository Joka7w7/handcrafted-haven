// src/app/api/products/route.ts

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, category, stock, image, status } = body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: "Name, description, price and category are required" },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: "Price must be greater than zero" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        sellerId:    session.user.id,
        name,
        description,
        price:       Number(price),
        category,
        stock:       Number(stock ?? 0),
        image:       image ?? null,
        status:      status ?? "active",
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });

  } catch (err: any) {
    console.error("[products POST]", err?.message ?? err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where:   { status: "active" },
      orderBy: { createdAt: "desc" },
      include: {
        seller: {
          select: { name: true, id: true },
        },
      },
    });
    return NextResponse.json({ products });
  } catch (err: any) {
    console.error("[products GET]", err?.message ?? err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}