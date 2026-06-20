import { MapPin } from "lucide-react";
import { FadeInSection } from "@/components/fade-in-section";
import { SectionHeader } from "@/components/section-header";
import { formatCurrency } from "@/lib/format";
import type { DeliveryArea } from "@/lib/types";

type DeliveryAreasSectionProps = {
  areas: DeliveryArea[];
};

export function DeliveryAreasSection({ areas }: DeliveryAreasSectionProps) {
  return (
    <FadeInSection id="delivery-areas" className="bg-[#111111] py-16 text-white">
      <div className="container-pad">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Delivery areas"
            title="Where our homemade kitchen delivers today"
            description="Transparent delivery zones, fees, and ETAs so you can order with confidence each evening."
            tone="dark"
          />
          <p className="max-w-xl text-sm leading-6 text-orange-100/90 sm:text-base">
            Every area is served with fresh packaging and accurate arrival windows. If you are unsure, just send us a WhatsApp message.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {areas.map((area) => (
            <article key={area.id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.20)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-bold text-white">{area.name}</p>
                  <p className="mt-2 text-sm text-orange-100/80">ETA: {area.eta}</p>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-3xl bg-amber-100/15 text-amber-200">
                  <MapPin size={20} />
                </span>
              </div>

              <div className="mt-6 grid gap-3 rounded-3xl bg-black/30 p-4 text-sm text-orange-100">
                <div className="flex items-center justify-between">
                  <span>Delivery fee</span>
                  <span className="font-semibold text-white">{formatCurrency(area.fee)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Minimum order</span>
                  <span className="font-semibold text-white">{formatCurrency(area.minimumOrder)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
