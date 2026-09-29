"use client";

import { useCallback, useState } from "react";
import { soundEngine } from "@/lib/sound";

export interface UseAudioReturn {
  isMuted: boolean;
  playTick: () => void;
  playSnap: () => void;
  playHum: (velocity?: number) => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
}

/**
 * Hook providing access to OmniFlow's 100% procedural Web Audio API engine.
 */
export function useAudio(): UseAudioReturn {
  const [isMuted, setIsMutedState] = useState<boolean>(() => soundEngine.isMuted());

  const setMuted = useCallback((muted: boolean) => {
    soundEngine.setMuted(muted);
    setIsMutedState(muted);
  }, []);

  const toggleMute = useCallback(() => {
    const nextState = !soundEngine.isMuted();
    soundEngine.setMuted(nextState);
    setIsMutedState(nextState);
  }, []);

  const playTick = useCallback(() => {
    soundEngine.playMicroTick();
  }, []);

  const playSnap = useCallback(() => {
    soundEngine.playRelaySnap();
  }, []);

  const playHum = useCallback((velocity?: number) => {
    soundEngine.playWarpHum(velocity);
  }, []);

  return {
    isMuted,
    playTick,
    playSnap,
    playHum,
    toggleMute,
    setMuted,
  };
}
