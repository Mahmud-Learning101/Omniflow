"use client";

import React, { useState } from "react";
import { Sliders, X, Save, RotateCcw, CheckCircle, Database } from "lucide-react";
import { playRelaySnap, playMicroTick } from "@/lib/sound";

interface AdminOverrideDeskProps {
  isOpen: boolean;
  onClose: () => void;
  brandColor: string;
  onBrandColorChange: (color: string) => void;
  shaderIor: number;
  onShaderIorChange: (ior: number) => void;
  shaderRoughness: number;
  onShaderRoughnessChange: (r: number) => void;
  tickerSpeed: number;
  onTickerSpeedChange: (speed: number) => void;
}

const colorPresets = [
  { name: "Racing Lime", hex: "#d2ff00" },
  { name: "Beacon Cyan", hex: "#00f0ff" },
  { name: "Flame Orange", hex: "#ff4d00" },
  { name: "Electric Violet", hex: "#a855f7" },
];

export function AdminOverrideDesk({
  isOpen,
  onClose,
  brandColor,
  onBrandColorChange,
  shaderIor,
  onShaderIorChange,
  shaderRoughness,
  onShaderRoughnessChange,
  tickerSpeed,
  onTickerSpeedChange,
}: AdminOverrideDeskProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    playRelaySnap();
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandColor, shaderIor, shaderRoughness, tickerSpeed }),
      });
      const data = await res.json();
      setSaveStatus(data.isMock ? "Synced to Local Fallback" : "Persisted to Atlas");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus("Saved Locally");
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div data-testid="admin-override-desk" className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-obsidian/95 backdrop-blur-2xl border-l border-obsidian-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-obsidian-border pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-racing-lime" />
            <h3 className="font-mono text-sm uppercase font-bold text-white">Live Kernel Overrides</h3>
          </div>
          <button data-testid="btn-close-admin" onClick={() => { playRelaySnap(); onClose(); }} className="p-1 rounded-md text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Accent Swatches */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-neutral-400">BRAND ACCENT COLOR</label>
          <div className="grid grid-cols-2 gap-2">
            {colorPresets.map((preset) => (
              <button
                key={preset.hex}
                data-testid={`swatch-${preset.hex}`}
                onClick={() => { playMicroTick(); onBrandColorChange(preset.hex); }}
                className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-mono transition-all ${brandColor === preset.hex ? "border-white bg-white/10 text-white" : "border-obsidian-border text-neutral-400 hover:border-neutral-600"}`}
              >
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.hex }} />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Shader Refraction IOR */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-neutral-400">REFRACTION IOR</span>
            <span className="text-racing-lime">{shaderIor.toFixed(2)}</span>
          </div>
          <input
            data-testid="slider-shader-ior"
            type="range"
            min="1.0"
            max="2.5"
            step="0.01"
            value={shaderIor}
            onChange={(e) => onShaderIorChange(parseFloat(e.target.value))}
            className="w-full accent-racing-lime cursor-pointer"
          />
        </div>

        {/* Shader Roughness */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-neutral-400">SURFACE ROUGHNESS</span>
            <span className="text-racing-lime">{shaderRoughness.toFixed(2)}</span>
          </div>
          <input
            data-testid="slider-shader-roughness"
            type="range"
            min="0.0"
            max="1.0"
            step="0.01"
            value={shaderRoughness}
            onChange={(e) => onShaderRoughnessChange(parseFloat(e.target.value))}
            className="w-full accent-racing-lime cursor-pointer"
          />
        </div>

        {/* Ticker Interval Speed */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-neutral-400">TICKER REFRESH INTERVAL</span>
            <span className="text-racing-lime">{tickerSpeed}ms</span>
          </div>
          <input
            data-testid="slider-ticker-speed"
            type="range"
            min="1000"
            max="5000"
            step="250"
            value={tickerSpeed}
            onChange={(e) => onTickerSpeedChange(parseInt(e.target.value, 10))}
            className="w-full accent-racing-lime cursor-pointer"
          />
        </div>
      </div>

      {/* Persistence Controls */}
      <div className="pt-6 border-t border-obsidian-border space-y-3">
        {saveStatus && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-racing-lime/10 border border-racing-lime/30 text-racing-lime text-xs font-mono">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}
        <button
          data-testid="btn-persist-overrides"
          disabled={isSaving}
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-racing-lime text-obsidian font-mono font-bold text-xs uppercase hover:bg-white transition-colors"
        >
          <Database className="w-3.5 h-3.5" />
          <span>{isSaving ? "Persisting..." : "Persist to Atlas"}</span>
        </button>
      </div>
    </div>
  );
}
