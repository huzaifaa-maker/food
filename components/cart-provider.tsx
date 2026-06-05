"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine, MenuItem } from "@/lib/types";

type CartContextValue = {
  lines: CartLine[];
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "zaiqa-junction-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        setLines(JSON.parse(saved) as CartLine[]);
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

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      addItem: (item) => {
        setLines((current) => {
          const existing = current.find((line) => line.menuItemId === item.id);
          if (existing) {
            return current.map((line) =>
              line.menuItemId === item.id ? { ...line, quantity: line.quantity + 1 } : line
            );
          }

          return [
            ...current,
            {
              menuItemId: item.id,
              name: item.name,
              price: item.price,
              quantity: 1
            }
          ];
        });
      },
      removeItem: (id) => {
        setLines((current) => current.filter((line) => line.menuItemId !== id));
      },
      setQuantity: (id, quantity) => {
        setLines((current) =>
          current
            .map((line) => (line.menuItemId === id ? { ...line, quantity: Math.max(0, quantity) } : line))
            .filter((line) => line.quantity > 0)
        );
      },
      clearCart: () => setLines([]),
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
    }),
    [lines]
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
