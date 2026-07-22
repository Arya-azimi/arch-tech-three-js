import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import Room from "./Room";
import { useRoomStore, useUIStore } from "@/lib/store";

function canCreateWebGLContext() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
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
        <p className="font-sans text-sm md:text-base text-[#5a4f40] max-w-md mx-auto">
          3D rendering is currently unavailable on this device. Please try a
          different browser or device for the full interactive experience.
        </p>
      </div>
    </div>
  );
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function CameraRig({ controlsEnabled }: { controlsEnabled: boolean }) {
  const { camera, gl } = useThree();
  const introComplete = useRoomStore((s) => s.introComplete);
  const setIntroComplete = useRoomStore((s) => s.setIntroComplete);
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  const progress = useRef(reducedMotion ? 1 : 0);
  const startPos = useRef(new THREE.Vector3(12, 1.2, 12));
  const endPos = useRef(new THREE.Vector3(0, 3.2, 10));
  const lookTarget = useRef(new THREE.Vector3(0, 1.0, 0));

  const spherical = useRef(
    new THREE.Spherical().setFromVector3(endPos.current),
  );
  const targetSpherical = useRef(spherical.current.clone());

  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvasEl = gl.domElement;
    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      prevMouse.current = { x: e.clientX, y: e.clientY };
      canvasEl.style.cursor = "grabbing";
    };
    const onPointerUp = () => {
      isDragging.current = false;
      canvasEl.style.cursor = "grab";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current || !introComplete) return;
      targetSpherical.current.theta -=
        (e.clientX - prevMouse.current.x) * 0.006;
      targetSpherical.current.phi -= (e.clientY - prevMouse.current.y) * 0.006;
      targetSpherical.current.phi = Math.max(
        0.2,
        Math.min(Math.PI / 2 - 0.05, targetSpherical.current.phi),
      );
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };

    canvasEl.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    canvasEl.style.cursor = "grab";

    return () => {
      canvasEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [gl, introComplete]);

  useFrame((_, delta) => {
    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta / 2.6);
      camera.position.lerpVectors(
        startPos.current,
        endPos.current,
        easeInOutCubic(progress.current),
      );
      if (progress.current >= 1 && !introComplete) {
        setIntroComplete(true);
        targetSpherical.current.setFromVector3(endPos.current);
        spherical.current.copy(targetSpherical.current);
      }
    } else if (controlsEnabled) {
      spherical.current.theta +=
        (targetSpherical.current.theta - spherical.current.theta) * 0.1;
      spherical.current.phi +=
        (targetSpherical.current.phi - spherical.current.phi) * 0.1;
      camera.position.setFromSpherical(spherical.current);
    }
    camera.lookAt(lookTarget.current);
  });

  return null;
}

export default function HeroScene() {
  const introComplete = useRoomStore((s) => s.introComplete);
  const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null);

  useEffect(() => setWebGLAvailable(canCreateWebGLContext()), []);

  if (webGLAvailable === null)
    return <HeroSceneFallback completeIntro={false} />;
  if (!webGLAvailable) return <HeroSceneFallback />;

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [12, 1.2, 12], fov: 42 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      fallback={<HeroSceneFallback />}
      onError={() => setWebGLAvailable(false)}
      onCreated={({ gl, scene }) => {
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        scene.background = new THREE.Color("#e9e5dd");
      }}
    >
      <hemisphereLight args={["#ffffff", "#d3cbbe", 0.7]} />
      <directionalLight
        position={[8, 10, 5]}
        intensity={1.8}
        castShadow
        shadow-bias={-0.001}
        shadow-mapSize={[1024, 1024]}
        color="#fff4e5"
      />
      <pointLight position={[-5, 4, 3]} intensity={0.6} color="#e8f0f8" />

      <Room />

      <ContactShadows
        position={[0, 0.01, 1]}
        opacity={0.4}
        scale={15}
        blur={2}
        far={6}
        resolution={512}
        color="#3a3228"
      />
      <CameraRig controlsEnabled={introComplete} />
    </Canvas>
  );
}
