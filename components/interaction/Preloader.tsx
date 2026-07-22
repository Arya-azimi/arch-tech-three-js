"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useUIStore } from "@/lib/store";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

/**
 * Zustand-driven percentage preloader (0 → 100) that locks Lenis scroll until
 * complete, then reveals the site with a clip-path curtain. Honors reduced
 * motion by resolving instantly.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const progress = useUIStore((s) => s.loaderProgress);
  const isLoaded = useUIStore((s) => s.isLoaded);
  const setProgress = useUIStore((s) => s.setLoaderProgress);
  const setLoaded = useUIStore((s) => s.setLoaded);
  const reducedMotion = useUIStore((s) => s.reducedMotion);
  const { stop, start } = useSmoothScroll();

  // Simulated asset loading counter.
  useEffect(() => {
    if (isLoaded) return;
    stop();

    if (reducedMotion) {
      setProgress(100);
      setLoaded(true);
      start();
      return;
    }

    const state = { value: 0 };
    const tween = gsap.to(state, {
      value: 100,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.round(state.value)),
      onComplete: () => setLoaded(true),
    });
    return () => {
      tween.kill();
    };
  }, [isLoaded, reducedMotion, setProgress, setLoaded, stop, start]);

  // Curtain-up reveal once loaded.
  useEffect(() => {
    if (!isLoaded || !rootRef.current) return;
    if (reducedMotion) {
      gsap.set(rootRef.current, { display: "none" });
      start();
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => {
        if (rootRef.current) rootRef.current.style.display = "none";
        start();
      },
    });
    tl.to(countRef.current, { opacity: 0, duration: 0.3 })
      .to(barRef.current, { scaleX: 1, duration: 0.4, ease: "expo.inOut" }, "<")
      .to(rootRef.current, {
        yPercent: -100,
        duration: 1,
        ease: "expo.inOut",
      });
    return () => {
      tl.kill();
    };
  }, [isLoaded, reducedMotion, start]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[var(--background)]"
    >
      <div className="font-display text-h1 leading-none text-[var(--text-primary)]">
        Arch Tech
      </div>
      <div className="mt-8 h-px w-48 overflow-hidden bg-[var(--border)]">
        <div
          ref={barRef}
          className="h-full origin-left bg-[var(--accent)]"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>
      <span
        ref={countRef}
        className="mt-4 font-mono text-sm tabular-nums text-[var(--text-secondary)]"
      >
        {String(progress).padStart(3, "0")} — Loading spatial assets
      </span>
    </div>
  );
}
