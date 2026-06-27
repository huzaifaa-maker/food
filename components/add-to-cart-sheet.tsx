"use client";

import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { getAddonsForItem, unitPriceWithAddons } from "@/lib/add-ons";
import { formatCurrency } from "@/lib/format";
import type { CartAddon } from "@/lib/types";

export function AddToCartSheet() {
  const { customizerItem, closeCustomizer, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<CartAddon[]>([]);
  const [comment, setComment] = useState("");

  const item = customizerItem;
  const availableAddons = useMemo(() => (item ? getAddonsForItem(item) : []), [item]);

  const options = (item as any)?.options ?? null;
  const hasOptions = Boolean(options?.length);

  const effectiveOptionPrice = useMemo(() => {
    if (!item) return 0;
    if (!hasOptions) return item.price;

    const selected = options!.find((opt: { id: string }) => opt.id === selectedOptionId) ?? options![0];
    return selected.price;
  }, [hasOptions, item, options, selectedOptionId]);

  const configuredAddons = selectedAddons;

  const unitPrice = item ? unitPriceWithAddons(effectiveOptionPrice, configuredAddons) : 0;
  const lineTotal = unitPrice * quantity;

  useEffect(() => {
    if (!item) return;
    setQuantity(1);
    setSelectedOptionId(options?.[0]?.id ?? null);
    setSelectedAddons([]);
    setComment("");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [item, options]);

  if (!item) return null;

  function toggleAddon(addon: CartAddon) {
    setSelectedAddons((current) => {
      const exists = current.some((entry) => entry.id === addon.id);
      if (exists) {
        return current.filter((entry) => entry.id !== addon.id);
      }
      return [...current, addon];
    });
  }

  function handleSubmit() {
    if (!item) return;
    addToCart(item, { quantity, addons: configuredAddons, comment });
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-to-cart-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/55 backdrop-blur-[2px]"
        onClick={closeCustomizer}
        aria-label="Close customization"
      />

      <div className="relative flex max-h-[min(92svh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-stone-200 bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.2)] sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ember">Customize order</p>
            <h2 id="add-to-cart-title" className="mt-1 truncate text-lg font-black text-charcoal">
              {item.name}
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              {hasOptions ? "Base starts at " : "Base "}
              {formatCurrency(hasOptions ? effectiveOptionPrice : item.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCustomizer}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-stone-200 text-charcoal"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {hasOptions ? (
            <div>
              <p className="text-sm font-black text-charcoal">Options</p>
              <p className="mt-1 text-xs text-stone-500">Select your preferred portion/size.</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(options as any[]).map((opt) => {
                  const active = opt.id === selectedOptionId;
                  return (
                    <button
                      key={String(opt.id)}
                      type="button"
                      onClick={() => setSelectedOptionId(String(opt.id))}
                      className={`min-h-14 rounded-xl border px-3 py-2 text-left transition active:scale-[0.99] ${
                        active
                          ? "border-ember bg-ember/8 ring-1 ring-ember/30"
                          : "border-stone-200 bg-white"
                      }`}
                    >
                      <span className="block text-sm font-black text-charcoal">{String(opt.label)}</span>
                      <span className="mt-0.5 block text-xs font-bold text-ember">{formatCurrency(Number(opt.price))}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div>
            <p className="text-sm font-black text-charcoal">Quantity</p>
            <div className="mt-2 inline-flex items-center rounded-xl border border-stone-200 bg-stone-50">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="grid h-12 w-12 place-items-center text-charcoal active:bg-stone-200"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                <Minus size={18} />
              </button>
              <span className="grid h-12 min-w-12 place-items-center border-x border-stone-200 text-lg font-black">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="grid h-12 w-12 place-items-center text-charcoal active:bg-stone-200"
                onClick={() => setQuantity((value) => Math.min(20, value + 1))}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {availableAddons.length > 0 ? (
            <div>
              <p className="text-sm font-black text-charcoal">Add-ons</p>
              <p className="mt-1 text-xs text-stone-500">Tap to add extras - price updates instantly.</p>
              <div className="mt-3 grid gap-2">
                {availableAddons.map((addon) => {
                  const active = selectedAddons.some((entry) => entry.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={`flex min-h-12 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition active:scale-[0.99] ${
                        active
                          ? "border-ember bg-ember/8 ring-1 ring-ember/30"
                          : "border-stone-200 bg-white hover:border-stone-300"
                      }`}
                    >
                      <span className="text-sm font-bold text-charcoal">{addon.label}</span>
                      <span className="shrink-0 text-sm font-black text-ember">+{formatCurrency(addon.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div>
            <label htmlFor="item-comment" className="text-sm font-black text-charcoal">
              Special instructions
            </label>
            <textarea
              id="item-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              maxLength={200}
              placeholder="e.g. less spicy, no onions, extra crispy..."
              className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none ring-ember focus:border-ember focus:ring-2"
            />
            <p className="mt-1 text-right text-[11px] text-stone-400">{comment.length}/200</p>
          </div>
        </div>

        <div className="border-t border-stone-100 bg-cream/60 px-5 py-4" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-bold text-stone-600">Line total</span>
            <span className="text-lg font-black text-charcoal">{formatCurrency(lineTotal)}</span>
          </div>
          <button type="button" onClick={handleSubmit} className="btn-primary w-full">
            Add {quantity} to cart · {formatCurrency(lineTotal)}
          </button>
        </div>
      </div>
    </div>
  );
}

