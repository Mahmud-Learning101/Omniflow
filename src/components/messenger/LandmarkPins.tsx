'use client';

import { useEffect } from 'react';
import * as THREE from 'three';
import { hubsConfig } from '@/config/nodes';
import { latLngToVector3 } from '@/lib/math';
import { playMicroTick } from '@/lib/sound';
import type { OperationalHub } from '@/types/nodes';

export interface LandmarkPinsProps {
  parentGroup: THREE.Group;
  radius?: number;
  onSelectHub: (hub: OperationalHub) => void;
}

const TIER_COLORS: Record<OperationalHub['tier'], number> = {
  primary: 0xd2ff00, // Racing Lime
  edge: 0x00f0ff,    // Cyan
  gateway: 0xffb800, // Amber
};

export function LandmarkPins({ parentGroup, radius = 2.5, onSelectHub }: LandmarkPinsProps) {
  useEffect(() => {
    const pinsGroup = new THREE.Group();
    pinsGroup.name = 'LandmarkPinsGroup';

    hubsConfig.hubs.forEach((hub) => {
      const [x, y, z] = latLngToVector3(hub.coordinates.lat, hub.coordinates.lng, radius);
      const normal = new THREE.Vector3(x, y, z).normalize();
      const color = TIER_COLORS[hub.tier] || 0xd2ff00;

      const hubNodeGroup = new THREE.Group();
      hubNodeGroup.name = `HubGroup_${hub.id}`;
      hubNodeGroup.position.set(x, y, z);
      hubNodeGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      // Pin Shaft (Cylinder)
      const shaftGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.28, 8);
      shaftGeo.translate(0, 0.14, 0);
      const shaftMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 });
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);
      hubNodeGroup.add(shaft);

      // Glowing Apex Beacon
      const apexGeo = new THREE.SphereGeometry(0.065, 12, 12);
      apexGeo.translate(0, 0.28, 0);
      const apexMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      });
      const apex = new THREE.Mesh(apexGeo, apexMat);
      hubNodeGroup.add(apex);

      // Tangential pulse ring
      const ringGeo = new THREE.RingGeometry(0.05, 0.08, 16);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      hubNodeGroup.add(ring);

      // Invisible Raycasting Hitbox (Oversized sphere for easy clicking/tapping)
      const hitboxGeo = new THREE.SphereGeometry(0.24, 8, 8);
      hitboxGeo.translate(0, 0.18, 0);
      const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitbox = new THREE.Mesh(hitboxGeo, hitboxMat);
      hitbox.name = `Hitbox_${hub.id}`;
      hitbox.userData = { hubId: hub.id, hub, isLandmarkHitbox: true };
      hubNodeGroup.add(hitbox);

      pinsGroup.add(hubNodeGroup);
    });

    parentGroup.add(pinsGroup);

    return () => {
      parentGroup.remove(pinsGroup);
      pinsGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, [parentGroup, radius, onSelectHub]);

  return null;
}
