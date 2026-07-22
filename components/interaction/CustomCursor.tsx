"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useUIStore } from "@/lib/store";

/**
 * Magnetic custom cursor with mix-blend-difference.
 *
 * - A small dot follows the pointer with lerp physics (0.15).
 * - `data-cursor` attributes on hovered elements switch state:
 *     link | draggable | video | three  (see spec `custom_cursor.states`).
 * - Disabled entirely for touch devices and reduced-motion users.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useUIStore((s) => s.reducedMotion);
  const cursor = useUIStore((s) => s.cursor);
  const cursorLabel = useUIStore((s) => s.cursorLabel);
  const setCursor = useUIStore((s) => s.setCursor);

  // Pointer tracking + lerp loop.
  useEffect(() => {
    if (reducedMotion) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    document.documentElement.classList.add("custom-cursor-active");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    const LERP = 0.15;

    const ringX = gsap.quickSetter(ringRef.current, "x", "px");
    const ringY = gsap.quickSetter(ringRef.current, "y", "px");
    const dotX = gsap.quickSetter(dotRef.current, "x", "px");
    const dotY = gsap.quickSetter(dotRef.current, "y", "px");

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      // Dot tracks 1:1 for precision.
      dotX(e.clientX);
      dotY(e.clientY);

      // Hit-test for interaction intent via data-cursor attribute.
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      if (el) {
        const state = el.getAttribute("data-cursor") || "default";
        const label = el.getAttribute("data-cursor-label") || "";
        setCursor(state as never, label);
      } else {
        setCursor("default");
      }
    };

    const render = () => {
      pos.x += (target.x - pos.x) * LERP;
      pos.y += (target.y - pos.y) * LERP;
      ringX(pos.x);
      ringY(pos.y);
    };

    window.addEventListener("pointermove", onMove);
    gsap.ticker.add(render);

    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.ticker.remove(render);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [reducedMotion, setCursor]);

  // Animate ring appearance per interaction state.
  useEffect(() => {
    if (reducedMotion || !ringRef.current) return;
    const map: Record<string, { scale: number; opacity: number }> = {
      default: { scale: 1, opacity: 1 },
      link: { scale: 2.6, opacity: 1 },
      draggable: { scale: 3.2, opacity: 1 },
      video: { scale: 3.4, opacity: 1 },
      three: { scale: 3.2, opacity: 1 },
    };
    const cfg = map[cursor] ?? map.default;
    gsap.to(ringRef.current, {
      scale: cfg.scale,
      opacity: cfg.opacity,
      duration: 0.4,
      ease: "expo.out",
    });
    if (labelRef.current) {
      gsap.to(labelRef.current, {
        opacity: cursorLabel ? 1 : 0,
        duration: 0.3,
      });
    }
  }, [cursor, cursorLabel, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white mix-blend-difference"
        style={{ marginLeft: -20, marginTop: -20 }}
      >
        <span
          ref={labelRef}
          className="whitespace-nowrap text-[9px] font-medium uppercase tracking-widest text-white opacity-0"
        >
          {cursorLabel}
        </span>
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
        style={{ marginLeft: -3, marginTop: -3 }}
      />
    </div>
  );
}
