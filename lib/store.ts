"use client";

import { create } from "zustand";

/** Custom cursor interaction states, driven by data-cursor attributes. */
export type CursorState = "default" | "link" | "draggable" | "video" | "three";

export type Theme = "light" | "dark";

interface UIState {
  /* Preloader */
  loaderProgress: number;
  isLoaded: boolean;
  setLoaderProgress: (value: number) => void;
  setLoaded: (value: boolean) => void;

  /* Theme */
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;

  /* Accessibility */
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;

  /* Custom cursor */
  cursor: CursorState;
  cursorLabel: string;
  setCursor: (state: CursorState, label?: string) => void;

  /* Fullscreen navigation overlay */
  menuOpen: boolean;
  toggleMenu: () => void;
  setMenuOpen: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  loaderProgress: 0,
  isLoaded: false,
  setLoaderProgress: (value) => set({ loaderProgress: value }),
  setLoaded: (value) => set({ isLoaded: value }),

  theme: "light",
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
  setTheme: (theme) => set({ theme }),

  reducedMotion: false,
  setReducedMotion: (value) => set({ reducedMotion: value }),

  cursor: "default",
  cursorLabel: "",
  setCursor: (state, label = "") => set({ cursor: state, cursorLabel: label }),

  menuOpen: false,
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
  setMenuOpen: (value) => set({ menuOpen: value }),
}));

/* -------------------------------------------------------------------------- */
/*  3D configurator state — material selections per configurable mesh part.   */
/* -------------------------------------------------------------------------- */

export type MaterialType = "fabric" | "leather" | "metal" | "wood";

export interface MaterialOption {
  id: string;
  name: string;
  type: MaterialType;
  colorHex: string;
}

/** Which modular parts of the furniture piece are currently attached. */
export interface ConfiguratorState {
  /** Selected material id, keyed by configurable mesh/part name. */
  partMaterials: Record<string, string>;
  /** Toggle-able modular nodes (e.g. armrest, chaise, ottoman). */
  modules: Record<string, boolean>;
  activePart: string | null;
  setPartMaterial: (part: string, materialId: string) => void;
  toggleModule: (module: string) => void;
  setActivePart: (part: string | null) => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  partMaterials: {
    base: "linen-sand",
    cushions: "linen-sand",
    legs: "oak-natural",
  },
  modules: {
    armrestLeft: true,
    armrestRight: true,
    chaise: false,
    ottoman: false,
  },
  activePart: null,
  setPartMaterial: (part, materialId) =>
    set((s) => ({ partMaterials: { ...s.partMaterials, [part]: materialId } })),
  toggleModule: (module) =>
    set((s) => ({ modules: { ...s.modules, [module]: !s.modules[module] } })),
  setActivePart: (part) => set({ activePart: part }),
}));

/** Catalogue of selectable materials for the configurator UI. */
export const MATERIAL_LIBRARY: MaterialOption[] = [
  {
    id: "linen-sand",
    name: "Linen — Sand",
    type: "fabric",
    colorHex: "#d8cdb8",
  },
  {
    id: "linen-slate",
    name: "Linen — Slate",
    type: "fabric",
    colorHex: "#5b6167",
  },
  {
    id: "linen-clay",
    name: "Linen — Clay",
    type: "fabric",
    colorHex: "#a5715a",
  },
  {
    id: "leather-cognac",
    name: "Leather — Cognac",
    type: "leather",
    colorHex: "#8a4b2b",
  },
  {
    id: "leather-black",
    name: "Leather — Onyx",
    type: "leather",
    colorHex: "#1c1c1c",
  },
  {
    id: "oak-natural",
    name: "Oak — Natural",
    type: "wood",
    colorHex: "#c8a878",
  },
  {
    id: "walnut-dark",
    name: "Walnut — Dark",
    type: "wood",
    colorHex: "#5a4230",
  },
  {
    id: "steel-brushed",
    name: "Steel — Brushed",
    type: "metal",
    colorHex: "#9a9ea3",
  },
  {
    id: "brass-antique",
    name: "Brass — Antique",
    type: "metal",
    colorHex: "#b08d57",
  },
];

export const getMaterial = (id: string): MaterialOption =>
  MATERIAL_LIBRARY.find((m) => m.id === id) ?? MATERIAL_LIBRARY[0];

/* -------------------------------------------------------------------------- */
/*  Hero interactive living-room state — palette + structural layout.         */
/* -------------------------------------------------------------------------- */

/** Colour themes applied to the procedural living room in the hero. */
export interface RoomPalette {
  id: string;
  name: string;
  wall: string;
  floor: string;
  sofa: string;
  wood: string;
  accent: string; // ottomans / lamp shade / cushions accent
  rug: string;
  metal: string;
}

export const ROOM_PALETTES: RoomPalette[] = [
  {
    id: "warm-oak",
    name: "Warm Oak",
    wall: "#e7e2d8",
    floor: "#5a4230",
    sofa: "#8d8f92",
    wood: "#9c6b3f",
    accent: "#a35a34",
    rug: "#cfc4ad",
    metal: "#b08d57",
  },
  {
    id: "clay-earth",
    name: "Clay Earth",
    wall: "#e9ddd0",
    floor: "#6b4a34",
    sofa: "#b9a892",
    wood: "#7a4a2b",
    accent: "#b4623a",
    rug: "#d9c9b4",
    metal: "#b08d57",
  },
  {
    id: "slate-mono",
    name: "Slate Mono",
    wall: "#dcdedd",
    floor: "#3f4247",
    sofa: "#6d7377",
    wood: "#4a4540",
    accent: "#2d3136",
    rug: "#c3c6c4",
    metal: "#b08d57",
  },
  {
    id: "sage-calm",
    name: "Sage Calm",
    wall: "#dfe4da",
    floor: "#4d5341",
    sofa: "#9aa791",
    wood: "#6f5a3c",
    accent: "#7f8b6c",
    rug: "#cdd2c2",
    metal: "#b08d57",
  },
  {
    id: "night-lounge",
    name: "Night Lounge",
    wall: "#2a2b2e",
    floor: "#1a1b1d",
    sofa: "#454a4f",
    wood: "#3a3129",
    accent: "#b08d57",
    rug: "#33352f",
    metal: "#b08d57",
  },
];

/** Structural layouts — which furniture groups are present. */
export type RoomLayout = "lounge" | "sectional" | "minimal";

export interface RoomLayoutConfig {
  id: RoomLayout;
  name: string;
  description: string;
  /** Which optional pieces are shown for this layout. */
  pieces: {
    chaise: boolean;
    ottomans: boolean;
    lamp: boolean;
    plant: boolean;
    sideStool: boolean;
    rug: boolean;
  };
}

export const ROOM_LAYOUTS: RoomLayoutConfig[] = [
  {
    id: "lounge",
    name: "Lounge",
    description: "Sofa, table, ottomans & arc lamp",
    pieces: {
      chaise: false,
      ottomans: true,
      lamp: true,
      plant: true,
      sideStool: true,
      rug: true,
    },
  },
  {
    id: "sectional",
    name: "Sectional",
    description: "Extended L-shaped seating",
    pieces: {
      chaise: true,
      ottomans: true,
      lamp: true,
      plant: true,
      sideStool: false,
      rug: true,
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Sofa & table only",
    pieces: {
      chaise: false,
      ottomans: false,
      lamp: false,
      plant: true,
      sideStool: false,
      rug: true,
    },
  },
];

interface RoomState {
  paletteId: string;
  layout: RoomLayout;
  /** True once the cinematic intro fly-in has finished. */
  introComplete: boolean;
  setPalette: (id: string) => void;
  setLayout: (layout: RoomLayout) => void;
  setIntroComplete: (value: boolean) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  paletteId: "warm-oak",
  layout: "lounge",
  introComplete: false,
  setPalette: (id) => set({ paletteId: id }),
  setLayout: (layout) => set({ layout }),
  setIntroComplete: (value) => set({ introComplete: value }),
}));

export const getRoomPalette = (id: string): RoomPalette =>
  ROOM_PALETTES.find((p) => p.id === id) ?? ROOM_PALETTES[0];

export const getRoomLayout = (id: RoomLayout): RoomLayoutConfig =>
  ROOM_LAYOUTS.find((l) => l.id === id) ?? ROOM_LAYOUTS[0];
