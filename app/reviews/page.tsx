import type { Metadata } from "next";
import Image from "next/image";
import { Star } from "lucide-react";
import { ReviewForm } from "@/components/review-form";
import { SectionHeader } from "@/components/section-header";
import { business } from "@/lib/config";
import { listReviews } from "@/lib/store";
import { galleryImages, resolveSafeFoodImage } from "@/lib/visuals";

export const metadata: Metadata = {
  title: "Customer Reviews in Multan",
  description: "Read Zaiqa Junction customer reviews in Multan — ratings, testimonials, and food photos from customers in Shah Rukn E Alam Town and surrounding areas."
};

export default async function ReviewsPage() {
  const reviews = await listReviews();
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: average.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1
    },
    review: reviews.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      },
      reviewBody: review.quote,
      datePublished: review.createdAt?.slice(0, 10)
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />

      <section className="bg-charcoal text-white">
        <div className="container-pad py-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-saffron">Customer proof</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold sm:text-5xl">Reviews that make direct ordering feel safe.</h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.08] px-4 py-3">
              <p className="text-3xl font-black text-white">{average.toFixed(1)}</p>
              <p className="text-xs uppercase tracking-wide text-orange-100">Average rating</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.08] px-4 py-3">
              <p className="text-3xl font-black text-white">{reviews.length}</p>
              <p className="text-xs uppercase tracking-wide text-orange-100">Approved {reviews.length === 1 ? "review" : "reviews"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-12 sm:py-16">
        <div className="container-pad grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <SectionHeader
              eyebrow="Testimonials"
              title="What local customers are saying"
              description="The admin dashboard can approve new website reviews and blend them with Foodpanda, WhatsApp, and Instagram proof."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <article key={review.id} className="surface overflow-hidden">
                  {review.image ? (
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={resolveSafeFoodImage(review.image)}
                        alt={`Food photo from ${review.name}'s review`}
                        fill
                        sizes="45vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="p-5">
                    <div className="flex text-saffron" role="img" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <Star key={index} size={16} fill="currentColor" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-stone-700">{review.quote}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="font-black text-charcoal">{review.name}</p>
                      <p className="rounded-full bg-cream px-2.5 py-1 text-xs font-black text-chilli">{review.source}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <aside className="lg:sticky lg:top-24">
            <ReviewForm />
          </aside>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="container-pad">
          <SectionHeader
            eyebrow="Review gallery"
            title="Food photos customers can inspect before ordering"
            description="Gallery proof is especially valuable for home-based kitchens because it shows actual packaging, portion size, and food finish."
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {galleryImages.map((image) => (
              <div key={image.src} className="relative aspect-square overflow-hidden rounded-lg">
                <Image src={image.src} alt={image.alt} fill sizes="18vw" className="object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
