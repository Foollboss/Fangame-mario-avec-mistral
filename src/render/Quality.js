// Graphics tiers. Everything that costs fill-rate or CPU is scaled here.
export const QUALITY = {
  low: { id: 'low', label: 'BASSE', pixelRatio: 0.75, maxDpr: 1, antialias: false, particles: 220, crowd: 260, fieldTex: 1024, ambient: 40, anisotropy: 1, trailSegments: 14, envMap: false },
  medium: { id: 'medium', label: 'MOYENNE', pixelRatio: 1, maxDpr: 1.5, antialias: false, particles: 480, crowd: 900, fieldTex: 1536, ambient: 90, anisotropy: 2, trailSegments: 20, envMap: true },
  high: { id: 'high', label: 'HAUTE', pixelRatio: 1, maxDpr: 2, antialias: true, particles: 900, crowd: 1800, fieldTex: 2048, ambient: 160, anisotropy: 4, trailSegments: 26, envMap: true },
};

const LOW_GPU = /(Adreno \(TM\) [2-5]\d\d|Mali-[T4]|Mali-G(31|51|52|57)|PowerVR|SwiftShader|llvmpipe|Intel\(R\) HD Graphics [2-5])/i;
const HIGH_GPU = /(Adreno \(TM\) (6[4-9]\d|7\d\d|8\d\d)|Mali-G(7[1-9]|6[1-9]|710|715|720)|Immortalis|Apple|NVIDIA|GeForce|Radeon|Xclipse)/i;

// Initial guess from the device; the runtime FPS monitor can then step down.
export function detectQuality(gl) {
  let gpu = '';
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    gpu = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  } catch (e) {
    gpu = '';
  }
  const ua = navigator.userAgent || '';
  const mobile = /Android|iPhone|iPad|Mobile/i.test(ua);
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  if (LOW_GPU.test(gpu)) return { tier: 'low', gpu };
  if (!mobile) return { tier: HIGH_GPU.test(gpu) || !gpu ? 'high' : 'medium', gpu };
  let score = 0;
  if (HIGH_GPU.test(gpu)) score += 2;
  if (cores >= 8) score += 1;
  if (mem >= 6) score += 1;
  return { tier: score >= 3 ? 'high' : score >= 1 ? 'medium' : 'low', gpu };
}

// Watches frame times; after a sustained slowdown it asks to drop one tier.
export class FpsMonitor {
  constructor(onDowngrade) {
    this.onDowngrade = onDowngrade;
    this.samples = 0;
    this.time = 0;
    this.slowWindows = 0;
    this.fps = 60;
    this.enabled = true;
  }

  reset() {
    this.samples = 0;
    this.time = 0;
    this.slowWindows = 0;
  }

  frame(dt, target) {
    this.samples++;
    this.time += dt;
    if (this.time < 3) return;
    this.fps = this.samples / this.time;
    const threshold = target >= 60 ? 42 : 25;
    if (this.enabled && this.fps < threshold) this.slowWindows++;
    else this.slowWindows = 0;
    if (this.slowWindows >= 2) {
      this.slowWindows = 0;
      this.onDowngrade && this.onDowngrade(this.fps);
    }
    this.samples = 0;
    this.time = 0;
  }
}
