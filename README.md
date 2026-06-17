# W07 Group Project: Completion
**Handcrafted Haven — Final Submission**
 
---
 
## Student
Jose Chanax
 
---
 
## Submission URLs
 
| Requirement | URL |
|---|---|
| **Application (Vercel)** | https://handcrafted-haven.vercel.app |
| **GitHub Repository** | https://github.com/Joka7w7/Handcrafted-Haven |
| **GitHub Project Board** | https://github.com/Joka7w7/Handcrafted-Haven/projects |
| **Demonstration Video** | *(paste your video URL here after recording)* |
 
---
 
## Project Overview
 
Handcrafted Haven is a full-stack marketplace web application connecting artisans with customers who appreciate unique handcrafted goods. Built with Next.js, TypeScript, Prisma, and Turso (hosted SQLite), deployed on Vercel.
 
---
 
## Functionality Delivered
 
### Seller Profiles
- Authenticated sellers have dedicated public profile pages at `/sellers/[id]`
- Profiles display the artisan's name, craft specialty, bio, location, join date, and sales stats
- Each profile shows a curated grid of the seller's active product listings
### Product Listings
- Sellers can create new product listings via `/seller/products/new` with title, description, price, category, stock quantity, image URL, and active/draft status
- Products are saved to the Turso hosted database via a REST API route
- The seller dashboard at `/seller/dashboard` displays all listings with live stats (active count, total products)
### Product Catalog & Filtering
- Public shop page at `/shop` displays all active products from the database with real product images
- Filters by category (checkbox), price range (min/max inputs), and minimum rating
- Sort options: Newest, Price low→high, Price high→low, Highest rated
- URL-based filter state — filters are shareable and bookmarkable
- Empty state with "Clear filters" when no results match
### Reviews & Ratings
- Review data model in the database (Product → Review → User)
- Star rating display on product cards and product detail pages
- Average rating calculated from real review records
### Search
- Global search bar in the navbar navigates to `/search?q=query`
- Results page shows matching products and artisans by keyword
- Matches against product name, seller name, and category
### Authentication
- Email/password signup and login via NextAuth.js (Auth.js v5)
- Google OAuth login
- Session-aware navbar — shows user's first name and avatar when logged in, with a dropdown for dashboard, orders, and sign out
- Protected seller routes via Edge-compatible middleware
### Shopping Cart
- Persistent cart using React Context + localStorage
- Slide-in cart drawer accessible from the navbar
- Full cart page at `/cart` with quantity controls, remove, order summary, shipping threshold
- Order confirmation page at `/checkout/confirmation` that clears the cart
---
 
## Technology Stack
 
| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React, TypeScript |
| Styling | Custom CSS with design system (CSS variables) |
| Backend | Next.js API Routes, Node.js |
| Database | Turso (hosted libSQL/SQLite) via Prisma ORM v7 |
| Auth | NextAuth.js v5 (Auth.js) — credentials + Google OAuth |
| Deployment | Vercel |
| Version Control | Git + GitHub |
| Project Management | GitHub Projects (Kanban board) |
 
---
 
## Design & Standards
 
- **Responsive:** Mobile-first design with breakpoints at 480px, 768px, and 1024px
- **Accessibility:** WCAG 2.1 AA — skip-to-content link, `:focus-visible` outlines, ARIA labels, minimum 44×44px touch targets, `prefers-reduced-motion` support
- **SEO:** Global Open Graph metadata, Twitter card tags, title templates, robots meta, `metadataBase` configured for Vercel
- **Branding:** Consistent "Artisan Warmth" design system — earthy browns (#5C3D2E), terracotta (#E8B89A), cream (#F5ECD7), Playfair Display headings + Lato body text
---