"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { Category, MenuItem } from "@/lib/types";

type MenuBrowserProps = {
  categories: Category[];
  items: MenuItem[];
};

export function MenuBrowser({ categories, items }: MenuBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [filter, setFilter] = useState("all");

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesQuery =
        !normalized ||
        item.name.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized) ||
        item.tags.some((tag) => tag.toLowerCase().includes(normalized));
      const matchesCategory = category === "all" || item.categoryId === category;
      const matchesFilter =
        filter === "all" ||
        (filter === "popular" && item.popular) ||
        (filter === "under600" && item.price <= 600) ||
        (filter === "family" && item.tags.some((tag) => tag.toLowerCase().includes("family"))) ||
        (filter === "spicy" && item.spiceLevel === "hot");

      return matchesQuery && matchesCategory && matchesFilter;
    });
  }, [category, filter, items, query]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="surface p-4">
          <label className="text-sm font-black text-charcoal" htmlFor="menu-search">
            Search menu
          </label>
          <div className="mt-2 flex items-center rounded-md border border-stone-200 bg-white px-3">
            <Search size={18} className="text-stone-500" />
            <input
              id="menu-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search handi, burger, deal..."
              className="min-h-11 w-full bg-transparent px-3 text-sm outline-none"
            />
            {query ? (
              <button type="button" aria-label="Clear search" onClick={() => setQuery("")}>
                <X size={16} />
              </button>
            ) : null}
          </div>

          <div className="mt-5">
            <p className="text-sm font-black text-charcoal">Categories</p>
            <div className="mt-3 grid gap-2">
              <button
                type="button"
                onClick={() => setCategory("all")}
                className={chipClass(category === "all")}
              >
                All items
              </button>
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={chipClass(category === item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="inline-flex items-center gap-2 text-sm font-black text-charcoal">
              <SlidersHorizontal size={16} />
              Filters
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
              {[
                ["all", "All"],
                ["popular", "Popular"],
                ["under600", "Under Rs. 600"],
                ["family", "Family deals"],
                ["spicy", "Spicy"]
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={chipClass(filter === value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <section>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-stone-600">
            Showing <span className="text-charcoal">{filteredItems.length}</span> items
          </p>
          <p className="rounded-full bg-cream px-3 py-1 text-xs font-black uppercase tracking-wide text-chilli">
            ZAIQA15 on orders Rs. 999+
          </p>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
        {!filteredItems.length ? (
          <div className="mt-4 rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
            <p className="font-black text-charcoal">No menu items found.</p>
            <p className="mt-2 text-sm text-stone-600">Try a different category or search term.</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function chipClass(active: boolean) {
  return `min-h-10 rounded-md px-3 text-left text-sm font-bold transition ${
    active ? "bg-charcoal text-white" : "bg-stone-100 text-stone-700 hover:bg-cream hover:text-chilli"
  }`;
}
