"use client";

import {
  useEffect,
  useRef,
  type ComponentType,
  type CSSProperties,
  type ElementType,
} from "react";

import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUIStore } from "@/lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Split-text reveal (custom implementation, no paid SplitText plugin).
 * Splits the provided string into words wrapped in line-masks, then staggers
 * each word up from y:110% with a slight rotation — matching the spec's
 * `text_reveal_standard` choreography (power4.out, stagger 0.02).
 *
 * Triggers on scroll into view, or immediately on load when `trigger="load"`.
 */
export default function TextReveal({
  text,
  as = "div",
  className = "",
  delay = 0,
  trigger = "scroll",
  style,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  trigger?: "scroll" | "load";
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useUIStore((s) => s.reducedMotion);
  const isLoaded = useUIStore((s) => s.isLoaded);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
    if (!words.length) return;

    if (reducedMotion) {
      gsap.set(words, { y: "0%", opacity: 1, rotationZ: 0 });
      return;
    }

    gsap.set(words, {
      y: "110%",
      opacity: 0,
      rotationZ: 5,
      transformOrigin: "0% 50% -50",
    });

    const animateIn = () =>
      gsap.to(words, {
        y: "0%",
        opacity: 1,
        rotationZ: 0,
        transformOrigin: "0% 50% 0",
        stagger: 0.02,
        ease: "power4.out",
        duration: 1.2,
        delay,
      });

    let st: ScrollTrigger | undefined;
    if (trigger === "load") {
      if (isLoaded) animateIn();
    } else {
      st = ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: animateIn,
      });
    }

    return () => {
      st?.kill();
    };
  }, [reducedMotion, delay, trigger, isLoaded]);

  const Tag = as as ComponentType<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
  }>;
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className} style={style}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <span data-word className="inline-block will-change-transform">
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
