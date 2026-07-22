import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRoomStore, getRoomPalette, getRoomLayout } from "@/lib/store";

function useLerpMaterial(
  targetHex: string,
  opts: THREE.MeshStandardMaterialParameters = {},
) {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(targetHex),
        ...opts,
      }),
    [],
  );
  const target = useMemo(() => new THREE.Color(targetHex), [targetHex]);
  useFrame(() => mat.color.lerp(target, 0.08));
  return mat;
}

function Piece({
  show,
  children,
  position = [0, 0, 0],
}: {
  show: boolean;
  children: React.ReactNode;
  position?: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const t = show ? 1 : 0.0001;
    ref.current.scale.lerp(new THREE.Vector3(t, t, t), 0.12);
    ref.current.visible = ref.current.scale.x > 0.02;
  });
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}

export default function Room() {
  const paletteId = useRoomStore((s) => s.paletteId);
  const layout = useRoomStore((s) => s.layout);
  const palette = getRoomPalette(paletteId);
  const pieces = getRoomLayout(layout).pieces;

  const mats = {
    wall: useLerpMaterial(palette.wall, { roughness: 1 }),
    floor: useLerpMaterial(palette.floor, { roughness: 0.5 }),
    rug: useLerpMaterial(palette.rug, { roughness: 1 }),
    sofa: useLerpMaterial(palette.sofa, { roughness: 0.95 }),
    wood: useLerpMaterial(palette.wood, { roughness: 0.4 }),
    leather: useLerpMaterial(palette.accent, { roughness: 0.6 }),
    metal: useLerpMaterial(palette.metal, { roughness: 0.3, metalness: 0.7 }),
    blackFrame: useMemo(
      () =>
        new THREE.MeshStandardMaterial({ roughness: 0.7, color: "#1a1a1a" }),
      [],
    ),
    glass: useMemo(
      () =>
        new THREE.MeshStandardMaterial({
          roughness: 0.1,
          color: "#a8c0ce",
          transparent: true,
          opacity: 0.6,
        }),
      [],
    ),
    foliage: useMemo(
      () =>
        new THREE.MeshStandardMaterial({ roughness: 0.8, color: "#4a5d3f" }),
      [],
    ),
  };

  const arcCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.15, 0),
        new THREE.Vector3(0, 2.0, 0),
        new THREE.Vector3(-1.0, 3.2, 0),
        new THREE.Vector3(-2.8, 2.8, 0),
      ]),
    [],
  );

  return (
    <group>
      {/* Shell & Window */}
      <mesh
        receiveShadow
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={mats.floor}
      >
        <planeGeometry args={[30, 20]} />
      </mesh>
      <mesh receiveShadow position={[0, 5, -5]} material={mats.wall}>
        <planeGeometry args={[30, 10]} />
      </mesh>
      <mesh
        receiveShadow
        position={[-10, 5, 5]}
        rotation={[0, Math.PI / 2, 0]}
        material={mats.wall}
      >
        <planeGeometry args={[20, 10]} />
      </mesh>
      <group position={[0, 6, -4.9]}>
        <mesh castShadow receiveShadow material={mats.blackFrame}>
          <boxGeometry args={[14, 1.8, 0.3]} />
        </mesh>
        <mesh material={mats.glass} position={[0, 0, 0.16]}>
          <planeGeometry args={[13.6, 1.4]} />
        </mesh>
      </group>

      <Piece show={pieces.rug}>
        <mesh receiveShadow position={[0.5, 0.02, 1]} material={mats.rug}>
          <boxGeometry args={[7, 0.04, 5]} />
        </mesh>
      </Piece>

      {/* Sofa */}
      <group position={[0.5, 0, -1.5]}>
        <mesh
          castShadow
          receiveShadow
          position={[0, 0.25, 0]}
          material={mats.sofa}
        >
          <boxGeometry args={[5.2, 0.3, 1.8]} />
        </mesh>
        <mesh castShadow position={[0, 0.95, -0.7]} material={mats.sofa}>
          <boxGeometry args={[5.2, 1.1, 0.4]} />
        </mesh>
        <mesh castShadow position={[-2.35, 0.75, 0]} material={mats.sofa}>
          <boxGeometry args={[0.5, 0.9, 1.8]} />
        </mesh>
        <mesh castShadow position={[2.35, 0.75, 0]} material={mats.sofa}>
          <boxGeometry args={[0.5, 0.9, 1.8]} />
        </mesh>
        {[-1.5, 0, 1.5].map((x) => (
          <group key={x}>
            <mesh castShadow position={[x, 0.55, 0.05]} material={mats.sofa}>
              <boxGeometry args={[1.45, 0.35, 1.3]} />
            </mesh>
            <mesh
              castShadow
              position={[x, 1.05, -0.4]}
              rotation={[0.05, 0, 0]}
              material={mats.sofa}
            >
              <boxGeometry args={[1.45, 0.7, 0.25]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Coffee Table */}
      <group position={[0.5, 0, 1.2]}>
        <mesh castShadow position={[0, 0.5, 0]} material={mats.wood}>
          <boxGeometry args={[2.4, 0.4, 1.4]} />
        </mesh>
        <mesh castShadow position={[0, 0.15, 0]} material={mats.blackFrame}>
          <boxGeometry args={[1.8, 0.3, 0.8]} />
        </mesh>
      </group>

      <Piece show={pieces.ottomans}>
        {[-0.6, 0.6].map((x) => (
          <group key={x} position={[x + 0.5, 0.3, 2.7]}>
            <mesh castShadow material={mats.leather}>
              <boxGeometry args={[0.8, 0.6, 0.8]} />
            </mesh>
            <mesh position={[0, 0.1, 0]} material={mats.blackFrame}>
              <boxGeometry args={[0.82, 0.02, 0.82]} />
            </mesh>
          </group>
        ))}
      </Piece>

      {/* Arc Lamp */}
      <Piece show={pieces.lamp}>
        <group position={[4.2, 0, -1.2]}>
          <mesh castShadow position={[0, 0.075, 0]} material={mats.metal}>
            <cylinderGeometry args={[0.4, 0.4, 0.15, 32]} />
          </mesh>
          <mesh castShadow material={mats.metal}>
            <tubeGeometry args={[arcCurve, 40, 0.03, 8, false]} />
          </mesh>
          <group
            position={arcCurve.getPoint(1).toArray()}
            rotation={[Math.PI, 0, 0]}
          >
            <mesh castShadow material={mats.metal}>
              <sphereGeometry
                args={[0.35, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]}
              />
            </mesh>
          </group>
          <pointLight
            position={[
              arcCurve.getPoint(1).x,
              arcCurve.getPoint(1).y - 0.2,
              arcCurve.getPoint(1).z,
            ]}
            color="#ffebd6"
            intensity={1.5}
            distance={5}
            castShadow
          />
        </group>
      </Piece>

      <Piece show={pieces.plant}>
        <group position={[4.8, 0, -3.5]}>
          <mesh castShadow position={[0, 0.4, 0]} material={mats.blackFrame}>
            <cylinderGeometry args={[0.35, 0.25, 0.8, 24]} />
          </mesh>
          <mesh castShadow position={[0, 1.5, 0]} material={mats.wood}>
            <cylinderGeometry args={[0.04, 0.06, 2.2, 8]} />
          </mesh>
          {Array.from({ length: 15 }).map((_, i) => (
            <mesh
              key={i}
              castShadow
              material={mats.foliage}
              position={[
                Math.cos((i / 15) * Math.PI * 2) * 0.1,
                2.4 + (i % 3) * 0.2,
                Math.sin((i / 15) * Math.PI * 2) * 0.1,
              ]}
              rotation={[
                Math.PI / 2 - 0.4 - Math.random() * 0.3,
                (i / 15) * Math.PI * 2,
                0,
                "YXZ",
              ]}
            >
              <planeGeometry args={[0.1, 1.0]} />
            </mesh>
          ))}
        </group>
      </Piece>

      {/* Side Chairs */}
      <Piece show={pieces.sideStool}>
        {[-1, 1].map((z, idx) => (
          <group
            key={z}
            position={[-2.8, 0, z * 1.5 - 0.5]}
            rotation={[0, Math.PI / 2 + (idx === 0 ? 0.2 : -0.2), 0]}
          >
            <mesh material={mats.blackFrame} position={[-0.4, 0.4, 0]}>
              <boxGeometry args={[0.06, 0.8, 0.9]} />
            </mesh>
            <mesh material={mats.blackFrame} position={[0.4, 0.4, 0]}>
              <boxGeometry args={[0.06, 0.8, 0.9]} />
            </mesh>
            <mesh
              castShadow
              material={mats.leather}
              position={[0, 0.4, 0.05]}
              rotation={[-0.1, 0, 0]}
            >
              <boxGeometry args={[0.74, 0.1, 0.8]} />
            </mesh>
            <mesh
              castShadow
              material={mats.leather}
              position={[0, 0.7, -0.35]}
              rotation={[0.2, 0, 0]}
            >
              <boxGeometry args={[0.74, 0.5, 0.1]} />
            </mesh>
          </group>
        ))}
      </Piece>
    </group>
  );
}
