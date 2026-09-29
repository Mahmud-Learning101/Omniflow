import { z } from 'zod';

export const Vector3Schema = z.tuple([z.number(), z.number(), z.number()]);

export const ColorRgbSchema = z.tuple([
  z.number().min(0).max(1),
  z.number().min(0).max(1),
  z.number().min(0).max(1),
]);

export const RefractionUniformsSchema = z.object({
  ior: z.number().default(1.45),
  chromaticDispersion: z.number().min(0).max(1),
  roughness: z.number().min(0).max(1),
  transmission: z.number().min(0).max(1),
  thickness: z.number().positive(),
  fresnelPower: z.number().positive(),
  specularIntensity: z.number().min(0).max(1),
});

export const LightVectorSchema = z.object({
  primaryLightPosition: Vector3Schema,
  primaryLightColor: ColorRgbSchema,
  primaryLightIntensity: z.number().nonnegative(),
  ambientLightColor: ColorRgbSchema,
  ambientLightIntensity: z.number().nonnegative(),
});

export const ShaderPresetSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  refraction: RefractionUniformsSchema,
  lighting: LightVectorSchema,
  distortionNoiseFrequency: z.number().nonnegative(),
  glitchSpeed: z.number().nonnegative(),
});

export const CyberneticCardSchema = z.object({
  id: z.string().min(1),
  tag: z.string().min(1),
  title: z.string().min(1),
  targetWord: z.string().min(1),
  description: z.string().min(1),
  metricLabel: z.string().min(1),
  metricValue: z.string().min(1),
});

export const HudLabelsSchema = z.object({
  title: z.string().min(1),
  presetLabel: z.string().min(1),
  iorLabel: z.string().min(1),
  dispersionLabel: z.string().min(1),
  roughnessLabel: z.string().min(1),
  transmissionLabel: z.string().min(1),
  statusLabel: z.string().min(1),
  statusValue: z.string().min(1),
});

export const IglooChamberSectionSchema = z.object({
  badge: z.string().min(1),
  badgeStatus: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  canvasAriaLabel: z.string().min(1),
  fallbackLoadingText: z.string().min(1),
  hud: HudLabelsSchema,
  cards: z.array(CyberneticCardSchema).min(1),
});

export const ShadersConfigSchema = z.object({
  activePreset: z.string().min(1),
  presets: z.record(z.string(), ShaderPresetSchema),
  chamber: IglooChamberSectionSchema,
});

export type Vector3 = z.infer<typeof Vector3Schema>;
export type ColorRgb = z.infer<typeof ColorRgbSchema>;
export type RefractionUniforms = z.infer<typeof RefractionUniformsSchema>;
export type LightVector = z.infer<typeof LightVectorSchema>;
export type ShaderPreset = z.infer<typeof ShaderPresetSchema>;
export type CyberneticCard = z.infer<typeof CyberneticCardSchema>;
export type HudLabels = z.infer<typeof HudLabelsSchema>;
export type IglooChamberSection = z.infer<typeof IglooChamberSectionSchema>;
export type ShadersConfig = z.infer<typeof ShadersConfigSchema>;
