import { MongoClient, type Db } from "mongodb";
import { initialTelemetryPulses } from "@/config/site";
import { telemetryConfig } from "@/config/telemetry";
import type { TelemetryPulse } from "@/types/site";
import type { AgentTraceEvent, FleetPolicyConstraints } from "@/types/telemetry";

const uri = process.env.MONGODB_URI;
const isCI = Boolean(process.env.CI);
const DB_NAME = "omniflow";

export interface AdminOverrides {
  brandColor?: string;
  shaderIor?: number;
  shaderRoughness?: number;
  tickerSpeed?: number;
  headline?: string;
  updatedAt?: string;
}

const defaultOverrides: AdminOverrides = {
  brandColor: "#d2ff00",
  shaderIor: 1.45,
  shaderRoughness: 0.12,
  tickerSpeed: 2500,
  headline: "AUTONOMOUS AGENT FLEET CONTROL",
  updatedAt: "2026-10-01T21:00:00.000Z",
};

interface InMemoryStore {
  telemetry: TelemetryPulse[];
  overrides: AdminOverrides;
  policy: FleetPolicyConstraints;
  traces: AgentTraceEvent[];
}

const memoryStore: InMemoryStore = {
  telemetry: [...initialTelemetryPulses],
  overrides: { ...defaultOverrides },
  policy: { ...telemetryConfig.defaultPolicy },
  traces: [...telemetryConfig.initialAgentTraces],
};

let isFallbackMode = isCI || !uri;

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

async function createClientPromise(): Promise<MongoClient | null> {
  if (isFallbackMode || !uri) return null;

  try {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 2500,
    });
    return await client.connect();
  } catch (err) {
    console.warn("[OmniFlow DB] MongoDB connection failed. Falling back to in-memory store.", err);
    isFallbackMode = true;
    return null;
  }
}

let clientPromise: Promise<MongoClient | null>;

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = createClientPromise() as Promise<MongoClient>;
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  clientPromise = createClientPromise();
}

export async function getDb(): Promise<Db | null> {
  if (isFallbackMode) return null;
  try {
    const client = await clientPromise;
    return client ? client.db(DB_NAME) : null;
  } catch {
    isFallbackMode = true;
    return null;
  }
}

export function isUsingMockDb(): boolean {
  return isFallbackMode;
}

export const mockStore = {
  getTelemetry(): TelemetryPulse[] {
    return [...memoryStore.telemetry];
  },
  insertTelemetry(pulse: TelemetryPulse): TelemetryPulse {
    memoryStore.telemetry.unshift(pulse);
    if (memoryStore.telemetry.length > 50) memoryStore.telemetry.pop();
    return pulse;
  },
  getOverrides(): AdminOverrides {
    return { ...memoryStore.overrides };
  },
  setOverrides(next: Partial<AdminOverrides>): AdminOverrides {
    memoryStore.overrides = {
      ...memoryStore.overrides,
      ...next,
      updatedAt: new Date().toISOString(),
    };
    return { ...memoryStore.overrides };
  },
  getPolicy(): FleetPolicyConstraints {
    return { ...memoryStore.policy };
  },
  setPolicy(next: Partial<FleetPolicyConstraints>): FleetPolicyConstraints {
    memoryStore.policy = {
      ...memoryStore.policy,
      ...next,
      updatedAt: new Date().toISOString(),
    };
    return { ...memoryStore.policy };
  },
  getTraces(limit = 20): AgentTraceEvent[] {
    return memoryStore.traces.slice(0, limit);
  },
  insertTrace(trace: AgentTraceEvent): AgentTraceEvent {
    memoryStore.traces.unshift(trace);
    if (memoryStore.traces.length > 100) memoryStore.traces.pop();
    return trace;
  },
  reset(): void {
    memoryStore.telemetry = [...initialTelemetryPulses];
    memoryStore.overrides = { ...defaultOverrides };
    memoryStore.policy = { ...telemetryConfig.defaultPolicy };
    memoryStore.traces = [...telemetryConfig.initialAgentTraces];
  },
};

export async function checkDbHealth(): Promise<{
  connected: boolean;
  isMock: boolean;
  latencyMs: number;
}> {
  const start = performance.now();
  if (isFallbackMode) {
    return { connected: true, isMock: true, latencyMs: Math.round(performance.now() - start) };
  }
  try {
    const db = await getDb();
    if (!db) throw new Error("No DB instance");
    await db.command({ ping: 1 });
    return { connected: true, isMock: false, latencyMs: Math.round(performance.now() - start) };
  } catch {
    isFallbackMode = true;
    return { connected: true, isMock: true, latencyMs: Math.round(performance.now() - start) };
  }
}

export default clientPromise;
