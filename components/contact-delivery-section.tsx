import Link from "next/link";
import { Clock, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { FadeInSection } from "@/components/fade-in-section";
import { SectionHeader } from "@/components/section-header";
import { business } from "@/lib/config";
import { buildWhatsAppUrl, formatCurrency } from "@/lib/format";
import type { DeliveryArea } from "@/lib/types";

type ContactDeliverySectionProps = {
  areas: DeliveryArea[];
};

export function ContactDeliverySection({ areas }: ContactDeliverySectionProps) {
  const phoneHref = `tel:${business.phoneDisplay.replace(/[^0-9+]/g, "")}`;

  return (
    <FadeInSection id="contact" className="bg-white py-14 sm:py-20">
      <div className="container-pad">
        <SectionHeader
          eyebrow="Contact & delivery"
          title="Order direct — we're here to help"
          description="Reach us on WhatsApp or phone, check delivery zones, and see our operating hours before you checkout."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-4">
            <a
              href={buildWhatsAppUrl(`Assalam o Alaikum ${business.name}, I want to order.`)}
              target="_blank"
              rel="noreferrer"
              className="surface flex items-center gap-4 p-4 transition hover:-translate-y-0.5"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-coriander text-white">
                <MessageCircle size={22} />
              </span>
              <span>
                <span className="block text-sm font-black uppercase tracking-wide text-coriander">WhatsApp</span>
                <span className="mt-1 block font-bold text-charcoal">{business.phoneDisplay}</span>
              </span>
            </a>

            <a href={phoneHref} className="surface flex items-center gap-4 p-4 transition hover:-translate-y-0.5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cream text-ember">
                <Phone size={22} />
              </span>
              <span>
                <span className="block text-sm font-black uppercase tracking-wide text-chilli">Phone</span>
                <span className="mt-1 block font-bold text-charcoal">{business.phoneDisplay}</span>
              </span>
            </a>

            <div className="surface flex items-center gap-4 p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cream text-ember">
                <Clock size={22} />
              </span>
              <span>
                <span className="block text-sm font-black uppercase tracking-wide text-chilli">Business hours</span>
                <span className="mt-1 block font-bold text-charcoal">{business.hours}</span>
              </span>
            </div>

            <Link href="/order" className="btn-primary">
              Start Website Order <Send size={18} />
            </Link>
          </div>

          <div className="surface overflow-hidden">
            <iframe
              src={business.mapsEmbedUrl}
              title="Zaiqa Junction location map"
              className="h-[280px] w-full border-0 sm:h-[360px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="mt-10">
          <h3 className="font-display text-xl font-bold text-charcoal">Delivery locations</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {areas.map((area) => (
              <div key={area.id} className="surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-charcoal">{area.name}</p>
                    <p className="mt-1 text-sm text-stone-600">{area.eta}</p>
                  </div>
                  <MapPin className="shrink-0 text-ember" size={20} />
                </div>
                <div className="mt-4 grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Delivery fee</span>
                    <span className="font-black text-charcoal">{formatCurrency(area.fee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Minimum order</span>
                    <span className="font-black text-charcoal">{formatCurrency(area.minimumOrder)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
