/**
 * Écrans en jeu : chargement (logo, astuce, barre de progression pointillée), menu du jeu
 * (pause, aide des commandes, liste des commandes, infos du monde et des joueurs),
 * saisie de la discussion (historique, complétion des commandes) et écran de mort.
 */
import { h, button, img, modal, segmented, toast } from '../dom';
import { createLogoCanvas } from '../logo';
import { COMMAND_HELP } from '../../game/Commands';
import { keyLabel } from '../../input/InputManager';
import { DIMENSION_NAMES } from '../../world/constants';
import type { AppContext } from '../../core/AppContext';
import type { Game } from '../../game/Game';
import type { Difficulty, GameMode } from '../../save/SaveManager';
import type { Screen } from '../UIManager';

// ------------------------------------------------------------------ astuces de chargement
/** Astuces affichées pendant les chargements (uniquement des mécaniques présentes dans le jeu). */
export const TIPS: string[] = [
  'Maintenez S’accroupir au bord d’un bloc : vous ne tomberez pas dans le vide.',
  'Quand il ne reste que trois icônes de faim, impossible de courir : pensez à manger !',
  'Avec la jauge de faim pleine, votre santé remonte toute seule (si la régénération naturelle est active).',
  'La chair putréfiée calme la faim, mais risque fort de vous donner l’effet Faim.',
  'La pomme dorée (huit lingots d’or autour d’une pomme) accorde quelques secondes de régénération.',
  'Un seau de lait efface tous vos effets, bons comme mauvais : idéal contre le poison des sorcières.',
  'Utilisez un seau vide sur une vache ou une champimeuh pour la traire.',
  'Les cisailles tondent les moutons sans les blesser, et leur laine finit par repousser.',
  'Tondez un mouton céleste pour obtenir de la laine bleu clair.',
  'Nourrissez deux animaux de la même espèce avec leur aliment préféré (blé, carottes, graines…) pour qu’ils aient un petit.',
  'Donner à manger à un jeune animal le fait grandir plus vite.',
  'Un cheval sauvage vous désarçonne : remontez jusqu’à l’apprivoiser, puis posez-lui une selle pour le diriger.',
  'Accroupissez-vous pour descendre d’une monture, d’un bateau, d’un wagonnet ou du tapis volant.',
  'Le tapis volant monte tant que vous maintenez Saut. Il se fabrique avec trois laines, deux plumes célestes et un éclat de cristal.',
  'Équipez le planeur, sautez dans le vide puis appuyez de nouveau sur Saut pour planer.',
  'Le planeur se fabrique avec sept plumes et une plume céleste au centre.',
  'Les plumes célestes tombent des oiseaux-tempête, et parfois des moutons célestes.',
  'Portail de braise : un cadre d’obsidienne de 4 blocs de large sur 5 de haut, allumé de l’intérieur avec un briquet.',
  'Chaque bloc parcouru dans les Terres de braise équivaut à 8 blocs à la Surface : pratique pour voyager loin.',
  'Portail céleste : construisez un cadre de blocs de cristal (4 × 5) et utilisez une clé céleste à l’intérieur.',
  'La clé céleste se fabrique avec quatre éclats de cristal disposés autour d’un lingot d’or.',
  'Quatre éclats de cristal assemblés en carré forment un bloc de cristal.',
  'Les slimes de cristal et les rampants des cavernes laissent parfois tomber des éclats de cristal.',
  'Un bibliothécaire expérimenté vend la clé céleste contre 20 émeraudes et 4 éclats de cristal.',
  'Les émeraudes sont la monnaie des villageois : vendez-leur du blé, du charbon ou du papier pour en gagner.',
  'Plus vous commercez avec un villageois, plus il monte en niveau et propose des échanges rares.',
  'Les villageois exercent sept métiers : fermier, bibliothécaire, forgeron, boucher, cartographe, alchimiste et pêcheur.',
  'Ascenseur : posez deux blocs Ascenseur l’un au-dessus de l’autre, sautez pour monter, accroupissez-vous pour descendre.',
  'Un ascenseur atteint le suivant jusqu’à 32 blocs plus loin, s’il reste deux blocs libres au-dessus de l’arrivée.',
  'Le bloc Ascenseur se fabrique avec huit lingots de fer autour d’une poudre d’énergie.',
  'Un minerai d’énergie donne plusieurs poudres d’énergie d’un seul coup.',
  'Dans un four, un éclat de braise brûle plus longtemps qu’un charbon, et un seau de lave bien plus encore.',
  'Faites cuire du sable pour obtenir du verre, et du pavé pour retrouver de la pierre.',
  'Le fer, l’or, le cuivre, le mythril et l’étherium bruts se fondent en lingots dans un four.',
  'Utiliser un lit définit votre point d’apparition, même en plein jour.',
  'On ne peut dormir que la nuit ou pendant un orage, et jamais avec un monstre à moins de 8 blocs.',
  'Ne dormez jamais hors de la Surface : le lit y explose !',
  'Un lit se fabrique avec trois laines posées sur trois planches.',
  'Les zombies, les squelettes et les spectres nocturnes s’enflamment en plein soleil.',
  'Le champignon explosif s’arme quand il s’approche de vous : éloignez-vous à plus de 7 blocs pour le désamorcer !',
  'Les grands slimes se divisent en slimes plus petits quand on les élimine.',
  'Les araignées et les rampants des cavernes savent escalader les murs.',
  'Le Cerf doré, créature légendaire, se montre très rarement dans les biomes fantastiques.',
  'Interagissez avec un Cœur antique pour réveiller le boss endormi qui le garde.',
  'Golem antique, Gardien des profondeurs, Souverain des braises, Dragon des cieux : chaque boss laisse un trophée unique.',
  'Les dimensions et les boss s’activent dans l’onglet Expériences, à la création du monde.',
  'Le TNT s’allume avec un briquet ou grâce à un signal d’énergie.',
  'Leviers, boutons et plaques de pression peuvent alimenter portes, trappes, lampes à énergie et TNT.',
  'La boussole indique la distance et la direction de votre point d’apparition.',
  'Utilisez une carte pour afficher la mini-carte de la région.',
  'En Créatif, appuyez deux fois rapidement sur Saut pour voler.',
  'Le clic molette sur un bloc le sélectionne s’il se trouve dans votre barre d’accès rapide.',
  'Écran tactile : un appui court utilise ou pose un bloc, un appui long sans bouger casse.',
  'Maintenez le doigt sur une case de la barre d’accès rapide pour lâcher un objet.',
  'Le bouton « … » au bout de la barre d’accès rapide ouvre l’inventaire.',
  'Vous pouvez déplacer les boutons tactiles : Paramètres → Tactile → Modifier la disposition.',
  'Tapez /help dans la discussion pour lister les commandes ; /seed affiche la graine même sans triches.',
  'Dans une commande, « ~ » désigne votre position : /tp ~ ~10 ~ vous élève de dix blocs.',
  'Avec les triches, /locate suivi d’un nom de biome indique le plus proche.',
  'En pêchant, vous remonterez surtout des poissons, mais parfois une selle, un livre ou une émeraude.',
  'La poudre d’os accélère la pousse des cultures et des jeunes arbres.',
  'Labourez l’herbe ou la terre avec une houe avant de semer vos graines.',
  'Par défaut, F5 change de vue, F1 masque l’interface et F3 affiche les informations de débogage.',
  'Sous l’eau, surveillez vos bulles d’oxygène : une fois épuisées, vous commencez à vous noyer.',
  'Un coffre ne s’ouvre pas si un bloc plein est posé dessus.',
  'Le Gâteau céleste rassasie énormément : blé, sucre, œufs et un éclat de cristal suffisent.',
  'Le minerai de mythril luit faiblement dans l’obscurité : ouvrez l’œil dans les grottes.',
  'L’étherium se cache dans la pierre des Terres de braise : il faut une pioche en diamant, et l’armure complète protège du feu.',
  'La célestine, gemme rare des îles du Royaume céleste, donne une armure qui annule les dégâts de chute.',
  'Les gardes du village sont neutres : évitez de les provoquer.',
  'Ctrl + la touche Lâcher jette toute la pile tenue en main.',
  'La touche F échange l’objet en main avec celui de la main secondaire.',
];

// ------------------------------------------------------------------ styles propres à ces écrans
const STYLE_ID = 'igs-style';
const CSS = `
.igs-load { overflow: hidden; background: #0d0c0b; }
.igs-load-bg { position: absolute; inset: calc(var(--u) * -8); background: center / cover no-repeat; image-rendering: pixelated; filter: blur(calc(var(--u) * 1.4)) brightness(0.5) saturate(0.85); }
.igs-load-logo, .igs-load .loading-box { position: relative; }
.igs-load-logo { width: min(58vw, calc(var(--u) * 236)); filter: drop-shadow(0 calc(var(--u) * 2) 0 rgba(0, 0, 0, 0.35)); }
.igs-load-logo canvas { display: block; width: 100%; image-rendering: pixelated; }
.igs-load .loading-inner { min-height: calc(var(--u) * 60); }
.igs-load-text { line-height: 1.45; word-break: break-word; }
.igs-fade { animation: igs-fade 0.45s ease-out; }
@keyframes igs-fade { from { opacity: 0; } to { opacity: 1; } }

.igs-pause-title { flex: 0 0 auto; text-align: center; padding: calc(var(--u) * 7) 0 calc(var(--u) * 5); font-family: 'VoxPixelBold', monospace; font-size: calc(var(--u) * 11); letter-spacing: calc(var(--u) * 0.6); text-shadow: calc(var(--u) * 1) calc(var(--u) * 1) 0 #000; }
.igs-pause-body { flex: 1; min-height: 0; display: flex; justify-content: center; gap: calc(var(--u) * 10); padding: 0 6% calc(var(--u) * 6); box-sizing: border-box; }
.igs-pause-col { flex: 0 1 calc(var(--u) * 170); min-width: 0; display: flex; flex-direction: column; gap: calc(var(--u) * 4); overflow-y: auto; }
.igs-pause-col .btn { flex: 0 0 auto; height: calc(var(--u) * 24); }
.igs-pause-col .igs-quit { margin-top: calc(var(--u) * 4); }
.igs-status { color: var(--yellow); text-align: center; min-height: var(--fs); text-shadow: calc(var(--u) * 1) calc(var(--u) * 1) 0 #000; }
.igs-pause-info { flex: 0 1 calc(var(--u) * 190); min-width: 0; align-self: flex-start; max-height: 100%; overflow-y: auto; box-sizing: border-box; background: rgba(49, 50, 51, 0.94); border: calc(var(--u) * 1) solid var(--line); box-shadow: inset 0 calc(var(--u) * 1) 0 #5c5d5e; padding: calc(var(--u) * 6) calc(var(--u) * 9); display: flex; flex-direction: column; gap: calc(var(--u) * 2); }
.igs-pause-info > * { flex-shrink: 0; }
.igs-info-name { font-family: 'VoxPixelBold', monospace; font-size: calc(var(--u) * 9); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-bottom: calc(var(--u) * 3); margin-bottom: calc(var(--u) * 2); border-bottom: calc(var(--u) * 1) solid #262627; }
.igs-info-row { display: flex; justify-content: space-between; gap: calc(var(--u) * 8); }
.igs-info-row .k { color: var(--text-dim); white-space: nowrap; }
.igs-info-row .v { min-width: 0; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.igs-info-sep { margin-top: calc(var(--u) * 2); padding-top: calc(var(--u) * 3); border-top: calc(var(--u) * 1) solid #262627; }
.igs-info-head { font-family: 'VoxPixelBold', monospace; }
.igs-players { display: flex; flex-wrap: wrap; gap: calc(var(--u) * 2) calc(var(--u) * 8); }
.igs-player { display: flex; align-items: center; gap: calc(var(--u) * 4); min-width: 0; max-width: 100%; }
.igs-player span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.igs-dot { width: calc(var(--u) * 5); height: calc(var(--u) * 5); flex: 0 0 auto; background: #5cd047; border: calc(var(--u) * 1) solid #1e1e1f; }
.igs-note { color: var(--text-dim); font-size: var(--fs-s); margin-top: calc(var(--u) * 2); }

.igs-help-pane, .igs-cmd-list { max-height: 50vh; overflow-y: auto; }
.igs-help-grid { display: grid; grid-template-columns: minmax(calc(var(--u) * 60), 38%) 1fr; gap: calc(var(--u) * 3) calc(var(--u) * 8); align-items: baseline; }
.igs-help-grid .k { color: var(--yellow); }
.igs-help-grid .sub { grid-column: 1 / -1; margin-top: calc(var(--u) * 4); font-family: 'VoxPixelBold', monospace; }
.igs-cmd-list { display: flex; flex-direction: column; gap: calc(var(--u) * 2); }
.btn.igs-cmd { flex: 0 0 auto; flex-direction: column; align-items: flex-start; justify-content: center; gap: calc(var(--u) * 1); text-align: left; white-space: normal; min-height: 0; }
.igs-cmd-u { color: var(--yellow); }
.igs-cmd-d { color: var(--text-dim); }

.igs-chat { position: fixed; inset: 0; }
.igs-chatbar { display: flex; gap: calc(var(--u) * 2); margin: 0; }
.igs-chatbar input { flex: 1; min-width: 0; width: auto; }
.igs-chatbar .btn { min-height: 0; padding-top: 0; padding-bottom: calc(var(--u) * 2); }
.igs-chatbar .btn.square { width: calc(var(--u) * 20); }
.igs-chatbar .btn.square .ico { width: calc(var(--u) * 11); height: calc(var(--u) * 11); }
.igs-sugg { position: absolute; left: calc(var(--u) * 2); bottom: calc(var(--u) * 22); width: min(84vw, calc(var(--u) * 300)); max-height: 50vh; overflow-y: auto; background: rgba(0, 0, 0, 0.8); border: calc(var(--u) * 1) solid #555; }
.igs-sugg-item { display: flex; gap: calc(var(--u) * 6); padding: calc(var(--u) * 2) calc(var(--u) * 5); cursor: pointer; white-space: nowrap; }
.igs-sugg-item:hover { background: rgba(255, 255, 255, 0.14); }
.igs-sugg-item .c { flex: 0 0 auto; color: var(--yellow); }
.igs-sugg-item .d { min-width: 0; overflow: hidden; text-overflow: ellipsis; color: var(--text-dim); }
.igs-sugg-hint { padding: calc(var(--u) * 2) calc(var(--u) * 5); color: var(--text-dim); }

.igs-death-msg { max-width: 80vw; text-align: center; text-shadow: calc(var(--u) * 1) calc(var(--u) * 1) 0 #3f3f3f; }
.igs-death-score { text-shadow: calc(var(--u) * 1) calc(var(--u) * 1) 0 #3f3f3f; }
.igs-yellow { color: var(--yellow); }
.igs-death-btns { display: flex; flex-direction: column; gap: calc(var(--u) * 4); margin-top: calc(var(--u) * 4); }
`;

function ensureStyle(): void {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = CSS;
  document.head.appendChild(s);
}

/** Donne le focus au premier bouton quand on joue à la manette (A valide aussitôt). */
function focusLater(app: AppContext, el: HTMLElement, target: () => HTMLElement | undefined): void {
  if (app.touchMode || app.input.lastDevice !== 'gamepad') return;
  requestAnimationFrame(() => {
    if (!el.isConnected || document.querySelector('.modal-back')) return;
    target()?.focus();
  });
}

// ------------------------------------------------------------------ écran de chargement
let backdropUrl: string | null = null;

/** Fond de blocs sombres (pierre, terre, mousse) dessiné une fois par session, flouté en CSS. */
function loadingBackdrop(): string {
  if (backdropUrl !== null) return backdropUrl;
  backdropUrl = '';
  try {
    const cols = 40;
    const rows = 23;
    const px = 8;
    const c = document.createElement('canvas');
    c.width = cols * px;
    c.height = rows * px;
    const g = c.getContext('2d');
    if (!g) return backdropUrl;
    let seed = (0x9e3779b9 ^ Math.floor(Math.random() * 0xffff)) >>> 0;
    const rnd = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
    // pierre, pierre sombre, terre, mousse, veine claire
    const mats: Array<[number, number, number]> = [
      [118, 114, 108],
      [72, 70, 76],
      [112, 80, 54],
      [74, 104, 52],
      [168, 150, 120],
    ];
    const ph = rnd() * 10;
    for (let by = 0; by < rows; by++)
      for (let bx = 0; bx < cols; bx++) {
        const f = Math.sin(bx * 0.33 + ph) + Math.sin(by * 0.41 - bx * 0.13 + ph * 2) + Math.sin((bx + by) * 0.21);
        let m = f > 1.1 ? 2 : f > 0.55 ? 3 : f < -1.2 ? 1 : 0;
        if (m === 0 && rnd() < 0.04) m = 4;
        const [r0, g0, b0] = mats[m];
        const shade = 0.82 + rnd() * 0.3;
        for (let j = 0; j < px; j += 2)
          for (let i = 0; i < px; i += 2) {
            const k = shade * (0.86 + rnd() * 0.28) * (i === 0 || j === 0 ? 1.08 : 1);
            g.fillStyle = `rgb(${Math.min(255, r0 * k) | 0},${Math.min(255, g0 * k) | 0},${Math.min(255, b0 * k) | 0})`;
            g.fillRect(bx * px + i, by * px + j, 2, 2);
          }
      }
    const grad = g.createRadialGradient(c.width / 2, c.height / 2, c.height * 0.2, c.width / 2, c.height / 2, c.width * 0.65);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.6)');
    g.fillStyle = grad;
    g.fillRect(0, 0, c.width, c.height);
    backdropUrl = c.toDataURL('image/png');
  } catch {
    backdropUrl = '';
  }
  return backdropUrl;
}

/** Écran de chargement : logo, boîte « Chargement », astuce tournante et barre pointillée. */
export class LoadingScreen implements Screen {
  readonly el: HTMLElement;
  private header: HTMLElement;
  private text: HTMLElement;
  private fill: HTMLElement;
  private target = 0;
  private shown = 0;
  private showTip = true;
  private tipIndex = -1;
  private tipTimer = 0;

  constructor() {
    ensureStyle();
    this.header = h('div', { class: 'lt' }, 'Chargement');
    this.text = h('div', { class: 'igs-load-text' });
    this.fill = h('div', { class: 'fill', style: 'width:0%' });
    const bg = loadingBackdrop();
    this.el = h(
      'div',
      { class: 'loading-screen igs-load' },
      h('div', { class: 'igs-load-bg', style: bg ? `background-image:url("${bg}")` : undefined }),
      h('div', { class: 'igs-load-logo' }, createLogoCanvas()),
      h('div', { class: 'loading-box' }, this.header, h('div', { class: 'loading-inner' }, this.text, h('div', { class: 'progress' }, this.fill))),
    );
    this.nextTip();
  }

  /** Met à jour le titre, la progression (0..1) et le mode d'affichage (astuce ou texte). */
  set(title: string, progress: number, showTip: boolean): void {
    const t = (title ?? '').trim();
    const p = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
    // Nouvelle étape qui repart de zéro : la barre recule sans animation
    if (p < this.shown) this.shown = p;
    this.target = p;
    if (showTip) {
      this.header.textContent = t || 'Chargement';
      if (!this.showTip) this.nextTip();
    } else {
      this.header.textContent = 'Veuillez patienter';
      this.setText(t || 'Chargement…');
    }
    this.showTip = showTip;
    this.renderBar();
  }

  update(dt: number): void {
    const d = this.target - this.shown;
    this.shown = Math.abs(d) < 0.002 ? this.target : this.shown + d * Math.min(1, dt * 7);
    this.renderBar();
    if (!this.showTip) return;
    this.tipTimer += dt;
    if (this.tipTimer >= 6) this.nextTip();
  }

  /** Impossible de fermer un chargement. */
  onBack(): boolean {
    return true;
  }

  private renderBar(): void {
    this.fill.style.width = (this.shown * 100).toFixed(2) + '%';
  }

  private nextTip(): void {
    let i = Math.floor(Math.random() * TIPS.length);
    if (TIPS.length > 1 && i === this.tipIndex) i = (i + 1) % TIPS.length;
    this.tipIndex = i;
    this.tipTimer = 0;
    this.setText(TIPS[i]);
  }

  private setText(t: string): void {
    if (this.text.textContent === t) return;
    this.text.textContent = t;
    this.text.classList.remove('igs-fade');
    void this.text.offsetWidth; // relance l'animation de fondu
    this.text.classList.add('igs-fade');
  }
}

// ------------------------------------------------------------------ menu du jeu (pause)
const MODE_LABEL: Record<GameMode, string> = { survival: 'Survie', creative: 'Créatif', adventure: 'Aventure', spectator: 'Spectateur' };
const DIFF_LABEL: Record<Difficulty, string> = { peaceful: 'Paisible', easy: 'Facile', normal: 'Normale', hard: 'Difficile' };
const PERM_LABEL: Record<string, string> = { visitor: 'Visiteur', member: 'Membre', operator: 'Opérateur' };
const WEATHER_LABEL: Record<string, string> = { clear: 'Dégagé', rain: 'Pluie', thunder: 'Orage' };

/** Heure affichée : 0 = 6 h, 6000 = midi, 18000 = minuit (mêmes repères que /time). */
function clockText(time: number): string {
  const t = ((time % 24000) + 24000) % 24000;
  const hours = Math.floor(t / 1000 + 6) % 24;
  const minutes = Math.floor(((t % 1000) / 1000) * 60);
  return `${hours}h${String(minutes).padStart(2, '0')}`;
}

export class PauseScreen implements Screen {
  readonly el: HTMLElement;
  /** En solo, le jeu s'arrête sous ce menu ; en multijoueur il continue. */
  readonly pausesGame: boolean;
  private info: HTMLElement;
  private status: HTMLElement;
  private buttons: HTMLButtonElement[] = [];
  private quitting = false;
  private infoSig = '';
  private infoTimer = 0;

  constructor(
    private app: AppContext,
    private game: Game,
  ) {
    ensureStyle();
    this.pausesGame = game.net === null;
    const col = h('div', { class: 'igs-pause-col' });
    const add = (label: string, fn: () => void): HTMLButtonElement => {
      const b = button(label, fn);
      this.buttons.push(b);
      col.appendChild(b);
      return b;
    };
    add('Reprendre la partie', () => this.resume());
    add('Paramètres', () => {
      if (!this.quitting) app.openSettings();
    });
    add('Aide', () => openHelp(app));
    if (game.meta.cheats) add('Commandes', () => openCommands(app, game));
    const quit = add('Enregistrer et quitter', () => void this.saveAndQuit(quit));
    quit.classList.add('igs-quit');
    this.status = h('div', { class: 'igs-status' });
    col.appendChild(this.status);
    this.info = h('div', { class: 'igs-pause-info' });
    this.el = h('div', { class: 'screen overlay-dark igs-pause' }, h('div', { class: 'igs-pause-title' }, 'Menu du jeu'), h('div', { class: 'igs-pause-body' }, col, this.info));
    this.refreshInfo();
    focusLater(app, this.el, () => this.buttons[0]);
  }

  /** Pendant l'enregistrement, le retour est ignoré. */
  onBack(): boolean {
    return this.quitting;
  }

  update(dt: number): void {
    this.infoTimer += dt;
    if (this.infoTimer < 0.5) return;
    this.infoTimer = 0;
    this.refreshInfo();
  }

  private resume(): void {
    if (this.quitting) return;
    this.app.ui.back();
    // Le clic est un geste utilisateur : on peut recapturer la souris tout de suite
    if (!this.app.touchMode) this.app.input.requestPointerLock();
  }

  private async saveAndQuit(btn: HTMLButtonElement): Promise<void> {
    if (this.quitting) return;
    this.quitting = true;
    for (const b of this.buttons) b.disabled = true;
    btn.textContent = 'Enregistrement…';
    this.status.textContent = this.game.net ? 'Déconnexion du serveur…' : 'Enregistrement du monde…';
    try {
      await this.app.quitToMenu();
    } catch (e) {
      console.error(e);
      toast('Impossible de quitter la partie : ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      // Toujours affiché (sortie refusée ou déjà en cours) : on rend la main
      if (this.el.isConnected) {
        this.quitting = false;
        for (const b of this.buttons) b.disabled = false;
        btn.textContent = 'Enregistrer et quitter';
        this.status.textContent = '';
      }
    }
  }

  /** Colonne de droite : monde, jour, mode, position et joueurs (reconstruite si elle change). */
  private refreshInfo(): void {
    const g = this.game;
    const m = g.meta;
    const p = g.player;
    const dim = DIMENSION_NAMES[g.dimension] ?? '—';
    const rows: Array<[string, string]> = [
      ['Jour', `${m.day + 1} · ${clockText(m.time)}`],
      ['Mode de jeu', MODE_LABEL[p.gameMode] ?? p.gameMode],
      ['Difficulté', DIFF_LABEL[m.difficulty] ?? m.difficulty],
      ['Dimension', g.dimension === 0 ? `${dim} · ${WEATHER_LABEL[g.weather.state] ?? g.weather.state}` : dim],
    ];
    if (m.showCoordinates) rows.push(['Position', `${Math.floor(p.pos.x)}, ${Math.floor(p.pos.y)}, ${Math.floor(p.pos.z)}`]);
    const net = g.net;
    const others = net ? net.remotePlayers().map((r) => r.name) : [];
    const sig = JSON.stringify([m.name, rows, net?.address ?? '', net?.permission ?? '', p.name, others]);
    if (sig === this.infoSig) return;
    this.infoSig = sig;

    const row = (k: string, v: string, cls = '') => h('div', { class: 'igs-info-row ' + cls }, h('span', { class: 'k' }, k), h('span', { class: 'v' }, v));
    const box = this.info;
    box.textContent = '';
    box.appendChild(h('div', { class: 'igs-info-name' }, m.name || 'Monde sans nom'));
    for (const [k, v] of rows) box.appendChild(row(k, v));
    if (!net) {
      box.appendChild(h('div', { class: 'igs-note' }, 'Partie solo : le jeu est en pause tant que ce menu est ouvert.'));
      return;
    }
    box.appendChild(row('Serveur', net.address.replace(/^wss?:\/\//, ''), 'igs-info-sep'));
    box.appendChild(row('Rôle', PERM_LABEL[net.permission] ?? net.permission));
    box.appendChild(h('div', { class: 'igs-info-head igs-info-sep' }, `Joueurs (${others.length + 1})`));
    const list = h('div', { class: 'igs-players' });
    const player = (name: string) => h('div', { class: 'igs-player' }, h('div', { class: 'igs-dot' }), h('span', null, name));
    list.appendChild(player(`${p.name} (vous)`));
    for (const name of others) list.appendChild(player(name));
    box.appendChild(list);
    box.appendChild(h('div', { class: 'igs-note' }, 'Joueurs de votre dimension. Le jeu continue en arrière-plan.'));
  }
}

// ------------------------------------------------------------------ aide des commandes
type HelpRows = Array<[string, string] | string>;

function helpGrid(rows: HelpRows): HTMLElement {
  const g = h('div', { class: 'igs-help-grid' });
  for (const r of rows) {
    if (typeof r === 'string') g.appendChild(h('div', { class: 'sub' }, r));
    else g.append(h('div', { class: 'k' }, r[0]), h('div', null, r[1]));
  }
  return g;
}

function keyboardHelp(app: AppContext): HelpRows {
  const k = app.settings.data.keys;
  const L = keyLabel;
  return [
    [`${L(k.forward)} ${L(k.left)} ${L(k.back)} ${L(k.right)}`, 'Se déplacer'],
    ['Souris', 'Regarder autour de soi'],
    [L(k.jump), 'Sauter, nager vers le haut ; deux appuis rapides en Créatif pour voler'],
    [L(k.sneak), 'S’accroupir (évite de tomber des bords), descendre d’une monture'],
    [L(k.sprint), 'Courir en avançant'],
    ['Clic gauche', 'Attaquer / casser'],
    ['Clic droit', 'Utiliser / poser'],
    [L(k.pickBlock), 'Choisir le bloc visé dans la barre'],
    ['1 à 9, molette', 'Barre d’accès rapide'],
    [L(k.inventory), 'Inventaire'],
    [L(k.drop), 'Lâcher l’objet (avec Ctrl : toute la pile)'],
    ['F', 'Échanger avec la main secondaire'],
    [L(k.chat), 'Discussion'],
    [L(k.command), 'Saisir une commande'],
    [L(k.perspective), 'Changer de vue'],
    [L(k.map), 'Mini-carte'],
    [L(k.hud), 'Masquer l’interface'],
    [L(k.debug), 'Informations de débogage'],
    ['Échap', 'Menu du jeu'],
    'Les touches se modifient dans Paramètres → Clavier et souris.',
  ];
}

const TOUCH_HELP: HelpRows = [
  ['Joystick', 'Se déplacer'],
  ['Glisser sur l’écran', 'Regarder autour de soi'],
  ['Appui court', 'Utiliser / poser un bloc'],
  ['Appui long immobile', 'Casser / attaquer'],
  ['Bouton Saut', 'Sauter, nager ; deux appuis rapides en Créatif pour voler'],
  ['Bouton Accroupi', 'S’accroupir (appuyer pour activer ou désactiver)'],
  ['Bouton Sprint', 'Courir (appuyer pour activer ou désactiver)'],
  ['Bouton Épée', 'Attaquer / casser'],
  ['Bouton Utiliser', 'Utiliser / poser'],
  ['Case de la barre', 'Sélectionner ; maintenir pour lâcher un objet'],
  ['Bouton « … »', 'Inventaire'],
  ['Boutons du haut', 'Changer de vue, discussion, menu du jeu'],
  'La disposition des boutons se modifie dans Paramètres → Tactile.',
];

const PAD_HELP: HelpRows = [
  ['Stick gauche', 'Se déplacer'],
  ['Stick droit', 'Regarder autour de soi'],
  ['Bouton du bas', 'Sauter / monter en vol'],
  ['Bouton de droite', 'S’accroupir (activer / désactiver)'],
  ['Bouton de gauche', 'Lâcher l’objet tenu'],
  ['Bouton du haut', 'Inventaire'],
  ['Gâchettes hautes', 'Objet précédent / suivant'],
  ['Gâchette gauche', 'Utiliser / poser'],
  ['Gâchette droite', 'Attaquer / casser'],
  ['Clic du stick gauche', 'Courir'],
  ['Clic du stick droit, croix haut', 'Changer de vue'],
  ['Croix bas', 'Lâcher l’objet tenu'],
  ['Bouton Sélection', 'Discussion'],
  ['Bouton Start', 'Menu du jeu'],
  'Dans les menus',
  ['Stick gauche ou croix', 'Se déplacer entre les éléments'],
  ['Bouton du bas', 'Valider'],
  ['Bouton de droite ou Start', 'Retour'],
];

function openHelp(app: AppContext): void {
  type Tab = 'keyboard' | 'touch' | 'pad';
  const pane = h('div', { class: 'igs-help-pane' });
  const show = (t: Tab) => {
    pane.textContent = '';
    pane.appendChild(helpGrid(t === 'keyboard' ? keyboardHelp(app) : t === 'touch' ? TOUCH_HELP : PAD_HELP));
    pane.scrollTop = 0;
  };
  const initial: Tab = app.touchMode ? 'touch' : app.input.lastDevice === 'gamepad' ? 'pad' : 'keyboard';
  const tabs = segmented<Tab>(
    [
      ['keyboard', 'Clavier'],
      ['touch', 'Tactile'],
      ['pad', 'Manette'],
    ],
    initial,
    show,
  );
  show(initial);
  modal('Aide', [tabs, pane], [['Fermer', () => undefined]]);
}

/** Liste des commandes : choisir une ligne la pré-remplit dans la discussion. */
function openCommands(app: AppContext, game: Game): void {
  let close: (() => void) | null = null;
  const allowed = !game.net || game.net.isOperator;
  const list = h('div', { class: 'igs-cmd-list' });
  for (const [usage, desc] of COMMAND_HELP) {
    const name = usage.split(' ')[0];
    const prefill = name + (usage.includes(' ') ? ' ' : '');
    list.appendChild(
      button(
        [h('span', { class: 'igs-cmd-u' }, usage), h('span', { class: 'igs-cmd-d' }, desc)],
        () => {
          close?.();
          app.ui.back(); // ferme le menu du jeu
          game.openChat(prefill);
        },
        'dark igs-cmd',
      ),
    );
  }
  const intro = allowed
    ? 'Choisissez une commande pour la saisir dans la discussion. « ~ » désigne votre position actuelle.'
    : 'Vous devez être opérateur du serveur pour utiliser les commandes (sauf /help et /seed).';
  close = modal('Commandes', [h('div', { class: 'desc' }, intro), list], [['Fermer', () => undefined]]);
}

// ------------------------------------------------------------------ discussion
/** Historique des messages envoyés (partagé entre les ouvertures, 50 au plus). */
const HISTORY: string[] = [];
const COMMAND_NAMES = [...new Set(COMMAND_HELP.map(([u]) => u.split(' ')[0]))];
/** Commandes utilisables sans triches (voir runCommand). */
const FREE_COMMANDS = new Set(['/help', '/seed']);
/** Mots d'usage qui ne sont pas de vraies valeurs (« n » = nombre, « type » = créature…). */
const PLACEHOLDERS = new Set(['n', 'type']);

function remember(text: string): void {
  if (HISTORY[HISTORY.length - 1] !== text) HISTORY.push(text);
  while (HISTORY.length > 50) HISTORY.shift();
}

const isLiteral = (a: string) => /^[a-z@]+$/.test(a);

/** Valeurs possibles d'un argument d'usage : mot fixe, ou alternatives <a|b|c>. */
function choicesOf(a: string): string[] {
  if (isLiteral(a)) return [a];
  const m = /^[<[]([^\]>]+)[\]>]$/.exec(a);
  if (!m || !m[1].includes('|')) return [];
  return m[1].split('|').filter((c) => isLiteral(c) && !PLACEHOLDERS.has(c));
}

/** Propositions pour l'argument en cours d'une commande (d'après COMMAND_HELP). */
function argChoices(head: string[]): string[] {
  const cmd = head[0].toLowerCase();
  const n = head.length - 1;
  const out = new Set<string>();
  for (const [usage] of COMMAND_HELP) {
    const toks = usage.split(/\s+/);
    if (toks[0] !== cmd) continue;
    const args = toks.slice(1);
    let ok = true;
    for (let i = 0; i < n && ok; i++) {
      const a = args[i];
      if (a === undefined || (isLiteral(a) && a !== head[i + 1].toLowerCase())) ok = false;
    }
    const a = args[n];
    if (!ok || !a) continue;
    for (const c of choicesOf(a)) out.add(c);
  }
  return [...out];
}

export class ChatScreen implements Screen {
  readonly el: HTMLElement;
  readonly modalGame = true;
  private input: HTMLInputElement;
  private sugg: HTMLElement;
  private histPos = HISTORY.length;
  private draft = '';
  private tab: { head: string; cands: string[]; idx: number; last: string } | null = null;
  private refreshTimer = 0;
  private closed = false;

  constructor(
    private app: AppContext,
    private game: Game,
    initial: string,
  ) {
    ensureStyle();
    this.input = h('input', {
      type: 'text',
      value: initial,
      maxlength: '256',
      spellcheck: 'false',
      autocomplete: 'off',
      autocapitalize: 'off',
      enterkeyhint: 'send',
      placeholder: 'Écrivez un message, ou / pour une commande',
    }) as HTMLInputElement;
    this.input.value = initial;
    this.sugg = h('div', { class: 'igs-sugg hidden' });
    const form = h('form', { class: 'chat-input igs-chatbar', action: '#' }, this.input);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.send();
    });
    if (app.touchMode) {
      const send = button('Envoyer', () => this.send(), 'green');
      // Garder le clavier virtuel ouvert : le bouton ne prend pas le focus
      for (const ev of ['pointerdown', 'mousedown']) send.addEventListener(ev, (e) => e.preventDefault());
      const x = button(img('close_white'), () => this.close(), 'dark square');
      x.title = 'Fermer';
      form.append(send, x);
    }
    this.input.addEventListener('keydown', (e) => this.onKey(e));
    this.input.addEventListener('keyup', (e) => e.stopPropagation());
    this.input.addEventListener('input', () => {
      this.tab = null;
      this.renderSuggestions();
    });
    this.el = h('div', { class: 'igs-chat' }, this.sugg, form);
    // Toucher le fond redonne le focus au champ
    this.el.addEventListener('pointerdown', (e) => {
      if (e.target !== this.el) return;
      e.preventDefault();
      this.focus();
    });
    game.hud.showChatHistory(true);
    this.renderSuggestions();
    queueMicrotask(() => this.focus());
    requestAnimationFrame(() => this.focus());
  }

  update(dt: number): void {
    // Fermeture demandée alors qu'un autre écran était au-dessus
    if (this.closed) {
      if (this.app.ui.current === this) this.app.ui.back();
      return;
    }
    // Garde les lignes du chat visibles tant que la saisie est ouverte
    this.refreshTimer += dt;
    if (this.refreshTimer >= 1) {
      this.refreshTimer = 0;
      this.game.hud.showChatHistory(true);
    }
  }

  destroy(): void {
    this.closed = true;
    this.game.hud.showChatHistory(false);
  }

  private focus(): void {
    if (this.closed || !this.el.isConnected) return;
    if (document.activeElement !== this.input) this.input.focus({ preventScroll: true });
    const n = this.input.value.length;
    try {
      this.input.setSelectionRange(n, n);
    } catch {
      /* sélection indisponible */
    }
  }

  private onKey(e: KeyboardEvent): void {
    e.stopPropagation(); // le jeu ne reçoit pas les touches tapées
    if (e.isComposing) return;
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault();
      this.send();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.history(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.history(1);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.complete();
    }
  }

  /** Envoie le texte : l'écran se ferme d'abord, pour que les commandes qui ouvrent un écran (dimension…) restent au premier plan. */
  private send(): void {
    if (this.closed) return;
    const text = this.input.value.trim();
    if (text) remember(text);
    this.close();
    if (text) this.game.submitChat(text);
  }

  private close(): void {
    if (this.closed) return;
    this.closed = true;
    this.input.blur();
    if (this.app.ui.current === this) this.app.ui.back();
  }

  private allowed(name: string): boolean {
    if (FREE_COMMANDS.has(name)) return true;
    const g = this.game;
    return g.meta.cheats && (!g.net || g.net.isOperator);
  }

  private setValue(v: string): void {
    this.input.value = v;
    this.tab = null;
    this.focus();
    this.renderSuggestions();
  }

  private history(dir: number): void {
    if (!HISTORY.length) return;
    if (this.histPos === HISTORY.length) this.draft = this.input.value;
    const pos = Math.max(0, Math.min(HISTORY.length, this.histPos + dir));
    if (pos === this.histPos) return;
    this.histPos = pos;
    this.setValue(pos === HISTORY.length ? this.draft : HISTORY[pos]);
  }

  /** Tab : complète le nom de commande (ou une valeur connue) ; appuis suivants = proposition suivante. */
  private complete(): void {
    const v = this.input.value;
    if (!v.startsWith('/')) return;
    let t = this.tab;
    if (!t || t.last !== v) {
      const parts = v.split(' ');
      const cur = parts[parts.length - 1].toLowerCase();
      const head = parts.slice(0, -1);
      const pool = head.length === 0 ? COMMAND_NAMES.filter((n) => this.allowed(n)) : this.allowed(head[0].toLowerCase()) ? argChoices(head) : [];
      const cands = pool.filter((c) => c.startsWith(cur));
      if (!cands.length) return;
      t = { head: head.join(' '), cands, idx: 0, last: '' };
    } else t.idx = (t.idx + 1) % t.cands.length;
    const single = t.cands.length === 1;
    const val = (t.head ? t.head + ' ' : '') + t.cands[t.idx] + (single ? ' ' : '');
    this.setValue(val);
    this.tab = single ? null : { ...t, last: val };
  }

  /** Liste des commandes correspondant à la saisie, au-dessus du champ. */
  private renderSuggestions(): void {
    const v = this.input.value;
    const box = this.sugg;
    box.textContent = '';
    if (!v.startsWith('/')) {
      box.classList.add('hidden');
      return;
    }
    const space = v.indexOf(' ');
    const typed = (space < 0 ? v : v.slice(0, space)).toLowerCase();
    const rows = COMMAND_HELP.filter(([u]) => {
      const name = u.split(' ')[0];
      return this.allowed(name) && (space < 0 ? name.startsWith(typed) : name === typed);
    }).slice(0, 8);
    for (const [usage, desc] of rows) {
      const name = usage.split(' ')[0];
      const item = h('div', { class: 'igs-sugg-item' }, h('span', { class: 'c' }, usage), h('span', { class: 'd' }, desc));
      item.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setValue(name + (usage.includes(' ') ? ' ' : ''));
      });
      box.appendChild(item);
    }
    if (!this.allowed('/time')) box.appendChild(h('div', { class: 'igs-sugg-hint' }, this.game.meta.cheats ? 'Les autres commandes sont réservées aux opérateurs du serveur.' : 'Les autres commandes nécessitent l’option « Activer les triches » du monde.'));
    box.classList.toggle('hidden', !box.childElementCount);
  }
}

// ------------------------------------------------------------------ écran de mort
/** Score affiché : niveau d'expérience (ou `deathScore` si la partie le mémorise avant de le remettre à zéro). */
function deathScore(game: Game): number {
  const s = (game as unknown as { deathScore?: unknown }).deathScore;
  return typeof s === 'number' && Number.isFinite(s) ? s : game.player.xpLevel;
}

export class DeathScreen implements Screen {
  readonly el: HTMLElement;
  private respawnBtn: HTMLButtonElement;
  private menuBtn: HTMLButtonElement;
  private busy = false;
  private done = false;

  constructor(
    private app: AppContext,
    private game: Game,
    message: string,
  ) {
    ensureStyle();
    this.respawnBtn = button('Réapparaître', () => void this.respawn());
    this.menuBtn = button('Menu principal', () => void this.toMenu());
    this.el = h(
      'div',
      { class: 'death igs-death' },
      h('h1', null, 'Vous êtes mort !'),
      message ? h('div', { class: 'igs-death-msg' }, message) : null,
      h('div', { class: 'igs-death-score' }, 'Score : ', h('span', { class: 'igs-yellow' }, String(deathScore(game)))),
      h('div', { class: 'igs-death-btns' }, this.respawnBtn, this.menuBtn),
    );
    focusLater(app, this.el, () => this.respawnBtn);
  }

  /** Le retour ne fait rien tant que le joueur n'a pas réapparu. */
  onBack(): boolean {
    return !this.done;
  }

  update(): void {
    // Réapparition terminée alors qu'un écran de chargement était au-dessus
    if (this.done && this.app.ui.current === this) this.app.ui.back();
  }

  private setBusy(on: boolean): void {
    this.busy = on;
    this.respawnBtn.disabled = on;
    this.menuBtn.disabled = on;
  }

  private async respawn(): Promise<void> {
    if (this.busy) return;
    this.setBusy(true);
    this.respawnBtn.textContent = 'Réapparition…';
    try {
      await this.game.respawn();
      this.done = true;
      if (this.app.ui.current === this) this.app.ui.back();
      if (!this.app.touchMode) this.app.input.requestPointerLock();
    } catch (e) {
      console.error(e);
      toast('Réapparition impossible : ' + (e instanceof Error ? e.message : String(e)));
      this.respawnBtn.textContent = 'Réapparaître';
      this.setBusy(false);
    }
  }

  private async toMenu(): Promise<void> {
    if (this.busy) return;
    this.setBusy(true);
    this.menuBtn.textContent = 'Enregistrement…';
    try {
      await this.app.quitToMenu();
    } catch (e) {
      console.error(e);
      toast('Impossible de quitter la partie : ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      if (this.el.isConnected) {
        this.menuBtn.textContent = 'Menu principal';
        this.setBusy(false);
      }
    }
  }
}
