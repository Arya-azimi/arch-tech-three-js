"use client";

import { useEffect, useRef, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "@/components/interaction/TextReveal";
import RoomControls from "@/components/sections/hero/RoomControls";
import HeroIntro from "@/components/sections/hero/HeroIntro";
import HeroScene from "@/components/sections/hero/HeroScene";
import { useUIStore } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);

function SceneLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#e9e5dd]">
      <span
        className="animate-pulse font-mono text-sm text-black/50"
        style={{ fontFamily: "monospace" }}
      >
        Building your space…
      </span>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  useEffect(() => {
    if (
      reducedMotion ||
      !sectionRef.current ||
      !mediaRef.current ||
      !uiRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      tl.to(
        mediaRef.current,
        {
          scale: 0.92,
          opacity: 0.5,
          borderRadius: "2vw",
          ease: "none",
        },
        0,
      ).to(
        uiRef.current,
        {
          opacity: 0,
          y: -40,
          ease: "none",
        },
        0,
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0a0a0a]"
      style={{ height: "100svh", width: "100%" }}
    >
      <div
        ref={mediaRef}
        className="absolute inset-0 origin-top overflow-hidden will-change-transform"
      >
        <Suspense fallback={<SceneLoader />}>
          <HeroScene />
        </Suspense>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />
      </div>

      <HeroIntro />

      <div
        ref={uiRef}
        className="pointer-events-none absolute inset-0 z-10 will-change-transform"
      >
        <div className="absolute inset-0 flex flex-col justify-start px-8 pt-[16vh] md:px-16">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-white/80">
            Architecture — Interior — Furniture
          </p>
          <TextReveal
            as="h1"
            trigger="load"
            delay={2.4}
            text="Design your living space."
            className="max-w-[14ch] font-serif leading-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
          />
          <TextReveal
            as="p"
            trigger="load"
            delay={2.7}
            text="Recolour it, restructure it, move through it — an award-driven studio shaping architecture, interiors and collectible furniture."
            className="mt-6 max-w-xl text-base leading-relaxed text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.4)]"
          />
        </div>

        <RoomControls />
      </div>
    </section>
  );
}
