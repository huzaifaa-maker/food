"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, Flame, Plus, Star, Utensils } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/format";
import type { MenuItem } from "@/lib/types";
import { resolveMenuImage } from "@/lib/visuals";
import { DealDetailsModal } from "./deal-details-modal";

export function ProductCard({
  item,
  compact: compactProp
}: {
  item: MenuItem;
  compact?: boolean;
}) {
  const { openCustomizer } = useCart();
  const [isMobile, setIsMobile] = useState(false);
  const image = resolveMenuImage(item);
  const compact = compactProp ?? isMobile;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const isDeal = item.categoryId === "deals";

  const basePrice = item.options?.length
    ? Math.min(...item.options.map((o) => o.price))
    : item.price;
  const price = formatCurrency(basePrice);


  const [detailsOpen, setDetailsOpen] = useState(false);

  const handiBadge = isDeal && typeof item.handi_quantity === "number";
  const appetizerBadge = isDeal && typeof item.appetizer_count === "number";
  const naanBadge = isDeal && typeof item.naan_quantity === "number";
  const drinkBadge = isDeal && typeof item.drink_volume_liters === "number";

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-soft transition active:scale-[0.99]">
        <div className={compact ? "grid grid-cols-[96px_minmax(0,1fr)]" : ""}>
          <div className={`relative shrink-0 ${compact ? "h-[96px]" : "aspect-[4/3]"}`}>
            <Image
              src={image}
              alt={item.name}
              fill
              sizes={compact ? "96px" : "(min-width: 1024px) 25vw, 92vw"}
              className="object-cover"
              loading="lazy"
            />
            {item.popular ? (
              <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-chilli px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                <Star size={9} fill="currentColor" aria-hidden /> Hot
              </span>
            ) : null}
          </div>

          <div className={`flex min-w-0 flex-col ${compact ? "gap-2 p-2.5" : "gap-3 p-3.5 sm:p-4"}`}>
            <div className="min-w-0">
              <div className={compact ? "grid min-w-0 gap-1" : "grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-2"}>
                <h3 className="min-w-0 text-[15px] font-bold leading-snug text-charcoal">{item.name}</h3>
                <p
                  className={`w-fit max-w-full shrink-0 whitespace-nowrap rounded-full bg-ember/10 px-2 py-0.5 font-black text-ember ${
                    compact ? "text-[13px]" : "text-sm"
                  }`}
                >
                  {price}
                </p>
              </div>

              {!compact ? (
                <p className="mt-1 line-clamp-2 text-sm leading-5 text-stone-600">{item.description}</p>
              ) : null}

              {isDeal && !compact ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {handiBadge && item.handi_quantity && item.handi_quantity > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-black text-stone-800">
                      <Utensils size={12} aria-hidden /> {item.handi_quantity} Handi
                    </span>
                  ) : null}

                  {appetizerBadge && item.appetizer_count && item.appetizer_count > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-black text-stone-800">
                      <CheckCircle2 size={12} aria-hidden /> {item.appetizer_count} Apps
                    </span>
                  ) : null}

                  {naanBadge && item.naan_quantity && item.naan_quantity > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-black text-stone-800">
                      <Clock size={12} aria-hidden /> {item.naan_quantity} Naan
                    </span>
                  ) : null}

                  {drinkBadge && item.drink_volume_liters && item.drink_volume_liters > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-black text-stone-800">
                      <Flame size={12} aria-hidden /> {item.drink_volume_liters}L
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-600">
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5">
                <Clock size={11} aria-hidden /> {item.prepTime}m
              </span>
              {!compact && !isDeal && item.optionsHint ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-ember/10 px-2 py-0.5 text-[11px] font-black text-ember">
                  {item.optionsHint}
                </span>
              ) : null}

              {!compact && !isDeal ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 capitalize">
                  <Flame size={11} aria-hidden /> {item.spiceLevel}
                </span>
              ) : null}
            </div>

            <div className={compact || isDeal ? "grid grid-cols-2 gap-2" : ""}>
              {isDeal ? (
                <button
                  type="button"
                  onClick={() => setDetailsOpen(true)}
                  className="inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white text-sm font-bold text-charcoal active:scale-[0.97]"
                >
                  View Details
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => openCustomizer(item)}
                className={`inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-ember text-sm font-bold text-white active:scale-[0.97] ${
                  isDeal ? "" : ""
                }`}
              >
                <Plus size={16} aria-hidden />
                {isDeal ? "Order Now" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </article>

      <DealDetailsModal open={detailsOpen} item={detailsOpen ? item : null} onClose={() => setDetailsOpen(false)} />
    </>
  );
}

export function PopularItemsStrip({ items }: { items: MenuItem[] }) {
  const popular = useMemo(
    () => items.filter((item) => item.available && item.popular).slice(0, 8),
    [items]
  );

  if (!popular.length) return null;

  return (
    <section className="border-y border-stone-200/80 bg-white py-8">
      <div className="container-pad">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-black text-charcoal sm:text-2xl">Popular right now</h2>
          <Link href="/menu" className="text-sm font-bold text-ember">
            See all
          </Link>
        </div>
        <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {popular.map((item) => (
            <div key={item.id} className="w-[min(84vw,300px)] shrink-0 snap-start">
              <ProductCard item={item} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
