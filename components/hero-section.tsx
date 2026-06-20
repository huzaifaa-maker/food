"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { business } from "@/lib/config";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream" aria-label="Zaiqa Junction hero">
      <div className="relative h-[34svh] min-h-[200px] max-h-[300px] overflow-hidden lg:hidden">
        <Image
          src="/images/menu/shahi-handi.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_42%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/20 to-transparent" />
        <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-charcoal/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
          <Star size={12} className="fill-amber-300 text-amber-300" aria-hidden />
          4.9 · Shah Shams, Multan
        </div>
      </div>

      <div className="lg:grid lg:min-h-[min(88svh,820px)] lg:grid-cols-2">
        <div className="flex items-center pb-[calc(5rem+env(safe-area-inset-bottom))] pt-5 lg:items-center lg:pb-16 lg:pt-24">
          <div className="container-pad w-full lg:max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-ember/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ember">
              <Sparkles size={14} aria-hidden />
              {business.kitchenArea}
            </p>

            <h1 className="mt-3 text-balance font-display text-[clamp(1.85rem,7vw,3.5rem)] font-black leading-[1.05] text-charcoal lg:mt-4">
              Order fresh homemade food in 30 seconds
            </h1>

            <p className="mt-3 max-w-md text-[15px] leading-6 text-stone-600 lg:text-base">
              Burgers, handis, wraps, fries & chai — cooked fresh by {business.name.split(" ")[0]} Junction. Tap to
              customize, add to cart, confirm on WhatsApp.
            </p>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Link href="#menu" className="btn-primary w-full sm:w-auto">
                Browse menu
              </Link>
              <Link href="/order" className="btn-secondary w-full sm:w-auto">
                View cart
                <ArrowRight size={18} aria-hidden />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative hidden min-h-full lg:block">
          <Image
            src="/images/menu/zinger-burger.webp"
            alt=""
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/90 via-cream/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
