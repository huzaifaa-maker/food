"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/section-header";
import type { MenuItem } from "@/lib/types";

const specialProps = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.3 }
};

type TodaysSpecialProps = {
  items: MenuItem[];
};

export function TodaysSpecial({ items }: TodaysSpecialProps) {
  const featured =
    items.find((item) => item.popular && item.tags.some((tag) => /best seller|popular/i.test(tag))) ||
    items.find((item) => item.popular) ||
    items[0];

  if (!featured) {
    return null;
  }

  return (
    <section id="todays-special" className="bg-[#111111] py-16 text-white">
      <div className="container-pad">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Today’s special"
              title="A limited kitchen creation made for tonight"
              description="This chef-curated dish brings premium warmth and bold texture to your table — only available in small batches."
              tone="dark"
            />
            <div className="mt-8 grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-100/12 px-4 py-2 text-sm font-semibold text-amber-200">
                  <Sparkles size={16} /> Chef’s pick
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-orange-100">
                  <Star size={16} /> {featured.tags.join(" · ")}
                </span>
              </div>

              <div className="grid gap-8 lg:grid-cols-[0.85fr_0.9fr] lg:items-center">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-orange-200">Featured item</p>
                  <h3 className="mt-3 max-w-xl text-3xl font-black leading-tight text-white sm:text-4xl">
                    {featured.name}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-orange-100/90">
                    {featured.description}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-black/40 p-4 text-sm leading-6 text-orange-100">
                      <span className="block text-xs uppercase tracking-[0.2em] text-orange-200">Prep time</span>
                      <span className="mt-2 block font-semibold text-white">{featured.prepTime} minutes</span>
                    </div>
                    <div className="rounded-3xl bg-black/40 p-4 text-sm leading-6 text-orange-100">
                      <span className="block text-xs uppercase tracking-[0.2em] text-orange-200">Spice level</span>
                      <span className="mt-2 block font-semibold text-white capitalize">{featured.spiceLevel}</span>
                    </div>
                  </div>
                </div>

                <motion.div {...specialProps} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/50 p-4 shadow-soft">
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-amber-300/30 to-transparent" />
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-[#110f0e]">
                    <Image
                      src={featured.image}
                      alt={featured.name}
                      fill
                      sizes="(min-width: 1024px) 35vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover transition duration-700 ease-out hover:scale-105"
                    />
                  </div>
                </motion.div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/order" className="btn-primary w-full sm:w-auto">
                  Order Today <ArrowRight size={18} />
                </Link>
                <div className="rounded-3xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-orange-100">
                  <p className="font-semibold text-white">Delivered in 25–35 min</p>
                  <p className="mt-1 text-sm">Always freshly packed with crisp greens and signature sauces.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_32px_80px_rgba(0,0,0,0.24)] sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-orange-200">Why it stands out</p>
            <div className="grid gap-4">
              <div className="rounded-3xl bg-black/40 p-4 text-sm text-orange-100">
                <p className="font-semibold text-white">Signature sauce blend</p>
                <p className="mt-2">A smooth homemade blend layered to keep every bite rich and juicy.</p>
              </div>
              <div className="rounded-3xl bg-black/40 p-4 text-sm text-orange-100">
                <p className="font-semibold text-white">Real grill-char texture</p>
                <p className="mt-2">Each patty is seared in small batches to preserve tender, smoky taste.</p>
              </div>
              <div className="rounded-3xl bg-black/40 p-4 text-sm text-orange-100">
                <p className="font-semibold text-white">Trusted kitchen care</p>
                <p className="mt-2">Clean prep, hand-selected ingredients, and sealed packaging for every order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
