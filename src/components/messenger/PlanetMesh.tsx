'use client';

import { useEffect } from 'react';
import * as THREE from 'three';
import { calculateElevationDisplacement } from '@/lib/math';

export interface PlanetMeshProps {
  parentGroup: THREE.Group;
  radius?: number;
}

export function createProceduralPlanet(radius = 2.5): THREE.Group {
  const planetGroup = new THREE.Group();
  planetGroup.name = 'ProceduralPlanetGroup';

  // Base low-poly icosahedron
  const geometry = new THREE.IcosahedronGeometry(radius, 3);
  const posAttr = geometry.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < posAttr.count; i++) {
    vertex.fromBufferAttribute(posAttr, i);
    const displacedRadius = calculateElevationDisplacement(
      vertex.x,
      vertex.y,
      vertex.z,
      radius
    );
    vertex.normalize().multiplyScalar(displacedRadius);
    posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  geometry.computeVertexNormals();

  // Tactical dark cybernetic faceted terrain
  const planetMaterial = new THREE.MeshStandardMaterial({
    color: 0x162032,
    roughness: 0.45,
    metalness: 0.6,
    flatShading: true,
  });

  const planetMesh = new THREE.Mesh(geometry, planetMaterial);
  planetMesh.name = 'PlanetTerrainMesh';
  planetMesh.castShadow = true;
  planetMesh.receiveShadow = true;
  planetGroup.add(planetMesh);

  // Racing Lime tactical mesh wireframe
  const wireGeometry = new THREE.IcosahedronGeometry(radius * 1.004, 2);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xd2ff00,
    wireframe: true,
    transparent: true,
    opacity: 0.22,
  });
  const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
  wireMesh.name = 'PlanetWireframe';
  planetGroup.add(wireMesh);

  // Glowing cyan equator telemetry ring
  const ringGeo = new THREE.TorusGeometry(radius * 1.12, 0.015, 8, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.45,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  planetGroup.add(ringMesh);

  // Luminous atmosphere glow shell
  const atmoGeometry = new THREE.SphereGeometry(radius * 1.08, 32, 32);
  const atmoMaterial = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });
  const atmoMesh = new THREE.Mesh(atmoGeometry, atmoMaterial);
  atmoMesh.name = 'PlanetAtmosphere';
  planetGroup.add(atmoMesh);

  return planetGroup;
}

export function PlanetMesh({ parentGroup, radius = 2.5 }: PlanetMeshProps) {
  useEffect(() => {
    const planet = createProceduralPlanet(radius);
    parentGroup.add(planet);

    return () => {
      parentGroup.remove(planet);
      planet.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    };
  }, [parentGroup, radius]);

  return null;
}
