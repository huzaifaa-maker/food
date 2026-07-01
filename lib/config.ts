export const business = {
  name: "Zaiqa Junction",
  placeName: "Zaiqa Junction With Zahra's",
  tagline: "Fast food and homemade Pakistani comfort food, delivered fresh in Multan",
  phoneDisplay: "03026665620",
  whatsappPhone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "923026665620",
  email: "Umarfarooq5674@gmail.com",
  foodpandaUrl: process.env.NEXT_PUBLIC_FOODPANDA_URL ?? "https://www.foodpanda.pk/",
  googleBusinessUrl:
    process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL ?? "https://maps.app.goo.gl/7ood2oRprG9Znf5r9?g_st=aw",
  mapsEmbedUrl:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ??
    "https://www.google.com/maps?q=Zaiqa+Junction+With+Zahra%27s,+6H32%2B5Q,+Shah+Rukn+E+Alam+Town,+Multan&output=embed",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zaiqa-junction.vercel.app",
  hours: "12:00 PM - 2:00 AM",
  currency: "Rs.",
  kitchenArea: "6H32+5Q, Shah Rukn E Alam Town, Multan",
  streetAddress: "Shah Shams, Shah Rukn-e-Alam Town, Multan",
  addressLocality: "Multan",
  addressRegion: "Punjab",
  addressCountry: "PK",
  social: {
    facebook: "https://www.facebook.com/share/1CgKaund7B/",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/zaiqajunction/",
    tiktok: "https://www.tiktok.com/@zaiqajunction7?_r=1&_t=ZS-97NYbWqTR04",
    youtube: "https://www.youtube.com/@ZaiqaJunction01"
  },
  logoThumb: "/images/brand/logo-mark.svg",
  logoHorizontal: "/images/brand/logo-horizontal.svg",
  logoMain: "/images/brand/logo-main.svg",
  logoMono: "/images/brand/logo-mono.svg",
  logoSocial: "/images/brand/logo-social.svg"
};

export const chef = {
  name: "Zahra",
  title: "Founder & Kitchen Lead",
  bio: "Zahra runs Zaiqa Junction With Zahra's from Shah Rukn E Alam Town, Multan, preparing burgers, handis, wraps, sides, and chai with fresh ingredients and careful packing.",
  image: "/images/menu/kitchen.webp",
  yearsExperience: 8,
  highlights: [
    "Fast food favorites with a homemade kitchen touch",
    "Fresh small-batch prep for direct orders",
    "Careful packing before every delivery or pickup"
  ]
};
