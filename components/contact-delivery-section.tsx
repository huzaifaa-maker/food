import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { FadeInSection } from "@/components/fade-in-section";
import { business, chef } from "@/lib/config";
import { buildWhatsAppUrl, formatCurrency } from "@/lib/format";
import type { DeliveryArea } from "@/lib/types";

type ContactDeliverySectionProps = {
  areas: DeliveryArea[];
};

export function ContactDeliverySection({ areas }: ContactDeliverySectionProps) {
  const phoneHref = `tel:${business.phoneDisplay.replace(/[^0-9+]/g, "")}`;

  return (
    <FadeInSection id="contact" className="bg-white py-10 sm:py-14">
      <div className="container-pad">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ember">Contact & delivery</p>
          <h2 className="mt-2 font-display text-2xl font-black text-charcoal sm:text-3xl">Order from Shah Shams, Multan</h2>
          <p className="mt-2 text-sm text-stone-600">Kitchen by {chef.name} · {business.hours}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href={buildWhatsAppUrl(`Assalam o Alaikum ${business.name}, I want to order.`)}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[72px] items-center gap-3 rounded-2xl border border-stone-200 bg-cream p-4 active:scale-[0.99]"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-coriander text-white">
              <MessageCircle size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold uppercase text-coriander">WhatsApp</span>
              <span className="block truncate font-black text-charcoal">{business.phoneDisplay}</span>
            </span>
          </a>

          <a
            href={phoneHref}
            className="flex min-h-[72px] items-center gap-3 rounded-2xl border border-stone-200 bg-cream p-4 active:scale-[0.99]"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ember text-white">
              <Phone size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold uppercase text-ember">Call</span>
              <span className="block truncate font-black text-charcoal">{business.phoneDisplay}</span>
            </span>
          </a>

          <a
            href={`mailto:${business.email}`}
            className="flex min-h-[72px] items-center gap-3 rounded-2xl border border-stone-200 bg-cream p-4 active:scale-[0.99]"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-charcoal text-white">
              <Mail size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold uppercase text-stone-500">Email</span>
              <span className="block truncate text-sm font-bold text-charcoal">{business.email}</span>
            </span>
          </a>

          <div className="flex min-h-[72px] items-center gap-3 rounded-2xl border border-stone-200 bg-cream p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-stone-200 text-charcoal">
              <Clock size={20} />
            </span>
            <span>
              <span className="block text-xs font-bold uppercase text-stone-500">Hours</span>
              <span className="block font-black text-charcoal">{business.hours}</span>
            </span>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-display text-lg font-black text-charcoal">Delivery from {business.kitchenArea}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
              <div key={area.id} className="rounded-2xl border border-stone-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-charcoal">{area.name}</p>
                  <MapPin className="shrink-0 text-ember" size={18} aria-hidden />
                </div>
                <p className="mt-1 text-sm text-stone-600">{area.eta}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <span>
                    <span className="text-stone-500">Fee </span>
                    <span className="font-black text-ember">{formatCurrency(area.fee)}</span>
                  </span>
                  {area.minimumOrder > 0 ? (
                    <span>
                      <span className="text-stone-500">Min </span>
                      <span className="font-black text-charcoal">{formatCurrency(area.minimumOrder)}</span>
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200">
          <iframe
            src={business.mapsEmbedUrl}
            title="Zaiqa Junction kitchen location — Shah Shams Multan"
            className="h-[220px] w-full border-0 sm:h-[280px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <Link href="/order" className="btn-primary mt-6 w-full sm:w-auto">
          Start order <Send size={18} aria-hidden />
        </Link>
      </div>
    </FadeInSection>
  );
}
