export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Liaison des clics (pointerup plutôt que click : plus réactif sur mobile, ignore les glissements).
export function onTap(node, fn) {
  let sx = 0, sy = 0, down = false;
  node.addEventListener('pointerdown', (e) => { down = true; sx = e.clientX; sy = e.clientY; });
  node.addEventListener('pointerup', (e) => {
    if (!down) return;
    down = false;
    if (Math.hypot(e.clientX - sx, e.clientY - sy) < 12) fn(e);
  });
  node.addEventListener('pointercancel', () => { down = false; });
}

export function bindAll(root, selector, fn) {
  root.querySelectorAll(selector).forEach((n) => onTap(n, (e) => fn(n, e)));
}

export function segmented(root, name, value, onChange) {
  const wrap = root.querySelector(`[data-seg="${name}"]`);
  if (!wrap) return;
  const buttons = wrap.querySelectorAll('button');
  buttons.forEach((b) => {
    b.classList.toggle('sel', b.dataset.v === String(value));
    onTap(b, () => {
      buttons.forEach((x) => x.classList.toggle('sel', x === b));
      onChange(b.dataset.v);
    });
  });
}
