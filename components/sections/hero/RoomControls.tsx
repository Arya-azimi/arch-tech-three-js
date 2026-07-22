// components/sections/hero/RoomControls.tsx
"use client";

interface RoomControlsProps {
  isExploring: boolean;
  onToggleExplore: () => void;
}

export default function RoomControls({
  isExploring,
  onToggleExplore,
}: RoomControlsProps) {
  return (
    <div className="absolute bottom-8 right-8 z-30 flex items-center gap-4">
      <button
        onClick={onToggleExplore}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md transition-all hover:bg-black/60 active:scale-95"
        aria-label="Toggle Explore Mode"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </button>
    </div>
  );
}
