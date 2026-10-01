import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, isUsingMockDb, mockStore, AdminOverrides } from "@/lib/db";

const AdminOverrideInputSchema = z.object({
  brandColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).optional(),
  shaderIor: z.number().min(1.0).max(2.5).optional(),
  shaderRoughness: z.number().min(0.0).max(1.0).optional(),
  tickerSpeed: z.number().min(500).max(10000).optional(),
  headline: z.string().min(1).max(100).optional(),
  // Policy Safeguards
  operatingMode: z.enum(['autonomous', 'human_in_loop', 'strict_circuit_breaker', 'safe_dry_run']).optional(),
  maxSpendPerMinuteUsd: z.number().positive().optional(),
  p99LatencyCutoffMs: z.number().positive().optional(),
  confidenceFloor: z.number().min(0).max(1).optional(),
  circuitBreakerTripped: z.boolean().optional(),
});

export async function GET(): Promise<NextResponse> {
  try {
    const db = await getDb();
    if (db && !isUsingMockDb()) {
      const collection = db.collection("fleet_policies");
      const record = await collection.findOne({ _id: "active_policy" as unknown as undefined });
      if (record) {
        const { _id, ...policy } = record;
        return NextResponse.json({
          success: true,
          isMock: false,
          overrides: mockStore.getOverrides(),
          policy,
        });
      }
    }
  } catch (error) {
    console.warn("[API admin GET] Atlas query failed, using in-memory store:", error);
  }

  return NextResponse.json({
    success: true,
    isMock: true,
    overrides: mockStore.getOverrides(),
    policy: mockStore.getPolicy(),
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

    // Separate visual overrides and policy constraints
    const overrideFields: Partial<AdminOverrides> = {};
    if (parsed.data.brandColor) overrideFields.brandColor = parsed.data.brandColor;
    if (parsed.data.shaderIor) overrideFields.shaderIor = parsed.data.shaderIor;
    if (parsed.data.shaderRoughness) overrideFields.shaderRoughness = parsed.data.shaderRoughness;
    if (parsed.data.tickerSpeed) overrideFields.tickerSpeed = parsed.data.tickerSpeed;
    if (parsed.data.headline) overrideFields.headline = parsed.data.headline;

    const policyFields: Record<string, unknown> = {};
    if (parsed.data.operatingMode) policyFields.operatingMode = parsed.data.operatingMode;
    if (parsed.data.maxSpendPerMinuteUsd) policyFields.maxSpendPerMinuteUsd = parsed.data.maxSpendPerMinuteUsd;
    if (parsed.data.p99LatencyCutoffMs) policyFields.p99LatencyCutoffMs = parsed.data.p99LatencyCutoffMs;
    if (parsed.data.confidenceFloor !== undefined) policyFields.confidenceFloor = parsed.data.confidenceFloor;
    if (parsed.data.circuitBreakerTripped !== undefined) policyFields.circuitBreakerTripped = parsed.data.circuitBreakerTripped;

    const updatedOverrides = mockStore.setOverrides(overrideFields);
    const updatedPolicy = mockStore.setPolicy(policyFields);

    try {
      const db = await getDb();
      if (db && !isUsingMockDb()) {
        const policyCol = db.collection("fleet_policies");
        await policyCol.updateOne(
          { _id: "active_policy" as unknown as undefined },
          { $set: { ...updatedPolicy } },
          { upsert: true }
        );
        return NextResponse.json({
          success: true,
          isMock: false,
          overrides: updatedOverrides,
          policy: updatedPolicy,
        });
      }
    } catch (dbErr) {
      console.warn("[API admin POST] Atlas persist failed, kept in local memory:", dbErr);
    }

    return NextResponse.json({
      success: true,
      isMock: true,
      overrides: updatedOverrides,
      policy: updatedPolicy,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
