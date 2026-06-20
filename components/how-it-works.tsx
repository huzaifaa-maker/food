import Link from "next/link";
import { ArrowRight, ClipboardList, MessageCircle, UtensilsCrossed } from "lucide-react";
import { FadeInSection } from "@/components/fade-in-section";
import { SectionHeader } from "@/components/section-header";
import { business } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/format";

const steps = [
  {
    number: "01",
    title: "Browse Menu",
    description: "Explore our homemade dishes, filter by meal time, and add your favorites to the cart.",
    icon: UtensilsCrossed
  },
  {
    number: "02",
    title: "Place Order",
    description: "Enter delivery details, choose your zone, and submit — takes less than two minutes.",
    icon: ClipboardList
  },
  {
    number: "03",
    title: "Receive Fresh Food",
    description: "Get WhatsApp confirmation and enjoy hot, hygienically packed food at your doorstep.",
    icon: MessageCircle
  }
] as const;

export function HowItWorks() {
  return (
    <FadeInSection className="bg-white py-14 sm:py-20">
      <div className="container-pad">
        <SectionHeader
          align="center"
          eyebrow="How ordering works"
          title="Three simple steps to fresh homemade food"
          description="No app downloads, no confusion — order direct, confirm on WhatsApp, and track your delivery."
        />

        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          <div
            className="absolute left-[16.67%] right-[16.67%] top-12 hidden h-0.5 bg-gradient-to-r from-ember/20 via-ember to-ember/20 md:block"
            aria-hidden
          />
          {steps.map(({ number, title, description, icon: Icon }) => (
            <div key={title} className="relative text-center">
              <div className="relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-cream text-ember shadow-soft">
                <Icon size={28} />
              </div>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-ember">{number}</p>
              <h3 className="mt-2 font-display text-xl font-bold text-charcoal">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/order" className="btn-primary w-full sm:w-auto">
            Order Now <ArrowRight size={18} />
          </Link>
          <a
            href={buildWhatsAppUrl(`Assalam o Alaikum ${business.name}, I want to place an order.`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-coriander px-5 py-3 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 sm:w-auto"
          >
            <MessageCircle size={18} /> WhatsApp
          </a>
        </div>
      </div>
    </FadeInSection>
  );
}
