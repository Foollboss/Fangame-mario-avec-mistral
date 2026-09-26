// Profils graphiques et détection automatique selon l'appareil puis selon les FPS mesurés.
export const QUALITY_PRESETS = {
  low: { level: 'low', label: 'BASSE', pixelRatio: 0.75, maxDpr: 1, antialias: false, particles: 350, boostRate: 30, sparkMax: 10, goalParticles: 90 },
  medium: { level: 'medium', label: 'MOYENNE', pixelRatio: 1, maxDpr: 1.5, antialias: false, particles: 900, boostRate: 50, sparkMax: 22, goalParticles: 200 },
  high: { level: 'high', label: 'HAUTE', pixelRatio: 1, maxDpr: 2, antialias: true, particles: 1800, boostRate: 70, sparkMax: 40, goalParticles: 380 },
};

export class QualityManager {
  constructor(setting = 'auto', stored = null) {
    this.setting = setting;          // 'auto' | 'low' | 'medium' | 'high'
    this.detected = stored || null;  // profil retenu après mesure (sauvegardé)
    this.samples = [];
    this.scale = 1;                  // échelle de résolution dynamique (auto)
    this.onChange = null;
  }

  guess() {
    const nav = typeof navigator !== 'undefined' ? navigator : {};
    const mem = nav.deviceMemory || 4;
    const cores = nav.hardwareConcurrency || 4;
    const mobile = /Android|iPhone|iPad|Mobile/i.test(nav.userAgent || '');
    let gpu = '';
    try {
      const gl = document.createElement('canvas').getContext('webgl');
      const ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
      gpu = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    } catch { /* ignoré */ }
    if (/Mali-(G5|G3|T)|Adreno \(TM\) [345]\d\d|PowerVR|SwiftShader|llvmpipe/i.test(gpu)) return 'low';
    if (!mobile && cores >= 8) return 'high';
    if (/Apple GPU/i.test(gpu) || /Adreno \(TM\) [67]\d\d/i.test(gpu)) return 'medium';
    if (mem <= 3 || cores <= 4) return 'low';
    return mobile ? 'medium' : 'high';
  }

  get level() {
    if (this.setting !== 'auto') return this.setting;
    return this.detected || this.guess();
  }

  preset() { return QUALITY_PRESETS[this.level]; }

  // Appelé chaque image en mode auto : ajuste la résolution puis le profil si les FPS s'effondrent.
  sample(dt, targetFps) {
    if (this.setting !== 'auto') return;
    this.samples.push(dt);
    if (this.samples.length < 150) return;
    const sorted = [...this.samples].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    this.samples.length = 0;
    const fps = 1 / median;
    const floor = targetFps * 0.85;
    if (fps < floor) {
      if (this.scale > 0.7) { this.scale = Math.max(0.7, this.scale - 0.1); this.onChange?.('scale'); }
      else if (this.level !== 'low') {
        this.detected = this.level === 'high' ? 'medium' : 'low';
        this.scale = 1;
        this.onChange?.('level');
      }
    } else if (fps > targetFps * 0.97 && this.scale < 1) {
      this.scale = Math.min(1, this.scale + 0.05);
      this.onChange?.('scale');
    }
  }
}
