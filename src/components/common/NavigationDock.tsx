"use client";

import { useAudio } from "@/hooks/useAudio";
import { siteConfig } from "@/config/site";
import { LatencyIndicator } from "./LatencyIndicator";
import { SoundToggle } from "./SoundToggle";

export function NavigationDock() {
  const { chrome } = siteConfig;
  const { playSnap, playTick } = useAudio();

  const handleLaunchConsole = () => {
    playSnap();
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("omniflow:launch-console", {
          detail: { timestamp: Date.now() },
        })
      );
    }
  };

  return (
    <header
      role="banner"
      className="fixed top-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none select-none"
    >
      <div
        className="pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 px-4 py-2 rounded-xl border backdrop-blur-md shadow-2xl max-w-5xl w-full transition-all duration-300"
        style={{
          borderColor: chrome.colors.border,
          backgroundColor: chrome.colors.obsidianCard,
        }}
      >
        {/* Monogram Section */}
        <div className="flex items-center gap-3">
          <a
            href="#hero"
            onMouseEnter={playTick}
            data-magnetic="true"
            className="flex items-center gap-2 group outline-none"
            aria-label={siteConfig.name}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg border font-mono font-bold text-sm tracking-tighter transition-transform duration-200 group-hover:scale-105"
              style={{
                borderColor: chrome.colors.racingLime,
                backgroundColor: chrome.colors.obsidianSurface,
                color: chrome.colors.racingLime,
              }}
            >
              {chrome.monogram}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-mono text-xs font-bold tracking-wider text-neutral-100">
                {siteConfig.name}
              </span>
              <span
                className="font-mono text-[9px] uppercase tracking-widest"
                style={{ color: chrome.colors.racingLime }}
              >
                {chrome.monogramSub}
              </span>
            </div>
          </a>
        </div>

        {/* Live Status & Audio Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <LatencyIndicator />
          <SoundToggle />
        </div>

        {/* Launch Console Trigger */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleLaunchConsole}
            onMouseEnter={playTick}
            data-magnetic="true"
            aria-label={chrome.consoleAriaLabel}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 outline-none hover:shadow-lg focus-visible:ring-1"
            style={{
              borderColor: chrome.colors.racingLime,
              backgroundColor: chrome.colors.racingLime,
              color: chrome.colors.obsidian,
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-obsidian" />
            </span>
            <span>{chrome.consoleTriggerLabel}</span>
            <span className="hidden lg:inline text-[10px] opacity-75 font-normal">
              {chrome.consoleShortcutHint}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
