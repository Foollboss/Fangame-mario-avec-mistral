import * as THREE from 'three';
import { ARENA, TEAM } from '../core/Config.js';
import { PAD_LAYOUT } from '../game/BoostSystem.js';
import { canvas, toTexture } from './Textures.js';

const HW = ARENA.halfWidth;
const HL = ARENA.halfLength;
const KICKOFF_SPOTS = [[-26, -34], [26, -34], [-6, -52], [6, -52], [0, -64]];

// Deterministic noise so every device paints the same field.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Paints the pitch in world units: colour map (+ a separate glow map for the lines).
export class FieldPainter {
  constructor(theme, size, withGlow) {
    this.theme = theme;
    this.f = theme.field;
    this.W = Math.round((size * HW) / HL);
    this.H = size;
    this.sx = this.W / (HW * 2);
    this.sz = this.H / (HL * 2);
    this.color = canvas(this.W, this.H);
    this.g = this.color.getContext('2d');
    if (withGlow) {
      this.glow = canvas(this.W, this.H);
      this.gg = this.glow.getContext('2d');
      this.gg.fillStyle = '#000';
      this.gg.fillRect(0, 0, this.W, this.H);
    }
    this.rand = rng(1234);
  }

  X(x) { return (x + HW) * this.sx; }
  Z(z) { return (z + HL) * this.sz; }

  // Draws on the colour map and, when present, the glow map.
  both(fn) {
    fn(this.g, false);
    if (this.gg) fn(this.gg, true);
  }

  paint() {
    const f = this.f;
    if (f.pattern === 'chevron') this.grass();
    else if (f.pattern === 'bands') this.slabs();
    else this.tiles();
    this.teamZones();
    this.pads();
    this.lines();
    this.names();
    this.emblem();
    this.grain(f.grain || 6);
    return this;
  }

  tiles() {
    const { g, W, H } = this;
    const f = this.f;
    g.fillStyle = f.base1;
    g.fillRect(0, 0, W, H);
    const t = 2.5;
    const base = new THREE.Color(f.base1);
    const c = new THREE.Color();
    for (let z = -HL; z < HL; z += t) {
      for (let x = -HW; x < HW; x += t) {
        c.copy(base).multiplyScalar(0.92 + this.rand() * 0.18);
        g.fillStyle = `#${c.getHexString()}`;
        g.fillRect(this.X(x) + 1, this.Z(z) + 1, t * this.sx - 2, t * this.sz - 2);
      }
    }
    g.strokeStyle = f.base2;
    g.lineWidth = Math.max(1, this.sx * 0.12);
    for (let x = -HW; x <= HW; x += 10) { g.beginPath(); g.moveTo(this.X(x), 0); g.lineTo(this.X(x), H); g.stroke(); }
    for (let z = -HL; z <= HL; z += 10) { g.beginPath(); g.moveTo(0, this.Z(z)); g.lineTo(W, this.Z(z)); g.stroke(); }
    // Soft light pool in the middle of the pitch
    const rg = g.createRadialGradient(this.X(0), this.Z(0), 0, this.X(0), this.Z(0), this.Z(HL) * 0.6);
    rg.addColorStop(0, 'rgba(120,170,255,0.14)');
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = rg;
    g.fillRect(0, 0, W, H);
  }

  slabs() {
    const { g, W, H } = this;
    const f = this.f;
    g.fillStyle = f.base1;
    g.fillRect(0, 0, W, H);
    const base = new THREE.Color(f.base1);
    const c = new THREE.Color();
    const s = 6;
    for (let z = -HL; z < HL; z += s) {
      const off = (Math.round((z + HL) / s) % 2) * s * 0.5;
      for (let x = -HW - s; x < HW; x += s) {
        c.copy(base).multiplyScalar(0.88 + this.rand() * 0.2);
        g.fillStyle = `#${c.getHexString()}`;
        g.fillRect(this.X(x + off) + 1.5, this.Z(z) + 1.5, s * this.sx - 3, s * this.sz - 3);
      }
    }
    g.fillStyle = f.base2;
    for (let z = -HL + 8; z < HL; z += 24) g.fillRect(0, this.Z(z), W, 6 * this.sz);
    // Fine cracks
    g.strokeStyle = 'rgba(90,45,20,0.25)';
    g.lineWidth = 1;
    for (let i = 0; i < 90; i++) {
      let x = (this.rand() - 0.5) * 2 * HW, z = (this.rand() - 0.5) * 2 * HL;
      g.beginPath();
      g.moveTo(this.X(x), this.Z(z));
      for (let k = 0; k < 4; k++) {
        x += (this.rand() - 0.5) * 3;
        z += (this.rand() - 0.5) * 3;
        g.lineTo(this.X(x), this.Z(z));
      }
      g.stroke();
    }
  }

  grass() {
    const { g, W, H } = this;
    const f = this.f;
    // Mowing stripes across the pitch
    const band = 7.2;
    let i = 0;
    for (let z = -HL; z < HL; z += band, i++) {
      g.fillStyle = i % 2 ? f.base2 : f.base1;
      g.fillRect(0, this.Z(z), W, band * this.sz + 1);
    }
    // Chevrons on top, pointing at each goal
    g.fillStyle = f.chevron || 'rgba(0,0,0,0.12)';
    for (let k = -12; k < 12; k++) {
      const z0 = k * 12;
      const dir = z0 < 0 ? -1 : 1;
      g.beginPath();
      g.moveTo(this.X(-HW), this.Z(z0));
      g.lineTo(this.X(0), this.Z(z0 + dir * HW * 0.4));
      g.lineTo(this.X(HW), this.Z(z0));
      g.lineTo(this.X(HW), this.Z(z0 + 5));
      g.lineTo(this.X(0), this.Z(z0 + 5 + dir * HW * 0.4));
      g.lineTo(this.X(-HW), this.Z(z0 + 5));
      g.closePath();
      g.fill();
    }
    // Blade-like streaks
    g.strokeStyle = 'rgba(255,255,255,0.035)';
    g.lineWidth = 1;
    for (let n = 0; n < 2500; n++) {
      const x = this.rand() * W, y = this.rand() * H;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + (this.rand() - 0.5) * 3, y + 4 + this.rand() * 6);
      g.stroke();
    }
  }

  teamZones() {
    const g = this.g;
    for (const team of [0, 1]) {
      const z0 = team === 0 ? -HL : HL;
      const grd = g.createLinearGradient(0, this.Z(z0), 0, this.Z(z0 * 0.35));
      grd.addColorStop(0, this.theme.teamTint[team]);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grd;
      const a = Math.min(this.Z(z0), this.Z(z0 * 0.35));
      g.fillRect(0, a, this.W, Math.abs(this.Z(z0) - this.Z(z0 * 0.35)));
      // Goal box fill
      const s = team === 0 ? -1 : 1;
      g.fillStyle = TEAM[team].css;
      g.globalAlpha = 0.09;
      g.fillRect(this.X(-22), Math.min(this.Z(s * HL), this.Z(s * (HL - 18))), 44 * this.sx, 18 * this.sz);
      g.globalAlpha = 1;
    }
  }

  pads() {
    this.both((g, glow) => {
      g.lineWidth = 0.3 * this.sx;
      for (const p of PAD_LAYOUT) {
        const r = (p.big ? 4.2 : 2.7) * this.sx;
        g.strokeStyle = glow ? 'rgba(255,190,90,0.8)' : 'rgba(255,181,71,0.55)';
        g.beginPath();
        g.arc(this.X(p.x), this.Z(p.z), r, 0, Math.PI * 2);
        g.stroke();
        if (p.big) {
          g.beginPath();
          g.arc(this.X(p.x), this.Z(p.z), r * 1.25, 0, Math.PI * 2);
          g.setLineDash([r * 0.3, r * 0.2]);
          g.stroke();
          g.setLineDash([]);
        }
      }
      // Kickoff marks (both halves)
      g.fillStyle = glow ? '#ffffff' : this.f.lines;
      for (const [x, z] of KICKOFF_SPOTS) {
        for (const s of [1, -1]) {
          g.fillRect(this.X(s * x) - 0.6 * this.sx, this.Z(s * z) - 0.12 * this.sz, 1.2 * this.sx, 0.24 * this.sz);
          g.fillRect(this.X(s * x) - 0.12 * this.sx, this.Z(s * z) - 0.6 * this.sz, 0.24 * this.sx, 1.2 * this.sz);
        }
      }
    });
  }

  lines() {
    // Outline where the flat pitch meets the curved ramps (rounded like the arena)
    const RV = ARENA.rampRadius;
    const RC = ARENA.cornerRadius;
    this.both((g, glow) => {
      g.strokeStyle = glow ? '#ffffff' : this.f.lines;
      g.fillStyle = g.strokeStyle;
      g.lineJoin = 'round';
      g.lineWidth = 0.5 * this.sx;
      const outline = (inset) => {
        const hw = HW - RV - inset, hl = HL - RV - inset, r = Math.max(1, RC - RV - inset);
        g.beginPath();
        g.moveTo(this.X(-hw + r), this.Z(-hl));
        g.lineTo(this.X(hw - r), this.Z(-hl));
        g.arc(this.X(hw - r), this.Z(-hl + r), r * this.sx, -Math.PI / 2, 0);
        g.lineTo(this.X(hw), this.Z(hl - r));
        g.arc(this.X(hw - r), this.Z(hl - r), r * this.sx, 0, Math.PI / 2);
        g.lineTo(this.X(-hw + r), this.Z(hl));
        g.arc(this.X(-hw + r), this.Z(hl - r), r * this.sx, Math.PI / 2, Math.PI);
        g.lineTo(this.X(-hw), this.Z(-hl + r));
        g.arc(this.X(-hw + r), this.Z(-hl + r), r * this.sx, Math.PI, Math.PI * 1.5);
        g.closePath();
        g.stroke();
      };
      const m = 1.5;
      outline(0.6);
      g.lineWidth = 0.2 * this.sx;
      outline(1.7);
      // Goal lines in the goal mouths (no ramp there)
      g.lineWidth = 0.5 * this.sx;
      for (const s of [-1, 1]) {
        g.beginPath(); g.moveTo(this.X(-ARENA.goalHalfWidth), this.Z(s * (HL - 0.3))); g.lineTo(this.X(ARENA.goalHalfWidth), this.Z(s * (HL - 0.3))); g.stroke();
      }
      g.lineWidth = 0.5 * this.sx;
      g.beginPath(); g.moveTo(this.X(-HW + m), this.Z(0)); g.lineTo(this.X(HW - m), this.Z(0)); g.stroke();
      g.beginPath(); g.arc(this.X(0), this.Z(0), 13 * this.sx, 0, Math.PI * 2); g.stroke();
      g.lineWidth = 0.2 * this.sx;
      g.beginPath(); g.arc(this.X(0), this.Z(0), 14.2 * this.sx, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.arc(this.X(0), this.Z(0), 1.2 * this.sx, 0, Math.PI * 2); g.fill();
      g.lineWidth = 0.5 * this.sx;
      for (const s of [-1, 1]) {
        const zl = s * (HL - m);
        const zb = s * (HL - 18);
        g.beginPath();
        g.moveTo(this.X(-22), this.Z(zl)); g.lineTo(this.X(-22), this.Z(zb)); g.lineTo(this.X(22), this.Z(zb)); g.lineTo(this.X(22), this.Z(zl));
        g.stroke();
        g.beginPath();
        g.moveTo(this.X(-12), this.Z(zl)); g.lineTo(this.X(-12), this.Z(s * (HL - 8))); g.lineTo(this.X(12), this.Z(s * (HL - 8))); g.lineTo(this.X(12), this.Z(zl));
        g.stroke();
        g.beginPath();
        g.arc(this.X(0), this.Z(zb), 9 * this.sx, s > 0 ? Math.PI : 0, s > 0 ? Math.PI * 2 : Math.PI);
        g.stroke();
        // Dashed thirds
        g.setLineDash([2 * this.sx, 1.5 * this.sx]);
        g.lineWidth = 0.25 * this.sx;
        g.beginPath(); g.moveTo(this.X(-HW + m), this.Z(s * 24)); g.lineTo(this.X(HW - m), this.Z(s * 24)); g.stroke();
        g.setLineDash([]);
        g.lineWidth = 0.5 * this.sx;
      }
    });
  }

  names() {
    const g = this.g;
    g.save();
    g.font = `700 italic ${Math.round(8 * this.sx)}px "Chakra Petch", "Arial Narrow", sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (const team of [0, 1]) {
      g.save();
      g.translate(this.X(0), this.Z(team === 0 ? -40 : 40));
      if (team === 0) g.rotate(Math.PI);
      g.globalAlpha = this.f.nameAlpha ?? 0.22;
      g.fillStyle = TEAM[team].css;
      g.fillText(TEAM[team].name, 0, 0);
      g.restore();
    }
    g.restore();
  }

  emblem() {
    this.both((g, glow) => {
      g.save();
      g.translate(this.X(0), this.Z(0));
      // Ring of chevrons around the centre spot
      g.fillStyle = glow ? 'rgba(255,255,255,0.35)' : this.f.logo;
      for (let i = 0; i < 12; i++) {
        g.save();
        g.rotate((i / 12) * Math.PI * 2);
        g.beginPath();
        g.moveTo(-1.2 * this.sx, -8 * this.sx);
        g.lineTo(0, -9.4 * this.sx);
        g.lineTo(1.2 * this.sx, -8 * this.sx);
        g.lineTo(1.2 * this.sx, -7.3 * this.sx);
        g.lineTo(0, -8.7 * this.sx);
        g.lineTo(-1.2 * this.sx, -7.3 * this.sx);
        g.closePath();
        g.fill();
        g.restore();
      }
      if (!glow) {
        g.rotate(-Math.PI / 2);
        g.fillStyle = this.f.logo;
        g.font = `700 ${Math.round(3.2 * this.sx)}px "Chakra Petch", sans-serif`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText('NEON CAR ARENA', 0, 0);
      }
      g.restore();
    });
  }

  grain(amount) {
    const { g, W, H } = this;
    if (!amount) return;
    const img = g.getImageData(0, 0, W, H);
    const d = img.data;
    const r = this.rand;
    for (let i = 0; i < d.length; i += 4) {
      const n = (r() - 0.5) * amount;
      d[i] += n; d[i + 1] += n; d[i + 2] += n;
    }
    g.putImageData(img, 0, 0);
  }

  textures(aniso) {
    return {
      map: toTexture(this.color, { aniso }),
      glow: this.glow ? toTexture(this.glow, { aniso }) : null,
    };
  }
}
