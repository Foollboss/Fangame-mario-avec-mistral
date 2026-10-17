import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { Player } from '../src/player/Player';
import { RemotePlayer } from '../src/net/NetClient';
import { cleanArmor, cleanPose, type PlayerState } from '../src/net/protocol';
import { itemId } from '../src/items/items';
import { ModelInstance } from '../src/entities/BoxModel';
import { MODELS } from '../src/entities/models';
import { applyHumanoidPose, type HumanPose } from '../src/entities/humanoidPose';

const POSES: HumanPose[] = ['stand', 'sneak', 'swim', 'tread', 'glide', 'fly'];
const st = (key: string) => ({ id: itemId(key), count: 1 });

/** Joueur dans l'eau sans appui pendant n tics. */
function float(p: Player, n: number): void {
  p.fluid = { ...p.fluid, water: true };
  p.onGround = false;
  for (let i = 0; i < n; i++) p.updatePose();
}

function settle(p: Player, n: number, water = true): void {
  p.fluid = { ...p.fluid, water };
  p.onGround = true;
  for (let i = 0; i < n; i++) p.updatePose();
}

describe('pose du joueur', () => {
  it('debout par défaut, puis accroupi, vol créatif, nage, planeur', () => {
    const p = new Player();
    expect(p.pose).toBe('stand');
    p.sneaking = true;
    expect(p.pose).toBe('sneak');
    p.sneaking = false;
    p.flying = true;
    expect(p.pose).toBe('fly');
    p.flying = false;
    p.swimming = true;
    expect(p.pose).toBe('swim');
    p.swimming = false;
    p.gliding = true;
    expect(p.pose).toBe('glide');
  });

  it('mort ou en véhicule : debout', () => {
    const p = new Player();
    p.swimming = true;
    p.dead = true;
    expect(p.pose).toBe('stand');
    p.dead = false;
    p.vehicle = new Player();
    expect(p.pose).toBe('stand');
  });

  it('flottaison après 6 tics dans l’eau sans appui, fin après 4 tics au sol', () => {
    const p = new Player();
    float(p, 5);
    expect(p.pose).toBe('stand');
    float(p, 1);
    expect(p.pose).toBe('tread');
    // Un contact bref avec le fond ne change pas la pose
    settle(p, 3);
    expect(p.pose).toBe('tread');
    float(p, 1);
    settle(p, 3);
    expect(p.pose).toBe('tread');
    settle(p, 1);
    expect(p.pose).toBe('stand');
  });

  it('un saut dans une flaque ne déclenche pas la flottaison', () => {
    const p = new Player();
    for (let k = 0; k < 5; k++) {
      float(p, 4);
      settle(p, 1, false);
      expect(p.pose).toBe('stand');
    }
  });

  it('sortir de l’eau termine la flottaison ; la nage et le vol priment', () => {
    const p = new Player();
    float(p, 10);
    p.swimming = true;
    expect(p.pose).toBe('swim');
    p.swimming = false;
    expect(p.pose).toBe('tread');
    p.sneaking = true;
    expect(p.pose).toBe('tread');
    p.flying = true;
    expect(p.pose).toBe('fly');
    p.flying = false;
    p.fluid = { ...p.fluid, water: false };
    for (let i = 0; i < 4; i++) p.updatePose();
    expect(p.pose).toBe('sneak');
  });

  it('la réapparition remet la pose à zéro', () => {
    const p = new Player();
    float(p, 10);
    p.swimming = true;
    p.respawnReset();
    expect(p.pose).toBe('stand');
  });
});

describe('armure portée', () => {
  it('vide : 4 cases null', () => {
    expect(new Player().wornArmor()).toEqual([null, null, null, null]);
  });

  it('ordre tête, torse, jambes, pieds ; planeur et citrouille', () => {
    const p = new Player();
    const a = p.inventory.armor;
    a.set(0, st('iron_helmet'));
    a.set(1, st('glider'));
    a.set(2, st('diamond_leggings'));
    a.set(3, st('golden_boots'));
    expect(p.wornArmor()).toEqual(['iron', 'glider', 'diamond', 'golden']);
    a.set(0, st('pumpkin'));
    a.set(1, st('mythril_chestplate'));
    a.set(2, null);
    a.set(3, st('leather_boots'));
    expect(p.wornArmor()).toEqual(['pumpkin', 'mythril', null, 'leather']);
    a.set(1, st('etherium_chestplate'));
    a.set(2, st('celestine_leggings'));
    expect(p.wornArmor()).toEqual(['pumpkin', 'etherium', 'celestine', 'leather']);
  });

  it('un objet qui n’est pas une armure de la bonne case est ignoré', () => {
    const p = new Player();
    p.inventory.armor.slots[0] = st('stone');
    p.inventory.armor.slots[2] = st('iron_helmet');
    p.inventory.armor.slots[3] = st('pumpkin');
    expect(p.wornArmor()).toEqual([null, null, null, null]);
  });
});

describe('joueur distant', () => {
  const base: PlayerState = { id: 2, name: 'Bob', skin: 'explorer', p: [1, 64, 2], yaw: 0, pitch: 0, dim: 0, held: -1, sneaking: false, swing: 0 };

  it('pose et armure reçues', () => {
    const r = new RemotePlayer(2, 'Bob', 'explorer');
    r.apply({ ...base, pose: 'swim', armor: ['diamond', 'glider', null, 'iron'] });
    expect(r.pose).toBe('swim');
    expect(r.wornArmor()).toEqual(['diamond', 'glider', null, 'iron']);
    expect(r.height).toBe(0.6);
    r.apply({ ...base, pose: 'glide', armor: [null, 'glider', null, null] });
    expect(r.pose).toBe('glide');
    expect(r.height).toBe(1.8);
  });

  it('ancien client (sans champs) : debout ou accroupi, sans armure', () => {
    const r = new RemotePlayer(2, 'Bob', 'explorer');
    r.apply({ ...base, pose: 'tread', armor: ['iron', null, null, null] });
    r.apply(base);
    expect(r.pose).toBe('stand');
    expect(r.wornArmor()).toEqual([null, null, null, null]);
    r.apply({ ...base, sneaking: true });
    expect(r.pose).toBe('sneak');
    expect(r.height).toBe(1.5);
  });

  it('valeurs invalides neutralisées', () => {
    const r = new RemotePlayer(2, 'Bob', 'explorer');
    const bad = (pose: unknown, armor: unknown) => r.apply({ ...base, pose, armor } as unknown as PlayerState);
    for (const pose of ['voler', 42, null, {}, ['swim'], 'SWIM', '__proto__']) {
      bad(pose, null);
      expect(r.pose, String(pose)).toBe('stand');
    }
    for (const armor of [['iron'], ['iron', null, null, null, null], ['DIAMOND', null, null, null], ['a'.repeat(25), null, null, null], [{}, null, null, null], [1, null, null, null], ['<img>', null, null, null], 'iron', { 0: 'iron', length: 4 }]) {
      bad('stand', armor);
      expect(r.wornArmor(), JSON.stringify(armor)).toEqual([null, null, null, null]);
    }
    expect(cleanPose(undefined)).toBe('stand');
    expect(cleanPose(undefined, true)).toBe('sneak');
    expect(cleanPose('fly', true)).toBe('fly');
    const ok = ['iron', null, 'a'.repeat(24), 'z_z'];
    const copy = cleanArmor(ok);
    expect(copy).toEqual(ok);
    expect(copy).not.toBe(ok);
  });
});

describe('poses du modèle humanoïde', () => {
  const make = () => new ModelInstance(MODELS.player_explorer, new THREE.Texture(), new Map(), 'player_explorer');
  const input = (t: number, pitch = 0) => ({ t, walk: 1.3, amp: 0.8, pitch, swing: 0.5 });

  /** Rotations et position de toutes les parties et de la racine. */
  function signature(m: ModelInstance): number[] {
    const out = [m.root.rotation.x, m.root.rotation.z, m.root.position.x, m.root.position.y, m.root.position.z];
    for (const name of ['body', 'head', 'rightArm', 'leftArm', 'rightLeg', 'leftLeg']) {
      const g = m.parts.get(name)!;
      out.push(g.rotation.x, g.rotation.y, g.rotation.z, g.position.x, g.position.y, g.position.z);
    }
    return out;
  }

  /** Centre du torse dans le repère du parent (blocs). */
  function torso(m: ModelInstance): THREE.Vector3 {
    m.root.updateMatrixWorld(true);
    return m.parts.get('body')!.localToWorld(new THREE.Vector3(0, 6, 0));
  }

  function posed(pose: HumanPose, yaw = 0, pitch = 0, t = 2): ModelInstance {
    const m = make();
    m.root.rotation.set(0, yaw, 0);
    applyHumanoidPose(m, pose, input(t, pitch));
    return m;
  }

  it('chaque pose donne une posture distincte, sans exception', () => {
    const sigs = POSES.map((p) => signature(posed(p)));
    for (const s of sigs) for (const v of s) expect(Number.isFinite(v)).toBe(true);
    for (let i = 0; i < sigs.length; i++)
      for (let j = i + 1; j < sigs.length; j++) {
        const d = sigs[i].reduce((a, v, k) => a + Math.abs(v - sigs[j][k]), 0);
        expect(d, `${POSES[i]} / ${POSES[j]}`).toBeGreaterThan(0.2);
      }
  });

  it('« stand » reproduit l’animation historique des joueurs (coup de bras vers l’avant) et garde le lacet', () => {
    const m = posed('stand', 1.2, 0.4, 3);
    const t = 3;
    const sw = Math.sin(1.3) * 0.8 * 0.8;
    const p = (n: string) => m.parts.get(n)!.rotation;
    expect(m.root.rotation.y).toBeCloseTo(1.2);
    expect(m.root.rotation.x).toBe(0);
    expect(m.root.position.length()).toBe(0);
    expect(p('rightLeg').x).toBeCloseTo(sw);
    expect(p('leftLeg').x).toBeCloseTo(-sw);
    // Coup de bras vers l'avant (rotation X positive)
    expect(p('rightArm').x).toBeCloseTo(-sw + 0.5 * 1.2 + Math.sin(t * 1.2) * 0.03);
    expect(p('rightArm').z).toBeCloseTo(Math.sin(t) * 0.04);
    expect(p('leftArm').x).toBeCloseTo(sw + Math.sin(t * 1.1) * 0.03);
    expect(p('head').x).toBeCloseTo(0.4);
    expect(p('body').x).toBe(0);
    expect(torso(m).y).toBeCloseTo(18 * (0.9 / 16));
  });

  it('nage : corps couché dans la boîte basse (0,6), quel que soit le lacet', () => {
    for (const yaw of [0, 0.8, -2.5]) {
      const m = posed('swim', yaw);
      expect(m.root.rotation.order).toBe('YXZ');
      expect(m.root.rotation.y).toBeCloseTo(yaw);
      expect(m.root.rotation.x).toBeCloseTo(-Math.PI / 2);
      const c = torso(m);
      expect(c.x).toBeCloseTo(0);
      expect(c.y).toBeCloseTo(0.36);
      expect(c.z).toBeCloseTo(0);
      const b = new THREE.Box3().expandByObject(m.parts.get('body')!.children[0]);
      expect(b.min.y).toBeGreaterThan(0.1);
      expect(b.max.y).toBeLessThan(0.5);
    }
    // Sur tout un cycle de crawl, les mains ne passent pas sous les pieds (fond de l'eau)
    const m = make();
    let low = Infinity;
    for (let t = 20; t < 22; t += 0.02) {
      m.root.rotation.set(0, 0.3, 0);
      applyHumanoidPose(m, 'swim', { t, walk: 0, amp: 0, pitch: 0, swing: 0 });
      m.root.updateMatrixWorld(true);
      low = Math.min(low, new THREE.Box3().setFromObject(m.root).min.y);
    }
    expect(low).toBeGreaterThan(-0.02);
    // Le corps suit le regard ; les bras font le tour (crawl), les jambes battent
    expect(posed('swim', 0, -0.5).root.rotation.x).toBeCloseTo(-Math.PI / 2 - 0.5);
    const a = posed('swim', 0, 0, 1);
    const b = posed('swim', 0, 0, 1.3);
    expect(Math.abs(a.parts.get('rightArm')!.rotation.x - b.parts.get('rightArm')!.rotation.x)).toBeGreaterThan(0.5);
    expect(a.parts.get('rightLeg')!.rotation.x).not.toBeCloseTo(b.parts.get('rightLeg')!.rotation.x);
  });

  it('planeur : corps horizontal à hauteur du torse ; accroupi : plus bas ; flottaison animée', () => {
    const g = posed('glide');
    expect(g.root.rotation.x).toBeCloseTo(-Math.PI / 2);
    const box = new THREE.Box3().setFromObject(g.root);
    expect(box.max.y - box.min.y).toBeLessThan(0.8);
    expect(torso(g).y).toBeCloseTo(18 * (0.9 / 16));
    const sneak = new THREE.Box3().setFromObject(posed('sneak').root);
    const stand = new THREE.Box3().setFromObject(posed('stand').root);
    expect(sneak.max.y).toBeLessThan(stand.max.y - 0.15);
    expect(sneak.min.y).toBeGreaterThan(-0.05);
    expect(posed('sneak').parts.get('body')!.rotation.x).toBeCloseTo(-0.5);
    const t1 = signature(posed('tread', 0, 0, 1));
    const t2 = signature(posed('tread', 0, 0, 1.5));
    expect(t1).not.toEqual(t2);
  });

  it('transition adoucie puis pose exacte ; retour à « stand » remet la racine', () => {
    const m = make();
    const at = (pose: HumanPose, t: number) => {
      m.root.rotation.set(0, 0.5, 0);
      applyHumanoidPose(m, pose, input(t));
    };
    at('stand', 10);
    at('swim', 10.05);
    at('swim', 10.1);
    const mid = m.root.rotation.x;
    expect(mid).toBeLessThan(-0.1);
    expect(mid).toBeGreaterThan(-Math.PI / 2 + 0.1);
    at('swim', 10.2);
    at('swim', 10.3);
    expect(signature(m)).toEqual(signature(posed('swim', 0.5, 0, 10.3)));
    for (let t = 10.35; t < 11; t += 0.05) at('stand', t);
    expect(m.root.rotation.x).toBe(0);
    expect(m.root.position.length()).toBe(0);
    expect(m.parts.get('body')!.position.y).toBe(12);
  });
});

// ------------------------------------------------------------------ HUD (DOM minimal simulé)

class FakeNode {
  parentElement: FakeEl | null = null;
  children: FakeEl[] = [];
  childNodes: FakeNode[] = [];
  text = '';
  remove(): void {
    const p = this.parentElement;
    if (!p) return;
    p.childNodes = p.childNodes.filter((c) => c !== this);
    p.children = p.children.filter((c) => c !== (this as unknown));
    this.parentElement = null;
  }
  get textContent(): string {
    return this.childNodes.length ? this.childNodes.map((c) => c.textContent).join('') : this.text;
  }
  set textContent(v: string) {
    for (const c of [...this.childNodes]) c.remove();
    this.text = v;
  }
}

class FakeEl extends FakeNode {
  style: Record<string, string> = {};
  dataset: Record<string, string> = {};
  attrs: Record<string, string> = {};
  className = '';
  width = 0;
  height = 0;
  readonly classList = {
    add: (c: string) => this.setClasses([...this.classes(), c]),
    remove: (c: string) => this.setClasses(this.classes().filter((x) => x !== c)),
    toggle: (c: string, on?: boolean) => ((on ?? !this.classes().includes(c)) ? this.classList.add(c) : this.classList.remove(c)),
    contains: (c: string) => this.classes().includes(c),
  };
  constructor(readonly tagName: string) {
    super();
  }
  private classes(): string[] {
    return this.className.split(/\s+/).filter(Boolean);
  }
  private setClasses(c: string[]): void {
    this.className = [...new Set(c)].join(' ');
  }
  setAttribute(k: string, v: string): void {
    this.attrs[k] = v;
  }
  addEventListener(): void {}
  appendChild(n: FakeNode): FakeNode {
    n.remove();
    n.parentElement = this;
    this.childNodes.push(n);
    if (n instanceof FakeEl) this.children.push(n);
    return n;
  }
  get firstChild(): FakeNode | null {
    return this.childNodes[0] ?? null;
  }
  querySelectorAll(sel: string): FakeEl[] {
    const wanted = sel.split(',').map((s) => s.trim().replace(/^\./, ''));
    const out: FakeEl[] = [];
    const walk = (e: FakeEl) => {
      for (const c of e.children) {
        if (wanted.some((w) => c.classList.contains(w))) out.push(c);
        walk(c);
      }
    };
    walk(this);
    return out;
  }
  getContext() {
    return { createImageData: (w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData: () => undefined };
  }
  toDataURL(): string {
    return 'data:image/png;base64,';
  }
}

describe('HUD', () => {
  const g = globalThis as Record<string, unknown>;
  const saved = { document: g.document, Node: g.Node };
  beforeAll(() => {
    g.Node = FakeNode;
    g.document = { createElement: (t: string) => new FakeEl(t), createTextNode: (s: string) => Object.assign(new FakeNode(), { text: s }) };
  });
  afterAll(() => {
    g.document = saved.document;
    g.Node = saved.Node;
  });

  async function makeHud() {
    const { Hud } = await import('../src/ui/Hud');
    const icons = { get: () => '' };
    const cb = { selectSlot: () => undefined, openInventory: () => undefined, dropSlot: () => undefined, pause: () => undefined, chat: () => undefined, perspective: () => undefined };
    const hud = new Hud(icons as never, cb, false);
    const opts = { survival: true, showCoords: false, debug: null, underwater: false, portal: 0, portalColor: '', iconsVersion: 0 };
    const bubbleRow = (hud as unknown as { bubbleRow: FakeEl }).bubbleRow;
    const heldName = (hud as unknown as { heldName: FakeEl }).heldName;
    const effectsEl = (hud as unknown as { effectsEl: FakeEl }).effectsEl;
    return { hud, opts, bubbleRow, heldName, effectsEl };
  }

  it('la rangée de bulles disparaît quand l’air remonte à 300 (même nombre de bulles)', async () => {
    const { hud, opts, bubbleRow } = await makeHud();
    const p = new Player();
    hud.update(p, 0.05, opts);
    expect(bubbleRow.style.display).toBe('none');
    p.air = 280;
    hud.update(p, 0.05, opts);
    expect(bubbleRow.style.display).toBe('flex');
    p.air = 295;
    hud.update(p, 0.05, opts);
    expect(bubbleRow.style.display).toBe('flex');
    p.air = 300;
    hud.update(p, 0.05, opts);
    expect(bubbleRow.style.display).toBe('none');
    p.air = 299;
    hud.update(p, 0.05, opts);
    expect(bubbleRow.style.display).toBe('flex');
  });

  it('le nom de l’objet tenu suit l’objet, même sans changer de case', async () => {
    const { hud, opts, heldName } = await makeHud();
    const p = new Player();
    hud.update(p, 0.05, opts);
    expect(heldName.textContent).toBe('');
    p.inventory.set(0, st('apple'));
    hud.update(p, 0.05, opts);
    expect(heldName.textContent).not.toBe('');
    expect(Number(heldName.style.opacity)).toBeGreaterThan(0);
    p.inventory.set(0, null);
    hud.update(p, 0.05, opts);
    expect(heldName.textContent).toBe('');
  });

  it('la liste des effets n’est reconstruite que si elle change', async () => {
    const { hud, opts, effectsEl } = await makeHud();
    const p = new Player();
    p.addEffect('speed', 10);
    p.addEffect('night_vision', 10);
    hud.update(p, 0.05, opts);
    const first = effectsEl.children[0];
    expect(effectsEl.children.length).toBe(2);
    hud.update(p, 0.05, opts);
    expect(effectsEl.children[0]).toBe(first);
    p.effects.delete('speed');
    hud.update(p, 0.05, opts);
    expect(effectsEl.children.length).toBe(1);
  });
});
