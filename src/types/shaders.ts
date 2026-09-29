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

export const ShadersConfigSchema = z.object({
  activePreset: z.string().min(1),
  presets: z.record(z.string(), ShaderPresetSchema),
});

export type Vector3 = z.infer<typeof Vector3Schema>;
export type ColorRgb = z.infer<typeof ColorRgbSchema>;
export type RefractionUniforms = z.infer<typeof RefractionUniformsSchema>;
export type LightVector = z.infer<typeof LightVectorSchema>;
export type ShaderPreset = z.infer<typeof ShaderPresetSchema>;
export type ShadersConfig = z.infer<typeof ShadersConfigSchema>;
