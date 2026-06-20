"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import type { MenuItem } from "@/lib/types";
import type { Variants } from "framer-motion";

type BestSellersProps = {
  items: MenuItem[];
};

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: delay * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
};

export function BestSellers({ items }: BestSellersProps) {
  const popularItems = items.filter((item) => item.popular).slice(0, 4);

  if (!popularItems.length) {
    return null;
  }

  return (
    <section id="best-sellers" className="bg-[#0F0F0F] py-16 text-white">
      <div className="container-pad">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Best sellers"
            title="Our kitchen favorites that guests keep ordering"
            description="Each dish is handpicked for premium flavor, generous portions, and reliable delivery from our home kitchen."
            tone="dark"
          />
          <Link href="/menu" className="btn-secondary">
            Browse full menu <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {popularItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={reveal}
              custom={index}
            >
              <ProductCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
