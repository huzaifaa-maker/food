import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { FloatingCtas } from "@/components/floating-ctas";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { AddToCartSheet } from "@/components/add-to-cart-sheet";
import { CartToast } from "@/components/cart-toast";
import { PageTransition } from "@/components/page-transition";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { business } from "@/lib/config";
import { reviews as seedReviews } from "@/lib/data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: "Zaiqa Junction | Premium Homemade Food Delivered",
    template: "%s | Zaiqa Junction"
  },
  description:
    "Order premium homemade Pakistani food from Zaiqa Junction. Hygienic home kitchen, fresh small-batch cooking, and fast local delivery with WhatsApp confirmation.",
  keywords: [
    "Zaiqa Junction",
    "homemade food delivery",
    "Pakistani food delivery",
    "fresh homemade meals",
    "handi delivery",
    "local food delivery",
    "home kitchen food"
  ],
  openGraph: {
    title: "Zaiqa Junction | Premium Homemade Food Delivered",
    description: "Fresh homemade Pakistani food cooked in a hygienic home kitchen and delivered hot with WhatsApp confirmation.",
    url: business.siteUrl,
    siteName: "Zaiqa Junction",
    images: [
      {
        url: "/images/brand/logo-social.svg",
        width: 1080,
        height: 1080,
        alt: "Zaiqa Junction premium homemade food logo"
      }
    ],
    locale: "en_PK",
    type: "website"
  },
  alternates: {
    canonical: business.siteUrl
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/images/brand/logo-social.svg"
  }
};

const averageRating =
  seedReviews.length > 0
    ? seedReviews.reduce((sum, review) => sum + review.rating, 0) / seedReviews.length
    : undefined;

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: business.name,
  description: business.tagline,
  telephone: business.phoneDisplay,
  email: business.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Multan",
    addressRegion: "Punjab",
    addressCountry: "PK",
    streetAddress: business.kitchenArea
  },
  image: `${business.siteUrl}/images/menu/kitchen.webp`,
  servesCuisine: ["Pakistani", "Fast Food", "Homemade Food"],
  priceRange: "Rs. 30 - Rs. 2999",
  openingHours: "Mo-Su 18:00-01:00",
  acceptsReservations: false,
  ...(averageRating
    ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: averageRating.toFixed(1),
          reviewCount: seedReviews.length
        }
      }
    : {}),
  potentialAction: {
    "@type": "OrderAction",
    target: `${business.siteUrl}/order`
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
        <CartProvider>
          <SiteHeader />
          <main className="pb-[calc(5.25rem+env(safe-area-inset-bottom))] md:pb-0">
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter />
          <AddToCartSheet />
          <CartToast />
          <FloatingWhatsApp />
          <FloatingCtas />
        </CartProvider>
      </body>
    </html>
  );
}
