import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { FadeInSection } from "@/components/fade-in-section";
import { SectionHeader } from "@/components/section-header";
import type { Review } from "@/lib/types";
import { resolveSafeFoodImage } from "@/lib/visuals";

type TestimonialsSectionProps = {
  reviews: Review[];
};

export function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <FadeInSection id="reviews" className="bg-charcoal py-14 text-white sm:py-20">
      <div className="container-pad">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Customer reviews"
            title="Real feedback from local customers"
            description="Families, office workers, and students trust Zaiqa Junction for fresh homemade food delivered with care."
            tone="dark"
          />
          <div className="flex shrink-0 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3">
              <p className="text-2xl font-black">{average.toFixed(1)}</p>
              <p className="text-xs uppercase tracking-wide text-orange-100">Avg rating</p>
            </div>
            <Link
              href="/reviews"
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-white/20 px-4 text-sm font-bold text-white hover:bg-white/10"
            >
              All reviews <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reviews.slice(0, 4).map((review) => (
            <article key={review.id} className="flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.08] shadow-[0_20px_45px_rgba(0,0,0,0.16)]">
              {review.image ? (
                <div className="relative aspect-[16/10]">
                  <Image
                    src={resolveSafeFoodImage(review.image)}
                    alt={`Food photo from ${review.name}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex text-saffron">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-7 text-orange-50">{review.quote}</p>
                <p className="mt-4 text-sm font-black text-white">{review.name}</p>
                <p className="text-xs uppercase tracking-wide text-orange-200">{review.source}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
