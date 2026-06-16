// src/app/layout.tsx

import type { Metadata } from "next";
import { Providers }  from "./providers";
import { Navbar }     from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL ?? "https://handcrafted-haven.vercel.app"
  ),
  title: {
    default:  "Handcrafted Haven — Unique Artisan Goods",
    template: "%s — Handcrafted Haven",
  },
  description:
    "Discover and shop unique handcrafted goods from talented artisans worldwide. Support local makers and find one-of-a-kind treasures.",
  keywords: ["handcrafted", "artisan", "handmade", "marketplace", "crafts", "unique gifts"],
  authors:  [{ name: "Handcrafted Haven" }],

  // Open Graph — controls how links look when shared on social media
  openGraph: {
    type:        "website",
    siteName:    "Handcrafted Haven",
    title:       "Handcrafted Haven — Unique Artisan Goods",
    description: "Discover and shop unique handcrafted goods from talented artisans worldwide.",
    locale:      "en_US",
  },

  // Twitter card
  twitter: {
    card:        "summary_large_image",
    title:       "Handcrafted Haven — Unique Artisan Goods",
    description: "Discover and shop unique handcrafted goods from talented artisans worldwide.",
  },

  // Robots
  robots: {
    index:  true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // data-scroll-behavior fixes the Next.js scroll-behavior warning
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers>
          {/* Skip to main content — accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Navbar />
          <div id="main-content">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}