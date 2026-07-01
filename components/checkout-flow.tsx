"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useId, useMemo, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, CheckCircle2, Info, MessageCircle, ShieldCheck, TicketPercent, Truck, XCircle } from "lucide-react";
import { CartSummary } from "@/components/cart-summary";
import { useCart } from "@/components/cart-provider";
import { business } from "@/lib/config";
import { buildOrderConfirmationMessage, buildWhatsAppUrl, formatCurrency } from "@/lib/format";
import type { DeliveryArea, Order, PaymentMethod } from "@/lib/types";

type CheckoutFlowProps = {
  deliveryAreas: DeliveryArea[];
};

const coupons: Record<string, { label: string; minSubtotal: number; discount: (subtotal: number) => number }> = {
  ZAIQA15: { label: "15% off", minSubtotal: 999, discount: (subtotal) => Math.round(subtotal * 0.15) },
  FIRSTORDER: { label: "10% off", minSubtotal: 699, discount: (subtotal) => Math.round(subtotal * 0.1) },
  FAMILY100: { label: "Rs. 100 off", minSubtotal: 1999, discount: () => 100 }
};

const PK_PHONE_RE = /^(03\d{2}|\+923\d{2})\d{7}$/;

function validatePhone(value: string) {
  const cleaned = value.replace(/[\s\-]/g, "");
  return PK_PHONE_RE.test(cleaned);
}

export function CheckoutFlow({ deliveryAreas }: CheckoutFlowProps) {
  const { lines, subtotal, clearCart } = useCart();
  const [deliveryAreaId, setDeliveryAreaId] = useState(deliveryAreas[0]?.id ?? "near-kitchen");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponStatus, setCouponStatus] = useState<"idle" | "success" | "error" | "min_not_met">("idle");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_on_delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);

  // Field validation state
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [touched, setTouched] = useState({ name: false, phone: false, address: false });

  const nameId = useId();
  const phoneId = useId();
  const addressId = useId();
  const nameErrId = useId();
  const phoneErrId = useId();
  const addressErrId = useId();
  const couponInputRef = useRef<HTMLInputElement>(null);

  const selectedArea = deliveryAreas.find((area) => area.id === deliveryAreaId) ?? deliveryAreas[0];
  const flexibleDelivery = selectedArea?.id === "other-area";
  const isPickup = selectedArea?.id === "pickup";

  const normalizedCoupon = appliedCoupon.trim().toUpperCase();
  const coupon = coupons[normalizedCoupon];
  const discount = coupon && subtotal >= coupon.minSubtotal ? coupon.discount(subtotal) : 0;

  // FIX 1.1: delivery fee is 0 when cart is empty
  const deliveryFee = useMemo(() => {
    if (!lines.length) return 0;
    if (!selectedArea) return 0;
    if (flexibleDelivery || isPickup) return 0;
    return subtotal >= selectedArea.minimumOrder ? selectedArea.fee : selectedArea.fee + 100;
  }, [lines.length, selectedArea, flexibleDelivery, isPickup, subtotal]);

  const total = lines.length > 0 ? Math.max(0, subtotal - discount + deliveryFee) : 0;
  const loyaltyPoints = useMemo(() => Math.floor(total / 100), [total]);

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const rule = coupons[code];
    if (!rule) {
      setCouponStatus("error");
      setAppliedCoupon("");
      return;
    }
    if (subtotal < rule.minSubtotal) {
      setCouponStatus("min_not_met");
      setAppliedCoupon("");
      return;
    }
    setAppliedCoupon(code);
    setCouponStatus("success");
  }

  function handleAutoFillCoupon() {
    setCouponInput("ZAIQA15");
    setTimeout(() => couponInputRef.current?.focus(), 50);
  }

  function validateName(value: string) {
    return value.trim().length < 2 ? "Name is required." : "";
  }
  function validatePhoneField(value: string) {
    if (!value.trim()) return "Phone number is required.";
    if (!validatePhone(value)) return "Enter a valid Pakistani mobile number (e.g. 0312-1234567).";
    return "";
  }
  function validateAddress(value: string) {
    if (!isPickup && value.trim().length < 10) return "Please enter a more complete address (at least 10 characters).";
    return "";
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!lines.length) {
      setError("Add at least one item before checkout.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const nameVal = String(form.get("customerName") ?? "");
    const phoneVal = String(form.get("phone") ?? "");
    const addressVal = String(form.get("address") ?? "");

    const nErr = validateName(nameVal);
    const pErr = validatePhoneField(phoneVal);
    const aErr = validateAddress(addressVal);

    setNameError(nErr);
    setPhoneError(pErr);
    setAddressError(aErr);
    setTouched({ name: true, phone: true, address: true });

    if (nErr || pErr || aErr) return;

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: nameVal,
          phone: phoneVal,
          address: addressVal,
          notes: String(form.get("notes") ?? ""),
          deliveryAreaId,
          couponCode: normalizedCoupon,
          paymentMethod,
          items: lines.map((line) => ({
            menuItemId: line.menuItemId,
            quantity: line.quantity,
            name: line.name,
            price: line.price,
            addons: line.addons,
            comment: line.comment
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
              Use <span className="font-black text-charcoal">ZAIQA15</span> for 15% off orders Rs. 999+.{" "}
              <button
                type="button"
                onClick={handleAutoFillCoupon}
                className="inline-flex items-center gap-1 rounded-full bg-ember/10 px-2 py-0.5 text-xs font-black text-ember hover:bg-ember/20"
              >
                Tap to apply
              </button>
            </p>
            {lines.length > 0 && (
              <p>
                This order earns{" "}
                <span className="font-black text-chilli">
                  {loyaltyPoints} loyalty {loyaltyPoints !== 1 ? "points" : "point"}
                </span>{" "}
                after confirmation.{" "}
                <span className="inline-flex items-center gap-0.5 text-xs text-stone-500" title="Points are redeemed for discounts on future orders. Every Rs. 100 = 1 point.">
                  <Info size={12} />
                  <span className="sr-only">Points are redeemed for discounts on future orders.</span>
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={submitOrder} className="surface overflow-hidden" noValidate>
        <div className="border-b border-stone-200 bg-charcoal p-5 text-white">
          <h1 className="font-display text-3xl font-bold">Checkout</h1>
          <p className="mt-2 text-sm text-orange-100">Submit your order, then confirm it instantly on WhatsApp.</p>
        </div>

        <div className="grid gap-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div className="grid gap-2">
              <label htmlFor={nameId} className="text-sm font-bold text-charcoal">
                Name <span className="text-chilli" aria-hidden="true">*</span>
              </label>
              <input
                id={nameId}
                name="customerName"
                required
                aria-required="true"
                aria-describedby={nameError ? nameErrId : undefined}
                aria-invalid={nameError ? "true" : "false"}
                className={`${inputClass} ${nameError ? "border-chilli focus:border-chilli focus:ring-chilli/20" : ""}`}
                placeholder="Your name"
                onBlur={(e) => {
                  setTouched((t) => ({ ...t, name: true }));
                  setNameError(validateName(e.target.value));
                }}
              />
              {nameError && touched.name && (
                <p id={nameErrId} role="alert" className="flex items-center gap-1 text-xs font-bold text-chilli">
                  <XCircle size={13} aria-hidden /> {nameError}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <label htmlFor={phoneId} className="text-sm font-bold text-charcoal">
                Phone <span className="text-chilli" aria-hidden="true">*</span>
              </label>
              <input
                id={phoneId}
                name="phone"
                type="tel"
                required
                aria-required="true"
                aria-describedby={phoneError ? phoneErrId : undefined}
                aria-invalid={phoneError ? "true" : "false"}
                className={`${inputClass} ${phoneError ? "border-chilli focus:border-chilli focus:ring-chilli/20" : ""}`}
                placeholder="03XX-XXXXXXX"
                onBlur={(e) => {
                  setTouched((t) => ({ ...t, phone: true }));
                  setPhoneError(validatePhoneField(e.target.value));
                }}
              />
              {phoneError && touched.phone && (
                <p id={phoneErrId} role="alert" className="flex items-center gap-1 text-xs font-bold text-chilli">
                  <XCircle size={13} aria-hidden /> {phoneError}
                </p>
              )}
            </div>
          </div>

          {/* Address — hidden/optional for pickup */}
          <div className="grid gap-2">
            <label htmlFor={addressId} className="text-sm font-bold text-charcoal">
              {isPickup ? (
                <>Pickup notes <span className="text-xs font-normal text-stone-500">(optional)</span></>
              ) : (
                <>Address <span className="text-chilli" aria-hidden="true">*</span></>
              )}
            </label>
            {isPickup ? (
              <textarea
                id={addressId}
                name="address"
                rows={2}
                className={inputClass}
                placeholder="Any notes for pickup (optional)"
              />
            ) : (
              <>
                <textarea
                  id={addressId}
                  name="address"
                  required
                  aria-required="true"
                  aria-describedby={addressError ? addressErrId : undefined}
                  aria-invalid={addressError ? "true" : "false"}
                  rows={3}
                  className={`${inputClass} ${addressError ? "border-chilli focus:border-chilli focus:ring-chilli/20" : ""}`}
                  placeholder="House, street, block, area, nearest landmark"
                  onBlur={(e) => {
                    setTouched((t) => ({ ...t, address: true }));
                    setAddressError(validateAddress(e.target.value));
                  }}
                />
                {addressError && touched.address && (
                  <p id={addressErrId} role="alert" className="flex items-center gap-1 text-xs font-bold text-chilli">
                    <XCircle size={13} aria-hidden /> {addressError}
                  </p>
                )}
              </>
            )}
            {isPickup && (
              <p className="flex items-center gap-1.5 rounded-lg bg-cream p-3 text-xs leading-5 text-stone-700">
                <CheckCircle2 size={14} className="shrink-0 text-coriander" aria-hidden />
                You&apos;ll pick this up at {business.kitchenArea}. Ready in 20–30 min.
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-bold text-charcoal">
              Delivery area <span className="text-chilli" aria-hidden="true">*</span>
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Delivery area">
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
                    {area.eta} -{" "}
                    {area.id === "other-area"
                      ? "fee confirmed on WhatsApp"
                      : area.id === "pickup"
                        ? "Free"
                        : formatCurrency(area.fee)}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs leading-5 text-stone-500">
              If your area is not listed, choose &quot;Other Multan area&quot; and Zahra&apos;s team will confirm delivery on WhatsApp.
            </p>
          </div>

          {/* Coupon with Apply button */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="coupon-input" className="text-sm font-bold text-charcoal">Coupon</label>
              <div className="flex gap-2">
                <input
                  id="coupon-input"
                  ref={couponInputRef}
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    setCouponStatus("idle");
                    if (!e.target.value.trim()) setAppliedCoupon("");
                  }}
                  className={`${inputClass} flex-1 min-w-0`}
                  placeholder="ZAIQA15"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="shrink-0 rounded-md border border-ember bg-ember/10 px-3 text-sm font-black text-ember hover:bg-ember hover:text-white transition"
                >
                  Apply
                </button>
              </div>
              {couponStatus === "success" && (
                <p className="flex items-center gap-1 text-xs font-bold text-coriander">
                  <CheckCircle2 size={13} aria-hidden /> {normalizedCoupon} applied — {coupon?.label}
                </p>
              )}
              {couponStatus === "error" && (
                <p className="flex items-center gap-1 text-xs font-bold text-chilli">
                  <XCircle size={13} aria-hidden /> Invalid coupon code.
                </p>
              )}
              {couponStatus === "min_not_met" && (
                <p className="flex items-center gap-1 text-xs font-bold text-chilli">
                  <XCircle size={13} aria-hidden /> Minimum order Rs. {coupons[couponInput.trim().toUpperCase()]?.minSubtotal} not met.
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="payment-method" className="text-sm font-bold text-charcoal">
                Payment <span className="text-chilli" aria-hidden="true">*</span>
              </label>
              <select
                id="payment-method"
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
                className={inputClass}
                aria-required="true"
              >
                <option value="cash_on_delivery">Cash on delivery</option>
                <option value="easypaisa_jazzcash">Easypaisa / JazzCash</option>
                <option value="bank_transfer">Bank transfer</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="order-notes" className="text-sm font-bold text-charcoal">Notes</label>
            <textarea id="order-notes" name="notes" rows={3} className={inputClass} placeholder="Less spicy, extra sauce, pickup time..." />
          </div>

          <div className="rounded-lg bg-cream p-4">
            <Line label="Subtotal" value={formatCurrency(subtotal)} />
            <Line label={`Discount${discount ? ` (${normalizedCoupon})` : ""}`} value={`-${formatCurrency(discount)}`} />
            <Line
              label="Delivery"
              value={isPickup ? "Free (Pickup)" : flexibleDelivery ? "Confirm on WhatsApp" : formatCurrency(deliveryFee)}
            />
            <div className="mt-3 border-t border-stone-200 pt-3">
              <Line label="Total" value={formatCurrency(total)} strong />
            </div>
          </div>

          {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-bold text-chilli" role="alert">{error}</p> : null}

          {/* FIX 1.1: disabled + aria-disabled when cart is empty */}
          <button
            type="submit"
            disabled={loading || !lines.length}
            aria-disabled={!lines.length ? "true" : "false"}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating order..." : lines.length === 0 ? "Add items to place order" : "Place Order"}
            <ArrowRight size={18} />
          </button>
          {!lines.length && (
            <p className="text-center text-xs text-stone-500">
              <Link href="/menu" className="font-black text-ember underline">Browse the menu</Link> to add items.
            </p>
          )}
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
        <Line label="Loyalty earned" value={`${order.loyaltyPointsEarned} ${order.loyaltyPointsEarned !== 1 ? "points" : "point"}`} />
      </div>

      <div className="relative mt-6 overflow-hidden rounded-lg border border-stone-200">
        <Image
          src="/images/order/order-confirmed.webp"
          alt="Zaiqa Junction order confirmed banner"
          width={1200}
          height={720}
          className="h-auto w-full object-cover"
          priority
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary">
          <MessageCircle size={18} /> Confirm on WhatsApp
        </a>
        <Link href="/menu" className="btn-secondary">
          Add another order
        </Link>
      </div>

      <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
        {(
          [
            ["Confirmed", "Order accepted by kitchen", ShieldCheck],
            ["Preparing", "Freshly cooked and packed", Truck],
            ["Delivered", "Review request sent", BadgeCheck]
          ] as const
        ).map(([title, text, Icon]) => (
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
