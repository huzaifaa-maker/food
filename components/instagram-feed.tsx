import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { FadeInSection } from "@/components/fade-in-section";
import { SectionHeader } from "@/components/section-header";
import { business } from "@/lib/config";

const posts = [
  { src: "/images/whatsapp/zaiqa-01.jpg", alt: "Fresh burger with crisp lettuce and sauce" },
  { src: "/images/whatsapp/zaiqa-08.jpg", alt: "Gourmet burger with premium presentation" },
  { src: "/images/whatsapp/zaiqa-10.jpg", alt: "Loaded fries served with a rich dip" },
  { src: "/images/whatsapp/zaiqa-12.jpg", alt: "Crispy chicken chunks with herb garnish" },
  { src: "/images/whatsapp/zaiqa-16.jpg", alt: "Spicy masala fries in a polished takeaway setup" }
] as const;

export function InstagramFeed() {
  return (
    <FadeInSection id="instagram" className="bg-[#111111] py-16 text-white">
      <div className="container-pad">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Instagram feed"
            title="Real kitchen moments from our home food family"
            description="Follow the feed for fresh plating, behind-the-scenes prep, and limited-time specials before they sell out."
            tone="dark"
          />
          <Link
            href={business.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-amber-200 hover:bg-white/10"
          >
            <Instagram size={18} />
            @zaiqajunction
          </Link>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {posts.map((post) => (
            <div key={post.src} className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-soft">
              <Image
                src={post.src}
                alt={post.alt}
                fill
                sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
