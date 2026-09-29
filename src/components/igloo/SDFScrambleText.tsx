"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { CyberneticCard } from "@/types/shaders";
import { soundEngine } from "@/lib/sound";

interface SDFScrambleCardProps {
  card: CyberneticCard;
  className?: string;
}

const GLYPHS = "!<>-_/[]{}—=+*^?#_010101XYZ";

/**
 * Interactive cybernetic card cycling through ASCII glyphs before locking onto target word.
 * Triggers synthesized micro-ticks on character decode frames.
 */
export function SDFScrambleText({ card, className = "" }: SDFScrambleCardProps) {
  const [displayText, setDisplayText] = useState<string>(card.targetWord);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

  const startScramble = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsScrambling(true);

    const target = card.targetWord;
    const totalFrames = 24;
    let frame = 0;

    const tick = () => {
      frame++;
      // Trigger micro-tick audio on key decode intervals
      if (frame % 3 === 0) {
        soundEngine.playMicroTick();
      }

      const progress = frame / totalFrames;
      const lockedChars = Math.floor(progress * target.length);

      let result = "";
      for (let i = 0; i < target.length; i++) {
        if (i < lockedChars) {
          result += target[i];
        } else {
          result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }

      setDisplayText(result);

      if (frame < totalFrames) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayText(target);
        setIsScrambling(false);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, [card.targetWord]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      data-testid={`scramble-card-${card.id}`}
      onMouseEnter={startScramble}
      className={`group relative rounded-xl border border-obsidian-border bg-obsidian-card/80 p-5 backdrop-blur-md transition-all duration-300 hover:border-racing-lime/50 hover:shadow-[0_0_24px_rgba(210,255,0,0.12)] ${className}`}
      role="article"
      aria-label={card.title}
    >
      <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400 mb-2">
        <span className="tracking-widest uppercase text-racing-lime/90">{card.tag}</span>
        <span className="text-neutral-500">{card.metricValue}</span>
      </div>

      <h3 className="font-mono text-sm font-semibold text-neutral-200 mb-1">{card.title}</h3>

      {/* Interactive Glitch ASCII Word */}
      <div className="my-3 py-2 px-3 rounded-lg bg-obsidian-surface/90 border border-obsidian-border font-mono text-base font-bold tracking-widest text-racing-lime transition-colors group-hover:text-racing-lime flex items-center justify-between">
        <span data-testid={`scramble-target-${card.id}`}>{displayText}</span>
        <span
          className={`h-2 w-2 rounded-full transition-colors ${
            isScrambling ? "bg-racing-lime animate-ping" : "bg-neutral-600"
          }`}
        />
      </div>

      <p className="font-mono text-xs text-neutral-400 leading-relaxed">{card.description}</p>

      <div className="mt-4 pt-3 border-t border-obsidian-border/70 flex items-center justify-between font-mono text-[11px]">
        <span className="text-neutral-500 uppercase">{card.metricLabel}</span>
        <span className="text-neutral-200 font-semibold">{card.metricValue}</span>
      </div>
    </div>
  );
}
