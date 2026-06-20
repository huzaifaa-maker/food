import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, ChefHat, ClipboardCheck, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/section-header";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn the Zaiqa Junction homemade food story, kitchen hygiene standards, founder values, and preparation process."
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-charcoal text-white">
        <div className="container-pad grid gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-saffron">Home-based food business</p>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Homemade flavor, built for direct trust.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-orange-50 sm:text-base">
              Zaiqa Junction serves fresh Pakistani gravies, crispy burgers, wraps, and deals from a careful home
              kitchen, with ordering designed around local customers and repeat relationships.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="/images/menu/kitchen.webp"
              alt="Warm home kitchen with spices and cooking tools"
              fill
              sizes="(min-width: 1024px) 420px, 92vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-cream py-12 sm:py-16">
        <div className="container-pad grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="grid grid-cols-2 gap-3">
            {[
              "/images/menu/shahi-handi-clean.webp",
              "/images/menu/double-decker.webp",
              "/images/menu/masala-fries.webp",
              "/images/menu/wrap.webp"
            ].map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-lg bg-white">
                <Image src={src} alt="Zaiqa Junction food preparation" fill sizes="45vw" className="object-cover" />
              </div>
            ))}
          </div>
          <div>
            <SectionHeader
              eyebrow="Our story"
              title="A kitchen that turned family favorites into local delivery favorites"
              description="The brand is positioned for customers who want the warmth of homemade cooking with the reliability of an online ordering system."
            />
            <div className="mt-7 grid gap-4">
              {([
                ["Founder-led cooking", "Every menu decision is grounded in taste, consistency, and family-style comfort.", Heart],
                ["Fresh ingredients", "Core items are prepared in controlled batches so food stays fresh without feeling mass-produced.", Sparkles],
                ["Direct customer care", "Website and WhatsApp ordering keep the relationship close after the first purchase.", BadgeCheck]
              ] as const).map(([title, text, Icon]) => (
                <div key={String(title)} className="surface flex gap-4 p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-cream text-ember">
                    <Icon size={21} />
                  </span>
                  <span>
                    <span className="block font-black text-charcoal">{String(title)}</span>
                    <span className="mt-1 block text-sm leading-6 text-stone-600">{String(text)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="container-pad">
          <SectionHeader
            eyebrow="Process"
            title="How each order moves from kitchen to customer"
            description="A transparent process reduces anxiety for first-time customers ordering from a home-based business."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {([
              ["Prep", "Ingredients are checked, washed, portioned, and staged for active orders.", ClipboardCheck],
              ["Cook", "Gravies, burgers, wraps, and sides are prepared close to dispatch time.", ChefHat],
              ["Pack", "Food is sealed, labeled, and grouped by order for clean handoff.", ShieldCheck],
              ["Confirm", "Customer receives WhatsApp confirmation and delivery or pickup status.", BadgeCheck]
            ] as const).map(([title, text, Icon]) => (
              <div key={String(title)} className="surface p-5">
                <Icon size={24} className="text-ember" />
                <p className="mt-4 font-black text-charcoal">{String(title)}</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">{String(text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
