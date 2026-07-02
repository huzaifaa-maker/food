"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/format";

export function CartSummary({ compact = false }: { compact?: boolean }) {
  const { lines, removeLine, setLineQuantity, subtotal } = useCart();

  if (!lines.length) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 bg-white p-6 text-center">
        <p className="font-bold text-charcoal">Your cart is empty.</p>
        <p className="mt-2 text-sm text-stone-600">Add a best seller from the menu to start a direct order.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-200 p-4">
        <h2 className="font-display text-2xl font-bold text-charcoal">Your Cart</h2>
      </div>
      <div className="divide-y divide-stone-100">
        {lines.map((line) => (
          <div key={line.lineId} className="grid grid-cols-[1fr_auto] gap-3 p-4">
            <div className="min-w-0">
              <p className="font-bold text-charcoal">{line.name}</p>
              <p className="mt-1 text-sm text-stone-600">{formatCurrency(line.price)} each</p>
              {line.addons.length > 0 ? (
                <ul className="mt-2 space-y-0.5 text-xs text-stone-500">
                  {line.addons.map((addon) => (
                    <li key={addon.id}>+ {addon.label} ({formatCurrency(addon.price)})</li>
                  ))}
                </ul>
              ) : null}
              {line.comment ? (
                <p className="mt-2 rounded-lg bg-stone-50 px-2.5 py-2 text-xs italic text-stone-600">
                  Note: {line.comment}
                </p>
              ) : null}
              <div className="mt-3 inline-flex items-center rounded-md border border-stone-200">
                <button
                  type="button"
                  aria-label={`Decrease ${line.name}`}
                  className="grid h-11 w-11 place-items-center text-charcoal active:bg-stone-100"
                  onClick={() => setLineQuantity(line.lineId, line.quantity - 1)}
                >
                  <Minus size={16} />
                </button>
                <span className="grid h-11 min-w-11 place-items-center border-x border-stone-200 text-sm font-bold">
                  {line.quantity}
                </span>
                <button
                  type="button"
                  aria-label={`Increase ${line.name}`}
                  className="grid h-11 w-11 place-items-center text-charcoal active:bg-stone-100"
                  onClick={() => setLineQuantity(line.lineId, line.quantity + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-chilli">{formatCurrency(line.price * line.quantity)}</p>
              <button
                type="button"
                aria-label={`Remove ${line.name}`}
                className="mt-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-stone-600 hover:text-chilli"
                onClick={() => removeLine(line.lineId)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {!compact ? (
        <div className="border-t border-stone-200 p-4">
          <div className="flex items-center justify-between text-lg font-black text-charcoal">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
