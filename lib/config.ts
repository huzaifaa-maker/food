export const business = {
  name: "Zaiqa Junction",
  tagline: "Homemade Pakistani comfort food, delivered fresh in Multan",
  phoneDisplay: "0302-6665620",
  whatsappPhone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "923026665620",
  email: "Umarfarooq5674@gmail.com",
  foodpandaUrl: process.env.NEXT_PUBLIC_FOODPANDA_URL ?? "https://www.foodpanda.pk/",
  googleBusinessUrl:
    process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL ?? "https://maps.app.goo.gl/7ood2oRprG9Znf5r9?g_st=aw",
  mapsEmbedUrl:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ??
    "https://www.google.com/maps?q=Shah+Shams+Colony+Multan&output=embed",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  hours: "6:00 PM - 2:00 AM",
  currency: "Rs.",
  kitchenArea: "Shah Shams Colony, Multan",
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/"
  },
  logoThumb: "/images/brand/logo-mark.svg",
  logoHorizontal: "/images/brand/logo-horizontal.svg",
  logoMain: "/images/brand/logo-main.svg",
  logoMono: "/images/brand/logo-mono.svg",
  logoSocial: "/images/brand/logo-social.svg"
};

export const chef = {
  name: "Chef Umar Farooq",
  title: "Founder & Head Chef",
  bio: "Umar Farooq runs Zaiqa Junction from Shah Shams, Multan — serving the same handis, burgers, wraps, and chai he cooks for his own family, fresh and hygienic every evening.",
  image: "/images/menu/kitchen.webp",
  yearsExperience: 8,
  highlights: [
    "Family recipes refined over years of home cooking",
    "Small-batch prep in a dedicated home kitchen",
    "Personally checks packaging before every dispatch"
  ]
};
