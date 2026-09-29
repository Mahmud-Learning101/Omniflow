import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, isUsingMockDb, mockStore, AdminOverrides } from "@/lib/db";

const AdminOverrideInputSchema = z.object({
  brandColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).optional(),
  shaderIor: z.number().min(1.0).max(2.5).optional(),
  shaderRoughness: z.number().min(0.0).max(1.0).optional(),
  tickerSpeed: z.number().min(500).max(10000).optional(),
  headline: z.string().min(1).max(100).optional(),
});

export async function GET(): Promise<NextResponse> {
  try {
    const db = await getDb();
    if (db && !isUsingMockDb()) {
      const collection = db.collection("admin_overrides");
      const record = await collection.findOne({ _id: "active_overrides" as unknown as undefined });
      if (record) {
        const { _id, ...overrides } = record;
        return NextResponse.json({ success: true, isMock: false, overrides });
      }
    }
  } catch (error) {
    console.warn("[API admin GET] Atlas query failed, using in-memory store:", error);
  }

  return NextResponse.json({
    success: true,
    isMock: true,
    overrides: mockStore.getOverrides(),
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = AdminOverrideInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const payload: Partial<AdminOverrides> = {
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    };

    const updated = mockStore.setOverrides(payload);

    try {
      const db = await getDb();
      if (db && !isUsingMockDb()) {
        const collection = db.collection("admin_overrides");
        await collection.updateOne(
          { _id: "active_overrides" as unknown as undefined },
          { $set: { ...payload } },
          { upsert: true }
        );
        return NextResponse.json({ success: true, isMock: false, overrides: updated });
      }
    } catch (dbErr) {
      console.warn("[API admin POST] Atlas persist failed, kept in local memory:", dbErr);
    }

    return NextResponse.json({ success: true, isMock: true, overrides: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
