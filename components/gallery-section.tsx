import Image from "next/image";
import { FadeInSection } from "@/components/fade-in-section";
import { SectionHeader } from "@/components/section-header";
import { galleryImages } from "@/lib/visuals";

export function GallerySection() {
  return (
    <FadeInSection id="gallery" className="bg-cream py-14 sm:py-20">
      <div className="container-pad">
        <SectionHeader
          align="center"
          eyebrow="Gallery"
          title="Real food from our home kitchen"
          description="Every photo focuses on one dish or kitchen moment, without flyer graphics or text overlays."
        />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {galleryImages.map((image, index) => (
            <div
              key={image.src}
              className={`relative overflow-hidden rounded-lg shadow-soft ${
                index === 0 || index === 2 ? "row-span-2 aspect-[3/4] sm:aspect-auto sm:min-h-[280px]" : "aspect-square"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
