# Zaiqa Junction Direct Ordering Website

Premium mobile-first food ordering website for a home-based food business currently selling through Foodpanda.

## What Is Included

- Next.js App Router frontend with mobile-first pages for Home, Menu, Order Online, About, Reviews, Contact, and Admin.
- Direct online ordering with cart, checkout, coupon logic, delivery fees, loyalty points, and WhatsApp confirmation.
- Foodpanda fallback CTA, WhatsApp ordering CTA, Google Maps embed, customer reviews, local SEO metadata, schema markup, sitemap, and robots.
- Supabase-ready backend API routes for menu items, orders, reviews, and delivery areas.
- Demo fallback data so the site works locally before Supabase credentials are added.
- Real WhatsApp food/menu assets copied into `public/images/whatsapp`.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_WHATSAPP_PHONE=923176802585
NEXT_PUBLIC_FOODPANDA_URL=https://www.foodpanda.pk/restaurant/your-store
NEXT_PUBLIC_GOOGLE_BUSINESS_URL=https://g.page/your-business
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=https://www.google.com/maps/embed?pb=...
```

## Production Notes

The admin screen currently runs as a functional dashboard surface. Before launch, connect Supabase Auth and restrict `/admin` and write API routes to authenticated admin users.
