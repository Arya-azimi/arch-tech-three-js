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

  // لود کردن مدل سه‌بعدی واقعی (این فایل را باید دانلود کرده و در پوشه public قرار دهی)
  const { scene, materials } = useGLTF("/models/white_modern_living_room.glb");

  const paletteId = useRoomStore((s) => s.paletteId);
  const palette = getRoomPalette(paletteId);

  // تغییر رنگ متریال‌های مدل لود شده بر اساس State
  useMemo(() => {
    if (!materials) return;

    // فرض می‌کنیم در فایل GLTF، متریال مبل اسمش 'Sofa_Fabric' است
    if (materials.Sofa_Fabric) {
      (materials.Sofa_Fabric as THREE.MeshStandardMaterial).color.set(
        palette.sofa,
      );
      (materials.Sofa_Fabric as THREE.MeshStandardMaterial).needsUpdate = true;
    }

    // فرض می‌کنیم متریال چوب اسمش 'Wood_Details' است
    if (materials.Wood_Details) {
      (materials.Wood_Details as THREE.MeshStandardMaterial).color.set(
        palette.wood,
      );
      (materials.Wood_Details as THREE.MeshStandardMaterial).needsUpdate = true;
    }
  }, [materials, palette]);

  // انیمیشن نرم سینماتیک با حرکت موس
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
      {/* رندر کردن کل صحنه بسیار پر جزئیات با یک خط کد! */}
      <primitive object={scene} position={[0, -1, 0]} scale={1} />
    </group>
  );
}

// برای جلوگیری از باگ در لود شدن مکرر
useGLTF.preload("/models/white_modern_living_room.glb");
