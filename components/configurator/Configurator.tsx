"use client";

import dynamic from "next/dynamic";
import ConfiguratorPanel from "@/components/configurator/ConfiguratorPanel";

/**
 * Configurator section. The R3F <Scene> is loaded dynamically with
 * `ssr: false` to avoid hydration mismatches with Three.js / WebGL, per the
 * execution instructions. A lightweight skeleton shows while it loads.
 */
const Scene = dynamic(() => import("@/components/configurator/Scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="animate-pulse font-mono text-sm text-[var(--text-secondary)]">
        Initializing 3D environment…
      </span>
    </div>
  ),
});

export default function Configurator() {
  return (
    <section
      id="configurator"
      className="relative bg-[var(--surface)] py-[10vh]"
    >
      <div className="grid-shell mb-[6vh]">
        <div className="col-span-full">
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">
            Live 3D Configurator
          </span>
          <h2 className="font-display text-h2 mt-4 max-w-[16ch] leading-none">
            Build it in real time.
          </h2>
        </div>
      </div>

      <div className="relative mx-[var(--grid-margin)] h-[80vh] overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--background)] to-[var(--surface)]">
        <div
          className="absolute inset-0"
          data-cursor="three"
          data-cursor-label="Drag to rotate"
        >
          <Scene />
        </div>
        <ConfiguratorPanel />
      </div>
    </section>
  );
}
