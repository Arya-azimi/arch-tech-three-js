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

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function CameraRig({
  isExploring,
  controlsRef,
}: {
  isExploring: boolean;
  controlsRef: React.RefObject<any>;
}) {
  const { camera } = useThree();
  const introComplete = useRoomStore((s) => s.introComplete);
  const setIntroComplete = useRoomStore((s) => s.setIntroComplete);
  const reducedMotion = useUIStore((s) => s.reducedMotion);
  const isLoaded = useUIStore((s) => s.isLoaded);

  const progress = useRef(reducedMotion ? 1 : 0);
  const [canAnimate, setCanAnimate] = useState(false);

  const start = useRef(new THREE.Vector3(0.01, -0.26, 1.88));
  const end = useRef(new THREE.Vector3(0.0, 0.0, 6.86));
  const lookTarget = useRef(new THREE.Vector3(0.0, 0.0, 0.0));

  // این رفرنس زاویه لحظه‌ای دوربین را در هنگام چرخش ذخیره می‌کند
  const currentTarget = useRef(new THREE.Vector3(0.0, 0.0, 0.0));

  const introCompleteRef = useRef(introComplete);

  useEffect(() => {
    introCompleteRef.current = introComplete;
  }, [introComplete]);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (reducedMotion && !isExploring) {
      camera.position.copy(end.current);
      camera.lookAt(lookTarget.current);
      currentTarget.current.copy(lookTarget.current);
      if (controlsRef.current) {
        controlsRef.current.target.copy(lookTarget.current);
      }
      setIntroComplete(true);
    }
  }, [camera, reducedMotion, setIntroComplete, isExploring, controlsRef]);

  useFrame((_, delta) => {
    if (!canAnimate) {
      camera.position.copy(start.current);
      camera.lookAt(lookTarget.current);
      return;
    }

    // ۱. انیمیشن سینماتیک اولیه سایت
    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta / 2.6);
      const t = easeInOutCubic(progress.current);
      camera.position.lerpVectors(start.current, end.current, t);
      camera.lookAt(lookTarget.current);
      if (progress.current >= 1 && !introCompleteRef.current) {
        setIntroComplete(true);
        currentTarget.current.copy(lookTarget.current);
      }
      return;
    }

    // ۲. در زمان جستجو، کنترل کاملا دست کاربر و OrbitControls است
    if (isExploring) {
      if (controlsRef.current) {
        // موقعیت نگاه کردن کاربر رو همگام‌سازی می‌کنیم
        currentTarget.current.copy(controlsRef.current.target);
      }
      return;
    }

    // ۳. پروازِ نرم و لطیف به جایگاه اول بعد از بستن ذره‌بین
    if (!reducedMotion) {
      // نرم رفتن دوربین به پوزیشن نهایی
      camera.position.lerp(end.current, delta * 4);

      // چرخش نرم کادر دوربین به مرکز
      currentTarget.current.lerp(lookTarget.current, delta * 4);
      camera.lookAt(currentTarget.current);

      // همگام‌سازی OrbitControls تا از پرش‌های احتمالی بعدی جلوگیری بشه
      if (controlsRef.current) {
        controlsRef.current.target.copy(currentTarget.current);
      }
    }
  });

  return null;
}

export default function HeroScene({
  isExploring = false,
}: {
  isExploring?: boolean;
}) {
  const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    setWebGLAvailable(canCreateWebGLContext());
  }, []);

  if (webGLAvailable === null)
    return <HeroSceneFallback completeIntro={false} />;
  if (!webGLAvailable) return <HeroSceneFallback />;

  return (
    <div
      className={`h-full w-full ${
        isExploring ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0.01, -0.26, 1.88], fov: 45 }}
        style={{
          touchAction: isExploring ? "none" : "auto",
          pointerEvents: isExploring ? "auto" : "none",
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
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

        {/* اضافه کردن CameraRig که مدیریت پرواز نرم رو بر عهده داره */}
        <CameraRig isExploring={isExploring} controlsRef={controlsRef} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          enabled={isExploring}
          enableRotate={isExploring}
          enablePan={isExploring}
          enableZoom={isExploring}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          minDistance={0.5}
          maxDistance={12}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
