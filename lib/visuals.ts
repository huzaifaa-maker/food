import type { MenuItem } from "@/lib/types";

const imageRules: Array<[RegExp, string]> = [
  [/eco crunch/i, "/images/menu/eco-crunch.webp"],
  [/zaiqa double decker|double decker/i, "/images/menu/double-decker.webp"],
  [/zinger booster|solo zinger|buddy deal/i, "/images/menu/zinger-burger.webp"],
  [/shahi|handi|karahi|solo handi|happy family/i, "/images/menu/shahi-handi.webp"],
  [/gola|kabab/i, "/images/menu/gola-kabab.webp"],
  [/burger/i, "/images/menu/burger-plate.webp"],
  [/wrap|midnight/i, "/images/menu/wrap.webp"],
  [/loaded/i, "/images/menu/loaded-fries.webp"],
  [/masala fries|fries/i, "/images/menu/masala-fries.webp"],
  [/chunky|chicken chunk/i, "/images/menu/chunky-chicken.webp"],
  [/nugget/i, "/images/menu/nuggets.webp"],
  [/naan/i, "/images/menu/milky-naan.webp"],
  [/chai/i, "/images/menu/elaichi-chai.webp"]
];

const blockedFoodImages = new Set([
  "/images/whatsapp/zaiqa-03.jpg",
  "/images/whatsapp/zaiqa-17.jpg",
  "/images/whatsapp/zaiqa-20.jpg"
]);

export function resolveMenuImage(item: Pick<MenuItem, "name" | "image">) {
  const match = imageRules.find(([pattern]) => pattern.test(item.name));
  if (match) return match[1];
  if (blockedFoodImages.has(item.image)) return "/images/menu/zinger-burger.webp";
  return item.image;
}

export function resolveSafeFoodImage(src?: string, fallback = "/images/menu/shahi-handi.webp") {
  if (!src || blockedFoodImages.has(src)) return fallback;
  return src;
}

export const galleryImages = [
  {
    src: "/images/menu/eco-crunch.webp",
    alt: "Crispy burger with fries on a plate"
  },
  {
    src: "/images/menu/zinger-burger.webp",
    alt: "Signature zinger burger with crisp chicken and sauce"
  },
  {
    src: "/images/menu/shahi-handi.webp",
    alt: "Fresh shahi handi served hot in a clay bowl"
  },
  {
    src: "/images/menu/loaded-fries.webp",
    alt: "Loaded fries with grilled chicken and warm cheese sauce"
  },
  {
    src: "/images/menu/wrap.webp",
    alt: "Crunchy chicken wrap basket with fries and drink"
  },
  {
    src: "/images/menu/chunky-chicken.webp",
    alt: "Crispy chicken chunks with house dipping sauce"
  },
  {
    src: "/images/menu/elaichi-chai.webp",
    alt: "Warm elaichi chai served in a cup"
  }
];
