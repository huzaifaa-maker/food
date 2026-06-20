"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";

const routeLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order" },
  { href: "/contact", label: "Contact" }
];

const homeLinks = [
  { href: "/#menu", label: "Menu" },
  { href: "/#about", label: "Story" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#contact", label: "Contact" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const links = isHome ? homeLinks : routeLinks;
  const lightBar = !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href.startsWith("/#")) return false;
    return pathname === href;
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        lightBar
          ? "border-b border-stone-200/70 bg-cream/90 text-charcoal backdrop-blur-md"
          : "border-b border-stone-200/80 bg-white/92 text-charcoal shadow-[0_8px_30px_rgba(15,15,15,0.06)] backdrop-blur-xl"
      }`}
    >
      <div className="container-pad flex min-h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-ember font-display text-xl font-black text-white shadow-glow">
            Z
          </span>
          <span>
            <span className="block text-sm font-black uppercase leading-4 tracking-wide text-charcoal">
              Zaiqa Junction
            </span>
            <span className="block text-[11px] text-stone-500">Premium home kitchen</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                isActive(link.href)
                  ? "bg-ember text-white"
                  : "text-stone-600 hover:bg-stone-100 hover:text-charcoal"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/order"
            className="hidden min-h-10 items-center justify-center gap-2 rounded-xl bg-ember px-4 text-sm font-black text-white shadow-glow transition hover:bg-saffron sm:inline-flex"
          >
            <ShoppingBag size={18} />
            Order Now{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
          <Link
            href="/order"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ember text-white shadow-glow transition hover:bg-saffron sm:hidden"
            aria-label="Open order cart"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-charcoal px-1 text-xs font-black text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stone-300 text-charcoal lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          className="border-t border-stone-200 bg-white px-4 pb-4 pt-2 lg:hidden"
          aria-label="Mobile navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-3 text-sm font-bold ${
                isActive(link.href) ? "bg-ember text-white" : "text-stone-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/order"
            onClick={() => setOpen(false)}
            className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-ember px-4 text-sm font-black text-white"
          >
            <ShoppingBag size={18} />
            Order Now
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
