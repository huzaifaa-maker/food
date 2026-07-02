"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
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
  const image = resolveMenuImage(item);
  const compact = compactProp ?? false;
  const isDeal = item.categoryId === "deals";
  const isDrink = item.id === "drink-350ml";
  const imageWrapperClass = compact
    ? "relative h-[160px] overflow-hidden bg-stone-100 sm:h-[190px] xl:h-[210px]"
    : isDeal
    ? "relative h-[170px] overflow-hidden bg-cream/10 sm:h-[210px]"
    : "relative h-[170px] overflow-hidden bg-stone-100 sm:h-[210px]";
  const imageClass = isDrink ? "object-contain object-center" : "object-cover";
  const imageSizes = compact
    ? "(max-width: 767px) 100vw, 180px"
    : "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw";

  const basePrice = item.options?.length
    ? Math.min(...item.options.map((o) => o.price))
    : item.price;
  const price = formatCurrency(basePrice);


  const [detailsOpen, setDetailsOpen] = useState(false);

  const handiBadge = isDeal && typeof item.handi_quantity === "number";
  const appetizerBadge = isDeal && typeof item.appetizer_count === "number";
  const naanBadge = isDeal && typeof item.naan_quantity === "number";
  const drinkBadge = isDeal && typeof item.drink_volume_ml === "number";

  return (
    <>
      <article className="group flex h-full w-full max-w-[380px] justify-self-center flex-col overflow-hidden rounded-card border border-stone-200/80 bg-white shadow-soft transition duration-250 hover:-translate-y-1 hover:shadow-raised active:scale-[0.99]">
        <div className="flex h-full flex-col">
          <div className={imageWrapperClass}>
            <Image
              src={image}
              alt={item.name}
              fill
              sizes={imageSizes}
              className={imageClass}
              style={isDrink ? { objectFit: "contain", objectPosition: "center" } : undefined}
              loading="lazy"
            />
            {item.popular ? (
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-chilli px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-white">
                <Star size={10} fill="currentColor" aria-hidden /> Popular
              </span>
            ) : null}
          </div>

          <div className={`flex min-w-0 flex-1 flex-col ${compact ? "gap-2 p-3" : "gap-3 p-4 sm:p-4"}`}>
            <div className="min-w-0">
              <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <h3 className="min-w-0 text-sm font-black leading-snug text-charcoal sm:text-[15px]">{item.name}</h3>
                <p className={`w-fit shrink-0 whitespace-nowrap rounded-full bg-ember/10 px-2.5 py-1 text-center font-black text-ember ${compact ? "text-[12px]" : "text-sm"}`}>
                  {price}
                </p>
              </div>

              {!compact ? (
                <p className="mt-2 hidden text-sm leading-6 text-stone-600 sm:line-clamp-2">{item.description}</p>
              ) : null}

              {item.variantLabel ? (
                <span className="mt-2 inline-flex rounded-full bg-saffron/15 px-2.5 py-1 text-[11px] font-black text-chilli">
                  {item.variantLabel}
                </span>
              ) : null}

              {isDeal && !compact ? (
                <div className="mt-3 hidden flex-wrap gap-2 sm:flex">
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

                  {drinkBadge && item.drink_volume_ml && item.drink_volume_ml > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-black text-stone-800">
                      <Flame size={12} aria-hidden /> {formatDrinkVolume(item.drink_volume_ml)}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-[11px] text-stone-600">
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5">
                <Clock size={11} aria-hidden /> {item.prepTime}m
              </span>
              {!compact && !isDeal && item.optionsHint ? (
                <span className="hidden items-center gap-1 rounded-full bg-ember/10 px-2 py-0.5 text-[11px] font-black text-ember sm:inline-flex">
                  {item.optionsHint}
                </span>
              ) : null}

              {!compact && !isDeal ? (
                <>
                  <span className="hidden text-stone-400 sm:inline" aria-hidden="true">·</span>
                  <span className="hidden items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 capitalize sm:inline-flex">
                    <Flame size={11} aria-hidden /> {item.spiceLevel.charAt(0).toUpperCase() + item.spiceLevel.slice(1)}
                  </span>
                </>
              ) : null}
            </div>

            <div className={`mt-3 grid gap-2 ${isDeal ? "grid-cols-2" : "grid-cols-1"}`}>
              {isDeal ? (
                <button
                  type="button"
                  onClick={() => setDetailsOpen(true)}
                  aria-label={`View details for ${item.name}`}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white text-sm font-bold text-charcoal transition hover:border-ember hover:text-ember active:scale-[0.97]"
                >
                  View Details
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => openCustomizer(item)}
                aria-label={isDeal ? `Add ${item.name} deal to cart` : `Add ${item.name} to cart`}
                className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-ember text-sm font-bold text-white transition hover:bg-[#ff9451] active:scale-[0.97]"
              >
                <Plus size={16} aria-hidden />
                {isDeal ? "Add Deal" : item.options?.length ? "Choose Options" : "Add"}
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
          <Link href="/menu" className="-mr-2 inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-bold text-ember">
            See all
          </Link>
        </div>
        <div className="product-grid mt-4">
          {popular.map((item) => (
            <div key={item.id} className="flex h-full w-full max-w-[380px] justify-self-center">
              <ProductCard item={item} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDrinkVolume(volumeMl: number) {
  return volumeMl >= 1000 ? `${volumeMl / 1000}L` : `${volumeMl}ml`;
}
