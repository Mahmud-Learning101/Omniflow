import { test, expect } from "@playwright/test";
import { injectWebGLMock } from "../helpers/webgl-mock";
import { siteConfig } from "../../src/config/site";

test.describe("Phase 4: System Chrome & Shared Interactive Props", () => {
  test("mounts navigation dock, latency meter, sound toggle, magnetic cursor, and CRT overlay cleanly", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const uncaughtExceptions: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        if (text.includes("favicon.ico") || text.includes("webpack-hmr")) return;
        consoleErrors.push(text);
      }
    });

    page.on("pageerror", (err) => {
      uncaughtExceptions.push(err.message);
    });

    await injectWebGLMock(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const { chrome } = siteConfig;

    // 1. Verify NavigationDock Monogram & Subtitle
    const monogramEl = page.getByText(chrome.monogram);
    await expect(monogramEl).toBeVisible();

    const monogramSubEl = page.getByRole('link', { name: 'OmniFlow' }).getByText(chrome.monogramSub);
    await expect(monogramSubEl).toBeVisible();

    // 2. Verify Live Latency Indicator
    const latencyIndicator = page.getByTitle(new RegExp(`${chrome.statusActiveLabel}`, "i"));
    await expect(latencyIndicator).toBeVisible();
    await expect(latencyIndicator).toContainText(chrome.latencyUnit);

    // 3. Verify Sound Toggle & Mute State Switching
    const soundToggle = page.getByRole("button", { name: chrome.soundAriaLabel });
    await expect(soundToggle).toBeVisible();
    await expect(soundToggle).toContainText(chrome.soundOnLabel);
    await expect(soundToggle).toHaveAttribute("aria-pressed", "true");

    // Click toggle to mute
    await soundToggle.click();
    await expect(soundToggle).toContainText(chrome.soundOffLabel);
    await expect(soundToggle).toHaveAttribute("aria-pressed", "false");

    // Keyboard shortcut 'm' to unmute
    await page.keyboard.press("m");
    await expect(soundToggle).toContainText(chrome.soundOnLabel);
    await expect(soundToggle).toHaveAttribute("aria-pressed", "true");

    // 4. Verify Launch Console Trigger & HUD Feedback
    const consoleBtn = page.getByRole("button", { name: chrome.consoleAriaLabel });
    await expect(consoleBtn).toBeVisible();
    await expect(consoleBtn).toContainText(chrome.consoleTriggerLabel);

    await consoleBtn.click();
    const hudNotification = page.getByText(chrome.consoleNotice);
    await expect(hudNotification).toBeVisible();

    // 5. Verify Magnetic Cursor & Hitbox Tracking
    await page.mouse.move(200, 200);
    // Hover over magnetic element to verify snapping state doesn't throw
    await soundToggle.hover();

    // 6. Verify CRT Overlay Present & Non-blocking
    const crtScanlines = page.locator(".animate-scanline");
    await expect(crtScanlines).toBeAttached();

    // 7. Verify Zero Console Errors
    expect(consoleErrors).toEqual([]);
    expect(uncaughtExceptions).toEqual([]);
  });
});
