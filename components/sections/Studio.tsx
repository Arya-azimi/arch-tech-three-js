"use client";

import { useEffect, useRef } from "react";
import TextReveal from "@/components/interaction/TextReveal";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUIStore } from "@/lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Studio() {
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  useEffect(() => {
    if (
      reducedMotion ||
      !pinContainerRef.current ||
      !imageWrapperRef.current ||
      !textRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinContainerRef.current,
          start: "center center",
          end: "+=200%",
          pin: true,
          scrub: 1,
        },
      });

      tl.to(imageWrapperRef.current, {
        width: "100vw",
        height: "100vh",
        borderRadius: "0px",
        ease: "power2.inOut",
        duration: 1.5,
      })
        .fromTo(
          textRef.current,
          { left: "100%", xPercent: 0 },
          {
            left: "0%",
            xPercent: -100,
            ease: "none",
            duration: 3,
          },
          "-=0.5",
        )
        .to(
          imageWrapperRef.current,
          {
            xPercent: -100,
            ease: "power1.inOut",
            duration: 5,
          },
          "+=0.2",
        );
    }, pinContainerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="studio" className="relative bg-[var(--background)] pt-[12vh]">
      <div className="grid-shell items-start">
        <div className="col-span-full lg:col-span-4">
          <span className="font-display block text-[clamp(6rem,18vw,16rem)] leading-none text-[var(--accent)]">
            01
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">
            The Studio
          </span>
        </div>

        <div className="col-span-full mt-8 lg:col-span-5 lg:col-start-6 lg:mt-24">
          <TextReveal
            as="h2"
            text="We design space as a slow, deliberate act."
            className="font-display text-h3 leading-tight"
          />
          <p className="mt-6 max-w-md text-body text-[var(--text-secondary)]">
            Arch Tech is an interdisciplinary studio operating across
            architecture, interior direction and collectible furniture. Every
            commission begins with light, proportion and material — never
            decoration.
          </p>
        </div>
      </div>

      <div
        ref={pinContainerRef}
        className="mt-[10vh] flex h-screen w-full items-center justify-center overflow-hidden relative"
      >
        <div
          ref={imageWrapperRef}
          className="relative flex h-[70vh] w-[90vw] items-center justify-center overflow-hidden rounded-2xl will-change-transform"
          style={{
            background:
              "linear-gradient(135deg, var(--accent), var(--text-primary))",
          }}
        />

        <div className="absolute inset-0 z-10 flex items-center overflow-hidden pointer-events-none">
          <p
            ref={textRef}
            className="absolute whitespace-nowrap font-display text-[clamp(2rem,5vw,5rem)] text-white mix-blend-difference will-change-transform"
          >
            Monolith House, Engadin — 620 m² of board-formed concrete carved
            into an alpine slope.
          </p>
        </div>
      </div>
    </section>
  );
}
