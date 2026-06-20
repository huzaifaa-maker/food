"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ComponentType, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  ChefHat,
  Clock,
  Flame,
  HeartHandshake,
  Instagram,
  Leaf,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Timer,
  Truck,
  UtensilsCrossed
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/cart-provider";
import { business, chef } from "@/lib/config";
import { categories } from "@/lib/data";
import { buildWhatsAppUrl, formatCurrency } from "@/lib/format";
import type { DeliveryArea, MenuItem, Review } from "@/lib/types";
import { galleryImages, resolveMenuImage } from "@/lib/visuals";

type PremiumHomeProps = {
  items: MenuItem[];
  reviews: Review[];
  areas: DeliveryArea[];
};

type Icon = ComponentType<{ size?: number; className?: string; fill?: string }>;

const ease = [0.22, 1, 0.36, 1] as const;

const heroFacts = [
  { label: "Rated", value: "4.9/5" },
  { label: "Average ETA", value: "25-35 min" },
  { label: "Prep style", value: "Small batch" }
];

const trustPillars: Array<{ title: string; text: string; icon: Icon }> = [
  {
    title: "Clean home kitchen",
    text: "Dedicated prep surfaces, covered storage, and sealed dispatch for every order.",
    icon: ShieldCheck
  },
  {
    title: "Fresh ingredients promise",
    text: "Buns, greens, gravies, sauces, and sides are prepared in small daily batches.",
    icon: Leaf
  },
  {
    title: "Real order confirmation",
    text: "Every website cart turns into a WhatsApp confirmation before cooking starts.",
    icon: MessageCircle
  },
  {
    title: "Hot delivery windows",
    text: "Local delivery zones keep the food moving while the texture still matters.",
    icon: Truck
  }
];

const hygieneBadges = ["Fresh gloves", "Sealed packaging", "Covered prep", "Same-day sauces"];

const orderSteps: Array<{ title: string; text: string; icon: Icon }> = [
  {
    title: "Choose your dish",
    text: "Browse filtered favorites with clear photos, spice level, and prep timing.",
    icon: UtensilsCrossed
  },
  {
    title: "Confirm on WhatsApp",
    text: "Your cart opens with the full order message ready for fast confirmation.",
    icon: MessageCircle
  },
  {
    title: "Cooked in small batches",
    text: "The kitchen starts after confirmation so the order is fresh, not waiting.",
    icon: ChefHat
  },
  {
    title: "Delivered hot",
    text: "Sealed packaging and local ETAs keep dinner simple and predictable.",
    icon: PackageCheck
  }
];

const faqs = [
  {
    question: "How do I place an order?",
    answer: "Add items to the cart, open checkout, then confirm the prepared order message on WhatsApp."
  },
  {
    question: "Do you cook after confirmation?",
    answer: "Yes. Orders are prepared in small batches after confirmation so sauces, buns, and fries stay fresh."
  },
  {
    question: "What is the usual delivery time?",
    answer: "Nearby orders are usually delivered in 25-35 minutes. Wider zones may take 35-55 minutes."
  },
  {
    question: "Can I order family deals?",
    answer: "Yes. Family portions and bundle deals are available in the menu and can be confirmed directly on WhatsApp."
  }
];

export function PremiumHome({ items, reviews, areas }: PremiumHomeProps) {
  const availableItems = useMemo(() => items.filter((item) => item.available), [items]);
  const bestSellers = useMemo(
    () => availableItems.filter((item) => item.popular).slice(0, 6),
    [availableItems]
  );
  const featured =
    availableItems.find((item) => item.id === "zinger-booster") ||
    bestSellers[0] ||
    availableItems[0];

  return (
    <div className="overflow-hidden bg-charcoal text-cream">
      <CinematicHero />
      <MenuShowcase items={availableItems} bestSellers={bestSellers} />
      {featured ? <TodaysSpecial item={featured} /> : null}
      <TrustSection reviews={reviews} />
      <ChefStory />
      <FoodGallery />
      <Testimonials reviews={reviews} />
      <OrderingProcess />
      <DeliveryAreas areas={areas} />
      <FaqSection />
      <InstagramFeed />
      <ContactSection areas={areas} />
    </div>
  );
}

function CinematicHero() {
  const heroRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    if (shouldReduceMotion) {
      video.pause();
    } else {
      video.defaultPlaybackRate = 1;
      video.playbackRate = 1;
      void video.play().catch(() => undefined);
    }
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".hero-copy > *",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.95, stagger: 0.1, ease: "power3.out", delay: 0.15 }
      );

      gsap.fromTo(
        ".hero-orbit-chip",
        { opacity: 0, y: 72, rotate: -7 },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.55
        }
      );

      gsap.fromTo(
        ".hero-video-panel",
        { opacity: 0, x: 36 },
        { opacity: 1, x: 0, duration: 1.1, ease: "power3.out", delay: 0.2 }
      );
    }, heroRef);

    return () => context.revert();
  }, [shouldReduceMotion]);

  return (
    <section ref={heroRef} className="relative min-h-svh overflow-hidden bg-charcoal" aria-label="Zaiqa Junction hero">
      <div className="grid min-h-svh grid-cols-1 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
        <div className="relative z-10 order-2 flex items-center pb-24 pt-10 sm:pb-20 lg:order-1 lg:pt-28 xl:pt-32">
          <div className="pointer-events-none absolute inset-0 bg-charcoal" />
          <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-16 bg-gradient-to-b from-charcoal/80 to-transparent lg:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent lg:block xl:w-24" />

          <div className="container-pad relative w-full">
            <div className="hero-copy max-w-xl lg:max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-cream/8 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-saffron sm:text-[11px]">
                <Sparkles size={14} />
                Slow-brewed. Freshly packed.
              </p>
              <h1 className="mt-4 text-balance font-display text-[clamp(2.35rem,8vw,5.5rem)] font-black leading-[0.94] text-cream sm:mt-5 sm:text-[clamp(2.75rem,6.5vw,7.8rem)] sm:leading-[0.92]">
                Steaming comfort, made cinematic.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-cream/82 sm:mt-5 sm:text-base sm:leading-7 sm:text-cream/78 lg:text-lg">
                Premium homemade chai, burgers, handis, wraps, and sides cooked in small batches, packed hygienically,
                and confirmed directly on WhatsApp before dispatch.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                <MagneticLink href="/order" variant="primary">
                  <ShoppingBag size={18} />
                  Order Now
                </MagneticLink>
                <MagneticLink href="#menu" variant="secondary">
                  View Menu
                  <ArrowRight size={18} />
                </MagneticLink>
              </div>

              <div className="mt-7 grid max-w-2xl grid-cols-3 gap-2 sm:mt-10 sm:gap-3">
                {heroFacts.map((fact) => (
                  <div key={fact.label} className="hero-orbit-chip rounded-lg border border-cream/10 bg-cream/[0.07] p-2.5 sm:p-3">
                    <p className="text-base font-black text-cream sm:text-lg lg:text-2xl">{fact.value}</p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-cream/52 sm:text-[10px] sm:tracking-[0.14em]">
                      {fact.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hero-video-panel relative order-1 min-h-[42svh] sm:min-h-[48svh] lg:order-2 lg:min-h-svh">
          <video
            ref={heroVideoRef}
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay={!shouldReduceMotion}
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/menu/elaichi-chai.webp"
            aria-hidden="true"
          >
            <source src="/videos/chai-hero-4k.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-charcoal to-transparent lg:hidden" />
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-10 bg-gradient-to-r from-charcoal/70 to-transparent sm:w-16 lg:block" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-charcoal to-transparent" />
    </section>
  );
}

function MagneticLink({
  href,
  children,
  variant
}: {
  href: string;
  children: React.ReactNode;
  variant: "primary" | "secondary";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const shouldReduceMotion = useReducedMotion();

  function handleMove(event: MouseEvent<HTMLAnchorElement>) {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.14;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function reset() {
    if (ref.current) ref.current.style.transform = "translate3d(0, 0, 0)";
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={
        variant === "primary"
          ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ember px-5 py-3 text-sm font-black text-white shadow-glow transition duration-300 hover:bg-saffron hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-charcoal"
          : "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-cream/20 bg-cream/8 px-5 py-3 text-sm font-black text-cream backdrop-blur transition duration-300 hover:border-cream/45 hover:bg-cream/14 focus:outline-none focus:ring-2 focus:ring-cream/40 focus:ring-offset-2 focus:ring-offset-charcoal"
      }
    >
      {children}
    </Link>
  );
}

function Reveal({
  id,
  children,
  className = ""
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 42 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.72, ease }}
      viewport={{ once: true, amount: 0.18 }}
    >
      {children}
    </motion.section>
  );
}

function SectionIntro({
  eyebrow,
  title,
  text,
  align = "left",
  tone = "dark"
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  const titleClass = tone === "light" ? "text-charcoal" : "text-cream";
  const textClass = tone === "light" ? "text-charcoal/65" : "text-cream/65";

  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-ember">{eyebrow}</p>
      <h2 className={`mt-3 text-balance font-display text-3xl font-black leading-tight sm:text-5xl ${titleClass}`}>
        {title}
      </h2>
      {text ? <p className={`mt-4 text-sm leading-7 sm:text-base ${textClass}`}>{text}</p> : null}
    </div>
  );
}

function MenuShowcase({ items, bestSellers }: { items: MenuItem[]; bestSellers: MenuItem[] }) {
  const [active, setActive] = useState("best");

  const filters = useMemo(
    () => [
      { id: "best", label: "Best sellers" },
      { id: "all", label: "All" },
      ...categories.map((category) => ({ id: category.id, label: category.name }))
    ],
    []
  );

  const filtered = useMemo(() => {
    if (active === "best") return bestSellers.length ? bestSellers : items.slice(0, 6);
    if (active === "all") return items.slice(0, 9);
    return items.filter((item) => item.categoryId === active).slice(0, 9);
  }, [active, bestSellers, items]);

  return (
    <Reveal id="menu" className="relative bg-charcoal py-16 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/60 to-transparent" />
      <div className="container-pad">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            eyebrow="Best sellers"
            title="Dish-first cards, filtered for cravings."
            text="No PDF menu boards. Every card uses a dish-focused image matched from the item name, with price, prep time, and direct add-to-cart."
          />
          <Link href="/menu" className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md border border-cream/15 px-4 text-sm font-bold text-cream/80 transition hover:border-ember hover:text-cream">
            Full Menu <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActive(filter.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
                active === filter.id
                  ? "border-ember bg-ember text-white shadow-glow"
                  : "border-cream/12 bg-cream/[0.06] text-cream/70 hover:border-ember/55 hover:text-cream"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.32, ease }}
              >
                <ProductCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </Reveal>
  );
}

function TodaysSpecial({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const image = resolveMenuImage(item);

  return (
    <Reveal id="todays-special" className="bg-[#111111] py-16 sm:py-24">
      <div className="container-pad grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="relative min-h-[460px] overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 44vw, 92vw"
            className="object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-saffron">Today only</p>
              <p className="mt-1 text-2xl font-black text-white">{formatCurrency(item.price)}</p>
            </div>
            <span className="rounded-full bg-cream px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-charcoal">
              {item.prepTime} min
            </span>
          </div>
        </div>

        <div>
          <SectionIntro
            eyebrow="Today's special"
            title={item.name}
            text="A limited nightly favorite for customers who want the home-kitchen comfort with a premium, hot-on-arrival finish."
          />
          <p className="mt-5 max-w-xl text-base leading-8 text-cream/72">{item.description}</p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              ["Signature sauce", "Layered after prep"],
              ["Spice", item.spiceLevel],
              ["Promise", "Fresh batch"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-cream/10 bg-cream/[0.06] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cream/45">{label}</p>
                <p className="mt-2 text-sm font-black capitalize text-cream">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => addItem(item)} className="btn-primary">
              Add Special <ShoppingBag size={18} />
            </button>
            <a
              href={buildWhatsAppUrl(`Assalam o Alaikum ${business.name}, I want to order ${item.name}.`)}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              WhatsApp Order <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function TrustSection({ reviews }: { reviews: Review[] }) {
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 4.9;

  return (
    <Reveal className="bg-cream py-16 text-charcoal sm:py-24">
      <div className="container-pad">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionIntro
            eyebrow="Why customers trust us"
            title="Home-cooked, but never casual about hygiene."
            text="Trust is built before the first bite: clean prep, fresh ingredients, clear ETAs, and real customer feedback."
            tone="light"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {trustPillars.map(({ title, text, icon: IconComponent }) => (
              <div key={title} className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-[0_18px_50px_rgba(15,15,15,0.08)]">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-charcoal text-saffron">
                  <IconComponent size={21} />
                </span>
                <p className="mt-4 font-black text-charcoal">{title}</p>
                <p className="mt-2 text-sm leading-6 text-charcoal/65">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-charcoal p-5 text-cream">
            <p className="text-3xl font-black">{averageRating.toFixed(1)}</p>
            <div className="mt-2 flex text-ember" aria-label={`${averageRating.toFixed(1)} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={16} fill="currentColor" />
              ))}
            </div>
            <p className="mt-3 text-sm text-cream/65">Customer rating from approved reviews.</p>
          </div>
          {hygieneBadges.map((badge) => (
            <div key={badge} className="rounded-lg border border-charcoal/10 bg-white p-5">
              <BadgeCheck className="text-coriander" size={24} />
              <p className="mt-4 font-black text-charcoal">{badge}</p>
              <p className="mt-2 text-sm leading-6 text-charcoal/62">Part of the kitchen dispatch checklist.</p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function ChefStory() {
  return (
    <Reveal id="about" className="bg-charcoal py-16 sm:py-24">
      <div className="container-pad grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <SectionIntro
            eyebrow="Chef story"
            title={`Meet ${chef.name}`}
            text={chef.bio}
          />
          <p className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-saffron">{chef.title}</p>
          <div className="mt-8 grid gap-3">
            {chef.highlights.map((highlight, index) => {
              const icons = [HeartHandshake, ChefHat, Award];
              const IconComponent = icons[index] ?? HeartHandshake;
              return (
                <div key={highlight} className="flex gap-4 rounded-lg border border-cream/10 bg-cream/[0.06] p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-ember text-white">
                    <IconComponent size={20} />
                  </span>
                  <p className="text-sm leading-6 text-cream/72">{highlight}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
            <Image
              src="/images/menu/kitchen.webp"
              alt="Warm kitchen prep space with spices and cooking tools"
              fill
              sizes="(min-width: 1024px) 42vw, 92vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
          </div>
          <div className="absolute bottom-4 left-4 rounded-lg border border-cream/15 bg-charcoal/80 p-4 backdrop-blur-md">
            <p className="text-3xl font-black text-ember">{chef.yearsExperience}+</p>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cream/62">Years cooking</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function FoodGallery() {
  return (
    <Reveal id="gallery" className="bg-[#111111] py-16 sm:py-24">
      <div className="container-pad">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            eyebrow="Food gallery"
            title="Real dishes, warm light, no stock-menu clutter."
            text="A focused look at the food customers actually order: burgers, handis, fries, wraps, sides, and chai."
          />
          <p className="max-w-xs text-sm leading-6 text-cream/55">
            Images are lazy-loaded and served as optimized WebP assets for fast browsing.
          </p>
        </div>

        <div className="mt-8 grid auto-rows-[220px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {galleryImages.map((image, index) => (
            <motion.figure
              key={image.src}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.28, ease }}
              className={`group relative overflow-hidden rounded-lg ${index === 0 || index === 2 ? "lg:col-span-2" : ""}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw"
                className="object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-transparent to-transparent opacity-70 transition group-hover:opacity-45" />
            </motion.figure>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function Testimonials({ reviews }: { reviews: Review[] }) {
  const visibleReviews = reviews.filter((review) => review.approved).slice(0, 4);

  return (
    <Reveal id="reviews" className="bg-cream py-16 text-charcoal sm:py-24">
      <div className="container-pad">
        <SectionIntro
          eyebrow="Customer testimonials"
          title="The proof is in repeat orders."
          text="Short, real customer reviews from WhatsApp, Instagram, the website, and delivery platforms."
          align="center"
          tone="light"
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {visibleReviews.map((review) => (
            <article key={review.id} className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-[0_18px_50px_rgba(15,15,15,0.07)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black text-charcoal">{review.name}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-charcoal/45">{review.source}</p>
                </div>
                <div className="flex text-ember" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} size={15} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="mt-5 text-base leading-7 text-charcoal/72">"{review.quote}"</p>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function OrderingProcess() {
  return (
    <Reveal className="bg-charcoal py-16 sm:py-24">
      <div className="container-pad">
        <SectionIntro
          eyebrow="Ordering process"
          title="Designed for quick direct orders."
          text="The flow is simple on mobile: choose food, confirm on WhatsApp, and receive a clear ETA."
          align="center"
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {orderSteps.map(({ title, text, icon: IconComponent }, index) => (
            <div key={title} className="rounded-lg border border-cream/10 bg-cream/[0.06] p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-ember text-white">
                  <IconComponent size={20} />
                </span>
                <span className="font-display text-3xl font-black text-cream/12">0{index + 1}</span>
              </div>
              <p className="mt-5 font-black text-cream">{title}</p>
              <p className="mt-2 text-sm leading-6 text-cream/62">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function DeliveryAreas({ areas }: { areas: DeliveryArea[] }) {
  return (
    <Reveal className="bg-[#111111] py-16 sm:py-24">
      <div className="container-pad grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <SectionIntro
          eyebrow="Delivery areas"
          title="Clear zones, clear minimums, clear timing."
          text="Direct orders work best when expectations are transparent before the kitchen starts cooking."
        />

        <div className="grid gap-3">
          {areas.filter((area) => area.active).map((area) => (
            <div key={area.id} className="grid gap-4 rounded-lg border border-cream/10 bg-cream/[0.06] p-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="flex items-center gap-2 font-black text-cream">
                  <MapPin size={17} className="text-ember" />
                  {area.name}
                </p>
                <p className="mt-2 text-sm text-cream/60">Minimum order {formatCurrency(area.minimumOrder)}</p>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="rounded-full bg-cream/10 px-3 py-2 font-bold text-cream">{area.eta}</span>
                <span className="rounded-full bg-ember px-3 py-2 font-black text-white">
                  {area.fee === 0 ? "Free" : formatCurrency(area.fee)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function FaqSection() {
  return (
    <Reveal className="bg-cream py-16 text-charcoal sm:py-24">
      <div className="container-pad grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionIntro
          eyebrow="FAQ"
          title="Questions before dinner?"
          text="The common order details customers usually ask before sending a WhatsApp confirmation."
          tone="light"
        />

        <div className="grid gap-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-lg border border-charcoal/10 bg-white p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-charcoal">
                {faq.question}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-charcoal text-cream transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-7 text-charcoal/68">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function InstagramFeed() {
  const posts = galleryImages.slice(0, 5);

  return (
    <Reveal className="bg-charcoal py-16 sm:py-24">
      <div className="container-pad">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionIntro
            eyebrow="Instagram feed"
            title="Fresh from the kitchen grid."
            text="A social-style feed built for real dish photos, customer cravings, and quick WhatsApp conversion."
          />
          <a
            href={business.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md border border-cream/15 px-4 text-sm font-bold text-cream/80 transition hover:border-ember hover:text-cream"
          >
            <Instagram size={17} />
            Follow
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {posts.map((post, index) => (
            <a
              key={post.src}
              href={business.social.instagram}
              target="_blank"
              rel="noreferrer"
              className={`group relative overflow-hidden rounded-lg ${index === 0 ? "col-span-2 row-span-2 sm:col-span-2" : ""}`}
            >
              <span className="block aspect-square" />
              <Image
                src={post.src}
                alt={post.alt}
                fill
                sizes="(min-width: 1024px) 20vw, 46vw"
                className="object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute inset-0 grid place-items-center bg-charcoal/0 text-cream opacity-0 transition group-hover:bg-charcoal/45 group-hover:opacity-100">
                <Instagram size={22} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function ContactSection({ areas }: { areas: DeliveryArea[] }) {
  const primaryArea = areas.find((area) => area.active);
  const whatsappUrl = buildWhatsAppUrl(`Assalam o Alaikum ${business.name}, I want to place an order.`);
  const contactFacts: Array<{ label: string; value: string; icon: Icon }> = [
    { label: "Open", value: business.hours, icon: Clock },
    { label: "Fresh promise", value: "Cooked after confirmation", icon: Flame },
    { label: "Payment", value: "Cash on delivery", icon: BadgeCheck }
  ];

  return (
    <Reveal id="contact" className="bg-[#111111] py-16 sm:py-24">
      <div className="container-pad grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div>
          <SectionIntro
            eyebrow="Contact"
            title="Order directly from the home kitchen."
            text="Skip the generic delivery-app feel. Confirm your order directly, get the ETA, and receive food packed with care."
          />

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-cream/10 bg-cream/[0.06] p-5 transition hover:border-ember/55">
              <MessageCircle className="text-ember" size={24} />
              <p className="mt-4 font-black text-cream">WhatsApp order</p>
              <p className="mt-2 text-sm text-cream/62">{business.phoneDisplay}</p>
            </a>
            <a href={`tel:${business.phoneDisplay.replaceAll("-", "")}`} className="rounded-lg border border-cream/10 bg-cream/[0.06] p-5 transition hover:border-ember/55">
              <Phone className="text-ember" size={24} />
              <p className="mt-4 font-black text-cream">Call kitchen</p>
              <p className="mt-2 text-sm text-cream/62">{business.hours}</p>
            </a>
          </div>
        </div>

        <div className="rounded-lg border border-cream/10 bg-cream/[0.06] p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-md bg-ember text-white">
              <Timer size={22} />
            </span>
            <div>
              <p className="font-black text-cream">Tonight's estimate</p>
              <p className="text-sm text-cream/62">{primaryArea?.eta ?? "25-45 min"} after confirmation</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {contactFacts.map(({ label, value, icon: ContactIcon }) => {
              return (
                <div key={label} className="flex items-center gap-3 border-t border-cream/10 pt-3">
                  <ContactIcon size={18} className="text-saffron" />
                  <p className="text-sm text-cream/62">
                    <span className="font-black text-cream">{label}</span> {value}
                  </p>
                </div>
              );
            })}
          </div>

          <Link href="/order" className="btn-primary mt-7 w-full">
            Start Order <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
