import { test, expect } from "@playwright/test";
import { injectWebGLMock } from "../helpers/webgl-mock";

test.describe("Section 4 & 5: Operations Deck, Admin Console & MongoDB Sync", () => {
  test("mounts OperationsDeck, streams telemetry, tunes live overrides, and tests colophon", async ({
    page,
    request,
  }) => {
    const consoleErrors: string[] = [];
    const uncaughtExceptions: string[] = [];

    page.on("console", (msg) => {
      console.log("TEST LOG:", msg.type(), msg.text());
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    page.on("pageerror", (err) => {
      console.log("PAGE ERROR:", err.message);
      uncaughtExceptions.push(err.message);
    });

    await injectWebGLMock(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // 1. Verify OperationsDeck Mounting
    const deck = page.getByTestId("operations-deck");
    await deck.scrollIntoViewIfNeeded();
    await expect(deck).toBeVisible();

    // 2. Verify Metrics HUD Gauges
    const hud = page.getByTestId("metrics-hud");
    await expect(hud).toBeVisible();
    await expect(page.getByTestId("gauge-fps")).toBeVisible();
    await expect(page.getByTestId("gauge-latency")).toBeVisible();
    await expect(page.getByTestId("gauge-active-nodes")).toBeVisible();

    // 3. Verify LiveTicker and Efficiency Cards
    const ticker = page.getByTestId("live-ticker");
    await expect(ticker).toBeVisible();
    await expect(page.getByTestId("efficiency-gain-card-0")).toBeVisible();
    await expect(page.getByTestId("efficiency-gain-card-1")).toBeVisible();

    // 4. Open and Test Admin Override Drawer
    const adminBtn = page.getByTestId("btn-open-admin");
    await adminBtn.scrollIntoViewIfNeeded();
    await expect(adminBtn).toBeVisible();
    await adminBtn.click({ force: true });

    const drawer = page.getByTestId("admin-override-desk");
    await expect(drawer).toBeVisible({ timeout: 5000 });

    // Select operating mode
    const hitlModeBtn = page.getByTestId("mode-btn-human_in_loop");
    await hitlModeBtn.click();

    // Adjust spend limit and P99 latency sliders
    const spendSlider = page.getByTestId("slider-spend-limit");
    await spendSlider.fill("75");

    const latencySlider = page.getByTestId("slider-shader-ior");
    await latencySlider.fill("1200");

    // Click Persist & Broadcast Policies
    const persistBtn = page.getByTestId("btn-persist-overrides");
    await persistBtn.click();
    await expect(persistBtn).toBeEnabled({ timeout: 5000 });

    // Close Admin Drawer
    const closeBtn = page.getByTestId("btn-close-admin");
    await closeBtn.click();
    await expect(drawer).not.toBeVisible();

    // 5. Verify System Colophon in Footer
    const colophon = page.getByTestId("system-colophon");
    await colophon.scrollIntoViewIfNeeded();
    await expect(colophon).toBeVisible();
    await expect(page.getByTestId("stack-badge-next")).toBeVisible();
    await expect(page.getByTestId("stack-badge-mongo")).toBeVisible();
    await expect(page.getByTestId("commit-sha")).toBeVisible();

    // 6. Verify ReturnToTop button
    const returnToTop = page.getByTestId("return-to-top-btn");
    await expect(returnToTop).toBeVisible();
    await returnToTop.click();

    // 7. Verify API endpoints directly (Telemetry, Admin & OTel Ingest)
    const telemetryRes = await request.get("/api/telemetry?limit=5");
    expect(telemetryRes.ok()).toBeTruthy();
    const telemetryJson = await telemetryRes.json();
    expect(telemetryJson.success).toBe(true);
    expect(Array.isArray(telemetryJson.events)).toBe(true);

    const adminRes = await request.get("/api/admin");
    expect(adminRes.ok()).toBeTruthy();
    const adminJson = await adminRes.json();
    expect(adminJson.success).toBe(true);
    expect(adminJson.overrides).toBeDefined();
    expect(adminJson.policy).toBeDefined();

    // Test OTel Ingest POST endpoint
    const ingestRes = await request.post("/api/telemetry/ingest", {
      data: {
        id: "test-trace-01",
        traceId: "trace-e2e-verification",
        framework: "langgraph",
        agentId: "test-e2e-agent",
        cloudRegion: "us-west-2",
        action: "E2E Automated Task Dispatch",
        promptTokens: 1200,
        completionTokens: 350,
        estimatedCostUsd: 0.0045,
        latencyMs: 180,
        confidenceScore: 0.98,
        driftVariance: 0.02,
        status: "success",
        timestamp: new Date().toISOString(),
      },
    });
    expect(ingestRes.ok()).toBeTruthy();
    const ingestJson = await ingestRes.json();
    expect(ingestJson.success).toBe(true);
    expect(ingestJson.traceId).toBe("trace-e2e-verification");

    // 8. Assert zero console errors & zero unhandled exceptions
    expect(consoleErrors).toEqual([]);
    expect(uncaughtExceptions).toEqual([]);
  });
});
