/**
 * Fragment shader for Igloo Procedural Refraction Chamber.
 * Implements physical refraction with Snell-Descartes vectors,
 * tri-wavelength RGB chromatic dispersion, Fresnel grazing rim glow,
 * and Blinn-Phong directional specular highlights.
 */
export const REFRACTION_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uIor;
uniform float uChromaticDispersion;
uniform float uRoughness;
uniform float uTransmission;
uniform float uThickness;
uniform float uFresnelPower;
uniform float uSpecularIntensity;

uniform vec3 uPrimaryLightPos;
uniform vec3 uPrimaryLightColor;
uniform float uPrimaryLightIntensity;
uniform vec3 uAmbientLightColor;
uniform float uAmbientLightIntensity;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vEyeVector;
varying vec2 vUv;

// Procedural high-contrast studio environment map
vec3 getEnvironmentColor(vec3 ray) {
  float y = ray.y * 0.5 + 0.5;
  vec3 topColor = vec3(0.02, 0.03, 0.06);
  vec3 midColor = vec3(0.05, 0.08, 0.12);
  vec3 bottomColor = vec3(0.01, 0.01, 0.02);

  vec3 env = mix(bottomColor, midColor, smoothstep(0.0, 0.5, y));
  env = mix(env, topColor, smoothstep(0.5, 1.0, y));

  // Neon horizon flare
  float horizon = pow(1.0 - abs(ray.y), 16.0);
  env += vec3(0.824, 1.0, 0.0) * horizon * 0.35;

  // Grid caustics simulation
  float grid = sin(ray.x * 14.0 + uTime * 0.2) * cos(ray.z * 14.0 + uTime * 0.2);
  env += vec3(0.0, 0.7, 1.0) * max(0.0, grid) * 0.15;

  return env;
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 eye = normalize(vEyeVector);

  // 1. Fresnel edge factor
  float cosTheta = max(dot(-eye, normal), 0.0);
  float fresnel = pow(1.0 - cosTheta, uFresnelPower);

  // 2. Chromatic dispersion ray vectors
  float spread = uChromaticDispersion * 0.06;
  float etaR = 1.0 / max(0.5, uIor - spread);
  float etaG = 1.0 / max(0.5, uIor);
  float etaB = 1.0 / max(0.5, uIor + spread);

  vec3 refractR = refract(eye, normal, etaR);
  vec3 refractG = refract(eye, normal, etaG);
  vec3 refractB = refract(eye, normal, etaB);

  // Internal reflection fallback if total internal reflection occurs
  if (length(refractR) < 0.001) refractR = reflect(eye, normal);
  if (length(refractG) < 0.001) refractG = reflect(eye, normal);
  if (length(refractB) < 0.001) refractB = reflect(eye, normal);

  // Sample environment through dispersed rays
  vec3 colorR = getEnvironmentColor(refractR);
  vec3 colorG = getEnvironmentColor(refractG);
  vec3 colorB = getEnvironmentColor(refractB);
  vec3 transmittedRgb = vec3(colorR.r, colorG.g, colorB.b) * uTransmission;

  // 3. Specular highlights (Blinn-Phong)
  vec3 lightDir = normalize(uPrimaryLightPos - vWorldPosition);
  vec3 viewDir = -eye;
  vec3 halfDir = normalize(lightDir + viewDir);
  float shininess = 64.0 / max(uRoughness * uRoughness, 0.002);
  float specFactor = pow(max(dot(normal, halfDir), 0.0), shininess);
  vec3 specular = uPrimaryLightColor * specFactor * uSpecularIntensity * uPrimaryLightIntensity;

  // 4. Edge Glow & Ambient composite
  vec3 fresnelGlow = uPrimaryLightColor * fresnel * 0.9;
  vec3 ambient = uAmbientLightColor * uAmbientLightIntensity;

  vec3 finalColor = transmittedRgb + specular + fresnelGlow + ambient;

  // Obsidian glass tint
  finalColor *= vec3(0.9, 0.95, 1.0);

  gl_FragColor = vec4(finalColor, 0.96);
}
`;
