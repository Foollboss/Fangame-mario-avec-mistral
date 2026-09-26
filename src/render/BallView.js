import * as THREE from 'three';
import { BALL, TEAM } from '../core/Config.js';

const UP = new THREE.Vector3(0, 1, 0);
const _q = new THREE.Quaternion();
const NEUTRAL = new THREE.Color(0x9ff4ff);

// Face centres of a truncated icosahedron: 12 pentagons (icosahedron vertices) then
// 20 hexagons (dodecahedron vertices). Their spherical Voronoi cells form the classic ball.
function panelCenters() {
  const f = (1 + Math.sqrt(5)) / 2;
  const out = [];
  for (const a of [-1, 1]) for (const b of [-1, 1]) {
    out.push([0, a, b * f], [a, b * f, 0], [a * f, 0, b]);
  }
  for (const a of [-1, 1]) for (const b of [-1, 1]) for (const c of [-1, 1]) out.push([a, b, c]);
  for (const a of [-1, 1]) for (const b of [-1, 1]) {
    out.push([0, a / f, b * f], [a / f, b * f, 0], [a * f, 0, b / f]);
  }
  return out.map(([x, y, z]) => new THREE.Vector3(x, y, z).normalize());
}
const CENTERS = panelCenters();

function panelMaterial() {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.32, metalness: 0.2, emissive: NEUTRAL.clone(), emissiveIntensity: 1.2 });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uCenters = { value: CENTERS };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObjN;')
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvObjN = normal;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec3 vObjN;
        uniform vec3 uCenters[32];
        float gSeam; float gPenta;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        {
          vec3 n = normalize(vObjN);
          float d1 = -2.0, d2 = -2.0; int best = 0;
          for (int i = 0; i < 32; i++) {
            float d = dot(n, uCenters[i]);
            if (d > d1) { d2 = d1; d1 = d; best = i; } else if (d > d2) { d2 = d; }
          }
          float w = fwidth(d1 - d2) * 1.5 + 0.004;
          gSeam = 1.0 - smoothstep(0.0, w + 0.01, d1 - d2);
          gPenta = best < 12 ? 1.0 : 0.0;
          vec3 panel = mix(vec3(0.93, 0.95, 1.0), vec3(0.08, 0.1, 0.16), gPenta);
          diffuseColor.rgb = mix(panel, vec3(0.03, 0.04, 0.07), gSeam);
        }`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        totalEmissiveRadiance *= gSeam + gPenta * 0.12;`);
  };
  return m;
}

// Ball rendering: panelled sphere with glowing seams tinted by the last team to touch it,
// fresnel rim for readability, and squash-and-stretch on every bounce.
export class BallView {
  constructor(quality) {
    const R = BALL.radius;
    this.group = new THREE.Group();
    this.squash = new THREE.Group();
    this.group.add(this.squash);
    const seg = quality.id === 'low' ? 24 : quality.id === 'medium' ? 36 : 48;
    this.material = panelMaterial();
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(R, seg, Math.round(seg * 0.75)), this.material);
    this.mesh.castShadow = true;
    this.squash.add(this.mesh);
    this.rimMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: NEUTRAL.clone() }, uPower: { value: 0.55 } },
      vertexShader: 'varying float vF; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vec3 n = normalize(normalMatrix * normal); vF = 1.0 - abs(dot(n, normalize(-mv.xyz))); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform vec3 uColor; uniform float uPower; varying float vF; void main(){ gl_FragColor = vec4(uColor, pow(vF, 2.5) * uPower);\n#include <colorspace_fragment>\n}',
    });
    this.rim = new THREE.Mesh(new THREE.SphereGeometry(R * 1.08, seg, Math.round(seg * 0.75)), this.rimMat);
    this.squash.add(this.rim);
    this.tint = NEUTRAL.clone();
    this.targetTint = NEUTRAL.clone();
    this.amt = 0;
    this.vamt = 0;
    this.pulse = 0;
  }

  // Called on floor/wall impacts: compress the ball along the contact normal.
  impact(normal, strength) {
    this.squash.quaternion.setFromUnitVectors(UP, normal);
    this.vamt += Math.min(9, strength * 0.12);
    this.pulse = Math.min(1, this.pulse + strength / 60);
  }

  setTeam(team) {
    this.targetTint.set(team >= 0 ? TEAM[team].color : NEUTRAL);
  }

  update(dt, ball) {
    this.group.visible = !ball.hidden;
    this.group.position.copy(ball.pos);
    // Damped spring: squash then a small overshoot, like a real inflated ball.
    this.vamt += (-300 * this.amt - 16 * this.vamt) * dt;
    this.amt = Math.max(-0.12, Math.min(0.3, this.amt + this.vamt * dt));
    const a = this.amt;
    this.squash.scale.set(1 + a * 0.55, 1 - a, 1 + a * 0.55);
    // Counter-rotate so the panels keep the physical orientation inside the squash frame.
    _q.copy(this.squash.quaternion).invert().multiply(ball.quat);
    this.mesh.quaternion.copy(_q);
    this.tint.lerp(this.targetTint, Math.min(1, dt * 6));
    this.pulse = Math.max(0, this.pulse - dt * 2.5);
    const sp = ball.vel.length();
    this.material.emissive.copy(this.tint);
    this.material.emissiveIntensity = 0.9 + Math.min(1.8, sp / 50) + this.pulse * 1.5;
    this.rimMat.uniforms.uColor.value.copy(this.tint);
    this.rimMat.uniforms.uPower.value = 0.45 + Math.min(0.6, sp / 120) + this.pulse * 0.4;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.rim.geometry.dispose();
    this.material.dispose();
    this.rimMat.dispose();
  }
}
