/**
 * Écrans sociaux et de profil : panneau latéral « Social » (joueurs connectés avec vous,
 * serveurs récents), Profil (nom, statistiques des mondes locaux), Vestiaire (choix de
 * l'apparence) et « Nouveautés et crédits » (contenu de la version, commandes, crédits).
 */
import { h, img, button, textField, toast, confirmDialog, formatBytes, formatDate, clickSound } from '../dom';
import { PLAYER_SKINS } from '../../entities/models';
import { keyLabel } from '../../input/InputManager';
import { DIMENSION_NAMES } from '../../world/constants';
import type { AppContext } from '../../core/AppContext';
import type { KeyBindings } from '../../core/Settings';
import type { Screen } from '../UIManager';
import type { WorldMeta } from '../../save/SaveManager';

/** Version des nouveautés : la pastille du courrier reste affichée tant que settings.splashSeen est inférieur. */
export const NEWS_VERSION = 1;

// ------------------------------------------------------------------ styles propres à ce module
const STYLE_ID = 'soc-style';
const CSS = `
.soc-back { justify-content: flex-end !important; align-items: stretch !important; }
.soc-panel { animation: soc-in 0.16s ease-out; overflow: hidden; }
@keyframes soc-in { from { transform: translateX(25%); opacity: 0.3; } to { transform: none; opacity: 1; } }
.soc-top { display: flex; gap: calc(var(--u) * 4); align-items: stretch; flex: 0 0 auto; }
.soc-search { flex: 1; position: relative; display: flex; align-items: center; min-width: 0; }
.soc-search .soc-sico { position: absolute; left: calc(var(--u) * 3); width: calc(var(--u) * 14); height: calc(var(--u) * 14); pointer-events: none; image-rendering: pixelated; }
.soc-search .field { padding-left: calc(var(--u) * 17); height: 100%; font-size: var(--fs-s); }
.soc-close { width: calc(var(--u) * 22); }
.soc-tabs { display: flex; gap: calc(var(--u) * 2); flex: 0 0 auto; }
.soc-tabs .tab { height: calc(var(--u) * 20); }
.soc-head { flex: 0 0 auto; background: #1e1e1f; text-align: center; font-family: 'VoxPixelBold', monospace; letter-spacing: calc(var(--u) * 0.6); padding: calc(var(--u) * 5); font-size: calc(var(--u) * 9); }
.soc-scroll { flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: calc(var(--u) * 4); padding-right: calc(var(--u) * 1); }
.soc-group { display: flex; border-bottom: calc(var(--u) * 2) solid #5cd047; margin-top: calc(var(--u) * 3); flex: 0 0 auto; }
.soc-group.off { border-color: var(--topbar); }
.soc-empty { background: var(--bg-mid); border: calc(var(--u) * 1) solid var(--line); color: var(--text-dim); text-align: center; padding: calc(var(--u) * 9) calc(var(--u) * 6); flex: 0 0 auto; }
.soc-panel .person { flex: 0 0 auto; }
.soc-panel .person.soc-me { cursor: pointer; }
.soc-panel .person.soc-me:hover { background: #535455; }
.soc-pinfo { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: calc(var(--u) * 2); }
.soc-pname { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.soc-pstat { color: var(--text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.person .face .soc-facecv { width: 100%; height: 100%; display: block; }
.person .face.soc-globe { background: #2a6ad0; display: flex; align-items: center; justify-content: center; border: calc(var(--u) * 1) solid #000; box-sizing: border-box; }
.person .face.soc-globe img { width: 70%; height: 70%; }
.soc-join { flex: 0 0 auto; padding: calc(var(--u) * 2) calc(var(--u) * 5) calc(var(--u) * 4) !important; min-height: calc(var(--u) * 18); font-size: var(--fs-s); }
.person .face.soc-globe { width: calc(var(--u) * 18); height: calc(var(--u) * 18); }
.soc-add { flex: 0 0 auto; margin-top: calc(var(--u) * 4); }
.soc-back-ico { width: calc(var(--u) * 12); height: calc(var(--u) * 12); }
.soc-stage { width: 38%; flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; gap: calc(var(--u) * 4); background: rgba(0, 0, 0, 0.35); border-right: calc(var(--u) * 1) solid var(--line); padding: calc(var(--u) * 6); box-sizing: border-box; min-height: 0; }
.soc-stagebox { flex: 1; min-height: 0; width: 100%; position: relative; }
.soc-big { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; touch-action: none; cursor: grab; }
.soc-big:active { cursor: grabbing; }
.soc-nametag { text-shadow: calc(var(--u) * 1) calc(var(--u) * 1) 0 #000; font-size: calc(var(--u) * 9); }
.soc-hint { color: var(--text-dim); font-size: var(--fs-s); }
.soc-face-lg { width: calc(var(--u) * 20); height: calc(var(--u) * 20); border: calc(var(--u) * 1) solid #000; flex: 0 0 auto; }
.soc-stat { display: flex; justify-content: space-between; gap: calc(var(--u) * 8); padding: calc(var(--u) * 5) calc(var(--u) * 12); border-bottom: calc(var(--u) * 1) solid var(--bg-dark); }
.soc-stat .v { color: var(--yellow); text-align: right; }
.soc-warn { color: #ff8a7a !important; }
.soc-room { flex: 1; min-width: 0; display: flex; flex-direction: column; background: rgba(0, 0, 0, 0.35); }
.soc-room .soc-stagebox { margin: calc(var(--u) * 6) calc(var(--u) * 6) 0; width: auto; }
.soc-room-bar { display: flex; align-items: center; gap: calc(var(--u) * 8); padding: calc(var(--u) * 6) calc(var(--u) * 10); background: var(--bg-mid); border-top: calc(var(--u) * 1) solid var(--line); }
.soc-room-bar .btn { min-width: calc(var(--u) * 80); }
.soc-room-name { font-size: calc(var(--u) * 9); margin-bottom: calc(var(--u) * 2); }
.soc-skininfo { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: calc(var(--u) * 1); }
.soc-skininfo > div:first-child { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.soc-eq { color: #6fe04f; font-size: var(--fs-s); }
.side-item canvas.ico { border: calc(var(--u) * 1) solid #000; }
.soc-list { margin: 0; padding: 0 0 0 calc(var(--u) * 10); display: flex; flex-direction: column; gap: calc(var(--u) * 4); }
.soc-list li { line-height: 1.35; }
.soc-list li::marker { color: var(--yellow); }
.soc-keys { display: grid; grid-template-columns: 1fr auto; gap: calc(var(--u) * 3) calc(var(--u) * 10); align-items: center; }
.soc-key { background: var(--bg-dark); border: calc(var(--u) * 1) solid var(--line); padding: calc(var(--u) * 1) calc(var(--u) * 5); color: #fff; text-align: center; white-space: nowrap; }
.soc-note { color: var(--text-dim); line-height: 1.4; }
.soc-actions { display: flex; gap: calc(var(--u) * 6); flex-wrap: wrap; margin-top: calc(var(--u) * 6); }
`;

function ensureStyle(): void {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = CSS;
  document.head.appendChild(s);
}

// ------------------------------------------------------------------ outils communs
function hash(x: number, y: number, s: number): number {
  let n = (x * 374761393 + y * 668265263 + s * 1442695041) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function rgb(c: number, f = 1): string {
  const k = (v: number) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${k((c >> 16) & 255)},${k((c >> 8) & 255)},${k(c & 255)})`;
}

/** Clé d'apparence valide (repli sur l'explorateur). */
export function validSkin(key: string): string {
  return PLAYER_SKINS[key] ? key : 'explorer';
}

/** Dessine le visage (face avant de la tête, 8×8) d'une apparence de joueur. */
export function drawSkinFace(canvas: HTMLCanvasElement, skinKey: string): void {
  const c = PLAYER_SKINS[validSkin(skinKey)].colors;
  canvas.width = 8;
  canvas.height = 8;
  const g = canvas.getContext('2d');
  if (!g) return;
  const px = (x: number, y: number, col: number, amp = 0.04) => {
    g.fillStyle = rgb(col, 1 + (hash(x, y, 7) - 0.5) * 2 * amp);
    g.fillRect(x, y, 1, 1);
  };
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) px(x, y, c.skin);
  for (let x = 0; x < 8; x++) {
    px(x, 0, c.hair, 0.08);
    px(x, 1, c.hair, 0.08);
  }
  const eye = c.eyes ?? 0x3a6a3a;
  px(1, 4, 0xffffff, 0);
  px(2, 4, eye, 0);
  px(5, 4, eye, 0);
  px(6, 4, 0xffffff, 0);
  g.fillStyle = rgb(c.skin, 0.75);
  g.fillRect(3, 6, 2, 1);
  if (c.beard !== undefined) for (let y = 6; y < 8; y++) for (let x = 1; x < 7; x++) px(x, y, c.beard, 0.08);
}

function faceCanvas(skin: string, cls: string): HTMLCanvasElement {
  const c = h('canvas', { class: 'pixel ' + cls });
  drawSkinFace(c, skin);
  return c;
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Nom de joueur autorisé : lettres, chiffres et _ (16 caractères au plus). */
export function sanitizeName(v: string): string {
  return v.replace(/[^A-Za-z0-9_]/g, '').slice(0, 16);
}

function formatDuration(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  if (s < 60) return `${s} s`;
  const hrs = Math.floor(s / 3600);
  const min = Math.floor((s % 3600) / 60);
  return hrs > 0 ? `${hrs} h ${String(min).padStart(2, '0')} min` : `${min} min`;
}

/** Écran générique : barre du haut (retour + titre) et corps. */
function shell(app: AppContext, title: string): { el: HTMLElement; body: HTMLElement } {
  const back = h('div', { class: 'back', title: 'Retour', role: 'button', 'aria-label': 'Retour' }, img('back', 'soc-back-ico'));
  back.addEventListener('click', () => {
    clickSound?.();
    app.ui.back();
  });
  const body = h('div', { class: 'screen-body' });
  const el = h('div', { class: 'screen overlay-dark' }, h('div', { class: 'topbar' }, back, h('div', { class: 'title' }, title), h('div', { class: 'spacer' })), body);
  return { el, body };
}

/** Applique une nouvelle apparence à la partie en cours (affichage local). */
function applyLiveSkin(app: AppContext, key: string): void {
  const g = app.game;
  if (!g) return;
  const model = 'player_' + key;
  g.entities.playerSkin = model;
  (g.player as unknown as { skinKey?: string }).skinKey = model;
  g.hand.setSkin(model);
}

/**
 * Aperçu 3D qu'on fait pivoter en le glissant (souris ou doigt). Au repos : rotation continue
 * (« spin ») ou léger balancement face à la caméra (« sway »). Lacet 0 = face à la caméra.
 */
class SpinPreview {
  readonly canvas: HTMLCanvasElement;
  private offset = 0;
  private phase = 0;
  private time = 0;
  private lastDrag = -10;
  private drag: { id: number; x: number } | null = null;

  constructor(
    private app: AppContext,
    private walk: number,
    private mode: 'spin' | 'sway',
  ) {
    const c = h('canvas', { class: 'pixel soc-big', width: '320', height: '480' });
    this.canvas = c;
    c.addEventListener('pointerdown', (e) => {
      this.drag = { id: e.pointerId, x: e.clientX };
      try {
        c.setPointerCapture(e.pointerId);
      } catch {
        /* capture indisponible */
      }
    });
    c.addEventListener('pointermove', (e) => {
      if (!this.drag || this.drag.id !== e.pointerId) return;
      this.offset += (e.clientX - this.drag.x) * 0.012;
      this.drag.x = e.clientX;
      this.lastDrag = this.time;
    });
    const end = (e: PointerEvent) => {
      if (this.drag && this.drag.id === e.pointerId) this.drag = null;
    };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
  }

  update(dt: number, skin: string): void {
    this.time += dt;
    if (!this.drag && this.time - this.lastDrag > 2.5) this.phase += dt;
    const yaw = this.mode === 'spin' ? this.offset + this.phase * 0.45 : this.offset + Math.sin(this.phase * 0.6) * 0.45;
    this.app.preview.draw(this.canvas, 'player_' + validSkin(skin), yaw, this.time, 0, 0, this.walk);
  }
}

// ------------------------------------------------------------------ panneau Social
interface ServerEntry {
  name: string;
  address: string;
  invite?: string;
}

interface OnlinePlayer {
  name: string;
  skin: string;
  dim: number;
}

function onlinePlayers(app: AppContext): OnlinePlayer[] {
  const net = app.game?.net;
  if (!net) return [];
  try {
    return net.remotePlayers().map((p) => ({ name: p.name, skin: validSkin(p.skinKey.replace(/^player_/, '')), dim: p.dim }));
  } catch {
    return [];
  }
}

function selfStatus(app: AppContext): string {
  const g = app.game;
  return g ? `En jeu : ${g.meta.name}` : 'Au menu';
}

/** Ouvre le panneau latéral « Social » par-dessus l'écran courant (fermé par Retour ou un clic à côté). */
export function openSocialPanel(app: AppContext): void {
  ensureStyle();
  const root = document.getElementById('ui');
  if (!root) return;
  root.querySelectorAll('.soc-back').forEach((e) => e.remove());

  let tab: 'players' | 'servers' = 'players';
  let query = '';
  let sig = '';
  const back = h('div', { class: 'modal-back soc-back' });
  back.style.justifyContent = 'flex-end';
  back.style.alignItems = 'stretch';
  const close = () => back.remove();
  back.addEventListener('pointerdown', (e) => {
    if (e.target === back) close();
  });

  const search = textField('', 'Rechercher un joueur', (v) => {
    query = v;
    render(true);
  }, 32);
  search.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      e.preventDefault();
      close();
    }
  });
  const head = h('div', { class: 'soc-head' });
  const list = h('div', { class: 'soc-scroll' });
  const tabEls: HTMLElement[] = [];
  const mkTab = (id: 'players' | 'servers', ico: string, label: string) => {
    const t = h('div', { class: 'tab', tabindex: '0', title: label, role: 'tab' }, img(ico), h('span', null, label));
    t.addEventListener('click', () => {
      clickSound?.();
      tab = id;
      render(true);
    });
    tabEls.push(t);
    return t;
  };

  const matches = (...texts: string[]) => {
    const q = norm(query.trim());
    return !q || texts.some((t) => norm(t).includes(q));
  };
  const servers = (): ServerEntry[] => (app.settings.data.servers ?? []).filter((s) => s && s.address);

  const group = (label: string, off: boolean) => h('div', { class: 'soc-group' + (off ? ' off' : '') }, h('div', { class: 'group-label' + (off ? ' off' : '') }, label));
  const empty = (text: string) => h('div', { class: 'soc-empty' }, text);
  const person = (name: string, status: string, skin: string, online: boolean) =>
    h(
      'div',
      { class: 'person' },
      h('div', { class: 'face' }, faceCanvas(skin, 'soc-facecv'), online ? h('div', { class: 'online' }) : null),
      h('div', { class: 'soc-pinfo' }, h('div', { class: 'soc-pname' }, name), h('div', { class: 'soc-pstat' }, status)),
    );

  const join = (s: ServerEntry) => {
    close();
    const g = app.game;
    if (g?.net && g.net.address === s.address) {
      toast('Vous êtes déjà connecté à ce serveur.');
      return;
    }
    const go = () => void app.joinServer(s.address, s.invite).catch(() => undefined);
    if (g) confirmDialog('Rejoindre ce serveur ?', `La partie en cours sera enregistrée et quittée pour rejoindre « ${s.name || s.address} ».`, 'Rejoindre', go, false);
    else go();
  };
  const serverCard = (s: ServerEntry) =>
    h(
      'div',
      { class: 'person' },
      h('div', { class: 'face soc-globe' }, img('globe', '')),
      h('div', { class: 'soc-pinfo' }, h('div', { class: 'soc-pname' }, s.name || s.address), h('div', { class: 'soc-pstat' }, s.address + (s.invite ? ' · invitation' : ''))),
      button('Rejoindre', () => join(s), 'green soc-join'),
    );

  const playersView = (): HTMLElement[] => {
    const out: HTMLElement[] = [];
    const me = person(app.settings.data.profileName + ' (Vous)', selfStatus(app), app.settings.data.skin, true);
    me.classList.add('soc-me');
    me.title = 'Voir le profil';
    me.addEventListener('click', () => {
      clickSound?.();
      close();
      app.openProfile();
    });
    out.push(me);
    const all = onlinePlayers(app);
    const shown = all.filter((p) => matches(p.name));
    out.push(group(`En ligne (${shown.length})`, false));
    if (!shown.length) out.push(empty(all.length ? 'Aucun joueur ne correspond à la recherche' : 'Aucun joueur connecté avec vous'));
    for (const p of shown) out.push(person(p.name, `En ligne · ${DIMENSION_NAMES[p.dim] ?? 'Dimension inconnue'}`, p.skin, true));
    const all2 = servers();
    const srv = all2.filter((s) => matches(s.name, s.address));
    out.push(group(`Serveurs récents (${srv.length})`, true));
    if (!srv.length) out.push(empty(all2.length ? 'Aucun serveur ne correspond à la recherche' : 'Aucun serveur enregistré'));
    for (const s of srv) out.push(serverCard(s));
    return out;
  };

  const serversView = (): HTMLElement[] => {
    const out: HTMLElement[] = [];
    const all = servers();
    const srv = all.filter((s) => matches(s.name, s.address));
    out.push(group(`Serveurs enregistrés (${srv.length})`, true));
    if (!srv.length) out.push(empty(all.length ? 'Aucun serveur ne correspond à la recherche' : 'Aucun serveur enregistré'));
    for (const s of srv) out.push(serverCard(s));
    out.push(
      button('Ajouter un serveur', () => {
        close();
        app.openPlay('servers');
      }, 'green soc-add', 'plus'),
    );
    return out;
  };

  const signature = () =>
    [tab, query, app.settings.data.profileName, app.settings.data.skin, selfStatus(app), JSON.stringify(servers()), onlinePlayers(app).map((p) => `${p.name}|${p.skin}|${p.dim}`).join(',')].join('§');

  const render = (force: boolean) => {
    const s = signature();
    if (!force && s === sig) return;
    sig = s;
    tabEls.forEach((t, i) => t.classList.toggle('active', (i === 0) === (tab === 'players')));
    search.placeholder = tab === 'players' ? 'Rechercher un joueur' : 'Rechercher un serveur';
    head.textContent = tab === 'players' ? 'JOUEURS' : 'SERVEURS';
    const scroll = list.scrollTop;
    list.replaceChildren(...(tab === 'players' ? playersView() : serversView()));
    list.scrollTop = scroll;
  };

  const panel = h(
    'div',
    { class: 'side-panel soc-panel', role: 'dialog', 'aria-label': 'Social' },
    h('div', { class: 'soc-top' }, h('div', { class: 'soc-search' }, img('search', 'soc-sico'), search), button('', close, 'dark square soc-close', 'close_white')),
    h('div', { class: 'soc-tabs' }, mkTab('players', 'social_white', 'Joueurs'), mkTab('servers', 'globe', 'Serveurs')),
    head,
    list,
  );
  back.appendChild(panel);
  root.appendChild(back);
  render(true);
  // Rafraîchit la liste quand des joueurs arrivent ou partent ; s'arrête une fois le panneau fermé.
  const timer = window.setInterval(() => {
    if (!back.isConnected) {
      clearInterval(timer);
      return;
    }
    render(false);
  }, 1000);
}

// ------------------------------------------------------------------ Profil
export class ProfileScreen implements Screen {
  readonly el: HTMLElement;
  private spin: SpinPreview;
  private skin = '';
  private name = '';
  private face: HTMLCanvasElement;
  private skinLabel: HTMLElement;
  private nameTag: HTMLElement;
  private field: HTMLInputElement;

  constructor(private app: AppContext) {
    ensureStyle();
    const { el, body } = shell(app, 'Profil');
    this.el = el;
    this.spin = new SpinPreview(app, 0, 'sway');
    this.nameTag = h('div', { class: 'soc-nametag' });
    const stage = h('div', { class: 'soc-stage' }, h('div', { class: 'soc-stagebox' }, this.spin.canvas), this.nameTag, h('div', { class: 'soc-hint' }, 'Faites glisser pour pivoter'));

    const hint = h('div', { class: 'desc' });
    const setHint = (warn: boolean) => {
      hint.textContent = warn ? 'Le nom ne peut pas être vide : le précédent est conservé.' : 'De 1 à 16 caractères : lettres sans accent, chiffres et « _ ». Visible par les autres joueurs en multijoueur.';
      hint.classList.toggle('soc-warn', warn);
    };
    setHint(false);
    const field = textField(app.settings.data.profileName, 'Nom du joueur', (v) => this.onName(v, setHint), 16);
    this.field = field;
    field.addEventListener('blur', () => {
      if (!field.value) {
        field.value = app.settings.data.profileName;
        setHint(false);
      }
    });
    field.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' || e.code === 'Escape') field.blur();
    });

    this.face = faceCanvas(app.settings.data.skin, 'soc-face-lg');
    this.skinLabel = h('div', null);
    const stats = h('div', null, h('div', { class: 'section dim' }, 'Chargement des statistiques…'));
    const content = h(
      'div',
      { class: 'content' },
      h('div', { class: 'section head' }, 'Identité'),
      h('div', { class: 'section' }, h('div', { class: 'label' }, 'Nom du joueur'), field, hint),
      h(
        'div',
        { class: 'section' },
        h('div', { class: 'label' }, 'Apparence'),
        h('div', { class: 'row' }, this.face, h('div', { class: 'grow' }, this.skinLabel), button('Modifier l’apparence', () => app.openDressingRoom())),
      ),
      h('div', { class: 'section head' }, 'Statistiques de vos mondes'),
      stats,
    );
    body.appendChild(h('div', { class: 'split' }, stage, content));
    this.refresh();
    void this.loadStats(stats);
  }

  private onName(v: string, setHint: (warn: boolean) => void): void {
    const clean = sanitizeName(v);
    if (clean !== v) {
      const pos = Math.max(0, (this.field.selectionStart ?? clean.length) - (v.length - clean.length));
      this.field.value = clean;
      this.field.setSelectionRange(pos, pos);
    }
    if (!clean) {
      setHint(true);
      return;
    }
    setHint(false);
    this.app.settings.set('profileName', clean);
    const g = this.app.game;
    if (g && !g.net) g.player.name = clean;
  }

  private refresh(): void {
    const s = this.app.settings.data;
    if (s.skin !== this.skin) {
      this.skin = s.skin;
      drawSkinFace(this.face, s.skin);
      this.skinLabel.textContent = PLAYER_SKINS[validSkin(s.skin)].name;
    }
    if (s.profileName !== this.name) {
      this.name = s.profileName;
      this.nameTag.textContent = s.profileName;
    }
  }

  private async loadStats(box: HTMLElement): Promise<void> {
    let worlds: WorldMeta[];
    try {
      worlds = (await this.app.saves.listWorlds()).filter((w) => !w.id.startsWith('net:'));
    } catch {
      box.replaceChildren(h('div', { class: 'section dim' }, 'Statistiques indisponibles (stockage inaccessible).'));
      return;
    }
    const sum = (f: (w: WorldMeta) => number) => worlds.reduce((n, w) => n + (Number.isFinite(f(w)) ? f(w) : 0), 0);
    const row = (label: string, value: string) => h('div', { class: 'soc-stat' }, h('span', null, label), h('span', { class: 'v' }, value));
    const last = worlds[0];
    box.replaceChildren(
      row('Mondes enregistrés', String(worlds.length)),
      row('Temps de jeu total', formatDuration(sum((w) => w.playTime ?? 0))),
      row('Jours écoulés (tous mondes)', String(sum((w) => w.day ?? 0))),
      row('Boss vaincus', String(sum((w) => w.bossesDefeated?.length ?? 0))),
      row('Espace utilisé', formatBytes(sum((w) => w.sizeBytes ?? 0))),
      row('Dernier monde joué', last ? `${last.name} (${formatDate(last.lastPlayed || last.created)})` : '—'),
    );
  }

  update(dt: number): void {
    this.refresh();
    this.spin.update(dt, this.app.settings.data.skin);
  }
}

// ------------------------------------------------------------------ Vestiaire
export class DressingRoomScreen implements Screen {
  readonly el: HTMLElement;
  private selected: string;
  private items = new Map<string, { row: HTMLElement; badge: HTMLElement }>();
  private spin: SpinPreview;
  private nameEl: HTMLElement;
  private stateEl: HTMLElement;
  private equipLabel: HTMLElement;
  private equipBtn: HTMLButtonElement;

  constructor(private app: AppContext) {
    ensureStyle();
    const { el, body } = shell(app, 'Vestiaire');
    this.el = el;
    this.selected = validSkin(app.settings.data.skin);
    const keys = Object.keys(PLAYER_SKINS);
    const side = h('div', { class: 'sidebar' }, h('div', { class: 'side-group' }, `Apparences (${keys.length})`));
    for (const key of keys) {
      const badge = h('div', { class: 'soc-eq' }, 'Équipée');
      const row = h('div', { class: 'side-item', tabindex: '0', role: 'option' }, faceCanvas(key, 'ico'), h('div', { class: 'soc-skininfo' }, h('div', null, PLAYER_SKINS[key].name), badge));
      row.addEventListener('click', () => {
        clickSound?.();
        this.selected = key;
        this.refresh();
      });
      side.appendChild(row);
      this.items.set(key, { row, badge });
    }
    this.spin = new SpinPreview(app, 0.55, 'spin');
    this.nameEl = h('div', { class: 'soc-room-name' });
    this.stateEl = h('div', { class: 'dim' });
    this.equipLabel = h('span', null, 'Équiper');
    this.equipBtn = button(this.equipLabel, () => this.equip(), 'green');
    const room = h(
      'div',
      { class: 'soc-room' },
      h('div', { class: 'soc-stagebox' }, this.spin.canvas),
      h('div', { class: 'soc-room-bar' }, h('div', { class: 'grow' }, this.nameEl, this.stateEl), this.equipBtn),
    );
    body.appendChild(h('div', { class: 'split' }, side, room));
    this.refresh();
  }

  private refresh(): void {
    const equipped = validSkin(this.app.settings.data.skin);
    for (const [key, it] of this.items) {
      it.row.classList.toggle('active', key === this.selected);
      it.badge.style.display = key === equipped ? '' : 'none';
    }
    const isOn = this.selected === equipped;
    this.nameEl.textContent = PLAYER_SKINS[this.selected].name;
    this.stateEl.textContent = isOn ? 'Apparence actuelle · faites glisser pour pivoter' : 'Aperçu · faites glisser pour pivoter';
    this.equipLabel.textContent = isOn ? 'Équipée' : 'Équiper';
    this.equipBtn.disabled = isOn;
  }

  private equip(): void {
    const key = this.selected;
    if (key === validSkin(this.app.settings.data.skin)) return;
    this.app.settings.set('skin', key);
    applyLiveSkin(this.app, key);
    const extra = this.app.game?.net ? ' Les autres joueurs la verront à votre prochaine connexion.' : '';
    toast(`Apparence « ${PLAYER_SKINS[key].name} » équipée !${extra}`, extra ? 4000 : 2500);
    this.refresh();
  }

  update(dt: number): void {
    this.spin.update(dt, this.selected);
  }
}

// ------------------------------------------------------------------ Nouveautés et crédits
type CreditsPage = 'news' | 'controls' | 'credits';

const NEWS: string[] = [
  `Un monde généré à l'infini : plus de trente biomes (océans, jungles, canyons ocre, forêts de cristal, îles tropicales, volcans…), grottes et rivières.`,
  `Trois dimensions reliées par des portails : ${DIMENSION_NAMES.join(', ').replace(/, ([^,]*)$/, ' et $1')}.`,
  'Quatre boss à affronter : le Golem antique, le Gardien des profondeurs, le Souverain des braises et le Dragon des cieux.',
  'Villageois de différents métiers avec qui faire des échanges, et gardes de village.',
  'Mode survie complet : santé, faim, armure, expérience, artisanat 2×2 et 3×3, four et coffres.',
  'Mode créatif avec un catalogue d’objets par catégories et une recherche.',
  'Cycle jour/nuit, météo (pluie et orages) et mini-carte.',
  'Multijoueur : hébergez votre propre serveur Voxelia et invitez vos amis avec un code, chat partagé.',
  'Import de packs de ressources (.zip) pour changer les textures des blocs et des objets.',
  'Commandes tactiles déplaçables, prise en charge de la manette, du clavier et de la souris.',
  'Commandes de triche (/give, /tp, /time, /weather…) dans les mondes qui les autorisent.',
  'Sons et musique générés en temps réel, sauvegarde automatique, export et import de mondes.',
];

const KEY_ROWS: Array<[keyof KeyBindings, string]> = [
  ['forward', 'Avancer'],
  ['back', 'Reculer'],
  ['left', 'Aller à gauche'],
  ['right', 'Aller à droite'],
  ['jump', 'Sauter'],
  ['sneak', 'S’accroupir'],
  ['sprint', 'Sprinter'],
  ['inventory', 'Inventaire'],
  ['drop', 'Jeter l’objet tenu'],
  ['chat', 'Discussion'],
  ['command', 'Saisir une commande'],
  ['perspective', 'Changer de vue'],
  ['map', 'Carte'],
  ['pickBlock', 'Prendre le bloc visé'],
  ['hud', 'Masquer l’interface'],
  ['debug', 'Informations de débogage'],
];

const TOUCH_ROWS: Array<[string, string]> = [
  ['Se déplacer', 'Joystick à gauche'],
  ['Regarder autour', 'Glisser sur l’écran'],
  ['Utiliser / poser un bloc', 'Appui court'],
  ['Casser un bloc', 'Appui long'],
  ['Sauter, s’accroupir, sprinter', 'Boutons à droite'],
  ['Attaquer / utiliser', 'Boutons épée et +'],
  ['Choisir un objet', 'Toucher la barre du bas'],
  ['Inventaire complet', 'Bouton « … » de la barre'],
  ['Pause, discussion, vue', 'Boutons en haut'],
];

const PAD_ROWS: Array<[string, string]> = [
  ['Se déplacer / regarder', 'Stick gauche / droit'],
  ['Sauter', 'A'],
  ['S’accroupir (bascule)', 'B'],
  ['Jeter l’objet tenu', 'X'],
  ['Inventaire', 'Y'],
  ['Objet précédent / suivant', 'LB / RB'],
  ['Utiliser / attaquer', 'LT / RT'],
  ['Sprinter (bascule)', 'Clic stick gauche'],
  ['Changer de vue', 'Clic stick droit'],
  ['Discussion / pause', 'Affichage / Menu'],
  ['Menus : valider / retour', 'A / B'],
];

export class CreditsScreen implements Screen {
  readonly el: HTMLElement;
  private content: HTMLElement;
  private tabs = new Map<CreditsPage, HTMLElement>();

  constructor(private app: AppContext) {
    ensureStyle();
    if ((app.settings.data.splashSeen ?? 0) < NEWS_VERSION) app.settings.set('splashSeen', NEWS_VERSION);
    const { el, body } = shell(app, 'Nouveautés et crédits');
    this.el = el;
    const side = h('div', { class: 'sidebar' });
    const pages: Array<[CreditsPage, string, string]> = [
      ['news', 'Nouveautés', 'book'],
      ['controls', 'Commandes', 'keyboard'],
      ['credits', 'Crédits', 'trophy'],
    ];
    for (const [id, label, ico] of pages) {
      const it = h('div', { class: 'side-item', tabindex: '0' }, img(ico), label);
      it.addEventListener('click', () => {
        clickSound?.();
        this.show(id);
      });
      side.appendChild(it);
      this.tabs.set(id, it);
    }
    this.content = h('div', { class: 'content' });
    body.appendChild(h('div', { class: 'split' }, side, this.content));
    this.show('news');
  }

  private show(page: CreditsPage): void {
    for (const [id, el] of this.tabs) el.classList.toggle('active', id === page);
    const c = this.content;
    c.replaceChildren(...(page === 'news' ? this.news() : page === 'controls' ? this.controls() : this.credits()));
    c.scrollTop = 0;
  }

  private news(): HTMLElement[] {
    return [
      h('div', { class: 'section head' }, `Voxelia ${this.app.version} — première version`),
      h('div', { class: 'section' }, h('ul', { class: 'soc-list' }, ...NEWS.map((t) => h('li', null, t)))),
      h('div', { class: 'section soc-note' }, 'Merci de jouer à Voxelia ! Vos mondes sont enregistrés automatiquement sur cet appareil.'),
    ];
  }

  private keyGrid(rows: Array<[string, string]>): HTMLElement {
    return h('div', { class: 'section' }, h('div', { class: 'soc-keys' }, ...rows.flatMap(([a, k]) => [h('span', null, a), h('span', { class: 'soc-key' }, k)])));
  }

  private controls(): HTMLElement[] {
    const keys = this.app.settings.data.keys;
    const kb: Array<[string, string]> = [
      ['Casser / attaquer', 'Clic gauche'],
      ['Utiliser / poser un bloc', 'Clic droit'],
      ['Choisir un objet', 'Molette ou 1 à 9'],
      ...KEY_ROWS.map(([k, label]): [string, string] => [label, keyLabel(keys[k])]),
      ['Pause', 'Échap'],
    ];
    return [
      h('div', { class: 'section head' }, 'Clavier et souris'),
      this.keyGrid(kb),
      h('div', { class: 'section' }, button('Personnaliser les touches', () => this.app.openSettings('keyboard'), '', 'keyboard')),
      h('div', { class: 'section head' }, 'Écran tactile'),
      this.keyGrid(TOUCH_ROWS),
      h('div', { class: 'section' }, button('Modifier la disposition tactile', () => this.app.openSettings('touch'), '', 'touch')),
      h('div', { class: 'section head' }, 'Manette'),
      this.keyGrid(PAD_ROWS),
      h('div', { class: 'section' }, button('Réglages de la manette', () => this.app.openSettings('controller'), '', 'controller')),
    ];
  }

  private credits(): HTMLElement[] {
    const libs = [
      'Three.js — moteur de rendu 3D (licence MIT)',
      'ws — serveur WebSocket du mode multijoueur (licence MIT)',
      'fflate — lecture des archives des packs de ressources (licence MIT)',
      'TypeScript (licence Apache 2.0) et esbuild (licence MIT) — outils de développement',
    ];
    return [
      h('div', { class: 'section head' }, 'Équipe Voxelia'),
      h('div', { class: 'section soc-note' }, 'Conception, programmation, graphismes, sons et musique : l’équipe Voxelia.'),
      h('div', { class: 'section head' }, 'Bibliothèques libres'),
      h('div', { class: 'section' }, h('ul', { class: 'soc-list' }, ...libs.map((t) => h('li', null, t)))),
      h('div', { class: 'section head' }, 'Graphismes et sons'),
      h(
        'div',
        { class: 'section' },
        h(
          'ul',
          { class: 'soc-list' },
          h('li', null, 'Police pixel originale, créée pour Voxelia.'),
          h('li', null, 'Toutes les textures, icônes, modèles 3D et le logo sont générés procéduralement par le code du jeu.'),
          h('li', null, 'Tous les sons et la musique sont synthétisés en temps réel : aucun fichier audio externe.'),
        ),
      ),
      h('div', { class: 'section head' }, 'Mention'),
      h('div', { class: 'section soc-note' }, `Voxelia est un jeu indépendant et original (version ${this.app.version}). Il n’est affilié à aucune autre entreprise ni à aucun autre jeu, et n’est approuvé par aucun d’entre eux.`),
    ];
  }
}
