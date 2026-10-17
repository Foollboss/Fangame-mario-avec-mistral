/**
 * Ouvrir et enregistrer des fichiers. Dans l'appli Android, la WebView ne sait ni ouvrir le sélecteur
 * de fichiers d'un <input type="file"> de façon fiable, ni télécharger : l'appli s'en charge
 * (voxerraHost.openTextFile / saveFile) et rend la main par window.__voxerraFichier / __voxerraEnregistre.
 */
interface FileHost {
  openTextFile?: (id: number) => void;
  saveFile?: (id: number, name: string, mime: string, base64: string) => void;
}

const host = (): FileHost | undefined => (globalThis as { voxerraHost?: FileHost }).voxerraHost;

let seq = 0;
const opening = new Map<number, (f: { name: string; text: string } | null) => void>();
const saving = new Map<number, (ok: boolean) => void>();
const g = globalThis as unknown as {
  __voxerraFichier?: (id: number, name: string | null, text: string | null) => void;
  __voxerraEnregistre?: (id: number, ok: boolean) => void;
};
g.__voxerraFichier = (id, name, text) => {
  const done = opening.get(id);
  opening.delete(id);
  done?.(text === null || text === undefined ? null : { name: name ?? '', text });
};
g.__voxerraEnregistre = (id, ok) => {
  const done = saving.get(id);
  saving.delete(id);
  done?.(!!ok);
};

/** Choisir un fichier texte ; null si annulé. */
export function pickTextFile(accept: string): Promise<{ name: string; text: string } | null> {
  const h = host();
  if (typeof h?.openTextFile === 'function') {
    return new Promise((resolve) => {
      const id = ++seq;
      opening.set(id, resolve);
      h.openTextFile!(id);
    });
  }
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.style.display = 'none';
    const finish = (f: { name: string; text: string } | null) => {
      input.remove();
      resolve(f);
    };
    input.addEventListener('change', () => {
      const f = input.files?.[0];
      if (!f) return finish(null);
      f.text().then(
        (text) => finish({ name: f.name, text }),
        () => finish(null),
      );
    });
    input.addEventListener('cancel', () => finish(null));
    document.body.appendChild(input);
    input.click();
  });
}

function blobToBase64(b: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).replace(/^data:[^,]*,/, ''));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(b);
  });
}

/** Enregistre un fichier (téléchargement, ou « Enregistrer sous » de l'appli Android). */
export async function saveFile(name: string, data: Blob | string, mime = 'application/octet-stream'): Promise<boolean> {
  // data : Blob, ou URL data: (capture d'écran)
  const h = host();
  if (typeof h?.saveFile === 'function') {
    const base64 = typeof data === 'string' ? data.replace(/^data:[^,]*,/, '') : await blobToBase64(data);
    const type = typeof data === 'string' ? (/^data:([^;,]+)/.exec(data)?.[1] ?? mime) : data.type || mime;
    return new Promise((resolve) => {
      const id = ++seq;
      saving.set(id, resolve);
      h.saveFile!(id, name, type, base64);
    });
  }
  const url = typeof data === 'string' ? data : URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  if (typeof data !== 'string') setTimeout(() => URL.revokeObjectURL(url), 60000);
  return true;
}
