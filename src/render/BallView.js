import * as THREE from 'three';
import { BALL } from '../core/Config.js';
import { ballTexture, ballEmissiveTexture } from './Textures.js';

export class BallView {
  constructor(quality) {
    const R = BALL.radius;
    this.group = new THREE.Group();
    this.map = ballTexture();
    this.emap = ballEmissiveTexture();
    const seg = quality.id === 'low' ? 20 : 32;
    this.material = new THREE.MeshStandardMaterial({
      map: this.map, roughness: 0.38, metalness: 0.15,
      emissive: new THREE.Color(0x19e6ff), emissiveMap: this.emap, emissiveIntensity: 1.2,
    });
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(R, seg, Math.round(seg * 0.75)), this.material);
    this.group.add(this.mesh);
    // Fresnel rim so the ball reads against any background
    this.rimMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(0x9ff4ff) }, uPower: { value: 0.55 } },
      vertexShader: 'varying float vF; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vec3 n = normalize(normalMatrix * normal); vF = 1.0 - abs(dot(n, normalize(-mv.xyz))); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform vec3 uColor; uniform float uPower; varying float vF; void main(){ gl_FragColor = vec4(uColor, pow(vF, 2.5) * uPower); }',
    });
    this.rim = new THREE.Mesh(new THREE.SphereGeometry(R * 1.08, seg, Math.round(seg * 0.75)), this.rimMat);
    this.group.add(this.rim);
  }

  update(dt, ball) {
    this.group.visible = !ball.hidden;
    this.group.position.copy(ball.pos);
    this.mesh.quaternion.copy(ball.quat);
    const sp = ball.vel.length();
    this.material.emissiveIntensity = 0.9 + Math.min(1.8, sp / 50);
    this.rimMat.uniforms.uPower.value = 0.45 + Math.min(0.6, sp / 120);
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.rim.geometry.dispose();
    this.material.dispose();
    this.rimMat.dispose();
    this.map.dispose();
    this.emap.dispose();
  }
}
