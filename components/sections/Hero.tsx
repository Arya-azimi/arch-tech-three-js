// components/sections/Hero.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import HeroScene from "@/components/sections/hero/HeroScene";
import RoomControls from "@/components/sections/hero/RoomControls";
import { useUIStore } from "@/lib/store";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

function SceneLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          Preparing environment...
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  const [isExploring, setIsExploring] = useState(false);
  const isLoaded = useUIStore((s) => s.isLoaded);
  const { stop, start } = useSmoothScroll();

  useEffect(() => {
    if (isExploring) {
      stop();
      document.body.style.overflow = "hidden";
    } else {
      start();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isExploring, stop, start]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#e3c2a1] bg-[radial-gradient(circle,rgba(227,194,161,0.78)_0%,rgba(212,177,171,0.62)_100%)]">
      <div className="absolute inset-0 h-full w-full">
        <Suspense fallback={<SceneLoader />}>
          <HeroScene isExploring={isExploring} />
        </Suspense>
      </div>

      {isLoaded && (
        <RoomControls
          isExploring={isExploring}
          onToggleExplore={() => setIsExploring((prev) => !prev)}
        />
      )}
    </section>
  );
}
