// components/sections/hero/Room.tsx
"use client";

import { useGLTF } from "@react-three/drei";

export default function Room() {
  const { scene } = useGLTF("/models/modern_dining_room.glb");
  return <primitive object={scene} />;
}

useGLTF.preload(
  "/models/modern_dining_room.glb",
  "https://www.gstatic.com/draco/v1/decoders/",
);
