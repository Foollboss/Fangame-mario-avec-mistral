/**
 * Écran « Créer un nouveau monde » / « Paramètres du monde » : aperçu et bouton principal
 * à gauche (CRÉER ou JOUER, modèles de monde), panneaux de réglages à droite.
 * En création, rien n'est écrit avant « CRÉER » ; en édition, les changements sont
 * enregistrés en quittant l'écran ou en lançant la partie.
 */
import { button, clickSound, confirmDialog, formatBytes, formatDate, h, img, modal, pickFile, saveFile, toast } from '../dom';
import { templateArt } from './WorldSettingsArt';
import {
  advancedSection,
  cheatsSection,
  experimentsSection,
  FIXED_NOTE,
  generalSection,
  multiplayerSection,
  packsSection,
  rulesSection,
  TEMPLATES,
  templateName,
  type SectionId,
  type WsHost,
} from './WorldSettingsSections';
import { defaultRules, newWorldMeta, type GameMode, type WorldMeta } from '../../save/SaveManager';
import { seedFromInput } from '../../util/random';
import type { AppContext } from '../../core/AppContext';
import type { PackInfo } from '../../packs/ResourcePacks';
import type { Screen } from '../UIManager';

// ---------------------------------------------------------------- styles propres à l'écran (injectés une fois)
const STYLE = `
.wss-root { background: rgba(0, 0, 0, 0.28); }
.wss-root > .topbar { order: -1; }
.wss-root .topbar .back .ico { width: calc(var(--u) * 20); height: calc(var(--u) * 20); }
.wss-root .topbar .social.wss-social { padding: 0 calc(var(--u) * 8); border-bottom: 0; color: #1e1e1f; gap: calc(var(--u) * 3); background: transparent; }
.wss-root .topbar .social.wss-social:hover, .wss-root .topbar .social.wss-social:focus-visible { background: #d4d6d9; }
.wss-root .topbar .social.wss-social .ico { width: calc(var(--u) * 17); height: calc(var(--u) * 17); }
.wss-root .sidebar .side-head { padding-bottom: calc(var(--u) * 6); border-bottom: calc(var(--u) * 1) solid #262627; }
.wss-root .side-head .btn { width: 100%; box-sizing: border-box; }
.wss-root .side-head .preview-img { margin: 0; position: relative; flex: 0 0 auto; background-size: cover; }
.wss-root .sidebar .side-item .ico { width: calc(var(--u) * 16); height: calc(var(--u) * 16); }
.wss-root .btn .ico { width: calc(var(--u) * 12); height: calc(var(--u) * 12); }
.wss-px { image-rendering: pixelated; image-rendering: crisp-edges; }
.wss-plabel { position: absolute; left: calc(var(--u) * 3); bottom: calc(var(--u) * 3); background: rgba(0, 0, 0, 0.55); padding: calc(var(--u) * 1) calc(var(--u) * 4); }
.wss-main { font-family: 'VoxPixelBold', monospace; letter-spacing: calc(var(--u) * 0.6); font-size: calc(var(--u) * 10); }
.wss-root .section.head .wss-head-desc { font-family: 'VoxPixel', monospace; letter-spacing: 0; }
.wss-root .desc.wss-note { color: #ffd860; }
.wss-dim { opacity: 0.55; }
.wss-banner { margin: calc(var(--u) * 8) calc(var(--u) * 12) 0; background: #2f6be0; border: calc(var(--u) * 1) solid #1d4aa8; color: #fff; text-align: center; padding: calc(var(--u) * 7) calc(var(--u) * 10); line-height: 1.4; }
.wss-sel { user-select: text; -webkit-user-select: text; }
.wss-code { color: #9cf07a; overflow-wrap: anywhere; }
.wss-cmd { display: block; margin: calc(var(--u) * 4) 0; background: #141414; border: calc(var(--u) * 1) solid #000; padding: calc(var(--u) * 4) calc(var(--u) * 7); }
.wss-root .btn.wss-import { display: inline-flex; margin-top: calc(var(--u) * 6); }
.wss-root .seg .btn .wss-perm-ico { width: calc(var(--u) * 14); height: calc(var(--u) * 12); }
.wss-root .seg .btn.sel .wss-perm-ico { filter: brightness(0) invert(1); }
.wss-root .tabs.wss-tabs { padding: calc(var(--u) * 8) calc(var(--u) * 12) 0; gap: 0; }
.wss-packs { margin: 0 calc(var(--u) * 12) calc(var(--u) * 10); padding: calc(var(--u) * 4); background: var(--bg-dark); border: calc(var(--u) * 1) solid var(--line); border-top: 0; display: flex; flex-direction: column; gap: calc(var(--u) * 3); }
.wss-pack { display: flex; align-items: center; gap: calc(var(--u) * 6); background: var(--bg-mid); border: calc(var(--u) * 1) solid var(--line); padding: calc(var(--u) * 4) calc(var(--u) * 6); min-width: 0; }
.wss-pack .grow { flex: 1; min-width: 0; }
.wss-pack .desc { color: var(--text-dim); margin-top: calc(var(--u) * 2); }
.wss-pack-ico { width: calc(var(--u) * 24); height: calc(var(--u) * 24); flex: 0 0 auto; border: calc(var(--u) * 1) solid #000; background: #2a2a2b; box-sizing: border-box; display: flex; align-items: center; justify-content: center; }
.wss-pack-noico .ico { width: 70%; height: 70%; }
.wss-pack-btns { display: flex; gap: calc(var(--u) * 3); flex: 0 0 auto; }
.wss-root .btn.wss-small { min-height: calc(var(--u) * 16); padding: calc(var(--u) * 2) calc(var(--u) * 6) calc(var(--u) * 4); }
.wss-root .btn.wss-small.square { padding: calc(var(--u) * 2); min-width: calc(var(--u) * 18); }
.wss-root .btn.wss-small.square .ico { width: calc(var(--u) * 9); height: calc(var(--u) * 9); }
.wss-rank { width: calc(var(--u) * 10); text-align: center; color: var(--text-dim); flex: 0 0 auto; }
.wss-ell { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wss-clamp { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.wss-wrap { flex-wrap: wrap; }
.wss-rules { padding-bottom: calc(var(--u) * 8); }
.wss-root .side-item.wss-rule { gap: calc(var(--u) * 8); padding: calc(var(--u) * 5) calc(var(--u) * 12); border-bottom-color: var(--bg-dark); }
.wss-rule .grow { flex: 1; min-width: 0; }
.wss-rule .desc { color: var(--text-dim); margin-top: calc(var(--u) * 2); }
.wss-val { background: var(--green); padding: calc(var(--u) * 1) calc(var(--u) * 5); flex: 0 0 auto; }
.wss-val.off { background: var(--bg-dark); }
.wss-kv { display: grid; grid-template-columns: auto 1fr; gap: calc(var(--u) * 3) calc(var(--u) * 10); }
.wss-kv .k { color: var(--text-dim); }
.wss-kv .v { min-width: 0; overflow-wrap: anywhere; }
.wss-manage-btn { min-width: calc(var(--u) * 96); }
.wss-tpl-list { display: flex; flex-direction: column; gap: calc(var(--u) * 4); }
.modal.wss-tpl-modal { width: min(94vw, calc(var(--u) * 340)); }
.world-row.wss-tpl { min-height: calc(var(--u) * 34); }
.world-row.wss-tpl .thumb { width: calc(var(--u) * 48); margin: calc(var(--u) * 3); background-size: cover; }
.world-row.wss-tpl .info { gap: calc(var(--u) * 2); }
.world-row.wss-tpl .info .desc { color: var(--text-dim); white-space: normal; }
.world-row.wss-tpl.wss-on { background: #3a5a32; box-shadow: inset 0 0 0 calc(var(--u) * 1) #7ad04a; }
.world-row.wss-tpl .wss-check { align-self: center; padding: 0 calc(var(--u) * 8); color: #9cf07a; }
.wss-prog { display: flex; flex-direction: column; gap: calc(var(--u) * 6); }
.wss-prog .progress { height: calc(var(--u) * 4); }
`;

function ensureStyle(): void {
  if (document.getElementById('wss-style')) return;
  const s = document.createElement('style');
  s.id = 'wss-style';
  s.textContent = STYLE;
  document.head.appendChild(s);
}

function errMsg(e: unknown): string {
  if (e instanceof Error) return e.message || String(e);
  return String(e ?? 'Erreur inconnue');
}

function errorModal(title: string, e: unknown): void {
  modal(title, h('div', null, errMsg(e)), [['OK', () => undefined]]);
}

function formatDuration(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  if (s < 60) return `${s} s`;
  const hrs = Math.floor(s / 3600);
  const min = Math.floor((s % 3600) / 60);
  return hrs > 0 ? `${hrs} h ${String(min).padStart(2, '0')} min` : `${min} min`;
}

/** Nom de fichier sûr (Android et navigateurs). */
function fileName(name: string): string {
  const base = name.replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '_').trim().slice(0, 60);
  return (base || 'monde') + '.voxelia';
}

/** Copie profonde d'objets de réglages (données JSON pures). */
function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

/** Complète d'éventuels champs absents (mondes enregistrés par une version plus ancienne). */
function normalize(m: WorldMeta): WorldMeta {
  const base = newWorldMeta({ name: '', seed: 0, seedText: '' });
  const c = clone(m);
  return {
    ...base,
    ...c,
    rules: { ...defaultRules(), ...(c.rules ?? {}) },
    experiments: { ...base.experiments, ...(c.experiments ?? {}) },
    multiplayer: { ...base.multiplayer, ...(c.multiplayer ?? {}) },
    packs: Array.isArray(c.packs) ? [...c.packs] : [],
  };
}

const SIDE: Array<[SectionId, string, string]> = [
  ['general', 'gear', 'Général'],
  ['advanced', 'box', 'Avancé'],
  ['multiplayer', 'person', 'Multijoueur'],
  ['cheats', 'crystal', 'Triches'],
  ['packs', 'chest_icon', 'Packs de ressources'],
  ['rules', 'book', 'Règles du jeu'],
  ['experiments', 'flask', 'Expériences'],
  ['manage', 'disk', 'Gestion'],
];

export class WorldSettingsScreen implements Screen, WsHost {
  readonly el: HTMLElement;
  readonly meta: WorldMeta;
  readonly editing: boolean;
  hasPlayed = false;
  playerMode: GameMode | null = null;
  seedInput = '';
  packs: PackInfo[] | null = null;
  packsError = '';
  packTab: 'active' | 'available' = 'active';

  private section: SectionId = 'general';
  private readonly content: HTMLElement;
  private readonly preview: HTMLElement;
  private readonly previewLabel: HTMLElement;
  private readonly sideItems = new Map<SectionId, HTMLElement>();
  private readonly socialLabel: HTMLElement;
  /** Graine d'illustration tant qu'aucune graine n'est saisie. */
  private readonly previewSeed = (Math.random() * 0xffffffff) >>> 0;
  /** État enregistré (édition) : sert à savoir s'il y a des changements. */
  private snapshot = '';
  /** Mode de jeu choisi pour le personnage local, appliqué à sa sauvegarde à l'enregistrement. */
  private pendingMode: GameMode | null = null;
  private busy = false;
  private leaving = false;
  private deleted = false;
  private destroyed = false;

  constructor(
    readonly app: AppContext,
    private readonly existing: WorldMeta | null,
  ) {
    ensureStyle();
    this.editing = existing !== null;
    this.meta = existing ? normalize(existing) : newWorldMeta({ name: 'Mon monde', seed: 0, seedText: '' });
    this.snapshot = JSON.stringify(this.meta);

    // Barre du haut : retour, titre, social.
    const back = h('div', { class: 'back', role: 'button', title: 'Retour', 'aria-label': 'Retour' }, img('chevron_left'));
    back.addEventListener('click', () => {
      clickSound?.();
      this.app.ui.back();
    });
    this.socialLabel = h('span', null, 'Social (0)');
    const social = h('div', { class: 'social side-item wss-social focus-ring', tabindex: '0', role: 'button' }, img('social'), this.socialLabel);
    social.addEventListener('click', () => {
      clickSound?.();
      this.app.openSocial();
    });
    const topbar = h('div', { class: 'topbar' }, back, h('div', { class: 'title' }, this.editing ? 'PARAMÈTRES DU MONDE' : 'CRÉER UN NOUVEAU MONDE'), h('div', { class: 'spacer' }), social);

    // Colonne de gauche : aperçu, bouton principal, modèles, rubriques.
    this.previewLabel = h('div', { class: 'wss-plabel' });
    this.preview = h('div', { class: 'preview-img wss-px', role: 'img' }, this.previewLabel);
    const main = button(this.editing ? 'JOUER' : 'CRÉER', () => void this.primary(), 'green big wss-main');
    const tpl = button(this.editing ? 'Modèle : ' + templateName(this.meta.template) : 'Modèles', () => this.openTemplates(), 'purple');
    if (this.editing) {
      tpl.disabled = true;
      tpl.title = FIXED_NOTE;
    }
    const sidebar = h('div', { class: 'sidebar' }, h('div', { class: 'side-head' }, this.preview, main, tpl));
    for (const [id, ico, label] of SIDE) {
      if (id === 'manage' && !this.editing) continue;
      const it = h('div', { class: 'side-item focus-ring', tabindex: '0', role: 'tab', 'data-wss-key': 'side-' + id }, img(ico), h('span', null, label));
      it.addEventListener('click', () => {
        if (this.section === id) return;
        clickSound?.();
        this.goto(id);
      });
      this.sideItems.set(id, it);
      sidebar.appendChild(it);
    }

    this.content = h('div', { class: 'content', role: 'tabpanel' });
    const body = h('div', { class: 'screen-body' }, h('div', { class: 'split' }, sidebar, this.content));
    // Barre du haut placée en dernier dans le DOM (affichée en haut via « order ») :
    // la manette commence ainsi sur le bouton principal plutôt que sur « Social ».
    this.el = h('div', { class: 'screen wss-root' }, body, topbar);

    this.updateSocial();
    this.refreshPreview();
    this.goto('general');
    void this.loadPacks();
    void this.loadPlayerInfo();
  }

  destroy(): void {
    this.destroyed = true;
  }

  /** Retour : en édition, enregistre d'abord les changements. En création, rien n'est gardé. */
  onBack(): boolean {
    if (!this.editing || this.deleted || this.leaving) return false;
    this.leaving = true;
    this.commit()
      .then((changed) => {
        if (changed) toast('Paramètres enregistrés');
        if (!this.destroyed && this.app.ui.current === this) this.app.ui.pop();
      })
      .catch((e) => {
        this.leaving = false;
        errorModal('Enregistrement impossible', e);
      });
    return true;
  }

  // ---------------------------------------------------------------- contrat WsHost
  changed(): void {
    this.refreshPreview();
  }

  goto(section: SectionId): void {
    if (section === 'manage' && !this.editing) return;
    this.section = section;
    for (const [id, el] of this.sideItems) {
      el.classList.toggle('active', id === section);
      el.setAttribute('aria-selected', String(id === section));
    }
    this.content.scrollTop = 0;
    this.render(false);
  }

  rerender(): void {
    this.render(true);
  }

  setPlayerMode(mode: GameMode): void {
    if (this.editing) this.pendingMode = mode;
  }

  openTemplates(): void {
    if (this.editing) return;
    const seed = this.currentPreviewSeed();
    let close: () => void = () => undefined;
    let selected: HTMLElement | null = null;
    const list = h('div', { class: 'wss-tpl-list' });
    for (const t of TEMPLATES) {
      const on = this.meta.template === t.id;
      const thumb = h('div', { class: 'thumb wss-px' });
      thumb.style.backgroundImage = `url("${templateArt(t.id, seed)}")`;
      const row = h(
        'div',
        { class: 'world-row focus-ring wss-tpl' + (on ? ' wss-on' : ''), tabindex: '0', role: 'button', 'aria-pressed': String(on) },
        thumb,
        h('div', { class: 'info' }, h('div', { class: 'name' }, t.name), h('div', { class: 'desc' }, t.desc)),
        on ? h('div', { class: 'wss-check' }, 'Choisi') : null,
      );
      row.addEventListener('click', () => {
        clickSound?.();
        this.meta.template = t.id;
        close();
        this.changed();
        toast(`Modèle « ${t.name} » choisi`);
        if (this.section === 'advanced') this.rerender();
      });
      if (on) selected = row;
      list.appendChild(row);
    }
    close = modal('Modèles de monde', h('div', { class: 'wss-tpl-list' }, h('div', { class: 'dim' }, 'Forme générale du terrain (définitive une fois le monde créé).'), list), [['Fermer', () => undefined]]);
    list.closest('.modal')?.classList.add('wss-tpl-modal');
    (selected as HTMLElement | null)?.focus();
  }

  async importPack(): Promise<void> {
    const file = await pickFile('.zip,.mcpack,application/zip');
    if (!file || this.destroyed) return;
    const fill = h('div', { class: 'fill', style: 'width:0%' });
    const pct = h('div', { class: 'dim' }, '0 %');
    const close = modal('Importation du pack', h('div', { class: 'wss-prog' }, h('div', { class: 'wss-ell' }, file.name), h('div', { class: 'progress' }, fill), pct), []);
    try {
      const info = await this.app.packs.importPack(file, undefined, (p) => {
        const v = Math.max(0, Math.min(1, Number(p) || 0));
        fill.style.width = (v * 100).toFixed(1) + '%';
        pct.textContent = Math.round(v * 100) + ' %';
      });
      close();
      if (this.destroyed) return;
      if (!this.meta.packs.includes(info.id)) this.meta.packs.unshift(info.id);
      this.packTab = 'active';
      this.changed();
      toast(`Pack « ${info.name || file.name} » importé et activé pour ce monde`);
      await this.loadPacks();
    } catch (e) {
      close();
      errorModal('Importation impossible', e);
    }
  }

  // ---------------------------------------------------------------- affichage
  private render(keep: boolean): void {
    const active = document.activeElement as HTMLElement | null;
    const key = keep && active && this.content.contains(active) ? active.dataset.wssKey : undefined;
    const scroll = keep ? this.content.scrollTop : 0;
    let nodes: HTMLElement[];
    switch (this.section) {
      case 'general':
        nodes = generalSection(this);
        break;
      case 'advanced':
        nodes = advancedSection(this);
        break;
      case 'multiplayer':
        nodes = multiplayerSection(this);
        break;
      case 'cheats':
        nodes = cheatsSection(this);
        break;
      case 'packs':
        nodes = packsSection(this);
        break;
      case 'rules':
        nodes = rulesSection(this);
        break;
      case 'experiments':
        nodes = experimentsSection(this);
        break;
      case 'manage':
        nodes = this.manageSection();
        break;
    }
    this.content.replaceChildren(...nodes);
    this.content.scrollTop = scroll;
    if (key) this.content.querySelector<HTMLElement>(`[data-wss-key="${CSS.escape(key)}"]`)?.focus({ preventScroll: true });
  }

  private currentPreviewSeed(): number {
    if (this.editing) return this.meta.seed;
    return this.seedInput.trim() ? seedFromInput(this.seedInput) : this.previewSeed;
  }

  private refreshPreview(): void {
    const m = this.meta;
    const url = this.editing && m.thumbnail ? m.thumbnail : templateArt(m.template, this.currentPreviewSeed());
    this.preview.style.backgroundImage = `url("${url.replace(/"/g, '%22')}")`;
    this.preview.classList.toggle('wss-px', !(this.editing && m.thumbnail));
    this.previewLabel.textContent = templateName(m.template);
    this.preview.setAttribute('aria-label', 'Aperçu du monde : modèle ' + templateName(m.template));
  }

  /** « Social (n) » : joueurs en ligne avec vous (0 au menu). */
  private updateSocial(): void {
    let n = 0;
    try {
      n = this.app.game?.net?.remotePlayers().length ?? 0;
    } catch {
      n = 0;
    }
    this.socialLabel.textContent = `Social (${n})`;
  }

  // ---------------------------------------------------------------- données
  private async loadPacks(): Promise<void> {
    try {
      this.packs = await this.app.packs.list();
      this.packsError = '';
    } catch (e) {
      this.packs = null;
      this.packsError = errMsg(e);
    }
    if (!this.destroyed && this.section === 'packs') this.rerender();
  }

  /** Édition : le personnage local existe-t-il déjà (mode actuel, réglages de première apparition) ? */
  private async loadPlayerInfo(): Promise<void> {
    if (!this.editing) return;
    try {
      const save = await this.app.saves.loadPlayer(this.meta.id);
      if (this.destroyed || !save) return;
      this.hasPlayed = true;
      this.playerMode = save.gameMode ?? null;
      if (this.section === 'general' || this.section === 'advanced') this.rerender();
    } catch {
      /* sans sauvegarde lisible, les réglages de première apparition restent modifiables */
    }
  }

  /** Enregistre les changements (édition). Renvoie true si quelque chose a été écrit. */
  private async commit(): Promise<boolean> {
    const m = this.meta;
    m.name = m.name.trim() || this.existing?.name || 'Mon monde';
    let wrote = false;
    const json = JSON.stringify(m);
    if (json !== this.snapshot) {
      await this.app.saves.updateMeta(m);
      this.snapshot = json;
      wrote = true;
    }
    const mode = this.pendingMode;
    this.pendingMode = null;
    if (mode && mode !== this.playerMode) {
      // Le personnage garde son propre mode dans sa sauvegarde : on l'aligne sur le choix fait ici.
      const save = await this.app.saves.loadPlayer(m.id);
      if (save) {
        save.gameMode = mode;
        if (mode !== 'creative') save.flying = false;
        await this.app.saves.db.batch([{ store: 'players', key: m.id + '|local', value: save }]);
        wrote = true;
      }
      this.playerMode = mode;
    }
    return wrote;
  }

  /** Nouveau monde à partir des choix de l'écran (identifiant et dates neufs). */
  private buildNewMeta(): WorldMeta {
    const d = clone(this.meta);
    const typed = this.seedInput.trim();
    const seed = seedFromInput(typed);
    return newWorldMeta({
      name: d.name.trim() || 'Mon monde',
      seed,
      seedText: typed || String(seed),
      gameMode: d.gameMode,
      difficulty: d.difficulty,
      template: d.template,
      startingMap: d.startingMap,
      bonusChest: d.bonusChest,
      showCoordinates: d.showCoordinates,
      caves: d.caves,
      structures: d.structures,
      cheats: d.cheats,
      rules: d.rules,
      experiments: d.experiments,
      multiplayer: d.multiplayer,
      packs: d.packs,
      sharedPacks: d.sharedPacks,
      time: d.time,
    });
  }

  /** CRÉER (nouveau monde) ou JOUER (monde existant). */
  private async primary(): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    try {
      if (this.editing) {
        await this.commit();
        await this.app.startWorld(this.meta);
      } else {
        const m = this.buildNewMeta();
        await this.app.saves.createWorld(m);
        await this.app.startWorld(m);
      }
    } catch (e) {
      errorModal(this.editing ? 'Impossible de lancer le monde' : 'Impossible de créer le monde', e);
    } finally {
      this.busy = false;
    }
  }

  // ================================================================ Gestion (édition)
  private manageSection(): HTMLElement[] {
    const m = this.meta;
    const kv = (k: string, v: string | HTMLElement): HTMLElement[] => [h('div', { class: 'k' }, k), h('div', { class: 'v' }, v)];
    const info = h(
      'div',
      { class: 'section' },
      h(
        'div',
        { class: 'wss-kv' },
        kv('Taille', formatBytes(m.sizeBytes || 0)),
        kv('Créé le', formatDate(m.created || Date.now())),
        kv('Dernière partie', formatDate(m.lastPlayed || m.created || Date.now())),
        kv('Temps de jeu', formatDuration(m.playTime || 0)),
        kv('Identifiant', h('span', { class: 'wss-code wss-sel' }, m.id)),
      ),
    );
    const action = (key: string, title: string, desc: string, btn: HTMLButtonElement): HTMLElement => {
      btn.dataset.wssKey = key;
      btn.classList.add('wss-manage-btn');
      return h('div', { class: 'section' }, h('div', { class: 'row wss-wrap' }, h('div', { class: 'grow' }, h('div', null, title), h('div', { class: 'desc' }, desc)), btn));
    };
    return [
      h('div', { class: 'section head' }, 'CE MONDE'),
      info,
      h('div', { class: 'section head' }, 'ACTIONS'),
      action('m-export', 'Exporter le monde', 'Enregistre le monde complet dans un fichier .voxelia, à réimporter depuis « Jouer » sur cet appareil ou un autre. Vos modifications sont enregistrées avant.', button('Exporter', () => void this.exportWorld(), 'dark', 'export')),
      action('m-copy', 'Copier le monde', 'Ajoute à votre liste un double indépendant de ce monde, nommé « (copie) ».', button('Copier', () => void this.copyWorld(), 'dark', 'copy')),
      action('m-delete', 'Supprimer le monde', 'Efface définitivement ce monde de l’appareil. Pensez à l’exporter avant si vous voulez le garder.', button('Supprimer', () => this.askDelete(), 'red', 'trash')),
    ];
  }

  private async exportWorld(): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    try {
      await this.commit();
      toast('Exportation du monde…', 4000);
      const blob = await this.app.saves.exportWorld(this.meta.id);
      if (!blob) throw new Error('Ce monde est introuvable dans la sauvegarde.');
      const path = await saveFile(fileName(this.meta.name), blob);
      toast(path ? 'Monde exporté : ' + path : 'Monde exporté', 5000);
    } catch (e) {
      errorModal('Exportation impossible', e);
    } finally {
      this.busy = false;
    }
  }

  private async copyWorld(): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    try {
      await this.commit();
      toast('Copie du monde…', 4000);
      const copy = await this.app.saves.copyWorld(this.meta.id);
      if (!copy) throw new Error('Ce monde est introuvable dans la sauvegarde.');
      toast(`Copie créée : « ${copy.name} »`, 4000);
    } catch (e) {
      errorModal('Copie impossible', e);
    } finally {
      this.busy = false;
    }
  }

  private askDelete(): void {
    if (this.busy) return;
    const name = this.meta.name.trim() || this.existing?.name || 'ce monde';
    confirmDialog('Supprimer le monde', `« ${name} » sera supprimé définitivement de cet appareil, avec tout ce que vous y avez construit. Cette action est irréversible.`, 'Supprimer', () => void this.doDelete(name));
  }

  private async doDelete(name: string): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    try {
      await this.app.saves.deleteWorld(this.meta.id);
      this.deleted = true;
      toast(`Monde « ${name} » supprimé`);
      if (!this.destroyed && this.app.ui.current === this) this.app.ui.back();
    } catch (e) {
      errorModal('Suppression impossible', e);
    } finally {
      this.busy = false;
    }
  }
}
