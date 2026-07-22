"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Float,
} from "@react-three/drei";
import * as THREE from "three";
import {
  useConfiguratorStore,
  getMaterial,
  type MaterialType,
} from "@/lib/store";

/**
 * R3F scene for the modular-furniture configurator (kettal inspiration).
 *
 * Because a licensed GLTF asset isn't shipped here, the "sofa" is assembled
 * from primitive meshes that map to the same configurable-part model the CMS
 * schema describes (base, cushions, legs) plus toggle-able modules (armrests,
 * chaise, ottoman). Swapping in `useGLTF` later only changes this file.
 *
 * Materials are injected dynamically from the Zustand store: fabric →
 * MeshPhysicalMaterial (sheen), metal/wood → MeshStandardMaterial.
 */

function buildMaterial(type: MaterialType, colorHex: string, active: boolean) {
  const color = new THREE.Color(colorHex);
  const emissive = active
    ? new THREE.Color("#B8A886")
    : new THREE.Color("#000");
  const emissiveIntensity = active ? 0.15 : 0;

  if (type === "fabric" || type === "leather") {
    const mat = new THREE.MeshPhysicalMaterial({
      color,
      roughness: type === "leather" ? 0.5 : 0.9,
      clearcoat: type === "leather" ? 0.3 : 0,
      sheen: type === "fabric" ? 1 : 0.2,
      sheenColor: color,
      emissive,
      emissiveIntensity,
    });
    return mat;
  }
  // metal + wood
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: type === "metal" ? 0.2 : 0.6,
    metalness: type === "metal" ? 0.8 : 0.05,
    emissive,
    emissiveIntensity,
  });
  return mat;
}

function usePartMaterial(part: string) {
  const materialId = useConfiguratorStore((s) => s.partMaterials[part]);
  const activePart = useConfiguratorStore((s) => s.activePart);
  return useMemo(() => {
    const option = getMaterial(materialId);
    return buildMaterial(option.type, option.colorHex, activePart === part);
  }, [materialId, activePart, part]);
}

function SofaModule({ position }: { position: [number, number, number] }) {
  const setActivePart = useConfiguratorStore((s) => s.setActivePart);
  const baseMat = usePartMaterial("base");
  const cushionMat = usePartMaterial("cushions");

  return (
    <group position={position}>
      {/* Seat base */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0.35, 0]}
        material={baseMat}
        onPointerOver={(e) => {
          e.stopPropagation();
          setActivePart("base");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setActivePart(null);
          document.body.style.cursor = "";
        }}
      >
        <boxGeometry args={[1.6, 0.5, 1.4]} />
      </mesh>
      {/* Seat cushion */}
      <mesh
        castShadow
        position={[0, 0.72, 0.05]}
        material={cushionMat}
        onPointerOver={(e) => {
          e.stopPropagation();
          setActivePart("cushions");
        }}
        onPointerOut={() => setActivePart(null)}
      >
        <boxGeometry args={[1.5, 0.28, 1.2]} />
      </mesh>
      {/* Backrest */}
      <mesh castShadow position={[0, 1.05, -0.55]} material={cushionMat}>
        <boxGeometry args={[1.5, 0.7, 0.3]} />
      </mesh>
    </group>
  );
}

function Armrest({ side }: { side: -1 | 1 }) {
  const mat = usePartMaterial("base");
  return (
    <mesh castShadow position={[side * 0.9, 0.75, 0]} material={mat}>
      <boxGeometry args={[0.25, 0.9, 1.4]} />
    </mesh>
  );
}

function Legs() {
  const mat = usePartMaterial("legs");
  const offsets: [number, number][] = [
    [-0.7, 0.6],
    [0.7, 0.6],
    [-0.7, -0.6],
    [0.7, -0.6],
  ];
  return (
    <group>
      {offsets.map(([x, z], i) => (
        <mesh key={i} castShadow position={[x, 0.1, z]} material={mat}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 12]} />
        </mesh>
      ))}
    </group>
  );
}

function Furniture() {
  const modules = useConfiguratorStore((s) => s.modules);

  return (
    <group position={[0, -0.5, 0]}>
      <SofaModule position={[0, 0, 0]} />
      {modules.chaise && <SofaModule position={[1.7, 0, 0]} />}
      {modules.armrestLeft && <Armrest side={-1} />}
      {modules.armrestRight && <Armrest side={1} />}
      {modules.ottoman && (
        <mesh castShadow position={[0, 0.1, 1.6]}>
          <boxGeometry args={[1.4, 0.5, 0.9]} />
          <meshPhysicalMaterial color="#d8cdb8" sheen={1} roughness={0.9} />
        </mesh>
      )}
      <Legs />
    </group>
  );
}

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [3.5, 2, 4], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <ambientLight color="#ffffff" intensity={0.5} />
      <directionalLight
        color="#ffffff"
        intensity={1.5}
        position={[5, 10, 5]}
        castShadow
        shadow-bias={-0.0001}
        shadow-mapSize={[2048, 2048]}
      />

      <Float speed={1} rotationIntensity={0.15} floatIntensity={0.3}>
        <Furniture />
      </Float>

      <ContactShadows
        position={[0, -1, 0]}
        opacity={0.5}
        scale={12}
        blur={2.4}
        far={4}
      />
      <Environment preset="studio" />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        autoRotate={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={8}
        enablePan={false}
      />
    </Canvas>
  );
}
