"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function QuantumTensorRing() {
  const torusRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Generate orbital halo particles
  const particleCount = 240;
  const particlePositions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = (i / particleCount) * Math.PI * 2;
      const radius = 2.6 + (Math.random() - 0.5) * 0.6;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
      pos[i * 3 + 2] = Math.sin(theta) * radius;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const targetX = -state.pointer.y * 0.4;
    const targetY = state.pointer.x * 0.6;

    if (torusRef.current) {
      torusRef.current.rotation.x = THREE.MathUtils.lerp(torusRef.current.rotation.x, targetX + 0.5, delta * 3);
      torusRef.current.rotation.y = THREE.MathUtils.lerp(torusRef.current.rotation.y, targetY + t * 0.35, delta * 3);
      torusRef.current.rotation.z = Math.sin(t * 0.5) * 0.15;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -targetX * 0.7 - t * 0.25;
      ring2Ref.current.rotation.y = -targetY * 0.7 + t * 0.4;
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Torus Wireframe */}
      <mesh ref={torusRef}>
        <torusGeometry args={[2.2, 0.55, 16, 64]} />
        <meshStandardMaterial
          color="#d2ff00"
          emissive="#d2ff00"
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Counter-rotating Gyro Ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.65, 0.08, 12, 48]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={1.2}
          wireframe
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Orbiting Telemetry Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#d2ff00"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Central Ambient Core Light */}
      <pointLight color="#d2ff00" intensity={4} distance={6} decay={2} />
      <pointLight color="#00f0ff" intensity={5} distance={5} decay={2} />
    </group>
  );
}

export function HeroVisual() {
  return (
    <div
      data-testid="hero-visual-canvas"
      className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-75"
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <QuantumTensorRing />
        </Suspense>
      </Canvas>
    </div>
  );
}
