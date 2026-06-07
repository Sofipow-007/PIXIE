import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ─── Procedural PIXIE device mesh ────────────────────────────────────────────
// Replace with <useGLTF> when pixie.glb is available.
// scrollProgress 0→1 maps to a full 360° rotation on Y axis.
// ─────────────────────────────────────────────────────────────────────────────

const CYAN   = new THREE.Color('oklch(0.73 0.155 192)');  // #00b8c7
const AMBER  = new THREE.Color('oklch(0.82 0.120 75)');   // #e0a145
const BODY   = new THREE.Color('#111820');
const SCREEN = new THREE.Color('#000d10');

function PixieMesh({ scrollProgress }: { scrollProgress: number }) {
  const groupRef    = useRef<THREE.Group>(null);
  const screenRef   = useRef<THREE.Mesh>(null);
  const glowRef     = useRef<THREE.PointLight>(null);
  const targetRot   = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Scroll drives rotation; lerp for silky smoothness
    targetRot.current = scrollProgress * Math.PI * 2;
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRot.current,
        0.06,
      );
      // Gentle breathing float
      groupRef.current.position.y = Math.sin(t * 0.7) * 0.07;
    }

    // OLED screen pulse
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.55 + Math.sin(t * 1.8) * 0.15;
    }

    // Glow pulse
    if (glowRef.current) {
      glowRef.current.intensity = 1.2 + Math.sin(t * 2.2) * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── Device body ── */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.95, 1.3, 0.28]} />
        <meshStandardMaterial
          color={BODY}
          metalness={0.75}
          roughness={0.22}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* ── Chamfered edge accent (thin strip) ── */}
      <mesh position={[0, 0, 0.141]}>
        <boxGeometry args={[0.93, 1.28, 0.01]} />
        <meshStandardMaterial
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={0.08}
          metalness={0.9}
          roughness={0.05}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* ── OLED bezel ── */}
      <mesh position={[0, 0.08, 0.142]}>
        <boxGeometry args={[0.72, 0.62, 0.008]} />
        <meshStandardMaterial color={SCREEN} metalness={0.1} roughness={0.05} />
      </mesh>

      {/* ── OLED screen (emissive) ── */}
      <mesh ref={screenRef} position={[0, 0.08, 0.148]}>
        <boxGeometry args={[0.66, 0.56, 0.001]} />
        <meshStandardMaterial
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={0.55}
          roughness={0.0}
          metalness={0.0}
        />
      </mesh>

      {/* ── OLED scanline overlay (very subtle) ── */}
      <mesh position={[0, 0.08, 0.149]}>
        <boxGeometry args={[0.66, 0.56, 0.0005]} />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.07}
          roughness={1}
        />
      </mesh>

      {/* ── Left button ── */}
      <mesh position={[-0.475, -0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 0.06, 20]} />
        <meshStandardMaterial color="#1c242c" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* ── Right button ── */}
      <mesh position={[0.475, -0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 0.06, 20]} />
        <meshStandardMaterial color="#1c242c" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* ── Corner accent pins ── */}
      {(
        [[-0.4, 0.57], [0.4, 0.57], [-0.4, -0.57], [0.4, -0.57]] as [number, number][]
      ).map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.142]}>
          <cylinderGeometry args={[0.022, 0.022, 0.018, 10]} />
          <meshStandardMaterial
            color={i < 2 ? CYAN : AMBER}
            emissive={i < 2 ? CYAN : AMBER}
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.05}
          />
        </mesh>
      ))}

      {/* ── USB port (bottom) ── */}
      <mesh position={[0, -0.65, 0]}>
        <boxGeometry args={[0.18, 0.05, 0.29]} />
        <meshStandardMaterial color="#0a1015" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* ── Glow light (dynamic) ── */}
      <pointLight
        ref={glowRef}
        position={[0, 0.1, 0.6]}
        color={CYAN}
        intensity={1.4}
        distance={3}
        decay={2}
      />

      {/* ── Ambient accent on back ── */}
      <pointLight
        position={[0, 0, -1.2]}
        color={AMBER}
        intensity={0.5}
        distance={3}
        decay={2}
      />
    </group>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight position={[3, 4, 5]} intensity={0.7} castShadow />
      <directionalLight position={[-4, -2, -4]} intensity={0.2} color={CYAN} />
    </>
  );
}

interface PixieModelProps {
  scrollProgress?: number;
}

export function PixieModel({ scrollProgress = 0 }: PixieModelProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 38 }}
      style={{ width: '100%', height: '100%' }}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <SceneLighting />

      <Suspense fallback={null}>
        <PixieMesh scrollProgress={scrollProgress} />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
