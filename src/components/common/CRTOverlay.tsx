"use client";

import { siteConfig } from "@/config/site";

export function CRTOverlay() {
  const { chrome } = siteConfig;

  // Lightweight SVG noise filter data URI for hardware-accelerated film grain
  const grainSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 select-none overflow-hidden"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Dynamic Scanlines */}
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px]"
        style={{ opacity: chrome.crt.scanlineOpacity }}
      />

      {/* Sweeping Terminal Beam */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-24 -translate-y-full animate-scanline"
        style={{ opacity: chrome.crt.scanlineOpacity * 0.8 }}
      />

      {/* Terminal Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, ${chrome.colors.obsidian} 100%)`,
          opacity: chrome.crt.vignetteOpacity,
        }}
      />

      {/* Film Grain Layer */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          backgroundImage: `url("${grainSvg}")`,
          backgroundRepeat: "repeat",
          opacity: chrome.crt.noiseOpacity,
        }}
      />

      {/* Corner Telemetry Bracket Markers */}
      <div
        className="absolute top-2 left-2 text-[10px] font-mono leading-none"
        style={{ color: chrome.colors.borderHover }}
      >
        +
      </div>
      <div
        className="absolute top-2 right-2 text-[10px] font-mono leading-none"
        style={{ color: chrome.colors.borderHover }}
      >
        +
      </div>
      <div
        className="absolute bottom-2 left-2 text-[10px] font-mono leading-none"
        style={{ color: chrome.colors.borderHover }}
      >
        +
      </div>
      <div
        className="absolute bottom-2 right-2 text-[10px] font-mono leading-none"
        style={{ color: chrome.colors.borderHover }}
      >
        +
      </div>
    </div>
  );
}
