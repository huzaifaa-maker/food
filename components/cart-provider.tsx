"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { addonSignature, unitPriceWithAddons } from "@/lib/add-ons";
import type { CartAddon, CartLine, MenuItem } from "@/lib/types";

export type AddToCartPayload = {
  quantity: number;
  addons: CartAddon[];
  comment: string;
};

type CartToast = {
  message: string;
  key: number;
};

type CartContextValue = {
  lines: CartLine[];
  addToCart: (item: MenuItem, payload: AddToCartPayload) => void;
  removeLine: (lineId: string) => void;
  setLineQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  toast: CartToast | null;
  dismissToast: () => void;
  cartPulse: boolean;
  customizerItem: MenuItem | null;
  openCustomizer: (item: MenuItem) => void;
  closeCustomizer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "zaiqa-junction-cart-v2";

function createLineId() {
  return `line-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildDisplayName(itemName: string, addons: CartAddon[]) {
  if (!addons.length) return itemName;
  return `${itemName} (+ ${addons.map((addon) => addon.label).join(", ")})`;
}

function isSameConfiguration(
  line: CartLine,
  item: MenuItem,
  payload: AddToCartPayload
) {
  return (
    line.menuItemId === item.id &&
    line.comment?.trim() === payload.comment.trim() &&
    addonSignature(line.addons) === addonSignature(payload.addons)
  );
}

function migrateLegacyLine(raw: Partial<CartLine> & { menuItemId: string }): CartLine {
  const basePrice = raw.basePrice ?? raw.price ?? 0;
  const addons = raw.addons ?? [];
  const price = raw.price ?? unitPriceWithAddons(basePrice, addons);

  return {
    lineId: raw.lineId ?? createLineId(),
    menuItemId: raw.menuItemId,
    name: raw.name ?? "Menu item",
    basePrice,
    price,
    quantity: raw.quantity ?? 1,
    addons,
    comment: raw.comment
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState<CartToast | null>(null);
  const [cartPulse, setCartPulse] = useState(false);
  const [customizerItem, setCustomizerItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Array<Partial<CartLine> & { menuItemId: string }>;
        setLines(parsed.map(migrateLegacyLine));
      }
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem(storageKey, JSON.stringify(lines));
    }
  }, [lines, loaded]);

  const dismissToast = useCallback(() => setToast(null), []);

  const showToast = useCallback((message: string) => {
    setToast({ message, key: Date.now() });
    setCartPulse(true);
    window.setTimeout(() => setCartPulse(false), 650);
  }, []);

  const addToCart = useCallback(
    (item: MenuItem, payload: AddToCartPayload) => {
      const quantity = Math.max(1, Math.min(20, payload.quantity));
      const unitPrice = unitPriceWithAddons(item.price, payload.addons);
      const displayName = buildDisplayName(item.name, payload.addons);

      setLines((current) => {
        const existing = current.find((line) => isSameConfiguration(line, item, payload));

        if (existing) {
          return current.map((line) =>
            line.lineId === existing.lineId ? { ...line, quantity: line.quantity + quantity } : line
          );
        }

        return [
          ...current,
          {
            lineId: createLineId(),
            menuItemId: item.id,
            name: displayName,
            basePrice: item.price,
            price: unitPrice,
            quantity,
            addons: payload.addons,
            comment: payload.comment.trim() || undefined
          }
        ];
      });

      showToast(`${quantity}× ${displayName} added to cart`);
      setCustomizerItem(null);
    },
    [showToast]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      addToCart,
      removeLine: (lineId) => {
        setLines((current) => current.filter((line) => line.lineId !== lineId));
      },
      setLineQuantity: (lineId, quantity) => {
        setLines((current) =>
          current
            .map((line) => (line.lineId === lineId ? { ...line, quantity: Math.max(0, quantity) } : line))
            .filter((line) => line.quantity > 0)
        );
      },
      clearCart: () => setLines([]),
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
      toast,
      dismissToast,
      cartPulse,
      customizerItem,
      openCustomizer: setCustomizerItem,
      closeCustomizer: () => setCustomizerItem(null)
    }),
    [lines, addToCart, toast, dismissToast, cartPulse, customizerItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return value;
}
