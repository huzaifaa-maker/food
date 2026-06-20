import Image from "next/image";
import { Download, Eye } from "lucide-react";
import { FadeInSection } from "@/components/fade-in-section";
import { SectionHeader } from "@/components/section-header";

const menuPages = [
  {
    label: "Front menu",
    src: "/images/menu/full-menu-front.webp",
    alt: "Zaiqa Junction full menu front with gravies, burgers, wraps, appetizers, and prices"
  },
  {
    label: "Deals back",
    src: "/images/menu/full-menu-back.webp",
    alt: "Zaiqa Junction full menu back with combo deals, discount, delivery information, and contact number"
  }
] as const;

export function FullMenuPhotoSection() {
  return (
    <FadeInSection id="full-menu" className="bg-white py-14 sm:py-20">
      <div className="container-pad">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Complete menu"
            title="Prefer the full menu flyer?"
            description="For customers who want to inspect everything at once, the original front and back menu are available here."
          />
          <a
            href="/images/whatsapp/zaiqa-20.jpg"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary shrink-0"
          >
            <Download size={18} />
            Open full image
          </a>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {menuPages.map((page) => (
            <a
              key={page.src}
              href={page.src}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-cream shadow-soft transition hover:-translate-y-1 hover:border-ember/40"
            >
              <div className="relative aspect-[0.65] bg-stone-100 sm:aspect-[0.74]">
                <Image
                  src={page.src}
                  alt={page.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="object-contain p-3 transition duration-500 group-hover:scale-[1.015]"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-stone-200 bg-white p-4">
                <p className="font-black text-charcoal">{page.label}</p>
                <span className="inline-flex items-center gap-2 rounded-full bg-ember/10 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-ember">
                  <Eye size={14} />
                  View
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
