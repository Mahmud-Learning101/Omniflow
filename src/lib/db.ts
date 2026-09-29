import { MongoClient, type Db } from "mongodb";
import { initialTelemetryPulses } from "@/config/site";
import type { TelemetryPulse } from "@/types/site";

const uri = process.env.MONGODB_URI;
const isCI = Boolean(process.env.CI);
const DB_NAME = "omniflow";

interface InMemoryStore {
  telemetry: TelemetryPulse[];
}

const memoryStore: InMemoryStore = {
  telemetry: [...initialTelemetryPulses],
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
  reset(): void {
    memoryStore.telemetry = [...initialTelemetryPulses];
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
