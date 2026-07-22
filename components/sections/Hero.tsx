// components/sections/Hero.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import HeroScene from "@/components/sections/hero/HeroScene";
import RoomControls from "@/components/sections/hero/RoomControls";
import { useRoomStore, useUIStore } from "@/lib/store";
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
  const introComplete = useRoomStore((s) => s.introComplete);
  const { stop, start } = useSmoothScroll();

  const handleToggleExplore = () => {
    if (!isExploring) {
      // اسکرول نرم استاندارد مرورگر به بالای صفحه
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setTimeout(() => {
        setIsExploring(true);
      }, 200);
    } else {
      setIsExploring(false);
    }
  };

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
    <section className="relative h-screen w-full overflow-hidden bg-[var(--background)]">
      <div className="absolute inset-0 h-full w-full">
        <Suspense fallback={<SceneLoader />}>
          <HeroScene isExploring={isExploring} />
        </Suspense>
      </div>

      <div
        className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-1000 mix-blend-difference ${
          introComplete && !isExploring ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="font-serif text-6xl tracking-tight text-white md:text-8xl">
          Arch Tech
        </h1>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-white/80 md:text-sm">
          Elevating Modern Spaces
        </p>
      </div>

      {isLoaded && (
        <RoomControls
          isExploring={isExploring}
          onToggleExplore={handleToggleExplore}
        />
      )}
    </section>
  );
}
