// components/layout/Navigation.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useTheme } from "next-themes";
import { useUIStore } from "@/lib/store";

export default function Navigation() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isLoaded = useUIStore((s) => s.isLoaded);
  const reducedMotion = useUIStore((s) => s.reducedMotion);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isLoaded || reducedMotion || !headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out", delay: 0.2 },
    );
  }, [isLoaded, reducedMotion]);

  return (
    <header
      ref={headerRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] flex w-full items-center justify-between p-6 md:px-12 md:py-8"
    >
      <div
        data-cursor="link"
        className="pointer-events-auto mix-blend-difference font-display text-xl tracking-tight text-white relative z-10"
      >
        Arch Tech
      </div>

      <div className="pointer-events-auto flex items-center gap-8">
        {mounted && (
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            data-cursor="link"
            className="mix-blend-difference font-mono text-[10px] uppercase tracking-widest text-white opacity-70 transition-opacity hover:opacity-100 relative z-10"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        )}

        <button
          type="button"
          data-cursor="link"
          className="mix-blend-difference group flex flex-col gap-[5px] p-2 relative z-10"
          aria-label="Menu"
        >
          <span className="h-px w-6 origin-right bg-white transition-transform duration-300 group-hover:scale-x-75" />
          <span className="h-px w-6 origin-right bg-white transition-transform duration-300 delay-75 group-hover:scale-x-100" />
        </button>
      </div>
    </header>
  );
}
