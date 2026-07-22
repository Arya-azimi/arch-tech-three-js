import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useRoomStore, useUIStore } from "@/lib/store";

export default function HeroIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLSpanElement>(null);

  const introComplete = useRoomStore((s) => s.introComplete);
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  // Entrance animation
  useEffect(() => {
    if (reducedMotion || !wordRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      wordRef.current,
      { yPercent: 60, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.1, ease: "expo.out", delay: 0.2 },
    ).fromTo(
      subRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.4",
    );
    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  // Exit: split curtain lifts when intro finishes
  useEffect(() => {
    if (!introComplete || !rootRef.current) return;
    if (reducedMotion) {
      gsap.set(rootRef.current, { display: "none" });
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => {
        if (rootRef.current) rootRef.current.style.display = "none";
      },
    });
    tl.to([wordRef.current, subRef.current], {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    })
      .to(
        topRef.current,
        { yPercent: -100, duration: 1.1, ease: "expo.inOut" },
        "-=0.1",
      )
      .to(
        bottomRef.current,
        { yPercent: 100, duration: 1.1, ease: "expo.inOut" },
        "<",
      );
    return () => {
      tl.kill();
    };
  }, [introComplete, reducedMotion]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
    >
      {/* Split curtains */}
      <div ref={topRef} className="absolute inset-x-0 top-0 h-1/2 bg-[#111]" />
      <div
        ref={bottomRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#111]"
      />

      {/* Wordmark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="overflow-hidden">
          <div
            ref={wordRef}
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(3rem, 10vw, 8rem)",
            }}
            className="leading-none text-white"
          >
            Live·In
          </div>
        </div>
        <span
          ref={subRef}
          className="mt-4 font-mono text-xs uppercase tracking-[0.4em] text-white/60"
        >
          Composing your space
        </span>
      </div>
    </div>
  );
}
