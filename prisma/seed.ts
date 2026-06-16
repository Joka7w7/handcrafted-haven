// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

// Use local SQLite for seeding locally
const adapter = new PrismaLibSql({
  url: "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  const password = await bcrypt.hash("password123", 12);

  // ── Sellers ──────────────────────────────────────────

  const maria = await prisma.user.upsert({
    where:  { email: "maria@handcraftedhaven.com" },
    update: {},
    create: {
      name:     "Maria Santos",
      email:    "maria@handcraftedhaven.com",
      password,
      role:     "seller",
      image:    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
      seller: {
        create: {
          shopName: "Maria's Studio",
          bio:      "Hand-throwing pottery for over 12 years using locally sourced clay and natural glazes.",
          craft:    "Pottery",
          location: "Antigua, Guatemala",
        },
      },
    },
  });

  const luna = await prisma.user.upsert({
    where:  { email: "luna@handcraftedhaven.com" },
    update: {},
    create: {
      name:     "Luna Park",
      email:    "luna@handcraftedhaven.com",
      password,
      role:     "seller",
      image:    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      seller: {
        create: {
          shopName: "Luna Jewelry",
          bio:      "Sterling silver and semi-precious stone jewelry inspired by organic shapes in nature.",
          craft:    "Jewelry",
          location: "Seoul, South Korea",
        },
      },
    },
  });

  const james = await prisma.user.upsert({
    where:  { email: "james@handcraftedhaven.com" },
    update: {},
    create: {
      name:     "James Oak",
      email:    "james@handcraftedhaven.com",
      password,
      role:     "seller",
      image:    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      seller: {
        create: {
          shopName: "Oak & Grain",
          bio:      "Furniture maker focused on reclaimed and sustainably sourced wood.",
          craft:    "Woodwork",
          location: "Portland, Oregon",
        },
      },
    },
  });

  const anya = await prisma.user.upsert({
    where:  { email: "anya@handcraftedhaven.com" },
    update: {},
    create: {
      name:     "Anya Weaver",
      email:    "anya@handcraftedhaven.com",
      password,
      role:     "seller",
      image:    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      seller: {
        create: {
          shopName: "Woven Stories",
          bio:      "Traditional weaver using a backstrap loom passed down through four generations.",
          craft:    "Textiles",
          location: "Oaxaca, Mexico",
        },
      },
    },
  });

  const calm = await prisma.user.upsert({
    where:  { email: "calm@handcraftedhaven.com" },
    update: {},
    create: {
      name:     "Calm Craft",
      email:    "calm@handcraftedhaven.com",
      password,
      role:     "seller",
      image:    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
      seller: {
        create: {
          shopName: "Calm & Craft",
          bio:      "Small-batch soy candle maker using botanicals and essential oils.",
          craft:    "Candles",
          location: "Austin, Texas",
        },
      },
    },
  });

  console.log("✅ Sellers created");

  // ── Delete existing seeded products ──────────────────

  await prisma.product.deleteMany({
    where: {
      sellerId: { in: [maria.id, luna.id, james.id, anya.id, calm.id] },
    },
  });

  // ── Products with real images ─────────────────────────

  await prisma.product.createMany({
    data: [
      {
        sellerId:    maria.id,
        name:        "Hand-thrown Terracotta Bowl",
        description: "Each bowl is hand-thrown on a kick wheel using locally sourced terracotta clay. The warm, earthy glaze is applied by hand, giving every piece a unique character. Oven-safe and food-safe.",
        price:       48.00,
        category:    "Pottery",
        stock:       12,
        status:      "active",
        image:       "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=600&fit=crop",
      },
      {
        sellerId:    maria.id,
        name:        "Speckled Glaze Mug Set (set of 2)",
        description: "A set of two hand-thrown mugs with a speckled reactive glaze that creates a unique pattern on each piece. Holds 12oz, microwave and dishwasher safe.",
        price:       55.00,
        category:    "Pottery",
        stock:       8,
        status:      "active",
        image:       "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop",
      },
      {
        sellerId:    maria.id,
        name:        "Handmade Ceramic Vase",
        description: "A sculptural vase with a smooth matte finish and subtle texture. Perfect for dried or fresh flowers. Each piece is unique due to the hand-building technique.",
        price:       72.00,
        category:    "Pottery",
        stock:       5,
        status:      "active",
        image:       "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop",
      },
      {
        sellerId:    luna.id,
        name:        "Sterling Silver Leaf Pendant",
        description: "Handcrafted sterling silver pendant shaped like a delicate leaf. Each piece is individually hammered and polished for a subtle organic texture. Comes on an 18-inch chain.",
        price:       72.00,
        category:    "Jewelry",
        stock:       15,
        status:      "active",
        image:       "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop",
      },
      {
        sellerId:    luna.id,
        name:        "Amethyst Drop Earrings",
        description: "Elegant drop earrings featuring genuine amethyst stones set in sterling silver. Ethically sourced stones that vary slightly in color, making each pair unique.",
        price:       89.00,
        category:    "Jewelry",
        stock:       10,
        status:      "active",
        image:       "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
      },
      {
        sellerId:    james.id,
        name:        "Reclaimed Oak Serving Board",
        description: "Handcrafted from reclaimed oak with a food-safe mineral oil finish. Each board has a unique grain pattern from the wood's previous life. Measures approximately 14x8 inches.",
        price:       64.00,
        category:    "Woodwork",
        stock:       7,
        status:      "active",
        image:       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
      },
      {
        sellerId:    james.id,
        name:        "Hand-carved Wooden Spoon Set",
        description: "A set of three kitchen spoons carved from sustainably harvested cherry wood. Smooth food-safe finish. Perfect for cooking or as a decorative kitchen piece.",
        price:       38.00,
        category:    "Woodwork",
        stock:       20,
        status:      "active",
        image:       "https://images.unsplash.com/photo-1612965110667-4175024b0f3b?w=600&h=600&fit=crop",
      },
      {
        sellerId:    anya.id,
        name:        "Hand-woven Merino Throw",
        description: "A luxuriously soft throw woven from 100% merino wool on a traditional floor loom. Natural dyes give each throw a unique earthy palette. Measures 50x60 inches.",
        price:       125.00,
        category:    "Textiles",
        stock:       8,
        status:      "active",
        image:       "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&h=600&fit=crop",
      },
      {
        sellerId:    anya.id,
        name:        "Macramé Wall Hanging",
        description: "Handcrafted macramé wall hanging made from natural cotton rope. Each piece is knotted by hand and features a unique geometric pattern. Measures 24x36 inches.",
        price:       85.00,
        category:    "Textiles",
        stock:       6,
        status:      "active",
        image:       "https://images.unsplash.com/photo-1604518761493-7a3d924e1b6b?w=600&h=600&fit=crop",
      },
      {
        sellerId:    calm.id,
        name:        "Soy Lavender Pillar Candle",
        description: "Hand-poured soy wax candle scented with real dried lavender. Burns cleanly for up to 40 hours. Free from synthetic fragrances and dyes.",
        price:       28.00,
        category:    "Candles",
        stock:       30,
        status:      "active",
        image:       "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop",
      },
      {
        sellerId:    calm.id,
        name:        "Beeswax Taper Candles (pair)",
        description: "A pair of hand-dipped pure beeswax taper candles. Natural honey scent, burns 8 hours each. Approximately 10 inches tall.",
        price:       22.00,
        category:    "Candles",
        stock:       25,
        status:      "active",
        image:       "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=600&h=600&fit=crop",
      },
    ],
  });

  console.log("✅ Products created with real images");
  console.log("🎉 Seed complete!");
  console.log("\nTest seller logins (password: password123):");
  console.log("  maria@handcraftedhaven.com");
  console.log("  luna@handcraftedhaven.com");
  console.log("  james@handcraftedhaven.com");
  console.log("  anya@handcraftedhaven.com");
  console.log("  calm@handcraftedhaven.com");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });