"use client";

import React from "react";
import { ShaderPreset } from "@/types/shaders";
import { shadersConfig } from "@/config/shaders";
import { soundEngine } from "@/lib/sound";

interface ShaderControlsHUDProps {
  activePreset: ShaderPreset;
  availablePresets: ShaderPreset[];
  onSelectPreset: (presetId: string) => void;
  className?: string;
}

/**
 * Monospaced telemetry readout of active IOR, dispersion, and roughness.
 * Strictly reads labels from shadersConfig to guarantee zero hardcoded copy.
 */
export function ShaderControlsHUD({
  activePreset,
  availablePresets,
  onSelectPreset,
  className = "",
}: ShaderControlsHUDProps) {
  const hudCopy = shadersConfig.chamber.hud;

  const handleSelect = (id: string) => {
    soundEngine.playRelaySnap();
    onSelectPreset(id);
  };

  return (
    <div
      data-testid="shader-controls-hud"
      className={`rounded-xl border border-obsidian-border bg-obsidian-card/85 p-5 backdrop-blur-md shadow-2xl ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-obsidian-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-racing-lime opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-racing-lime" />
          </span>
          <span className="font-mono text-xs font-bold tracking-wider text-neutral-200">
            {hudCopy.title}
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-widest text-racing-lime bg-racing-lime/10 px-2 py-0.5 rounded border border-racing-lime/25">
          {hudCopy.statusValue}
        </span>
      </div>

      {/* Preset Selector */}
      <div className="mb-4">
        <div className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase mb-2">
          {hudCopy.presetLabel}
        </div>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label={hudCopy.presetLabel}>
          {availablePresets.map((preset) => {
            const isActive = preset.id === activePreset.id;
            return (
              <button
                key={preset.id}
                data-testid={`preset-btn-${preset.id}`}
                onClick={() => handleSelect(preset.id)}
                className={`px-3 py-2 rounded-lg font-mono text-xs text-left transition-all border ${
                  isActive
                    ? "border-racing-lime bg-racing-lime/15 text-racing-lime shadow-[0_0_12px_rgba(210,255,0,0.18)]"
                    : "border-obsidian-border bg-obsidian-surface/60 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
                }`}
              >
                <div className="font-bold truncate">{preset.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Monospaced Metrics Readout Grid */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-obsidian-border/80">
        <div className="p-2.5 rounded-lg bg-obsidian-surface/80 border border-obsidian-border">
          <div className="font-mono text-[10px] text-neutral-400 uppercase">{hudCopy.iorLabel}</div>
          <div data-testid="hud-ior-value" className="font-mono text-sm font-bold text-neutral-100 mt-0.5">
            {activePreset.refraction.ior.toFixed(3)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-obsidian-surface/80 border border-obsidian-border">
          <div className="font-mono text-[10px] text-neutral-400 uppercase">{hudCopy.dispersionLabel}</div>
          <div data-testid="hud-dispersion-value" className="font-mono text-sm font-bold text-racing-lime mt-0.5">
            {activePreset.refraction.chromaticDispersion.toFixed(3)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-obsidian-surface/80 border border-obsidian-border">
          <div className="font-mono text-[10px] text-neutral-400 uppercase">{hudCopy.roughnessLabel}</div>
          <div data-testid="hud-roughness-value" className="font-mono text-sm font-bold text-neutral-100 mt-0.5">
            {activePreset.refraction.roughness.toFixed(3)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-obsidian-surface/80 border border-obsidian-border">
          <div className="font-mono text-[10px] text-neutral-400 uppercase">{hudCopy.transmissionLabel}</div>
          <div data-testid="hud-transmission-value" className="font-mono text-sm font-bold text-neutral-100 mt-0.5">
            {activePreset.refraction.transmission.toFixed(3)}
          </div>
        </div>
      </div>
    </div>
  );
}
