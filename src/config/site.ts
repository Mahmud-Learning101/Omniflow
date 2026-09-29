import type { SiteConfig, TelemetryPulse } from "@/types/site";

export const siteConfig: SiteConfig = {
  name: "OmniFlow",
  description: "Autonomous AI Workflow & Pipeline Orchestration Laboratory",
  version: "0.3.0",
  audio: {
    masterVolume: 0.8,
    muted: false,
    microTickFreq: 1200,
    relaySnapFreq: 350,
    warpHumFreq: 60,
  },
  landmarks: [
    {
      id: "node-alpha",
      name: "Apex Hyper-Cluster",
      latitude: 37.7749,
      longitude: -122.4194,
      description: "Primary neural inference state engine",
      category: "core",
    },
    {
      id: "node-bravo",
      name: "Nordic Glacial Relay",
      latitude: 60.1699,
      longitude: 24.9384,
      description: "Cold storage refraction memory grid",
      category: "datacenter",
    },
    {
      id: "node-charlie",
      name: "Equatorial Ion Station",
      latitude: 1.3521,
      longitude: 103.8198,
      description: "Sub-millisecond packet telemetry hub",
      category: "relay",
    },
    {
      id: "node-delta",
      name: "Neo-Tokyo Terminal",
      latitude: 35.6762,
      longitude: 139.6503,
      description: "Edge pipeline dispatch gateway",
      category: "terminal",
    },
  ],
};

export const initialTelemetryPulses: TelemetryPulse[] = [
  {
    id: "pulse-01",
    timestamp: Date.now(),
    nodeId: "node-alpha",
    latencyMs: 14.2,
    throughput: 1840,
    status: "nominal",
  },
  {
    id: "pulse-02",
    timestamp: Date.now() - 500,
    nodeId: "node-bravo",
    latencyMs: 22.8,
    throughput: 950,
    status: "nominal",
  },
  {
    id: "pulse-03",
    timestamp: Date.now() - 1000,
    nodeId: "node-charlie",
    latencyMs: 31.4,
    throughput: 1210,
    status: "nominal",
  },
];
