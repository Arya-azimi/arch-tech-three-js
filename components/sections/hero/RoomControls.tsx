import { AnimatePresence, motion } from "framer-motion";
import { useRoomStore, ROOM_PALETTES, ROOM_LAYOUTS } from "@/lib/store";

export default function RoomControls() {
  const introComplete = useRoomStore((s) => s.introComplete);
  const paletteId = useRoomStore((s) => s.paletteId);
  const layout = useRoomStore((s) => s.layout);
  const setPalette = useRoomStore((s) => s.setPalette);
  const setLayout = useRoomStore((s) => s.setLayout);

  return (
    <AnimatePresence>
      {introComplete && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="pointer-events-auto absolute bottom-4 sm:bottom-6 left-1/2 z-20 -translate-x-1/2 w-[92vw] sm:w-auto max-w-[360px] sm:max-w-none"
        >
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/20 bg-white/20 sm:bg-white/10 px-5 py-4 backdrop-blur-xl sm:flex-row sm:gap-8 shadow-2xl">
            {/* Palette */}
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#3a3228] font-bold drop-shadow-md">
                Palette
              </span>
              <div className="flex gap-2.5">
                {ROOM_PALETTES.map((p) => {
                  const active = p.id === paletteId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPalette(p.id)}
                      aria-label={p.name}
                      aria-pressed={active}
                      title={p.name}
                      className={`relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full ring-offset-2 ring-offset-transparent transition-transform hover:scale-110 shadow-lg ${
                        active
                          ? "ring-2 ring-[#3a3228] scale-110"
                          : "ring-1 ring-black/20"
                      }`}
                      style={{
                        background: `conic-gradient(${p.sofa} 0deg 120deg, ${p.wood} 120deg 240deg, ${p.accent} 240deg 360deg)`,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="w-full h-px bg-black/10 sm:hidden" />
            <div className="hidden h-10 w-px bg-black/20 sm:block" />

            {/* Layout */}
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#3a3228] font-bold drop-shadow-md">
                Structure
              </span>
              <div className="flex gap-1.5">
                {ROOM_LAYOUTS.map((l) => {
                  const active = l.id === layout;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLayout(l.id)}
                      aria-pressed={active}
                      title={l.description}
                      className={`rounded-full px-3 py-1.5 sm:px-4 text-xs font-medium transition-all shadow-sm cursor-pointer ${
                        active
                          ? "bg-[#3a3228] text-white scale-105"
                          : "text-[#3a3228] hover:bg-black/10 bg-black/5 border border-black/10"
                      }`}
                    >
                      {l.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="hidden h-10 w-px bg-black/20 sm:block" />

            <div className="hidden sm:flex flex-col items-center gap-1 sm:items-start">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#3a3228]/60 font-bold">
                Interact
              </span>
              <span className="text-xs text-[#3a3228] font-medium flex items-center gap-1">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Drag to Orbit
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
