/**
 * « Verrouillage du clic » de Windows (ClickLock) : tenir le clic gauche un moment le garde
 * enfoncé après l'avoir lâché ; pour le jeu, le bouton reste tenu et on continue de miner.
 * Le navigateur ne peut pas faire la différence ; le lanceur Windows lit ce réglage et peut le
 * couper pendant la session (il le rétablit en quittant, sans toucher au profil Windows).
 */
import { h, button, cycle } from '../dom';
import type { Screen } from '../ui';
import type { AppApi } from '../../app/api';
import { t, locale } from '../../i18n/i18n';

export interface MouseInfo {
  /** Verrouillage du clic actif en ce moment. */
  verrouClic: boolean;
  /** Durée d'appui avant verrouillage (ms). */
  delai: number;
  /** Coupé par le lanceur pour cette session. */
  coupe: boolean;
}

interface MouseHost {
  mouse(): Promise<MouseInfo>;
  setClickLockCut(cut: boolean): Promise<MouseInfo>;
}

function mouseHost(): MouseHost | null {
  const host = (globalThis as { voxerraHost?: Partial<MouseHost> }).voxerraHost;
  return host?.mouse && host.setClickLockCut ? (host as MouseHost) : null;
}

/** Au lancement : applique le choix enregistré, ou le demande si le verrouillage est actif. */
export async function checkClickLock(app: AppApi): Promise<void> {
  const host = mouseHost();
  if (!host) return;
  let info: MouseInfo;
  try {
    info = await host.mouse();
  } catch {
    return;
  }
  if (!info.verrouClic || info.coupe) return;
  if (app.settings.clickLock === 'couper') await host.setClickLockCut(true).catch(() => {});
  else if (app.settings.clickLock === 'demander') app.ui.push(clickLockScreen(app, host, info));
}

function clickLockScreen(app: AppApi, host: MouseHost, info: MouseInfo): Screen {
  const secs = (info.delai / 1000).toLocaleString(locale(), { maximumFractionDigits: 1 });
  const choose = async (cut: boolean) => {
    app.settings.clickLock = cut ? 'couper' : 'garder';
    app.saveSettings();
    app.ui.pop();
    if (cut) await host.setClickLockCut(true).catch(() => {});
  };
  const text = { maxWidth: '680px', textAlign: 'center' };
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, t('Verrouillage du clic de Windows')),
    h('div', { class: 'subtitle', style: text }, t('Il est activé sur cet ordinateur : quand on tient le clic gauche plus de {s} s, Windows le garde enfoncé même après l’avoir lâché. Dans Voxerra, on continue alors de miner.', { s: secs })),
    h('div', { class: 'subtitle', style: { ...text, marginBottom: '24px' } }, t('Voxerra peut le couper pendant que vous jouez : il est rétabli en quittant le jeu, et vos réglages de Windows ne changent pas.')),
    h('div', { class: 'row' }, button(t('Le couper en jeu'), () => void choose(true), 'half'), button(t('Le laisser'), () => void choose(false), 'half')),
  );
  return { el };
}

/**
 * Options : réglage « Verrouillage du clic (Windows) », ajouté à la grille seulement dans le
 * lanceur Windows et si ce verrouillage est actif sur l'ordinateur (ou coupé par le jeu).
 */
export function addClickLockOption(app: AppApi, grid: HTMLElement): void {
  const host = mouseHost();
  if (!host) return;
  host
    .mouse()
    .then((info) => {
      if (!info.verrouClic && !info.coupe) return;
      const values = [
        { v: 'couper' as const, t: t('coupé en jeu') },
        { v: 'garder' as const, t: t('laissé actif') },
      ];
      grid.appendChild(
        cycle(t('Verrouillage du clic (Windows)'), values, info.coupe ? 'couper' : 'garder', (v) => {
          app.settings.clickLock = v;
          app.saveSettings();
          void host.setClickLockCut(v === 'couper').catch(() => {});
        }),
      );
    })
    .catch(() => {});
}
