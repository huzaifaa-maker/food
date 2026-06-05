import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MessageCircle, ShoppingBag } from "lucide-react";
import { CheckoutFlow } from "@/components/checkout-flow";
import { business } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/format";
import { listDeliveryAreas } from "@/lib/store";

export const metadata: Metadata = {
  title: "Order Online",
  description:
    "Checkout directly with Zaiqa Junction, choose delivery area and payment method, then confirm your homemade food order on WhatsApp."
};

export default async function OrderPage() {
  const deliveryAreas = await listDeliveryAreas();

  return (
    <>
      <section className="bg-charcoal text-white">
        <div className="container-pad grid gap-6 py-10 sm:py-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-saffron">Direct online ordering</p>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Cart, checkout, WhatsApp confirmation.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-orange-50 sm:text-base">
              Place the order on the website, confirm it on WhatsApp, then track the status from pending to delivered.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
            <a
              href={buildWhatsAppUrl("Assalam o Alaikum Zaiqa Junction, I need help placing an order.")}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a href={business.foodpandaUrl} target="_blank" rel="noreferrer" className="btn-secondary">
              Foodpanda
            </a>
          </div>
        </div>
      </section>

      <section className="bg-cream py-12 sm:py-16">
        <div className="container-pad">
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            {([
              ["Step 1", "Add items to cart", ShoppingBag],
              ["Step 2", "Submit checkout form", Clock],
              ["Step 3", "Confirm on WhatsApp", MessageCircle]
            ] as const).map(([step, text, Icon]) => (
              <div key={String(step)} className="surface flex items-center gap-3 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-cream text-ember">
                  <Icon size={19} />
                </span>
                <span>
                  <span className="block text-xs font-black uppercase tracking-wide text-chilli">{String(step)}</span>
                  <span className="block text-sm font-bold text-charcoal">{String(text)}</span>
                </span>
              </div>
            ))}
          </div>
          <CheckoutFlow deliveryAreas={deliveryAreas} />
          <div className="mt-6 text-center text-sm text-stone-600">
            <Link href="/menu" className="font-black text-chilli hover:text-ember">
              Browse the menu
            </Link>{" "}
            to add more items before checkout.
          </div>
        </div>
      </section>
    </>
  );
}
