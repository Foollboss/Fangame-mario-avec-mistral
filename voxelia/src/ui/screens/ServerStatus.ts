/**
 * Interrogation rapide d'un serveur Voxelia pour la liste des serveurs :
 * WebSocket brute, envoi de { t: 'status' }, réponse avec nom, message, joueurs ; latence mesurée.
 */
import { PROTOCOL_VERSION } from '../../net/protocol';

export const DEFAULT_PORT = 19140;

export type ServerStatus =
  | { state: 'pending' }
  | { state: 'online'; at: number; name: string; motd: string; players: number; max: number; version: number; needsInvite: boolean; ping: number; compatible: boolean }
  | { state: 'offline'; at: number; reason: string };

/**
 * Adresse saisie → URL WebSocket. Préfixe ws:// si absent et port par défaut si l'hôte n'en a pas
 * (même règle que la connexion de jeu, pour que l'état affiché corresponde à la partie).
 */
export function serverUrl(address: string): string {
  const m = /^(wss?:\/\/)?([^/]*)(.*)$/i.exec(address.trim());
  const scheme = (m?.[1] ?? 'ws://').toLowerCase();
  let host = m?.[2] ?? '';
  const path = m?.[3] ?? '';
  if (!/:\d+$/.test(host)) host += ':' + DEFAULT_PORT;
  return scheme + host + path;
}

/** Vérifie une adresse saisie ; renvoie un message d'erreur ou null. */
export function validateAddress(address: string): string | null {
  const t = address.trim();
  if (!t) return "Saisissez l'adresse du serveur.";
  if (/\s/.test(t)) return "L'adresse ne doit pas contenir d'espaces.";
  try {
    const u = new URL(serverUrl(t));
    if (!u.hostname) return 'Adresse invalide.';
  } catch {
    return 'Adresse invalide.';
  }
  return null;
}

function offline(reason: string): ServerStatus {
  return { state: 'offline', at: Date.now(), reason };
}

/** Interroge le serveur (délai maximal `timeoutMs`) ; ne rejette jamais. */
export function queryStatus(address: string, timeoutMs = 4000, signal?: AbortSignal): Promise<ServerStatus> {
  return new Promise((resolve) => {
    let ws: WebSocket | null = null;
    let done = false;
    let sentAt = 0;
    let timer = 0;
    const finish = (s: ServerStatus) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
      if (ws) {
        ws.onopen = ws.onmessage = ws.onerror = ws.onclose = null;
        try {
          ws.close();
        } catch {
          /* déjà fermée */
        }
      }
      resolve(s);
    };
    const onAbort = () => finish(offline('annulé'));
    if (signal?.aborted) {
      resolve(offline('annulé'));
      return;
    }
    signal?.addEventListener('abort', onAbort);
    try {
      ws = new WebSocket(serverUrl(address));
    } catch (e) {
      // Page en https : le navigateur peut refuser ws:// (contenu mixte).
      finish(offline((e as Error)?.name === 'SecurityError' ? 'connexion non sécurisée refusée par le navigateur' : 'adresse invalide'));
      return;
    }
    timer = window.setTimeout(() => finish(offline('délai dépassé')), timeoutMs);
    ws.onopen = () => {
      sentAt = performance.now();
      try {
        ws?.send(JSON.stringify({ t: 'status' }));
      } catch {
        finish(offline('envoi impossible'));
      }
    };
    ws.onmessage = (ev) => {
      let m: Record<string, unknown>;
      try {
        m = JSON.parse(String(ev.data));
      } catch {
        return;
      }
      if (m.t === 'status') {
        const version = Number(m.version) || 0;
        finish({
          state: 'online',
          at: Date.now(),
          name: String(m.name ?? ''),
          motd: String(m.motd ?? ''),
          players: Math.max(0, Number(m.players) || 0),
          max: Math.max(0, Number(m.max) || 0),
          version,
          needsInvite: m.needsInvite === true,
          ping: Math.max(1, Math.round(performance.now() - sentAt)),
          compatible: version === PROTOCOL_VERSION,
        });
      } else if (m.t === 'error') finish(offline(String(m.message ?? 'refusé')));
    };
    ws.onerror = () => finish(offline('connexion impossible'));
    ws.onclose = () => finish(offline('connexion fermée'));
  });
}
