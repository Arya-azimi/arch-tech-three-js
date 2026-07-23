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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 z-50 flex w-full items-center justify-between p-6 mix-blend-difference md:px-12 md:py-8 text-white"
    >
      <div data-cursor="link" className="font-display text-xl tracking-tight">
        Arch Tech
      </div>

      <div className="flex items-center gap-8">
        {mounted && (
          <button
            onClick={toggleTheme}
            data-cursor="link"
            className="font-mono text-[10px] uppercase tracking-widest opacity-70 transition-opacity hover:opacity-100"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        )}

        <button
          data-cursor="link"
          className="group flex flex-col gap-[5px] p-2"
          aria-label="Menu"
        >
          <span className="h-px w-6 origin-right bg-white transition-transform duration-300 group-hover:scale-x-75" />
          <span className="h-px w-6 origin-right bg-white transition-transform duration-300 delay-75 group-hover:scale-x-100" />
        </button>
      </div>
    </header>
  );
}
