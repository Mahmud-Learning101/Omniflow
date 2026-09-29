/**
 * OmniFlow Hardware Math Engine
 * Spherical coordinate transforms and high-performance F1 braking bezier easing.
 */

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Converts Latitude/Longitude on sphere radius R to 3D Cartesian coordinates.
 * Y-axis aligned (standard Three.js right-handed coordinate system).
 */
export function latLongToCartesian(lat: number, lon: number, radius = 1): [number, number, number] {
  const phi = degToRad(clamp(lat, -90, 90));
  const theta = degToRad(lon);

  const cosPhi = Math.cos(phi);
  const x = radius * cosPhi * Math.sin(theta);
  const y = radius * Math.sin(phi);
  const z = radius * cosPhi * Math.cos(theta);

  return [x, y, z];
}

export function latLongToVector3(lat: number, lon: number, radius = 1): Vector3D {
  const [x, y, z] = latLongToCartesian(lat, lon, radius);
  return { x, y, z };
}

/**
 * Inverse conversion from 3D Cartesian coordinates to Latitude/Longitude.
 */
export function cartesianToLatLong(x: number, y: number, z: number): GeoCoordinate {
  const radius = Math.sqrt(x * x + y * y + z * z);
  if (radius === 0) return { latitude: 0, longitude: 0 };

  const latitude = radToDeg(Math.asin(clamp(y / radius, -1, 1)));
  const longitude = radToDeg(Math.atan2(x, z));

  return { latitude, longitude };
}

/**
 * Analytical F1 Braking Cubic Bezier Easing: cubic-bezier(0.16, 1, 0.3, 1)
 * High initial entry velocity with rapid apex deceleration and smooth settling.
 */
function sampleCubicBezier(p1: number, p2: number, t: number): number {
  return 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t;
}

function sampleCubicDerivative(p1: number, p2: number, t: number): number {
  return 3 * (1 - t) * (1 - t) * p1 + 6 * (1 - t) * t * (p2 - p1) + 3 * t * t * (1 - p2);
}

export function f1Brake(progress: number): number {
  const x = clamp(progress, 0, 1);
  if (x === 0 || x === 1) return x;

  const x1 = 0.16;
  const x2 = 0.3;
  const y1 = 1.0;
  const y2 = 1.0;

  // Newton-Raphson iteration to find t for given x
  let t = x;
  for (let i = 0; i < 6; i++) {
    const currentX = sampleCubicBezier(x1, x2, t) - x;
    if (Math.abs(currentX) < 1e-5) break;
    const dX = sampleCubicDerivative(x1, x2, t);
    if (Math.abs(dX) < 1e-5) break;
    t -= currentX / dX;
    t = clamp(t, 0, 1);
  }

  return sampleCubicBezier(y1, y2, t);
}

/**
 * Interpolate values using F1 braking deceleration curve
 */
export function f1Lerp(start: number, end: number, progress: number): number {
  return lerp(start, end, f1Brake(progress));
}
