"use client";

import Link from "next/link";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { business } from "@/lib/config";
import { buildCartMessage, buildWhatsAppUrl } from "@/lib/format";

export function FloatingCtas() {
  const { lines, itemCount, subtotal } = useCart();
  const message = lines.length
    ? buildCartMessage(lines, subtotal)
    : "Assalam o Alaikum Zaiqa Junction, I want to place an order.";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream/10 bg-charcoal/88 px-3 py-3 shadow-[0_-12px_34px_rgba(0,0,0,0.34)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-[1fr_48px] gap-2">
        <Link
          href="/order"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ember px-4 text-sm font-black text-white shadow-glow"
        >
          <ShoppingBag size={18} />
          Order Now {itemCount > 0 ? `(${itemCount})` : ""}
        </Link>
        <a
          href={buildWhatsAppUrl(message)}
          target="_blank"
          rel="noreferrer"
          aria-label={`WhatsApp ${business.name}`}
          className="inline-flex min-h-12 items-center justify-center rounded-md border border-cream/12 bg-coriander text-white"
        >
          <MessageCircle size={20} />
        </a>
      </div>
    </div>
  );
}
