import type { Metadata } from "next";
import { ContactDeliverySection } from "@/components/contact-delivery-section";
import { FeaturedMenu } from "@/components/featured-menu";
import { FullMenuPhotoSection } from "@/components/full-menu-photo-section";
import { HeroSection } from "@/components/hero-section";
import { PopularItemsStrip } from "@/components/product-card";
import { TestimonialsSection } from "@/components/testimonials-section";
import { listDeliveryAreas, listMenuItems, listReviews } from "@/lib/store";

export const metadata: Metadata = {
  title: "Order Fresh Homemade Food | Zaiqa Junction Multan",
  description:
    "Order burgers, handi, wraps, fries, and chai from Zaiqa Junction with direct WhatsApp confirmation in Multan."
};

export default async function HomePage() {
  const [items, reviews, areas] = await Promise.all([listMenuItems(), listReviews(), listDeliveryAreas()]);
  const approvedReviews = reviews.filter((review) => review.approved);
  const popularIds = new Set(items.filter((item) => item.available && item.popular).slice(0, 6).map((item) => item.id));
  const featuredItems = items.filter((item) => item.available && !popularIds.has(item.id));

  return (
    <>
      <HeroSection />
      <PopularItemsStrip items={items} />
      <FeaturedMenu items={featuredItems} />
      <FullMenuPhotoSection />
      <TestimonialsSection reviews={approvedReviews} />
      <ContactDeliverySection areas={areas} />
    </>
  );
}
