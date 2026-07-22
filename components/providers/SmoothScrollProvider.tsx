"use client";

import { createContext, useContext, useEffect, useRef } from "react";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUIStore } from "@/lib/store";

/**
 * Smooth virtual scrolling with inertia (Lenis) synced to the GSAP ticker,
 * per the spec's `gsap_lenis_sync`. Exposes the Lenis instance via context so
 * page transitions can stop/start scroll during route changes.
 *
 * ScrollTrigger is registered once, globally, here.
 */

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollContextValue {
  /** Ref to the live Lenis instance (null before mount / when disabled). */
  lenisRef: React.RefObject<Lenis | null>;
  stop: () => void;
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenisRef: { current: null },
  stop: () => {},
  start: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  useEffect(() => {
    // Respect reduced motion: skip smooth-scroll hijacking entirely.
    if (reducedMotion) return;

    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
      wheelMultiplier: 1,
    });

    lenisRef.current = instance;

    // Keep ScrollTrigger in sync with Lenis' virtual scroll position.

    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0, 0);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  const value: SmoothScrollContextValue = {
    lenisRef,
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
  };

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
