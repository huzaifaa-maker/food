import type { MenuItem } from "@/lib/types";

export type ItemAddon = {
  id: string;
  label: string;
  price: number;
  categories?: string[];
  itemIds?: string[];
};

export const itemAddons: ItemAddon[] = [
  { id: "extra-patty", label: "Extra chicken patty", price: 180, categories: ["burgers"] },
  { id: "cheese-slice", label: "Extra cheese slice", price: 80, categories: ["burgers", "wraps"] },
  { id: "extra-tomato", label: "Fresh tomato slice", price: 30, categories: ["burgers", "wraps"] },
  { id: "jalapenos", label: "Jalapenos", price: 50, categories: ["burgers", "wraps", "appetizers"] },
  { id: "buddy-drink", label: "Buddy cold drink", price: 99, categories: ["burgers", "wraps", "appetizers", "deals"] },
  { id: "extra-sauce", label: "Extra house sauce", price: 40, categories: ["burgers", "wraps", "appetizers"] },
  { id: "extra-fries", label: "Side masala fries", price: 199, categories: ["burgers", "wraps", "deals"] },
  { id: "extra-naan", label: "Extra milky naan", price: 60, categories: ["handi-karahi"] },
  { id: "extra-gravy", label: "Extra gravy portion", price: 150, categories: ["handi-karahi"] },
  { id: "elaichi-chai", label: "Add elaichi chai", price: 120, categories: ["breads-drinks", "deals", "burgers", "wraps", "handi-karahi"] }
];

export function getAddonsForItem(item: Pick<MenuItem, "id" | "categoryId">) {
  return itemAddons.filter(
    (addon) => addon.itemIds?.includes(item.id) || addon.categories?.includes(item.categoryId)
  );
}

export function addonSignature(addons: Array<{ id: string }>) {
  return addons
    .map((addon) => addon.id)
    .sort()
    .join(",");
}

export function unitPriceWithAddons(basePrice: number, addons: Array<{ price: number }>) {
  return basePrice + addons.reduce((sum, addon) => sum + addon.price, 0);
}
