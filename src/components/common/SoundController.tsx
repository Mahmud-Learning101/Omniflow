"use client";

import { useEffect, useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { siteConfig } from "@/config/site";

export function SoundController() {
  const { chrome } = siteConfig;
  const { isMuted, toggleMute, playToggle, playSnap } = useAudio();
  const [hudMessage, setHudMessage] = useState<string | null>(null);

  // Global keyboard shortcut listener ('M' for mute/unmute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input/textarea
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;

      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
        playToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playToggle, toggleMute]);

  // Listen for console launch events
  useEffect(() => {
    const handleConsoleEvent = () => {
      playSnap();
      setHudMessage(chrome.consoleNotice);
      const timer = setTimeout(() => setHudMessage(null), 3200);
      return () => clearTimeout(timer);
    };

    window.addEventListener("omniflow:launch-console", handleConsoleEvent);
    return () => window.removeEventListener("omniflow:launch-console", handleConsoleEvent);
  }, [chrome.consoleNotice, playSnap]);

  if (!hudMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 animate-pulse-subtle"
    >
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-xs font-semibold shadow-2xl backdrop-blur-md"
        style={{
          borderColor: chrome.colors.racingLime,
          backgroundColor: chrome.colors.obsidianCard,
          color: chrome.colors.racingLime,
        }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: chrome.colors.racingLime }}
        />
        <span>{hudMessage}</span>
      </div>
    </div>
  );
}
