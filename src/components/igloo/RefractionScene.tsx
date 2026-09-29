"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ShaderPreset } from "@/types/shaders";
import { shadersConfig } from "@/config/shaders";
import { RefractiveCapsule } from "./RefractiveCapsule";

interface RefractionSceneProps {
  preset: ShaderPreset;
  className?: string;
}

/**
 * Dynamic client-only Three.js canvas container with graceful fallback.
 * Houses RefractiveCapsule within an optical darkroom environment.
 */
export function RefractionScene({ preset, className = "" }: RefractionSceneProps) {
  const [isMounted, setIsMounted] = useState(false);
  const chamberCopy = shadersConfig.chamber;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        data-testid="refraction-canvas-fallback"
        className={`relative w-full h-[460px] md:h-[540px] rounded-2xl border border-obsidian-border bg-obsidian-surface/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center ${className}`}
      >
        <div className="w-12 h-12 rounded-full border-2 border-racing-lime/20 border-t-racing-lime animate-spin mb-4" />
        <span className="font-mono text-xs tracking-widest text-racing-lime uppercase animate-pulse">
          {chamberCopy.fallbackLoadingText}
        </span>
      </div>
    );
  }

  return (
    <div
      data-testid="refraction-canvas-container"
      className={`relative w-full h-[460px] md:h-[540px] rounded-2xl border border-obsidian-border bg-gradient-to-b from-obsidian-surface/80 via-obsidian-card/90 to-obsidian overflow-hidden backdrop-blur-md shadow-2xl ${className}`}
      role="region"
      aria-label={chamberCopy.canvasAriaLabel}
    >
      {/* Decorative chamber grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(210,255,0,0.06),rgba(0,0,0,0.85)_70%)] pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={preset.lighting.ambientLightIntensity} />
        <directionalLight
          position={preset.lighting.primaryLightPosition}
          color={preset.lighting.primaryLightColor}
          intensity={preset.lighting.primaryLightIntensity}
        />
        <Suspense fallback={null}>
          <RefractiveCapsule preset={preset} />
        </Suspense>
      </Canvas>

      {/* Viewport coordinate watermark */}
      <div className="absolute bottom-3 left-4 pointer-events-none font-mono text-[9px] text-neutral-500 tracking-widest uppercase">
        {preset.name} // 3D WEGBL-2 RENDERER
      </div>
    </div>
  );
}
