import { NextRequest, NextResponse } from "next/server";
import { getDb, isUsingMockDb } from "@/lib/db";
import { telemetryConfig } from "@/config/telemetry";
import { EventStreamEntry, EventStreamEntrySchema } from "@/types/telemetry";

const inMemoryEvents: EventStreamEntry[] = [...telemetryConfig.initialEvents];

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const limitParam = parseInt(searchParams.get("limit") || "20", 10);
  const limit = Math.max(1, Math.min(100, isNaN(limitParam) ? 20 : limitParam));

  try {
    const db = await getDb();
    if (db && !isUsingMockDb()) {
      const collection = db.collection<EventStreamEntry>("telemetry_events");
      const cursor = collection.find({}).sort({ timestamp: -1 }).limit(limit);
      const docs = await cursor.toArray();

      if (docs.length > 0) {
        return NextResponse.json({
          success: true,
          isMock: false,
          count: docs.length,
          events: docs,
          timestamp: Date.now(),
        });
      }
    }
  } catch (error) {
    console.warn("[API telemetry] Atlas query failed, falling back to local store:", error);
  }

  return NextResponse.json({
    success: true,
    isMock: true,
    count: inMemoryEvents.slice(0, limit).length,
    events: inMemoryEvents.slice(0, limit),
    timestamp: Date.now(),
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = EventStreamEntrySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Malformed telemetry event payload", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const event = parsed.data;
    inMemoryEvents.unshift(event);
    if (inMemoryEvents.length > 50) inMemoryEvents.pop();

    try {
      const db = await getDb();
      if (db && !isUsingMockDb()) {
        await db.collection("telemetry_events").insertOne(event as unknown as Record<string, unknown>);
        return NextResponse.json({ success: true, isMock: false, event }, { status: 201 });
      }
    } catch (dbErr) {
      console.warn("[API telemetry POST] Atlas write failed, saved to in-memory store:", dbErr);
    }

    return NextResponse.json({ success: true, isMock: true, event }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
