export type Vec3 = [number, number, number];

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

/**
 * Converts geographical latitude and longitude (in degrees) to 3D Cartesian coordinates on radius R.
 */
export function latLongToCartesian(lat: number, lng: number, radius = 1): Vec3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

export const latLngToVector3 = latLongToCartesian;

/**
 * Inverts 3D Cartesian coordinates back to geographical latitude and longitude.
 */
export function vector3ToLatLng(v: Vec3): GeoCoordinate {
  const [x, y, z] = v;
  const radius = Math.hypot(x, y, z);
  if (radius === 0) return { lat: 0, lng: 0 };

  const phi = Math.acos(Math.max(-1, Math.min(1, y / radius)));
  const theta = Math.atan2(z, -x);

  const lat = 90 - (phi * 180) / Math.PI;
  let lng = (theta * 180) / Math.PI - 180;

  while (lng < -180) lng += 360;
  while (lng > 180) lng -= 360;

  return { lat, lng };
}

/**
 * Analytical F1 Braking Cubic Bezier Easing: cubic-bezier(0.16, 1, 0.3, 1)
 * High initial entry velocity with rapid apex deceleration and smooth settling.
 */
function sampleCubic(p1: number, p2: number, t: number): number {
  return 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t;
}

function sampleDerivative(p1: number, p2: number, t: number): number {
  return 3 * (1 - t) * (1 - t) * p1 + 6 * (1 - t) * t * (p2 - p1) + 3 * t * t * (1 - p2);
}

export function f1Brake(progress: number): number {
  const x = Math.max(0, Math.min(1, progress));
  if (x === 0 || x === 1) return x;

  let t = x;
  for (let i = 0; i < 6; i++) {
    const currentX = sampleCubic(0.16, 0.3, t) - x;
    if (Math.abs(currentX) < 1e-5) break;
    const dX = sampleDerivative(0.16, 0.3, t);
    if (Math.abs(dX) < 1e-5) break;
    t = Math.max(0, Math.min(1, t - currentX / dX));
  }
  return sampleCubic(1.0, 1.0, t);
}

export function f1Lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * f1Brake(progress);
}

/**
 * Spherical linear interpolation (Slerp) between two vectors on a sphere.
 */
export function slerpOnSphere(v1: Vec3, v2: Vec3, t: number, targetRadius: number): Vec3 {
  const clampedT = Math.max(0, Math.min(1, t));
  const len1 = Math.hypot(...v1) || 1;
  const len2 = Math.hypot(...v2) || 1;
  const u1: Vec3 = [v1[0] / len1, v1[1] / len1, v1[2] / len1];
  const u2: Vec3 = [v2[0] / len2, v2[1] / len2, v2[2] / len2];

  let dot = Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1] + u1[2] * u2[2]));
  if (dot > 0.9995) {
    const rx = u1[0] + clampedT * (u2[0] - u1[0]);
    const ry = u1[1] + clampedT * (u2[1] - u1[1]);
    const rz = u1[2] + clampedT * (u2[2] - u1[2]);
    const rlen = Math.hypot(rx, ry, rz) || 1;
    return [(rx / rlen) * targetRadius, (ry / rlen) * targetRadius, (rz / rlen) * targetRadius];
  }

  const theta = Math.acos(dot);
  const sinTheta = Math.sin(theta);
  const s1 = Math.sin((1 - clampedT) * theta) / sinTheta;
  const s2 = Math.sin(clampedT * theta) / sinTheta;
  const rx = s1 * u1[0] + s2 * u2[0];
  const ry = s1 * u1[1] + s2 * u2[1];
  const rz = s1 * u1[2] + s2 * u2[2];
  const rlen = Math.hypot(rx, ry, rz) || 1;
  return [(rx / rlen) * targetRadius, (ry / rlen) * targetRadius, (rz / rlen) * targetRadius];
}

/**
 * Great-circle distance between two geo-coordinates in km.
 */
export function greatCircleDistance(lat1: number, lng1: number, lat2: number, lng2: number, radiusKm = 6371): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radiusKm * c;
}

/**
 * Procedural low-poly elevation displacement combining harmonic trigonometric octaves.
 */
export function calculateElevationDisplacement(
  x: number,
  y: number,
  z: number,
  baseRadius: number
): number {
  const f1 = 1.8;
  const f2 = 3.6;
  const f3 = 7.2;
  const octave1 = Math.sin(x * f1) * Math.cos(y * f1);
  const octave2 = Math.sin(y * f2) * Math.cos(z * f2) * 0.5;
  const octave3 = Math.sin(z * f3) * Math.cos(x * f3) * 0.25;
  const totalNoise = (octave1 + octave2 + octave3) / 1.75;
  return baseRadius * (1 + totalNoise * 0.08);
}

