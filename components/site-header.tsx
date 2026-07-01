"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { business } from "@/lib/config";

const routeLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" }
];

const homeLinks = routeLinks;

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, cartPulse } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const links = isHome ? homeLinks : routeLinks;
  const transparentHero = isHome && !scrolled && !open;
  const logoTextClass = transparentHero ? "text-white" : "text-charcoal";
  const logoSubTextClass = transparentHero ? "text-white/68" : "text-stone-500";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function isActive(href: string) {
    if (href.startsWith("/#")) return false;
    return pathname === href;
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        transparentHero
          ? "border-b border-white/10 bg-charcoal/24 text-white backdrop-blur-md"
          : "border-b border-stone-200/80 bg-white/95 text-charcoal shadow-[0_8px_30px_rgba(15,15,15,0.06)] backdrop-blur-xl"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="container-pad flex min-h-14 items-center justify-between sm:min-h-16">
        <Link href="/" className="flex min-h-11 min-w-0 max-w-[70%] items-center gap-2.5 sm:gap-3" onClick={() => setOpen(false)}>
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white shadow-glow ring-1 ring-white/30">
            <Image src={business.logoThumb} alt="" fill sizes="40px" className="object-cover" priority />
          </span>
          <span className="min-w-0">
            <span className={`block truncate text-sm font-black uppercase leading-4 tracking-wide ${logoTextClass}`}>
              {business.name}
            </span>
            <span className={`hidden text-[11px] sm:block ${logoSubTextClass}`}>Premium home kitchen</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`min-h-11 rounded-lg px-3 py-2 text-sm font-bold transition ${
                isActive(link.href)
                  ? "bg-ember text-white"
                  : transparentHero
                    ? "text-white/76 hover:bg-white/10 hover:text-white"
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
            className="hidden min-h-11 items-center justify-center gap-2 rounded-xl bg-ember px-4 text-sm font-black text-white shadow-glow transition hover:bg-saffron lg:inline-flex"
          >
            <ShoppingBag size={18} aria-hidden />
            Order Now{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
          <Link
            href="/order"
            className={`relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ember text-white shadow-glow transition active:scale-95 lg:hidden ${
              cartPulse ? "scale-110 ring-2 ring-saffron ring-offset-2" : ""
            }`}
            aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
          >
            <ShoppingBag size={20} aria-hidden />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-charcoal px-1 text-[10px] font-black text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border active:scale-95 lg:hidden ${
              transparentHero ? "border-white/20 text-white" : "border-stone-300 text-charcoal"
            }`}
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          className="max-h-[calc(100svh-3.5rem-env(safe-area-inset-top))] overflow-y-auto border-t border-stone-200 bg-white px-4 pb-4 pt-2 lg:hidden"
          aria-label="Mobile navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`flex min-h-12 items-center rounded-xl px-4 text-base font-bold ${
                isActive(link.href) ? "bg-ember text-white" : "text-stone-700 active:bg-stone-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/order"
            onClick={() => setOpen(false)}
            className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ember px-4 text-base font-black text-white active:scale-[0.98]"
          >
            <ShoppingBag size={18} aria-hidden />
            Order Now
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
