"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, ShoppingBag } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/format";
import { business } from "@/lib/config";
import { ExplodedBurger3D } from "@/components/exploded-burger-3d";

type HeroCarouselItem = {
  id: string;
  tag: string;
  title: string;
  description: string;
  themeColor: string;
  watermarkColor: string;
  image: string;
  imageAlt: string;
};

// Test data requested by the brief. Replace image paths with pizza photos when final assets are ready.
export const heroCarouselItems: HeroCarouselItem[] = [
  {
    id: "velvety-shahi-handi-half",
    tag: "SIGNATURE PAKISTANI GRAVY",
    title: "SHAHI HANDI",
    description:
      "Creamy, slow-cooked boneless chicken handi in a rich clay pot style, prepared with fresh cream and mild spices.",
    themeColor: "#D97706",
    watermarkColor: "#B45309",
    image: "/images/menu/shahi-handi-clean.webp",
    imageAlt: "Signature Shahi Handi freshly prepared and garnished"
  },
  {
    id: "zinger-booster",
    tag: "CRISPY FAST FOOD",
    title: "ZINGER BOOSTER",
    description:
      "Extra-crispy zinger chicken breast layered with crunchy lettuce, cheddar cheese, and house sauce in toasted sesame buns.",
    themeColor: "#DC2626",
    watermarkColor: "#991B1B",
    image: "/images/menu/zinger-burger.webp",
    imageAlt: "Fiery crispy Zinger Booster burger with premium buns"
  },
  {
    id: "legend-loaded-fries",
    tag: "APPETIZER FAVORITE",
    title: "LOADED FRIES",
    description:
      "Crispy golden fries loaded with double sauce layers, seasoned chunks of grilled chicken, and spicy jalapenos.",
    themeColor: "#EA580C",
    watermarkColor: "#C2410C",
    image: "/images/menu/loaded-fries.webp",
    imageAlt: "The Legend Loaded Fries bowl with chicken chunks and sauce"
  }
];

export function HeroCarousel3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copyIndex, setCopyIndex] = useState(0);
  const [copyLeaving, setCopyLeaving] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tilt, setTilt] = useState({ x: "0deg", y: "0deg" });
  const timers = useRef<number[]>([]);

  const activeItem = heroCarouselItems[activeIndex];
  const copyItem = heroCarouselItems[copyIndex];

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function queue(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    timers.current.push(timer);
  }

  function goTo(nextIndex: number) {
    if (nextIndex === activeIndex || isAnimating) {
      return;
    }

    setIsAnimating(true);
    setCopyLeaving(true);
    setActiveIndex(nextIndex);

    queue(() => {
      setCopyIndex(nextIndex);
      setCopyLeaving(false);
    }, 170);

    queue(() => {
      setIsAnimating(false);
    }, 720);
  }

  function goBy(step: number) {
    const total = heroCarouselItems.length;
    goTo((activeIndex + step + total) % total);
  }

  function getPosition(index: number) {
    const total = heroCarouselItems.length;
    const diff = (index - activeIndex + total) % total;

    if (diff === 0) {
      return "active";
    }

    if (diff === 1) {
      return "next";
    }

    if (diff === total - 1) {
      return "prev";
    }

    return "hidden";
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      x: `${(-y * 10).toFixed(2)}deg`,
      y: `${(x * 12).toFixed(2)}deg`
    });
  }

  const style = {
    "--bg-color": activeItem.themeColor,
    "--text-accent": activeItem.watermarkColor,
    "--tilt-x": tilt.x,
    "--tilt-y": tilt.y
  } as CSSProperties;

  return (
    <section className="premium-hero" style={style} aria-label="Featured food carousel">
      <div className="premium-hero__shell">
        <div className={`premium-hero__copy ${copyLeaving ? "is-leaving" : ""}`}>
          <p className="premium-hero__tag">{copyItem.tag}</p>
          <h1>{copyItem.title}</h1>
          <p className="premium-hero__description">{copyItem.description}</p>
          <div className="premium-hero__actions">
            <Link href="/order" className="premium-hero__primary">
              <ShoppingBag size={18} />
              Order Now
            </Link>
            <a
              href={buildWhatsAppUrl(`Assalam o Alaikum ${business.name}, I want to order ${copyItem.title}.`)}
              target="_blank"
              rel="noreferrer"
              className="premium-hero__icon"
              aria-label="Order this item on WhatsApp"
            >
              <MessageCircle size={22} />
            </a>
          </div>
        </div>

        <div
          className="premium-hero__showcase"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setTilt({ x: "0deg", y: "0deg" })}
        >
          <p className="premium-hero__watermark" aria-hidden="true">
            {activeItem.title}
          </p>

          <button
            type="button"
            className="premium-hero__nav premium-hero__nav--prev"
            onClick={() => goBy(-1)}
            aria-label="Previous product"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="premium-hero__stage" aria-live="polite">
            {heroCarouselItems.map((item, index) => {
              const position = getPosition(index);
              const isActive = position === "active";

              return (
                <article
                  key={item.id}
                  className={`premium-hero__product is-${position}`}
                  aria-hidden={index !== activeIndex}
                >
                  {item.id === "zinger-booster" && isActive ? (
                    <div className="flex items-center justify-center h-full w-full transform-style-3d">
                      <ExplodedBurger3D />
                    </div>
                  ) : (
                    <>
                      {/* 3D Depth Shadow behind the plate */}
                      <div className="premium-hero__plate-shadow" />

                      <div className="premium-hero__plate">
                        {/* Plate rim highlight */}
                        <div className="premium-hero__plate-rim" />

                        {/* Food Image wrapped */}
                        <div className="premium-hero__image-wrap">
                          <Image
                            src={item.image}
                            alt={item.imageAlt}
                            fill
                            priority={index === 0}
                            sizes="(min-width: 1024px) 42vw, 82vw"
                            className="premium-hero__image"
                          />
                        </div>

                        {/* Glassy reflection sheen */}
                        <div className="premium-hero__plate-sheen" />
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>

          <button
            type="button"
            className="premium-hero__nav premium-hero__nav--next"
            onClick={() => goBy(1)}
            aria-label="Next product"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      <div className="premium-hero__dots" role="tablist" aria-label="Featured products">
        {heroCarouselItems.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Show ${item.title}`}
            className={index === activeIndex ? "is-active" : ""}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </section>
  );
}
