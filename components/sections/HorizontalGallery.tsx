"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    const section = sectionRef.current;
    const scroll = scrollRef.current;

    if (!section || !scroll) return;

    // محاسبه دقیق عرض قابل اسکرول
    const getScrollAmount = () => {
      return -(scroll.scrollWidth - window.innerWidth);
    };

    const ctx = gsap.context(() => {
      gsap.to(scroll, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scroll.scrollWidth - window.innerWidth}`,
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
        className="relative h-screen w-full overflow-hidden bg-[var(--background)]"
      >
        <div
          ref={scrollRef}
          className="flex h-full w-max flex-nowrap items-center gap-6 px-6 md:gap-8 md:px-16"
        >
          <div className="flex w-[85vw] shrink-0 flex-col justify-center pr-4 md:w-[35vw]">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] ">
              Selected Works
            </p>
            <h2 className="mb-8 font-serif text-5xl leading-[1.1] md:text-7xl">
              Projects that hold
              <br />
              the light.
            </h2>
            <p className="font-mono text-xs uppercase tracking-widest ">
              Drag or scroll horizontally &rarr;
            </p>
          </div>

          {PROJECTS.map((project, index) => (
            <div
              key={project.id}
              className="group relative h-[65vh] w-[80vw] shrink-0 overflow-hidden transition-transform duration-700 ease-out hover:scale-[0.98] md:h-[75vh] md:w-[22vw]"
              style={{ backgroundColor: project.color }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <div className="translate-y-4 transition-transform duration-500 ease-out group-hover:translate-y-0">
                  <p className="mb-3 font-mono text-xs tracking-widest text-white/60">
                    0{index + 1} — {project.year}
                  </p>
                  <h3 className="mb-2 font-serif text-4xl text-white md:text-4xl">
                    {project.title}
                  </h3>
                  <p className="text-sm font-light tracking-wide text-white/80">
                    {project.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
