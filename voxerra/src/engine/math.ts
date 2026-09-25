/** Petites fonctions mathématiques partagées (sans dépendance au rendu). */

export const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v);
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const invLerp = (a: number, b: number, v: number): number => (b === a ? 0 : (v - a) / (b - a));
export const smoothstep = (e0: number, e1: number, x: number): number => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
/** Modulo toujours positif. */
export const mod = (a: number, n: number): number => ((a % n) + n) % n;
export const floorDiv = (a: number, n: number): number => Math.floor(a / n);
export const dist2 = (ax: number, az: number, bx: number, bz: number): number => (ax - bx) ** 2 + (az - bz) ** 2;
export const dist3 = (ax: number, ay: number, az: number, bx: number, by: number, bz: number): number =>
  Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2);

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}
export const v3 = (x = 0, y = 0, z = 0): Vec3 => ({ x, y, z });
export const v3len = (v: Vec3): number => Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

/** Direction de regard à partir du lacet/tangage (radians). yaw=0 regarde vers -Z. */
export function lookDir(yaw: number, pitch: number, out: Vec3 = v3()): Vec3 {
  const cp = Math.cos(pitch);
  out.x = -Math.sin(yaw) * cp;
  out.y = Math.sin(pitch);
  out.z = -Math.cos(yaw) * cp;
  return out;
}

/** Angle le plus court entre deux angles. */
export function angleDiff(a: number, b: number): number {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0');
  return '#' + c(r) + c(g) + c(b);
}

export function packRgb(r: number, g: number, b: number): number {
  return ((clamp(Math.round(r), 0, 255) << 16) | (clamp(Math.round(g), 0, 255) << 8) | clamp(Math.round(b), 0, 255)) >>> 0;
}
