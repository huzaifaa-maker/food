import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MapPin, MessageCircle, Navigation, Phone, Send, Store } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { business } from "@/lib/config";
import { buildWhatsAppUrl, formatCurrency } from "@/lib/format";
import { listDeliveryAreas } from "@/lib/store";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Zaiqa Junction through WhatsApp, phone, Google Maps, operating hours, and local delivery zone details."
};

export default async function ContactPage() {
  const deliveryAreas = await listDeliveryAreas();

  return (
    <>
      <section className="bg-charcoal text-white">
        <div className="container-pad py-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saffron">Contact</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold sm:text-5xl">WhatsApp-first support for direct food orders.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-orange-50 sm:text-base">
            Customers can order through the website, WhatsApp, Foodpanda, phone, or maps, with clear hours and delivery zones.
          </p>
        </div>
      </section>

      <section className="bg-cream py-12 sm:py-16">
        <div className="container-pad grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-4">
            {([
              [MessageCircle, "WhatsApp", business.phoneDisplay, buildWhatsAppUrl("Assalam o Alaikum Zaiqa Junction, I want to order.")],
              [Phone, "Phone", business.phoneDisplay, `tel:${business.phoneDisplay.replace(/[^0-9+]/g, "")}`],
              [Clock, "Business hours", business.hours, "#hours"],
              [Navigation, "Kitchen location", business.kitchenArea, business.googleBusinessUrl],
              [Store, "Foodpanda", "Order through Foodpanda", business.foodpandaUrl]
            ] as const).map(([Icon, label, value, href]) => (
              <a
                key={String(label)}
                href={String(href)}
                target={String(href).startsWith("http") ? "_blank" : undefined}
                rel={String(href).startsWith("http") ? "noreferrer" : undefined}
                className="surface flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-cream text-ember">
                  <Icon size={22} />
                </span>
                <span>
                  <span className="block text-sm font-black uppercase tracking-wide text-chilli">{String(label)}</span>
                  <span className="mt-1 block font-bold text-charcoal">{String(value)}</span>
                </span>
              </a>
            ))}
            <Link href="/order" className="btn-primary">
              Start Website Order <Send size={18} />
            </Link>
          </div>

          <div className="surface overflow-hidden">
            <iframe
              src={business.mapsEmbedUrl}
              title="Zaiqa Junction Google Maps"
              className="h-[360px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section id="hours" className="bg-white py-12 sm:py-16">
        <div className="container-pad grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Delivery zones"
            title="Transparent fees and operating hours"
            description="Keep delivery details easy to scan so customers know whether they should choose delivery, pickup, WhatsApp, or Foodpanda."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {deliveryAreas.map((area) => (
              <div key={area.id} className="surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-charcoal">{area.name}</p>
                    <p className="mt-1 text-sm text-stone-600">{area.eta}</p>
                  </div>
                  <MapPin size={20} className="text-ember" />
                </div>
                <div className="mt-4 grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Fee</span>
                    <span className="font-black text-charcoal">{formatCurrency(area.fee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Minimum order</span>
                    <span className="font-black text-charcoal">{formatCurrency(area.minimumOrder)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Hours</span>
                    <span className="font-black text-charcoal">{business.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
