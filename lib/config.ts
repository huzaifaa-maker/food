export const business = {
  name: "Zaiqa Junction",
  tagline: "Homemade Pakistani comfort food, delivered fresh",
  phoneDisplay: "0317-6802585",
  whatsappPhone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "923176802585",
  foodpandaUrl: process.env.NEXT_PUBLIC_FOODPANDA_URL ?? "https://www.foodpanda.pk/",
  googleBusinessUrl:
    process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL ?? "https://www.google.com/search?q=Zaiqa+Junction",
  mapsEmbedUrl:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ??
    "https://www.google.com/maps?q=Zaiqa%20Junction&output=embed",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  hours: "6:00 PM - 1:00 AM",
  currency: "Rs."
};
