"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/data";
import { useUIStore } from "@/lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Pinned horizontal-scroll gallery (normalisboring / smeulders inspiration).
 *
 * The section pins when its top reaches the top of the viewport, then the
 * inner track translates on x by (trackWidth - viewportWidth) as the user
 * scrolls vertically — `pin: true`, `scrub: 1`, `ease: none` per spec.
 * Cards have variable widths; the floating project title tracks the pointer
 * on hover.
 */
export default function HorizontalGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const getScrollDistance = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Floating title tracks the pointer within a card.
  const onCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const title = e.currentTarget.querySelector<HTMLElement>("[data-float]");
    if (!title) return;
    const rect = e.currentTarget.getBoundingClientRect();
    gsap.to(title, {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-[var(--background)]"
    >
      <div
        ref={trackRef}
        className="flex h-[100svh] items-center gap-[4vw] px-[var(--grid-margin)] will-change-transform"
      >
        {/* Intro panel */}
        <div className="flex h-full shrink-0 flex-col justify-center pr-[6vw]">
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">
            Selected Works
          </span>
          <h2 className="font-display text-h2 mt-4 max-w-[14ch] leading-none">
            Projects that hold the light.
          </h2>
          <p className="mt-6 max-w-xs text-body text-[var(--text-secondary)]">
            Drag or scroll horizontally →
          </p>
        </div>

        {PROJECTS.map((project, i) => {
          // Alternate widths for a human-scale, editorial rhythm.
          const width = i % 3 === 0 ? "42vw" : i % 3 === 1 ? "30vw" : "36vw";
          return (
            <article
              key={project.id}
              onMouseMove={onCardMove}
              className="group relative h-[70vh] shrink-0 overflow-hidden"
              style={{ width }}
              data-cursor="link"
              data-cursor-label="View"
            >
              <div
                className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105"
                style={{
                  background: `linear-gradient(160deg, ${project.palette[0]}, ${project.palette[1]})`,
                }}
              />
              {/* Floating title that tracks the mouse */}
              <span
                data-float
                className="pointer-events-none absolute left-0 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-2xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                {project.title}
              </span>
              {/* Metadata footer */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white mix-blend-difference">
                <span className="font-mono text-sm">{project.id}</span>
                <div className="text-right">
                  <p className="text-sm">{project.category}</p>
                  <p className="text-xs opacity-70">
                    {project.location} · {project.completionYear}
                  </p>
                </div>
              </div>
            </article>
          );
        })}

        {/* Outro panel */}
        <div className="flex h-full shrink-0 items-center pl-[4vw] pr-[8vw]">
          <a
            href="#configurator"
            data-cursor="link"
            className="font-display text-h3 underline decoration-[var(--accent)] underline-offset-8"
          >
            Configure a piece →
          </a>
        </div>
      </div>
    </section>
  );
}
