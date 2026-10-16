/**
 * Sections « Manette » et « Tactile » des paramètres, avec l'éditeur de disposition
 * des commandes tactiles (glisser-déposer au doigt ou à la souris).
 */
import { button, confirmDialog, h, toast } from '../../dom';
import { choiceRow, intro, pct, sectionHead, setSetting, settingToggle, sliderRow, type SectionCtx } from './common';

// ---------------------------------------------------------------- manette
/** Correspondance fixe lue par InputManager.pollGamepad (disposition « standard » des navigateurs). */
const PAD_GAME: Array<[string, string]> = [
  ['Stick gauche', 'Se déplacer'],
  ['Stick droit', 'Regarder autour de soi'],
  ['Bouton du bas', 'Sauter / monter en vol'],
  ['Bouton de droite', 'S’accroupir (appuyer pour activer ou désactiver)'],
  ['Bouton de gauche', 'Lâcher l’objet tenu'],
  ['Bouton du haut', 'Inventaire'],
  ['Gâchette haute gauche', 'Objet précédent'],
  ['Gâchette haute droite', 'Objet suivant'],
  ['Gâchette gauche', 'Utiliser / poser'],
  ['Gâchette droite', 'Attaquer / casser'],
  ['Clic du stick gauche', 'Courir (s’arrête quand vous ne marchez plus en avant)'],
  ['Clic du stick droit', 'Changer de vue'],
  ['Croix : haut', 'Changer de vue'],
  ['Croix : bas', 'Lâcher l’objet tenu'],
  ['Bouton Sélection', 'Discussion'],
  ['Bouton Start', 'Pause'],
];

const PAD_MENU: Array<[string, string]> = [
  ['Stick gauche ou croix', 'Se déplacer entre les éléments'],
  ['Gauche / droite sur un curseur des paramètres', 'Modifier sa valeur'],
  ['Bouton du bas', 'Valider'],
  ['Bouton de droite ou Start', 'Retour'],
  ['Bouton du haut', 'Inventaire'],
];

function table(rows: Array<[string, string]>, head: [string, string]): HTMLElement {
  const t = h('div', { class: 'st-table' }, h('div', { class: 'st-th' }, head[0]), h('div', { class: 'st-th' }, head[1]));
  for (const [a, b] of rows) t.append(h('div', null, a), h('div', null, b));
  return t;
}

function connectedPad(): Gamepad | null {
  try {
    const pads = typeof navigator.getGamepads === 'function' ? navigator.getGamepads() : [];
    return [...pads].find((p): p is Gamepad => !!p && p.connected) ?? null;
  } catch {
    return null;
  }
}

export function controllerSection(ctx: SectionCtx): HTMLElement[] {
  const app = ctx.app;
  const s = app.settings.data;
  const status = h('div', { class: 'st-val' });
  const statusDesc = h('div', { class: 'desc' });
  let last = '';
  let acc = 1;
  const poll = () => {
    const gp = connectedPad();
    const key = gp ? 'on|' + gp.mapping : 'off';
    if (key === last) return;
    last = key;
    status.textContent = gp ? 'Manette détectée' : 'Aucune manette';
    status.className = 'st-val ' + (gp ? 'st-ok' : 'dim');
    statusDesc.textContent = !gp
      ? 'Branchez une manette (USB ou Bluetooth) puis appuyez sur l’un de ses boutons pour qu’elle soit reconnue.'
      : gp.mapping === 'standard'
        ? 'Disposition standard reconnue : la correspondance ci-dessous s’applique.'
        : 'Disposition non standard : certains boutons peuvent ne pas correspondre au tableau ci-dessous.';
  };
  poll();
  ctx.onFrame((dt) => {
    acc += dt;
    if (acc < 0.5) return;
    acc = 0;
    poll();
  });

  return [
    intro('Manette', 'Réglages et commandes de la manette.'),
    h('div', { class: 'section' }, h('div', { class: 'row st-info' }, h('div', { class: 'grow' }, 'État'), status), statusDesc),
    sliderRow(app, {
      label: 'Zone morte des sticks',
      desc: 'Les petits mouvements des sticks en dessous de ce seuil sont ignorés (utile si la caméra dérive toute seule).',
      min: 0.05,
      max: 0.5,
      step: 0.01,
      value: s.gamepadDeadzone,
      fmt: pct,
      apply: (v) => setSetting(app, 'gamepadDeadzone', v),
    }),
    sliderRow(app, {
      label: 'Sensibilité de la caméra',
      desc: 'Réglage commun avec la sensibilité de la souris.',
      min: 0,
      max: 1,
      step: 0.01,
      value: s.mouseSensitivity,
      fmt: pct,
      apply: (v) => setSetting(app, 'mouseSensitivity', v),
    }),
    settingToggle(app, 'invertY', 'Inverser l’axe vertical'),
    settingToggle(app, 'vibration', 'Vibrations', 'La manette vibre quand vous subissez des dégâts (si elle le permet).'),
    h(
      'div',
      { class: 'section' },
      h(
        'div',
        { class: 'st-actions' },
        button(
          'Tester la vibration',
          () => {
            if (!app.settings.data.vibration) toast('Activez d’abord les vibrations.');
            else if (!connectedPad()) toast('Aucune manette détectée.');
            else app.input.rumble(300, 0.8);
          },
          'dark',
          'controller',
        ),
      ),
    ),
    sectionHead('EN JEU'),
    h('div', { class: 'section' }, table(PAD_GAME, ['Commande', 'Action'])),
    sectionHead('DANS LES MENUS'),
    h('div', { class: 'section' }, table(PAD_MENU, ['Commande', 'Action'])),
    h('div', { class: 'section st-note' }, 'Cette correspondance est fixe ; seules les touches du clavier peuvent être réaffectées.'),
  ];
}

// ---------------------------------------------------------------- tactile
export function touchSection(ctx: SectionCtx): HTMLElement[] {
  const app = ctx.app;
  const s = app.settings.data;
  let finish: (() => void) | null = null;
  ctx.onBack(() => {
    if (!finish) return false;
    finish();
    return true;
  });
  ctx.onLeave(() => finish?.());

  const edit = button(
    'Modifier la disposition',
    () => {
      if (!finish) finish = editLayout(ctx, () => (finish = null));
    },
    'green',
    'touch',
  );
  const reset = button(
    'Réinitialiser la disposition',
    () =>
      confirmDialog('Réinitialiser la disposition', 'Le joystick et les boutons tactiles reprendront leur position d’origine.', 'Réinitialiser', () => {
        app.settings.set('touchLayout', {});
        app.touch.layout();
        toast('Disposition réinitialisée');
      }),
    'dark',
  );

  return [
    intro('Tactile', 'Commandes à l’écran pour téléphones et tablettes.'),
    sliderRow(app, {
      label: 'Taille des boutons',
      min: 0.6,
      max: 1.6,
      step: 0.05,
      value: s.touchButtonSize,
      fmt: pct,
      apply: (v) => setSetting(app, 'touchButtonSize', v),
    }),
    sliderRow(app, {
      label: 'Opacité des commandes',
      min: 0,
      max: 1,
      step: 0.05,
      value: s.touchOpacity,
      fmt: pct,
      apply: (v) => setSetting(app, 'touchOpacity', v),
    }),
    choiceRow<'r' | 'l'>(
      'Main dominante',
      [
        ['r', 'Droitier'],
        ['l', 'Gaucher'],
      ],
      s.leftHanded ? 'l' : 'r',
      (v) => setSetting(app, 'leftHanded', v === 'l'),
      (v) => (v === 'l' ? 'Joystick à droite, boutons d’action à gauche.' : 'Joystick à gauche, boutons d’action à droite.'),
    ),
    sliderRow(app, {
      label: 'Sensibilité tactile',
      desc: 'Vitesse de rotation de la caméra quand vous faites glisser le doigt.',
      min: 0,
      max: 1,
      step: 0.05,
      value: s.touchSensitivity,
      fmt: pct,
      apply: (v) => setSetting(app, 'touchSensitivity', v),
    }),
    settingToggle(app, 'autoJump', 'Saut automatique', 'Monte automatiquement les marches d’un bloc en marchant.'),
    sectionHead('DISPOSITION'),
    h('div', { class: 'section st-note' }, 'Déplacez le joystick et les boutons où vous le souhaitez. La disposition est enregistrée sur cet appareil.'),
    h('div', { class: 'section' }, h('div', { class: 'st-actions' }, edit, reset)),
    sectionHead('GESTES'),
    h(
      'div',
      { class: 'section st-note' },
      'Glisser sur l’écran : regarder autour de soi. Appui court : utiliser ou poser. Appui long : casser ou attaquer. Pousser le joystick tout en haut : courir.',
    ),
  ];
}

/**
 * Éditeur de disposition : l'écran des paramètres est masqué, la couche tactile est affichée
 * au premier plan en mode édition, avec une barre « Réinitialiser / Terminé ».
 * Renvoie la fonction qui termine l'édition.
 */
function editLayout(ctx: SectionCtx, onDone: () => void): () => void {
  const app = ctx.app;
  const touch = app.touch;
  const layer = touch.el;
  const prev = { attached: !!layer.parentNode, display: layer.style.display, z: layer.style.zIndex };
  const screenDisplay = ctx.screenEl.style.display;
  if (!prev.attached) document.body.appendChild(layer);
  layer.style.display = '';
  // Au-dessus de l'interface (#ui, z 10) pour que le HUD ne capte pas les gestes ; sous la barre d'outils.
  layer.style.zIndex = '45';
  touch.layout();
  touch.setEditing(true);
  ctx.screenEl.style.display = 'none';

  // Le doigt est géré par TouchControls ; la souris (ou le stylet) par ce glisser-déposer.
  let drag: { id: string; node: HTMLElement; dx: number; dy: number; pid: number } | null = null;
  const clamp = (v: number) => Math.max(2, Math.min(98, v));
  const toPct = (x: number, y: number): [number, number] => [clamp((x / window.innerWidth) * 100), clamp((y / window.innerHeight) * 100)];
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const node = (e.target as HTMLElement | null)?.closest<HTMLElement>('.tbtn, .joystick');
    if (!node || !layer.contains(node)) return;
    const id = node.classList.contains('joystick') ? 'joystick' : node.dataset.id;
    if (!id) return;
    e.preventDefault();
    const r = node.getBoundingClientRect();
    drag = { id, node, dx: e.clientX - (r.left + r.width / 2), dy: e.clientY - (r.top + r.height / 2), pid: e.pointerId };
  };
  const onMove = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pid) return;
    const [x, y] = toPct(e.clientX - drag.dx, e.clientY - drag.dy);
    drag.node.style.left = x + '%';
    drag.node.style.top = y + '%';
  };
  const onUp = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pid) return;
    const [x, y] = toPct(e.clientX - drag.dx, e.clientY - drag.dy);
    const lay = { ...app.settings.data.touchLayout };
    lay[drag.id] = [app.settings.data.leftHanded ? 100 - x : x, y];
    drag = null;
    app.settings.set('touchLayout', lay);
  };
  layer.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    touch.setEditing(false);
    layer.removeEventListener('pointerdown', onDown);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    layer.style.zIndex = prev.z;
    layer.style.display = prev.display;
    if (!prev.attached) layer.remove();
    touch.layout();
    bar.remove();
    ctx.screenEl.style.display = screenDisplay;
    onDone();
  };
  const bar = h(
    'div',
    { class: 'st-edit-bar' },
    h('span', { class: 'st-hint' }, 'Faites glisser les commandes pour les déplacer.'),
    button(
      'Réinitialiser',
      () => {
        app.settings.set('touchLayout', {});
        touch.layout();
      },
      'dark',
    ),
    button('Terminé', finish, 'green'),
  );
  document.body.appendChild(bar);
  return finish;
}
