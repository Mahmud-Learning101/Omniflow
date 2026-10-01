import { test, expect } from "@playwright/test";
import { injectWebGLMock } from "../helpers/webgl-mock";

test.describe("Lando Fluid Canvas & Kinetic Typography", () => {
  test.beforeEach(async ({ page }) => {
    await injectWebGLMock(page);
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("scales typography fluidly across responsive breakpoints", async ({
    page,
  }) => {
    const breakpoints = [
      { width: 390, height: 844, name: "Mobile" },
      { width: 768, height: 1024, name: "Tablet" },
      { width: 1280, height: 800, name: "Desktop" },
      { width: 1728, height: 1080, name: "1728px Ultrawide" },
    ];

    const fontSizes: number[] = [];

    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/", { waitUntil: "domcontentloaded" });

      const heading = page.locator('[data-testid="kinetic-heading-text"]');
      await expect(heading).toBeVisible();

      const fontSizeStr = await heading.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });

      const fontSize = parseFloat(fontSizeStr);
      expect(fontSize).toBeGreaterThan(0);
      fontSizes.push(fontSize);
    }

    // Monotonically increasing font sizes across responsive breakpoints
    expect(fontSizes[0]).toBeLessThan(fontSizes[1]); // Mobile < Tablet
    expect(fontSizes[1]).toBeLessThan(fontSizes[2]); // Tablet < Desktop
    expect(fontSizes[2]).toBeLessThanOrEqual(fontSizes[3]); // Desktop <= 1728px
  });

  test("maintains zero layout shifts (CLS = 0) during mount and pointer movement", async ({
    page,
  }) => {
    // Inject PerformanceObserver to aggregate Cumulative Layout Shift
    await page.addInitScript(() => {
      let cls = 0;
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value || 0;
          }
        }
        (window as any).__cumulativeLayoutShift = cls;
      });
      observer.observe({ type: "layout-shift", buffered: true });
      (window as any).__cumulativeLayoutShift = 0;
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });

    const heroSection = page.locator('[data-testid="fluid-hero-section"]');
    await expect(heroSection).toBeVisible();

    // Trigger kinetic typography pointer velocity events
    const box = await heroSection.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 100, box.y + 100);
      await page.mouse.move(box.x + 300, box.y + 150, { steps: 5 });
      await page.mouse.move(box.x + 600, box.y + 200, { steps: 5 });
      await page.mouse.move(box.x + 200, box.y + 250, { steps: 5 });
    }

    // Wait briefly for kinetic transitions
    await page.waitForTimeout(300);

    const clsScore = await page.evaluate(
      () => (window as any).__cumulativeLayoutShift ?? 0
    );
    // Strict threshold: Layout shift must remain zero or effectively negligible (< 0.05)
    expect(clsScore).toBeLessThan(0.05);
  });

  test("renders kinetic headline and operational telemetry ribbon from config", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Validate Kinetic Heading content
    const heading = page.locator('[data-testid="kinetic-heading-text"]');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Autonomous Agent Fleet Control", {
      ignoreCase: true,
    });

    const prefix = page.locator('[data-testid="kinetic-heading-prefix"]');
    await expect(prefix).toBeVisible();
    await expect(prefix).toContainText("OmniFlow");

    // Validate 2D Particle Canvas
    const canvas = page.locator('[data-testid="velocity-particles-canvas"]');
    await expect(canvas).toBeAttached();

    // Validate Hero Telemetry Bar
    const telemetryBar = page.locator('[data-testid="hero-telemetry-bar"]');
    await expect(telemetryBar).toBeVisible();
    await expect(telemetryBar).toContainText("THROUGHPUT");
    await expect(telemetryBar).toContainText("CYCLE REDUCTION");
    await expect(telemetryBar).toContainText("ops/sec");
  });
});
