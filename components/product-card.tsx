"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock, Flame, Plus, Star } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/format";
import type { MenuItem } from "@/lib/types";
import { resolveMenuImage } from "@/lib/visuals";

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

  return (
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
            <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
              <h3 className="min-w-0 flex-1 text-[15px] font-bold leading-snug text-charcoal">{item.name}</h3>
              <p className="shrink-0 whitespace-nowrap text-sm font-black text-ember">{formatCurrency(item.price)}</p>
            </div>
            {!compact ? (
              <p className="mt-1 line-clamp-2 text-sm leading-5 text-stone-600">{item.description}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-600">
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5">
              <Clock size={11} aria-hidden /> {item.prepTime}m
            </span>
            {!compact ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 capitalize">
                <Flame size={11} aria-hidden /> {item.spiceLevel}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => openCustomizer(item)}
            className="inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-ember text-sm font-bold text-white active:scale-[0.97]"
          >
            <Plus size={16} aria-hidden />
            Add
          </button>
        </div>
      </div>
    </article>
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
            <div key={item.id} className="w-[min(78vw,280px)] shrink-0 snap-start">
              <ProductCard item={item} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
