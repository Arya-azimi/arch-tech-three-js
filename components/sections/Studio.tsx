"use client";

import TextReveal from "@/components/interaction/TextReveal";
import ParallaxImage from "@/components/sections/ParallaxImage";

/**
 * Editorial "Studio" section — brutalist offset grid with oversized numerals
 * (normalisboring inspiration) and a parallax image reveal.
 */
export default function Studio() {
  return (
    <section id="studio" className="relative bg-[var(--background)] py-[12vh]">
      <div className="grid-shell items-start">
        {/* Oversized structural numeral */}
        <div className="col-span-full lg:col-span-4">
          <span className="font-display block text-[clamp(6rem,18vw,16rem)] leading-none text-[var(--accent)]">
            01
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">
            The Studio
          </span>
        </div>

        {/* Offset text block */}
        <div className="col-span-full mt-8 lg:col-span-5 lg:col-start-6 lg:mt-24">
          <TextReveal
            as="h2"
            text="We design space as a slow, deliberate act."
            className="font-display text-h3 leading-tight"
          />
          <p className="mt-6 max-w-md text-body text-[var(--text-secondary)]">
            Arch Tech is an interdisciplinary studio operating across
            architecture, interior direction and collectible furniture. Every
            commission begins with light, proportion and material — never
            decoration.
          </p>
        </div>
      </div>

      {/* Full-width parallax reveal */}
      <div className="mt-[10vh] px-[var(--grid-margin)]">
        <ParallaxImage
          label="View"
          className="h-[70vh] w-full rounded-2xl"
          background="linear-gradient(135deg, var(--accent), var(--text-primary))"
        />
      </div>

      {/* Offset caption */}
      <div className="grid-shell mt-8">
        <div className="col-span-full lg:col-span-4 lg:col-start-9">
          <p className="text-body text-[var(--text-secondary)]">
            Monolith House, Engadin — 620 m² of board-formed concrete carved
            into an alpine slope.
          </p>
        </div>
      </div>
    </section>
  );
}
