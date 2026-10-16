/**
 * Écran titre : logo, phrase d'accroche animée, nom du joueur, boutons principaux,
 * bannière « Packs de ressources » (paysage pixel animé dessiné par le code), courrier
 * des nouveautés, profil, social, vestiaire et personnage 3D qui suit le pointeur du regard.
 */
import { h, button, confirmDialog, clickSound } from '../dom';
import { createLogoCanvas } from '../logo';
import { NEWS_VERSION, drawSkinFace, validSkin } from './SocialScreens';
import type { AppContext } from '../../core/AppContext';
import type { Screen } from '../UIManager';

// ------------------------------------------------------------------ phrases d'accroche
const SPLASHES = [
  'Un cube à la fois !',
  'Cent pour cent procédural !',
  'Rien n’est rond ici !',
  'Même les nuages sont carrés !',
  'Gare aux braises !',
  'Ne creusez jamais à pic !',
  'Le ciel vous attend !',
  'Ne nourrissez pas le dragon !',
  'Le Golem antique veille !',
  'Textures faites maison !',
  'Pixel par pixel !',
  'Votre maison, vos règles !',
  'Aucun cube n’a été maltraité !',
  'Bâtir, explorer, recommencer !',
  'La nuit porte conseil !',
  'Jouable dans le bus !',
  'Un cristal ne suffit jamais !',
  'Infini… ou presque !',
  'Maintenant en français !',
  'Invitez vos amis !',
  'Vive le troc villageois !',
  'La pioche avant tout !',
  'Plus de trente biomes !',
  'Musique jouée en direct !',
  'Aussi carré que possible !',
  'Attention à la lave !',
  'Les montagnes sont vraies !',
  'Aventure garantie !',
  'Vaches cubiques garanties !',
  'Le soleil se lève à l’est !',
  'Rangez votre inventaire !',
  'Fait main, par du code !',
];

function pickSplash(name: string): string {
  const list = [...SPLASHES, `Bon retour, ${name} !`];
  return list[Math.floor(Math.random() * list.length)];
}

// ------------------------------------------------------------------ styles propres à l'écran titre
const STYLE_ID = 'ts-style';
const CSS = `
.ts-splash-anchor { position: absolute; left: 97%; top: 66%; width: 0; height: 0; }
.ts-splash { left: 0; top: 0; animation-name: ts-splash; }
@keyframes ts-splash { from { transform: translate(-50%, -50%) rotate(-20deg) scale(1); } to { transform: translate(-50%, -50%) rotate(-20deg) scale(1.08); } }
.ts-gamertag { left: 86%; top: 96%; white-space: nowrap; }
.title-screen .ts-preview { top: auto; right: calc(8.5% + var(--u) * 11); bottom: calc(13% + var(--u) * 14); width: calc(var(--u) * 64); height: calc(var(--u) * 96); }
.title-buttons .ts-banner { padding: 0; gap: 0; width: 100%; font: inherit; background: #8fcdf2; box-sizing: border-box; }
.ts-banner canvas { transition: filter 0.1s; }
.ts-banner:hover canvas, .ts-banner:focus-visible canvas { filter: brightness(1.1); }
.ts-banner .banner-label { position: absolute; left: 50%; bottom: calc(var(--u) * 3); transform: translateX(-50%); font-size: calc(var(--u) * 7.5); white-space: nowrap; background: rgba(255, 255, 255, 0.78); border: calc(var(--u) * 1) solid rgba(30, 30, 31, 0.55); padding: 0 calc(var(--u) * 4); text-shadow: none; line-height: 1.3; }
.ts-banner .ribbon { z-index: 1; top: calc(var(--u) * 2); right: calc(var(--u) * 3); font-size: calc(var(--u) * 6.5); padding: 0 calc(var(--u) * 4); line-height: 1.4; }
.ts-mail { width: calc(var(--u) * 24); padding: 0 !important; }
.ts-mail .ico { width: calc(var(--u) * 20); height: calc(var(--u) * 20); }
.ts-face { width: calc(var(--u) * 14) !important; height: calc(var(--u) * 14) !important; border: calc(var(--u) * 1) solid #1e1e1f; }
`;

function ensureStyle(): void {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = CSS;
  document.head.appendChild(s);
}

// ------------------------------------------------------------------ bannière pixel (paysage de village)
function rand(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

interface Walker {
  min: number;
  max: number;
  speed: number;
  phase: number;
  hat: string;
  robe: string;
}

/** Petit paysage animé : ciel, nuages, collines, maisons, arbres, villageois et une poule. */
class BannerArt {
  private w = 144;
  private readonly hgt = 32;
  private readonly gy = 25; // haut de l'herbe
  private far: number[] = [];
  private near: number[] = [];
  private noise: number[] = [];
  private flowers: Array<[number, string]> = [];
  private walkers: Walker[] = [];
  private g: CanvasRenderingContext2D | null;

  constructor(readonly canvas: HTMLCanvasElement) {
    this.g = canvas.getContext('2d');
    this.resize(this.w);
  }

  /** Adapte la résolution interne au rapport largeur/hauteur affiché (pixels carrés). */
  fit(): void {
    const r = this.canvas.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return;
    const w = Math.max(64, Math.min(320, Math.round((this.hgt * r.width) / r.height)));
    if (w !== this.w) this.resize(w);
  }

  private resize(w: number): void {
    this.w = w;
    this.canvas.width = w;
    this.canvas.height = this.hgt;
    const r = rand(4242);
    this.far = [];
    this.near = [];
    let a = 15;
    let b = 19;
    for (let x = 0; x < w + 4; x += 3) {
      a = Math.max(11, Math.min(18, a + Math.round((r() - 0.5) * 3)));
      b = Math.max(17, Math.min(22, b + Math.round((r() - 0.5) * 2.4)));
      this.far.push(a);
      this.near.push(b);
    }
    this.noise = [];
    for (let i = 0; i < w * 7; i++) this.noise.push(r());
    this.flowers = [];
    for (let i = 0; i < w / 9; i++) this.flowers.push([Math.floor(r() * w), r() < 0.5 ? '#e84a3a' : '#f0d040']);
    const robes: Array<[string, string]> = [
      ['#c8a050', '#7a6a3a'],
      ['#e8e8e0', '#4a5a8a'],
      ['#3a3a3a', '#8a3a3a'],
      ['#6a2a8a', '#5a2a6a'],
    ];
    const spots: Array<[number, number]> = [
      [0.2, 0.3],
      [0.38, 0.52],
      [0.55, 0.7],
      [0.76, 0.9],
    ];
    this.walkers = spots.map(([s, e], i) => ({ min: Math.round(w * s), max: Math.round(w * e), speed: 0.35 + r() * 0.3, phase: r() * 6, hat: robes[i][0], robe: robes[i][1] }));
  }

  private rect(x: number, y: number, w: number, hh: number, c: string): void {
    if (!this.g || w <= 0 || hh <= 0) return;
    this.g.fillStyle = c;
    this.g.fillRect(Math.round(x), Math.round(y), w, hh);
  }

  draw(t: number): void {
    const g = this.g;
    if (!g) return;
    const w = this.w;
    const gy = this.gy;
    // Ciel en bandes
    const sky = ['#64aee9', '#70b5ec', '#7dbdee', '#8ac5f0', '#98cdf2', '#a6d5f4', '#b5ddf6'];
    const band = Math.ceil(gy / sky.length);
    sky.forEach((c, i) => this.rect(0, i * band, w, band, c));
    // Soleil
    const sx = Math.round(w * 0.05) + 2;
    this.rect(sx - 1, 2, 7, 7, '#fff6b8');
    this.rect(sx, 3, 5, 5, '#ffe060');
    // Nuages qui dérivent
    for (let i = 0; i < 4; i++) {
      const len = 9 + ((i * 5) % 7);
      const x = ((i * 47 + t * (1.2 + i * 0.4)) % (w + 30)) - 15;
      const y = 3 + ((i * 3) % 6);
      this.rect(x, y, len, 2, '#ffffff');
      this.rect(x + 2, y - 1, len - 5, 1, '#ffffff');
      this.rect(x + 1, y + 2, len - 2, 1, '#dde9f2');
    }
    // Collines lointaines puis proches
    this.far.forEach((top, i) => {
      this.rect(i * 3, top, 3, gy - top, '#86bfa0');
      this.rect(i * 3, top, 3, 1, '#9fd0b4');
    });
    this.near.forEach((top, i) => {
      this.rect(i * 3, top, 3, gy - top, '#5d9c4b');
      this.rect(i * 3, top, 3, 1, '#72b25c');
    });
    // Sol : herbe et terre bruitées
    for (let x = 0; x < w; x++) {
      for (let y = gy; y < this.hgt; y++) {
        const n = this.noise[(x * 7 + (y - gy)) % this.noise.length];
        let c: string;
        if (y === gy) c = n < 0.25 ? '#6fbf4a' : '#5aab3a';
        else if (y === gy + 1) c = n < 0.35 ? '#7a5a3a' : '#4f9a34';
        else c = n < 0.2 ? '#6a4a2e' : n > 0.85 ? '#a07650' : '#8a6340';
        this.rect(x, y, 1, 1, c);
      }
    }
    for (const [x, c] of this.flowers) this.rect(x, gy - 1, 1, 1, c);
    // Décor
    this.house(Math.round(w * 0.04), 14, 8, '#c9a066', '#6b4a2b', '#9a3a2a', '#b24a32');
    this.tree(Math.round(w * 0.3));
    this.fence(Math.round(w * 0.42), Math.round(w * 0.12));
    this.house(Math.round(w * 0.64), 16, 9, '#a8a8a8', '#5a5a60', '#4a5a7a', '#5c6e92');
    this.tree(Math.round(w * 0.9));
    // Villageois qui se promènent
    for (const v of this.walkers) {
      const s = Math.sin(t * v.speed + v.phase);
      const x = v.min + ((v.max - v.min) * (s + 1)) / 2;
      const moving = Math.abs(Math.cos(t * v.speed + v.phase)) > 0.15;
      const dir = Math.cos(t * v.speed + v.phase) >= 0 ? 1 : -1;
      this.villager(x, v.hat, v.robe, dir, moving ? Math.floor(t * 5 + v.phase) % 2 : 0);
    }
    this.chicken(Math.round(w * 0.58), t);
  }

  private house(x: number, w: number, wallH: number, wall: string, beam: string, roof1: string, roof2: string): void {
    const gy = this.gy;
    const top = gy - wallH;
    this.rect(x, top, w, wallH, wall);
    for (let y = top + 2; y < gy; y += 3) this.rect(x + 1, y, w - 2, 1, 'rgba(0,0,0,0.12)');
    this.rect(x, top, 1, wallH, beam);
    this.rect(x + w - 1, top, 1, wallH, beam);
    this.rect(x, top, w, 1, beam);
    const dx = x + Math.floor(w / 2) - 1;
    this.rect(dx, gy - 5, 3, 5, '#5a3a1e');
    this.rect(dx + 2, gy - 3, 1, 1, '#e0b840');
    this.rect(x + 2, top + 2, 2, 2, '#a8def6');
    this.rect(x + w - 4, top + 2, 2, 2, '#a8def6');
    for (let i = 0; w + 2 - 2 * i > 1; i++) this.rect(x - 1 + i, top - 1 - i, w + 2 - 2 * i, 1, i % 2 ? roof2 : roof1);
  }

  private tree(x: number): void {
    const gy = this.gy;
    this.rect(x, gy - 6, 2, 6, '#6b4a2b');
    this.rect(x - 3, gy - 12, 8, 6, '#3f8a2e');
    this.rect(x - 2, gy - 13, 6, 1, '#3f8a2e');
    this.rect(x - 2, gy - 12, 2, 1, '#5aa83e');
    this.rect(x + 2, gy - 10, 2, 1, '#5aa83e');
    this.rect(x - 3, gy - 7, 8, 1, '#2f6e22');
  }

  private fence(x: number, len: number): void {
    const gy = this.gy;
    this.rect(x, gy - 3, len, 1, '#9a7448');
    for (let i = 0; i <= len; i += 4) this.rect(x + i, gy - 4, 1, 4, '#7a5636');
  }

  private villager(x: number, hat: string, robe: string, dir: number, frame: number): void {
    const gy = this.gy;
    const X = Math.round(x);
    this.rect(X - 1, gy - 9, 5, 1, hat);
    this.rect(X, gy - 8, 3, 3, '#c89a7a');
    this.rect(dir > 0 ? X + 2 : X, gy - 7, 1, 1, '#2a2a2a');
    this.rect(X, gy - 5, 3, 4, robe);
    if (frame) this.rect(X + 1, gy - 1, 1, 1, '#4a3a2a');
    else {
      this.rect(X, gy - 1, 1, 1, '#4a3a2a');
      this.rect(X + 2, gy - 1, 1, 1, '#4a3a2a');
    }
  }

  private chicken(x: number, t: number): void {
    const gy = this.gy;
    const peck = Math.sin(t * 1.7) > 0.6 ? 1 : 0;
    this.rect(x, gy - 3, 3, 2, '#f4f4f4');
    this.rect(x + 3, gy - 4 + peck, 1, 2, '#f4f4f4');
    this.rect(x + 3, gy - 5 + peck, 1, 1, '#d83030');
    this.rect(x + 4, gy - 3 + peck, 1, 1, '#e8a020');
    this.rect(x + 1, gy - 1, 1, 1, '#e8a020');
  }
}

// ------------------------------------------------------------------ écran titre
export class TitleScreen implements Screen {
  readonly el: HTMLElement;
  private time = 0;
  private refreshT = 0;
  private bannerT = 1;
  private preview: HTMLCanvasElement;
  private banner: BannerArt;
  private gamertag: HTMLElement;
  private badge: HTMLElement;
  private face: HTMLCanvasElement;
  private faceSkin = '';
  private socialLabel: HTMLElement;
  private lookX = -0.3;
  private lookY = 0.05;
  private tLookX = -0.3;
  private tLookY = 0.05;
  private idle = 10;
  private readonly onPointer = (e: PointerEvent) => {
    const r = this.preview.getBoundingClientRect();
    if (r.width === 0) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.3;
    this.tLookX = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.3)));
    this.tLookY = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight * 0.45)));
    this.idle = 0;
  };

  constructor(private app: AppContext) {
    ensureStyle();
    const s = app.settings.data;

    // Logo, phrase d'accroche et nom du joueur
    const logo = createLogoCanvas();
    logo.classList.add('pixel');
    const splashText = pickSplash(s.profileName);
    const splash = h('div', { class: 'splash ts-splash' }, splashText);
    if (splashText.length > 16) splash.style.fontSize = `calc(var(--u) * ${Math.max(4.5, (8 * 16) / splashText.length).toFixed(2)})`;
    this.gamertag = h('div', { class: 'gamertag ts-gamertag' }, s.profileName);
    const logoBox = h('div', { class: 'title-logo' }, logo, h('div', { class: 'ts-splash-anchor' }, splash), this.gamertag);

    // Personnage 3D (sous les boutons dans l'ordre d'affichage)
    this.preview = h('canvas', { class: 'player-preview pixel ts-preview', width: '160', height: '240' });

    // Boutons principaux + bannière
    const bannerCv = h('canvas', { class: 'pixel' });
    this.banner = new BannerArt(bannerCv);
    const bannerBtn = h(
      'button',
      { class: 'banner server-item focus-ring ts-banner', type: 'button', title: 'Packs de ressources' },
      bannerCv,
      h('span', { class: 'banner-label' }, 'Packs de ressources'),
      h('span', { class: 'ribbon' }, 'Nouveau !'),
    );
    bannerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clickSound?.();
      app.openSettings('packs');
    });
    const buttons = h(
      'div',
      { class: 'title-buttons' },
      button('Jouer', () => app.openPlay('worlds')),
      button('Paramètres', () => app.openSettings()),
      button('Multijoueur', () => app.openPlay('servers'), 'purple'),
      bannerBtn,
    );

    // Coin bas-gauche : courrier (nouveautés) et profil
    this.badge = h('div', { class: 'mail-badge' });
    const mail = button('', () => app.openCredits(), 'square ts-mail', 'mail');
    mail.title = 'Nouveautés et crédits';
    mail.appendChild(this.badge);
    this.face = h('canvas', { class: 'ico pixel ts-face' });
    const profile = button('Profil', () => app.openProfile());
    profile.prepend(this.face);

    // Coin haut-droit : social ; bas-droit : vestiaire
    this.socialLabel = h('span', null, 'Social (0)');
    const social = button(this.socialLabel, () => app.openSocial(), '', 'social');

    this.el = h(
      'div',
      { class: 'title-screen' },
      this.preview,
      logoBox,
      buttons,
      h('div', { class: 'corner-tl' }, mail, profile),
      h('div', { class: 'corner-tr' }, social),
      h('div', { class: 'dressing' }, button('Vestiaire', () => app.openDressingRoom())),
      h('div', { class: 'footer-left' }, 'Voxelia — jeu indépendant'),
      h('div', { class: 'footer-right' }, 'v' + app.version),
    );
    window.addEventListener('pointermove', this.onPointer);
    window.addEventListener('pointerdown', this.onPointer);
    this.refresh();
    this.banner.draw(0);
  }

  /** Met à jour ce qui a pu changer dans un autre écran (nom, apparence, nouveautés lues, joueurs). */
  private refresh(): void {
    const s = this.app.settings.data;
    if (this.gamertag.textContent !== s.profileName) this.gamertag.textContent = s.profileName;
    this.badge.style.display = (s.splashSeen ?? 0) >= NEWS_VERSION ? 'none' : '';
    const skin = validSkin(s.skin);
    if (skin !== this.faceSkin) {
      this.faceSkin = skin;
      drawSkinFace(this.face, skin);
    }
    let n = 0;
    try {
      n = this.app.game?.net?.remotePlayers().length ?? 0;
    } catch {
      n = 0;
    }
    const label = `Social (${n})`;
    if (this.socialLabel.textContent !== label) this.socialLabel.textContent = label;
  }

  update(dt: number): void {
    this.time += dt;
    this.refreshT -= dt;
    if (this.refreshT <= 0) {
      this.refreshT = 0.5;
      this.refresh();
    }
    // Bannière animée (~12 images/s)
    this.bannerT -= dt;
    if (this.bannerT <= 0) {
      this.bannerT = 1 / 12;
      this.banner.fit();
      this.banner.draw(this.time);
    }
    // Regard : suit le pointeur, revient au repos après quelques secondes d'inactivité
    this.idle += dt;
    const tx = this.idle > 4 ? -0.3 : this.tLookX;
    const ty = this.idle > 4 ? 0.05 : this.tLookY;
    const k = 1 - Math.exp(-dt * 7);
    this.lookX += (tx - this.lookX) * k;
    this.lookY += (ty - this.lookY) * k;
    // Lacet 0 = face à la caméra ; lacet / regard positifs = vers la droite de l'écran, regard Y positif = vers le haut.
    this.app.preview.draw(this.preview, 'player_' + validSkin(this.app.settings.data.skin), this.lookX * 0.35, this.time, this.lookX * 0.85, -this.lookY * 0.8, 0);
  }

  onBack(): boolean {
    confirmDialog('Quitter Voxelia ?', 'Voulez-vous vraiment quitter le jeu ?', 'Quitter', () => this.app.exitApp());
    return true;
  }

  destroy(): void {
    window.removeEventListener('pointermove', this.onPointer);
    window.removeEventListener('pointerdown', this.onPointer);
  }
}
