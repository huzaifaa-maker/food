"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Timer } from "lucide-react";

const trustPoints = [
  { icon: ShieldCheck, label: "Hygienic kitchen", detail: "Sealed packaging on every order." },
  { icon: Sparkles, label: "Fresh daily", detail: "Small batches, same-day prep." },
  { icon: Timer, label: "Fast delivery", detail: "25-35 min in nearby zones." }
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream" aria-label="Zaiqa Junction hero">
      <div className="grid min-h-[calc(100svh-4rem)] lg:min-h-svh lg:grid-cols-2">
        <div className="order-2 flex items-center pb-24 pt-10 sm:pt-16 lg:order-1 lg:pb-16 lg:pt-28">
          <div className="container-pad w-full lg:max-w-xl lg:pr-4 xl:max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ember shadow-sm">
              <Sparkles size={14} />
              Hygienic home kitchen
            </p>

            <h1 className="mt-5 font-display text-4xl font-black leading-[1.02] text-charcoal sm:text-5xl lg:text-[3.25rem] lg:leading-[1.04] xl:text-6xl">
              Fresh Homemade Meals Delivered to Your Doorstep
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-stone-600 sm:text-lg">
              Authentic Pakistani comfort food - burgers, handis, wraps, fries, and chai - cooked fresh in our home
              kitchen and confirmed on WhatsApp before dispatch.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/order" className="btn-primary">
                Order Now
              </Link>
              <Link href="#menu" className="btn-secondary">
                View Menu
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {trustPoints.map(({ icon: Icon, label, detail }) => (
                <div key={label} className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-soft">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cream text-ember">
                    <Icon size={18} />
                  </span>
                  <p className="mt-3 text-sm font-black text-charcoal">{label}</p>
                  <p className="mt-1 text-xs leading-5 text-stone-600">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative order-1 min-h-[44svh] sm:min-h-[50svh] lg:order-2 lg:min-h-full">
          <Image
            src="/images/menu/zinger-burger.webp"
            alt="Premium crispy Zinger Booster burger with sauce and fries"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/25 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-cream to-transparent lg:hidden" />
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-10 bg-gradient-to-r from-cream via-cream/70 to-transparent lg:block" />
        </div>
      </div>
    </section>
  );
}
