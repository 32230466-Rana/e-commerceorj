/**
 * Integration: Developer B's product photos are studio shots with a coloured backdrop
 * (e.g. the yellow wall behind "Retro Skate Classic Low"). On the cart stage every other
 * sneaker is a transparent cut-out, so for photos with a plain backdrop the backdrop is
 * removed in the browser: flood-fill from the photo's edges over pixels close to the
 * backdrop colour, keep the main shoe shape, then erode and de-tint the edge.
 * Results are cached per URL. Any failure (offline, no CORS) falls back to the original photo.
 */

export interface BackdropSettings {
  /** How far (colour distance) a pixel may be from the backdrop's average colour. */
  tolerance: number;
  /** Largest colour change allowed between neighbouring backdrop pixels. */
  step: number;
}

const WORK_SIZE = 640;
const cache = new Map<string, Promise<string>>();
const resolved = new Map<string, string>();

/** The finished cut-out for this photo, if it has already been made. */
export const cachedCutout = (url: string): string | undefined => resolved.get(url);

export function cutoutPhoto(url: string, settings: BackdropSettings): Promise<string> {
  let pending = cache.get(url);
  if (!pending) {
    pending = makeCutout(url, settings)
      .catch(() => url)
      .then((src) => {
        resolved.set(url, src);
        return src;
      });
    cache.set(url, pending);
  }
  return pending;
}

/** Loads a CORS-enabled copy of the photo. (img.decode() can stall in background tabs, so use load events.) */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = window.setTimeout(() => reject(new Error('timeout')), 10000);
    img.crossOrigin = 'anonymous';
    img.onload = () => { window.clearTimeout(timer); resolve(img); };
    img.onerror = () => { window.clearTimeout(timer); reject(new Error('load failed')); };
    img.src = url;
  });
}

async function makeCutout(url: string, { tolerance, step }: BackdropSettings): Promise<string> {
  if (typeof document === 'undefined') return url;
  const img = await loadImage(url);

  const scale = Math.min(1, WORK_SIZE / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return url;
  ctx.drawImage(img, 0, 0, w, h);
  const image = ctx.getImageData(0, 0, w, h); // throws if the photo is not CORS-enabled
  const px = image.data;
  const n = w * h;
  const near = (x: number, y: number) => [x > 0 ? -1 : 0, x < w - 1 ? 1 : 0, y > 0 ? -w : 0, y < h - 1 ? w : 0];

  const dist = (r: number, g: number, b: number) => Math.sqrt(2 * r * r + 4 * g * g + 3 * b * b) / 3;
  const between = (i: number, j: number) =>
    dist(px[i * 4] - px[j * 4], px[i * 4 + 1] - px[j * 4 + 1], px[i * 4 + 2] - px[j * 4 + 2]);

  // 1. Backdrop colour = average of the border pixels.
  const border: number[] = [];
  for (let x = 0; x < w; x++) border.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) border.push(y * w, y * w + w - 1);
  let br = 0, bg = 0, bb = 0;
  for (const i of border) { br += px[i * 4]; bg += px[i * 4 + 1]; bb += px[i * 4 + 2]; }
  br /= border.length; bg /= border.length; bb /= border.length;
  const fromBackdrop = (i: number) => dist(px[i * 4] - br, px[i * 4 + 1] - bg, px[i * 4 + 2] - bb);

  // 2. Flood-fill the backdrop from the edges.
  const backdrop = new Uint8Array(n);
  const queue = new Int32Array(n);
  let head = 0, tail = 0;
  for (const i of border) if (!backdrop[i] && fromBackdrop(i) < tolerance * 2.2) { backdrop[i] = 1; queue[tail++] = i; }
  while (head < tail) {
    const i = queue[head++];
    for (const offset of near(i % w, (i / w) | 0)) {
      const j = i + offset;
      if (!offset || backdrop[j]) continue;
      if (between(i, j) < step && fromBackdrop(j) < tolerance * 3) { backdrop[j] = 1; queue[tail++] = j; }
    }
  }

  // 3. Keep the shoe: the largest remaining shape, plus any shape at least 20% of its size.
  const label = new Int32Array(n).fill(-1);
  const sizes: number[] = [];
  for (let s = 0; s < n; s++) {
    if (backdrop[s] || label[s] >= 0) continue;
    const id = sizes.length;
    let size = 0;
    head = 0; tail = 0;
    queue[tail++] = s;
    label[s] = id;
    while (head < tail) {
      const i = queue[head++];
      size++;
      for (const offset of near(i % w, (i / w) | 0)) {
        const j = i + offset;
        if (offset && !backdrop[j] && label[j] < 0) { label[j] = id; queue[tail++] = j; }
      }
    }
    sizes.push(size);
  }
  const largest = Math.max(0, ...sizes);
  if (largest < n * 0.03) return url; // nothing recognisable left: keep the photo
  const shoe = new Uint8Array(n);
  for (let i = 0; i < n; i++) shoe[i] = !backdrop[i] && sizes[label[i]] >= largest * 0.2 ? 1 : 0;

  // 4. Erode the edge by 2px, feather the next 2px and remove the backdrop's tint from it.
  const ERODE = 2, FEATHER = 2, reach = ERODE + FEATHER;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!shoe[i]) { px[i * 4 + 3] = 0; continue; }
      let edge = reach + 1;
      for (let dy = -reach; dy <= reach; dy++) {
        for (let dx = -reach; dx <= reach; dx++) {
          const X = x + dx, Y = y + dy;
          if (X < 0 || Y < 0 || X >= w || Y >= h || shoe[Y * w + X]) continue;
          edge = Math.min(edge, Math.hypot(dx, dy));
        }
      }
      if (edge <= ERODE) { px[i * 4 + 3] = 0; continue; }
      if (edge <= reach) {
        const t = (edge - ERODE) / FEATHER;
        px[i * 4 + 3] = Math.round(255 * t);
        const k = 0.5 * (1 - t);
        px[i * 4] = Math.max(0, Math.min(255, (px[i * 4] - k * br) / (1 - k)));
        px[i * 4 + 1] = Math.max(0, Math.min(255, (px[i * 4 + 1] - k * bg) / (1 - k)));
        px[i * 4 + 2] = Math.max(0, Math.min(255, (px[i * 4 + 2] - k * bb) / (1 - k)));
      }
    }
  }
  ctx.putImageData(image, 0, 0);

  // 5. Trim to the shoe (plus a small margin) so it fills the stage like the other cut-outs.
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (px[(y * w + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return url;
  const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.04);
  minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
  const trimmed = document.createElement('canvas');
  trimmed.width = maxX - minX + 1;
  trimmed.height = maxY - minY + 1;
  trimmed.getContext('2d')?.drawImage(canvas, minX, minY, trimmed.width, trimmed.height, 0, 0, trimmed.width, trimmed.height);

  const blob = await new Promise<Blob | null>((resolve) => trimmed.toBlob(resolve, 'image/png'));
  return blob ? URL.createObjectURL(blob) : url;
}
