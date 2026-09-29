import { NOISE_GLSL } from './noise.glsl';

/**
 * Vertex shader for Igloo Procedural Refraction Chamber.
 * Computes world normals, eye vectors, and subtle surface micro-perturbations.
 */
export const REFRACTION_VERTEX_SHADER = /* glsl */ `
uniform float uTime;
uniform float uDistortionFrequency;
uniform float uGlitchSpeed;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vEyeVector;
varying vec2 vUv;

${NOISE_GLSL}

void main() {
  vUv = uv;
  vNormal = normalize(mat3(modelMatrix) * normal);

  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  
  // High-frequency subtle crystalline displacement
  float noise = snoise(worldPosition.xyz * uDistortionFrequency + vec3(0.0, uTime * uGlitchSpeed * 0.5, 0.0));
  worldPosition.xyz += vNormal * (noise * 0.02);

  vWorldPosition = worldPosition.xyz;
  vEyeVector = normalize(worldPosition.xyz - cameraPosition);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;
