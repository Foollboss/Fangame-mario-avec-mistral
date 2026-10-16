/**
 * Écran « Jouer » : onglets Mondes (liste locale, import, création), Invitations
 * (rejoindre le serveur d'un ami avec un code, héberger le sien) et Serveurs
 * (liste enregistrée avec état en direct : latence, joueurs, message du serveur).
 */
import { button, clickSound, confirmDialog, formatBytes, formatDate, h, img, modal, pickFile, textField, toast, toggle } from '../dom';
import { defaultWorldThumb, promoArt, serverBanner, serverIcon } from './PlayArt';
import { DEFAULT_PORT, queryStatus, serverUrl, validateAddress, type ServerStatus } from './ServerStatus';
import { PROTOCOL_VERSION } from '../../net/protocol';
import type { AppContext, PlayTab } from '../../core/AppContext';
import type { Settings } from '../../core/Settings';
import type { WorldMeta, GameMode } from '../../save/SaveManager';
import type { Screen } from '../UIManager';

type SavedServer = Settings['servers'][number];

const MODE_LABEL: Record<GameMode, string> = { survival: 'Survie', creative: 'Créatif', adventure: 'Aventure', spectator: 'Spectateur' };

/** Durée pendant laquelle un état de serveur reste valable avant nouvelle interrogation. */
const STATUS_TTL = 30000;

// ---------------------------------------------------------------- styles propres à l'écran (injectés une fois)
const STYLE = `
.ps-root { background: rgba(0, 0, 0, 0.28); }
.ps-root > .topbar { order: -1; }
.ps-root .topbar .back .ico { width: calc(var(--u) * 20); height: calc(var(--u) * 20); }
.ps-root .tab .ico { width: calc(var(--u) * 16); height: calc(var(--u) * 16); }
.ps-root .btn .ico { width: calc(var(--u) * 14); height: calc(var(--u) * 14); }
.ps-root .topbar .social.ps-social { padding: 0 calc(var(--u) * 8); border-bottom: 0; color: #1e1e1f; gap: calc(var(--u) * 3); background: transparent; }
.ps-root .topbar .social.ps-social:hover, .ps-root .topbar .social.ps-social:focus-visible { background: #d4d6d9; }
.ps-root .topbar .social.ps-social .ico { width: calc(var(--u) * 17); height: calc(var(--u) * 17); }
.ps-px { image-rendering: pixelated; image-rendering: crisp-edges; }
.ps-ell { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ps-sel { user-select: text; -webkit-user-select: text; }
.ps-panel { height: 100%; display: flex; flex-direction: column; box-sizing: border-box; }
.ps-panel > .world-list { flex: 1; height: auto; min-height: 0; }
.world-row .edit.ps-edit { flex: 0 0 auto; flex-direction: column; gap: calc(var(--u) * 3); background: transparent; color: #fff; border: 0; border-left: calc(var(--u) * 1) solid var(--line); box-shadow: none; padding: 0; min-height: 0; }
.world-row .edit.ps-edit:hover, .world-row .edit.ps-edit:focus-visible { background: #626364; }
.world-row .edit.ps-edit:active { padding: 0; box-shadow: none; }
.ps-root .world-row .edit.ps-edit .ico { width: calc(var(--u) * 18); height: calc(var(--u) * 18); }
.ps-invites { padding: calc(var(--u) * 6); gap: calc(var(--u) * 6); overflow-y: auto; }
.ps-inv-actions { display: flex; justify-content: flex-end; gap: calc(var(--u) * 6); flex: 0 0 auto; flex-wrap: wrap; }
.ps-inv-actions .btn { min-width: 36%; color: #3b3b3b; }
.ps-promo { position: relative; flex: 1 0 auto; min-height: calc(var(--u) * 96); background: #0d0a2e; border: calc(var(--u) * 1) solid var(--line); overflow: hidden; display: flex; align-items: center; }
.ps-promo-art { position: absolute; right: 0; top: 0; height: 100%; width: 64%; object-fit: cover; object-position: right center; pointer-events: none; }
.ps-promo-text { position: relative; width: 58%; box-sizing: border-box; padding: calc(var(--u) * 12) calc(var(--u) * 14); display: flex; flex-direction: column; gap: calc(var(--u) * 6); }
.ps-promo-title { font-family: 'VoxPixelBold', monospace; color: #ff48d6; font-size: calc(var(--u) * 11); letter-spacing: calc(var(--u) * 0.6); line-height: 1.15; text-shadow: 0 calc(var(--u) * 1) 0 #3a0a3a; }
.ps-promo-desc { line-height: 1.45; color: #f0ecff; }
.ps-promo-text .btn { align-self: flex-start; }
.ps-root .server-list { background: rgba(30, 30, 31, 0.55); border: calc(var(--u) * 1) solid var(--line); }
.ps-root .server-item .sico { overflow: hidden; }
.ps-fill-img { width: 100%; height: 100%; display: block; }
.ps-root .server-item.ps-add .sico { background: var(--green); }
.ps-root .server-item.ps-add .sico img { width: 70%; height: 70%; }
.ps-stext { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: calc(var(--u) * 2); }
.ps-dot { flex: 0 0 auto; width: calc(var(--u) * 5); height: calc(var(--u) * 5); background: #6a6b6c; border: calc(var(--u) * 1) solid #000; }
.ps-dot.on { background: #5cd047; }
.ps-dot.off { background: #c33636; }
.ps-root .server-banner { flex: 0 0 auto; min-height: calc(var(--u) * 48); overflow: hidden; }
.ps-banner-art { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 75%; }
.ps-band { position: absolute; left: 0; right: 0; bottom: 0; height: 42%; background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7)); }
.ps-stat { display: flex; align-items: center; gap: calc(var(--u) * 3); }
.ps-root .ps-stat .ico { width: calc(var(--u) * 14); height: calc(var(--u) * 14); }
.ps-bars { display: flex; align-items: flex-end; gap: calc(var(--u) * 1); height: calc(var(--u) * 8); }
.ps-bars i { display: block; width: calc(var(--u) * 2); background: rgba(255, 255, 255, 0.25); }
.ps-bars i:nth-child(1) { height: 38%; }
.ps-bars i:nth-child(2) { height: 66%; }
.ps-bars i:nth-child(3) { height: 100%; }
.ps-off { color: #ff8a8a; }
.ps-warn { color: #ffd860; }
.ps-detail-scroll { flex: 1; min-height: 0; overflow-y: auto; }
.ps-sname { flex: 1; min-width: 0; }
.ps-actions { display: flex; gap: calc(var(--u) * 6); padding: calc(var(--u) * 8) calc(var(--u) * 12); flex-wrap: wrap; }
.ps-actions .btn { flex: 1 1 0; }
.ps-empty-detail { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: calc(var(--u) * 8); padding: calc(var(--u) * 12); text-align: center; color: var(--text-dim); }
.ps-form { display: flex; flex-direction: column; gap: calc(var(--u) * 4); }
.ps-flabel { color: var(--text-dim); margin-top: calc(var(--u) * 2); }
.ps-cmd { background: #141414; border: calc(var(--u) * 1) solid #000; padding: calc(var(--u) * 5) calc(var(--u) * 7); color: #9cf07a; word-break: break-all; user-select: text; -webkit-user-select: text; }
.ps-code { color: #9cf07a; user-select: text; -webkit-user-select: text; }
.ps-steps { margin: 0; padding-left: calc(var(--u) * 14); display: flex; flex-direction: column; gap: calc(var(--u) * 4); }
`;

function ensureStyle(): void {
  if (document.getElementById('ps-style')) return;
  const s = document.createElement('style');
  s.id = 'ps-style';
  s.textContent = STYLE;
  document.head.appendChild(s);
}

function errMsg(e: unknown): string {
  if (e instanceof Error) return e.message || String(e);
  return String(e ?? 'Erreur inconnue');
}

function randomCode(): string {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(6);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  return [...bytes].map((b) => abc[b % abc.length]).join('');
}

/** Copie dans le presse-papiers (API moderne, sinon repli par sélection). */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* repli ci-dessous */
  }
  try {
    const ta = h('textarea', { style: 'position:fixed;left:-9999px;top:0' });
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Interrupteur O/I : Entrée bascule une seule fois (sans repasser par la navigation du menu). */
function switchCtl(value: boolean, onChange: (v: boolean) => void): HTMLElement {
  const t = toggle(value, onChange);
  t.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).code === 'Enter') e.stopPropagation();
  });
  return t;
}

/** Entrée dans un champ = bouton principal (vert) de la fenêtre. */
function submitOnEnter(fields: HTMLInputElement[]): void {
  for (const f of fields)
    f.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      f.closest('.modal')?.querySelector<HTMLElement>('.modal-actions .btn.green')?.click();
    });
}

function flabel(text: string): HTMLElement {
  return h('div', { class: 'ps-flabel' }, text);
}

interface StatusView {
  key: string;
  apply(s: ServerStatus): void;
}

export class PlayScreen implements Screen {
  readonly el: HTMLElement;
  private tab: PlayTab;
  private readonly body: HTMLElement;
  private readonly tabEls = new Map<PlayTab, HTMLElement>();
  private readonly worldsLabel: HTMLElement;
  private readonly socialLabel: HTMLElement;

  private worlds: WorldMeta[] = [];
  private worldsState: 'loading' | 'ready' | 'error' = 'loading';
  private worldsError = '';
  private worldReq = 0;

  private selected = 0;
  private readonly status = new Map<string, ServerStatus>();
  private views: StatusView[] = [];
  private readonly abort = new AbortController();

  private readonly observer: MutationObserver;
  private hidden = false;
  private busy = false;
  private destroyed = false;

  constructor(
    private readonly app: AppContext,
    tab: PlayTab = 'worlds',
  ) {
    ensureStyle();
    this.tab = tab;

    // Barre du haut : retour, titre, social.
    const back = h('div', { class: 'back', role: 'button', title: 'Retour', 'aria-label': 'Retour' }, img('chevron_left'));
    back.addEventListener('click', () => {
      clickSound?.();
      this.app.ui.back();
    });
    this.socialLabel = h('span', null, 'Social (0)');
    const social = h('div', { class: 'social side-item ps-social focus-ring', tabindex: '0', role: 'button' }, img('social'), this.socialLabel);
    social.addEventListener('click', () => {
      clickSound?.();
      this.app.openSocial();
    });
    const topbar = h('div', { class: 'topbar' }, back, h('div', { class: 'title' }, 'JOUER'), h('div', { class: 'spacer' }), social);

    // Onglets.
    const tabs = h('div', { class: 'tabs', role: 'tablist' });
    this.worldsLabel = h('span', null, 'Mondes');
    const defs: Array<[PlayTab, string, HTMLElement]> = [
      ['worlds', 'world', this.worldsLabel],
      ['invites', 'realm', h('span', null, 'Invitations')],
      ['servers', 'globe', h('span', null, 'Serveurs')],
    ];
    for (const [id, ico, label] of defs) {
      const t = h('div', { class: 'tab focus-ring', tabindex: '0', role: 'tab' }, img(ico), label);
      t.addEventListener('click', () => {
        if (this.tab === id) return;
        clickSound?.();
        this.select(id);
      });
      this.tabEls.set(id, t);
      tabs.appendChild(t);
    }

    this.body = h('div', { class: 'screen-body' });
    // Barre du haut placée en dernier dans le DOM (affichée en haut via « order ») : la manette
    // commence ainsi sur les onglets plutôt que sur « Social ».
    this.el = h('div', { class: 'screen ps-root' }, tabs, this.body, topbar);

    // L'UIManager masque l'écran (display:none) quand un autre est empilé : on rafraîchit au retour.
    this.observer = new MutationObserver(() => this.onVisibility());
    this.observer.observe(this.el, { attributes: true, attributeFilter: ['style'] });

    this.select(tab);
    void this.refreshWorlds();
    this.pingAll(false);
  }

  destroy(): void {
    this.destroyed = true;
    this.observer.disconnect();
    this.abort.abort();
    this.views = [];
  }

  // ---------------------------------------------------------------- navigation interne
  private select(tab: PlayTab): void {
    this.tab = tab;
    for (const [id, el] of this.tabEls) {
      el.classList.toggle('active', id === tab);
      el.setAttribute('aria-selected', String(id === tab));
    }
    this.render();
  }

  /** Reconstruit l'onglet actif en conservant l'élément focalisé (clavier / manette). */
  private render(): void {
    const active = document.activeElement as HTMLElement | null;
    const focusKey = active && this.body.contains(active) ? active.dataset.psKey : undefined;
    this.views = [];
    const panel = this.tab === 'worlds' ? this.worldsPanel() : this.tab === 'invites' ? this.invitesPanel() : this.serversPanel();
    this.body.replaceChildren(panel);
    if (focusKey) this.body.querySelector<HTMLElement>(`[data-ps-key="${CSS.escape(focusKey)}"]`)?.focus();
  }

  private onVisibility(): void {
    if (this.destroyed) return;
    if (this.el.style.display === 'none') {
      this.hidden = true;
      return;
    }
    if (!this.hidden) return;
    this.hidden = false;
    void this.refreshWorlds();
    this.pingAll(false);
    if (this.tab !== 'worlds') this.render();
    this.updateSocial();
  }

  private errorModal(title: string, e: unknown): void {
    modal(title, h('div', null, errMsg(e)), [['OK', () => undefined]]);
  }

  // ================================================================ onglet Mondes
  private async refreshWorlds(): Promise<void> {
    const req = ++this.worldReq;
    try {
      const list = await this.app.saves.listWorlds();
      if (req !== this.worldReq || this.destroyed) return;
      this.worlds = list;
      this.worldsState = 'ready';
    } catch (e) {
      if (req !== this.worldReq || this.destroyed) return;
      this.worldsState = 'error';
      this.worldsError = errMsg(e);
    }
    this.worldsLabel.textContent = this.worldsState === 'ready' ? `Mondes (${this.worlds.length})` : 'Mondes';
    if (this.tab === 'worlds') this.render();
  }

  private worldsPanel(): HTMLElement {
    const importBtn = button('Importer', () => void this.importWorld(), 'dark', 'folder');
    importBtn.dataset.psKey = 'import';
    const createBtn = button('Créer un nouveau monde', () => this.app.openCreateWorld(), 'green');
    createBtn.dataset.psKey = 'create';
    const actions = h('div', { class: 'world-actions' }, importBtn, createBtn);
    const list = h('div', { class: 'world-list' });
    if (this.worldsState === 'loading') list.append(h('div', { class: 'empty-msg' }, 'Chargement des mondes…'));
    else if (this.worldsState === 'error') list.append(h('div', { class: 'empty-msg' }, 'Impossible de lire les mondes enregistrés : ' + this.worldsError));
    else if (!this.worlds.length) list.append(h('div', { class: 'empty-msg' }, 'Aucun monde pour le moment. Créez votre premier monde avec « Créer un nouveau monde » ou importez un fichier .voxelia.'));
    else for (const meta of this.worlds) list.append(this.worldRow(meta));
    return h('div', { class: 'ps-panel' }, actions, list);
  }

  private worldRow(meta: WorldMeta): HTMLElement {
    const thumb = h('div', { class: 'thumb' });
    if (meta.thumbnail) thumb.style.backgroundImage = `url("${meta.thumbnail.replace(/"/g, '%22')}")`;
    else {
      thumb.classList.add('ps-px');
      thumb.style.backgroundImage = `url("${defaultWorldThumb(meta.seed ?? 0)}")`;
    }
    const badges = h('div', { class: 'badges' }, h('span', { class: 'badge' }, MODE_LABEL[meta.gameMode] ?? 'Survie'));
    if (meta.experiments?.drop3 || meta.experiments?.tradeRebalance) badges.append(h('span', { class: 'badge yellow' }, 'Expérimental'));
    if (meta.cheats) badges.append(h('span', { class: 'badge green' }, 'Triches'));
    const info = h('div', { class: 'info' }, h('div', { class: 'name' }, meta.name || 'Monde sans nom'), badges);
    const metaEl = h('div', { class: 'meta' }, h('div', null, formatBytes(meta.sizeBytes || 0)), h('div', null, formatDate(meta.lastPlayed || meta.created || Date.now())));
    const edit = button('Modifier', () => this.app.openEditWorld(meta), 'edit ps-edit', 'pencil');
    edit.dataset.psKey = 'e-' + meta.id;
    const row = h('div', { class: 'world-row focus-ring', tabindex: '0', role: 'button', 'data-ps-key': 'w-' + meta.id, 'aria-label': 'Jouer à ' + (meta.name || 'ce monde') }, thumb, info, metaEl, edit);
    row.addEventListener('click', () => {
      clickSound?.();
      this.launchWorld(meta);
    });
    return row;
  }

  private launchWorld(meta: WorldMeta): void {
    if (this.busy) return;
    this.busy = true;
    this.app
      .startWorld(meta)
      .catch((e) => this.errorModal('Impossible de lancer le monde', e))
      .finally(() => {
        this.busy = false;
      });
  }

  private async importWorld(): Promise<void> {
    const file = await pickFile('.voxelia,application/octet-stream');
    if (!file) return;
    toast('Importation de « ' + file.name + ' »…', 4000);
    try {
      const meta = await this.app.saves.importWorld(file);
      toast('Monde « ' + meta.name + ' » importé');
      await this.refreshWorlds();
    } catch (e) {
      this.errorModal('Importation impossible', e);
    }
  }

  // ================================================================ onglet Invitations
  private invitesPanel(): HTMLElement {
    const join = button('Rejoindre avec une invitation', () => this.joinInviteModal(), '', 'mail');
    join.dataset.psKey = 'inv-join';
    const host = button('Héberger un serveur', () => this.hostModal(), '', 'realm');
    host.dataset.psKey = 'inv-host';
    const list = button('Voir mes serveurs', () => this.select('servers'), 'purple', 'globe');
    list.dataset.psKey = 'inv-list';
    const text = h(
      'div',
      { class: 'ps-promo-text' },
      h('div', { class: 'ps-promo-title' }, 'VOTRE PROPRE SERVEUR, TOUJOURS EN LIGNE'),
      h(
        'div',
        { class: 'ps-promo-desc' },
        "Lancez le serveur Voxelia sur un ordinateur de la maison et invitez vos amis ! C'est vous qui fixez les règles : chaque joueur est visiteur, membre ou opérateur, l'entrée peut être protégée par un code d'invitation et le monde est sauvegardé sur le serveur. Il reste ouvert tant que l'ordinateur tourne, même quand vous n'êtes pas connecté.",
      ),
      list,
    );
    const promo = h('div', { class: 'ps-promo' }, h('img', { class: 'ps-promo-art ps-px', src: promoArt(), alt: '', draggable: 'false' }), text);
    return h('div', { class: 'ps-panel ps-invites' }, h('div', { class: 'ps-inv-actions' }, join, host), promo);
  }

  private joinInviteModal(): void {
    let address = '';
    let code = '';
    let name = '';
    let save = true;
    const addrF = textField('', 'hôte:port (ex. 192.168.1.20:' + DEFAULT_PORT + ')', (v) => (address = v), 120);
    const codeF = textField('', 'Code fourni par votre ami (si demandé)', (v) => (code = v), 32);
    const nameF = textField('', 'Nom dans la liste (facultatif)', (v) => (name = v), 40);
    const sw = switchCtl(save, (v) => {
      save = v;
      nameF.disabled = !v;
    });
    const body = h(
      'div',
      { class: 'ps-form' },
      flabel('Adresse du serveur'),
      addrF,
      flabel("Code d'invitation"),
      codeF,
      h('div', { class: 'row' }, h('div', { class: 'grow' }, 'Enregistrer dans mes serveurs'), sw),
      nameF,
    );
    modal('Rejoindre avec une invitation', body, [
      ['Annuler', () => undefined],
      [
        'Rejoindre',
        () => {
          const err = validateAddress(address);
          if (err) {
            toast(err);
            addrF.focus();
            return false;
          }
          const addr = address.trim();
          const inv = code.trim() || undefined;
          if (save) {
            const s: SavedServer = { name: name.trim() || addr, address: addr };
            if (inv) s.invite = inv;
            this.upsertServer(s);
          }
          this.join(addr, inv);
        },
        'green',
      ],
    ]);
    submitOnEnter([addrF, codeF, nameF]);
  }

  private hostModal(): void {
    const code = randomCode();
    const cmd = `npm run server -- --port ${DEFAULT_PORT} --name "Mon serveur" --invite ${code}`;
    let close: () => void = () => undefined;
    const addLocal = button(
      'Ajouter ce PC (localhost) à mes serveurs',
      () => {
        const i = this.upsertServer({ name: 'Mon serveur (ce PC)', address: 'localhost:' + DEFAULT_PORT, invite: code });
        close();
        this.selected = i;
        this.select('servers');
        toast('Serveur ajouté à la liste');
      },
      'dark',
    );
    const body = h(
      'div',
      { class: 'ps-form' },
      h('div', null, "Le serveur Voxelia est fourni avec le jeu. Pour l'héberger sur un ordinateur :"),
      h(
        'ol',
        { class: 'ps-steps' },
        h('li', null, 'Installez Node.js (version 22.6 ou plus récente).'),
        h('li', null, 'Ouvrez un terminal dans le dossier « voxelia » du jeu ; la première fois, tapez ', h('span', { class: 'ps-code' }, 'npm install'), '.'),
        h('li', null, 'Lancez le serveur avec cette commande (CODE = ', h('span', { class: 'ps-code' }, code), ', à changer si vous voulez) :'),
      ),
      h('div', { class: 'ps-cmd' }, cmd),
      h(
        'div',
        null,
        `Vos amis connectés au même réseau (Wi-Fi) choisissent « Rejoindre avec une invitation », puis saisissent l'adresse IP locale de ce PC suivie de :${DEFAULT_PORT} (ex. 192.168.1.20:${DEFAULT_PORT}) et le code. L'adresse IP s'affiche avec « ipconfig » (Windows) ou « ip addr » (Linux).`,
      ),
      h('div', { class: 'dim' }, `Le serveur reste en ligne tant que le PC est allumé et le terminal ouvert. Pour des joueurs hors de chez vous, redirigez le port ${DEFAULT_PORT} sur votre box internet.`),
      h('div', { class: 'dim' }, 'Vous jouez sur ce même PC ? Ajoutez-le directement :'),
      addLocal,
    );
    close = modal('Héberger un serveur', body, [
      ['Fermer', () => undefined],
      [
        'Copier la commande',
        () => {
          void copyText(cmd).then((ok) => toast(ok ? 'Commande copiée' : 'Copie impossible : recopiez la commande à la main'));
          return false;
        },
        'green',
      ],
    ]);
    // La fenêtre focalise le premier bouton (en bas du texte) : on revient au début des explications.
    body.parentElement?.scrollTo(0, 0);
    body.closest('.modal')?.querySelector<HTMLElement>('.modal-actions .btn.green')?.focus({ preventScroll: true });
  }

  // ================================================================ onglet Serveurs
  private servers(): SavedServer[] {
    return [...(this.app.settings.data.servers ?? [])];
  }

  private saveServers(list: SavedServer[]): void {
    this.app.settings.set('servers', list);
    this.pingAll(false);
    this.updateSocial();
  }

  /** Ajoute ou met à jour (même adresse) un serveur ; renvoie son index. */
  private upsertServer(s: SavedServer): number {
    const list = this.servers();
    const key = serverUrl(s.address);
    const idx = list.findIndex((x) => serverUrl(x.address) === key);
    if (idx >= 0) {
      const merged: SavedServer = { name: s.name || list[idx].name, address: s.address };
      const inv = s.invite ?? list[idx].invite;
      if (inv) merged.invite = inv;
      list[idx] = merged;
    } else list.push(s);
    this.saveServers(list);
    return idx >= 0 ? idx : list.length - 1;
  }

  private serversPanel(): HTMLElement {
    const list = this.servers();
    if (this.selected >= list.length) this.selected = Math.max(0, list.length - 1);
    const side = h('div', { class: 'server-list' });
    list.forEach((s, i) => side.append(this.serverItem(s, i)));
    const add = h(
      'div',
      { class: 'server-item ps-add focus-ring', tabindex: '0', role: 'button', 'data-ps-key': 'add' },
      h('div', { class: 'sico' }, img('plus', 'ps-px')),
      h('div', { class: 'ps-stext' }, h('div', null, 'Ajouter un serveur'), h('div', { class: 'dim' }, "Adresse et code d'invitation")),
    );
    add.addEventListener('click', () => {
      clickSound?.();
      this.addServerModal();
    });
    side.append(add);
    const detail = list.length ? this.serverDetail(list[this.selected], this.selected) : this.emptyDetail();
    return h('div', { class: 'servers' }, side, detail);
  }

  private serverItem(s: SavedServer, i: number): HTMLElement {
    const label = s.name || s.address;
    const dot = h('span', { class: 'ps-dot' });
    const item = h(
      'div',
      { class: 'server-item focus-ring' + (i === this.selected ? ' active' : ''), tabindex: '0', role: 'button', 'data-ps-key': 's-' + i },
      h('div', { class: 'sico' }, h('img', { class: 'ps-fill-img ps-px', src: serverIcon(label), alt: '', draggable: 'false' })),
      h('div', { class: 'ps-stext' }, h('div', { class: 'ps-ell' }, label), h('div', { class: 'dim ps-ell' }, s.address)),
      dot,
    );
    item.addEventListener('click', () => {
      clickSound?.();
      if (this.selected === i) return;
      this.selected = i;
      this.render();
    });
    this.watch(s.address, (st) => {
      dot.className = 'ps-dot' + (st.state === 'online' ? ' on' : st.state === 'offline' ? ' off' : '');
      dot.title = st.state === 'online' ? `En ligne : ${st.players}/${st.max} joueurs` : st.state === 'offline' ? 'Hors ligne' : 'Interrogation…';
    });
    return item;
  }

  private emptyDetail(): HTMLElement {
    const add = button('Ajouter un serveur', () => this.addServerModal(), 'green', 'plus');
    add.dataset.psKey = 'add-empty';
    const join = button('Rejoindre avec une invitation', () => this.joinInviteModal(), '', 'mail');
    join.dataset.psKey = 'join-empty';
    return h(
      'div',
      { class: 'server-detail' },
      h('div', { class: 'ps-empty-detail' }, h('div', null, "Aucun serveur enregistré. Ajoutez l'adresse d'un serveur Voxelia (le vôtre ou celui d'un ami) pour le retrouver ici."), add, join),
    );
  }

  private serverDetail(s: SavedServer, i: number): HTMLElement {
    const label = s.name || s.address;
    // Bannière avec état en direct.
    const bars = h('span', { class: 'ps-bars' }, h('i'), h('i'), h('i'));
    const pingTxt = h('span', null, 'Interrogation…');
    const playersTxt = h('span', null, '–');
    const inviteEl = h('span', { class: 'ps-stat hidden' }, img('mail'), 'Sur invitation');
    const stat = h('div', { class: 'stat' }, h('span', { class: 'ps-stat' }, bars, pingTxt), h('span', { class: 'ps-stat' }, img('person'), playersTxt), inviteEl);
    const banner = h('div', { class: 'server-banner' }, h('img', { class: 'ps-banner-art ps-px', src: serverBanner(label), alt: '', draggable: 'false' }), h('div', { class: 'ps-band' }), stat);

    const play = button('JOUER', () => this.play(s), 'green big');
    play.dataset.psKey = 'play';
    const playRow = h('div', { class: 'server-play' }, h('div', { class: 'ps-sname ps-ell' }, label), play);

    const motd = h('div', { class: 'desc' }, 'Interrogation du serveur…');
    const announced = h('div', { class: 'desc hidden' });
    const warn = h('div', { class: 'desc ps-warn hidden' });
    const descSec = h('div', { class: 'section' }, h('div', { class: 'label' }, 'Description'), motd, announced, warn);
    const infoSec = h(
      'div',
      { class: 'section' },
      h('div', { class: 'label' }, 'Connexion'),
      h('div', { class: 'desc ps-sel' }, 'Adresse : ' + s.address),
      h('div', { class: 'desc' }, s.invite ? "Code d'invitation enregistré" : "Aucun code d'invitation enregistré"),
    );

    const edit = button('Modifier', () => this.editServerModal(i), 'dark', 'pencil');
    edit.dataset.psKey = 'edit';
    const refresh = button('Actualiser', () => this.ensureStatus(s.address, true), 'dark', 'search');
    refresh.dataset.psKey = 'refresh';
    const del = button('Supprimer', () => this.deleteServer(i), 'red', 'trash');
    del.dataset.psKey = 'delete';
    const actions = h('div', { class: 'ps-actions' }, edit, refresh, del);

    this.watch(s.address, (st) => {
      const lit = st.state === 'online' ? (st.ping < 100 ? 3 : st.ping < 250 ? 2 : 1) : 0;
      const color = lit === 3 ? '#5cd047' : lit === 2 ? '#ffd84a' : '#ff6a4a';
      [...bars.children].forEach((b, k) => ((b as HTMLElement).style.background = k < lit ? color : ''));
      pingTxt.classList.toggle('ps-off', st.state === 'offline');
      inviteEl.classList.toggle('hidden', !(st.state === 'online' && st.needsInvite));
      announced.classList.add('hidden');
      warn.classList.add('hidden');
      refresh.disabled = st.state === 'pending';
      if (st.state === 'pending') {
        pingTxt.textContent = 'Interrogation…';
        playersTxt.textContent = '–';
        motd.textContent = 'Interrogation du serveur…';
      } else if (st.state === 'offline') {
        pingTxt.textContent = 'Hors ligne';
        playersTxt.textContent = '–';
        motd.textContent = `Le serveur ne répond pas (${st.reason}). Vérifiez l'adresse et que le serveur est bien lancé.`;
      } else {
        pingTxt.textContent = st.ping + ' ms';
        playersTxt.textContent = `${st.players}/${st.max}`;
        motd.textContent = st.motd || 'Aucune description.';
        if (st.name && st.name !== label) {
          announced.textContent = 'Nom annoncé par le serveur : ' + st.name;
          announced.classList.remove('hidden');
        }
        if (!st.compatible) {
          warn.textContent = `Version incompatible (serveur : ${st.version}, jeu : ${PROTOCOL_VERSION}) : la connexion risque d'échouer.`;
          warn.classList.remove('hidden');
        } else if (st.needsInvite && !s.invite) {
          warn.textContent = "Ce serveur demande un code d'invitation : il vous sera demandé avant d'entrer.";
          warn.classList.remove('hidden');
        }
      }
    });
    return h('div', { class: 'server-detail' }, banner, h('div', { class: 'ps-detail-scroll' }, playRow, descSec, infoSec, actions));
  }

  private play(s: SavedServer): void {
    const st = this.status.get(serverUrl(s.address));
    if (st?.state === 'online' && st.needsInvite && !s.invite) {
      this.askInviteModal(s);
      return;
    }
    this.join(s.address, s.invite);
  }

  private join(address: string, invite?: string): void {
    if (this.busy) return;
    this.busy = true;
    this.app
      .joinServer(address, invite)
      .catch((e) => this.errorModal('Connexion impossible', e))
      .finally(() => {
        this.busy = false;
      });
  }

  private askInviteModal(s: SavedServer): void {
    let code = '';
    let remember = true;
    const codeF = textField('', 'Code fourni par le propriétaire du serveur', (v) => (code = v), 32);
    const body = h(
      'div',
      { class: 'ps-form' },
      h('div', null, `« ${s.name || s.address} » demande un code d'invitation.`),
      codeF,
      h('div', { class: 'row' }, h('div', { class: 'grow' }, 'Mémoriser le code'), switchCtl(remember, (v) => (remember = v))),
    );
    modal("Code d'invitation", body, [
      ['Annuler', () => undefined],
      [
        'Rejoindre',
        () => {
          const c = code.trim();
          if (!c) {
            toast("Saisissez le code d'invitation.");
            codeF.focus();
            return false;
          }
          if (remember) this.upsertServer({ name: s.name, address: s.address, invite: c });
          this.join(s.address, c);
        },
        'green',
      ],
    ]);
    submitOnEnter([codeF]);
  }

  /** Fenêtre d'ajout / modification (nom, adresse, code). `onSave` renvoie false pour garder la fenêtre ouverte. */
  private serverForm(title: string, init: SavedServer, onSave: (s: SavedServer) => boolean | void): void {
    let name = init.name;
    let address = init.address;
    let invite = init.invite ?? '';
    const nameF = textField(name, 'Mon serveur', (v) => (name = v), 40);
    const addrF = textField(address, 'hôte:port (ex. 192.168.1.20:' + DEFAULT_PORT + ')', (v) => (address = v), 120);
    const invF = textField(invite, 'Facultatif', (v) => (invite = v), 32);
    const body = h(
      'div',
      { class: 'ps-form' },
      flabel('Nom du serveur'),
      nameF,
      flabel('Adresse'),
      addrF,
      h('div', { class: 'dim' }, `Port par défaut : ${DEFAULT_PORT}. Les adresses ws:// et wss:// sont acceptées.`),
      flabel("Code d'invitation"),
      invF,
    );
    modal(title, body, [
      ['Annuler', () => undefined],
      [
        'Enregistrer',
        () => {
          const err = validateAddress(address);
          if (err) {
            toast(err);
            addrF.focus();
            return false;
          }
          const s: SavedServer = { name: name.trim() || address.trim(), address: address.trim() };
          const inv = invite.trim();
          if (inv) s.invite = inv;
          return onSave(s);
        },
        'green',
      ],
    ]);
    submitOnEnter([nameF, addrF, invF]);
  }

  private addServerModal(): void {
    this.serverForm('Ajouter un serveur', { name: '', address: '' }, (s) => {
      const list = this.servers();
      const dup = list.findIndex((x) => serverUrl(x.address) === serverUrl(s.address));
      if (dup >= 0) {
        toast('Ce serveur est déjà dans la liste : « ' + (list[dup].name || list[dup].address) + ' »');
        return false;
      }
      list.push(s);
      this.selected = list.length - 1;
      this.saveServers(list);
      if (this.tab === 'servers') this.render();
      else this.select('servers');
      toast('Serveur ajouté');
    });
  }

  private editServerModal(i: number): void {
    const cur = this.servers()[i];
    if (!cur) return;
    this.serverForm('Modifier le serveur', cur, (s) => {
      const list = this.servers();
      const dup = list.findIndex((x, k) => k !== i && serverUrl(x.address) === serverUrl(s.address));
      if (dup >= 0) {
        toast('Cette adresse est déjà utilisée par « ' + (list[dup].name || list[dup].address) + ' »');
        return false;
      }
      list[i] = s;
      this.saveServers(list);
      this.render();
    });
  }

  private deleteServer(i: number): void {
    const cur = this.servers()[i];
    if (!cur) return;
    confirmDialog('Supprimer le serveur', `Retirer « ${cur.name || cur.address} » de votre liste ? Le serveur lui-même n'est pas modifié.`, 'Supprimer', () => {
      const list = this.servers();
      list.splice(i, 1);
      this.selected = Math.max(0, Math.min(this.selected, list.length - 1));
      this.saveServers(list);
      this.render();
      toast('Serveur supprimé');
    });
  }

  // ---------------------------------------------------------------- état des serveurs en direct
  /** Abonne un élément à l'état d'un serveur (appliqué tout de suite s'il est connu). */
  private watch(address: string, apply: (s: ServerStatus) => void): void {
    const key = serverUrl(address);
    this.views.push({ key, apply });
    this.ensureStatus(address, false);
    const st = this.status.get(key);
    if (st) apply(st);
  }

  private ensureStatus(address: string, force: boolean): void {
    if (this.destroyed) return;
    const key = serverUrl(address);
    const cur = this.status.get(key);
    if (cur?.state === 'pending') return;
    if (!force && cur && Date.now() - cur.at < STATUS_TTL) return;
    this.status.set(key, { state: 'pending' });
    this.notify(key);
    void queryStatus(address, 4000, this.abort.signal).then((st) => {
      if (this.destroyed) return;
      this.status.set(key, st);
      this.notify(key);
    });
  }

  private pingAll(force: boolean): void {
    for (const s of this.servers()) this.ensureStatus(s.address, force);
  }

  private notify(key: string): void {
    const st = this.status.get(key);
    if (st) for (const v of this.views) if (v.key === key) v.apply(st);
    this.updateSocial();
  }

  /** « Social (n) » : joueurs en ligne avec vous (même source que le panneau Social ; 0 au menu). */
  private updateSocial(): void {
    let n = 0;
    try {
      n = this.app.game?.net?.remotePlayers().length ?? 0;
    } catch {
      n = 0;
    }
    this.socialLabel.textContent = `Social (${n})`;
  }
}
