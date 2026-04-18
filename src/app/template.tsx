"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Global page-transition. Each route-level page fades up a touch on mount.
 * Easing matches the spec's premium feel — custom cubic bezier, 400ms.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="contents"
    >
      {children}
    </motion.div>
  );
}
