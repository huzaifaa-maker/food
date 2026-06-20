"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { FadeInSection } from "@/components/fade-in-section";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import type { MealTime, MenuItem } from "@/lib/types";

type FeaturedMenuProps = {
  items: MenuItem[];
};

const filters: Array<{ id: "all" | MealTime; label: string }> = [
  { id: "all", label: "All" },
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "desserts", label: "Desserts" },
  { id: "beverages", label: "Beverages" }
];

const emptyMessages: Record<MealTime, string> = {
  breakfast: "No breakfast items yet — browse our dinner favorites or check back soon.",
  lunch: "No lunch items in this filter right now — try All or Dinner.",
  dinner: "No dinner items in this filter right now — try All.",
  desserts: "No desserts on the menu yet — our loaded fries and chai pair perfectly with any meal.",
  beverages: "No beverages in this filter right now — see the full menu for drinks and add-ons."
};

export function FeaturedMenu({ items }: FeaturedMenuProps) {
  const [active, setActive] = useState<"all" | MealTime>("all");

  const filtered = useMemo(() => {
    const available = items.filter((item) => item.available);
    if (active === "all") return available.slice(0, 6);
    const matched = available.filter((item) => item.mealTime === active);
    return matched.slice(0, 6);
  }, [active, items]);

  return (
    <FadeInSection id="menu" className="bg-cream py-14 sm:py-20">
      <div className="container-pad">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Featured menu"
            title="Homemade favorites, ready to order"
            description="Filter by meal time, add to cart, and checkout in minutes. Full cuisine categories are on the menu page."
          />
          <Link href="/menu" className="btn-secondary shrink-0">
            Full Menu <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActive(filter.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                active === filter.id
                  ? "bg-ember text-white shadow-glow"
                  : "border border-stone-200 bg-white text-charcoal hover:border-ember hover:text-ember"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center">
            <p className="text-sm leading-6 text-stone-600">
              {active === "all" ? "No items available right now." : emptyMessages[active]}
            </p>
            <Link href="/menu" className="btn-primary mt-5">
              Browse full menu
            </Link>
          </div>
        )}
      </div>
    </FadeInSection>
  );
}
