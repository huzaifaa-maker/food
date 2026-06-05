import type { Metadata } from "next";
import Link from "next/link";
import { Facebook, Instagram, MessageCircle, ShoppingBag } from "lucide-react";
import { CartProvider } from "@/components/cart-provider";
import { FloatingCtas } from "@/components/floating-ctas";
import { SiteHeader } from "@/components/site-header";
import { FloatingParticles3D } from "@/components/floating-particles-3d";
import { business } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/format";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: "Zaiqa Junction | Homemade Pakistani Food Delivery",
    template: "%s | Zaiqa Junction"
  },
  description:
    "Order homemade Pakistani handis, burgers, wraps, fries, and family deals directly from Zaiqa Junction with WhatsApp confirmation and local delivery.",
  keywords: [
    "Zaiqa Junction",
    "homemade food delivery",
    "Pakistani food delivery",
    "handi delivery",
    "zinger burger",
    "Foodpanda alternative",
    "local food delivery"
  ],
  openGraph: {
    title: "Zaiqa Junction | Homemade Pakistani Food Delivery",
    description: "Direct online ordering for fresh homemade Pakistani food, burgers, wraps, and deals.",
    url: business.siteUrl,
    siteName: "Zaiqa Junction",
    images: [
      {
        url: "/images/whatsapp/zaiqa-03.jpg",
        width: 1200,
        height: 630,
        alt: "Zaiqa Junction burgers and homemade food"
      }
    ],
    locale: "en_PK",
    type: "website"
  },
  alternates: {
    canonical: business.siteUrl
  }
};

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: business.name,
  description: business.tagline,
  telephone: business.phoneDisplay,
  image: `${business.siteUrl}/images/whatsapp/zaiqa-03.jpg`,
  servesCuisine: ["Pakistani", "Fast Food", "Homemade Food"],
  priceRange: "Rs. 30 - Rs. 2999",
  openingHours: "Mo-Su 18:00-01:00",
  acceptsReservations: false,
  potentialAction: {
    "@type": "OrderAction",
    target: `${business.siteUrl}/order`
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
        <CartProvider>
          <FloatingParticles3D />
          <SiteHeader />
          <main className="pb-20 md:pb-0">{children}</main>
          <footer className="bg-charcoal text-orange-50">
            <div className="container-pad grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-display text-2xl font-bold text-white">{business.name}</p>
                <p className="mt-3 text-sm leading-6 text-orange-100">{business.tagline}</p>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-white">Direct Ordering</p>
                <div className="mt-3 grid gap-2 text-sm">
                  <Link href="/menu" className="hover:text-saffron">
                    Browse menu
                  </Link>
                  <Link href="/order" className="hover:text-saffron">
                    Checkout
                  </Link>
                  <a href={business.foodpandaUrl} target="_blank" rel="noreferrer" className="hover:text-saffron">
                    Foodpanda
                  </a>
                </div>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-white">Contact</p>
                <div className="mt-3 grid gap-2 text-sm">
                  <a href={buildWhatsAppUrl("Assalam o Alaikum Zaiqa Junction, I want to order.")}>
                    {business.phoneDisplay}
                  </a>
                  <span>{business.hours}</span>
                  <Link href="/contact" className="hover:text-saffron">
                    Delivery areas
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-white">Social</p>
                <div className="mt-4 flex gap-2">
                  <a
                    href={buildWhatsAppUrl("Assalam o Alaikum Zaiqa Junction, I want to order.")}
                    aria-label="WhatsApp"
                    className="grid h-10 w-10 place-items-center rounded-md bg-white/10 text-white hover:bg-coriander"
                  >
                    <MessageCircle size={18} />
                  </a>
                  <a
                    href="https://www.facebook.com/"
                    aria-label="Facebook"
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-md bg-white/10 text-white hover:bg-ember"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href="https://www.instagram.com/"
                    aria-label="Instagram"
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-md bg-white/10 text-white hover:bg-ember"
                  >
                    <Instagram size={18} />
                  </a>
                  <Link
                    href="/order"
                    aria-label="Order online"
                    className="grid h-10 w-10 place-items-center rounded-md bg-white/10 text-white hover:bg-ember"
                  >
                    <ShoppingBag size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </footer>
          <FloatingCtas />
        </CartProvider>
      </body>
    </html>
  );
}
