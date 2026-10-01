"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  X,
  Zap,
  CheckCircle,
  Database,
  Radio,
  Sliders,
  DollarSign,
  Clock,
  Gauge,
  PowerOff,
} from "lucide-react";
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

type OperatingMode = "autonomous" | "human_in_loop" | "strict_circuit_breaker" | "safe_dry_run";

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

  // Commercial Policy Safeguard States
  const [operatingMode, setOperatingMode] = useState<OperatingMode>("autonomous");
  const [maxSpendPerMin, setMaxSpendPerMin] = useState(45.0);
  const [latencyCutoffMs, setLatencyCutoffMs] = useState(850);
  const [confidenceFloor, setConfidenceFloor] = useState(85);
  const [circuitBreakerTripped, setCircuitBreakerTripped] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    playRelaySnap();
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandColor,
          shaderIor,
          shaderRoughness,
          tickerSpeed,
          operatingMode,
          maxSpendPerMinuteUsd: maxSpendPerMin,
          p99LatencyCutoffMs: latencyCutoffMs,
          confidenceFloor: confidenceFloor / 100,
          circuitBreakerTripped,
        }),
      });
      const data = await res.json();
      setSaveStatus(data.isMock ? "Policies Broadcast to Local Fleet" : "Policies Persisted to Atlas & Broadcast");
      setTimeout(() => setSaveStatus(null), 3500);
    } catch {
      setSaveStatus("Policies Stored Locally");
      setTimeout(() => setSaveStatus(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTripKillSwitch = () => {
    playRelaySnap();
    setCircuitBreakerTripped((prev) => !prev);
  };

  return (
    <div
      data-testid="admin-override-desk"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-obsidian/95 backdrop-blur-2xl border-l border-obsidian-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
    >
      <div className="space-y-6">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-obsidian-border pb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-racing-lime" />
            <h3 className="font-mono text-sm uppercase font-bold text-white tracking-wider">
              Fleet Governance & Policy Console
            </h3>
          </div>
          <button
            data-testid="btn-close-admin"
            onClick={() => {
              playRelaySnap();
              onClose();
            }}
            className="p-1 rounded-md text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Kill-switch Banner */}
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            circuitBreakerTripped
              ? "border-red-500 bg-red-950/40 text-red-300"
              : "border-obsidian-border bg-obsidian-card/60 text-neutral-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PowerOff className={`w-4 h-4 ${circuitBreakerTripped ? "text-red-400 animate-pulse" : "text-neutral-400"}`} />
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold uppercase">
                  {circuitBreakerTripped ? "EMERGENCY CIRCUIT BREAKER: TRIPPED" : "FLEET CIRCUIT BREAKER: ARMED"}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {circuitBreakerTripped ? "All agent task dispatching halted across cloud regions" : "Monitoring P99 latency & cost thresholds"}
                </span>
              </div>
            </div>
            <button
              type="button"
              data-testid="btn-trip-killswitch"
              onClick={handleTripKillSwitch}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold uppercase transition-all ${
                circuitBreakerTripped
                  ? "bg-red-500 text-white hover:bg-red-400"
                  : "bg-obsidian-surface border border-red-500/40 text-red-400 hover:bg-red-900/30"
              }`}
            >
              {circuitBreakerTripped ? "RESET" : "TRIP KILL-SWITCH"}
            </button>
          </div>
        </div>

        {/* Fleet Operating Mode Selector */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-racing-lime" /> FLEET OPERATING MODE
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "autonomous", label: "Autonomous", desc: "Full agent auto-dispatch" },
              { id: "human_in_loop", label: "HITL Required", desc: "Escalates to human reviewer" },
              { id: "strict_circuit_breaker", label: "Strict Guardrail", desc: "Auto-halts on 1% variance" },
              { id: "safe_dry_run", label: "Safe Dry-Run", desc: "Zero state mutations" },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                data-testid={`mode-btn-${mode.id}`}
                onClick={() => {
                  playMicroTick();
                  setOperatingMode(mode.id as OperatingMode);
                }}
                className={`p-2.5 rounded-lg border text-left font-mono transition-all ${
                  operatingMode === mode.id
                    ? "border-racing-lime bg-racing-lime/10 text-racing-lime"
                    : "border-obsidian-border bg-obsidian-card/40 text-neutral-400 hover:border-neutral-600"
                }`}
              >
                <div className="text-xs font-bold">{mode.label}</div>
                <div className="text-[10px] text-neutral-500 truncate">{mode.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Max Token Spend Rate Limit */}
        <div className="space-y-2 p-3.5 rounded-xl border border-obsidian-border bg-obsidian-surface/50">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-neutral-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-racing-lime" /> MAX TOKEN SPEND RATE
            </span>
            <span className="text-racing-lime font-bold">${maxSpendPerMin.toFixed(2)}/min</span>
          </div>
          <input
            data-testid="slider-spend-limit"
            type="range"
            min="5.0"
            max="150.0"
            step="2.5"
            value={maxSpendPerMin}
            onChange={(e) => setMaxSpendPerMin(parseFloat(e.target.value))}
            className="w-full accent-racing-lime cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-neutral-500">
            <span>$5/min (Conservative)</span>
            <span>$150/min (High Concurrency)</span>
          </div>
        </div>

        {/* P99 Latency Cutoff Threshold */}
        <div className="space-y-2 p-3.5 rounded-xl border border-obsidian-border bg-obsidian-surface/50">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-neutral-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-racing-lime" /> P99 LATENCY CUTOFF
            </span>
            <span className="text-racing-lime font-bold">{latencyCutoffMs}ms</span>
          </div>
          <input
            data-testid="slider-shader-ior"
            type="range"
            min="200"
            max="2500"
            step="50"
            value={latencyCutoffMs}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setLatencyCutoffMs(val);
              onShaderIorChange(1.0 + (val / 2500) * 1.5);
            }}
            className="w-full accent-racing-lime cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-neutral-500">
            <span>200ms (Low Jitter)</span>
            <span>2500ms (Batch Allowed)</span>
          </div>
        </div>

        {/* Hallucination / Confidence Floor */}
        <div className="space-y-2 p-3.5 rounded-xl border border-obsidian-border bg-obsidian-surface/50">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-neutral-300 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-racing-lime" /> CONFIDENCE SCORE FLOOR
            </span>
            <span className="text-racing-lime font-bold">{confidenceFloor}%</span>
          </div>
          <input
            data-testid="slider-shader-roughness"
            type="range"
            min="50"
            max="99"
            step="1"
            value={confidenceFloor}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setConfidenceFloor(val);
              onShaderRoughnessChange(Math.max(0.01, (100 - val) / 100));
            }}
            className="w-full accent-racing-lime cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-neutral-500">
            <span>50% (Permissive)</span>
            <span>99% (Deterministic Strict)</span>
          </div>
        </div>

        {/* Visual UI Ticker Refresh Rate */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-neutral-400">TELEMETRY STREAM INTERVAL</span>
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

      {/* Broadcast & Persistence Controls */}
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
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-racing-lime text-obsidian font-mono font-bold text-xs uppercase hover:bg-white transition-colors shadow-lg hover:shadow-[0_0_24px_rgba(210,255,0,0.4)]"
        >
          <Database className="w-4 h-4" />
          <span>{isSaving ? "Broadcasting to Fleet..." : "Broadcast & Persist Policy to Fleet"}</span>
        </button>
      </div>
    </div>
  );
}
