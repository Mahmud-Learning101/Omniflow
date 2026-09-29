"use client";

import { useCallback, useSyncExternalStore } from "react";
import { soundEngine } from "@/lib/sound";

export interface UseAudioReturn {
  isMuted: boolean;
  playTick: () => void;
  playSnap: () => void;
  playClick: () => void;
  playToggle: () => void;
  playHum: (velocity?: number) => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
}

/**
 * Hook providing access to OmniFlow's 100% procedural Web Audio API engine.
 */
export function useAudio(): UseAudioReturn {
  const isMuted = useSyncExternalStore(
    soundEngine.subscribe,
    soundEngine.isMuted,
    () => false
  );

  const setMuted = useCallback((muted: boolean) => {
    soundEngine.setMuted(muted);
  }, []);

  const toggleMute = useCallback(() => {
    soundEngine.setMuted(!soundEngine.isMuted());
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
    playClick: playTick,
    playToggle: playSnap,
    playHum,
    toggleMute,
    setMuted,
  };
}
