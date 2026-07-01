"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { FadeInSection } from "@/components/fade-in-section";

const menuPages = [
  {
    label: "Full menu",
    src: "/images/menu/full-menu-front.webp",
    alt: "Zaiqa Junction full menu — handis, burgers, wraps, appetizers, and prices"
  },
  {
    label: "Deals & combos",
    src: "/images/menu/full-menu-back.webp",
    alt: "Zaiqa Junction deals menu — family bundles, solo deals, and delivery info"
  }
] as const;

export function FullMenuPhotoSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  function closeViewer() {
    setActiveIndex(null);
  }

  function showPrev() {
    setActiveIndex((index) => (index === null ? 0 : (index - 1 + menuPages.length) % menuPages.length));
  }

  function showNext() {
    setActiveIndex((index) => (index === null ? 0 : (index + 1) % menuPages.length));
  }

  const activePage = activeIndex === null ? null : menuPages[activeIndex];

  return (
    <>
      <FadeInSection id="full-menu" className="bg-white py-10 sm:py-14">
        <div className="container-pad">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ember">Printed menu</p>
              <h2 className="mt-2 font-display text-2xl font-black text-charcoal sm:text-3xl">Full menu & deals</h2>
              <p className="mt-2 text-sm text-stone-600">Pinch to zoom · tap to open · use back to return to site</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {menuPages.map((page, index) => (
              <button
                key={page.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group overflow-hidden rounded-2xl border border-stone-200 bg-cream text-left shadow-soft transition active:scale-[0.99]"
              >
                <div className="relative aspect-[0.68] bg-stone-100 sm:aspect-[0.72]">
                  <Image
                    src={page.src}
                    alt={page.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-2"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-stone-200 bg-white px-4 py-3">
                  <p className="font-black text-charcoal">{page.label}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ember">
                    <ZoomIn size={14} aria-hidden />
                    Open
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </FadeInSection>

      {activePage ? (
        <div className="fixed inset-0 z-[80] flex flex-col bg-charcoal/95" role="dialog" aria-modal="true">
          <div
            className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-3 text-white"
            style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
          >
            <button
              type="button"
              onClick={closeViewer}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/10 px-3 text-sm font-bold"
            >
              <ArrowLeft size={18} aria-hidden />
              Back to site
            </button>
            <p className="truncate text-sm font-bold">{activePage.label}</p>
            <button
              type="button"
              onClick={closeViewer}
              className="grid h-11 w-11 place-items-center rounded-xl bg-white/10"
              aria-label="Close menu viewer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-auto p-3">
            <button
              type="button"
              onClick={showPrev}
              className="absolute left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur sm:left-4"
              aria-label="Previous menu page"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="relative h-full w-full max-w-3xl">
              <Image
                src={activePage.src}
                alt={activePage.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            <button
              type="button"
              onClick={showNext}
              className="absolute right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur sm:right-4"
              aria-label="Next menu page"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
