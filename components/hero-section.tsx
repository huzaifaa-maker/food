"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChefHat, ShieldCheck, Sparkles, Timer, UtensilsCrossed } from "lucide-react";

const trustPoints = [
  { icon: ShieldCheck, label: "Hygienic kitchen", detail: "Sealed packaging." },
  { icon: Sparkles, label: "Fresh daily", detail: "Small batches." },
  { icon: Timer, label: "Fast delivery", detail: "25–35 min nearby." }
];

function HeroVisual({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden>
      <Image
        src="/images/menu/zinger-burger.webp"
        alt="Delicious plated meal"
        className="object-cover"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="absolute left-6 top-6 rounded-full bg-white/10 px-3 py-2 backdrop-blur-sm">
        <p className="text-sm font-black text-amber-300">4.9</p>
        <p className="text-[10px] uppercase tracking-wider text-amber-100">Customer rated</p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/50 to-transparent lg:hidden" />
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream" aria-label="Zaiqa Junction hero">
      <HeroVisual className="h-[36svh] min-h-[220px] max-h-[420px] lg:hidden" />

      <div className="lg:grid lg:min-h-[min(92svh,880px)] lg:grid-cols-2">
        <div className="flex items-center pb-8 pt-8 lg:items-center lg:pb-24 lg:pt-32">
          <div className="container-pad w-full lg:max-w-xl lg:pr-6 xl:max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-ember/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ember">
              <Sparkles size={14} aria-hidden /> Hygienic home kitchen
            </p>

            <h1 className="mt-4 text-balance font-display text-[clamp(1.9rem,6.6vw,3.75rem)] font-extrabold leading-[1.02] text-charcoal sm:mt-5 lg:text-[3.8rem] xl:text-7xl">
              Real Home-cooked Flavours — Ready Fast
            </h1>

            <p className="mt-4 max-w-lg text-[15px] leading-7 text-stone-600 sm:mt-5 sm:text-base lg:text-lg">
              Hand-made Pakistani meals, cooked fresh and confirmed with you before dispatch. Order via WhatsApp
              for live customization and quick delivery.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Link href="/order" className="inline-flex items-center justify-center gap-3 rounded-full bg-ember px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-ember/90">
                Order Now
                <ArrowRight size={18} aria-hidden />
              </Link>

              <Link href="#menu" className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/70 bg-white/90 px-5 py-3 text-sm font-semibold text-charcoal hover:shadow-sm">
                View Menu
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {trustPoints.map(({ icon: Icon, label, detail }) => (
                <div key={label} className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cream text-ember">
                    <Icon size={18} aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-black text-charcoal">{label}</p>
                    <p className="mt-1 text-xs text-stone-600">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <HeroVisual className="min-h-full h-[min(92svh,880px)]" />
        </div>
      </div>
    </section>
  );
}
