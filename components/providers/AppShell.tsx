"use client";

import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import PageTransition from "@/components/providers/PageTransition";
import CustomCursor from "@/components/interaction/CustomCursor";
import Preloader from "@/components/interaction/Preloader";
import Navigation from "@/components/layout/Navigation";

/**
 * Client-side application shell. Composes the global providers in the correct
 * order so that:
 *   - Theme + reduced-motion state resolve first (ThemeProvider)
 *   - Lenis/GSAP smooth scroll wraps the tree (SmoothScrollProvider)
 *   - Preloader & PageTransition can control Lenis via context
 *   - Global fixed UI (cursor, preloader, nav) mounts once
 *
 * Kept separate from the server `layout.tsx` so the root layout can stay a
 * Server Component while all interactive concerns live here.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SmoothScrollProvider>
        <Preloader />
        <CustomCursor />
        <Navigation />
        <PageTransition>{children}</PageTransition>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}
