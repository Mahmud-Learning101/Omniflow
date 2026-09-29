"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

export function LatencyIndicator() {
  const { chrome } = siteConfig;
  const [latency, setLatency] = useState(chrome.latencyTarget);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time edge telemetry latency fluctuations
      const jitter = (Math.random() - 0.5) * 3.2;
      const nextLatency = Math.max(8.0, +(chrome.latencyTarget + jitter).toFixed(1));
      setLatency(nextLatency);
    }, 1800);

    return () => clearInterval(interval);
  }, [chrome.latencyTarget]);

  return (
    <div
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-obsidian-border bg-obsidian-surface/80 backdrop-blur-sm text-xs font-mono select-none"
      title={`${chrome.statusActiveLabel} // ${chrome.latencyUnit}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ backgroundColor: chrome.colors.racingLime }}
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: chrome.colors.racingLime }}
        />
      </span>
      <span className="font-semibold text-neutral-200">
        {latency.toFixed(1)}
        <span className="ml-0.5 text-neutral-400">{chrome.latencyUnit}</span>
      </span>
      <span
        className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] uppercase tracking-wider font-semibold border"
        style={{
          borderColor: chrome.colors.border,
          color: chrome.colors.racingLime,
          backgroundColor: chrome.colors.obsidianCard,
        }}
      >
        {chrome.statusActiveLabel}
      </span>
    </div>
  );
}
