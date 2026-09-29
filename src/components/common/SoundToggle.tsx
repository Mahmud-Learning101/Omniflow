"use client";

import { useAudio } from "@/hooks/useAudio";
import { siteConfig } from "@/config/site";

export function SoundToggle() {
  const { chrome } = siteConfig;
  const { isMuted, toggleMute, playTick } = useAudio();

  const handleToggle = () => {
    toggleMute();
  };

  const handleMouseEnter = () => {
    playTick();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      onMouseEnter={handleMouseEnter}
      aria-label={chrome.soundAriaLabel}
      aria-pressed={!isMuted}
      data-magnetic="true"
      className="inline-flex items-center gap-2 px-3 py-1 rounded border transition-colors duration-200 text-xs font-mono select-none outline-none focus-visible:ring-1"
      style={{
        borderColor: isMuted ? chrome.colors.border : chrome.colors.borderHover,
        backgroundColor: chrome.colors.obsidianSurface,
        color: isMuted ? chrome.colors.subtleText : chrome.colors.racingLime,
      }}
    >
      <span className="flex items-center gap-0.5 h-3">
        <span
          className={`w-0.5 rounded-full transition-all duration-200 ${
            !isMuted ? "h-3 animate-pulse" : "h-1"
          }`}
          style={{ backgroundColor: !isMuted ? chrome.colors.racingLime : chrome.colors.subtleText }}
        />
        <span
          className={`w-0.5 rounded-full transition-all duration-200 ${
            !isMuted ? "h-2 animate-pulse delay-75" : "h-1"
          }`}
          style={{ backgroundColor: !isMuted ? chrome.colors.racingLime : chrome.colors.subtleText }}
        />
        <span
          className={`w-0.5 rounded-full transition-all duration-200 ${
            !isMuted ? "h-3.5 animate-pulse delay-150" : "h-1"
          }`}
          style={{ backgroundColor: !isMuted ? chrome.colors.racingLime : chrome.colors.subtleText }}
        />
      </span>
      <span className="tracking-wide">
        {!isMuted ? chrome.soundOnLabel : chrome.soundOffLabel}
      </span>
      <span className="hidden md:inline text-[10px] opacity-60">
        {chrome.soundShortcutHint}
      </span>
    </button>
  );
}
