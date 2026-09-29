import { SiteConfig, SiteConfigSchema, TelemetryPulse } from "@/types/site";
import { chromeConfig } from "./chrome";

export const siteConfig: SiteConfig = SiteConfigSchema.parse({
  name: "OmniFlow",
  description: "Autonomous AI Operations & Enterprise Workflow Orchestration Laboratory. High-performance state mesh with sub-millisecond consensus.",
  version: "0.2.0",
  navLinks: [
    { label: "Architecture", href: "#architecture", isExternal: false },
    { label: "Mesh Nodes", href: "#nodes", isExternal: false, badge: "5 Online" },
    { label: "Refraction Lab", href: "#shaders", isExternal: false },
    { label: "Live Telemetry", href: "#telemetry", isExternal: false, badge: "Live" },
    { label: "Documentation", href: "https://docs.omniflow.io", isExternal: true },
  ],
  hero: {
    badge: "Operational State Mesh",
    badgeStatus: "System Online // Phase 1 Operational",
    headlinePrefix: "OmniFlow",
    headline: "Autonomous Workflow Kernel",
    headlineAccent: "Planetary Scale",
    subheadline: "Enterprise-grade autonomous AI orchestration kernel and real-time state mesh. Accelerate distributed execution pipelines with continuous mathematical verification and sub-millisecond convergence.",
    primaryCta: {
      id: "cta-init-kernel",
      label: "INITIALIZE KERNEL",
      href: "#telemetry",
      variant: "primary",
      trackingEvent: "click_hero_initialize",
    },
    secondaryCta: {
      id: "cta-view-topology",
      label: "INSPECT STATE MESH",
      href: "#nodes",
      variant: "outline",
      trackingEvent: "click_hero_inspect_nodes",
    },
  },
  brand: {
    tagline: "Deterministic Agent Governance for Autonomous Enterprises",
    missionStatement: "Replacing fragile linear task-queues with an immutable distributed state mesh governed by multi-agent consensus and real-time mathematical validation.",
    valuePropositions: [
      {
        id: "val-sub-ms",
        title: "Sub-Millisecond Convergence",
        description: "Global consensus achieved across edge clusters before downstream pipelines can drift.",
        metric: "< 18ms",
        metricLabel: "P99 Global Mesh Latency",
      },
      {
        id: "val-zero-drift",
        title: "Zero-Drift Orchestration",
        description: "Zod-validated runtime contracts ensure cross-agent state transitions never deserialize malformed payloads.",
        metric: "99.999%",
        metricLabel: "Contract Compliance",
      },
      {
        id: "val-autonomous-recovery",
        title: "Autonomous Self-Healing",
        description: "Defective worker threads are partitioned and rescheduled automatically without human intervention.",
        metric: "4.2x",
        metricLabel: "Efficiency Multiplier",
      },
    ],
  },
  telemetryRibbon: {
    label: "LIVE TELEMETRY STREAM // SUB-SECOND CONVERGENCE",
    metrics: [
      { id: "throughput", label: "THROUGHPUT", value: "2,418,920 ops/sec", delta: "+18.4%", status: "accelerated" },
      { id: "cycle-time", label: "CYCLE REDUCTION", value: "-68.4%", delta: "P99.9", status: "optimal" },
      { id: "sync-latency", label: "MEAN CONVERGENCE", value: "12.4ms", delta: "0.8 jitter", status: "nominal" },
      { id: "mesh-uptime", label: "STATE STABILITY", value: "99.999%", delta: "Zero Loss", status: "optimal" },
      { id: "edge-clusters", label: "ACTIVE HUBS", value: "5 Global Nodes", delta: "Synced", status: "optimal" },
    ],
  },
  audio: {
    masterVolume: 0.8,
    muted: false,
    microTickFreq: 1200,
    relaySnapFreq: 350,
    warpHumFreq: 60,
  },
  landmarks: [
    {
      id: "tokyo-core",
      name: "Tokyo Primary Nexus",
      latitude: 35.6762,
      longitude: 139.6503,
      description: "Primary high-frequency state synthesizer and router",
      category: "core",
    },
    {
      id: "frankfurt-relay",
      name: "Frankfurt Relay Array",
      latitude: 50.1109,
      longitude: 8.6821,
      description: "Low-latency continental backbone gateway",
      category: "relay",
    },
  ],
  chrome: chromeConfig,
});

export { chromeConfig };

export const initialTelemetryPulses: TelemetryPulse[] = [
  { id: "pulse-01", timestamp: 1711756800000, nodeId: "hub-tyo-01", latencyMs: 14.2, throughput: 2410000, status: "nominal" },
  { id: "pulse-02", timestamp: 1711756805000, nodeId: "hub-fra-01", latencyMs: 11.8, throughput: 2390000, status: "nominal" },
  { id: "pulse-03", timestamp: 1711756810000, nodeId: "hub-sfo-01", latencyMs: 8.4, throughput: 2450000, status: "nominal" },
];
