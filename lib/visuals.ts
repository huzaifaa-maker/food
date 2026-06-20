import type { MenuItem } from "@/lib/types";

const imageRules: Array<[RegExp, string]> = [
  [/eco crunch/i, "/images/menu/eco-crunch.webp"],
  [/zaiqa double decker|double decker/i, "/images/menu/double-decker.webp"],
  [/zinger booster|solo zinger|buddy deal/i, "/images/menu/zinger-burger.webp"],
  [/shahi|handi|karahi|solo handi|happy family/i, "/images/menu/shahi-handi-clean.webp"],
  [/gola|kabab/i, "/images/menu/gola-kabab-clean.webp"],
  [/wrap|midnight/i, "/images/menu/wrap.webp"],
  [/loaded/i, "/images/menu/loaded-fries.webp"],
  [/masala fries|golden hot/i, "/images/menu/masala-fries.webp"],
  [/chunky|chicken chunk/i, "/images/menu/chunky-chicken.webp"],
  [/nugget|strip|tempura|injected/i, "/images/menu/nuggets.webp"],
  [/wing|baked/i, "/images/menu/baked-wings.webp"],
  [/burger|chapligar|decker/i, "/images/menu/burger-plate.webp"],
  [/pasta|silky|spicy pasta|crunchy pasta/i, "/images/menu/burger-plate.webp"],
  [/naan/i, "/images/menu/milky-naan.webp"],
  [/chai|doodh patti|tea|ginger tea|cardamom tea/i, "/images/menu/elaichi-chai.webp"]
];

const blockedFoodImages = new Set([
  "/images/whatsapp/zaiqa-03.jpg",
  "/images/whatsapp/zaiqa-17.jpg",
  "/images/whatsapp/zaiqa-20.jpg",
  "/images/hero-burger-mobile.webp",
  "/images/hero-burger-poster.webp"
]);

export function resolveMenuImage(item: Pick<MenuItem, "name" | "image">) {
  const match = imageRules.find(([pattern]) => pattern.test(item.name));
  if (match) return match[1];
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
