"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUIStore } from "@/lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  {
    title: "Smarter Design, Better Performance",
    desc: "We optimize the design by evaluating materials, methods, and procedures to maximize value and functionality while lowering costs.",
  },
  {
    title: "Turning Vision into Precision",
    desc: "We turn initial concepts into fully realized, practical designs, alongside technical and production drawings.",
  },
  {
    title: "The Right Partners, The Right Results",
    desc: "We select the best partners for the project and strictly supervise them during the production phase.",
  },
  {
    title: "Turnkey Procurement & Installation",
    desc: "We handle all aspects of furniture, fixtures, and equipment—from sourcing and manufacturing to final delivery.",
  },
  {
    title: "Styling & Art Curation",
    desc: "Adding the final layer of soul to the space through curated artwork, bespoke styling, and interior direction.",
  },
  {
    title: "Handover & Beyond",
    desc: "A seamless handover process accompanied by comprehensive maintenance guidelines, ensuring the space matures beautifully.",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useUIStore((s) => s.reducedMotion);
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    if (
      reducedMotion ||
      !sectionRef.current ||
      !lineRef.current ||
      !rightColRef.current ||
      !titleRef.current
    )
      return;

    const ctx = gsap.context(() => {
      // انیمیشن خط عمودی و مراحل
      const steps = gsap.utils.toArray<HTMLElement>(".step-item");

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rightColRef.current,
            start: "top 50%",
            end: "bottom 75%",
            scrub: 1,
          },
        },
      );

      steps.forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0.2, x: 20 },
          {
            opacity: 1,
            x: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: step,
              start: "top 60%",
              end: "top 40%",
              scrub: true,
            },
          },
        );
      });

      // انیمیشن پارالاکس نرم برای تایتل سمت چپ (فقط در حالت دسکتاپ)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.to(titleRef.current, {
          y: () =>
            rightColRef.current!.offsetHeight - titleRef.current!.offsetHeight,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: rightColRef.current,
            start: "top 30%",
            end: "bottom 85%",
            scrub: 1.5, // تاخیر نرم و حس شناور بودن (Parallax Lag)
            invalidateOnRefresh: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const lineColorBase = theme === "dark" ? "bg-white/10" : "bg-black/10";
  const lineColorActive = theme === "dark" ? "bg-white" : "bg-black";
  const textColor = theme === "dark" ? "text-white" : "text-black";
  const mutedText = theme === "dark" ? "text-white/50" : "text-black/50";

  return (
    <section
      ref={sectionRef}
      id="process"
      className={`relative w-full overflow-hidden transition-colors duration-700 ${
        theme === "dark" ? "bg-[#0a0a0a]" : "bg-[#f4f4f2]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            theme === "dark" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute -left-[10%] top-[10%] h-[40vw] w-[40vw] rounded-full bg-emerald-900/10 blur-[120px]" />
          <div className="absolute right-[10%] top-[40%] h-[30vw] w-[30vw] rounded-full bg-amber-900/10 blur-[100px]" />
          <div className="absolute -bottom-[10%] left-[20%] h-[50vw] w-[50vw] rounded-full bg-stone-800/30 blur-[120px]" />
        </div>

        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            theme === "light" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute -left-[10%] top-[10%] h-[40vw] w-[40vw] rounded-full bg-stone-300/40 blur-[120px]" />
          <div className="absolute right-[10%] top-[40%] h-[30vw] w-[30vw] rounded-full bg-amber-100/40 blur-[100px]" />
          <div className="absolute -bottom-[10%] left-[20%] h-[50vw] w-[50vw] rounded-full bg-neutral-300/50 blur-[120px]" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-24 px-6 py-32 md:flex-row md:px-12 md:py-48">
        {/* Left Side: Parallax Title */}
        <div className="shrink-0 md:w-5/12">
          <div ref={titleRef} className="pt-[10vh]">
            <h2
              className={`font-serif text-5xl uppercase leading-[1.05] tracking-tighter md:text-7xl lg:text-8xl ${textColor}`}
            >
              We handle
              <br />
              all <span className="opacity-50">the</span>
              <br />
              <span className="opacity-50">complexity.</span>
            </h2>
          </div>
        </div>

        {/* Right Side: Steps Container */}
        <div
          ref={rightColRef}
          className="relative flex flex-col gap-16 md:w-7/12 md:gap-32"
        >
          <div
            className={`absolute bottom-0 left-[15px] top-4 w-[1px] ${lineColorBase}`}
          />
          <div
            ref={lineRef}
            className={`absolute bottom-0 left-[15px] top-4 w-[1px] origin-top ${lineColorActive}`}
          />

          {STEPS.map((step, index) => (
            <div key={index} className="step-item relative flex gap-8 pl-16">
              <div
                className={`absolute left-[11px] top-2 flex h-[9px] w-[9px] items-center justify-center rounded-full ${lineColorActive}`}
              />
              <span
                className={`shrink-0 pt-1 font-mono text-xs font-medium tracking-widest ${mutedText}`}
              >
                0{index + 1}
              </span>
              <div className="flex flex-col gap-4">
                <h3 className={`font-serif text-3xl md:text-4xl ${textColor}`}>
                  {step.title}
                </h3>
                <p
                  className={`max-w-md font-sans text-sm leading-relaxed md:text-base ${mutedText}`}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
