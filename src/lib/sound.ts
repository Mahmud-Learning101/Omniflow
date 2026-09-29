/**
 * OmniFlow Procedural Audio Synthesizer (100% Web Audio API)
 * Zero external audio downloads. Low latency real-time synthesis.
 */

class ProceduralSynthesizer {
  private ctx: AudioContext | null = null;
  private muted = false;
  private masterGain: GainNode | null = null;

  private init(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.8, this.ctx.currentTime);
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  /**
   * Micro-Tick: 1200Hz high-transient decay for button hover
   */
  public playMicroTick(): void {
    if (this.muted) return;
    const ctx = this.init();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.015);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.02);
  }

  /**
   * Relay-Snap: 350Hz FM chirp for mechanical switches and toggles
   */
  public playRelaySnap(): void {
    if (this.muted) return;
    const ctx = this.init();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modGain = ctx.createGain();
    const env = ctx.createGain();

    // 350Hz Carrier with frequency modulation
    carrier.type = "triangle";
    carrier.frequency.setValueAtTime(350, t);

    // Modulator creates mechanical FM click chirp
    modulator.type = "sine";
    modulator.frequency.setValueAtTime(700, t);
    modulator.frequency.exponentialRampToValueAtTime(180, t + 0.035);

    modGain.gain.setValueAtTime(250, t);
    modGain.gain.exponentialRampToValueAtTime(1, t + 0.035);

    modulator.connect(carrier.frequency);

    // Transient envelope
    env.gain.setValueAtTime(0.25, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    carrier.connect(env);
    env.connect(this.masterGain);

    modulator.start(t);
    carrier.start(t);
    modulator.stop(t + 0.045);
    carrier.stop(t + 0.045);
  }

  /**
   * Warp-Hum: 60Hz resonant sub-bass on 3D rotation
   */
  public playWarpHum(velocity = 1): void {
    if (this.muted) return;
    const ctx = this.init();
    if (!ctx || !this.masterGain) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    const clampedVelocity = Math.max(0.1, Math.min(2.5, velocity));
    const duration = 0.12 + clampedVelocity * 0.08;

    osc.type = "sine";
    osc.frequency.setValueAtTime(60, t);
    osc.frequency.linearRampToValueAtTime(60 + clampedVelocity * 8, t + duration * 0.5);
    osc.frequency.linearRampToValueAtTime(58, t + duration);

    // Resonant lowpass sub-bass filter
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(120, t);
    filter.Q.setValueAtTime(8.5, t);

    const targetGain = Math.min(0.4, 0.15 * clampedVelocity);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(targetGain, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + duration + 0.01);
  }
}

export const soundEngine = new ProceduralSynthesizer();
