// components/sections/Hero.tsx
"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "@/components/interaction/TextReveal";
import HeroScene from "@/components/sections/hero/HeroScene";
import { useUIStore } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);

function SceneLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-transparent">
      <span className="animate-pulse font-mono text-sm text-white/50">
        Loading spatial assets...
      </span>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  const [isExploring, setIsExploring] = useState(false);

  useEffect(() => {
    if (isExploring) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.documentElement.style.touchAction = "none";
      document.body.style.touchAction = "none";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.style.touchAction = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.style.touchAction = "";
      document.body.style.touchAction = "";
    };
  }, [isExploring]);

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
      className="relative bg-transparent"
      style={{ height: "100svh", width: "100%" }}
    >
      <div
        ref={mediaRef}
        data-lenis-prevent="true"
        onWheel={(e) => isExploring && e.stopPropagation()}
        onTouchMove={(e) => isExploring && e.stopPropagation()}
        className={`origin-top will-change-transform transition-all duration-700 bg-[linear-gradient(253deg,#ededed_0%,#ffffff_50%,#cfcfcf_100%)] ${
          isExploring
            ? "fixed inset-0 z-50 scale-100 rounded-none opacity-100"
            : "absolute inset-0 z-0 overflow-hidden"
        }`}
      >
        <Suspense fallback={<SceneLoader />}>
          <HeroScene />
        </Suspense>
      </div>

      <div
        ref={uiRef}
        className={`pointer-events-none absolute inset-0 z-10 will-change-transform transition-opacity duration-500 ${
          isExploring ? "opacity-0" : "opacity-100"
        }`}
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
      </div>

      <button
        onClick={() => setIsExploring(!isExploring)}
        className={`bottom-8 right-8 z-[60] flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-gray-600 shadow-xl backdrop-blur-md transition-transform hover:scale-110 active:scale-95 md:bottom-12 md:right-12 ${
          isExploring ? "fixed " : "absolute"
        }`}
        aria-label={isExploring ? "Exit explore mode" : "Explore 3D model"}
      >
        {isExploring ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        )}
      </button>
    </section>
  );
}
