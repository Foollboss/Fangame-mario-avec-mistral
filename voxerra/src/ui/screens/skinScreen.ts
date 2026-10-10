/**
 * Personnalisation du skin : aperçu 3D qui tourne (on le fait pivoter en le glissant),
 * skins tout faits, nuanciers, coiffure, motif, manches, accessoire, skin au hasard et code à
 * partager. Les changements s'appliquent à l'aperçu ; « Terminé » les enregistre.
 */
import * as THREE from 'three';
import { h, button, cycle, clear } from '../dom';
import type { Screen } from '../ui';
import type { AppApi } from '../../app/api';
import { t } from '../../i18n/i18n';
import { ACCESSOIRES, COIFFURES, DEFAULT_SKIN, LABELS, MANCHES, MOTIFS, PALETTES, PRESETS, decodeSkin, encodeSkin, playerParts, randomSkin, type Skin } from '../../entity/skin';
import { SkinPreview } from '../../render/entities';
import { drawSkinFront } from '../../render/playerSkin';

type ColorKey = 'peau' | 'yeux' | 'cheveux' | 'haut' | 'bas' | 'chaussures' | 'accessoireCouleur';

export function skinScreen(app: AppApi, inGame = false): Screen {
  let skin: Skin = decodeSkin(app.settings.skin) ?? DEFAULT_SKIN;

  // ---- aperçu 3D
  const canvas = h('canvas', { class: 'skin-canvas' }) as HTMLCanvasElement;
  let renderer: THREE.WebGLRenderer | null = null;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // mêmes couleurs que dans le jeu
  } catch {
    renderer = null; // pas de WebGL : la vignette de face suffit
  }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 2 / 3, 0.1, 50);
  camera.position.set(0, 0.15, 4.4);
  camera.lookAt(0, 0.05, 0);
  const preview = new SkinPreview(skin);
  scene.add(preview.group);
  // le modèle regarde vers −Z : demi-tour pour qu'il fasse face, un peu de trois quarts
  let angle = Math.PI - 0.45;
  let dragging: { x: number; a: number } | null = null;
  let idle = 0;
  canvas.addEventListener('pointerdown', (e) => {
    dragging = { x: e.clientX, a: angle };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (dragging) angle = dragging.a + (e.clientX - dragging.x) * 0.02;
  });
  const endDrag = () => {
    dragging = null;
    idle = 0;
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  const flat = h('div', { class: 'skin-flat' });
  let raf = 0;
  let last = performance.now();
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (!renderer) return;
    // tourne tout seul quand on ne le manipule pas
    idle += dt;
    if (!dragging && idle > 1.5) angle += dt * 0.6;
    const w = canvas.clientWidth,
      hh = canvas.clientHeight;
    if (w && hh && (canvas.width !== Math.round(w * devicePixelRatio) || canvas.height !== Math.round(hh * devicePixelRatio))) {
      renderer.setPixelRatio(devicePixelRatio);
      renderer.setSize(w, hh, false);
      camera.aspect = w / hh;
      camera.updateProjectionMatrix();
    }
    preview.group.rotation.y = angle;
    preview.animate(now / 1000);
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  // ---- réglages
  const panel = h('div', { class: 'skin-panel' });
  const codeLine = h('div', { class: 'skin-code' });
  const apply = (s: Skin) => {
    skin = s;
    preview.setSkin(skin);
    clear(flat);
    if (!renderer) flat.appendChild(drawSkinFront(skin, playerParts(skin)));
    codeLine.textContent = t('Code : {code}', { code: encodeSkin(skin) });
    build();
  };
  const set = <K extends keyof Skin>(k: K, v: Skin[K]) => apply({ ...skin, [k]: v });

  const swatches = (key: ColorKey, colors: string[]) =>
    h(
      'div',
      { class: 'swatches' },
      colors.map((c) => {
        const b = h('button', { class: 'swatch' + (skin[key] === c ? ' on' : ''), title: c, style: { background: c } });
        b.addEventListener('click', () => set(key, c));
        return b;
      }),
    );
  const row = (label: string, ...children: HTMLElement[]) => h('div', { class: 'skin-row' }, h('div', { class: 'skin-label' }, label), ...children);
  const choice = <T extends string>(label: string, list: readonly T[], labels: Record<T, string>, current: T, onChange: (v: T) => void) =>
    cycle(label, list.map((v) => ({ v, t: t(labels[v]) })), current, onChange, 'skin-cycle');

  const presets = h('div', { class: 'skin-presets' });
  for (const p of PRESETS) {
    const b = h('button', { class: 'skin-preset', title: t(p.name) }, drawSkinFront(p.skin, playerParts(p.skin)), h('span', {}, t(p.name)));
    b.addEventListener('click', () => apply({ ...p.skin }));
    presets.appendChild(b);
  }

  function build(): void {
    const top = panel.scrollTop;
    clear(panel);
    panel.append(
      row(t('Skins tout faits'), presets),
      row(t('Peau'), swatches('peau', PALETTES.peau)),
      row(t('Yeux'), swatches('yeux', PALETTES.yeux)),
      row(t('Cheveux'), choice(t('Coiffure'), COIFFURES, LABELS.coiffure, skin.coiffure, (v) => set('coiffure', v)), swatches('cheveux', PALETTES.cheveux)),
      row(
        t('Haut'),
        h('div', { class: 'skin-pair' }, choice(t('Motif'), MOTIFS, LABELS.motif, skin.motif, (v) => set('motif', v)), choice(t('Manches'), MANCHES, LABELS.manches, skin.manches, (v) => set('manches', v))),
        swatches('haut', PALETTES.vetements),
      ),
      row(t('Pantalon'), swatches('bas', PALETTES.vetements)),
      row(t('Chaussures'), swatches('chaussures', PALETTES.vetements)),
      row(t('Accessoire'), choice(t('Accessoire'), ACCESSOIRES, LABELS.accessoire, skin.accessoire, (v) => set('accessoire', v)), swatches('accessoireCouleur', PALETTES.vetements)),
    );
    panel.scrollTop = top;
  }

  // ---- code à partager
  const codeIn = h('input', { class: 'input skin-code-input', placeholder: t('Collez un code de skin…'), spellcheck: false }) as HTMLInputElement;
  const codeMsg = h('div', { class: 'hint skin-code-msg' });
  codeIn.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') useCode();
  });
  const useCode = () => {
    const s = decodeSkin(codeIn.value);
    if (!s) {
      codeMsg.textContent = t('Code invalide.');
      return;
    }
    apply(s);
    codeIn.value = '';
    codeMsg.textContent = t('Skin chargé !');
  };
  const copyCode = () => {
    const code = encodeSkin(skin);
    codeIn.value = code;
    codeIn.select();
    navigator.clipboard
      ?.writeText(code)
      .then(() => (codeMsg.textContent = t('Code copié !')))
      .catch(() => (codeMsg.textContent = t('Copiez le code sélectionné.')));
  };

  const el = h(
    'div',
    { class: 'screen dim skin-screen' },
    h('div', { class: 'title' }, t('Personnaliser le skin')),
    h(
      'div',
      { class: 'skin-layout' },
      h('div', { class: 'skin-left' }, renderer ? canvas : flat, h('div', { class: 'hint' }, renderer ? t('Glissez pour le faire tourner') : ''), button(t('Au hasard'), () => apply(randomSkin()))),
      panel,
    ),
    h('div', { class: 'skin-codebar' }, codeLine, h('div', { class: 'row' }, codeIn, button(t('Copier'), copyCode, 'small'), button(t('Charger'), useCode, 'small')), codeMsg),
    h(
      'div',
      { class: 'row' },
      button(t('Annuler'), () => app.ui.pop(), 'half'),
      button(
        t('Terminé'),
        () => {
          app.settings.skin = encodeSkin(skin);
          app.saveSettings();
          app.applySettings();
          app.ui.pop();
        },
        'half',
      ),
    ),
  );
  apply(skin);
  return {
    el,
    pauses: inGame,
    onClose: () => {
      cancelAnimationFrame(raf);
      preview.dispose();
      renderer?.dispose();
      renderer?.forceContextLoss();
    },
  };
}
