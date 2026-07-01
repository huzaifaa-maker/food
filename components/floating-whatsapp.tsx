"use client";

import { MessageCircle } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { business } from "@/lib/config";
import { buildCartMessage, buildWhatsAppUrl, whatsappOrderMessage } from "@/lib/format";

export function FloatingWhatsApp() {
  const { lines, subtotal } = useCart();
  const message = lines.length
    ? buildCartMessage(lines, subtotal)
    : whatsappOrderMessage;

  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noreferrer"
      aria-label={`Order on WhatsApp — ${business.name}`}
      className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full border border-cream/15 bg-coriander text-white shadow-[0_18px_46px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:bg-ember md:inline-flex"
    >
      <MessageCircle size={26} />
    </a>
  );
}
