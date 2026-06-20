"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Check, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";

export function CartToast() {
  const { toast, dismissToast, itemCount } = useCart();

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(dismissToast, 3200);
    return () => window.clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[60] flex justify-center px-4 md:bottom-6 md:justify-end md:pr-6"
      style={{ bottom: "calc(5.25rem + env(safe-area-inset-bottom))" }}
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-[0_18px_50px_rgba(15,15,15,0.18)] md:max-w-sm">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-coriander text-white">
          <Check size={22} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-charcoal">Added to cart</p>
          <p className="truncate text-xs text-stone-600">{toast.message}</p>
          <p className="mt-0.5 text-[11px] font-bold text-ember">{itemCount} items in cart</p>
        </div>
        <Link
          href="/order"
          onClick={dismissToast}
          className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl bg-ember px-3 text-xs font-black text-white"
        >
          <ShoppingBag size={14} aria-hidden />
          View
        </Link>
        <button
          type="button"
          onClick={dismissToast}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-stone-500"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
