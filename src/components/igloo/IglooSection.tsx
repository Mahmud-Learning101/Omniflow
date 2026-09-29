"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { shadersConfig } from "@/config/shaders";
import { ShaderPreset } from "@/types/shaders";
import { ShaderControlsHUD } from "./ShaderControlsHUD";
import { SDFScrambleText } from "./SDFScrambleText";

const DynamicRefractionScene = dynamic(
  () => import("./RefractionScene").then((mod) => mod.RefractionScene),
  {
    ssr: false,
    loading: () => (
      <div
        data-testid="refraction-canvas-fallback"
        className="w-full h-[460px] md:h-[540px] rounded-2xl border border-obsidian-border bg-obsidian-surface/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
      >
        <div className="w-12 h-12 rounded-full border-2 border-racing-lime/20 border-t-racing-lime animate-spin mb-4" />
        <span className="font-mono text-xs tracking-widest text-racing-lime uppercase animate-pulse">
          {shadersConfig.chamber.fallbackLoadingText}
        </span>
      </div>
    ),
  }
);

/**
 * Section 2: Igloo Procedural Refraction Chamber & Shaders.
 * Composes the dynamic client-only 3D canvas, controls HUD, and cybernetic ASCII cards.
 */
export function IglooSection() {
  const [activePresetId, setActivePresetId] = useState<string>(shadersConfig.activePreset);
  const chamberCopy = shadersConfig.chamber;

  const availablePresets = useMemo<ShaderPreset[]>(
    () => Object.values(shadersConfig.presets),
    []
  );

  const activePreset = useMemo<ShaderPreset>(
    () => shadersConfig.presets[activePresetId] || shadersConfig.presets[shadersConfig.activePreset],
    [activePresetId]
  );

  return (
    <section
      id="shaders"
      data-testid="igloo-refraction-section"
      className="relative w-full py-20 px-4 sm:px-6 lg:px-8 border-b border-obsidian-border bg-obsidian text-neutral-100 overflow-hidden"
    >
      {/* Background ambient lighting glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-racing-lime/[0.04] blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-obsidian-border bg-obsidian-card backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-racing-lime animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-racing-lime">
              {chamberCopy.badge}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-sans text-neutral-100">
            {chamberCopy.title}
          </h2>

          <p className="text-base sm:text-lg text-neutral-400 font-sans leading-relaxed">
            {chamberCopy.subtitle}
          </p>
        </div>

        {/* 3D Chamber & Telemetry HUD Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <DynamicRefractionScene preset={activePreset} />
          </div>

          <div className="lg:col-span-4">
            <ShaderControlsHUD
              activePreset={activePreset}
              availablePresets={availablePresets}
              onSelectPreset={setActivePresetId}
            />
          </div>
        </div>

        {/* Cybernetic ASCII Hover Scramble Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {chamberCopy.cards.map((card) => (
            <SDFScrambleText key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
