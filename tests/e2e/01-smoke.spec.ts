import { test, expect } from '@playwright/test';
import { injectWebGLMock } from '../helpers/webgl-mock';

test.describe('Smoke Test & Chassis Verification', () => {
  test('mounts DOM cleanly with correct title, zero console errors, and zero uncaught exceptions', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const uncaughtExceptions: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('favicon.ico') || text.includes('404')) return;
        consoleErrors.push(text);
      }
    });

    page.on('pageerror', (error) => {
      uncaughtExceptions.push(error.message);
    });

    await injectWebGLMock(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Assert page title
    await expect(page).toHaveTitle(
      'OmniFlow // Autonomous AI Workflow & Pipeline Orchestration Laboratory'
    );

    // Assert primary DOM elements are visible
    const mainHeading = page.getByRole('heading', { level: 1 });
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toContainText('OmniFlow');
    await expect(mainHeading).toContainText(/Autonomous Agent Fleet Control/i);

    const statusBadge = page.getByText(/OTel & MCP Receiver Online/i);
    await expect(statusBadge).toBeVisible();

    // Assert zero console errors and zero unhandled page exceptions
    expect(consoleErrors).toEqual([]);
    expect(uncaughtExceptions).toEqual([]);
  });
});
