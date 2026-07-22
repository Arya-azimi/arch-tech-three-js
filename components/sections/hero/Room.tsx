// components/sections/hero/Room.tsx
"use client";

import { useGLTF } from "@react-three/drei";

export default function Room() {
  const { scene } = useGLTF("/models/scene.glb");
  return <primitive object={scene} />;
}

useGLTF.preload(
  "/models/scene.glb",
  "https://www.gstatic.com/draco/v1/decoders/",
);
