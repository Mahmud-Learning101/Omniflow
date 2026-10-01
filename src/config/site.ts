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
    badge: "Production Agent Fleet Telemetry",
    badgeStatus: "OTel & MCP Receiver Online // v0.3.0",
    headlinePrefix: "OmniFlow",
    headline: "Autonomous Agent Fleet Control",
    headlineAccent: "Enterprise Scale",
    subheadline: "Real-time visual telemetry, zero-drift consensus, and instant circuit-breakers for production AI workflows. Monitor, trace, and govern multi-agent systems across LangGraph, CrewAI, and MCP at planetary scale.",
    primaryCta: {
      id: "cta-init-kernel",
      label: "DEPLOY CIRCUIT BREAKERS",
      href: "#telemetry",
      variant: "primary",
      trackingEvent: "click_hero_deploy_policies",
    },
    secondaryCta: {
      id: "cta-view-topology",
      label: "VIEW FLEET TOPOLOGY",
      href: "#section-messenger",
      variant: "outline",
      trackingEvent: "click_hero_inspect_nodes",
    },
  },
  brand: {
    tagline: "Verifiable Governance for Distributed AI Agent Workflows",
    missionStatement: "Eliminating hallucination cascades and runaway cloud spend with hard circuit-breakers, OpenTelemetry ingestion, and real-time consensus verification.",
    valuePropositions: [
      {
        id: "val-sub-ms",
        title: "Deterministic Circuit-Breakers",
        description: "Hard latency and spend cutoffs automatically trip within 50ms of threshold breach, halting runaway loops.",
        metric: "< 50ms",
        metricLabel: "Circuit-Breaker Interception",
      },
      {
        id: "val-zero-drift",
        title: "Multi-Framework Trace Ingestion",
        description: "Native OpenTelemetry receivers for LangGraph, CrewAI, AutoGen, and Model Context Protocol (MCP) tool execution.",
        metric: "100%",
        metricLabel: "OTel & MCP Standard Compliance",
      },
      {
        id: "val-autonomous-recovery",
        title: "Cost & Token Optimization",
        description: "Real-time dollar-per-minute rate limiting prevents surprise cloud bills from recursive agent chains.",
        metric: "64.5%",
        metricLabel: "Mean Cloud Spend Reduction",
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
