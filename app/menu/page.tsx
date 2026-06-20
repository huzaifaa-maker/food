import type { Metadata } from "next";
import Image from "next/image";
import { FullMenuPhotoSection } from "@/components/full-menu-photo-section";
import { MenuBrowser } from "@/components/menu-browser";
import { SectionHeader } from "@/components/section-header";
import { categories } from "@/lib/data";
import { listMenuItems } from "@/lib/store";

export const metadata: Metadata = {
  title: "Digital Menu",
  description:
    "Browse Zaiqa Junction's native mobile menu with Pakistani handis, burgers, wraps, appetizers, deals, prices, and direct add-to-cart ordering."
};

export default async function MenuPage() {
  const items = await listMenuItems();

  return (
    <>
      <section className="bg-charcoal text-white">
        <div className="container-pad grid gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-saffron">Native digital menu</p>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Browse, filter, and order direct.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-orange-50 sm:text-base">
              Real food photos, clear prices, category filters, and one-tap add-to-cart actions make mobile ordering
              faster than a PDF or chat-only menu.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="/images/menu/zinger-burger.webp"
              alt="Signature Zinger Booster burger from Zaiqa Junction"
              fill
              sizes="(min-width: 1024px) 420px, 92vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-cream py-12 sm:py-16">
        <div className="container-pad">
          <SectionHeader
            eyebrow="Order online"
            title="Full menu with popular items highlighted"
            description="Search across dishes, prices, spice levels, and family-friendly deals with clean dish photos instead of a flyer menu."
          />
          <div className="mt-8">
            <MenuBrowser categories={categories} items={items} />
          </div>
        </div>
      </section>
      <FullMenuPhotoSection />
    </>
  );
}
