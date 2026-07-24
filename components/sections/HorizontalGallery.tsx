"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PROJECTS = [
  {
    id: 1,
    title: "Residential",
    subtitle: "Bogalin, CH",
    year: "2024",
    color: "#8a887d",
  },
  {
    id: 2,
    title: "Commercial",
    subtitle: "Paris, FR",
    year: "2023",
    color: "#a5a7a6",
  },
  {
    id: 3,
    title: "Architecture",
    subtitle: "Campania, IT",
    year: "2024",
    color: "#c8a287",
  },
  {
    id: 4,
    title: "Interior",
    subtitle: "Madrid, ES",
    year: "2023",
    color: "#4f6373",
  },
  {
    id: 5,
    title: "Product",
    subtitle: "Milan, IT",
    year: "2024",
    color: "#8d6455",
  },
  {
    id: 6,
    title: "Commercial",
    subtitle: "Canary, IT",
    year: "2023",
    color: "#b2b4b3",
  },
];

export default function HorizontalGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const scroll = scrollRef.current;
    const lastCard = lastCardRef.current;

    if (!section || !scroll || !lastCard) return;

    const getScrollAmount = () => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // در موبایل: جابه‌جایی طوری محاسبه می‌شود که کارت آخر در مرکز قرار گیرد
        const cardRect = lastCard.getBoundingClientRect();
        const scrollRect = scroll.getBoundingClientRect();
        const lastCardCenterOffset =
          cardRect.left - scrollRect.left + cardRect.width / 2;
        return -(lastCardCenterOffset - window.innerWidth / 2);
      }

      // در دسکتاپ: چسبیدن دقیق به لبه راست (بدون فضای خالی اضافی)
      return -(scroll.scrollWidth - window.innerWidth);
    };

    const ctx = gsap.context(() => {
      gsap.to(scroll, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.abs(getScrollAmount())}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full max-w-[100vw]">
      <section
        ref={sectionRef}
        className="relative h-screen w-full overflow-hidden bg-[var(--background)] text-[var(--text-primary)]"
      >
        <div
          ref={scrollRef}
          className="relative flex h-full w-max flex-nowrap items-center gap-12 px-6 md:px-24"
        >
          {/* Compass Tracks - Top */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-[12vh] h-2 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px)",
              backgroundSize: "3vw 100%",
            }}
          />

          {/* Compass Tracks - Bottom */}
          <div
            className="pointer-events-none absolute bottom-[12vh] left-0 right-0 h-2 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px)",
              backgroundSize: "3vw 100%",
            }}
          />

          {/* Intro Block */}
          <div className="flex w-[85vw] shrink-0 flex-col justify-center pr-12 md:w-[35vw]">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] opacity-70">
              Selected Works
            </p>
            <h2 className="mb-8 font-serif text-5xl leading-[1.1] md:text-7xl">
              Projects that hold
              <br />
              the light.
            </h2>
            <p className="font-mono text-xs uppercase tracking-widest opacity-50">
              Drag or scroll horizontally &rarr;
            </p>
          </div>

          {/* Gallery Items */}
          {PROJECTS.map((project, index) => {
            const isLast = index === PROJECTS.length - 1;
            return (
              <div
                key={project.id}
                ref={isLast ? lastCardRef : null}
                className="relative flex h-full shrink-0 flex-col items-center justify-center"
              >
                {/* Image Container */}
                <div
                  className="peer group relative h-[55vh] w-[80vw] cursor-pointer overflow-hidden rounded-xl transition-[width] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:w-[80vw] md:h-[60vh] md:w-[22vw] md:hover:w-[38vw]"
                  style={{ backgroundColor: project.color }}
                >
                  <div className="absolute inset-0 bg-black/40 transition-opacity duration-700 group-hover:opacity-0" />
                </div>

                {/* Sibling 1: Normal State */}
                <div className="pointer-events-none absolute bottom-[4vh] flex w-full justify-center font-mono text-[10px] uppercase tracking-widest opacity-80 transition-all duration-500 peer-hover:translate-y-2 peer-hover:opacity-0">
                  <span className="whitespace-nowrap">0{index + 1}</span>
                </div>

                {/* Sibling 2: Hover State */}
                <div className="pointer-events-none absolute bottom-[4vh] flex w-full -translate-y-2 justify-center font-mono text-[10px] uppercase tracking-widest opacity-0 transition-all duration-500 peer-hover:translate-y-0 peer-hover:opacity-100">
                  <span className="whitespace-nowrap">
                    0{index + 1} &mdash; {project.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
