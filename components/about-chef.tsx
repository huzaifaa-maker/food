import Image from "next/image";
import { Award, ChefHat, Heart } from "lucide-react";
import { FadeInSection } from "@/components/fade-in-section";
import { SectionHeader } from "@/components/section-header";
import { chef } from "@/lib/config";

export function AboutChef() {
  return (
    <FadeInSection id="about" className="bg-cream py-14 sm:py-20">
      <div className="container-pad grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-soft sm:aspect-[4/3] lg:aspect-[4/5]">
          <Image
            src={chef.image}
            alt={`${chef.name}, ${chef.title}`}
            fill
            sizes="(min-width: 1024px) 40vw, 92vw"
            className="object-cover"
          />
          <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 px-4 py-3 shadow-soft backdrop-blur-sm">
            <p className="text-2xl font-black text-ember">{chef.yearsExperience}+</p>
            <p className="text-xs font-bold uppercase tracking-wide text-stone-600">Years cooking</p>
          </div>
        </div>

        <div>
          <SectionHeader
            eyebrow="About the chef"
            title={`Meet ${chef.name}`}
            description={chef.bio}
          />
          <p className="mt-2 text-sm font-bold text-ember">{chef.title}</p>

          <ul className="mt-7 grid gap-4">
            {chef.highlights.map((highlight, index) => {
              const icons = [Heart, ChefHat, Award];
              const Icon = icons[index] ?? Heart;
              return (
                <li key={highlight} className="surface flex gap-4 p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream text-ember">
                    <Icon size={21} />
                  </span>
                  <span className="text-sm leading-6 text-stone-700">{highlight}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </FadeInSection>
  );
}
