"use client";

import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ShaderPreset } from "@/types/shaders";
import { REFRACTION_VERTEX_SHADER, REFRACTION_FRAGMENT_SHADER } from "@/lib/shaders";

interface RefractiveCapsuleProps {
  preset: ShaderPreset;
}

/**
 * Procedural dual-bevel glass monolith reacting smoothly to mouse pointer tilt.
 * Uses custom GLSL transmission shader with chromatic dispersion and Fresnel glow.
 */
export function RefractiveCapsule({ preset }: RefractiveCapsuleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIor: { value: preset.refraction.ior },
      uChromaticDispersion: { value: preset.refraction.chromaticDispersion },
      uRoughness: { value: preset.refraction.roughness },
      uTransmission: { value: preset.refraction.transmission },
      uThickness: { value: preset.refraction.thickness },
      uFresnelPower: { value: preset.refraction.fresnelPower },
      uSpecularIntensity: { value: preset.refraction.specularIntensity },
      uPrimaryLightPos: { value: new THREE.Vector3(...preset.lighting.primaryLightPosition) },
      uPrimaryLightColor: { value: new THREE.Vector3(...preset.lighting.primaryLightColor) },
      uPrimaryLightIntensity: { value: preset.lighting.primaryLightIntensity },
      uAmbientLightColor: { value: new THREE.Vector3(...preset.lighting.ambientLightColor) },
      uAmbientLightIntensity: { value: preset.lighting.ambientLightIntensity },
      uDistortionFrequency: { value: preset.distortionNoiseFrequency },
      uGlitchSpeed: { value: preset.glitchSpeed },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Synchronize uniforms when active preset changes
  useEffect(() => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uIor.value = preset.refraction.ior;
    u.uChromaticDispersion.value = preset.refraction.chromaticDispersion;
    u.uRoughness.value = preset.refraction.roughness;
    u.uTransmission.value = preset.refraction.transmission;
    u.uThickness.value = preset.refraction.thickness;
    u.uFresnelPower.value = preset.refraction.fresnelPower;
    u.uSpecularIntensity.value = preset.refraction.specularIntensity;
    u.uPrimaryLightPos.value.set(...preset.lighting.primaryLightPosition);
    u.uPrimaryLightColor.value.set(...preset.lighting.primaryLightColor);
    u.uPrimaryLightIntensity.value = preset.lighting.primaryLightIntensity;
    u.uAmbientLightColor.value.set(...preset.lighting.ambientLightColor);
    u.uAmbientLightIntensity.value = preset.lighting.ambientLightIntensity;
    u.uDistortionFrequency.value = preset.distortionNoiseFrequency;
    u.uGlitchSpeed.value = preset.glitchSpeed;
  }, [preset]);

  // Frame loop: mouse tilt damping and floating oscillation
  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    const targetRotX = -state.pointer.y * 0.4 + Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
    const targetRotY = state.pointer.x * 0.5 + Math.cos(state.clock.elapsedTime * 0.4) * 0.08;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, delta * 3.5);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, delta * 3.5);
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group data-testid="refractive-capsule-group">
      {/* Inner luminous state core */}
      <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]} scale={0.45}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2.5}
          wireframe
        />
      </mesh>
      <pointLight color="#d2ff00" intensity={3.5} distance={6} decay={2} />
      <pointLight color="#00f0ff" intensity={4.0} distance={5} decay={2} />

      {/* Outer ambient glow wireframe cage */}
      <mesh rotation={[0, Math.PI / 4, 0]} scale={1.04}>
        <cylinderGeometry args={[1.32, 1.32, 3.42, 8, 1]} />
        <meshBasicMaterial color="#d2ff00" wireframe transparent opacity={0.15} />
      </mesh>

      {/* Procedural dual-bevel monolith */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[1.25, 1.25, 3.3, 32, 16]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={REFRACTION_VERTEX_SHADER}
          fragmentShader={REFRACTION_FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
