import { NextRequest, NextResponse } from "next/server";
import { AgentTraceEventSchema } from "@/types/telemetry";
import { getDb, isUsingMockDb, mockStore } from "@/lib/db";

/**
 * OpenTelemetry & Model Context Protocol (MCP) ingestion receiver endpoint.
 * Ingests execution traces from LangGraph, CrewAI, AutoGen, and custom agents.
 * Validates against active fleet policy safeguards (latency cutoff, confidence floor).
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = AgentTraceEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid trace payload", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const trace = { ...parsed.data };
    const currentPolicy = mockStore.getPolicy();

    // Automated Policy Interception & Circuit-Breaker Check
    let intercepted = false;
    let interceptionReason = "";

    if (trace.latencyMs > currentPolicy.p99LatencyCutoffMs) {
      intercepted = true;
      interceptionReason = `P99 latency threshold breached (${trace.latencyMs}ms > ${currentPolicy.p99LatencyCutoffMs}ms)`;
    } else if (trace.confidenceScore < currentPolicy.confidenceFloor) {
      intercepted = true;
      interceptionReason = `Confidence score below safeguard floor (${(trace.confidenceScore * 100).toFixed(1)}% < ${(currentPolicy.confidenceFloor * 100).toFixed(1)}%)`;
    } else if (currentPolicy.circuitBreakerTripped) {
      intercepted = true;
      interceptionReason = "Fleet circuit-breaker tripped by administrator";
    }

    if (intercepted) {
      trace.status = "circuit_broken";
    }

    // Persist to store
    mockStore.insertTrace(trace);

    try {
      const db = await getDb();
      if (db && !isUsingMockDb()) {
        const collection = db.collection("agent_telemetry_events");
        await collection.insertOne({ ...trace });
      }
    } catch (err) {
      console.warn("[OTel Ingest] Atlas write failed, held in local buffer:", err);
    }

    return NextResponse.json({
      success: true,
      traceId: trace.traceId,
      intercepted,
      interceptionReason: intercepted ? interceptionReason : undefined,
      trace,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);

  try {
    const db = await getDb();
    if (db && !isUsingMockDb()) {
      const collection = db.collection("agent_telemetry_events");
      const traces = await collection.find({}).sort({ timestamp: -1 }).limit(limit).toArray();
      if (traces.length > 0) {
        return NextResponse.json({ success: true, isMock: false, traces });
      }
    }
  } catch (err) {
    console.warn("[OTel Ingest GET] Atlas read failed, using local store:", err);
  }

  return NextResponse.json({
    success: true,
    isMock: true,
    traces: mockStore.getTraces(limit),
  });
}
