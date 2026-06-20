import { DollarSign, Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { FadeInSection } from "@/components/fade-in-section";
import { SectionHeader } from "@/components/section-header";

const pillars = [
  {
    title: "Fresh ingredients",
    text: "Core ingredients are sourced and prepped the same day for every active order.",
    icon: Leaf
  },
  {
    title: "Homemade taste",
    text: "Family recipes and small-batch cooking — never mass-produced or reheated from frozen.",
    icon: Sparkles
  },
  {
    title: "Hygienic kitchen",
    text: "Clean prep zones, covered storage, and sealed packaging for safe home delivery.",
    icon: ShieldCheck
  },
  {
    title: "Affordable pricing",
    text: "Transparent Rs. pricing with direct orders that skip third-party app markups.",
    icon: DollarSign
  },
  {
    title: "Fast delivery",
    text: "Local zones with clear ETAs so your food arrives hot and on time.",
    icon: Truck
  }
] as const;

export function WhyChooseUs() {
  return (
    <FadeInSection className="bg-white py-10 sm:py-16 lg:py-20">
      <div className="container-pad">
        <SectionHeader
          align="center"
          eyebrow="Why choose us"
          title="The comfort of a home kitchen with the polish of a premium brand"
          description="We built Zaiqa Junction for families, office workers, and students who want trustworthy homemade food without the guesswork."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map(({ title, text, icon: Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-stone-200/80 bg-cream p-5 shadow-soft transition hover:-translate-y-1"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-ember shadow-sm">
                <Icon size={22} />
              </span>
              <p className="mt-4 font-black text-charcoal">{title}</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
