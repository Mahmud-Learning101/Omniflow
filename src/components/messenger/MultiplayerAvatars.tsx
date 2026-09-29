'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { latLngToVector3, slerpOnSphere, type Vec3 } from '@/lib/math';

export interface MultiplayerAvatarsProps {
  parentGroup: THREE.Group;
  radius?: number;
}

interface SimulatedOperator {
  mesh: THREE.Mesh;
  currentPos: Vec3;
  targetPos: Vec3;
  progress: number;
  speed: number;
}

const OPERATOR_COLORS = [0xd2ff00, 0x00f0ff, 0xff007a, 0xffb800, 0x00ff88, 0x7000ff];

export function MultiplayerAvatars({ parentGroup, radius = 2.5 }: MultiplayerAvatarsProps) {
  const avatarsGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const avatarsGroup = new THREE.Group();
    avatarsGroup.name = 'MultiplayerAvatarsGroup';
    avatarsGroupRef.current = avatarsGroup;

    const surfaceRadius = radius * 1.015;
    const operatorCount = 6;
    const operators: SimulatedOperator[] = [];

    const geo = new THREE.SphereGeometry(0.045, 8, 8);

    for (let i = 0; i < operatorCount; i++) {
      const lat = (Math.random() - 0.5) * 140;
      const lng = (Math.random() - 0.5) * 360;
      const initPos = latLngToVector3(lat, lng, surfaceRadius);

      const color = OPERATOR_COLORS[i % OPERATOR_COLORS.length];
      const mat = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...initPos);
      avatarsGroup.add(mesh);

      const nextLat = (Math.random() - 0.5) * 140;
      const nextLng = (Math.random() - 0.5) * 360;
      const targetPos = latLngToVector3(nextLat, nextLng, surfaceRadius);

      operators.push({
        mesh,
        currentPos: initPos,
        targetPos,
        progress: 0,
        speed: 0.015 + Math.random() * 0.02,
      });
    }

    parentGroup.add(avatarsGroup);

    // 15Hz State Dispatcher (~66.6ms) updating navigation targets
    const interval15Hz = setInterval(() => {
      operators.forEach((op) => {
        if (op.progress >= 1) {
          op.currentPos = [...op.targetPos] as Vec3;
          const nextLat = (Math.random() - 0.5) * 140;
          const nextLng = (Math.random() - 0.5) * 360;
          op.targetPos = latLngToVector3(nextLat, nextLng, surfaceRadius);
          op.progress = 0;
        } else {
          op.progress = Math.min(1, op.progress + op.speed);
        }
      });
    }, 1000 / 15);

    // Continuous Frame Render Lerp
    let animId: number;
    const animate = () => {
      operators.forEach((op) => {
        const nextPos = slerpOnSphere(op.currentPos, op.targetPos, op.progress, surfaceRadius);
        op.mesh.position.set(...nextPos);
      });
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      clearInterval(interval15Hz);
      cancelAnimationFrame(animId);
      parentGroup.remove(avatarsGroup);
      geo.dispose();
      avatarsGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, [parentGroup, radius]);

  return null;
}
