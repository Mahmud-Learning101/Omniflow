import { z } from "zod";

export const ChromeColorsSchema = z.object({
  obsidian: z.string().min(1),
  obsidianSurface: z.string().min(1),
  obsidianCard: z.string().min(1),
  racingLime: z.string().min(1),
  beaconCyan: z.string().min(1),
  flameOrange: z.string().min(1),
  border: z.string().min(1),
  borderHover: z.string().min(1),
  subtleText: z.string().min(1),
});

export const ChromeCrtSchema = z.object({
  scanlineOpacity: z.number().min(0).max(1),
  vignetteOpacity: z.number().min(0).max(1),
  noiseOpacity: z.number().min(0).max(1),
});

export const ChromeCursorSchema = z.object({
  innerSize: z.number().positive(),
  outerSize: z.number().positive(),
  expandedSize: z.number().positive(),
  springStiffness: z.number().positive(),
  springDamping: z.number().positive(),
});

export const ChromeConfigSchema = z.object({
  monogram: z.string().min(1),
  monogramSub: z.string().min(1),
  latencyUnit: z.string().min(1),
  latencyTarget: z.number().positive(),
  soundOnLabel: z.string().min(1),
  soundOffLabel: z.string().min(1),
  soundAriaLabel: z.string().min(1),
  soundShortcutHint: z.string().min(1),
  consoleTriggerLabel: z.string().min(1),
  consoleAriaLabel: z.string().min(1),
  consoleShortcutHint: z.string().min(1),
  statusActiveLabel: z.string().min(1),
  consoleNotice: z.string().min(1),
  colors: ChromeColorsSchema,
  crt: ChromeCrtSchema,
  cursor: ChromeCursorSchema,
});

export type ChromeColors = z.infer<typeof ChromeColorsSchema>;
export type ChromeCrt = z.infer<typeof ChromeCrtSchema>;
export type ChromeCursor = z.infer<typeof ChromeCursorSchema>;
export type ChromeConfig = z.infer<typeof ChromeConfigSchema>;
