"use client";

import Link from "next/link";
import { MessageCircle, Phone, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { business } from "@/lib/config";
import { buildCartMessage, buildWhatsAppUrl } from "@/lib/format";

export function FloatingCtas() {
  const { lines, itemCount, subtotal } = useCart();
  const message = lines.length
    ? buildCartMessage(lines, subtotal)
    : `Assalam o Alaikum ${business.name}, I want to place an order.`;
  const phoneHref = `tel:${business.phoneDisplay.replace(/[^0-9+]/g, "")}`;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200/80 bg-white/95 px-3 pt-2 shadow-[0_-10px_40px_rgba(15,15,15,0.12)] backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      role="toolbar"
      aria-label="Quick order actions"
    >
      <div className="mx-auto grid max-w-lg grid-cols-[1fr_3rem_3rem] gap-2">
        <Link
          href="/order"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ember px-4 text-sm font-black text-white shadow-glow active:scale-[0.98]"
        >
          <ShoppingBag size={18} aria-hidden />
          Order Now{itemCount > 0 ? ` (${itemCount})` : ""}
        </Link>
        <a
          href={buildWhatsAppUrl(message)}
          target="_blank"
          rel="noreferrer"
          aria-label="Order on WhatsApp"
          className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-coriander text-white active:scale-[0.98]"
        >
          <MessageCircle size={20} aria-hidden />
        </a>
        <a
          href={phoneHref}
          aria-label={`Call ${business.name}`}
          className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl border border-stone-300 bg-cream text-charcoal active:scale-[0.98]"
        >
          <Phone size={20} aria-hidden />
        </a>
      </div>
    </div>
  );
}
