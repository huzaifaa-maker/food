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
  const drinkBadge = typeof item.drink_volume_liters === "number";

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-charcoal/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-t-2xl bg-white shadow-[0_18px_50px_rgba(15,15,15,0.18)] sm:rounded-2xl">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl sm:rounded-t-2xl">
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
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-xl bg-white/90 text-charcoal shadow-sm"
            aria-label="Close deal details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-xl font-black text-charcoal sm:text-2xl">{item.name}</h2>
            <p className="shrink-0 rounded-full bg-ember/10 px-3 py-1 text-lg font-black text-ember">{price}</p>
          </div>

          <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {handiBadge && item.handi_quantity && item.handi_quantity > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-800">
                <Utensils size={12} aria-hidden /> {item.handi_quantity} Handi
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

            {drinkBadge && item.drink_volume_liters && item.drink_volume_liters > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-800">
                <Flame size={12} aria-hidden /> {item.drink_volume_liters}L Drink
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
