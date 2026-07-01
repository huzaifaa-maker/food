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
  const [filtersOpen, setFiltersOpen] = useState(false);

  const uniqueItems = useMemo(
    () => items.filter((item, index, self) => index === self.findIndex((candidate) => candidate.id === item.id)),
    [items]
  );

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return uniqueItems.filter((item) => {
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
  }, [category, filter, query, uniqueItems]);

  const filterOptions = [
    ["all", "All"],
    ["popular", "Popular"],
    ["under600", "Under Rs. 600"],
    ["family", "Family"],
    ["spicy", "Spicy"]
  ] as const;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="space-y-4 lg:hidden">
        <div className="flex items-center rounded-xl border border-stone-200 bg-white px-3 shadow-sm">
          <Search size={18} className="shrink-0 text-stone-500" aria-hidden />
          <input
            id="menu-search-mobile"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search dishes, e.g. 'Zinger', 'handi', 'chai'..."
            className="min-h-12 w-full bg-transparent px-3 text-base outline-none"
            aria-label="Search menu"
          />
          {query ? (
            <button type="button" aria-label="Clear search" className="min-h-11 min-w-11" onClick={() => setQuery("")}>
              <X size={16} />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setCategory("all")} aria-pressed={category === "all"} className={chipClass(category === "all", true)}>
            All
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              aria-pressed={category === item.id}
              className={chipClass(category === item.id, true)}
            >
              {item.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen((value) => !value)}
          aria-expanded={filtersOpen}
          aria-controls="mobile-filter-panel"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-sm font-bold text-charcoal"
        >
          <SlidersHorizontal size={16} aria-hidden />
          {filtersOpen ? "Hide filters" : "More filters"}
          {filter !== "all" && (
            <span className="ml-1 grid h-5 w-5 place-items-center rounded-full bg-ember text-[10px] font-black text-white">
              1
            </span>
          )}
        </button>

        {filtersOpen ? (
          <div id="mobile-filter-panel" className="flex flex-wrap gap-2">
            {filterOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
                className={chipClass(filter === value, false)}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
        <div className="surface p-4">
          <label className="text-sm font-black text-charcoal" htmlFor="menu-search">
            Search menu
          </label>
          <div className="mt-2 flex items-center rounded-md border border-stone-200 bg-white px-3">
            <Search size={18} className="text-stone-500" aria-hidden />
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
              <button type="button" onClick={() => setCategory("all")} aria-pressed={category === "all"} className={chipClass(category === "all", false)}>
                All items
              </button>
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  aria-pressed={category === item.id}
                  className={chipClass(category === item.id, false)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="inline-flex items-center gap-2 text-sm font-black text-charcoal">
              <SlidersHorizontal size={16} aria-hidden />
              Filters
            </p>
            <div className="mt-3 grid gap-2">
              {filterOptions.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  aria-pressed={filter === value}
                  className={chipClass(filter === value, false)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold text-stone-600" aria-live="polite" aria-atomic="true">
            Showing <span className="text-charcoal">{filteredItems.length}</span>
            {filteredItems.length !== uniqueItems.length && (
              <> of <span className="text-charcoal">{uniqueItems.length}</span></>
            )}{" "}
            {filteredItems.length === 1 ? "item" : "items"}
            {(query || category !== "all" || filter !== "all") && (
              <>
                {" "}
                <button
                  type="button"
                  onClick={() => { setQuery(""); setCategory("all"); setFilter("all"); }}
                  className="ml-1 text-xs font-black text-ember underline hover:no-underline"
                >
                  Clear filters
                </button>
              </>
            )}
          </p>
          <p className="rounded-full bg-cream px-3 py-1 text-xs font-black uppercase tracking-wide text-chilli">
            ZAIQA15 on Rs. 999+
          </p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
        {!filteredItems.length ? (
          <div className="mt-4 rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center">
            <p className="font-black text-charcoal">No dishes match your search.</p>
            <p className="mt-2 text-sm text-stone-600">Try a different category or search term.</p>
            <button
              type="button"
              onClick={() => { setQuery(""); setCategory("all"); setFilter("all"); }}
              className="mt-4 rounded-full bg-ember px-4 py-2 text-sm font-black text-white hover:bg-saffron"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function chipClass(active: boolean, pill: boolean) {
  return `${
    pill ? "min-h-11 shrink-0 snap-start rounded-full px-4 py-2 text-sm" : "min-h-11 rounded-md px-3 text-left text-sm"
  } font-bold transition active:scale-[0.97] ${
    active ? "bg-charcoal text-white" : "bg-stone-100 text-stone-700 hover:bg-cream hover:text-chilli"
  }`;
}
