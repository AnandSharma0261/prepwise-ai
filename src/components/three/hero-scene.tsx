"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Sphere,
  Environment,
  Stars,
  Torus,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function AIOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
      <Sphere args={[1.6, 64, 64]} ref={meshRef}>
        <MeshDistortMaterial
          color="#7c3aed"
          attach="material"
          distort={0.45}
          speed={2.2}
          roughness={0.15}
          metalness={0.85}
          emissive="#6366f1"
          emissiveIntensity={0.35}
        />
      </Sphere>
    </Float>
  );
}

function OrbitRing({ radius, tilt }: { radius: number; tilt: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.25;
  });
  return (
    <Torus
      ref={ref}
      args={[radius, 0.015, 16, 200]}
      rotation={[tilt, 0, 0]}
    >
      <meshStandardMaterial
        color="#06b6d4"
        emissive="#06b6d4"
        emissiveIntensity={1.5}
        transparent
        opacity={0.7}
      />
    </Torus>
  );
}

function FloatingParticles() {
  const points = Array.from({ length: 18 }).map((_, i) => {
    const angle = (i / 18) * Math.PI * 2;
    const r = 2.3 + (i % 3) * 0.4;
    return [Math.cos(angle) * r, Math.sin(angle * 0.7) * 1.2, Math.sin(angle) * r] as [
      number,
      number,
      number,
    ];
  });

  return (
    <>
      {points.map((pos, i) => (
        <Float
          key={i}
          speed={1 + (i % 4) * 0.3}
          rotationIntensity={1}
          floatIntensity={2}
        >
          <mesh position={pos}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#a855f7" : "#06b6d4"}
              emissive={i % 2 === 0 ? "#a855f7" : "#06b6d4"}
              emissiveIntensity={2}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#a855f7" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#06b6d4" />
          <Stars
            radius={50}
            depth={50}
            count={2000}
            factor={4}
            saturation={0.5}
            fade
            speed={0.5}
          />
          <AIOrb />
          <OrbitRing radius={2.4} tilt={Math.PI / 3} />
          <OrbitRing radius={2.9} tilt={Math.PI / 6} />
          <FloatingParticles />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
