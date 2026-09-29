import { siteConfig } from "@/config/site";

let audioCtx: AudioContext | null = null;
let isAudioMuted = siteConfig.audio.muted;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;

  if (!audioCtx) {
    try {
      audioCtx = new AudioCtx();
    } catch {
      return null;
    }
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setMuted(muted: boolean): void {
  isAudioMuted = muted;
}

export function isMuted(): boolean {
  return isAudioMuted;
}

/** Micro-Tick: 1200Hz high-frequency decay on cybernetic/beacon hover. */
export function playMicroTick(): void {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(siteConfig.audio.microTickFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.015);

    const baseVol = siteConfig.audio.masterVolume * 0.15;
    gain.gain.setValueAtTime(baseVol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch {
    // Graceful no-op in headless/test environments
  }
}

/** Relay-Snap: 350Hz FM chirp on toggle and admin switches. */
export function playRelaySnap(): void {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modGain = ctx.createGain();
    const gain = ctx.createGain();

    carrier.type = "triangle";
    carrier.frequency.setValueAtTime(siteConfig.audio.relaySnapFreq, ctx.currentTime);
    modulator.type = "sine";
    modulator.frequency.setValueAtTime(700, ctx.currentTime);
    modulator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

    modGain.gain.setValueAtTime(300, ctx.currentTime);
    modGain.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 0.04);
    modulator.connect(carrier.frequency);

    const baseVol = siteConfig.audio.masterVolume * 0.25;
    gain.gain.setValueAtTime(baseVol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);

    carrier.connect(gain);
    gain.connect(ctx.destination);
    modulator.start();
    carrier.start();
    modulator.stop(ctx.currentTime + 0.045);
    carrier.stop(ctx.currentTime + 0.045);
  } catch {
    // Graceful no-op
  }
}

/** Warp-Hum: 60Hz resonant sub-bass on 3D rotation with velocity scaling. */
export function playWarpHum(velocity = 1): void {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const clampedVel = Math.max(0.2, Math.min(2.5, velocity));
    const duration = 0.15 + clampedVel * 0.08;

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(siteConfig.audio.warpHumFreq, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(siteConfig.audio.warpHumFreq + clampedVel * 6, ctx.currentTime + duration * 0.5);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(120, ctx.currentTime);
    filter.Q.setValueAtTime(8, ctx.currentTime);

    const baseVol = siteConfig.audio.masterVolume * 0.1 * Math.min(1.5, clampedVel);
    gain.gain.setValueAtTime(baseVol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.01);
  } catch {
    // Graceful no-op
  }
}

export const soundEngine = {
  playMicroTick,
  playRelaySnap,
  playWarpHum,
  setMuted,
  isMuted,
};
