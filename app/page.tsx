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
    "Browse burgers, handis, wraps, fries, and chai from Zaiqa Junction. Fresh homemade food from Shah Shams, Multan with direct WhatsApp confirmation."
};

export default async function HomePage() {
  const [items, reviews, areas] = await Promise.all([listMenuItems(), listReviews(), listDeliveryAreas()]);
  const approvedReviews = reviews.filter((review) => review.approved);

  return (
    <>
      <HeroSection />
      <PopularItemsStrip items={items} />
      <FeaturedMenu items={items} />
      <FullMenuPhotoSection />
      <TestimonialsSection reviews={approvedReviews} />
      <ContactDeliverySection areas={areas} />
    </>
  );
}
