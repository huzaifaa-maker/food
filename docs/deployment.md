# Deployment Instructions

## 1. Supabase

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Copy the project URL, anon key, and service role key.
5. Add the values to `.env.local` for local development and to your hosting provider for production.

## 2. Google Business Profile

1. Create or claim the Google Business Profile for Zaiqa Junction.
2. Add the same phone number and business hours used on the site.
3. Add delivery area/service-area settings.
4. Add the website URL after deployment.
5. Add the profile URL to `NEXT_PUBLIC_GOOGLE_BUSINESS_URL`.

## 3. Foodpanda

Set `NEXT_PUBLIC_FOODPANDA_URL` to the live Foodpanda restaurant link. Keep it as a fallback CTA while pushing direct ordering as the primary path.

## 4. WhatsApp

Set `NEXT_PUBLIC_WHATSAPP_PHONE` in international format without `+`, for example:

```bash
NEXT_PUBLIC_WHATSAPP_PHONE=923176802585
```

## 5. Vercel Deployment

```bash
npm install
npm run build
```

Deploy to Vercel, then add all environment variables in Project Settings.

## 6. Launch Checklist

- Replace demo delivery zones with exact local areas.
- Replace Google Maps embed with the real business location/service area.
- Replace Foodpanda placeholder URL with the real store link.
- Add Supabase Auth protection for `/admin`.
- Run Lighthouse on mobile and keep image sizes compressed.
- Submit `/sitemap.xml` to Google Search Console.
