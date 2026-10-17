/**
 * Poses des modèles humanoïdes (joueur local vu de dos ou de face, poupée, autres joueurs) :
 * debout / marche, accroupi, nage rapide, flottaison, vol plané (planeur) et vol créatif.
 *
 * Contrat d'appel — applyHumanoidPose(model, pose, o) :
 * - à appeler à chaque image APRÈS avoir écrit le lacet dans model.root.rotation.y (et l'échelle
 *   dans model.root.scale), par exemple `model.root.rotation.set(0, yaw, 0)` ;
 * - la fonction conserve root.rotation.y, impose root.rotation.order = 'YXZ' (lacet puis
 *   inclinaison dans le repère du corps), écrit root.rotation.x / z et root.position (décalage
 *   du modèle par rapport à la position de l'entité, exprimé dans le repère du parent), puis pose
 *   TOUTES les parties (body, head, bras, jambes) par model.pose(...) et la position du torse ;
 * - 'stand' remet root.position à 0 et root.rotation.x / z à 0 : à appeler aussi avant
 *   l'animation de mort (qui écrit root.rotation.z), sinon un nageur mort resterait décalé ;
 * - o.t : temps en secondes (performance.now() / 1000) ; o.walk : phase de marche
 *   (walkDist * 3) ; o.amp : ampleur de la marche 0..1 ; o.pitch : tangage du regard
 *   (positif = vers le haut) ; o.swing : ampleur du coup de bras 0..1 (sin(swingTime * π)).
 *
 * Les transitions entre poses sont adoucies (0,2 s) avec un petit état propre à chaque modèle
 * (WeakMap indexée par l'instance, rien de global) ; hors transition, la pose est appliquée
 * exactement (la marche « stand » est identique à l'animation historique des joueurs, sauf le
 * coup de bras, désormais vers l'avant).
 * Les modèles visés sont ceux de humanoidParts (models.ts) : torse pivotant aux hanches, tête et
 * bras enfants du torse, jambes à la racine.
 */
import type { Object3D } from 'three';
import type { ModelInstance } from './BoxModel';
import type { HumanPose as NetPose } from '../net/protocol';

export type HumanPose = 'stand' | 'sneak' | 'swim' | 'tread' | 'glide' | 'fly';

/** Liste identique à celle du protocole réseau (vérifié par tsc). */
const SAME_AS_PROTOCOL: [HumanPose, NetPose] extends [NetPose, HumanPose] ? true : never = true;
void SAME_AS_PROTOCOL;

export interface PoseInput {
  t: number;
  walk: number;
  amp: number;
  pitch: number;
  swing: number;
}

const PARTS = ['body', 'head', 'rightArm', 'leftArm', 'rightLeg', 'leftLeg'] as const;
type PartName = (typeof PARTS)[number];
/** Canaux : inclinaison et roulis de la racine, décalage de la racine (pixels, repère tourné du lacet), rotations des parties, décalage du torse. */
const TILT = 0;
const ROLL = 1;
const OFF = 2;
const PART0 = 5;
const BODY_POS = PART0 + PARTS.length * 3;
const N = BODY_POS + 3;
const isAngle = (i: number) => i < OFF || (i >= PART0 && i < BODY_POS);
const partIndex = (name: PartName) => PART0 + PARTS.indexOf(name) * 3;

/** Durée d'un fondu entre deux poses (secondes). */
const BLEND = 0.2;
/**
 * Hauteur du centre du torse en nage au-dessus des pieds (blocs) : un peu au-dessus du milieu de
 * la boîte de nage (0,6 bloc de haut), pour que la main ne traverse pas le fond pendant la traction.
 */
const SWIM_CENTER = 0.36;
/** Inclinaison du torse accroupi (radians, vers l'avant). */
const SNEAK_LEAN = 0.5;
/** Tête relevée pendant la nage et le vol plané (relative au corps couché). */
const HEAD_UP = 0.9;
/** Vitesse des mouvements de crawl (radians par seconde). */
const CRAWL = 5;
/**
 * Coup de bras (attaque, pose d'un bloc) : le bras droit monte vers l'avant. Une rotation X
 * positive envoie un membre pendant vers l'avant (le modèle regarde vers -Z) ; l'ancienne
 * animation (-1,2) l'envoyait vers l'arrière.
 */
const PUNCH = 1.2;

interface Geometry {
  /** Pixels du modèle → unités du parent de la racine. */
  scale: number;
  /** Hauteur du centre du torse (pixels), pivot des poses couchées. */
  pivot: number;
}

interface BlendState {
  pose: HumanPose;
  lastT: number;
  w: number;
  from: Float64Array;
  out: Float64Array;
}

const states = new WeakMap<ModelInstance, BlendState>();
const target = new Float64Array(N);

/** Pose tout le corps (racine comprise) ; voir l'en-tête pour les conventions. */
export function applyHumanoidPose(model: ModelInstance, pose: HumanPose, o: PoseInput): void {
  const body = model.parts.get('body');
  if (!body) return;
  const g = geometry(model, body);
  computePose(pose, o, g, target);
  let st = states.get(model);
  if (!st) {
    st = { pose, lastT: o.t, w: 1, from: new Float64Array(N), out: Float64Array.from(target) };
    states.set(model, st);
  }
  const dt = Math.min(0.1, Math.max(0, o.t - st.lastT));
  st.lastT = o.t;
  if (pose !== st.pose) {
    st.from.set(st.out);
    st.pose = pose;
    st.w = 0;
  }
  st.w = Math.min(1, st.w + dt / BLEND);
  if (st.w >= 1) st.out.set(target);
  else {
    const k = st.w * st.w * (3 - 2 * st.w);
    for (let i = 0; i < N; i++) {
      const d = target[i] - st.from[i];
      st.out[i] = st.from[i] + (isAngle(i) ? wrap(d) : d) * k;
    }
  }
  write(model, st.out, g);
}

/** Géométrie réutilisée à chaque appel (aucune allocation par image). */
const geo: Geometry = { scale: 1, pivot: 0 };

function geometry(model: ModelInstance, body: Object3D): Geometry {
  // Le torse (12 pixels de haut) est enfant direct du groupe mis à l'échelle du modèle.
  const inner = body.parent?.scale.y ?? 1 / 16;
  geo.scale = inner * model.root.scale.y;
  geo.pivot = restPos(body).y + 6;
  return geo;
}

/** Position de repos d'une partie (mémorisée au premier passage, comme userData.rest pour la rotation). */
function restPos(g: Object3D): { x: number; y: number; z: number } {
  let r = g.userData.restPos as { x: number; y: number; z: number } | undefined;
  if (!r) {
    r = { x: g.position.x, y: g.position.y, z: g.position.z };
    g.userData.restPos = r;
  }
  return r;
}

function set(out: Float64Array, name: PartName, x: number, y = 0, z = 0): void {
  const i = partIndex(name);
  out[i] = x;
  out[i + 1] = y;
  out[i + 2] = z;
}

/**
 * Racine inclinée de `tilt` autour du centre du torse (hauteur g.pivot), ce centre étant placé à
 * la hauteur `cy` (pixels) au-dessus des pieds, décalé de `cz` (pixels, + = vers l'arrière).
 */
function rootAround(out: Float64Array, g: Geometry, tilt: number, cy: number, cz = 0): void {
  out[TILT] = tilt;
  out[ROLL] = 0;
  out[OFF] = 0;
  out[OFF + 1] = cy - g.pivot * Math.cos(tilt);
  out[OFF + 2] = cz - g.pivot * Math.sin(tilt);
}

function computePose(pose: HumanPose, o: PoseInput, g: Geometry, out: Float64Array): void {
  out.fill(0);
  const t = o.t;
  const pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, o.pitch || 0));
  const sw = Math.sin(o.walk) * 0.8 * o.amp;
  switch (pose) {
    case 'stand':
      // Animation historique des joueurs (EntityManager) : jambes et bras opposés, respiration ; coup vers l'avant.
      set(out, 'rightLeg', sw);
      set(out, 'leftLeg', -sw);
      set(out, 'rightArm', -sw + o.swing * PUNCH + Math.sin(t * 1.2) * 0.03, 0, Math.sin(t) * 0.04);
      set(out, 'leftArm', sw + Math.sin(t * 1.1) * 0.03, 0, -Math.sin(t) * 0.04);
      set(out, 'head', pitch);
      break;
    case 'sneak': {
      // Torse penché, hanches abaissées et reculées, tête qui garde la direction du regard.
      rootAround(out, g, 0, g.pivot, 3);
      out[BODY_POS + 1] = -2.5;
      set(out, 'body', -SNEAK_LEAN);
      set(out, 'head', pitch + SNEAK_LEAN);
      set(out, 'rightLeg', sw);
      set(out, 'leftLeg', -sw);
      set(out, 'rightArm', 0.1 - sw + o.swing * PUNCH + Math.sin(t * 1.2) * 0.03, 0, Math.sin(t) * 0.04);
      set(out, 'leftArm', 0.1 + sw + Math.sin(t * 1.1) * 0.03, 0, -Math.sin(t) * 0.04);
      break;
    }
    case 'swim': {
      // Couché face vers le bas dans la direction du regard, dans la boîte basse.
      rootAround(out, g, -Math.PI / 2 + pitch, SWIM_CENTER / g.scale);
      const ph = t * CRAWL;
      set(out, 'body', 0, Math.sin(ph) * 0.12);
      set(out, 'head', HEAD_UP);
      // Crawl : chaque bras fait un grand cercle en alternance, retour par le dos puis traction
      // sous le corps ; pendant la traction le bras s'écarte pour ne pas plonger dans le fond.
      const ra = wrap(-ph);
      const la = wrap(-ph + Math.PI);
      set(out, 'rightArm', ra, 0, 0.25 + Math.max(0, Math.sin(ra)) * 0.75);
      set(out, 'leftArm', la, 0, -0.25 - Math.max(0, Math.sin(la)) * 0.75);
      const kick = Math.sin(t * 9) * 0.3;
      set(out, 'rightLeg', kick);
      set(out, 'leftLeg', -kick);
      break;
    }
    case 'tread': {
      // Flottaison : corps droit qui ondule doucement, jambes qui pédalent, bras écartés qui brassent.
      rootAround(out, g, -0.05, g.pivot + Math.sin(t * 2.4) * 0.5);
      set(out, 'head', pitch + 0.05);
      const pedal = Math.sin(t * 3) * 0.45;
      set(out, 'rightLeg', pedal, 0, 0.05);
      set(out, 'leftLeg', -pedal, 0, -0.05);
      const scull = Math.cos(t * 2.4) * 0.25;
      const spread = 0.6 + Math.sin(t * 2.4) * 0.15;
      set(out, 'rightArm', 0.1 + scull + o.swing * PUNCH, 0, spread);
      set(out, 'leftArm', 0.1 + scull, 0, -spread);
      break;
    }
    case 'glide': {
      // Planeur : corps presque horizontal selon le regard, bras le long du corps un peu écartés, jambes serrées.
      rootAround(out, g, -Math.PI / 2 + pitch, g.pivot);
      set(out, 'head', HEAD_UP);
      const flutter = Math.sin(t * 1.7) * 0.03;
      set(out, 'rightArm', -0.12, 0, 0.3 + flutter);
      set(out, 'leftArm', -0.12, 0, -0.3 - flutter);
      const legs = Math.sin(t * 2) * 0.04;
      set(out, 'rightLeg', legs);
      set(out, 'leftLeg', -legs);
      break;
    }
    case 'fly': {
      // Vol créatif : debout, légère flottaison, jambes peu balancées (un peu en arrière si l'on avance).
      rootAround(out, g, 0, g.pivot + Math.sin(t * 1.8) * 0.6);
      const sway = Math.sin(t * 1.5) * 0.1;
      set(out, 'rightLeg', sw * 0.3 + sway - 0.15 * o.amp);
      set(out, 'leftLeg', -sw * 0.3 - sway - 0.15 * o.amp);
      set(out, 'rightArm', -sw * 0.3 + o.swing * PUNCH + Math.sin(t * 1.2) * 0.03, 0, Math.sin(t) * 0.04 + 0.05);
      set(out, 'leftArm', sw * 0.3 + Math.sin(t * 1.1) * 0.03, 0, -Math.sin(t) * 0.04 - 0.05);
      set(out, 'head', pitch);
      break;
    }
  }
}

function write(model: ModelInstance, v: Float64Array, g: Geometry): void {
  const root = model.root;
  root.rotation.order = 'YXZ';
  const yaw = root.rotation.y;
  root.rotation.x = v[TILT];
  root.rotation.z = v[ROLL];
  // Décalage exprimé dans le repère tourné du lacet → repère du parent.
  const x = v[OFF] * g.scale;
  const y = v[OFF + 1] * g.scale;
  const z = v[OFF + 2] * g.scale;
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  root.position.set(x * c + z * s, y, -x * s + z * c);
  for (const name of PARTS) {
    const i = partIndex(name);
    model.pose(name, v[i], v[i + 1], v[i + 2]);
  }
  const body = model.parts.get('body')!;
  const rest = restPos(body);
  body.position.set(rest.x + v[BODY_POS], rest.y + v[BODY_POS + 1], rest.z + v[BODY_POS + 2]);
}

function wrap(a: number): number {
  a %= Math.PI * 2;
  if (a > Math.PI) a -= Math.PI * 2;
  else if (a < -Math.PI) a += Math.PI * 2;
  return a;
}
