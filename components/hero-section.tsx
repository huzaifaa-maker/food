"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, ShieldCheck, Sparkles, Timer } from "lucide-react";
import { useReducedMotion } from "framer-motion";

const trustPoints = [
  { icon: ShieldCheck, label: "Hygienic kitchen", detail: "Sealed packaging." },
  { icon: Sparkles, label: "Fresh daily", detail: "Small batches." },
  { icon: Timer, label: "Fast delivery", detail: "25–35 min nearby." }
];

function HeroMedia({ className = "" }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldReduceMotion) {
      video.pause();
      return;
    }

    video.defaultPlaybackRate = 1;
    video.playbackRate = 1;
    void video.play().catch(() => undefined);
  }, [shouldReduceMotion]);

  return (
    <div className={`relative overflow-hidden bg-stone-900 ${className}`}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-center"
        autoPlay={!shouldReduceMotion}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/menu/kitchen.webp"
        aria-hidden="true"
      >
        <source src="/videos/chai-hero-4k.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/35 via-transparent to-charcoal/10" />
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream" aria-label="Zaiqa Junction hero">
      <HeroMedia className="h-[32svh] min-h-[200px] max-h-[280px] lg:hidden" />

      <div className="lg:grid lg:min-h-[min(100svh,920px)] lg:grid-cols-2">
        <div className="flex items-center pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-6 lg:items-center lg:pb-16 lg:pt-24">
          <div className="container-pad w-full lg:max-w-xl lg:pr-4 xl:max-w-2xl">
            <p className="inline-flex min-h-9 items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ember shadow-sm sm:text-[11px]">
              <Sparkles size={14} aria-hidden />
              Hygienic home kitchen
            </p>

            <h1 className="mt-4 text-balance font-display text-[clamp(1.75rem,7.2vw,3.25rem)] font-black leading-[1.06] text-charcoal sm:mt-5 lg:text-[3.25rem] lg:leading-[1.04] xl:text-6xl">
              Fresh Homemade Meals Delivered to Your Doorstep
            </h1>

            <p className="mt-4 max-w-lg text-[15px] leading-6 text-stone-600 sm:mt-5 sm:text-base sm:leading-7 lg:text-lg">
              Authentic Pakistani comfort food cooked fresh in our home kitchen and confirmed on WhatsApp before
              dispatch.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Link href="/order" className="btn-primary w-full sm:w-auto">
                Order Now
              </Link>
              <Link href="#menu" className="btn-secondary w-full sm:w-auto">
                View Menu
                <ArrowRight size={18} aria-hidden />
              </Link>
            </div>

            <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
              {trustPoints.map(({ icon: Icon, label, detail }) => (
                <div
                  key={label}
                  className="min-w-[148px] shrink-0 rounded-2xl border border-stone-200/80 bg-white p-3.5 shadow-soft sm:min-w-0"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cream text-ember">
                    <Icon size={17} aria-hidden />
                  </span>
                  <p className="mt-2.5 text-sm font-black text-charcoal">{label}</p>
                  <p className="mt-0.5 text-xs leading-5 text-stone-600">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <HeroMedia className="hidden min-h-full lg:block" />
      </div>
    </section>
  );
}
