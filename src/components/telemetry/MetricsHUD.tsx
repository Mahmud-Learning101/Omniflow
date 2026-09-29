"use client";

import React, { useState, useEffect, useRef } from "react";
import { telemetryConfig } from "@/config/telemetry";
import { hubsConfig } from "@/config/nodes";
import { Gauge, Cpu, Network, Radio } from "lucide-react";

export function MetricsHUD() {
  const [fps, setFps] = useState(60);
  const [latency, setLatency] = useState(12.4);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animId: number;
    const updateFPS = () => {
      frameCount.current += 1;
      const now = performance.now();
      const delta = now - lastTime.current;

      if (delta >= 1000) {
        const calculatedFps = Math.round((frameCount.current * 1000) / delta);
        setFps(Math.min(120, Math.max(30, calculatedFps)));
        frameCount.current = 0;
        lastTime.current = now;
        // Minor dynamic jitter for realistic telemetry gauge feel
        setLatency(Number((12.2 + (Math.random() * 0.8 - 0.4)).toFixed(1)));
      }
      animId = requestAnimationFrame(updateFPS);
    };

    animId = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(animId);
  }, []);

  const activeNodesCount = hubsConfig.hubs.length;
  const targetLatency = telemetryConfig.kpiPulses[0]?.targetBenchmark || 20.0;

  return (
    <div
      data-testid="metrics-hud"
      className="p-6 rounded-2xl border border-obsidian-border bg-obsidian-card/90 backdrop-blur-xl shadow-2xl space-y-6"
    >
      <div className="flex items-center justify-between border-b border-obsidian-border pb-4">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-neutral-400">
          <Gauge className="w-4 h-4 text-racing-lime" />
          <span>HARDWARE TELEMETRY GAUGES</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-racing-lime animate-pulse" />
          <span className="text-[11px] font-mono uppercase text-racing-lime">NOMINAL // 60Hz</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* FPS Gauge */}
        <div data-testid="gauge-fps" className="p-4 rounded-xl border border-obsidian-border bg-obsidian-surface/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
            <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> FRAME RATE</span>
            <span className="text-racing-lime">{(fps >= 55) ? "OPTIMAL" : "STABLE"}</span>
          </div>
          <div className="text-3xl font-mono font-bold text-white flex items-baseline gap-1">
            <span>{fps}</span>
            <span className="text-xs text-neutral-500">FPS</span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-racing-lime h-1.5 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (fps / 60) * 100)}%` }} />
          </div>
        </div>

        {/* P99 Latency Gauge */}
        <div data-testid="gauge-latency" className="p-4 rounded-xl border border-obsidian-border bg-obsidian-surface/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
            <span className="flex items-center gap-1.5"><Radio className="w-3.5 h-3.5" /> P99 LATENCY</span>
            <span className="text-racing-lime">&lt; {targetLatency}ms</span>
          </div>
          <div className="text-3xl font-mono font-bold text-racing-lime flex items-baseline gap-1">
            <span>{latency}</span>
            <span className="text-xs text-neutral-500">ms</span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-racing-lime h-1.5 rounded-full transition-all duration-300" style={{ width: `${Math.max(10, Math.min(100, (1 - latency / 30) * 100))}%` }} />
          </div>
        </div>

        {/* Active Nodes Quorum */}
        <div data-testid="gauge-active-nodes" className="p-4 rounded-xl border border-obsidian-border bg-obsidian-surface/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
            <span className="flex items-center gap-1.5"><Network className="w-3.5 h-3.5" /> ACTIVE NODES</span>
            <span className="text-racing-lime">100% QUORUM</span>
          </div>
          <div className="text-3xl font-mono font-bold text-white flex items-baseline gap-1">
            <span>{activeNodesCount}</span>
            <span className="text-xs text-neutral-500">/ {activeNodesCount} HUBS</span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-racing-lime h-1.5 rounded-full" style={{ width: "100%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
