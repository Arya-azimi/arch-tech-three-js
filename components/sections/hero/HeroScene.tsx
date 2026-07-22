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

export default function HeroScene() {
  const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setWebGLAvailable(canCreateWebGLContext());
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
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
        onChange={(e) => {
          if (e?.target) {
            const cam = e.target.object.position;
            const target = e.target.target;
            console.log(
              `Cam: [${cam.x.toFixed(2)}, ${cam.y.toFixed(2)}, ${cam.z.toFixed(2)}] | Target: [${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)}]`,
            );
          }
        }}
      />
    </Canvas>
  );
}
