"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Clock, Flame, Plus, Star } from "lucide-react";
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
  const { addItem } = useCart();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const image = resolveMenuImage(item);
  const compact = compactProp ?? isMobile;

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => {
      setIsMobile(!media.matches);
      setTiltEnabled(media.matches);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    if (!tiltEnabled) return;

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    setTilt({
      x: -((mouseY / rect.height) - 0.5) * 12,
      y: ((mouseX / rect.width) - 0.5) * 12
    });
    setGlare({
      x: (mouseX / rect.width) * 100,
      y: (mouseY / rect.height) * 100,
      opacity: 0.15
    });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }

  const cardStyle = tiltEnabled
    ? {
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 ? "transform 0.4s ease, box-shadow 0.4s ease" : "box-shadow 0.2s ease",
        transformStyle: "preserve-3d" as const
      }
    : undefined;

  const glareStyle = {
    background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 75%)`,
    opacity: glare.opacity,
    transition: glare.opacity === 0 ? "opacity 0.4s ease" : "none"
  };

  return (
    <article
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
      className="group relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-soft transition active:scale-[0.99] md:hover:-translate-y-1 md:hover:border-ember/35 md:hover:shadow-[0_18px_50px_rgba(255,122,0,0.12)]"
    >
      {tiltEnabled ? (
        <div className="pointer-events-none absolute inset-0 z-30 mix-blend-overlay" style={glareStyle} />
      ) : null}

      <div className={compact ? "grid grid-cols-[108px_1fr]" : ""}>
        <div className={`relative ${compact ? "min-h-[108px]" : "aspect-[4/3]"}`}>
          <Image
            src={image}
            alt={item.name}
            fill
            sizes={compact ? "108px" : "(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 92vw"}
            className="object-cover md:transition md:duration-500 md:group-hover:scale-105"
            loading={compact ? "eager" : "lazy"}
          />
          {item.popular ? (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-chilli px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-md">
              <Star size={10} fill="currentColor" aria-hidden /> Hot
            </span>
          ) : null}
        </div>

        <div className={`flex flex-col ${compact ? "min-h-[108px] justify-between p-3" : "min-h-[210px] p-4"}`}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-bold text-charcoal sm:text-base">{item.name}</h3>
              {!compact ? (
                <p className="mt-1 line-clamp-2 text-sm leading-5 text-stone-600">{item.description}</p>
              ) : (
                <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-stone-600">{item.description}</p>
              )}
            </div>
            <p className="shrink-0 rounded-full bg-ember/10 px-2 py-0.5 text-sm font-extrabold text-ember">
              {formatCurrency(item.price)}
            </p>
          </div>

          <div className={`flex flex-wrap gap-1.5 text-xs text-stone-600 ${compact ? "mt-1" : "mt-3"}`}>
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5">
              <Clock size={12} aria-hidden /> {item.prepTime}m
            </span>
            {!compact ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 capitalize">
                <Flame size={12} aria-hidden /> {item.spiceLevel}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => addItem(item)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-ember font-bold text-white shadow-sm transition active:scale-[0.97] hover:bg-saffron focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 ${
              compact ? "mt-2 min-h-10 w-full text-sm" : "mt-auto min-h-12 w-full px-4 py-2.5 text-sm"
            }`}
          >
            <Plus size={compact ? 16 : 18} aria-hidden />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
