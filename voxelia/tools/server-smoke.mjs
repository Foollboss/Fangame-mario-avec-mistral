// Test de fumée du serveur multijoueur : lance server/index.ts sur un port libre avec un monde
// temporaire, connecte plusieurs clients WebSocket et vérifie le protocole (statut, invitation,
// accueil, blocs, tronçons, permissions, chat, heure, sauvegarde du joueur, limites), puis
// redémarre le serveur pour contrôler la persistance.
// Usage : node tools/server-smoke.mjs
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import WebSocket from 'ws';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const worldDir = mkdtempSync(join(tmpdir(), 'voxelia-smoke-'));
const INVITE = 'Abc-123';
const passed = [];
const skipped = [];
let current = null;

function ok(cond, label) {
  if (!cond) throw new Error('échec : ' + label);
  passed.push(label);
  console.log('  ok   ' + label);
}

const localIndex = (x, y, z) => (y << 8) | ((z & 15) << 4) | (x & 15);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function freePort() {
  return new Promise((res, rej) => {
    const s = createServer();
    s.once('error', rej);
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => res(port));
    });
  });
}

/** Lance le serveur et attend la ligne « prêt ». */
function startServer(args) {
  const proc = spawn(process.execPath, ['--experimental-strip-types', '--no-warnings', 'server/index.ts', ...args], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
  const out = [];
  const exit = new Promise((res) => proc.once('exit', (code, signal) => res({ code, signal })));
  const ready = new Promise((res, rej) => {
    const timer = setTimeout(() => rej(new Error('le serveur ne démarre pas (20 s)')), 20000);
    const onData = (d) => {
      out.push(String(d));
      if (out.join('').includes('Serveur Voxelia prêt')) {
        clearTimeout(timer);
        res();
      }
    };
    proc.stdout.on('data', onData);
    proc.stderr.on('data', (d) => out.push(String(d)));
    void exit.then(({ code }) => {
      clearTimeout(timer);
      rej(new Error('le serveur s’est arrêté au démarrage (code ' + code + ')'));
    });
  });
  current = { proc, out, exit };
  return ready.then(() => current);
}

async function stopServer(srv) {
  srv.proc.kill('SIGTERM');
  const r = await Promise.race([srv.exit, sleep(10000).then(() => ({ code: 'délai' }))]);
  current = null;
  // SMOKE_VERBOSE=1 : affiche le journal du serveur.
  if (process.env.SMOKE_VERBOSE) console.log('--- journal du serveur ---\n' + srv.out.join('').trimEnd() + '\n---');
  return r;
}

/** Client de test : file des messages reçus, attente d'un message correspondant à un prédicat. */
class Client {
  constructor(url, options) {
    this.ws = new WebSocket(url, options);
    this.queue = [];
    this.waiters = [];
    this.closed = false;
    this.opened = new Promise((res, rej) => {
      this.ws.once('open', res);
      this.ws.once('error', rej);
    });
    this.closedP = new Promise((res) => this.ws.once('close', () => ((this.closed = true), res())));
    this.ws.on('error', () => undefined);
    this.ws.on('message', (d) => {
      const m = JSON.parse(String(d));
      const w = this.waiters.findIndex((x) => x.pred(m));
      if (w >= 0) {
        const [x] = this.waiters.splice(w, 1);
        clearTimeout(x.timer);
        x.res(m);
      } else this.queue.push(m);
    });
  }
  send(m) {
    this.ws.send(typeof m === 'string' ? m : JSON.stringify(m));
  }
  next(pred, label, timeout = 3000) {
    const i = this.queue.findIndex(pred);
    if (i >= 0) return Promise.resolve(this.queue.splice(i, 1)[0]);
    return new Promise((res, rej) => {
      const timer = setTimeout(() => {
        this.waiters = this.waiters.filter((x) => x.res !== res);
        rej(new Error('message attendu non reçu : ' + label));
      }, timeout);
      this.waiters.push({ pred, res, timer });
    });
  }
  /** Vrai si aucun message correspondant n'arrive pendant `ms`. */
  async none(pred, ms = 300) {
    try {
      await this.next(pred, '', ms);
      return false;
    } catch {
      return true;
    }
  }
  waitClosed(timeout = 3000) {
    return Promise.race([this.closedP.then(() => true), sleep(timeout).then(() => false)]);
  }
  close() {
    this.ws.close();
    return this.waitClosed();
  }
}

async function connect(url, name, invite, skin = 'explorer', options) {
  const c = new Client(url, options);
  await c.opened;
  c.send({ t: 'hello', v: 1, name, skin, invite });
  c.welcome = await c.next((m) => m.t === 'welcome' || m.t === 'error', 'accueil de ' + name);
  return c;
}

async function phase1(port) {
  const url = `ws://127.0.0.1:${port}`;
  console.log('— Serveur 1 (invitation, --ops Alice, visiteurs par défaut, 3 places)');

  // Statut
  const st = new Client(url);
  await st.opened;
  st.send({ t: 'status' });
  const s = await st.next((m) => m.t === 'status', 'statut');
  ok(s.name === 'Serveur test' && s.motd === 'Bienvenue' && s.players === 0 && s.max === 3 && s.version === 1 && s.needsInvite === true, 'statut : nom, message, joueurs, version, invitation');
  ok(await st.waitClosed(), 'statut : connexion fermée après la réponse');

  // Mauvais code d'invitation, mauvaise version
  const bad = await connect(url, 'Intrus', 'MAUVAIS');
  ok(bad.welcome.t === 'error' && bad.welcome.message === 'Code d’invitation invalide', 'mauvais code d’invitation refusé');
  ok(await bad.waitClosed(), 'mauvais code : connexion fermée');
  const old = new Client(url);
  await old.opened;
  old.send({ t: 'hello', v: 999, name: 'Ancien', skin: 'explorer', invite: INVITE });
  const oe = await old.next((m) => m.t === 'error', 'erreur de version');
  ok(/Version incompatible/.test(oe.message), 'version incompatible refusée');

  // Accueil
  let A = await connect(url, 'Alice', 'abc-123');
  ok(A.welcome.t === 'welcome' && A.welcome.id > 0 && A.welcome.permission === 'operator', 'Alice accueillie (code insensible à la casse), opérateur via --ops');
  ok(A.welcome.world.seed === 42 && A.welcome.world.name === 'Serveur test' && A.welcome.world.rules.daylightCycle === true && A.welcome.world.experiments.dimensions === true && A.welcome.player === null, 'welcome : graine, règles, expériences, pas de sauvegarde');
  const B = await connect(url, '  B/o\u0000b!! ', INVITE, '../../etc');
  ok(B.welcome.t === 'welcome' && B.welcome.permission === 'visitor', 'Bob accueilli, visiteur par défaut');
  const joinB = await A.next((m) => m.t === 'join' && m.id === B.welcome.id, 'join de Bob chez Alice');
  ok(joinB.name === 'Bob' && joinB.skin === 'explorer', 'join : nom nettoyé (« Bob ») et apparence non autorisée remplacée');
  const joinA = await B.next((m) => m.t === 'join' && m.id === A.welcome.id, 'join d’Alice chez Bob');
  ok(joinA.name === 'Alice', 'le nouveau venu reçoit les joueurs déjà présents');

  // État du joueur
  A.send({ t: 'state', s: { p: [0.5, 64, 0.5], yaw: 1, pitch: 0, dim: 0, held: 3, sneaking: false, swing: 0 } });
  const stA = await B.next((m) => m.t === 'state' && m.s.id === A.welcome.id, 'état d’Alice');
  ok(stA.s.name === 'Alice' && stA.s.p[1] === 64 && stA.s.held === 3, 'état relayé avec id, nom et position');
  A.send({ t: 'state', s: { p: [NaN, 64, 0], yaw: 0, pitch: 0, dim: 0, held: 0, sneaking: false, swing: 0 } });
  A.send({ t: 'state', s: { p: [1e400, 64, 0], yaw: 0, pitch: 0, dim: 0, held: 0, sneaking: false, swing: 0 } });
  ok(await B.none((m) => m.t === 'state' && m.s.id === A.welcome.id), 'états invalides (NaN, infini) ignorés');
  ok(stA.s.pose === 'stand' && JSON.stringify(stA.s.armor) === '[null,null,null,null]', 'état sans pose ni armure (ancien client) accepté : debout, sans armure');

  // Apparence : pose du corps et armure portée
  const look = { p: [0.5, 64, 0.5], yaw: 1, pitch: 0, dim: 0, held: 3, sneaking: false, swing: 0 };
  A.send({ t: 'state', s: { ...look, pose: 'swim', armor: ['diamond', 'glider', null, 'iron'] } });
  const sw = await B.next((m) => m.t === 'state' && m.s.id === A.welcome.id, 'état avec pose et armure');
  ok(sw.s.pose === 'swim' && JSON.stringify(sw.s.armor) === '["diamond","glider",null,"iron"]', 'pose et armure valides relayées');
  const E = await connect(url, 'Eve', INVITE);
  const stE = await E.next((m) => m.t === 'state' && m.s.id === A.welcome.id, 'état d’Alice pour la nouvelle venue');
  ok(stE.s.pose === 'swim' && stE.s.armor[1] === 'glider', 'pose et armure conservées pour les joueurs qui arrivent ensuite');
  await E.close();
  await B.next((m) => m.t === 'leave' && m.name === 'Eve', 'départ d’Eve');
  const injected = [
    [{ pose: 'voler', armor: ['iron'] }, 'pose inconnue, armure de 1 case'],
    [{ pose: 42, armor: ['DIAMOND', null, null, null] }, 'pose non textuelle, majuscules'],
    [{ pose: ['swim'], armor: ['a'.repeat(25), null, null, null] }, 'pose en tableau, clé trop longue'],
    [{ pose: '__proto__', armor: [{ x: 1 }, null, null, null] }, 'pose « __proto__ », objet dans l’armure'],
    [{ pose: 'glide', armor: ['iron', null, null, null, 'gold'] }, 'armure de 5 cases'],
    [{ pose: 'tread', armor: 'diamond' }, 'armure non tableau'],
    [{ pose: 'fly', armor: ['<img src=x>', null, null, null] }, 'balise dans l’armure'],
  ];
  for (const [extra, label] of injected) {
    A.send({ t: 'state', s: { ...look, ...extra, admin: true, name: 'Pirate', skin: '../x', id: 999 } });
    const r = await B.next((m) => m.t === 'state' && m.s.id === A.welcome.id, 'état injecté : ' + label);
    const expectPose = ['glide', 'tread', 'fly'].includes(extra.pose) ? extra.pose : 'stand';
    ok(r.s.pose === expectPose && JSON.stringify(r.s.armor) === '[null,null,null,null]' && r.s.admin === undefined && r.s.name === 'Alice' && r.s.skin === 'explorer' && r.s.id === A.welcome.id, 'apparence invalide neutralisée (' + label + '), champs injectés ignorés');
  }
  A.send({ t: 'state', s: { ...look, sneaking: true } });
  ok((await B.next((m) => m.t === 'state' && m.s.id === A.welcome.id, 'état accroupi sans pose')).s.pose === 'sneak', 'ancien client accroupi : pose « sneak »');

  // Blocs
  const raw = 5 | (2 << 10);
  A.send({ t: 'block', dim: 0, x: 3, y: 64, z: 2, raw });
  const bl = await B.next((m) => m.t === 'block', 'bloc posé par Alice');
  ok(bl.x === 3 && bl.y === 64 && bl.z === 2 && bl.raw === raw && bl.by === A.welcome.id && bl.dim === 0, 'bloc d’Alice reçu par Bob (avec « by »)');
  ok(await A.none((m) => m.t === 'block'), 'l’auteur ne reçoit pas son propre bloc');
  B.send({ t: 'block', dim: 0, x: 3, y: 64, z: 2, raw: 0 });
  const d1 = await B.next((m) => m.t === 'denied', 'refus visiteur');
  ok(d1.x === 3 && d1.y === 64 && d1.z === 2 && d1.raw === raw, 'visiteur refusé, bloc enregistré renvoyé');
  B.send({ t: 'block', dim: 0, x: 10, y: 70, z: 10, raw: 1 });
  const d2 = await B.next((m) => m.t === 'denied', 'refus visiteur (bloc inconnu)');
  ok(d2.raw === -1, 'refus d’un bloc jamais modifié : raw = -1');
  A.send({ t: 'block', dim: 0, x: 500, y: 64, z: 500, raw: 1 });
  const d3 = await A.next((m) => m.t === 'denied', 'refus distance');
  ok(d3.x === 500 && d3.raw === -1, 'bloc trop loin de la position connue refusé');
  A.send({ t: 'block', dim: 0, x: 4, y: 300, z: 4, raw: 1 });
  ok((await A.next((m) => m.t === 'denied', 'refus hauteur')).y === 300, 'hauteur hors limites refusée');
  A.send({ t: 'block', dim: 0, x: 4, y: 64, z: 4, raw: 70000 });
  ok((await A.next((m) => m.t === 'denied', 'refus valeur')).raw === -1, 'valeur de bloc hors limites refusée');

  // Tronçons
  B.send({ t: 'chunk', dim: 0, cx: 0, cz: 0 });
  const ch = await B.next((m) => m.t === 'chunk' && m.cx === 0 && m.cz === 0, 'tronçon 0,0');
  ok(ch.blocks.length === 1 && ch.blocks[0][0] === localIndex(3, 64, 2) && ch.blocks[0][1] === raw && ch.be.length === 0, 'tronçon : diff [index local, bloc brut]');
  B.send({ t: 'chunk', dim: 1, cx: -7, cz: 9 });
  const ch2 = await B.next((m) => m.t === 'chunk' && m.cx === -7, 'tronçon vide');
  ok(ch2.dim === 1 && ch2.blocks.length === 0 && ch2.be.length === 0, 'tronçon jamais modifié : listes vides');

  // Blocs à données
  A.send({ t: 'be', dim: 0, x: 3, y: 64, z: 2, data: { type: 'chest', items: [null, { k: 'stone', n: 3 }] } });
  const be = await B.next((m) => m.t === 'be', 'coffre');
  ok(be.data.type === 'chest' && be.by === A.welcome.id, 'bloc à données relayé');
  A.send({ t: 'be', dim: 0, x: 3, y: 64, z: 2, data: { type: 'chest', big: 'x'.repeat(17000) } });
  const rv = await A.next((m) => m.t === 'be', 'annulation coffre trop gros');
  ok(rv.data.big === undefined && rv.by === 0, 'bloc à données de plus de 16 Ko refusé (données enregistrées renvoyées)');
  ok(await B.none((m) => m.t === 'be'), 'bloc à données trop gros non diffusé');
  B.send({ t: 'chunk', dim: 0, cx: 0, cz: 0 });
  const ch3 = await B.next((m) => m.t === 'chunk' && m.cx === 0, 'tronçon avec coffre');
  ok(ch3.be.length === 1 && ch3.be[0][0] === localIndex(3, 64, 2) && ch3.be[0][1].items[1].n === 3, 'tronçon : blocs à données inclus');

  // Chat
  A.send({ t: 'chat', text: '  Bonjour\u0007   à tous  ' });
  const c1 = await B.next((m) => m.t === 'chat' && !m.system, 'chat');
  ok(c1.from === 'Alice' && c1.text === 'Bonjour à tous', 'chat relayé et nettoyé');
  ok((await A.next((m) => m.t === 'chat' && !m.system, 'écho du chat')).text === 'Bonjour à tous', 'l’auteur reçoit aussi son message');
  A.send({ t: 'chat', text: 'Alice est morte noyée', system: true });
  const c2 = await B.next((m) => m.t === 'chat' && m.system, 'message système');
  ok(c2.text === 'Alice est morte noyée', 'message de jeu (mort) relayé comme message système');
  B.send({ t: 'chat', text: 'Alice a rejoint la partie', system: true });
  const c3 = await A.next((m) => m.t === 'chat' && m.from === 'Bob', 'faux message système');
  ok(!c3.system, 'faux message système d’un autre joueur relayé comme simple chat');
  for (let i = 0; i < 12; i++) B.send({ t: 'chat', text: 'spam ' + i });
  const warn = await B.next((m) => m.t === 'chat' && m.system && /trop vite/.test(m.text), 'avertissement anti-spam');
  ok(!!warn, 'chat limité en débit (avertissement)');

  // Heure
  B.send({ t: 'time', time: 18000, day: 9 });
  ok(await A.none((m) => m.t === 'time' && m.day === 9), 'heure refusée pour un non-opérateur');
  A.send({ t: 'time', time: 13000, day: 2 });
  const tm = await B.next((m) => m.t === 'time' && m.day === 2, 'heure réglée par l’opérateur');
  ok(Math.abs(tm.time - 13000) < 5, 'heure réglée par l’opérateur et diffusée');

  // Robustesse
  A.send('ceci n’est pas du JSON');
  A.send({ t: 'inconnu', x: 1 });
  A.send({ t: 'block', dim: 'a', x: null });
  A.send({ t: 'ping', n: 7 });
  ok((await A.next((m) => m.t === 'pong', 'pong')).n === 7, 'messages invalides ignorés, le serveur répond toujours');

  // Limite de débit des blocs (400 d'avance puis 40/s)
  let n = 0;
  for (let y = 66; y < 70 && n < 460; y++) for (let x = -5; x <= 5 && n < 460; x++) for (let z = -5; z <= 5 && n < 460; z++, n++) A.send({ t: 'block', dim: 0, x, y, z, raw: 1 });
  const rl = await A.next((m) => m.t === 'denied' && m.y >= 66 && m.y < 70 && Math.abs(m.x) <= 5, 'refus par limite de débit');
  ok(!!rl, 'trop de blocs par seconde : refus');

  // Sauvegarde du joueur et reconnexion
  A.send({ t: 'save', data: { pos: [1, 70, 2], health: 17, inventory: [] } });
  await sleep(100);
  await A.close();
  ok((await B.next((m) => m.t === 'leave' && m.id === A.welcome.id, 'départ d’Alice')).name === 'Alice', 'départ notifié (leave)');
  A = await connect(url, 'Alice', INVITE);
  ok(A.welcome.t === 'welcome' && A.welcome.player && A.welcome.player.health === 17, 'reconnexion : sauvegarde du joueur rendue dans welcome');
  await B.next((m) => m.t === 'join' && m.name === 'Alice', 'retour d’Alice');

  // Reconnexion « fantôme » depuis le même appareil
  const A2 = await connect(url, 'alice', INVITE);
  ok(A2.welcome.t === 'welcome', 'même nom depuis la même adresse : nouvelle connexion acceptée');
  const ghost = await A.next((m) => m.t === 'error', 'ancienne connexion remplacée');
  ok(/remplacée/.test(ghost.message) && (await A.waitClosed()), 'ancienne connexion fermée');
  await B.next((m) => m.t === 'leave' && m.id === A.welcome.id, 'leave de l’ancienne connexion');
  await B.next((m) => m.t === 'join' && m.id === A2.welcome.id, 'join de la nouvelle connexion');
  ok(true, 'remplacement notifié (leave puis join)');

  // Serveur complet
  const C = await connect(url, 'Carl', INVITE);
  ok(C.welcome.t === 'welcome', 'troisième joueur accueilli');
  const D = await connect(url, 'Dora', INVITE);
  ok(D.welcome.t === 'error' && /complet/.test(D.welcome.message), 'serveur complet : refus');
  await C.close();
  await sleep(150);

  // Même nom depuis une autre adresse (127.0.0.2 sous Linux, sinon IPv6 locale) : renommage
  let v6 = null;
  for (const [u, opts] of [
    [url, { localAddress: '127.0.0.2' }],
    [`ws://[::1]:${port}`, undefined],
  ]) {
    try {
      v6 = await connect(u, 'Bob', INVITE, 'explorer', opts);
      if (v6.welcome.t === 'welcome') break;
    } catch {
      v6 = null;
    }
  }
  if (v6 && v6.welcome.t === 'welcome') {
    const note = await v6.next((m) => m.t === 'chat' && m.system && /Bob2/.test(m.text), 'nom modifié');
    const j = await A2.next((m) => m.t === 'join' && m.id === v6.welcome.id, 'join de Bob2');
    ok(!!note && j.name === 'Bob2', 'nom déjà pris depuis une autre adresse : « Bob2 »');
    await v6.close();
  } else skipped.push('renommage (pas de seconde adresse locale)');

  await A2.close();
  await B.close();
}

async function phase2(port) {
  const url = `ws://127.0.0.1:${port}`;
  console.log('— Serveur 2 (redémarrage, sans invitation ni --ops)');
  const st = new Client(url);
  await st.opened;
  st.send({ t: 'status' });
  ok((await st.next((m) => m.t === 'status', 'statut 2')).needsInvite === false, 'statut : pas d’invitation');
  const D = await connect(url, 'Dora');
  ok(D.welcome.t === 'welcome' && D.welcome.permission === 'operator', 'aucun opérateur enregistré : le premier joueur devient opérateur');
  ok(D.welcome.world.seed === 42 && D.welcome.world.name === 'Serveur test', 'monde rechargé (graine, nom)');
  ok(D.welcome.world.day === 2 && D.welcome.world.time >= 13000, 'heure et jour persistés');
  const A = await connect(url, 'Alice');
  ok(A.welcome.permission === 'member' && A.welcome.player && A.welcome.player.health === 17, 'Alice : membre, sauvegarde relue du disque');
  A.send({ t: 'chunk', dim: 0, cx: 0, cz: 0 });
  const ch = await A.next((m) => m.t === 'chunk' && m.cx === 0, 'tronçon après redémarrage');
  const map = new Map(ch.blocks);
  ok(map.get(localIndex(3, 64, 2)) === (5 | (2 << 10)), 'persistance : bloc modifié présent après redémarrage');
  ok(ch.be.length === 1 && ch.be[0][1].type === 'chest', 'persistance : coffre présent après redémarrage');
  A.send({ t: 'chunk', dim: 0, cx: 5, cz: 5 });
  const bad = await A.next((m) => m.t === 'chunk' && m.cx === 5, 'tronçon corrompu');
  ok(bad.blocks.length === 0, 'fichier de tronçon corrompu ignoré (serveur toujours en marche)');
  ok(readdirSync(join(worldDir, 'chunks')).some((f) => f.startsWith('0_5_5.json.corrupt-')), 'fichier corrompu mis de côté');
  const big = new Client(url);
  await big.opened;
  big.send({ t: 'hello', v: 1, name: 'Gros', skin: 'explorer' });
  await big.next((m) => m.t === 'welcome', 'accueil de Gros');
  big.send(JSON.stringify({ t: 'chat', text: 'x'.repeat(70 * 1024) }));
  ok(await big.waitClosed(), 'message de plus de 64 Ko : connexion fermée');
  A.send({ t: 'block', dim: 0, x: 1, y: 80, z: 1, raw: 7 });
  await D.next((m) => m.t === 'block' && m.y === 80, 'bloc d’un membre');
  ok(true, 'un membre peut modifier le monde');
  await A.close();
  await D.close();
}

async function phase3(port) {
  const url = `ws://127.0.0.1:${port}`;
  console.log('— Serveur 3 (opérateurs enregistrés)');
  const A = await connect(url, 'Alice');
  ok(A.welcome.permission === 'member', 'Dora reste l’opératrice enregistrée : Alice n’est pas promue');
  A.send({ t: 'chunk', dim: 0, cx: 0, cz: 0 });
  const ch = await A.next((m) => m.t === 'chunk' && m.cx === 0, 'tronçon');
  ok(new Map(ch.blocks).get(localIndex(1, 80, 1)) === 7, 'bloc posé avant l’arrêt (SIGTERM) bien enregistré');
  await A.close();
}

async function main() {
  const base = ['--world-dir', worldDir, '--seed', '42', '--name', 'Serveur test', '--motd', 'Bienvenue'];
  const p1 = await freePort();
  let srv = await startServer(['--port', String(p1), ...base, '--invite', INVITE, '--ops', 'Alice', '--default-permission', 'visitor', '--max', '3']);
  await phase1(p1);
  let r = await stopServer(srv);
  ok(r.code === 0, 'arrêt propre (SIGTERM) : code 0');
  ok(srv.out.join('').includes('Monde enregistré'), 'arrêt : monde enregistré');
  ok(existsSync(join(worldDir, 'world.json')) && existsSync(join(worldDir, 'chunks', '0_0_0.json')) && existsSync(join(worldDir, 'players', 'alice.json')), 'fichiers world.json, chunks/0_0_0.json, players/alice.json');
  writeFileSync(join(worldDir, 'chunks', '0_5_5.json'), '{ ceci est corrompu');

  const p2 = await freePort();
  srv = await startServer(['--port', String(p2), ...base]);
  await phase2(p2);
  r = await stopServer(srv);
  ok(r.code === 0, 'deuxième arrêt propre');

  const p3 = await freePort();
  srv = await startServer(['--port', String(p3), '--world-dir', worldDir]);
  await phase3(p3);
  r = await stopServer(srv);
  ok(r.code === 0, 'troisième arrêt propre');

  console.log(`\nRésumé : ${passed.length} vérifications réussies${skipped.length ? `, ${skipped.length} ignorée(s) : ${skipped.join(', ')}` : ''}.`);
}

try {
  await main();
  rmSync(worldDir, { recursive: true, force: true });
  process.exit(0);
} catch (e) {
  console.error('\nÉCHEC du test du serveur : ' + (e && e.message ? e.message : e));
  if (current) {
    console.error('--- sortie du serveur ---\n' + current.out.join('').split('\n').slice(-40).join('\n'));
    current.proc.kill('SIGKILL');
  }
  console.error('Monde de test conservé : ' + worldDir);
  process.exit(1);
}
