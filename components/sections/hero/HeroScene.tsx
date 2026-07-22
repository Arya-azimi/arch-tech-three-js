// components/sections/hero/HeroScene.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Room from "@/components/sections/hero/Room";
import { useRoomStore, useUIStore } from "@/lib/store";

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

function HeroSceneFallback({
  completeIntro = true,
}: {
  completeIntro?: boolean;
}) {
  const setIntroComplete = useRoomStore((s) => s.setIntroComplete);
  useEffect(() => {
    if (completeIntro) setIntroComplete(true);
  }, [completeIntro, setIntroComplete]);

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

function useSharedPointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function CameraRig({
  pointer,
  isCinematic,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  isCinematic: boolean;
}) {
  const { camera } = useThree();
  const introComplete = useRoomStore((s) => s.introComplete);
  const setIntroComplete = useRoomStore((s) => s.setIntroComplete);

  // خواندن مقادیر استور برای هماهنگی دقیق با Preloader
  const reducedMotion = useUIStore((s) => s.reducedMotion);
  const isLoaded = useUIStore((s) => s.isLoaded);

  const progress = useRef(reducedMotion ? 1 : 0);
  const [canAnimate, setCanAnimate] = useState(false);

  const start = useRef(new THREE.Vector3(0.01, -0.26, 1.88));
  const end = useRef(new THREE.Vector3(0.0, 0.0, 6.86));
  const lookTarget = useRef(new THREE.Vector3(0.0, 0.0, 0.0));

  const introCompleteRef = useRef(introComplete);

  useEffect(() => {
    introCompleteRef.current = introComplete;
  }, [introComplete]);

  // استارت انیمیشن دقیقاً بعد از لود شدن کامل و همگام با کرکره GSAP
  useEffect(() => {
    if (isLoaded) {
      // کرکره حدود 0.4 ثانیه طول میکشه تا حرکت عمودیش رو شروع کنه
      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (reducedMotion) {
      camera.position.copy(end.current);
      camera.lookAt(lookTarget.current);
      setIntroComplete(true);
    }
  }, [camera, reducedMotion, setIntroComplete]);

  useFrame((_, delta) => {
    if (!isCinematic || !canAnimate) {
      camera.position.copy(start.current);
      camera.lookAt(lookTarget.current);
      return;
    }

    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta / 2.6);
      const t = easeInOutCubic(progress.current);
      camera.position.lerpVectors(start.current, end.current, t);
      camera.lookAt(lookTarget.current);
      if (progress.current >= 1 && !introCompleteRef.current) {
        setIntroComplete(true);
      }
      return;
    }

    const p = pointer.current ?? { x: 0, y: 0 };
    const tx = end.current.x + p.x * 0.4;
    const ty = end.current.y - p.y * 0.2;
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (ty - camera.position.y) * 0.04;
    camera.lookAt(lookTarget.current);
  });

  return null;
}

export default function HeroScene({
  isExploring = false,
}: {
  isExploring?: boolean;
}) {
  const pointer = useSharedPointer();
  const introComplete = useRoomStore((s) => s.introComplete);
  const reducedMotion = useUIStore((s) => s.reducedMotion);
  const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setWebGLAvailable(canCreateWebGLContext());
  }, []);

  if (webGLAvailable === null)
    return <HeroSceneFallback completeIntro={false} />;
  if (!webGLAvailable) return <HeroSceneFallback />;

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0.01, -0.26, 1.88], fov: 45 }}
      // هندل کردن مشکل قفل شدن اسکرول در موبایل:
      style={{ touchAction: isExploring ? "none" : "auto" }}
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
        shadow-bias={-0.0002}
        shadow-mapSize={[1024, 1024]}
        color="#fff2e0"
      />
      <ambientLight intensity={0.5} />

      <Room />

      <CameraRig
        pointer={pointer}
        isCinematic={introComplete && !isExploring}
      />

      {introComplete && !reducedMotion && (
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          enabled={isExploring}
          enablePan={isExploring}
          enableZoom={isExploring}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={1}
          maxDistance={12}
          target={[0, 0, 0]}
        />
      )}
    </Canvas>
  );
}
