"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { useUIStore } from "@/lib/store";

/**
 * Route-change transition using Framer Motion AnimatePresence.
 *
 * Sequence (per spec `page_transitions`):
 *   1. block Lenis scroll
 *   2. animate SVG curtain up  (ease [0.76, 0, 0.24, 1], 0.8s)
 *   3. swap DOM (handled by keyed AnimatePresence)
 *   4. animate curtain down
 *   5. restore Lenis scroll
 *
 * `mode="wait"` guarantees the outgoing tree unmounts before the incoming one
 * mounts — the DOM swap the spec calls for.
 */
const EASE = [0.76, 0, 0.24, 1] as const;

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { stop, start } = useSmoothScroll();
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  // Scroll is blocked while the curtain covers the viewport.
  useEffect(() => {
    if (reducedMotion) return;
    stop();
    const t = window.setTimeout(() => start(), 900);
    return () => window.clearTimeout(t);
  }, [pathname, stop, start, reducedMotion]);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        {/* SVG curtain overlay */}
        {!reducedMotion && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[9998] origin-bottom bg-[var(--text-primary)]"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ transformOrigin: "top" }}
          />
        )}
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
