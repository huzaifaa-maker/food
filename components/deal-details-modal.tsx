"use client";

import Image from "next/image";
import { X, Utensils, CheckCircle2, Clock, Flame } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { resolveMenuImage } from "@/lib/visuals";
import type { MenuItem } from "@/lib/types";
import { useEffect } from "react";

export function DealDetailsModal({
  open,
  item,
  onClose
}: {
  open: boolean;
  item: MenuItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !item) return null;

  const image = resolveMenuImage(item);
  const price = formatCurrency(item.price);

  const handiBadge = typeof item.handi_quantity === "number";
  const appetizerBadge = typeof item.appetizer_count === "number";
  const naanBadge = typeof item.naan_quantity === "number";
  const drinkBadge = typeof item.drink_volume_ml === "number";

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-charcoal/60" onClick={onClose} />
      <div className="relative z-10 flex max-h-[calc(100svh-env(safe-area-inset-top)-0.75rem)] w-full max-w-lg flex-col overflow-hidden rounded-t-card bg-white shadow-raised sm:max-h-[min(90svh,720px)] sm:rounded-card">
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden sm:aspect-[4/3]">
          <Image
            src={image}
            alt={item.name}
            fill
            sizes="(min-width: 640px) 512px, 100vw"
            className="object-cover"
            priority
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-xl bg-white/90 text-charcoal shadow-sm"
            aria-label="Close deal details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-xl font-black text-charcoal sm:text-2xl">{item.name}</h2>
            <p className="shrink-0 rounded-full bg-ember/10 px-3 py-1 text-lg font-black text-ember">{price}</p>
          </div>

          <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {handiBadge && item.handi_quantity && item.handi_quantity > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-800">
                <Utensils size={12} aria-hidden /> {item.handi_quantity} Handi
                {item.handi_size ? ` · ${item.handi_size}` : ""}
              </span>
            ) : null}

            {appetizerBadge && item.appetizer_count && item.appetizer_count > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-800">
                <CheckCircle2 size={12} aria-hidden /> {item.appetizer_count} Appetizers
              </span>
            ) : null}

            {naanBadge && item.naan_quantity && item.naan_quantity > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-800">
                <Clock size={12} aria-hidden /> {item.naan_quantity} Naan
              </span>
            ) : null}

            {drinkBadge && item.drink_volume_ml && item.drink_volume_ml > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-800">
                <Flame size={12} aria-hidden /> {formatDrinkVolume(item.drink_volume_ml)} Drink
              </span>
            ) : null}

            {item.free_items && item.free_items.length > 0 ? (
              item.free_items.map((free) => (
                <span key={free} className="inline-flex items-center gap-1 rounded-full bg-coriander/10 px-3 py-1 text-xs font-black text-coriander">
                  <CheckCircle2 size={12} aria-hidden /> Free {free}
                </span>
              ))
            ) : null}
          </div>

          {item.appetizer_types && item.appetizer_types.length > 0 ? (
            <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-charcoal">Appetizers included</p>
              <ul className="mt-2 grid gap-1 text-sm text-stone-700">
                {item.appetizer_types.map((appetizer) => (
                  <li key={appetizer}>• {appetizer}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-ember text-sm font-bold text-white active:scale-[0.97]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDrinkVolume(volumeMl: number) {
  return volumeMl >= 1000 ? `${volumeMl / 1000}L` : `${volumeMl}ml`;
}
