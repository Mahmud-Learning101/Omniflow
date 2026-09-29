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

  // Dark obsidian faceted terrain
  const planetMaterial = new THREE.MeshStandardMaterial({
    color: 0x0c0e14,
    roughness: 0.85,
    metalness: 0.25,
    flatShading: true,
  });

  const planetMesh = new THREE.Mesh(geometry, planetMaterial);
  planetMesh.name = 'PlanetTerrainMesh';
  planetMesh.castShadow = true;
  planetMesh.receiveShadow = true;
  planetGroup.add(planetMesh);

  // Racing Lime tactical mesh wireframe
  const wireGeometry = new THREE.IcosahedronGeometry(radius * 1.002, 2);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xd2ff00,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  });
  const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
  wireMesh.name = 'PlanetWireframe';
  planetGroup.add(wireMesh);

  // Subtle atmosphere glow shell
  const atmoGeometry = new THREE.SphereGeometry(radius * 1.05, 24, 24);
  const atmoMaterial = new THREE.MeshBasicMaterial({
    color: 0xd2ff00,
    transparent: true,
    opacity: 0.03,
    side: THREE.BackSide,
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
