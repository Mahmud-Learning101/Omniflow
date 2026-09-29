import { test, expect } from '@playwright/test';
import { injectWebGLMock } from '../helpers/webgl-mock';
import { shadersConfig } from '../../src/config/shaders';

test.describe('Section 2: Igloo Procedural Refraction Chamber & Shaders', () => {
  test('mounts refraction chamber, renders 3D canvas, controls HUD, and executes ASCII scramble on hover', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const uncaughtExceptions: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (err) => {
      uncaughtExceptions.push(err.message);
    });

    await injectWebGLMock(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // 1. Verify Section 2 DOM Mounting
    const section = page.getByTestId('igloo-refraction-section');
    await expect(section).toBeVisible();

    const title = page.getByRole('heading', { level: 2, name: shadersConfig.chamber.title });
    await expect(title).toBeVisible();

    // 2. Verify 3D Canvas Container & Canvas Element
    const canvasContainer = page.getByTestId('refraction-canvas-container');
    await expect(canvasContainer).toBeVisible({ timeout: 15000 });

    const canvas = canvasContainer.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // 3. Verify ShaderControlsHUD Initial Values
    const hud = page.getByTestId('shader-controls-hud');
    await expect(hud).toBeVisible();

    const initialIor = page.getByTestId('hud-ior-value');
    await expect(initialIor).toHaveText('1.450');

    const initialDispersion = page.getByTestId('hud-dispersion-value');
    await expect(initialDispersion).toHaveText('0.080');

    // 4. Test Preset Switching (Cryo Matrix)
    const cryoBtn = page.getByTestId('preset-btn-cryoMatrix');
    await expect(cryoBtn).toBeVisible();
    await cryoBtn.click();

    // Verify updated values in HUD
    await expect(initialIor).toHaveText('1.310');
    await expect(initialDispersion).toHaveText('0.150');

    // 5. Test Interactive Cybernetic Hover Scramble Cards
    const firstCardConfig = shadersConfig.chamber.cards[0];
    const cardEl = page.getByTestId(`scramble-card-${firstCardConfig.id}`);
    await expect(cardEl).toBeVisible();

    const scrambleTarget = page.getByTestId(`scramble-target-${firstCardConfig.id}`);
    await expect(scrambleTarget).toHaveText(firstCardConfig.targetWord);

    // Hover to trigger ASCII decode animation
    await cardEl.hover();

    // Wait for animation to lock onto target word
    await expect(scrambleTarget).toHaveText(firstCardConfig.targetWord, { timeout: 3000 });

    // 6. Assert Zero Console Errors and Zero Page Exceptions
    expect(consoleErrors).toEqual([]);
    expect(uncaughtExceptions).toEqual([]);
  });
});
