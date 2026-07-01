import type { MenuItem } from "@/lib/types";

const categoryFallbackImages: Record<string, string> = {
  "handi-karahi": "/images/menu/shahi-handi-clean.webp",
  "chapli-burger": "/images/menu/burger-plate.webp",
  zinger: "/images/menu/zinger-burger.webp",
  wraps: "/images/menu/zaiqa-wrap.jpg",
  appetizers: "/images/menu/loaded-fries.webp",
  "golden-nuggets": "/images/whatsapp/zaiqa-09.jpg",
  "chunky-chicken": "/images/whatsapp/zaiqa-12.jpg",
  wings: "/images/menu/masala-wings.jpg",
  deals: "/images/menu/deal-happy-family.jpg",
  "breads-drinks": "/images/menu/milky-naan.webp",
  tea: "/images/whatsapp/zaiqa-04.jpg"
};

const blockedFoodImages = new Set([
  "/images/whatsapp/zaiqa-03.jpg",
  "/images/whatsapp/zaiqa-17.jpg",
  "/images/whatsapp/zaiqa-20.jpg",
  "/images/hero-burger-mobile.webp",
  "/images/hero-burger-poster.webp"
]);

export function resolveMenuImage(item: Pick<MenuItem, "categoryId" | "image">) {
  if (item.image && !blockedFoodImages.has(item.image)) {
    return item.image;
  }

  return categoryFallbackImages[item.categoryId] ?? "/images/menu/zinger-burger.webp";
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
