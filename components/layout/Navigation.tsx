"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useUIStore } from "@/lib/store";
import { NAV_LINKS } from "@/lib/data";
import MagneticButton from "@/components/interaction/MagneticButton";

/**
 * Fixed navigation that transitions transparent → solid on scroll, with a
 * magnetic hamburger→close toggle and a fullscreen overlay that opens via a
 * clip-path circle expansion from the top-right. Links stagger in from
 * y:100% with an expo ease (spec `navigation_system`).
 */
export default function Navigation() {
  const menuOpen = useUIStore((s) => s.menuOpen);
  const toggleMenu = useUIStore((s) => s.toggleMenu);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Solid-on-scroll background.
  useEffect(() => {
    const onScroll = () => {
      if (!headerRef.current) return;
      const solid = window.scrollY > 40;
      headerRef.current.style.setProperty(
        "--nav-bg",
        solid ? "var(--background)" : "transparent",
      );
      headerRef.current.style.setProperty(
        "--nav-border",
        solid ? "var(--border)" : "transparent",
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Build the open/close timeline once.
  useEffect(() => {
    if (reducedMotion) return;
    const overlay = overlayRef.current;
    const links = linksRef.current?.querySelectorAll("[data-navlink] > span");
    if (!overlay || !links) return;

    gsap.set(overlay, {
      clipPath: "circle(0% at 100% 0%)",
      display: "none",
    });
    gsap.set(links, { yPercent: 110 });

    tlRef.current = gsap
      .timeline({ paused: true })
      .set(overlay, { display: "flex" })
      .to(overlay, {
        clipPath: "circle(150% at 100% 0%)",
        duration: 0.8,
        ease: "expo.inOut",
      })
      .to(
        links,
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "expo.out",
        },
        "-=0.4",
      );

    return () => {
      tlRef.current?.kill();
    };
  }, [reducedMotion]);

  // Play / reverse on state change.
  useEffect(() => {
    if (reducedMotion || !tlRef.current) return;
    if (menuOpen) {
      tlRef.current.play();
    } else {
      tlRef.current.reverse();
    }
  }, [menuOpen, reducedMotion]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setMenuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-[500] border-b transition-colors duration-500"
        style={{
          background: "var(--nav-bg, transparent)",
          borderColor: "var(--nav-border, transparent)",
        }}
      >
        <nav className="grid-shell flex items-center justify-between py-5">
          <Link
            href="/"
            data-cursor="link"
            className="font-display text-xl font-medium tracking-tight"
            onClick={() => setMenuOpen(false)}
          >
            Arch&nbsp;Tech
          </Link>

          <div className="flex items-center gap-6">
            <MagneticButton
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              className="text-xs uppercase tracking-widest"
            >
              {theme === "light" ? "Dark" : "Light"}
            </MagneticButton>

            <MagneticButton
              onClick={toggleMenu}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="h-10 w-10"
            >
              <span className="relative block h-3 w-6">
                <span
                  className="absolute left-0 block h-px w-6 bg-current transition-all duration-300"
                  style={{
                    top: menuOpen ? "50%" : 0,
                    transform: menuOpen ? "rotate(45deg)" : "none",
                  }}
                />
                <span
                  className="absolute left-0 bottom-0 block h-px w-6 bg-current transition-all duration-300"
                  style={{
                    bottom: menuOpen ? "50%" : 0,
                    transform: menuOpen ? "rotate(-45deg)" : "none",
                  }}
                />
              </span>
            </MagneticButton>
          </div>
        </nav>
      </header>

      {/* Fullscreen split-screen overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[400] hidden bg-[var(--surface)]"
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
      >
        <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
          {/* Left: huge links */}
          <div className="flex flex-col justify-center px-[var(--grid-margin)] py-24">
            <span className="mb-8 text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">
              Menu
            </span>
            <ul ref={linksRef} className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="overflow-hidden">
                  <Link
                    href={link.href}
                    data-navlink
                    data-cursor="link"
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-h2 leading-none text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
                  >
                    <span className="inline-block">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: featured image canvas */}
          <div
            className="relative hidden lg:block"
            style={{
              background:
                "linear-gradient(135deg, var(--accent), var(--text-primary))",
            }}
            data-cursor="video"
            data-cursor-label="Showreel"
          >
            <div className="absolute bottom-[var(--grid-margin)] left-[var(--grid-margin)] max-w-xs text-[var(--background)]">
              <p className="text-body">
                Architecture, interiors & collectible furniture. Selected works
                2019—2025.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
