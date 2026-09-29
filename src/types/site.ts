import { z } from "zod";

/**
 * Zod schema and types for system telemetry and node pulse events
 */
export const TelemetryPulseSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  nodeId: z.string(),
  latencyMs: z.number(),
  throughput: z.number(),
  status: z.enum(["nominal", "degraded", "critical"]),
});
export type TelemetryPulse = z.infer<typeof TelemetryPulseSchema>;

/**
 * Procedural audio preset configurations
 */
export const AudioSoundEffectSchema = z.enum(["tick", "snap", "hum"]);
export type AudioSoundEffect = z.infer<typeof AudioSoundEffectSchema>;

export const AudioConfigSchema = z.object({
  masterVolume: z.number().min(0).max(1).default(0.8),
  muted: z.boolean().default(false),
  microTickFreq: z.number().default(1200),
  relaySnapFreq: z.number().default(350),
  warpHumFreq: z.number().default(60),
});
export type AudioConfig = z.infer<typeof AudioConfigSchema>;

/**
 * 3D Spherical planetary landmarks and coordinates
 */
export const SphericalLandmarkSchema = z.object({
  id: z.string(),
  name: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  description: z.string(),
  category: z.enum(["core", "relay", "datacenter", "terminal"]),
});
export type SphericalLandmark = z.infer<typeof SphericalLandmarkSchema>;

/**
 * Site navigation and brand metadata configuration schema
 */
export const SiteConfigSchema = z.object({
  name: z.string(),
  description: z.string(),
  version: z.string(),
  audio: AudioConfigSchema,
  landmarks: z.array(SphericalLandmarkSchema),
});
export type SiteConfig = z.infer<typeof SiteConfigSchema>;
