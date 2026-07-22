"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/interaction/MagneticButton";
import TextReveal from "@/components/interaction/TextReveal";
import { useUIStore } from "@/lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Behance", href: "https://behance.net" },
];

/**
 * Massive-typography CTA footer (tecnoarreda inspiration). The footer sits
 * behind the page (z -1) and is revealed as the previous section scrolls up,
 * creating a curtain effect. Includes a live local-time display and magnetic
 * social links.
 */
export default function Footer() {
  const [time, setTime] = useState("");
  const rootRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  // Live local time (spec: "London 14:30" style).
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    update();
    const id = window.setInterval(update, 1000 * 15);
    return () => window.clearInterval(id);
  }, []);

  // Curtain reveal: inner content parallaxes up as the footer enters view.
  useEffect(() => {
    if (reducedMotion || !rootRef.current || !innerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { yPercent: -30 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "top top",
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
      className="relative z-0 min-h-[80vh] overflow-hidden bg-[var(--text-primary)] text-[var(--background)]"
    >
      <div
        ref={innerRef}
        className="grid-shell flex min-h-[80vh] flex-col justify-between py-[8vh]"
      >
        <div className="flex items-start justify-between text-xs uppercase tracking-widest">
          <span>Arch Tech — Est. 2019</span>
          <span className="tabular-nums">Milan {time}</span>
        </div>

        <div className="py-[6vh]">
          <TextReveal
            as="h2"
            text="Let's build something"
            className="font-display text-h1 leading-[0.9]"
          />
          <a
            href="mailto:studio@archtech.com"
            data-cursor="link"
            className="font-display text-h1 leading-[0.9] underline decoration-[var(--accent)] underline-offset-[0.1em]"
          >
            enduring.
          </a>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex gap-6">
            {SOCIALS.map((s) => (
              <MagneticButton
                key={s.label}
                as="a"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm"
              >
                {s.label}
              </MagneticButton>
            ))}
          </div>

          {/* Newsletter with animated underline */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="group relative w-full max-w-sm"
          >
            <label htmlFor="newsletter" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter"
              type="email"
              required
              placeholder="Email address"
              className="w-full bg-transparent py-2 text-body text-[var(--background)] placeholder:text-[var(--background)]/50 focus:outline-none"
            />
            <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-focus-within:scale-x-100" />
            <button
              type="submit"
              data-cursor="link"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-xs uppercase tracking-widest"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
