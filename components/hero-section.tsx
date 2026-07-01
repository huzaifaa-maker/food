"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { business } from "@/lib/config";

const trustStats = [
  { value: "4.9", label: "Rating", icon: Star },
  { value: "25-35", label: "Min", icon: ShieldCheck },
  { value: "Fresh", label: "Daily", icon: ShieldCheck }
] as const;

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-white" aria-label="Zaiqa Junction hero">
      <div className="absolute inset-0 hidden lg:block">
        <Image
          src="/images/menu/zinger-burger.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0F0F0F_0%,rgba(15,15,15,0.94)_34%,rgba(15,15,15,0.64)_58%,rgba(15,15,15,0.12)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-charcoal to-transparent" />
      </div>

      <div className="container-pad relative flex min-h-[calc(100svh-3.5rem)] items-center pb-[calc(5.75rem+env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] sm:min-h-[700px] lg:min-h-[min(88svh,840px)] lg:pb-16 lg:pt-24">
        <div className="w-full max-w-2xl">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/14 bg-white/8 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-orange-100 backdrop-blur">
            <MapPin size={14} className="shrink-0 text-ember" aria-hidden />
            <span className="truncate">{business.kitchenArea}</span>
          </div>

          <h1 className="mt-4 text-balance font-display text-[clamp(2.15rem,10.5vw,4.6rem)] font-black leading-[0.98] tracking-[-0.01em] text-cream sm:mt-5">
            Fresh homemade food, delivered hot.
          </h1>

          <p className="mt-4 max-w-xl text-[15px] font-medium leading-7 text-white/78 sm:text-base sm:leading-8">
            Burgers, handi, fries, wraps, and chai from a hygienic home kitchen in Multan.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <Link href="#menu" className="btn-primary w-full sm:w-auto">
              View Menu
              <ArrowRight size={18} aria-hidden />
            </Link>
            <Link
              href="/order"
              className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-2xl border border-white/18 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition active:scale-[0.98] hover:bg-white/16 focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-charcoal sm:w-auto"
            >
              Order Now
              <MessageCircle size={18} aria-hidden />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-2 sm:max-w-xl sm:grid-cols-3">
            {trustStats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/8 p-3 backdrop-blur">
                <Icon size={15} className="mb-2 text-ember" aria-hidden />
                <p className="text-base font-black text-cream">{value}</p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-white/55">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
