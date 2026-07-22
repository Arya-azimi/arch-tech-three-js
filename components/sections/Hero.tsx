"use client";

import { Suspense, useState } from "react";
import HeroScene from "@/components/sections/hero/HeroScene";
import RoomControls from "@/components/sections/hero/RoomControls";
import { useRoomStore, useUIStore } from "@/lib/store";

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
  const introComplete = useRoomStore((s) => s.introComplete);
  const isLoaded = useUIStore((s) => s.isLoaded);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[var(--background)]">
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
