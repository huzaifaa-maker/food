import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartProvider } from "@/components/cart-provider";
import { FloatingCtas } from "@/components/floating-ctas";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { AddToCartSheet } from "@/components/add-to-cart-sheet";
import { CartToast } from "@/components/cart-toast";
import { PageTransition } from "@/components/page-transition";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { business } from "@/lib/config";
import { listMenuItems, listReviews } from "@/lib/store";
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
    url: new URL("/", business.siteUrl).toString(),
    siteName: "Zaiqa Junction",
    images: [
      {
        url: new URL("/images/brand/logo-social.svg", business.siteUrl).toString(),
        width: 1080,
        height: 1080,
        alt: "Zaiqa Junction premium homemade food logo"
      }
    ],
    locale: "en_PK",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Zaiqa Junction | Premium Homemade Food Delivered",
    description: "Fresh homemade Pakistani food cooked in a hygienic home kitchen and delivered hot with WhatsApp confirmation.",
    images: [new URL("/images/brand/logo-social.svg", business.siteUrl).toString()]
  },
  alternates: {
    canonical: new URL("/", business.siteUrl).toString()
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/images/brand/logo-social.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f4b234"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [items, reviews] = await Promise.all([listMenuItems(), listReviews()]);
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : undefined;

  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    name: business.name,
    url: business.siteUrl,
    description: business.tagline,
    telephone: business.phoneDisplay,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.streetAddress,
      addressLocality: business.addressLocality,
      addressRegion: business.addressRegion,
      addressCountry: business.addressCountry,
      postalCode: business.kitchenArea
    },
    image: new URL("/images/menu/kitchen.webp", business.siteUrl).toString(),
    servesCuisine: ["Pakistani", "Fast Food", "Homemade Food"],
    priceRange: "Rs. 30 - Rs. 2999",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "12:00",
        closes: "02:00"
      }
    ],
    acceptsReservations: false,
    menu: items.slice(0, 10).map((item) => ({
      "@type": "MenuItem",
      name: item.name,
      description: item.description,
      offers: {
        "@type": "Offer",
        priceCurrency: "PKR",
        price: item.price
      }
    })),
    ...(averageRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating.toFixed(1),
            reviewCount: reviews.length,
            bestRating: 5,
            worstRating: 1
          }
        }
      : {}),
    potentialAction: {
      "@type": "OrderAction",
      target: new URL("/order", business.siteUrl).toString()
    },
    sameAs: [business.social.facebook, business.social.instagram, business.social.tiktok, business.social.youtube]
  };

  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="w-full overflow-x-hidden">
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
          <SpeedInsights />
        </CartProvider>
      </body>
    </html>
  );
}
