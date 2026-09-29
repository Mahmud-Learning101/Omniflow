"use client";

import React, { useState } from "react";
import { Sliders, Activity, Terminal } from "lucide-react";
import { LiveTicker } from "./LiveTicker";
import { MetricsHUD } from "./MetricsHUD";
import { AdminOverrideDesk } from "./AdminOverrideDesk";
import { playRelaySnap } from "@/lib/sound";

export function OperationsDeck() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [brandColor, setBrandColor] = useState("#d2ff00");
  const [shaderIor, setShaderIor] = useState(1.45);
  const [shaderRoughness, setShaderRoughness] = useState(0.12);
  const [tickerSpeed, setTickerSpeed] = useState(2500);

  const toggleAdmin = () => {
    playRelaySnap();
    setIsAdminOpen((prev) => !prev);
  };

  return (
    <section
      id="telemetry"
      data-testid="operations-deck"
      className="relative w-full py-20 px-4 sm:px-6 lg:px-8 border-b border-obsidian-border bg-obsidian text-neutral-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-obsidian-border">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-obsidian-border bg-obsidian-card backdrop-blur-md">
              <Activity className="w-3.5 h-3.5 text-racing-lime" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-racing-lime">
                04 // Operations Deck
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-sans">
              Consensus & Telemetry <span style={{ color: brandColor }}>Pulse</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl font-sans">
              Real-time hardware verification gauges, zero-drift pipeline efficiency metrics, and live Atlas sync.
            </p>
          </div>

          <button
            data-testid="btn-open-admin"
            onClick={toggleAdmin}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-obsidian-border bg-obsidian-card/80 hover:border-racing-lime text-xs font-mono tracking-wider uppercase transition-all backdrop-blur-md hover:text-racing-lime"
          >
            <Sliders className="w-4 h-4 text-racing-lime" />
            <span>Admin Console</span>
          </button>
        </div>

        {/* Telemetry HUD & Ticker Grid */}
        <div className="space-y-8">
          <MetricsHUD />
          <LiveTicker tickerSpeed={tickerSpeed} />
        </div>
      </div>

      <AdminOverrideDesk
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        brandColor={brandColor}
        onBrandColorChange={setBrandColor}
        shaderIor={shaderIor}
        onShaderIorChange={setShaderIor}
        shaderRoughness={shaderRoughness}
        onShaderRoughnessChange={setShaderRoughness}
        tickerSpeed={tickerSpeed}
        onTickerSpeedChange={setTickerSpeed}
      />
    </section>
  );
}
