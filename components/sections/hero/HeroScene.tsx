// components/sections/hero/HeroScene.tsx
"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Room from "@/components/sections/hero/Room";

function canCreateWebGLContext() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ??
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const loseContext = gl.getExtension("WEBGL_lose_context");
    loseContext?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function HeroSceneFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-transparent">
      <div className="z-10 px-6 text-center">
        <h2 className="mb-4 font-serif text-2xl text-white/80 md:text-4xl">
          Experience the Space
        </h2>
        <p className="mx-auto max-w-md font-mono text-sm leading-relaxed text-white/50 md:text-base">
          3D rendering is currently unavailable on this device.
        </p>
      </div>
    </div>
  );
}

export default function HeroScene() {
  const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setWebGLAvailable(canCreateWebGLContext());
  }, []);

  if (webGLAvailable === null) return <HeroSceneFallback />;
  if (!webGLAvailable) return <HeroSceneFallback />;

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      fallback={<HeroSceneFallback />}
      onError={() => setWebGLAvailable(false)}
      onCreated={({ gl }) => {
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
    >
      <Environment
        preset="apartment"
        environmentIntensity={1.2}
        background={false}
      />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        color="#fff2e0"
      />
      <ambientLight intensity={0.5} />

      <Room />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
