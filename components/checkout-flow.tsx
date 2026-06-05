"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, MessageCircle, ShieldCheck, TicketPercent, Truck } from "lucide-react";
import { CartSummary } from "@/components/cart-summary";
import { useCart } from "@/components/cart-provider";
import { business } from "@/lib/config";
import { buildOrderConfirmationMessage, buildWhatsAppUrl, formatCurrency } from "@/lib/format";
import type { DeliveryArea, Order, PaymentMethod } from "@/lib/types";
import { DeliveryTracker3D } from "@/components/delivery-tracker-3d";

type CheckoutFlowProps = {
  deliveryAreas: DeliveryArea[];
};

const coupons: Record<string, { label: string; minSubtotal: number; discount: (subtotal: number) => number }> = {
  ZAIQA15: { label: "15% off", minSubtotal: 999, discount: (subtotal) => Math.round(subtotal * 0.15) },
  FIRSTORDER: { label: "10% off", minSubtotal: 699, discount: (subtotal) => Math.round(subtotal * 0.1) },
  FAMILY100: { label: "Rs. 100 off", minSubtotal: 1999, discount: () => 100 }
};

export function CheckoutFlow({ deliveryAreas }: CheckoutFlowProps) {
  const { lines, subtotal, clearCart } = useCart();
  const [deliveryAreaId, setDeliveryAreaId] = useState(deliveryAreas[0]?.id ?? "nearby");
  const [couponCode, setCouponCode] = useState("ZAIQA15");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_on_delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);

  const selectedArea = deliveryAreas.find((area) => area.id === deliveryAreaId) ?? deliveryAreas[0];
  const normalizedCoupon = couponCode.trim().toUpperCase();
  const coupon = coupons[normalizedCoupon];
  const discount = coupon && subtotal >= coupon.minSubtotal ? coupon.discount(subtotal) : 0;
  const deliveryFee = selectedArea ? (subtotal >= selectedArea.minimumOrder ? selectedArea.fee : selectedArea.fee + 100) : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const loyaltyPoints = useMemo(() => Math.floor(total / 100), [total]);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!lines.length) {
      setError("Add at least one item before checkout.");
      return;
    }

    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: String(form.get("customerName") ?? ""),
          phone: String(form.get("phone") ?? ""),
          address: String(form.get("address") ?? ""),
          notes: String(form.get("notes") ?? ""),
          deliveryAreaId,
          couponCode: normalizedCoupon,
          paymentMethod,
          items: lines.map((line) => ({
            menuItemId: line.menuItemId,
            quantity: line.quantity
          }))
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to create order.");
      }

      setOrder(payload.order as Order);
      clearCart();
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to create order.");
    } finally {
      setLoading(false);
    }
  }

  if (order) {
    return <OrderConfirmation order={order} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <div className="grid gap-4">
        <CartSummary />
        <div className="surface p-4">
          <p className="inline-flex items-center gap-2 font-black text-charcoal">
            <TicketPercent size={18} className="text-ember" />
            Repeat customer perks
          </p>
          <div className="mt-3 grid gap-2 text-sm text-stone-600">
            <p>
              Use <span className="font-black text-charcoal">ZAIQA15</span> for 15% off orders Rs. 999+.
            </p>
            <p>
              This order earns <span className="font-black text-chilli">{loyaltyPoints}</span> loyalty points after
              confirmation.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={submitOrder} className="surface overflow-hidden">
        <div className="border-b border-stone-200 bg-charcoal p-5 text-white">
          <h1 className="font-display text-3xl font-bold">Checkout</h1>
          <p className="mt-2 text-sm text-orange-100">Submit your order, then confirm it instantly on WhatsApp.</p>
        </div>

        <div className="grid gap-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-charcoal">
              Name
              <input name="customerName" required className={inputClass} placeholder="Your name" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-charcoal">
              Phone
              <input name="phone" required className={inputClass} placeholder="03XX-XXXXXXX" />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-bold text-charcoal">
            Address
            <textarea
              name="address"
              required
              rows={3}
              className={inputClass}
              placeholder="House, street, block, area, nearest landmark"
            />
          </label>

          <div>
            <p className="text-sm font-bold text-charcoal">Delivery area</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {deliveryAreas.map((area) => (
                <label
                  key={area.id}
                  className={`cursor-pointer rounded-lg border p-3 text-sm transition ${
                    deliveryAreaId === area.id ? "border-ember bg-cream" : "border-stone-200 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryArea"
                    value={area.id}
                    checked={deliveryAreaId === area.id}
                    onChange={() => setDeliveryAreaId(area.id)}
                    className="sr-only"
                  />
                  <span className="block font-black text-charcoal">{area.name}</span>
                  <span className="mt-1 block text-stone-600">
                    {area.eta} · {formatCurrency(area.fee)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-charcoal">
              Coupon
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                className={inputClass}
                placeholder="ZAIQA15"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-charcoal">
              Payment
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
                className={inputClass}
              >
                <option value="cash_on_delivery">Cash on delivery</option>
                <option value="easypaisa_jazzcash">Easypaisa / JazzCash</option>
                <option value="bank_transfer">Bank transfer</option>
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm font-bold text-charcoal">
            Notes
            <textarea name="notes" rows={3} className={inputClass} placeholder="Less spicy, extra sauce, pickup time..." />
          </label>

          <div className="rounded-lg bg-cream p-4">
            <Line label="Subtotal" value={formatCurrency(subtotal)} />
            <Line label={`Discount${discount ? ` (${normalizedCoupon})` : ""}`} value={`-${formatCurrency(discount)}`} />
            <Line label="Delivery" value={formatCurrency(deliveryFee)} />
            <div className="mt-3 border-t border-stone-200 pt-3">
              <Line label="Total" value={formatCurrency(total)} strong />
            </div>
          </div>

          {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-bold text-chilli">{error}</p> : null}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Creating order..." : "Place Order"}
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

function OrderConfirmation({ order }: { order: Order }) {
  const whatsappUrl = buildWhatsAppUrl(buildOrderConfirmationMessage(order));

  return (
    <section className="mx-auto max-w-3xl rounded-lg border border-stone-200 bg-white p-6 text-center shadow-soft">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-coriander text-white">
        <BadgeCheck size={28} />
      </span>
      <h1 className="mt-5 font-display text-4xl font-bold text-charcoal">Order received</h1>
      <p className="mt-3 text-sm leading-6 text-stone-600">
        Your website order <span className="font-black text-charcoal">{order.id}</span> is ready for WhatsApp
        confirmation. Once confirmed, the kitchen can move it into preparation.
      </p>

      <div className="mt-6 grid gap-3 rounded-lg bg-cream p-4 text-left">
        <Line label="Status" value="WhatsApp confirmation pending" />
        <Line label="Total" value={formatCurrency(order.total)} />
        <Line label="Delivery" value={order.deliveryAreaName} />
        <Line label="Loyalty earned" value={`${order.loyaltyPointsEarned} points`} />
      </div>

      <DeliveryTracker3D status={order.status} />

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary">
          <MessageCircle size={18} /> Confirm on WhatsApp
        </a>
        <Link href="/menu" className="btn-secondary">
          Add another order
        </Link>
      </div>

      <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
        {([
          ["Confirmed", "Order accepted by kitchen", ShieldCheck],
          ["Preparing", "Freshly cooked and packed", Truck],
          ["Delivered", "Review request sent", BadgeCheck]
        ] as const).map(([title, text, Icon]) => (
          <div key={String(title)} className="rounded-lg border border-stone-200 p-3">
            <Icon size={18} className="text-ember" />
            <p className="mt-2 text-sm font-black text-charcoal">{String(title)}</p>
            <p className="mt-1 text-xs leading-5 text-stone-600">{String(text)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Line({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? "text-lg font-black" : "text-sm"}`}>
      <span className={strong ? "text-charcoal" : "text-stone-600"}>{label}</span>
      <span className="font-black text-charcoal">{value}</span>
    </div>
  );
}

const inputClass =
  "min-h-12 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-charcoal outline-none transition focus:border-ember focus:ring-2 focus:ring-ember/20";
