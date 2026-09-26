import { Quaternion } from 'three';

const _q = new Quaternion();

// Sérialisation compacte de l'état visible du monde (voitures + balle).
// Utilisée par le replay aujourd'hui, et prévue pour la synchronisation réseau (serveur → clients).
export const CAR_STRIDE = 12;  // pos(3) quat(4) boost(1) flags(1) steer(1) boostAmount(1) speed(1)
export const BALL_STRIDE = 7;  // pos(3) quat(4)

export const Snapshot = {
  size(carCount) { return 1 + BALL_STRIDE + carCount * CAR_STRIDE; },

  write(sim, out, o = 0) {
    out[o++] = sim.time;
    const b = sim.ball;
    out[o++] = b.pos.x; out[o++] = b.pos.y; out[o++] = b.pos.z;
    out[o++] = b.quat.x; out[o++] = b.quat.y; out[o++] = b.quat.z; out[o++] = b.quat.w;
    for (const c of sim.cars) {
      out[o++] = c.pos.x; out[o++] = c.pos.y; out[o++] = c.pos.z;
      out[o++] = c.quat.x; out[o++] = c.quat.y; out[o++] = c.quat.z; out[o++] = c.quat.w;
      out[o++] = c.boosting ? 1 : 0;
      out[o++] = (c.supersonic ? 1 : 0) | (c.onGround ? 2 : 0);
      out[o++] = c.steer;
      out[o++] = c.boost;
      out[o++] = c.vel.length();
    }
    return o;
  },

  // Interpole deux instantanés vers un objet « vue » : { ball:{pos,quat}, cars:[{pos,quat,boosting,supersonic,steer,speed}] }
  lerp(a, ao, b, bo, t, view) {
    const L = (i) => a[ao + i] + (b[bo + i] - a[ao + i]) * t;
    view.time = L(0);
    view.ball.pos.set(L(1), L(2), L(3));
    view.ball.quat.set(a[ao + 4], a[ao + 5], a[ao + 6], a[ao + 7]).slerp(_q.set(b[bo + 4], b[bo + 5], b[bo + 6], b[bo + 7]), t);
    let o = 1 + BALL_STRIDE;
    for (const c of view.cars) {
      c.pos.set(L(o), L(o + 1), L(o + 2));
      c.quat.set(a[ao + o + 3], a[ao + o + 4], a[ao + o + 5], a[ao + o + 6]).slerp(_q.set(b[bo + o + 3], b[bo + o + 4], b[bo + o + 5], b[bo + o + 6]), t);
      c.boosting = a[ao + o + 7] > 0.5;
      c.supersonic = (a[ao + o + 8] & 1) === 1;
      c.onGround = (a[ao + o + 8] & 2) === 2;
      c.steer = L(o + 9);
      c.boost = L(o + 10);
      c.speed = L(o + 11);
      o += CAR_STRIDE;
    }
  },
};
