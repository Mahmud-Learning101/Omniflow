import { ShadersConfig, ShadersConfigSchema } from '@/types/shaders';

export const shadersConfig: ShadersConfig = ShadersConfigSchema.parse({
  activePreset: 'obsidianGlass',
  presets: {
    obsidianGlass: {
      id: 'obsidianGlass',
      name: 'Obsidian Crystalline Refraction',
      description: 'Physical-based transmission shader with optical grade IOR 1.45, chromatic dispersion, and directional rim lighting.',
      refraction: {
        ior: 1.45,
        chromaticDispersion: 0.08,
        roughness: 0.12,
        transmission: 0.94,
        thickness: 1.25,
        fresnelPower: 2.5,
        specularIntensity: 0.85,
      },
      lighting: {
        primaryLightPosition: [5.0, 10.0, 7.5],
        primaryLightColor: [0.824, 1.0, 0.0],
        primaryLightIntensity: 1.8,
        ambientLightColor: [0.031, 0.035, 0.051],
        ambientLightIntensity: 0.4,
      },
      distortionNoiseFrequency: 1.85,
      glitchSpeed: 0.45,
    },
    cryoMatrix: {
      id: 'cryoMatrix',
      name: 'Cryo Matrix Ice',
      description: 'Ultra-low roughness cryogenic frost dispersion for high-throughput visual telemetry signals.',
      refraction: {
        ior: 1.31,
        chromaticDispersion: 0.15,
        roughness: 0.05,
        transmission: 0.98,
        thickness: 0.8,
        fresnelPower: 3.2,
        specularIntensity: 0.95,
      },
      lighting: {
        primaryLightPosition: [-6.0, 8.0, 4.0],
        primaryLightColor: [0.5, 0.85, 1.0],
        primaryLightIntensity: 2.2,
        ambientLightColor: [0.02, 0.03, 0.05],
        ambientLightIntensity: 0.35,
      },
      distortionNoiseFrequency: 2.4,
      glitchSpeed: 0.8,
    },
  },
});
