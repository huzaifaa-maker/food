import type { MenuItem } from "@/lib/types";

const imageById: Record<string, string> = {
  // Handi / Karahi
  "velvety-shahi-handi": "/images/menu/shahi-handi-clean.webp",
  "royal-gola-kabab-half": "/images/menu/gola-kabab-clean.webp",

  // Burgers / wraps
  "eco-crunch-patty-burger": "/images/menu/eco-crunch.webp",
  "zinger-booster": "/images/menu/zinger-burger.webp",
  "zaiqa-double-decker": "/images/menu/double-decker.webp",
  "zaiqa-chapligar": "/images/menu/burger-plate.webp",
  "zaiqa-chapligar-twin-tower": "/images/menu/burger-plate.webp",
  "zaiqa-wrap": "/images/menu/wrap.webp",
  "king-crunch-wrap": "/images/menu/wrap.webp",

  // Fries
  "salty-plain-fries-half": "/images/menu/salty-plain-fries.webp",
  "salty-plain-fries-full": "/images/menu/salty-plain-fries.webp",
  "golden-hot-masala-fries-half": "/images/menu/masala-fries.webp",
  "golden-hot-masala-fries-full": "/images/menu/masala-fries.webp",
  "legend-loaded-fries-half": "/images/menu/loaded-fries.webp",
  "legend-loaded-fries-full": "/images/menu/loaded-fries.webp",

  // Pasta (currently still duplicated in data; keep pasta mapping explicit)
  "creamy-silky-pasta-half": "/images/menu/burger-plate.webp",
  "creamy-silky-pasta-full": "/images/menu/burger-plate.webp",
  "creamy-spicy-pasta-half": "/images/menu/burger-plate.webp",
  "creamy-spicy-pasta-full": "/images/menu/burger-plate.webp",

  // Nuggets
  "injected-nuggets-3pc": "/images/menu/nuggets.webp",
  "injected-nuggets-6pc": "/images/menu/nuggets.webp",
  "injected-nuggets-12pc": "/images/menu/nuggets.webp",
  "tempura-nuggets-4pc": "/images/menu/nuggets.webp",
  "tempura-nuggets-8pc": "/images/menu/nuggets.webp",
  "tempura-nuggets-12pc": "/images/menu/nuggets.webp",

  // Strips
  "crispy-chicken-strips-4pc": "/images/menu/chicken-strips.webp",
  "crispy-chicken-strips-8pc": "/images/menu/chicken-strips.webp",

  // Wings
  "masala-wings": "/images/menu/baked-wings.webp",
  "plain-baked-wings": "/images/menu/baked-wings.webp",

  // Chunky chicken
  "chunky-chicken-12pc": "/images/menu/chunky-chicken.webp",

  // Deals (temporary mapping until composite deal images are provided)
  "solo-handi-deal": "/images/menu/shahi-handi-clean.webp",
  "solo-zinger-deal": "/images/menu/zinger-burger.webp",
  "happy-family-deal": "/images/menu/shahi-handi-clean.webp",
  "buddy-deal": "/images/menu/zinger-burger.webp",
  "midnight-sharing-deal": "/images/menu/wrap.webp",
  "couple-deal": "/images/menu/nuggets.webp",

  // Naan / drinks
  "milky-naan": "/images/menu/milky-naan.webp",
  "drink-350ml": "/images/menu/elaichi-chai.webp",
  "zaiqa-doodh-patti": "/images/menu/elaichi-chai.webp",
  "cardamom-tea": "/images/menu/elaichi-chai.webp",
  "zaiqa-tea": "/images/menu/elaichi-chai.webp",
  "ginger-tea": "/images/menu/elaichi-chai.webp"
};


const blockedFoodImages = new Set([
  "/images/whatsapp/zaiqa-03.jpg",
  "/images/whatsapp/zaiqa-17.jpg",
  "/images/whatsapp/zaiqa-20.jpg",
  "/images/hero-burger-mobile.webp",
  "/images/hero-burger-poster.webp"
]);

export function resolveMenuImage(item: Pick<MenuItem, "id" | "image">) {
  if (item.id && imageById[item.id]) return imageById[item.id];
  if (blockedFoodImages.has(item.image)) return "/images/menu/zinger-burger.webp";
  return item.image;
}


export function resolveSafeFoodImage(src?: string, fallback = "/images/menu/shahi-handi-clean.webp") {
  if (!src || blockedFoodImages.has(src)) return fallback;
  return src;
}

export const galleryImages = [
  { src: "/images/menu/zinger-burger.webp", alt: "Zinger Booster burger" },
  { src: "/images/menu/shahi-handi-clean.webp", alt: "Velvety Shahi Handi" },
  { src: "/images/menu/loaded-fries.webp", alt: "Legend loaded fries" },
  { src: "/images/menu/double-decker.webp", alt: "Zaiqa Double Decker" },
  { src: "/images/menu/baked-wings.webp", alt: "Zaiqa baked wings" },
  { src: "/images/menu/elaichi-chai.webp", alt: "Elaichi chai" }
];
