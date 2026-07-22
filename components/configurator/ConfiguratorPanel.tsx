"use client";

import {
  useConfiguratorStore,
  MATERIAL_LIBRARY,
  type MaterialType,
} from "@/lib/store";

/**
 * Glassmorphism control panel overlaid on the 3D canvas (spec `ui_overlay`).
 * Reads/writes the Zustand configurator store: color/texture swatches per
 * configurable part, plus module toggles for the modular furniture.
 */

const PARTS: { id: string; label: string; filter: MaterialType[] }[] = [
  { id: "base", label: "Frame & Base", filter: ["fabric", "leather"] },
  { id: "cushions", label: "Cushions", filter: ["fabric", "leather"] },
  { id: "legs", label: "Legs", filter: ["wood", "metal"] },
];

const MODULES: { id: string; label: string }[] = [
  { id: "armrestLeft", label: "Left Arm" },
  { id: "armrestRight", label: "Right Arm" },
  { id: "chaise", label: "Chaise Extension" },
  { id: "ottoman", label: "Ottoman" },
];

export default function ConfiguratorPanel() {
  const partMaterials = useConfiguratorStore((s) => s.partMaterials);
  const setPartMaterial = useConfiguratorStore((s) => s.setPartMaterial);
  const modules = useConfiguratorStore((s) => s.modules);
  const toggleModule = useConfiguratorStore((s) => s.toggleModule);
  const setActivePart = useConfiguratorStore((s) => s.setActivePart);

  return (
    <div
      className="pointer-events-auto absolute right-4 top-4 bottom-4 z-10 w-[min(340px,80vw)] overflow-y-auto rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl"
      style={{ WebkitBackdropFilter: "blur(20px)" }}
      role="group"
      aria-label="Furniture configurator controls"
    >
      <h3 className="font-display text-2xl text-[var(--text-primary)]">
        Kettle Sofa
      </h3>
      <p className="mt-1 text-xs uppercase tracking-widest text-[var(--text-secondary)]">
        Configure your piece
      </p>

      {PARTS.map((part) => {
        const options = MATERIAL_LIBRARY.filter((m) =>
          part.filter.includes(m.type),
        );
        return (
          <div
            key={part.id}
            className="mt-6"
            onMouseEnter={() => setActivePart(part.id)}
            onMouseLeave={() => setActivePart(null)}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {part.label}
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                {MATERIAL_LIBRARY.find((m) => m.id === partMaterials[part.id])
                  ?.name ?? ""}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                const selected = partMaterials[part.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setPartMaterial(part.id, option.id)}
                    aria-label={`${part.label}: ${option.name}`}
                    aria-pressed={selected}
                    data-cursor="link"
                    className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${
                      selected
                        ? "border-[var(--text-primary)] scale-110"
                        : "border-white/40"
                    }`}
                    style={{ background: option.colorHex }}
                    title={option.name}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="mt-8">
        <span className="text-sm font-medium text-[var(--text-primary)]">
          Modules
        </span>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {MODULES.map((mod) => {
            const on = modules[mod.id];
            return (
              <button
                key={mod.id}
                onClick={() => toggleModule(mod.id)}
                aria-pressed={on}
                data-cursor="link"
                className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                  on
                    ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--text-primary)]"
                    : "border-white/30 text-[var(--text-secondary)]"
                }`}
              >
                {mod.label}
                <span className="mt-1 block font-mono text-[10px] opacity-70">
                  {on ? "ON" : "OFF"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        data-cursor="link"
        className="mt-8 w-full rounded-lg bg-[var(--text-primary)] py-3 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-90"
      >
        Request a quote
      </button>
    </div>
  );
}
