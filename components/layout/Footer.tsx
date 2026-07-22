// components/layout/Footer.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/interaction/MagneticButton";
import { useUIStore } from "@/lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Twitter / X", href: "https://twitter.com" },
];

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  // انیمیشن پرده‌ای (Curtain reveal)
  useEffect(() => {
    if (reducedMotion || !rootRef.current || !innerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { yPercent: -20 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <footer
      id="contact"
      ref={rootRef}
      className="relative z-0 min-h-[90vh] overflow-hidden bg-[#0a0a0a] text-[#f4f4f2] selection:bg-[var(--accent)] selection:text-black"
    >
      <div
        ref={innerRef}
        className="flex min-h-[90vh] flex-col justify-between px-6 py-12 md:px-16 lg:px-24"
      >
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Arch Tech Studio is ready for your Projects</span>
          </div>
        </div>

        <div className="py-16 md:py-24">
          <div className="mt-6">
            <h2 className="font-display text-5xl font-light tracking-tight md:text-8xl lg:text-9xl">
              Let&apos;s shape
            </h2>
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-8">
              <a
                href="mailto:studio@archtech.com"
                data-cursor="link"
                className="font-display text-5xl font-light tracking-tight text-white/90 underline decoration-[var(--accent)] underline-offset-[0.15em] transition-colors duration-300 hover:text-[var(--accent)] md:text-8xl lg:text-9xl"
              >
                tomorrow.
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-12 border-t border-white/10 pt-12 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-8">
            {SOCIALS.map((s) => (
              <MagneticButton
                key={s.label}
                as="a"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors"
              >
                ↗ {s.label}
              </MagneticButton>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 md:flex-row">
          <p>© 2026 Arch Tech Studio. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
