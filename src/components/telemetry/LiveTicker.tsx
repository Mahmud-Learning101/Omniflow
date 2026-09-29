"use client";

import React, { useState, useEffect } from "react";
import { telemetryConfig } from "@/config/telemetry";
import { playMicroTick } from "@/lib/sound";
import { Activity, TrendingUp, Clock, ShieldCheck, Zap } from "lucide-react";
import type { EventStreamEntry } from "@/types/telemetry";

export function LiveTicker({ tickerSpeed = 2500 }: { tickerSpeed?: number }) {
  const [events, setEvents] = useState<EventStreamEntry[]>([...telemetryConfig.initialEvents]);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/telemetry?limit=5");
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.events?.length) {
            setEvents(data.events);
          }
        }
      } catch {
        // Fallback to existing events
      }
      setActiveEventIndex((prev) => (prev + 1) % (events.length || 1));
    }, tickerSpeed);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [tickerSpeed, events.length]);

  const activeEvent = events[activeEventIndex] || events[0];

  return (
    <div data-testid="live-ticker" className="w-full space-y-6">
      {/* Dynamic Live Pulse Banner */}
      {activeEvent && (
        <div
          data-testid="ticker-active-pulse"
          className="flex items-center justify-between px-4 py-3 rounded-xl border border-obsidian-border bg-obsidian-card/80 backdrop-blur-md text-xs font-mono text-neutral-300"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-racing-lime opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-racing-lime" />
            </span>
            <span className="text-racing-lime uppercase font-semibold">{activeEvent.sourceHub}</span>
            <span className="text-neutral-500">//</span>
            <span className="truncate max-w-xs sm:max-w-md">{activeEvent.message}</span>
          </div>
          <span className="hidden sm:inline-block text-neutral-500">{activeEvent.latencyMs}ms latency</span>
        </div>
      )}

      {/* Operational Efficiency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {telemetryConfig.efficiencyGains.map((gain, idx) => (
          <div
            key={gain.category}
            data-testid={`efficiency-gain-card-${idx}`}
            onMouseEnter={playMicroTick}
            className="group relative p-5 rounded-xl border border-obsidian-border bg-gradient-to-br from-obsidian-surface/90 to-obsidian-card/70 hover:border-racing-lime/50 transition-all duration-300 backdrop-blur-md"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-racing-lime/10 border border-racing-lime/20 text-racing-lime text-xs font-mono">
                {idx === 0 ? <Zap className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                <span>{gain.category}</span>
              </div>
              <span className="text-xs font-mono text-neutral-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {gain.hoursAutomatedPerWeek}h/wk
              </span>
            </div>

            <h4 className="text-lg font-bold text-neutral-100 group-hover:text-racing-lime transition-colors">
              {gain.headlineMetric}
            </h4>

            <p className="text-xs text-neutral-400 mt-1 mb-4 leading-relaxed font-sans">
              {gain.description}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-obsidian-border text-xs font-mono">
              <div className="flex flex-col">
                <span className="text-neutral-500">Savings Target</span>
                <span className="text-neutral-200 font-semibold">{gain.savingsRatio}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-neutral-500">Intervention Drop</span>
                <span className="text-racing-lime font-bold">-{gain.humanInterventionDrop}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
