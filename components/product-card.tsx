"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Clock, Flame, Plus, Star } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/format";
import type { MenuItem } from "@/lib/types";
import { resolveMenuImage } from "@/lib/visuals";

export function ProductCard({ item, compact = false }: { item: MenuItem; compact?: boolean }) {
  const { addItem } = useCart();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const image = resolveMenuImage(item);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setTiltEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    if (!tiltEnabled) return;

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const rX = -((mouseY / height) - 0.5) * 12;
    const rY = ((mouseX / width) - 0.5) * 12;
    const gX = (mouseX / width) * 100;
    const gY = (mouseY / height) * 100;

    setTilt({ x: rX, y: rY });
    setGlare({ x: gX, y: gY, opacity: 0.15 });
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
      className="group relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-soft transition hover:-translate-y-1 hover:border-ember/35 hover:shadow-[0_18px_50px_rgba(255,122,0,0.12)]"
    >
      {tiltEnabled ? (
        <div
          className="pointer-events-none absolute inset-0 z-30 mix-blend-overlay"
          style={glareStyle}
        />
      ) : null}

      <div className={compact ? "grid grid-cols-[118px_1fr]" : ""}>
        <div className={`relative ${compact ? "min-h-full" : "aspect-[4/3]"}`}>
          <Image
            src={image}
            alt={item.name}
            fill
            sizes={compact ? "118px" : "(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 92vw"}
            className="object-cover transition duration-500 group-hover:scale-105"
            loading={compact ? "eager" : "lazy"}
          />
          {item.popular ? (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-chilli px-2.5 py-1 text-[11px] font-bold uppercase text-white shadow-md">
              <Star size={12} fill="currentColor" /> Popular
            </span>
          ) : null}
        </div>

        <div className="flex min-h-[210px] flex-col p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-charcoal">{item.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-5 text-stone-600">{item.description}</p>
            </div>
            <p className="shrink-0 rounded-full bg-ember/10 px-2.5 py-1 text-sm font-extrabold text-ember shadow-sm">
              {formatCurrency(item.price)}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-600">
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1">
              <Clock size={13} /> {item.prepTime} min
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 capitalize">
              <Flame size={13} /> {item.spiceLevel}
            </span>
          </div>

          <button
            type="button"
            onClick={() => addItem(item)}
            className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-ember px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-saffron focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2"
          >
            <Plus size={18} />
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
