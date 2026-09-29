'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { hubsConfig } from '@/config/nodes';
import { PlanetMesh } from './PlanetMesh';
import { LandmarkPins } from './LandmarkPins';
import { MultiplayerAvatars } from './MultiplayerAvatars';
import { playMicroTick, playWarpHum } from '@/lib/sound';
import type { OperationalHub } from '@/types/nodes';

export interface SphericalSceneProps {
  onSelectHub: (hub: OperationalHub) => void;
}

export function SphericalScene({ onSelectHub }: SphericalSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [planetaryGroup, setPlanetaryGroup] = useState<THREE.Group | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 7.2);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const group = new THREE.Group();
    scene.add(group);
    setPlanetaryGroup(group);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xd2ff00, 1.4);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    // Deep cosmic orbital dust field
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 180;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 16;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xd2ff00,
      transparent: true,
      opacity: 0.35,
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let autoRotate = true;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      autoRotate = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;
      group.rotation.y += deltaX * 0.006;
      group.rotation.x = Math.max(-0.8, Math.min(0.8, group.rotation.x + deltaY * 0.006));
      prevX = e.clientX;
      prevY = e.clientY;
      playWarpHum();
    };

    const onPointerUp = () => { isDragging = false; };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(group.children, true);
      const hit = hits.find((h) => h.object.userData?.isLandmarkHitbox);
      if (hit?.object.userData?.hub) {
        onSelectHub(hit.object.userData.hub);
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('click', onClick);

    let animId: number;
    const render = () => {
      if (autoRotate) group.rotation.y += 0.002;
      particlesMesh.rotation.y += 0.0003;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('click', onClick);
      renderer.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      setPlanetaryGroup(null);
    };
  }, [onSelectHub]);

  return (
    <div ref={containerRef} className="relative w-full h-[520px] md:h-[600px] flex items-center justify-center select-none overflow-hidden">
      <canvas ref={canvasRef} data-testid="spherical-canvas" className="w-full h-full cursor-grab active:cursor-grabbing" />
      {planetaryGroup && (
        <>
          <PlanetMesh parentGroup={planetaryGroup} />
          <LandmarkPins parentGroup={planetaryGroup} onSelectHub={onSelectHub} />
          <MultiplayerAvatars parentGroup={planetaryGroup} />
        </>
      )}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-1.5 z-20 max-w-full px-4">
        {hubsConfig.hubs.map((hub) => (
          <button
            key={hub.id}
            data-testid={`node-pin-${hub.id}`}
            onClick={() => onSelectHub(hub)}
            onMouseEnter={playMicroTick}
            className="px-2.5 py-1 rounded-full text-xs font-mono border border-obsidian-border bg-obsidian-card/90 backdrop-blur hover:border-racing-lime hover:text-racing-lime transition-all"
          >
            {hub.name}
          </button>
        ))}
      </div>
    </div>
  );
}
