import type { Metadata } from "next";
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
        <div className="container-pad py-8 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saffron">Native digital menu</p>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Browse, filter, and order direct.</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-6 text-orange-50 sm:text-base">
            Real food photos, clear prices, and one-tap add-to-cart — built for phone ordering.
          </p>
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
