import { z } from "zod";
import { ChromeConfigSchema } from "./chrome";

export const NavLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  isExternal: z.boolean().default(false),
  badge: z.string().optional(),
});
export type NavLink = z.infer<typeof NavLinkSchema>;

export const CtaTargetSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  href: z.string().min(1),
  variant: z.enum(["primary", "secondary", "outline", "ghost"]),
  trackingEvent: z.string().optional(),
});
export type CtaTarget = z.infer<typeof CtaTargetSchema>;

export const HeroCopySchema = z.object({
  badge: z.string().min(1),
  badgeStatus: z.string().min(1),
  headlinePrefix: z.string().min(1),
  headline: z.string().min(1),
  headlineAccent: z.string().min(1),
  subheadline: z.string().min(1),
  primaryCta: CtaTargetSchema,
  secondaryCta: CtaTargetSchema,
});
export type HeroCopy = z.infer<typeof HeroCopySchema>;

export const ValuePropositionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  metric: z.string().min(1),
  metricLabel: z.string().min(1),
});
export type ValueProposition = z.infer<typeof ValuePropositionSchema>;

export const BrandNarrativeSchema = z.object({
  tagline: z.string().min(1),
  missionStatement: z.string().min(1),
  valuePropositions: z.array(ValuePropositionSchema).min(1),
});
export type BrandNarrative = z.infer<typeof BrandNarrativeSchema>;

export const TelemetryPulseSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  nodeId: z.string(),
  latencyMs: z.number(),
  throughput: z.number(),
  status: z.enum(["nominal", "degraded", "critical"]),
});
export type TelemetryPulse = z.infer<typeof TelemetryPulseSchema>;

export const TelemetryMetricSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
  delta: z.string().optional(),
  status: z.enum(["optimal", "nominal", "accelerated"]).default("optimal"),
});
export type TelemetryMetric = z.infer<typeof TelemetryMetricSchema>;

export const TelemetryRibbonSchema = z.object({
  label: z.string().min(1),
  metrics: z.array(TelemetryMetricSchema).min(1),
});
export type TelemetryRibbon = z.infer<typeof TelemetryRibbonSchema>;

export const AudioConfigSchema = z.object({
  masterVolume: z.number().min(0).max(1).default(0.8),
  muted: z.boolean().default(false),
  microTickFreq: z.number().default(1200),
  relaySnapFreq: z.number().default(350),
  warpHumFreq: z.number().default(60),
});
export type AudioConfig = z.infer<typeof AudioConfigSchema>;

export const SphericalLandmarkSchema = z.object({
  id: z.string(),
  name: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  description: z.string(),
  category: z.enum(["core", "relay", "datacenter", "terminal"]),
});
export type SphericalLandmark = z.infer<typeof SphericalLandmarkSchema>;

export const SiteConfigSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  version: z.string().min(1),
  navLinks: z.array(NavLinkSchema).min(1),
  hero: HeroCopySchema,
  brand: BrandNarrativeSchema,
  telemetryRibbon: TelemetryRibbonSchema,
  audio: AudioConfigSchema,
  landmarks: z.array(SphericalLandmarkSchema),
  chrome: ChromeConfigSchema,
});
export type SiteConfig = z.infer<typeof SiteConfigSchema>;
