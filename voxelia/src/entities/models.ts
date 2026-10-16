/**
 * Modèles et peaux originales de toutes les créatures (dessinées en code).
 * Les UV sont attribués automatiquement par un petit empaqueteur.
 */
import type { ModelDef, PartDef, Skin } from './BoxModel';
import { shade } from './BoxModel';

type PartSpec = Omit<PartDef, 'uv'>;
type FaceFn = (name: string) => ReturnType<Skin['faces']>;

/** Construit un ModelDef en plaçant les boîtes dans la texture. */
function model(texW: number, parts: PartSpec[], paint: (s: Skin, f: FaceFn, uv: (n: string) => [number, number]) => void, opts: Partial<ModelDef> = {}): ModelDef {
  const placed: PartDef[] = [];
  let x = 0;
  let y = 0;
  let rowH = 0;
  for (const p of parts) {
    const [w, h, d] = p.size;
    const bw = 2 * (w + d);
    const bh = d + h;
    if (x + bw > texW) {
      x = 0;
      y += rowH;
      rowH = 0;
    }
    placed.push({ ...p, uv: [x, y] });
    x += bw;
    rowH = Math.max(rowH, bh);
  }
  let texH = 16;
  while (texH < y + rowH) texH *= 2;
  const uvOf = (n: string): [number, number] => placed.find((p) => p.name === n)!.uv;
  return {
    texW,
    texH,
    parts: placed,
    paint: (s) => {
      const f: FaceFn = (n) => {
        const p = placed.find((q) => q.name === n)!;
        return s.faces(p.uv[0], p.uv[1], p.size[0], p.size[1], p.size[2]);
      };
      paint(s, f, uvOf);
    },
    ...opts,
  };
}

/** Peint une boîte entière d'une couleur avec une variante pour certaines faces. */
function paintPart(s: Skin, f: FaceFn, name: string, c: number, noise = 0.06, per: Partial<Record<'top' | 'bottom' | 'right' | 'front' | 'left' | 'back', number>> = {}): ReturnType<Skin['faces']> {
  const r = f(name);
  for (const k of Object.keys(r) as Array<keyof typeof r>) {
    const [x, y, w, h] = r[k];
    s.rect(x, y, w, h, per[k] ?? c, noise);
  }
  return r;
}

/** Yeux simples sur une face avant. */
function eyes(s: Skin, face: [number, number, number, number], row: number, white: number, pupil: number, inset = 1, size = 2): void {
  const [x, y, w] = face;
  s.rect(x + inset, y + row, size, 1, white);
  s.rect(x + w - inset - size, y + row, size, 1, white);
  s.px(x + inset + (size > 1 ? 1 : 0), y + row, pupil);
  s.px(x + w - inset - size, y + row, pupil);
}

// ------------------------------------------------------------------ humanoïdes
interface HumanColors {
  skin: number;
  hair: number;
  shirt: number;
  shirt2?: number;
  pants: number;
  shoes: number;
  eyes?: number;
  slim?: boolean;
  beard?: number;
  hat?: number;
  extra?: (s: Skin, f: FaceFn) => void;
}

function humanoidParts(slim = false, armForward = false): PartSpec[] {
  const aw = slim ? 3 : 4;
  return [
    { name: 'body', size: [8, 12, 4], pivot: [0, 12, 0], offset: [-4, 0, -2] },
    { name: 'head', parent: 'body', size: [8, 8, 8], pivot: [0, 12, 0], offset: [-4, 0, -4] },
    { name: 'rightArm', parent: 'body', size: [aw, 12, 4], pivot: [4 + aw / 2, 10, 0], offset: [-aw / 2, -10, -2], rot: armForward ? [Math.PI / 2, 0, 0] : undefined },
    { name: 'leftArm', parent: 'body', size: [aw, 12, 4], pivot: [-4 - aw / 2, 10, 0], offset: [-aw / 2, -10, -2], rot: armForward ? [Math.PI / 2, 0, 0] : undefined },
    { name: 'rightLeg', size: [4, 12, 4], pivot: [2, 12, 0], offset: [-2, -12, -2] },
    { name: 'leftLeg', size: [4, 12, 4], pivot: [-2, 12, 0], offset: [-2, -12, -2] },
  ];
}

function paintHumanoid(s: Skin, f: FaceFn, c: HumanColors): void {
  const head = paintPart(s, f, 'head', c.skin, 0.04, { top: c.hair, back: c.hair });
  // cheveux : côtés et haut du front
  for (const k of ['left', 'right'] as const) {
    const [x, y, w] = head[k];
    s.rect(x, y, w, 3, c.hair, 0.08);
  }
  const [fx, fy, fw] = head.front;
  s.rect(fx, fy, fw, 2, c.hair, 0.08);
  eyes(s, head.front, 4, 0xffffff, c.eyes ?? 0x3a6a3a, 1, 2);
  s.rect(fx + 3, fy + 6, 2, 1, shade(c.skin, 0.75));
  if (c.beard !== undefined) s.rect(fx + 1, fy + 6, fw - 2, 2, c.beard, 0.08);
  const body = paintPart(s, f, 'body', c.shirt, 0.05);
  if (c.shirt2 !== undefined) {
    const [bx, by, bw] = body.front;
    s.rect(bx + 3, by, 2, 12, c.shirt2, 0.05);
  }
  for (const arm of ['rightArm', 'leftArm']) {
    const a = paintPart(s, f, arm, c.shirt, 0.05);
    for (const k of ['front', 'back', 'left', 'right'] as const) {
      const [x, y, w, h] = a[k];
      s.rect(x, y + 5, w, h - 5, c.skin, 0.04);
    }
    s.rect(a.bottom[0], a.bottom[1], a.bottom[2], a.bottom[3], c.skin);
  }
  for (const leg of ['rightLeg', 'leftLeg']) {
    const l = paintPart(s, f, leg, c.pants, 0.05);
    for (const k of ['front', 'back', 'left', 'right'] as const) {
      const [x, y, w, h] = l[k];
      s.rect(x, y + h - 2, w, 2, c.shoes, 0.05);
    }
  }
  c.extra?.(s, f);
}

function humanoid(c: HumanColors, armForward = false, scale = 0.94): ModelDef {
  return model(64, humanoidParts(c.slim, armForward), (s, f) => paintHumanoid(s, f, c), { scale });
}

// ------------------------------------------------------------------ quadrupèdes
interface QuadOpts {
  body: [number, number, number];
  leg: [number, number, number];
  head: [number, number, number];
  headY?: number;
  neck?: [number, number, number];
  tail?: [number, number, number];
  extras?: PartSpec[];
}

function quadParts(o: QuadOpts): PartSpec[] {
  const [bw, bh, bl] = o.body;
  const [lw, lh, ld] = o.leg;
  const [hw, hh, hd] = o.head;
  const legX = bw / 2 - lw / 2;
  const legZ = bl / 2 - ld / 2 - 1;
  const parts: PartSpec[] = [
    { name: 'body', size: o.body, pivot: [0, lh, 0], offset: [-bw / 2, 0, -bl / 2] },
    { name: 'leg0', size: o.leg, pivot: [legX, lh, -legZ], offset: [-lw / 2, -lh, -ld / 2] },
    { name: 'leg1', size: o.leg, pivot: [-legX, lh, -legZ], offset: [-lw / 2, -lh, -ld / 2] },
    { name: 'leg2', size: o.leg, pivot: [legX, lh, legZ], offset: [-lw / 2, -lh, -ld / 2] },
    { name: 'leg3', size: o.leg, pivot: [-legX, lh, legZ], offset: [-lw / 2, -lh, -ld / 2] },
  ];
  if (o.neck) {
    const [nw, nh, nd] = o.neck;
    parts.push({ name: 'neck', parent: 'body', size: o.neck, pivot: [0, bh - 2, -bl / 2 + nd / 2], offset: [-nw / 2, 0, -nd / 2], rot: [0.5, 0, 0] });
    parts.push({ name: 'head', parent: 'neck', size: o.head, pivot: [0, nh, 0], offset: [-hw / 2, -2, -hd + nd / 2] });
  } else parts.push({ name: 'head', parent: 'body', size: o.head, pivot: [0, o.headY ?? bh - 2, -bl / 2], offset: [-hw / 2, -hh / 2, -hd] });
  if (o.tail) {
    const [tw, th, td] = o.tail;
    parts.push({ name: 'tail', parent: 'body', size: o.tail, pivot: [0, bh - 1, bl / 2], offset: [-tw / 2, -th, 0], rot: [0.4, 0, 0] });
    void td;
  }
  if (o.extras) parts.push(...o.extras);
  return parts;
}

function quad(o: QuadOpts, paint: (s: Skin, f: FaceFn) => void, scale = 1): ModelDef {
  return model(64, quadParts(o), paint, { scale });
}

// ------------------------------------------------------------------ définitions
export const MODELS: Record<string, ModelDef> = {};

// Peaux du joueur (vestiaire) — personnages originaux
export const PLAYER_SKINS: Record<string, { name: string; colors: HumanColors }> = {
  explorer: { name: 'Explorateur', colors: { skin: 0xd8a27a, hair: 0x5a3a1e, shirt: 0x3c8a5a, shirt2: 0x2f6e46, pants: 0x6a4a2e, shoes: 0x3a2a1a, eyes: 0x2a4a8a } },
  explorer_f: { name: 'Exploratrice', colors: { skin: 0xe8b896, hair: 0xd08a3a, shirt: 0xc8503a, shirt2: 0xa83a2a, pants: 0x3a4a7a, shoes: 0x2a2a2a, eyes: 0x3a7a3a, slim: true } },
  miner: { name: 'Mineur', colors: { skin: 0xc68a62, hair: 0x2a2a2a, shirt: 0x8a6a2a, pants: 0x4a4a52, shoes: 0x2a2a2a, beard: 0x2a2a2a, eyes: 0x4a3a2a, hat: 0xe8c030 } },
  knight: { name: 'Chevalier', colors: { skin: 0xd8a27a, hair: 0x8a8a8a, shirt: 0xa8acb2, shirt2: 0x2a4ab0, pants: 0x8a8e94, shoes: 0x5a5e64, eyes: 0x2a2a6a } },
  mage: { name: 'Mage', colors: { skin: 0xe0b090, hair: 0xe8e8e8, shirt: 0x4a2a8a, shirt2: 0xe8c040, pants: 0x3a1e6a, shoes: 0x2a1a3a, beard: 0xe8e8e8, eyes: 0x6a3ab0 } },
  robot: { name: 'Automate', colors: { skin: 0x9aa4ae, hair: 0x5a6470, shirt: 0x6a7480, shirt2: 0x3ad6c0, pants: 0x4a525c, shoes: 0x2a3038, eyes: 0x3ad6c0 } },
};
for (const [k, v] of Object.entries(PLAYER_SKINS)) MODELS['player_' + k] = humanoid(v.colors, false, 0.9);

MODELS.zombie = humanoid({ skin: 0x6a9a5a, hair: 0x3a4a2a, shirt: 0x5a4a6a, pants: 0x4a3a2a, shoes: 0x2a2a2a, eyes: 0x1a1a1a, extra: (s, f) => s.spots(f('body').front, 0x3a2a3a, 3, 1) }, true);
MODELS.husk = humanoid({ skin: 0xb0a070, hair: 0x7a6a40, shirt: 0x8a7a4a, pants: 0x6a5a3a, shoes: 0x4a3a2a, eyes: 0x1a1a1a }, true);
function villagerModel(hat: number, robe: number, skin = 0xc89a7a): ModelDef {
  return model(
    64,
    [
      { name: 'body', size: [8, 14, 6], pivot: [0, 10, 0], offset: [-4, 0, -3] },
      { name: 'head', parent: 'body', size: [8, 9, 8], pivot: [0, 14, 0], offset: [-4, 0, -4] },
      { name: 'hat', parent: 'head', size: [10, 2, 10], pivot: [0, 8, 0], offset: [-5, 0, -5] },
      { name: 'hatTop', parent: 'head', size: [6, 3, 6], pivot: [0, 10, 0], offset: [-3, 0, -3] },
      { name: 'rightArm', parent: 'body', size: [3, 11, 3], pivot: [5.5, 12, 0], offset: [-1.5, -10, -1.5] },
      { name: 'leftArm', parent: 'body', size: [3, 11, 3], pivot: [-5.5, 12, 0], offset: [-1.5, -10, -1.5] },
      { name: 'rightLeg', size: [4, 10, 4], pivot: [2, 10, 0], offset: [-2, -10, -2] },
      { name: 'leftLeg', size: [4, 10, 4], pivot: [-2, 10, 0], offset: [-2, -10, -2] },
    ],
    (s, f) => {
      const head = paintPart(s, f, 'head', skin, 0.04, { top: 0x5a3a2a, back: 0x5a3a2a });
      eyes(s, head.front, 4, 0xffffff, 0x2a5a2a, 1, 2);
      s.rect(head.front[0] + 2, head.front[1] + 7, 4, 1, shade(skin, 0.7));
      s.rect(head.front[0], head.front[1], 8, 2, 0x5a3a2a);
      const body = paintPart(s, f, 'body', robe, 0.06);
      s.rect(body.front[0], body.front[1] + 6, 8, 1, shade(robe, 0.6));
      s.rect(body.front[0] + 3, body.front[1], 2, 6, shade(robe, 1.25));
      paintPart(s, f, 'hat', hat, 0.06);
      paintPart(s, f, 'hatTop', hat, 0.06);
      for (const a of ['rightArm', 'leftArm']) {
        const r = paintPart(s, f, a, robe, 0.06);
        for (const k of ['front', 'back', 'left', 'right'] as const) s.rect(r[k][0], r[k][1] + r[k][3] - 2, r[k][2], 2, skin);
      }
      paintPart(s, f, 'rightLeg', 0x4a3a2a);
      paintPart(s, f, 'leftLeg', 0x4a3a2a);
    },
    { scale: 0.95 },
  );
}
MODELS.villager = villagerModel(0xb08a50, 0x8a6a4a);
const PROF_COLORS: Record<string, [number, number]> = {
  farmer: [0xc8a050, 0x7a6a3a],
  librarian: [0xe8e8e0, 0x4a5a8a],
  smith: [0x3a3a3a, 0x5a4a4a],
  butcher: [0xe8e8e8, 0x8a3a3a],
  cartographer: [0x3a6a3a, 0x3a5a6a],
  cleric: [0x6a2a8a, 0x5a2a6a],
  fisherman: [0xd8c870, 0x3a6a8a],
};
for (const [k, [hat, robe]] of Object.entries(PROF_COLORS)) MODELS['villager_' + k] = villagerModel(hat, robe);
MODELS.village_guard = humanoid({ skin: 0xd0a080, hair: 0xa8acb2, shirt: 0xb8bcc2, shirt2: 0x3a8a3a, pants: 0x9a9ea4, shoes: 0x6a6e74, eyes: 0x2a2a2a, beard: 0x8a6a4a }, false, 1.05);
MODELS.witch = humanoid({
  skin: 0x9ab07a,
  hair: 0x2a1a2a,
  shirt: 0x4a2a5a,
  pants: 0x3a1e4a,
  shoes: 0x1a1a1a,
  eyes: 0xc02020,
  extra: (s, f) => s.spots(f('body').front, 0x6a3a8a, 2, 1),
});
MODELS.skeleton = model(
  64,
  [
    { name: 'body', size: [8, 12, 4], pivot: [0, 12, 0], offset: [-4, 0, -2] },
    { name: 'head', parent: 'body', size: [8, 8, 8], pivot: [0, 12, 0], offset: [-4, 0, -4] },
    { name: 'rightArm', parent: 'body', size: [2, 12, 2], pivot: [5, 10, 0], offset: [-1, -10, -1] },
    { name: 'leftArm', parent: 'body', size: [2, 12, 2], pivot: [-5, 10, 0], offset: [-1, -10, -1] },
    { name: 'rightLeg', size: [2, 12, 2], pivot: [2, 12, 0], offset: [-1, -12, -1] },
    { name: 'leftLeg', size: [2, 12, 2], pivot: [-2, 12, 0], offset: [-1, -12, -1] },
  ],
  (s, f) => {
    const head = paintPart(s, f, 'head', 0xd8d8d0, 0.05);
    const [x, y] = head.front;
    s.rect(x + 1, y + 3, 2, 2, 0x1a1a1a);
    s.rect(x + 5, y + 3, 2, 2, 0x1a1a1a);
    s.rect(x + 3, y + 5, 2, 1, 0x3a3a3a);
    s.rect(x + 2, y + 6, 4, 1, 0x3a3a3a);
    const body = paintPart(s, f, 'body', 0xd0d0c8);
    for (const k of ['front', 'back'] as const) {
      const [bx, by, bw, bh] = body[k];
      s.rect(bx, by, bw, bh, 0x2a2a2a, 0, 0.0);
      for (let r = 1; r < bh; r += 3) s.rect(bx + 1, by + r, bw - 2, 1, 0x3a3a3a);
    }
    for (const p of ['rightArm', 'leftArm', 'rightLeg', 'leftLeg']) paintPart(s, f, p, 0xd8d8d0);
  },
  { scale: 0.94 },
);
MODELS.stray = MODELS.skeleton;

MODELS.cow = quad({ body: [12, 10, 18], leg: [4, 12, 4], head: [8, 8, 6], headY: 10 }, (s, f) => {
  const body = paintPart(s, f, 'body', 0xf0ece4, 0.04);
  for (const k of Object.keys(body) as Array<keyof typeof body>) s.spots(body[k], 0x2a2420, 3, 2.2);
  const head = paintPart(s, f, 'head', 0x3a302a, 0.05);
  s.rect(head.front[0] + 1, head.front[1] + 5, 6, 3, 0xd8a0a0);
  eyes(s, head.front, 2, 0xffffff, 0x1a1a1a, 0, 2);
  for (let i = 0; i < 4; i++) {
    const l = paintPart(s, f, 'leg' + i, 0xf0ece4);
    for (const k of ['front', 'back', 'left', 'right'] as const) s.rect(l[k][0], l[k][1] + 9, l[k][2], 3, 0x3a302a);
  }
});
MODELS.mooshroom = quad({ body: [12, 10, 18], leg: [4, 12, 4], head: [8, 8, 6], headY: 10 }, (s, f) => {
  const body = paintPart(s, f, 'body', 0xa8282a, 0.05);
  s.spots(body.top, 0xe8e0d8, 6, 1.6);
  for (const k of ['left', 'right'] as const) s.spots(body[k], 0xe8e0d8, 2, 1.5);
  const head = paintPart(s, f, 'head', 0xa8282a, 0.05);
  s.rect(head.front[0] + 1, head.front[1] + 5, 6, 3, 0xe0b0b0);
  eyes(s, head.front, 2, 0xffffff, 0x1a1a1a, 0, 2);
  for (let i = 0; i < 4; i++) paintPart(s, f, 'leg' + i, 0xb83a3a);
});
MODELS.pig = quad({ body: [10, 8, 16], leg: [4, 6, 4], head: [8, 8, 8], headY: 6, extras: [{ name: 'snout', parent: 'head', size: [4, 3, 1], pivot: [0, -1, -8], offset: [-2, -1, -1] }] }, (s, f) => {
  paintPart(s, f, 'body', 0xf0a5a2, 0.04);
  const head = paintPart(s, f, 'head', 0xf0a5a2, 0.04);
  eyes(s, head.front, 3, 0xffffff, 0x1a1a1a, 0, 2);
  const sn = paintPart(s, f, 'snout', 0xe88a88);
  s.px(sn.front[0] + 1, sn.front[1] + 1, 0x8a3a3a);
  s.px(sn.front[0] + 2, sn.front[1] + 1, 0x8a3a3a);
  for (let i = 0; i < 4; i++) paintPart(s, f, 'leg' + i, 0xe89a98);
});
const sheepPaint = (wool: number, face: number) => (s: Skin, f: FaceFn) => {
  paintPart(s, f, 'body', wool, 0.07);
  const head = paintPart(s, f, 'head', face, 0.05, { top: wool });
  eyes(s, head.front, 2, 0xffffff, 0x1a1a1a, 0, 2);
  for (let i = 0; i < 4; i++) {
    const l = paintPart(s, f, 'leg' + i, wool, 0.06);
    for (const k of ['front', 'back', 'left', 'right'] as const) s.rect(l[k][0], l[k][1] + 6, l[k][2], 6, face);
  }
};
MODELS.sheep = quad({ body: [10, 10, 16], leg: [4, 12, 4], head: [6, 6, 8], headY: 10 }, sheepPaint(0xeeeeee, 0xd0b8a0));
MODELS.sheep_sheared = quad({ body: [8, 8, 14], leg: [4, 12, 4], head: [6, 6, 8], headY: 8 }, sheepPaint(0xd8c8b0, 0xd0b8a0));
MODELS.sky_sheep = quad({ body: [10, 10, 16], leg: [4, 12, 4], head: [6, 6, 8], headY: 10 }, sheepPaint(0xd4ecff, 0xf4f0ff));
MODELS.horse = quad({ body: [10, 10, 22], leg: [4, 14, 4], head: [6, 6, 11], neck: [4, 12, 6], tail: [4, 12, 3] }, (s, f) => {
  const c = 0x8a5a34;
  paintPart(s, f, 'body', c, 0.05);
  paintPart(s, f, 'neck', c, 0.05, { back: 0x3a2a1a });
  const head = paintPart(s, f, 'head', c, 0.05);
  eyes(s, head.left, 2, 0x1a1a1a, 0x1a1a1a, 2, 1);
  eyes(s, head.right, 2, 0x1a1a1a, 0x1a1a1a, 2, 1);
  paintPart(s, f, 'tail', 0x3a2a1a, 0.1);
  for (let i = 0; i < 4; i++) {
    const l = paintPart(s, f, 'leg' + i, c);
    for (const k of ['front', 'back', 'left', 'right'] as const) s.rect(l[k][0], l[k][1] + 11, l[k][2], 3, 0xe8e0d0);
  }
});
const deerPaint = (c: number, belly: number, antler: number, antlerCount = 4) => (s: Skin, f: FaceFn) => {
  paintPart(s, f, 'body', c, 0.05, { bottom: belly });
  paintPart(s, f, 'neck', c, 0.05);
  const head = paintPart(s, f, 'head', c, 0.05);
  s.rect(head.front[0], head.front[1] + 3, head.front[2], 2, 0x2a1a10);
  eyes(s, head.left, 1, 0x1a1a1a, 0x1a1a1a, 3, 1);
  eyes(s, head.right, 1, 0x1a1a1a, 0x1a1a1a, 3, 1);
  for (let i = 0; i < antlerCount; i++) paintPart(s, f, 'antler' + i, antler, 0.05);
  paintPart(s, f, 'tail', belly);
  for (let i = 0; i < 4; i++) paintPart(s, f, 'leg' + i, shade(c, 0.85));
};
const antlers: PartSpec[] = [
  { name: 'antler0', parent: 'head', size: [1, 7, 1], pivot: [2, 4, -2], offset: [0, 0, 0], rot: [0, 0, -0.4] },
  { name: 'antler1', parent: 'head', size: [1, 7, 1], pivot: [-2, 4, -2], offset: [-1, 0, 0], rot: [0, 0, 0.4] },
  { name: 'antler2', parent: 'antler0', size: [4, 1, 1], pivot: [0, 4, 0], offset: [0, 0, 0] },
  { name: 'antler3', parent: 'antler1', size: [4, 1, 1], pivot: [0, 4, 0], offset: [-4, 0, 0] },
];
MODELS.deer = quad({ body: [8, 9, 18], leg: [3, 14, 3], head: [5, 5, 8], neck: [4, 9, 4], tail: [3, 4, 2], extras: antlers }, deerPaint(0x9a6a40, 0xe8dcc8, 0xd8c8a0));
MODELS.golden_stag = quad({ body: [8, 9, 18], leg: [3, 14, 3], head: [5, 5, 8], neck: [4, 9, 4], tail: [3, 4, 2], extras: antlers }, deerPaint(0xe8c040, 0xfff0b0, 0xffffff), 1.1);
MODELS.goat = quad({ body: [8, 9, 14], leg: [3, 10, 3], head: [5, 6, 7], neck: [4, 6, 4], tail: [2, 3, 2], extras: antlers.slice(0, 2) }, deerPaint(0xe8e4dc, 0xd8d0c4, 0x8a8a7a, 2));
MODELS.fox = quad({ body: [6, 6, 12], leg: [2, 6, 2], head: [7, 6, 6], headY: 5, tail: [4, 4, 9], extras: [
  { name: 'ear0', parent: 'head', size: [2, 2, 1], pivot: [2, 3, -2], offset: [-1, 0, 0] },
  { name: 'ear1', parent: 'head', size: [2, 2, 1], pivot: [-2, 3, -2], offset: [-1, 0, 0] },
] }, (s, f) => {
  paintPart(s, f, 'body', 0xd8782a, 0.05, { bottom: 0xf0e8e0 });
  const head = paintPart(s, f, 'head', 0xd8782a, 0.05);
  s.rect(head.front[0], head.front[1] + 3, head.front[2], 3, 0xf0e8e0);
  s.px(head.front[0] + 3, head.front[1] + 4, 0x1a1a1a);
  eyes(s, head.front, 2, 0x1a1a1a, 0x1a1a1a, 1, 1);
  const t = paintPart(s, f, 'tail', 0xd8782a, 0.05);
  for (const k of ['front', 'back', 'left', 'right'] as const) s.rect(t[k][0], t[k][1] + t[k][3] - 3, t[k][2], 3, 0xf0e8e0);
  paintPart(s, f, 'ear0', 0x2a1a10);
  paintPart(s, f, 'ear1', 0x2a1a10);
  for (let i = 0; i < 4; i++) paintPart(s, f, 'leg' + i, 0x3a2a1a);
}, 1);
MODELS.rabbit = quad({ body: [5, 5, 8], leg: [2, 3, 3], head: [5, 4, 5], headY: 4, extras: [
  { name: 'ear0', parent: 'head', size: [1, 5, 2], pivot: [1.5, 2, -2], offset: [-0.5, 0, -1] },
  { name: 'ear1', parent: 'head', size: [1, 5, 2], pivot: [-1.5, 2, -2], offset: [-0.5, 0, -1] },
] }, (s, f) => {
  paintPart(s, f, 'body', 0x9a6a4a, 0.08);
  const head = paintPart(s, f, 'head', 0x9a6a4a, 0.06);
  eyes(s, head.front, 1, 0x1a1a1a, 0x1a1a1a, 0, 1);
  s.px(head.front[0] + 2, head.front[1] + 2, 0xe0a0a0);
  paintPart(s, f, 'ear0', 0x9a6a4a);
  paintPart(s, f, 'ear1', 0x9a6a4a);
  for (let i = 0; i < 4; i++) paintPart(s, f, 'leg' + i, 0x8a5a3a);
});
MODELS.chicken = model(
  64,
  [
    { name: 'body', size: [6, 6, 8], pivot: [0, 5, 0], offset: [-3, 0, -4] },
    { name: 'head', parent: 'body', size: [4, 6, 3], pivot: [0, 4, -4], offset: [-2, 0, -2] },
    { name: 'beak', parent: 'head', size: [4, 2, 2], pivot: [0, 3, -2], offset: [-2, 0, -2] },
    { name: 'wattle', parent: 'head', size: [2, 2, 2], pivot: [0, 1, -2], offset: [-1, 0, -1] },
    { name: 'wing0', parent: 'body', size: [1, 4, 6], pivot: [3, 5, 0], offset: [0, -4, -3] },
    { name: 'wing1', parent: 'body', size: [1, 4, 6], pivot: [-3, 5, 0], offset: [-1, -4, -3] },
    { name: 'leg0', size: [1, 5, 1], pivot: [1.5, 5, 1], offset: [-0.5, -5, -0.5] },
    { name: 'leg1', size: [1, 5, 1], pivot: [-1.5, 5, 1], offset: [-0.5, -5, -0.5] },
  ],
  (s, f) => {
    paintPart(s, f, 'body', 0xf4f4f4, 0.04);
    const head = paintPart(s, f, 'head', 0xf4f4f4, 0.04);
    eyes(s, head.front, 1, 0x1a1a1a, 0x1a1a1a, 0, 1);
    paintPart(s, f, 'beak', 0xf0c030);
    paintPart(s, f, 'wattle', 0xe02020);
    paintPart(s, f, 'wing0', 0xe8e8e8);
    paintPart(s, f, 'wing1', 0xe8e8e8);
    paintPart(s, f, 'leg0', 0xf0c030);
    paintPart(s, f, 'leg1', 0xf0c030);
  },
);
MODELS.parrot = model(64, MODELS.chicken.parts.map(({ uv: _uv, ...p }) => p), (s, f) => {
  paintPart(s, f, 'body', 0xd02a2a, 0.06);
  const head = paintPart(s, f, 'head', 0xd02a2a, 0.05);
  eyes(s, head.front, 1, 0xffffff, 0x1a1a1a, 0, 1);
  paintPart(s, f, 'beak', 0x3a3a3a);
  paintPart(s, f, 'wattle', 0xf0d030);
  paintPart(s, f, 'wing0', 0x2a6ad0);
  paintPart(s, f, 'wing1', 0x2a6ad0);
  paintPart(s, f, 'leg0', 0x5a5a5a);
  paintPart(s, f, 'leg1', 0x5a5a5a);
});
const fishModel = (c: number, c2: number, sz = 1) =>
  model(
    32,
    [
      { name: 'body', size: [2, 4, 8], pivot: [0, 0, 0], offset: [-1, 0, -4] },
      { name: 'tail', parent: 'body', size: [1, 4, 4], pivot: [0, 0, 4], offset: [-0.5, 0, 0] },
      { name: 'fin', parent: 'body', size: [1, 2, 3], pivot: [0, 4, 0], offset: [-0.5, 0, -1] },
    ],
    (s, f) => {
      const b = paintPart(s, f, 'body', c, 0.08, { bottom: c2 });
      eyes(s, b.left, 1, 0x1a1a1a, 0x1a1a1a, 1, 1);
      eyes(s, b.right, 1, 0x1a1a1a, 0x1a1a1a, 1, 1);
      paintPart(s, f, 'tail', c2);
      paintPart(s, f, 'fin', c2);
    },
    { scale: sz },
  );
MODELS.cod = fishModel(0xb8a080, 0x8a7a5a);
MODELS.salmon = fishModel(0xb0503a, 0x7a3a2a, 1.3);
MODELS.tropical_fish = fishModel(0xf08a20, 0xffffff, 0.8);
MODELS.dolphin = model(
  64,
  [
    { name: 'body', size: [8, 7, 14], pivot: [0, 0, 0], offset: [-4, 0, -7] },
    { name: 'head', parent: 'body', size: [6, 6, 6], pivot: [0, 1, -7], offset: [-3, 0, -6] },
    { name: 'snout', parent: 'head', size: [2, 2, 4], pivot: [0, 0, -6], offset: [-1, 0, -4] },
    { name: 'fin', parent: 'body', size: [1, 4, 4], pivot: [0, 7, 0], offset: [-0.5, 0, -2], rot: [-0.4, 0, 0] },
    { name: 'tail', parent: 'body', size: [4, 3, 10], pivot: [0, 2, 7], offset: [-2, 0, 0] },
    { name: 'fluke', parent: 'tail', size: [10, 1, 4], pivot: [0, 1, 9], offset: [-5, 0, 0] },
  ],
  (s, f) => {
    paintPart(s, f, 'body', 0x6a7a8a, 0.04, { bottom: 0xd8dce0 });
    const head = paintPart(s, f, 'head', 0x6a7a8a, 0.04, { bottom: 0xd8dce0 });
    eyes(s, head.left, 2, 0x1a1a1a, 0x1a1a1a, 2, 1);
    eyes(s, head.right, 2, 0x1a1a1a, 0x1a1a1a, 2, 1);
    paintPart(s, f, 'snout', 0x7a8a9a);
    paintPart(s, f, 'fin', 0x5a6a7a);
    paintPart(s, f, 'tail', 0x6a7a8a);
    paintPart(s, f, 'fluke', 0x5a6a7a);
  },
);
MODELS.squid = model(
  64,
  [
    { name: 'body', size: [10, 14, 10], pivot: [0, 6, 0], offset: [-5, 0, -5] },
    ...[0, 1, 2, 3, 4, 5].map((i) => ({ name: 'arm' + i, parent: 'body', size: [2, 12, 2] as [number, number, number], pivot: [Math.cos((i / 6) * Math.PI * 2) * 3.5, 0, Math.sin((i / 6) * Math.PI * 2) * 3.5] as [number, number, number], offset: [-1, -12, -1] as [number, number, number] })),
  ],
  (s, f) => {
    const b = paintPart(s, f, 'body', 0x2a3a6a, 0.08);
    eyes(s, b.front, 6, 0xffffff, 0x1a1a1a, 1, 2);
    for (let i = 0; i < 6; i++) paintPart(s, f, 'arm' + i, 0x2a3a6a, 0.08);
  },
);
MODELS.turtle = model(
  64,
  [
    { name: 'body', size: [14, 4, 16], pivot: [0, 1, 0], offset: [-7, 0, -8] },
    { name: 'head', parent: 'body', size: [4, 4, 4], pivot: [0, 1, -8], offset: [-2, 0, -4] },
    { name: 'leg0', parent: 'body', size: [6, 1, 3], pivot: [7, 0, -5], offset: [0, 0, -1.5] },
    { name: 'leg1', parent: 'body', size: [6, 1, 3], pivot: [-7, 0, -5], offset: [-6, 0, -1.5] },
    { name: 'leg2', parent: 'body', size: [4, 1, 3], pivot: [6, 0, 6], offset: [0, 0, -1.5] },
    { name: 'leg3', parent: 'body', size: [4, 1, 3], pivot: [-6, 0, 6], offset: [-4, 0, -1.5] },
  ],
  (s, f) => {
    const b = paintPart(s, f, 'body', 0x3a7a3a, 0.08, { bottom: 0xd8d0a0 });
    s.spots(b.top, 0x2a5a2a, 6, 1.5);
    const head = paintPart(s, f, 'head', 0x7ab05a, 0.05);
    eyes(s, head.front, 1, 0x1a1a1a, 0x1a1a1a, 0, 1);
    for (let i = 0; i < 4; i++) paintPart(s, f, 'leg' + i, 0x7ab05a);
  },
);
MODELS.frog = model(
  32,
  [
    { name: 'body', size: [6, 4, 7], pivot: [0, 1, 0], offset: [-3, 0, -3.5] },
    { name: 'head', parent: 'body', size: [6, 2, 5], pivot: [0, 4, -2], offset: [-3, 0, -3] },
    { name: 'leg0', size: [2, 2, 3], pivot: [3, 2, 2], offset: [0, -2, -1] },
    { name: 'leg1', size: [2, 2, 3], pivot: [-3, 2, 2], offset: [-2, -2, -1] },
  ],
  (s, f) => {
    paintPart(s, f, 'body', 0x5a9a3a, 0.08, { bottom: 0xd8e0a0 });
    const h = paintPart(s, f, 'head', 0x5a9a3a, 0.06);
    s.px(h.top[0] + 1, h.top[1] + 1, 0x1a1a1a);
    s.px(h.top[0] + 4, h.top[1] + 1, 0x1a1a1a);
    paintPart(s, f, 'leg0', 0x4a8a2a);
    paintPart(s, f, 'leg1', 0x4a8a2a);
  },
);

// ------------------------------------------------------------------ hostiles
MODELS.spider = model(
  64,
  [
    { name: 'body', size: [10, 8, 12], pivot: [0, 5, 3], offset: [-5, 0, 0] },
    { name: 'neck', size: [6, 6, 6], pivot: [0, 5, 0], offset: [-3, 0, -3] },
    { name: 'head', size: [8, 8, 8], pivot: [0, 5, -3], offset: [-4, 0, -8] },
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
      const side = i % 2 === 0 ? 1 : -1;
      const row = Math.floor(i / 2);
      return { name: 'leg' + i, size: [14, 2, 2] as [number, number, number], pivot: [side * 3, 8, -1 + row * 1.5] as [number, number, number], offset: [side > 0 ? 0 : -14, -1, -1] as [number, number, number], rot: [0, (row - 1.5) * 0.35 * side, side * 0.6] as [number, number, number] };
    }),
  ],
  (s, f) => {
    paintPart(s, f, 'body', 0x3a302a, 0.1);
    paintPart(s, f, 'neck', 0x2a2420, 0.08);
    const h = paintPart(s, f, 'head', 0x2a2420, 0.08);
    const [x, y] = h.front;
    for (const [ex, ey] of [[1, 3], [6, 3], [2, 2], [5, 2], [3, 4], [4, 4]]) s.px(x + ex, y + ey, 0xe02020);
    for (let i = 0; i < 8; i++) paintPart(s, f, 'leg' + i, 0x2a2420, 0.08);
  },
  { scale: 1 },
);
MODELS.cave_crawler = model(
  64,
  [
    { name: 'body', size: [6, 5, 16], pivot: [0, 4, 0], offset: [-3, 0, -8] },
    { name: 'head', parent: 'body', size: [6, 4, 6], pivot: [0, 1, -8], offset: [-3, 0, -6] },
    { name: 'tail', parent: 'body', size: [3, 3, 10], pivot: [0, 2, 8], offset: [-1.5, 0, 0] },
    ...[0, 1, 2, 3, 4, 5].map((i) => {
      const side = i % 2 === 0 ? 1 : -1;
      return { name: 'leg' + i, size: [2, 5, 2] as [number, number, number], pivot: [side * 3.5, 4, -5 + Math.floor(i / 2) * 5] as [number, number, number], offset: [-1, -5, -1] as [number, number, number], rot: [0, 0, side * 0.5] as [number, number, number] };
    }),
  ],
  (s, f) => {
    paintPart(s, f, 'body', 0xd8d0c8, 0.08);
    const h = paintPart(s, f, 'head', 0xe0d8d0, 0.06);
    s.rect(h.front[0] + 1, h.front[1] + 2, 4, 1, 0x8a3a3a);
    paintPart(s, f, 'tail', 0xd0c8c0, 0.08);
    for (let i = 0; i < 6; i++) paintPart(s, f, 'leg' + i, 0xc8c0b8);
  },
);
MODELS.boomshroom = model(
  64,
  [
    { name: 'body', size: [6, 9, 6], pivot: [0, 4, 0], offset: [-3, 0, -3] },
    { name: 'head', parent: 'body', size: [12, 6, 12], pivot: [0, 9, 0], offset: [-6, 0, -6] },
    { name: 'leg0', size: [3, 4, 4], pivot: [1.5, 4, 0], offset: [-1, -4, -2] },
    { name: 'leg1', size: [3, 4, 4], pivot: [-1.5, 4, 0], offset: [-2, -4, -2] },
  ],
  (s, f) => {
    const b = paintPart(s, f, 'body', 0xe8dcc8, 0.05);
    const [x, y] = b.front;
    s.rect(x + 1, y + 2, 1, 2, 0x1a1a1a);
    s.rect(x + 4, y + 2, 1, 2, 0x1a1a1a);
    s.rect(x + 2, y + 5, 2, 1, 0x3a2a2a);
    const cap = paintPart(s, f, 'head', 0xd0281e, 0.06, { bottom: 0xe8d8c0 });
    for (const k of ['top', 'front', 'back', 'left', 'right'] as const) s.spots(cap[k], 0xf4ece4, k === 'top' ? 6 : 2, 1.3);
    paintPart(s, f, 'leg0', 0xd8ccb8);
    paintPart(s, f, 'leg1', 0xd8ccb8);
  },
);
MODELS.night_wraith = model(
  64,
  [
    { name: 'body', size: [10, 18, 6], pivot: [0, 2, 0], offset: [-5, 0, -3] },
    { name: 'head', parent: 'body', size: [8, 8, 8], pivot: [0, 18, 0], offset: [-4, 0, -4] },
    { name: 'rightArm', parent: 'body', size: [3, 12, 3], pivot: [6.5, 16, 0], offset: [-1.5, -12, -1.5], rot: [0.9, 0, 0] },
    { name: 'leftArm', parent: 'body', size: [3, 12, 3], pivot: [-6.5, 16, 0], offset: [-1.5, -12, -1.5], rot: [0.9, 0, 0] },
  ],
  (s, f) => {
    paintPart(s, f, 'body', 0x2a2a4a, 0.12);
    const h = paintPart(s, f, 'head', 0x1a1a2e, 0.08);
    s.rect(h.front[0] + 1, h.front[1] + 3, 2, 2, 0xa0a0ff);
    s.rect(h.front[0] + 5, h.front[1] + 3, 2, 2, 0xa0a0ff);
    paintPart(s, f, 'rightArm', 0x2a2a4a, 0.1);
    paintPart(s, f, 'leftArm', 0x2a2a4a, 0.1);
  },
  { translucent: true },
);
const slimeModel = (outer: number, inner: number, eye: number) =>
  model(
    64,
    [
      { name: 'body', size: [16, 16, 16], pivot: [0, 0, 0], offset: [-8, 0, -8] },
      { name: 'core', size: [6, 6, 6], pivot: [0, 4, 0], offset: [-3, 0, -3] },
    ],
    (s, f) => {
      const b = paintPart(s, f, 'body', outer, 0.05);
      s.rect(b.front[0] + 3, b.front[1] + 4, 3, 3, eye);
      s.rect(b.front[0] + 10, b.front[1] + 4, 3, 3, eye);
      s.rect(b.front[0] + 6, b.front[1] + 11, 4, 1, eye);
      paintPart(s, f, 'core', inner, 0.08);
    },
    { translucent: true },
  );
MODELS.slime = slimeModel(0x7acc5a, 0x4a9a3a, 0x2a5a2a);
MODELS.crystal_slime = slimeModel(0x8ad8f8, 0x4aa8e0, 0x1a5a8a);
MODELS.magma_cube = slimeModel(0x6a2a10, 0xff8a20, 0xffd040);
MODELS.ember_salamander = model(
  64,
  [
    { name: 'body', size: [6, 5, 18], pivot: [0, 4, 0], offset: [-3, 0, -9] },
    { name: 'head', parent: 'body', size: [6, 5, 6], pivot: [0, 1, -9], offset: [-3, 0, -6] },
    { name: 'tail', parent: 'body', size: [3, 3, 12], pivot: [0, 1, 9], offset: [-1.5, 0, 0] },
    { name: 'leg0', size: [3, 4, 3], pivot: [3.5, 4, -6], offset: [-1.5, -4, -1.5] },
    { name: 'leg1', size: [3, 4, 3], pivot: [-3.5, 4, -6], offset: [-1.5, -4, -1.5] },
    { name: 'leg2', size: [3, 4, 3], pivot: [3.5, 4, 6], offset: [-1.5, -4, -1.5] },
    { name: 'leg3', size: [3, 4, 3], pivot: [-3.5, 4, 6], offset: [-1.5, -4, -1.5] },
  ],
  (s, f) => {
    const b = paintPart(s, f, 'body', 0xc84a14, 0.1, { top: 0x8a2a0a });
    s.spots(b.top, 0xffc040, 5, 1);
    const h = paintPart(s, f, 'head', 0xc84a14, 0.08);
    s.px(h.left[0] + 2, h.left[1] + 1, 0xffff60);
    s.px(h.right[0] + 3, h.right[1] + 1, 0xffff60);
    paintPart(s, f, 'tail', 0xa83a10, 0.1);
    for (let i = 0; i < 4; i++) paintPart(s, f, 'leg' + i, 0x8a2a0a);
  },
  { emissive: true },
);
MODELS.fire_spirit = model(
  64,
  [
    { name: 'body', size: [8, 8, 8], pivot: [0, 8, 0], offset: [-4, 0, -4] },
    ...[0, 1, 2, 3].map((i) => ({ name: 'rod' + i, size: [2, 8, 2] as [number, number, number], pivot: [Math.cos((i * Math.PI) / 2) * 7, 6, Math.sin((i * Math.PI) / 2) * 7] as [number, number, number], offset: [-1, 0, -1] as [number, number, number] })),
  ],
  (s, f) => {
    const b = paintPart(s, f, 'body', 0xffa020, 0.12);
    s.rect(b.front[0] + 1, b.front[1] + 3, 2, 1, 0x4a1a00);
    s.rect(b.front[0] + 5, b.front[1] + 3, 2, 1, 0x4a1a00);
    for (let i = 0; i < 4; i++) paintPart(s, f, 'rod' + i, 0xffd040, 0.1);
  },
  { emissive: true },
);
MODELS.storm_bird = model(
  64,
  [
    { name: 'body', size: [8, 7, 16], pivot: [0, 0, 0], offset: [-4, 0, -8] },
    { name: 'head', parent: 'body', size: [6, 6, 6], pivot: [0, 3, -8], offset: [-3, 0, -6] },
    { name: 'beak', parent: 'head', size: [2, 2, 4], pivot: [0, 2, -6], offset: [-1, 0, -4] },
    { name: 'wing0', parent: 'body', size: [20, 1, 10], pivot: [4, 5, 0], offset: [0, 0, -5] },
    { name: 'wing1', parent: 'body', size: [20, 1, 10], pivot: [-4, 5, 0], offset: [-20, 0, -5] },
    { name: 'tail', parent: 'body', size: [8, 1, 8], pivot: [0, 4, 8], offset: [-4, 0, 0] },
  ],
  (s, f) => {
    paintPart(s, f, 'body', 0x3a6aa0, 0.08, { bottom: 0xe8f0f8 });
    const h = paintPart(s, f, 'head', 0x3a6aa0, 0.06);
    s.px(h.left[0] + 2, h.left[1] + 2, 0xffff60);
    s.px(h.right[0] + 3, h.right[1] + 2, 0xffff60);
    paintPart(s, f, 'beak', 0xf0c030);
    const w0 = paintPart(s, f, 'wing0', 0x2a5a90, 0.1);
    const w1 = paintPart(s, f, 'wing1', 0x2a5a90, 0.1);
    for (const w of [w0, w1]) for (let x = 0; x < w.top[2]; x += 3) s.rect(w.top[0] + x, w.top[1], 1, w.top[3], 0xe8f0f8);
    paintPart(s, f, 'tail', 0x2a5a90);
  },
);

// ------------------------------------------------------------------ boss
MODELS.ancient_golem = model(
  128,
  [
    { name: 'body', size: [22, 20, 12], pivot: [0, 20, 0], offset: [-11, 0, -6] },
    { name: 'head', parent: 'body', size: [12, 12, 12], pivot: [0, 20, -2], offset: [-6, 0, -6] },
    { name: 'rightArm', parent: 'body', size: [8, 28, 8], pivot: [15, 18, 0], offset: [-4, -26, -4] },
    { name: 'leftArm', parent: 'body', size: [8, 28, 8], pivot: [-15, 18, 0], offset: [-4, -26, -4] },
    { name: 'rightLeg', size: [8, 20, 8], pivot: [6, 20, 0], offset: [-4, -20, -4] },
    { name: 'leftLeg', size: [8, 20, 8], pivot: [-6, 20, 0], offset: [-4, -20, -4] },
  ],
  (s, f) => {
    const stone = 0x8a8060;
    const b = paintPart(s, f, 'body', stone, 0.1);
    s.rect(b.front[0] + 8, b.front[1] + 6, 6, 6, 0xf0c040);
    s.rect(b.front[0] + 9, b.front[1] + 7, 4, 4, 0xfff8c0);
    for (const k of Object.keys(b) as Array<keyof typeof b>) s.spots(b[k], 0x5a7a3a, 3, 1.5);
    const h = paintPart(s, f, 'head', stone, 0.1);
    s.rect(h.front[0] + 2, h.front[1] + 4, 3, 2, 0xffd040);
    s.rect(h.front[0] + 7, h.front[1] + 4, 3, 2, 0xffd040);
    s.rect(h.front[0] + 3, h.front[1] + 8, 6, 1, 0x3a3020);
    for (const p of ['rightArm', 'leftArm', 'rightLeg', 'leftLeg']) {
      const r = paintPart(s, f, p, stone, 0.1);
      for (const k of ['front', 'left', 'right'] as const) s.spots(r[k], 0x5a7a3a, 2, 1.5);
    }
  },
  { scale: 1.1 },
);
MODELS.deep_guardian = model(
  128,
  [
    { name: 'body', size: [22, 22, 22], pivot: [0, 6, 0], offset: [-11, 0, -11] },
    { name: 'eye', parent: 'body', size: [8, 8, 1], pivot: [0, 7, -11], offset: [-4, 0, -1] },
    { name: 'tail', parent: 'body', size: [6, 6, 16], pivot: [0, 8, 11], offset: [-3, 0, 0] },
    { name: 'tail2', parent: 'tail', size: [4, 4, 12], pivot: [0, 1, 16], offset: [-2, 0, 0] },
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ name: 'spike' + i, parent: 'body', size: [2, 8, 2] as [number, number, number], pivot: [i % 2 ? 11 : -11, 11 + (i < 4 ? 8 : -8), i < 2 || (i > 3 && i < 6) ? 6 : -6] as [number, number, number], offset: [-1, 0, -1] as [number, number, number], rot: [0, 0, (i % 2 ? -1 : 1) * 0.8] as [number, number, number] })),
  ],
  (s, f) => {
    const b = paintPart(s, f, 'body', 0x1e3a4a, 0.08);
    for (const k of Object.keys(b) as Array<keyof typeof b>) s.spots(b[k], 0x3a9ad8, 6, 1);
    const e = paintPart(s, f, 'eye', 0xf0f0f0);
    s.rect(e.front[0] + 2, e.front[1] + 2, 4, 4, 0x2a8ae0);
    s.rect(e.front[0] + 3, e.front[1] + 3, 2, 2, 0x0a0a0a);
    paintPart(s, f, 'tail', 0x1e3a4a, 0.08);
    paintPart(s, f, 'tail2', 0x1e3a4a, 0.08);
    for (let i = 0; i < 8; i++) paintPart(s, f, 'spike' + i, 0xc8a070);
  },
  { scale: 1 },
);
MODELS.ember_sovereign = model(
  128,
  [
    { name: 'body', size: [12, 18, 8], pivot: [0, 18, 0], offset: [-6, 0, -4] },
    { name: 'head', parent: 'body', size: [10, 10, 10], pivot: [0, 18, 0], offset: [-5, 0, -5] },
    { name: 'crown', parent: 'head', size: [12, 4, 12], pivot: [0, 10, 0], offset: [-6, 0, -6] },
    { name: 'rightArm', parent: 'body', size: [5, 18, 5], pivot: [8.5, 16, 0], offset: [-2.5, -16, -2.5] },
    { name: 'leftArm', parent: 'body', size: [5, 18, 5], pivot: [-8.5, 16, 0], offset: [-2.5, -16, -2.5] },
    { name: 'rightLeg', size: [5, 18, 5], pivot: [3, 18, 0], offset: [-2.5, -18, -2.5] },
    { name: 'leftLeg', size: [5, 18, 5], pivot: [-3, 18, 0], offset: [-2.5, -18, -2.5] },
  ],
  (s, f) => {
    const b = paintPart(s, f, 'body', 0x3a1a10, 0.1);
    for (const k of Object.keys(b) as Array<keyof typeof b>) s.spots(b[k], 0xff6a10, 4, 1.2);
    const h = paintPart(s, f, 'head', 0x2a1008, 0.08);
    s.rect(h.front[0] + 2, h.front[1] + 4, 2, 2, 0xffd040);
    s.rect(h.front[0] + 6, h.front[1] + 4, 2, 2, 0xffd040);
    paintPart(s, f, 'crown', 0xf6c23c, 0.08);
    for (const p of ['rightArm', 'leftArm', 'rightLeg', 'leftLeg']) {
      const r = paintPart(s, f, p, 0x3a1a10, 0.1);
      for (const k of ['front', 'left', 'right', 'back'] as const) s.spots(r[k], 0xff6a10, 2, 1);
    }
  },
  { scale: 1.6, emissive: true },
);
MODELS.sky_dragon = model(
  128,
  [
    { name: 'body', size: [16, 12, 32], pivot: [0, 10, 0], offset: [-8, 0, -16] },
    { name: 'neck', parent: 'body', size: [8, 8, 14], pivot: [0, 4, -16], offset: [-4, 0, -14] },
    { name: 'head', parent: 'neck', size: [12, 10, 16], pivot: [0, 0, -14], offset: [-6, 0, -16] },
    { name: 'wing0', parent: 'body', size: [44, 2, 22], pivot: [8, 10, -4], offset: [0, 0, -11] },
    { name: 'wing1', parent: 'body', size: [44, 2, 22], pivot: [-8, 10, -4], offset: [-44, 0, -11] },
    { name: 'tail', parent: 'body', size: [8, 8, 22], pivot: [0, 3, 16], offset: [-4, 0, 0] },
    { name: 'tail2', parent: 'tail', size: [5, 5, 18], pivot: [0, 1, 22], offset: [-2.5, 0, 0] },
    { name: 'leg0', parent: 'body', size: [5, 10, 5], pivot: [6, 0, -10], offset: [-2.5, -10, -2.5] },
    { name: 'leg1', parent: 'body', size: [5, 10, 5], pivot: [-6, 0, -10], offset: [-2.5, -10, -2.5] },
    { name: 'leg2', parent: 'body', size: [5, 10, 5], pivot: [6, 0, 10], offset: [-2.5, -10, -2.5] },
    { name: 'leg3', parent: 'body', size: [5, 10, 5], pivot: [-6, 0, 10], offset: [-2.5, -10, -2.5] },
  ],
  (s, f) => {
    const blue = 0x3a6ae0;
    const b = paintPart(s, f, 'body', blue, 0.08, { bottom: 0xe8f0ff });
    for (let x = 0; x < b.top[2]; x += 4) s.rect(b.top[0] + x, b.top[1], 2, b.top[3], 0x2a4ab0);
    paintPart(s, f, 'neck', blue, 0.08);
    const h = paintPart(s, f, 'head', blue, 0.08, { bottom: 0xe8f0ff });
    s.rect(h.left[0] + 9, h.left[1] + 2, 3, 2, 0xffff80);
    s.rect(h.right[0] + 4, h.right[1] + 2, 3, 2, 0xffff80);
    for (const w of ['wing0', 'wing1']) {
      const r = paintPart(s, f, w, 0x6a9af0, 0.08);
      for (let x = 0; x < r.top[2]; x += 6) s.rect(r.top[0] + x, r.top[1], 1, r.top[3], 0xe8f8ff);
    }
    paintPart(s, f, 'tail', blue, 0.08);
    paintPart(s, f, 'tail2', blue, 0.08);
    for (let i = 0; i < 4; i++) paintPart(s, f, 'leg' + i, 0x2a4ab0);
  },
  { scale: 1.3 },
);

// ------------------------------------------------------------------ objets / véhicules
MODELS.boat = model(
  64,
  [
    { name: 'bottom', size: [14, 2, 24], pivot: [0, 0, 0], offset: [-7, 0, -12] },
    { name: 'side0', size: [2, 6, 24], pivot: [7, 2, 0], offset: [0, 0, -12] },
    { name: 'side1', size: [2, 6, 24], pivot: [-7, 2, 0], offset: [-2, 0, -12] },
    { name: 'front', size: [14, 6, 2], pivot: [0, 2, -12], offset: [-7, 0, -2] },
    { name: 'back', size: [14, 6, 2], pivot: [0, 2, 12], offset: [-7, 0, 0] },
  ],
  (s, f) => {
    for (const p of ['bottom', 'side0', 'side1', 'front', 'back']) {
      const r = paintPart(s, f, p, 0x9a7a48, 0.06);
      for (const k of Object.keys(r) as Array<keyof typeof r>) for (let y = 1; y < r[k][3]; y += 3) s.rect(r[k][0], r[k][1] + y, r[k][2], 1, 0x6a5030);
    }
  },
);
MODELS.minecart = model(
  64,
  [
    { name: 'bottom', size: [14, 2, 18], pivot: [0, 2, 0], offset: [-7, 0, -9] },
    { name: 'side0', size: [2, 7, 18], pivot: [7, 4, 0], offset: [-2, 0, -9] },
    { name: 'side1', size: [2, 7, 18], pivot: [-7, 4, 0], offset: [0, 0, -9] },
    { name: 'front', size: [10, 7, 2], pivot: [0, 4, -9], offset: [-5, 0, 0] },
    { name: 'back', size: [10, 7, 2], pivot: [0, 4, 9], offset: [-5, 0, -2] },
    { name: 'wheels', size: [16, 3, 12], pivot: [0, 0, 0], offset: [-8, 0, -6] },
  ],
  (s, f) => {
    for (const p of ['bottom', 'side0', 'side1', 'front', 'back']) paintPart(s, f, p, 0x8a9098, 0.06);
    paintPart(s, f, 'wheels', 0x2a2a2a, 0.05);
  },
);
MODELS.flying_carpet = model(
  64,
  [{ name: 'body', size: [16, 1, 24], pivot: [0, 0, 0], offset: [-8, 0, -12] }],
  (s, f) => {
    const r = paintPart(s, f, 'body', 0xa02a6a, 0.04);
    const [x, y, w, h] = r.top;
    s.rect(x, y, w, 1, 0xf6d23c);
    s.rect(x, y + h - 1, w, 1, 0xf6d23c);
    s.rect(x + 6, y + 9, 4, 6, 0x2a6ad0);
  },
);
