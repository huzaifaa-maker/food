"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={pathname === "/" ? "page-transition w-full min-w-0" : "site-header-offset page-transition w-full min-w-0"}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
