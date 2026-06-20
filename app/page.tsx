import type { Metadata } from "next";
import { AboutChef } from "@/components/about-chef";
import { ContactDeliverySection } from "@/components/contact-delivery-section";
import { FeaturedMenu } from "@/components/featured-menu";
import { FullMenuPhotoSection } from "@/components/full-menu-photo-section";
import { GallerySection } from "@/components/gallery-section";
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { TestimonialsSection } from "@/components/testimonials-section";
import { TrustBar } from "@/components/trust-bar";
import { WhyChooseUs } from "@/components/why-choose-us";
import { listDeliveryAreas, listMenuItems, listReviews } from "@/lib/store";

export const metadata: Metadata = {
  title: "Fresh Homemade Meals Delivered to Your Doorstep",
  description:
    "Order fresh homemade Pakistani food from Zaiqa Junction. Hygienic home kitchen, authentic taste, small-batch cooking, and fast local delivery with WhatsApp confirmation."
};

export default async function HomePage() {
  const [items, reviews, areas] = await Promise.all([listMenuItems(), listReviews(), listDeliveryAreas()]);
  const approvedReviews = reviews.filter((review) => review.approved);

  return (
    <>
      <HeroSection />
      <TrustBar />
      <WhyChooseUs />
      <FeaturedMenu items={items} />
      <FullMenuPhotoSection />
      <AboutChef />
      <TestimonialsSection reviews={approvedReviews} />
      <HowItWorks />
      <GallerySection />
      <ContactDeliverySection areas={areas} />
    </>
  );
}
