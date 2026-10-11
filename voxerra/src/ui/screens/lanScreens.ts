/**
 * Écrans du menu pause pour jouer à plusieurs : ouvrir la partie solo au réseau local, voir
 * l'adresse et les joueurs d'une partie ouverte, ou les infos de la partie rejointe.
 */
import { h, button, clear } from '../dom';
import type { Screen } from '../ui';
import type { AppApi } from '../../app/api';
import { t } from '../../i18n/i18n';
import { lanBridge } from '../../net/lanHost';

const isLauncher = () => (globalThis as { voxerraHost?: { platform?: string } }).voxerraHost?.platform === 'launcher';

/** Partie solo : proposer de l'ouvrir aux amis du même Wi-Fi. */
export function openLanScreen(app: AppApi): Screen {
  const text = { maxWidth: '640px', textAlign: 'center' };
  const can = !!lanBridge();
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, t('Ouvrir au réseau local')),
    can
      ? h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '22px' } },
          h('div', { class: 'subtitle', style: text }, t('Vos amis connectés au même Wi-Fi pourront rejoindre ce monde et jouer avec vous en temps réel.')),
          h('div', { class: 'hint', style: text }, t('La partie continue pendant que le menu est ouvert. Votre progression solo est gardée.')),
          isLauncher() ? h('div', { class: 'hint', style: { ...text, color: '#ffe080' } }, t('Si Windows demande d’autoriser Voxerra sur le réseau, acceptez (réseaux privés).')) : null,
        )
      : h('div', { class: 'subtitle', style: { ...text, marginBottom: '22px' } }, t('Pour héberger une partie, utilisez Voxerra.exe (Windows) ou l’appli Android.')),
    h(
      'div',
      { class: 'row' },
      can ? button(t('Ouvrir la partie'), () => void app.openToLan(), 'half') : null,
      button(t('Retour'), () => app.ui.pop(), can ? 'half' : ''),
    ),
  );
  return { el, pauses: true };
}

/** Partie ouverte (hôte) ou rejointe (invité) : adresse et joueurs connectés, mis à jour. */
export function netInfoScreen(app: AppApi, info: { title: string; address: () => string; players: () => string[] }): Screen {
  const table = h('div', { class: 'stats-table' });
  const render = () => {
    clear(table);
    const players = info.players();
    table.append(
      h('div', { class: 'srow' }, h('span', {}, t('Adresse')), h('span', { style: { color: '#ffe080' } }, info.address())),
      h('div', { class: 'srow' }, h('span', {}, t('Joueurs ({n})', { n: players.length })), h('span', {}, players.join(', '))),
    );
  };
  render();
  const timer = setInterval(render, 1000);
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, info.title),
    table,
    h('div', { class: 'hint', style: { maxWidth: '560px', textAlign: 'center', margin: '10px 0 14px' } }, t('Sur le même Wi-Fi, la partie apparaît dans Multijoueur ; sinon, « Connexion directe » avec l’adresse.')),
    button(t('Retour'), () => app.ui.pop()),
  );
  return { el, pauses: true, onClose: () => clearInterval(timer) };
}
