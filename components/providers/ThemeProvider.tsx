"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/store";

/**
 * Applies the adaptive light/dark theme by writing `data-theme` onto <html>,
 * and wires `prefers-reduced-motion` into the global store so GSAP/Lenis can
 * disable motion instantly (see accessibility requirements).
 */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const setReducedMotion = useUIStore((s) => s.setReducedMotion);

  // Initialize theme from storage / system preference (client-only).
  useEffect(() => {
    const stored = window.localStorage.getItem("archtech-theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, [setTheme]);

  // Reflect theme onto the document + persist.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("archtech-theme", theme);
  }, [theme]);

  // Track reduced-motion preference reactively.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [setReducedMotion]);

  return <>{children}</>;
}
