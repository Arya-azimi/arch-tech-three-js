"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useTheme } from "next-themes";
import { useUIStore } from "@/lib/store";
import { NAV_LINKS } from "@/lib/data";

export default function Navigation() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const menuOpen = useUIStore((s) => s.menuOpen);
  const toggleMenu = useUIStore((s) => s.toggleMenu);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);
  const isLoaded = useUIStore((s) => s.isLoaded);
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isLoaded || reducedMotion || !headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out", delay: 0.2 },
    );
  }, [isLoaded, reducedMotion]);

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

  useEffect(() => {
    if (reducedMotion || !tlRef.current) return;
    if (menuOpen) {
      tlRef.current.play();
    } else {
      tlRef.current.reverse();
    }
  }, [menuOpen, reducedMotion]);

  return (
    <>
      <header
        ref={headerRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-[9999] flex w-full items-center justify-between p-6 md:px-12 md:py-8"
      >
        <Link
          href="/"
          data-cursor="link"
          onClick={() => setMenuOpen(false)}
          className="pointer-events-auto mix-blend-difference font-display text-xl tracking-tight text-white relative z-10"
        >
          Arch Tech
        </Link>

        <div className="flex items-center gap-8">
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              data-cursor="link"
              className="pointer-events-auto mix-blend-difference font-mono text-[10px] uppercase tracking-widest text-white opacity-70 transition-opacity hover:opacity-100 relative z-10"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          )}

          <button
            type="button"
            onClick={toggleMenu}
            data-cursor="link"
            className="pointer-events-auto mix-blend-difference group flex flex-col gap-[5px] p-2 relative z-10"
            aria-label="Menu"
          >
            <span className="h-px w-6 origin-right bg-white transition-transform duration-300 group-hover:scale-x-75" />
            <span className="h-px w-6 origin-right bg-white transition-transform duration-300 delay-75 group-hover:scale-x-100" />
          </button>
        </div>
      </header>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] hidden bg-[var(--surface)]"
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
      >
        <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-col justify-center px-[var(--grid-margin)] py-24">
            <span className="mb-8 text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">
              Menu
            </span>
            <ul ref={linksRef} className="space-y-2">
              {NAV_LINKS?.map((link) => (
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
