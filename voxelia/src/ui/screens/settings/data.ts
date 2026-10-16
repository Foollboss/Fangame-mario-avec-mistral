/**
 * Sections « Packs de ressources » (packs globaux : import, activation, priorité, suppression)
 * et « Stockage » (état du stockage local, espace utilisé, export et suppression des mondes).
 */
import { button, confirmDialog, formatBytes, formatDate, h, img, modal, pickFile, saveFile, toast } from '../../dom';
import type { PackInfo } from '../../../packs/ResourcePacks';
import type { WorldMeta } from '../../../save/SaveManager';
import { errorText, infoRow, intro, note, sectionHead, type SectionCtx } from './common';

function empty(text: string): HTMLElement {
  return h('div', { class: 'st-empty' }, text);
}

function iconButton(ico: string, title: string, onClick: () => void, cls = 'dark'): HTMLButtonElement {
  const b = button('', onClick, cls + ' square', ico);
  b.title = title;
  b.setAttribute('aria-label', title);
  return b;
}

function bigBytes(n: number): string {
  if (n >= 1024 ** 3) return (n / 1024 ** 3).toFixed(1) + 'Go';
  return formatBytes(Math.round(n));
}

// ---------------------------------------------------------------- packs de ressources
export function packsSection(ctx: SectionCtx): HTMLElement[] {
  const app = ctx.app;
  const body = h('div', { class: 'st-list' }, empty('Chargement des packs…'));
  let busy = false;

  const load = async () => {
    let packs: PackInfo[];
    try {
      packs = await app.packs.list();
    } catch (e) {
      if (ctx.alive()) body.replaceChildren(empty('Impossible de lire les packs : ' + errorText(e)));
      return;
    }
    if (ctx.alive()) render(packs);
  };

  /** Exécute une opération sur les packs (une seule à la fois), puis rafraîchit la liste. */
  const run = (fn: () => Promise<void>) => {
    if (busy) return;
    busy = true;
    void fn()
      .catch((e) => toast('Opération impossible : ' + errorText(e), 4000))
      .finally(() => {
        busy = false;
        if (ctx.alive()) void load();
      });
  };

  const packRow = (p: PackInfo, actions: HTMLElement[]): HTMLElement => {
    const ico = h('div', { class: 'st-ico' });
    if (p.icon) ico.style.backgroundImage = `url("${p.icon}")`;
    else {
      ico.style.background = '#3a2510';
      ico.append(img('chest_icon', 'st-fill'));
    }
    return h(
      'div',
      { class: 'st-item' },
      ico,
      h(
        'div',
        { class: 'st-txt' },
        h('div', { class: 'st-name' }, p.name || 'Pack sans nom'),
        p.description ? h('div', { class: 'st-sub' }, p.description) : null,
        h('div', { class: 'st-sub' }, p.count + (p.count > 1 ? ' textures' : ' texture')),
      ),
      h('div', { class: 'st-btns' }, ...actions),
    );
  };

  const render = (packs: PackInfo[]) => {
    const byId = new Map(packs.map((p) => [p.id, p]));
    const active = app.packs.active.filter((id) => byId.has(id));
    const avail = packs.filter((p) => !active.includes(p.id));
    const rows: HTMLElement[] = [sectionHead(`ACTIFS (${active.length})`)];
    if (!active.length) rows.push(empty('Aucun pack actif : les textures d’origine de Voxelia sont utilisées.'));
    else rows.push(note('Le pack placé en haut est prioritaire sur ceux du dessous.'));
    active.forEach((id, i) => {
      const move = (to: number) => {
        const next = [...active];
        [next[i], next[to]] = [next[to], next[i]];
        run(() => app.packs.setActive(next));
      };
      const up = iconButton('flyup', 'Monter (plus prioritaire)', () => move(i - 1));
      const down = iconButton('flydown', 'Descendre (moins prioritaire)', () => move(i + 1));
      up.disabled = i === 0;
      down.disabled = i === active.length - 1;
      rows.push(packRow(byId.get(id)!, [up, down, button('Désactiver', () => run(() => app.packs.setActive(active.filter((x) => x !== id))), 'dark')]));
    });
    rows.push(sectionHead(`DISPONIBLES (${avail.length})`));
    if (!avail.length) rows.push(empty(packs.length ? 'Tous vos packs sont actifs.' : 'Aucun pack importé pour le moment.'));
    for (const p of avail) {
      const del = iconButton(
        'trash',
        'Supprimer',
        () =>
          confirmDialog('Supprimer le pack', `« ${p.name || 'Pack sans nom'} » sera supprimé de cet appareil.`, 'Supprimer', () =>
            run(async () => {
              await app.packs.remove(p.id);
              toast('Pack supprimé');
            }),
          ),
        'red',
      );
      rows.push(packRow(p, [button('Activer', () => run(() => app.packs.setActive([p.id, ...active])), 'green'), del]));
    }
    body.replaceChildren(...rows);
  };

  const importFile = async (file: File) => {
    const fill = h('div', { class: 'fill', style: 'width:0%' });
    const label = h('div', { class: 'dim' }, 'Lecture du fichier…');
    const overlay = h(
      'div',
      { class: 'modal-back' },
      h('div', { class: 'modal' }, h('div', { class: 'modal-title' }, 'Importation du pack'), h('div', { class: 'modal-body st-prog' }, h('div', { class: 'st-name' }, file.name), h('div', { class: 'progress' }, fill), label)),
    );
    (document.getElementById('ui') ?? document.body).appendChild(overlay);
    try {
      const name = file.name.replace(/\.(zip|mcpack)$/i, '');
      const info = await app.packs.importPack(file, name, (p) => {
        const v = Math.round(Math.max(0, Math.min(1, p)) * 100);
        fill.style.width = v + '%';
        label.textContent = v + ' %';
      });
      overlay.remove();
      if (info.count > 0) toast(`${info.count} textures importées — activez « ${info.name} » dans « Disponibles »`, 4000);
      else toast('Aucune texture reconnue dans ce pack.', 4000);
    } catch (e) {
      overlay.remove();
      modal('Importation impossible', h('div', null, errorText(e)), [['OK', () => undefined]]);
    }
  };

  const importBtn = button(
    'Importer un pack (.zip, .mcpack)',
    () =>
      void pickFile('.zip,.mcpack,application/zip').then((file) => {
        if (file) run(() => importFile(file));
      }),
    'green',
    'folder',
  );

  void load();
  return [
    intro('Packs de ressources', 'Changez l’apparence des blocs et des objets dans tous vos mondes.'),
    note(
      'Les packs remplacent uniquement les textures : les sons, modèles et scripts conçus pour d’autres jeux sont ignorés. Les fichiers sont importés depuis votre appareil et restent stockés localement. Les packs choisis dans les paramètres d’un monde s’appliquent par-dessus ceux-ci.',
    ),
    h('div', { class: 'section' }, h('div', { class: 'st-actions' }, importBtn)),
    body,
  ];
}

// ---------------------------------------------------------------- stockage
interface StorageApi {
  estimate?: () => Promise<{ usage?: number; quota?: number }>;
  persisted?: () => Promise<boolean>;
  persist?: () => Promise<boolean>;
}

export function storageSection(ctx: SectionCtx): HTMLElement[] {
  const app = ctx.app;
  const storage = (navigator as unknown as { storage?: StorageApi }).storage;
  const out: HTMLElement[] = [intro('Stockage', 'Espace utilisé par vos mondes et vos packs sur cet appareil.')];

  const ok = app.saves.persistent;
  const saveRow = infoRow(
    'Sauvegardes',
    ok ? 'Stockage de l’appareil' : 'Mémoire temporaire',
    ok ? 'Les mondes, packs et réglages sont conservés sur cet appareil.' : 'Le stockage local est indisponible (navigation privée ?) : les mondes seront perdus à la fermeture.',
  );
  saveRow.querySelector('.st-val')?.classList.add(ok ? 'st-ok' : 'st-warn');
  out.push(saveRow);

  const usage = h('div', { class: 'st-val' }, '…');
  const refreshUsage = () => {
    if (!storage?.estimate) return;
    storage
      .estimate()
      .then((e) => {
        usage.textContent = e.usage !== undefined ? bigBytes(e.usage) + (e.quota ? ' sur ' + bigBytes(e.quota) : '') : 'Inconnu';
      })
      .catch(() => {
        usage.textContent = 'Inconnu';
      });
  };
  if (storage?.estimate) {
    out.push(infoRow('Espace utilisé', usage, 'Total occupé par Voxelia dans le stockage de l’appareil (mondes, packs, cache).'));
    refreshUsage();
  }

  if (storage?.persisted) {
    const value = h('div', { class: 'st-val' }, '…');
    const sec = infoRow('Protection contre l’effacement', value);
    const actions = h('div', { class: 'st-actions' });
    const desc = h('div', { class: 'desc' });
    sec.append(desc, actions);
    const show = (on: boolean) => {
      value.textContent = on ? 'Activée' : 'Désactivée';
      value.className = 'st-val ' + (on ? 'st-ok' : 'dim');
      desc.textContent = on ? 'Le système ne supprimera pas vos sauvegardes pour libérer de la place.' : 'En cas de manque de place, le système pourrait effacer les données du jeu.';
      actions.replaceChildren();
      if (!on && storage.persist)
        actions.append(
          button(
            'Demander la protection',
            () =>
              void storage.persist!()
                .then((granted) => {
                  toast(granted ? 'Protection activée' : 'Protection refusée par le système');
                  if (ctx.alive()) show(granted);
                })
                .catch(() => toast('Protection indisponible')),
            'dark',
          ),
        );
    };
    storage
      .persisted()
      .then((on) => ctx.alive() && show(on))
      .catch(() => {
        value.textContent = 'Inconnue';
      });
    out.push(sec);
  }

  // Mondes
  const head = sectionHead('MONDES');
  const list = h('div', { class: 'st-list' }, empty('Chargement…'));
  let busy = false;
  const loadWorlds = async () => {
    let worlds: WorldMeta[];
    try {
      worlds = (await app.saves.listWorlds()).filter((w) => !w.id.startsWith('net:'));
    } catch (e) {
      if (ctx.alive()) list.replaceChildren(empty('Impossible de lire les mondes : ' + errorText(e)));
      return;
    }
    if (!ctx.alive()) return;
    const total = worlds.reduce((n, w) => n + (w.sizeBytes || 0), 0);
    head.textContent = `MONDES (${worlds.length}) — ≈ ${bigBytes(total)}`;
    list.replaceChildren(...(worlds.length ? worlds.map(worldRow) : [empty('Aucun monde enregistré.')]));
  };
  const run = (fn: () => Promise<void>) => {
    if (busy) return;
    busy = true;
    void fn()
      .catch((e) => toast('Opération impossible : ' + errorText(e), 4000))
      .finally(() => {
        busy = false;
        if (ctx.alive()) {
          void loadWorlds();
          refreshUsage();
        }
      });
  };
  const worldRow = (w: WorldMeta): HTMLElement => {
    const playing = app.game?.meta.id === w.id;
    const thumb = h('div', { class: 'st-ico' });
    if (w.thumbnail) thumb.style.backgroundImage = `url("${w.thumbnail}")`;
    else thumb.append(img('world', 'st-fill'));
    const exp = iconButton('export', 'Exporter', () =>
      run(async () => {
        const g = app.game;
        if (g && g.meta.id === w.id) await g.save(false);
        const blob = await app.saves.exportWorld(w.id);
        if (!blob) throw new Error('Monde introuvable.');
        const where = await saveFile((w.name.replace(/[\\/:*?"<>|]+/g, '_').trim() || 'monde') + '.voxelia', blob);
        toast(where ? 'Monde exporté : ' + where : 'Export impossible');
      }),
    );
    const del = iconButton(
      'trash',
      playing ? 'Monde en cours : quittez la partie pour le supprimer' : 'Supprimer',
      () =>
        confirmDialog('Supprimer le monde', `« ${w.name} » sera définitivement supprimé de cet appareil.`, 'Supprimer', () =>
          run(async () => {
            await app.saves.deleteWorld(w.id);
            toast('Monde supprimé');
          }),
        ),
      'red',
    );
    del.disabled = playing;
    return h(
      'div',
      { class: 'st-item' },
      thumb,
      h(
        'div',
        { class: 'st-txt' },
        h('div', { class: 'st-name' }, w.name),
        h('div', { class: 'st-sub' }, (playing ? 'En cours — ' : '') + 'Dernière partie : ' + formatDate(w.lastPlayed) + ' — ≈ ' + formatBytes(w.sizeBytes || 0)),
      ),
      h('div', { class: 'st-btns' }, exp, del),
    );
  };
  void loadWorlds();
  out.push(head, list, note('Tailles approximatives. Un monde exporté (.voxelia) peut être réimporté depuis Jouer → Mondes → Importer.'));

  // Packs
  const packCount = h('div', { class: 'st-val' }, '…');
  void app.packs
    .list()
    .then((p) => {
      packCount.textContent = p.length + (p.length > 1 ? ' packs' : ' pack');
    })
    .catch(() => {
      packCount.textContent = 'Inconnu';
    });
  const packs = infoRow('Packs de ressources importés', packCount);
  packs.append(h('div', { class: 'st-actions' }, button('Gérer les packs', () => ctx.goto('packs'), 'dark', 'chest_icon')));
  out.push(sectionHead('PACKS'), packs);
  return out;
}
