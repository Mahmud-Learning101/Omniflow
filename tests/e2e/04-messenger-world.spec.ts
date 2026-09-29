import { test, expect } from '@playwright/test';
import { injectWebGLMock } from '../helpers/webgl-mock';
import { hubsConfig } from '../../src/config/nodes';

test.describe('Section 3: Messenger 3D Planetary Agent Mesh', () => {
  test('lazy-mounts Three.js canvas, raycasts hitboxes, and displays node telemetry modal', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const uncaughtExceptions: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (
          text.includes('favicon.ico') ||
          text.includes('webpack-hmr') ||
          text.includes('ERR_CONNECTION_REFUSED')
        ) {
          return;
        }
        consoleErrors.push(text);
      }
    });

    page.on('pageerror', (err) => {
      console.log('PAGE ERROR STACK:', err.stack);
      uncaughtExceptions.push(err.message);
    });

    await injectWebGLMock(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Scroll toward Section 3
    const section = page.locator('#section-messenger');
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();

    // Verify Three.js Canvas mounts cleanly
    const canvas = page.getByTestId('spherical-canvas');
    await expect(canvas).toBeVisible();

    // Verify all 5 operational hubs are registered
    expect(hubsConfig.hubs).toHaveLength(5);

    for (const hub of hubsConfig.hubs) {
      const pin = page.getByTestId(`node-pin-${hub.id}`);
      await expect(pin).toBeVisible();
      await expect(pin).toHaveText(hub.name);
    }

    // Inspect first operational hub (Tokyo Apex Node)
    const targetHub = hubsConfig.hubs[0];
    const hubButton = page.getByTestId(`node-pin-${targetHub.id}`);
    await hubButton.click();

    // Verify Node Details Modal opens with live telemetry
    const modal = page.getByTestId('node-details-modal');
    await expect(modal).toBeVisible();

    const modalTitle = page.getByTestId('modal-hub-name');
    await expect(modalTitle).toHaveText(targetHub.name);

    const modalStatus = page.getByTestId('modal-hub-status');
    await expect(modalStatus).toHaveText(targetHub.status);

    const modalThroughput = page.getByTestId('modal-hub-throughput');
    await expect(modalThroughput).toContainText(targetHub.throughputGbps.toString());

    const modalLatency = page.getByTestId('modal-hub-latency');
    await expect(modalLatency).toContainText(targetHub.latencyMs.toString());

    // Close modal via close button
    const closeBtn = page.getByTestId('modal-close-button');
    await closeBtn.click();
    await expect(modal).not.toBeVisible();

    // Inspect gateway hub (Dhaka Delta Relay) and dismiss via Escape
    const gatewayHub = hubsConfig.hubs[4];
    await page.getByTestId(`node-pin-${gatewayHub.id}`).click();
    await expect(modal).toBeVisible();
    await expect(page.getByTestId('modal-hub-name')).toHaveText(gatewayHub.name);

    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();

    // Test canvas interaction / raycasting surface
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 + 20);
      await page.mouse.up();
    }

    // Assert zero console errors and zero unhandled page exceptions
    expect(consoleErrors).toEqual([]);
    expect(uncaughtExceptions).toEqual([]);
  });
});
