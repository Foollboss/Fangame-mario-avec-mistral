import { Vector3, Quaternion } from 'three';
import { clamp } from '../core/math.js';

const _e = new Vector3(), _t = new Vector3(), _w = new Vector3(), _q = new Quaternion();

// Contrôleur PD d'orientation en l'air : oriente l'avant vers `fwdT` et le toit vers `upT`.
// Écrit pitch / steer (lacet) / roll dans `frame`. Utilisé par les bots et l'aide à l'atterrissage.
export function orientInAir(car, fwdT, upT, frame, kp = 3.4, kd = 0.6, upWeight = 0.6) {
  _e.crossVectors(car.fwd, fwdT);
  // Si l'avant est opposé à la cible, le produit vectoriel s'annule : on force une rotation en tangage.
  if (car.fwd.dot(fwdT) < -0.95 && _e.lengthSq() < 0.01) _e.copy(car.left);
  _t.crossVectors(car.up, upT).multiplyScalar(upWeight);
  _e.add(_t);
  _q.copy(car.quat).invert();
  _e.applyQuaternion(_q);
  _w.copy(car.angVel).applyQuaternion(_q);
  frame.pitch = clamp(kp * _e.x - kd * _w.x, -1, 1);
  frame.steer = clamp(-(kp * _e.y - kd * _w.y), -1, 1);
  frame.roll = clamp(kp * _e.z - kd * _w.z, -1, 1);
}

// Angle signé (radians, positif = cible à droite) entre l'avant de la voiture et une cible.
export function angleTo(car, x, z) {
  const dx = x - car.pos.x, dz = z - car.pos.z;
  // Repère local projeté sur le plan de la voiture
  const lx = dx * car.left.x + dz * car.left.z;
  const lz = dx * car.fwd.x + dz * car.fwd.z;
  return Math.atan2(-lx, lz);
}
