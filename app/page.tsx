import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChefHat,
  Clock,
  MapPin,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck
} from "lucide-react";
import { HeroCarousel3D } from "@/components/hero-carousel-3d";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { business } from "@/lib/config";
import { buildWhatsAppUrl, formatCurrency } from "@/lib/format";
import { listDeliveryAreas, listMenuItems, listReviews } from "@/lib/store";

export const metadata: Metadata = {
  title: "Order Homemade Pakistani Food Direct",
  description:
    "Order Zaiqa Junction best sellers directly online: Shahi Handi, Zinger Booster, loaded fries, wraps, and family deals with WhatsApp confirmation."
};

export default async function HomePage() {
  const [items, reviews, areas] = await Promise.all([listMenuItems(), listReviews(), listDeliveryAreas()]);
  const bestSellers = items.filter((item) => item.popular).slice(0, 6);

  return (
    <>
      <HeroCarousel3D />

      <section className="bg-charcoal py-8 text-white">
        <div className="container-pad grid gap-4 md:grid-cols-4">
          {([
            ["Direct orders", "Lower fees, faster repeat ordering", ShoppingBag],
            ["6 PM - 1 AM", "Evening and late-night delivery", Clock],
            ["WhatsApp confirm", "Customer receives instant order proof", MessageCircle],
            ["Local delivery", "Delivery and pickup options", Truck]
          ] as const).map(([title, text, Icon]) => (
            <div key={String(title)} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.08] p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-cream text-ember">
                <Icon size={20} />
              </span>
              <span>
                <span className="block font-black">{String(title)}</span>
                <span className="mt-1 block text-sm text-orange-100">{String(text)}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream py-14 sm:py-20">
        <div className="container-pad">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Best sellers"
              title="Food that converts first-time visitors into direct customers"
              description="A native mobile menu with real photos, prices, and one-tap cart actions beats PDF menus for speed and trust."
            />
            <Link href="/menu" className="btn-secondary">
              Full Menu <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bestSellers.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="container-pad grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="/images/whatsapp/zaiqa-20.jpg"
              alt="Zaiqa Junction menu and deals"
              fill
              sizes="(min-width: 1024px) 45vw, 92vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeader
              eyebrow="Why choose us"
              title="The comfort of a home kitchen with the polish of a premium delivery brand"
              description="Trust is the biggest conversion lever for homemade food. Every page reinforces freshness, hygiene, reviews, direct confirmation, and transparent delivery."
            />
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {([
                ["Freshly prepared", "Orders are cooked close to delivery time for better taste.", ChefHat],
                ["Hygiene-first kitchen", "Clean prep zones, covered storage, and careful packing.", ShieldCheck],
                ["Real customer proof", "Foodpanda, WhatsApp, and website reviews in one place.", Star],
                ["Repeat order perks", "Coupons and loyalty points encourage customers to come back.", BadgeCheck]
              ] as const).map(([title, text, Icon]) => (
                <div key={String(title)} className="rounded-lg border border-stone-200 bg-cream p-4">
                  <Icon className="text-ember" size={22} />
                  <p className="mt-3 font-black text-charcoal">{String(title)}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{String(text)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-14 text-white sm:py-20">
        <div className="container-pad">
          <SectionHeader
            eyebrow="Reviews"
            title="Customers already trust the food"
            description="Bring review proof from WhatsApp, Foodpanda, Instagram, and direct website orders into a single trust layer."
            tone="dark"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {reviews.slice(0, 4).map((review) => (
              <article key={review.id} className="rounded-lg border border-white/10 bg-white/[0.08] p-5">
                <div className="flex text-saffron">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-orange-50">{review.quote}</p>
                <p className="mt-4 text-sm font-black text-white">{review.name}</p>
                <p className="text-xs uppercase tracking-wide text-orange-200">{review.source}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-14 sm:py-20">
        <div className="container-pad grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeader
            eyebrow="Delivery areas"
            title="Clear local delivery rules reduce checkout friction"
            description="Customers see fees, ETAs, and minimum orders before they submit the checkout form."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {areas.map((area) => (
              <div key={area.id} className="surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-charcoal">{area.name}</p>
                    <p className="mt-1 text-sm text-stone-600">{area.eta}</p>
                  </div>
                  <MapPin className="text-ember" size={20} />
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <span>Delivery fee</span>
                  <span className="font-black">{formatCurrency(area.fee)}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span>Minimum</span>
                  <span className="font-black">{formatCurrency(area.minimumOrder)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="container-pad">
          <div className="rounded-lg bg-charcoal p-6 text-white shadow-glow sm:p-8 lg:flex lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-saffron">Ready to switch from app fees?</p>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Order direct, confirm on WhatsApp.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-orange-50">
                Checkout online, send confirmation on WhatsApp, and keep Foodpanda as a convenient fallback.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
              <Link href="/order" className="btn-primary">
                Order Now <ArrowRight size={18} />
              </Link>
              <a
                href={buildWhatsAppUrl("Assalam o Alaikum Zaiqa Junction, I want today's best deal.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-coriander px-5 py-3 text-sm font-black text-white"
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
