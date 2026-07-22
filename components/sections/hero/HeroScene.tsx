"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Room from "@/components/sections/hero/Room";
import { useRoomStore, useUIStore } from "@/lib/store";

/* ------------------------------------------------------------------ */
/*  WebGL fallback                                                     */
/* ------------------------------------------------------------------ */

function canCreateWebGLContext() {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl")) as
      | WebGL2RenderingContext
      | WebGLRenderingContext
      | null;

    if (!gl) return false;

    const loseContext = gl.getExtension("WEBGL_lose_context");
    loseContext?.loseContext();
    return true;
  } catch {
    return false;
  }
}

// فالبک برای زمانی که کارت گرافیک توان رندر ندارد
function HeroSceneFallback({
  completeIntro = true,
}: {
  completeIntro?: boolean;
}) {
  const setIntroComplete = useRoomStore((s) => s.setIntroComplete);

  useEffect(() => {
    if (!completeIntro) return;
    setIntroComplete(true);
  }, [completeIntro, setIntroComplete]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#e9e5dd] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fdfbf7] to-[#dcd8ce]" />

      <div className="z-10 text-center px-6">
        <h2 className="font-serif text-2xl md:text-4xl text-[#3a3228] mb-4">
          Experience the Space
        </h2>
        <p className="font-mono text-sm md:text-base text-[#5a4f40] max-w-md mx-auto leading-relaxed">
          3D rendering is currently unavailable on this device. Please try a
          different browser or device for the full interactive experience.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared pointer                                                     */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Easing                                                             */
/* ------------------------------------------------------------------ */

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ------------------------------------------------------------------ */
/*  Camera rig                                                         */
/* ------------------------------------------------------------------ */

function CameraRig({
  pointer,
  controlsEnabled,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  controlsEnabled: boolean;
}) {
  const { camera } = useThree();
  const introComplete = useRoomStore((s) => s.introComplete);
  const setIntroComplete = useRoomStore((s) => s.setIntroComplete);
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  const progress = useRef(reducedMotion ? 1 : 0);
  const start = useRef(new THREE.Vector3(12, 1.2, 12));
  const end = useRef(new THREE.Vector3(6.2, 3.6, 7.2));
  const lookTarget = useRef(new THREE.Vector3(0, 1.1, 0.6));
  const introCompleteRef = useRef(introComplete);

  useEffect(() => {
    introCompleteRef.current = introComplete;
  }, [introComplete]);

  useEffect(() => {
    if (reducedMotion) {
      camera.position.copy(end.current);
      camera.lookAt(lookTarget.current);
      setIntroComplete(true);
    }
  }, [camera, reducedMotion, setIntroComplete]);

  useFrame((_, delta) => {
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

    // حرکت سینماتیک نرم با موس وقتی کاربر درگ نمی‌کند
    if (!controlsEnabled) {
      const p = pointer.current ?? { x: 0, y: 0 };
      const tx = end.current.x + p.x * 0.8;
      const ty = end.current.y - p.y * 0.5;
      camera.position.x += (tx - camera.position.x) * 0.04;
      camera.position.y += (ty - camera.position.y) * 0.04;
      camera.lookAt(lookTarget.current);
    }
  });

  return null;
}

/* ------------------------------------------------------------------ */
/*  Canvas                                                             */
/* ------------------------------------------------------------------ */

export default function HeroScene() {
  const pointer = useSharedPointer();
  const introComplete = useRoomStore((s) => s.introComplete);
  const reducedMotion = useUIStore((s) => s.reducedMotion);
  const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setWebGLAvailable(canCreateWebGLContext());
  }, []);

  if (webGLAvailable === null) {
    return <HeroSceneFallback completeIntro={false} />;
  }

  if (!webGLAvailable) {
    return <HeroSceneFallback />;
  }

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [12, 1.2, 12], fov: 38 }}
      // powerPreference برای مدیریت بهتر منابع روی سیستم‌های بدون گرافیک مجزا
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      fallback={<HeroSceneFallback />}
      onError={(e) => {
        console.error("WebGL Error:", e);
        setWebGLAvailable(false);
      }}
      onCreated={({ gl, scene }) => {
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        // رنگ پس‌زمینه که با محیط سه‌بعدی هارمونی داشته باشد
        scene.background = new THREE.Color("#0a0a0a");
      }}
    >
      {/* نورپردازی محیطی واقع‌گرایانه به جای نورهای ساده و تخت قبلی */}
      <Environment
        preset="apartment"
        environmentIntensity={1.2}
        background={false}
      />

      {/* یک نور جهت‌دار ملایم صرفاً برای ایجاد سایه نرم زیر مدل */}
      <directionalLight
        position={[6, 9, 4]}
        intensity={0.8}
        castShadow
        shadow-bias={-0.0002}
        shadow-mapSize={[1024, 1024]}
        color="#fff2e0"
      />

      <Room pointer={pointer} />

      {/* سایه تماس زیر مدل برای اینکه حس شود روی زمین قرار دارد */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.6}
        scale={20}
        blur={2}
        far={4}
        resolution={512}
        color="#000000"
      />

      <CameraRig pointer={pointer} controlsEnabled={introComplete} />

      {/* کنترلر موس برای چرخیدن دور مدل */}
      {introComplete && !reducedMotion && (
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          enablePan={false}
          enableZoom={false} // در صورت نیاز می‌توانید زوم را فعال کنید
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 2.1}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          target={[0, 1.1, 0.6]}
        />
      )}
    </Canvas>
  );
}
