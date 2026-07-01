import type { Metadata } from "next";
import { FullMenuPhotoSection } from "@/components/full-menu-photo-section";
import { MenuBrowser } from "@/components/menu-browser";
import { SectionHeader } from "@/components/section-header";
import { business } from "@/lib/config";
import { categories } from "@/lib/data";
import { listMenuItems } from "@/lib/store";

export const metadata: Metadata = {
  title: "Digital Menu — Food in Multan",
  description:
    "Browse Zaiqa Junction's full menu in Multan — Pakistani handis, burgers, wraps, appetizers, deals, and prices. One-tap add-to-cart ordering."
};

export default async function MenuPage() {
  const items = await listMenuItems();

  const menuSchema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${business.name} Menu`,
    description: "Full menu of Pakistani homemade food — handis, burgers, wraps, appetizers, deals, breads, drinks, and tea.",
    hasMenuItem: items.map((item) => ({
      "@type": "MenuItem",
      name: item.name,
      description: item.description,
      offers: {
        "@type": "Offer",
        price: item.price,
        priceCurrency: "PKR",
        availability: item.available
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock"
      },
      image: item.image?.startsWith("/")
        ? `${business.siteUrl}${item.image}`
        : item.image
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema) }}
      />

      <section className="bg-charcoal text-white">
        <div className="container-pad py-8 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saffron">Native digital menu</p>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Browse the menu.</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-6 text-orange-50 sm:text-base">
            Real food photos, clear prices, filters, and one-tap customization.
          </p>
        </div>
      </section>

      <section className="bg-cream py-12 sm:py-16">
        <div className="container-pad">
          <SectionHeader
            eyebrow="Order online"
            title="Food first, prices visible"
            description="Search by dish, category, spice, deal, or budget."
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
