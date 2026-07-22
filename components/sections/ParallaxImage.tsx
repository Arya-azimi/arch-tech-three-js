"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUIStore } from "@/lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Parallax image reveal: an overflow-hidden mask with an oversized inner layer
 * (height 120%, offset -10%) that translates on the y-axis at a different speed
 * than the page, plus a clip-path wipe on first entry (spec `parallax_image_reveal`).
 *
 * `background` is any CSS background value (gradient stand-in for imagery).
 */
export default function ParallaxImage({
  background,
  className = "",
  style,
  label,
}: {
  background: string;
  className?: string;
  style?: CSSProperties;
  label?: string;
}) {
  const maskRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  useEffect(() => {
    if (reducedMotion || !maskRef.current || !imgRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax y-translation tied to scroll.
      gsap.fromTo(
        imgRef.current,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: maskRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      // Clip-path reveal on entry.
      gsap.fromTo(
        maskRef.current,
        { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 1.5,
          ease: "expo.inOut",
          scrollTrigger: { trigger: maskRef.current, start: "top 85%" },
        },
      );
    }, maskRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={maskRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
      data-cursor="link"
      data-cursor-label={label}
    >
      <div
        ref={imgRef}
        className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform"
        style={{ background }}
      />
    </div>
  );
}
