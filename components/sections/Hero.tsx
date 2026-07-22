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
      <span className="animate-pulse font-mono text-sm text-black/50">
        Building your space…
      </span>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !mediaRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(mediaRef.current, {
        scale: 0.92,
        opacity: 0.6,
        borderRadius: "2vw",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: "100svh", width: "100%" }}
    >
      <div
        ref={mediaRef}
        className="absolute inset-0 will-change-transform bg-[#e9e5dd]"
      >
        <Suspense fallback={<SceneLoader />}>
          <HeroScene />
        </Suspense>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 sm:from-black/20 via-transparent to-black/10" />
      </div>

      <HeroIntro />

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-start px-5 pt-[10vh] sm:px-8 sm:pt-[12vh] md:pt-[16vh] md:px-16 z-10">
        <p className="mb-3 md:mb-6 text-[9px] md:text-xs uppercase tracking-[0.4em] text-[#3a3228] font-bold drop-shadow-sm">
          Architecture — Interior — Furniture
        </p>
        <TextReveal
          as="h1"
          trigger="load"
          delay={2.4}
          text="Design your living space."
          className="max-w-[12ch] font-serif leading-tight text-[#3a3228] drop-shadow-md"
          style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
        />
        <TextReveal
          as="p"
          trigger="load"
          delay={2.7}
          text="Recolour it, restructure it, move through it — an award-driven studio shaping architecture, interiors and collectible furniture."
          className="mt-3 md:mt-6 max-w-[280px] sm:max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-[#3a3228] font-medium drop-shadow-sm"
        />
      </div>

      <RoomControls />
    </section>
  );
}
