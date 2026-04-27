"use client";

import { motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

/**
 * Global page-transition. Each route-level page fades up a touch on mount,
 * and the window is reset to scroll position 0 — so navigation via
 * 'Weiter'-Buttons immer am Anfang der nächsten Seite landet.
 */
export default function Template({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

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
