// components/sections/hero/Room.tsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useRoomStore, getRoomPalette } from "@/lib/store";

export default function Room({
  pointer,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const { scene, materials } = useGLTF("/models/modern_dining_room.glb");

  const paletteId = useRoomStore((s) => s.paletteId);
  const palette = getRoomPalette(paletteId);

  useMemo(() => {
    if (!materials) return;

    if (materials.Sofa_Fabric) {
      (materials.Sofa_Fabric as THREE.MeshStandardMaterial).color.set(
        palette.sofa,
      );
      (materials.Sofa_Fabric as THREE.MeshStandardMaterial).needsUpdate = true;
    }

    if (materials.Wood_Details) {
      (materials.Wood_Details as THREE.MeshStandardMaterial).color.set(
        palette.wood,
      );
      (materials.Wood_Details as THREE.MeshStandardMaterial).needsUpdate = true;
    }
  }, [materials, palette]);

  useFrame(() => {
    if (!groupRef.current) return;
    const p = pointer.current ?? { x: 0, y: 0 };

    const targetRotY = p.x * 0.1;
    const targetRotX = -p.y * 0.05;

    groupRef.current.rotation.y +=
      (targetRotY - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x +=
      (targetRotX - groupRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* مدل در مرکز صحنه با ارتفاع عمودی تنظیم‌شده قرار گرفته است[cite: 5] */}
      <primitive object={scene} position={[0, -1, 0]} scale={1} />
    </group>
  );
}

useGLTF.preload("/models/modern_dining_room.glb");
