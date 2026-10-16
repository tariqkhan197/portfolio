export type Shot = { from: number; to: number; box: [number, number, number, number]; cx: number };
export type Manifest = { w: number; h: number; count: number; shots: Shot[] };

export const frames = {
  manifest: null as Manifest | null,
  imgs: [] as (HTMLImageElement | null)[],
  loaded: 0,
};

export function shotOf(i: number): number {
  const m = frames.manifest!;
  for (let s = 0; s < m.shots.length; s++) if (i >= m.shots[s].from && i <= m.shots[s].to) return s;
  return m.shots.length - 1;
}

/** Image for frame i, or the nearest loaded frame inside the same shot. */
export function frameImage(i: number): HTMLImageElement | null {
  const m = frames.manifest;
  if (!m) return null;
  i = Math.max(0, Math.min(m.count - 1, i));
  if (frames.imgs[i]) return frames.imgs[i];
  const s = m.shots[shotOf(i)];
  for (let d = 1; d <= s.to - s.from; d++) {
    const a = i - d, b = i + d;
    if (a >= s.from && frames.imgs[a]) return frames.imgs[a];
    if (b <= s.to && frames.imgs[b]) return frames.imgs[b];
  }
  return null;
}

/** Shot boundaries first, then stride 8 → 4 → 2 → 1. */
function loadOrder(m: Manifest): number[] {
  const seen = new Set<number>();
  const out: number[] = [];
  const push = (i: number) => { if (i >= 0 && i < m.count && !seen.has(i)) { seen.add(i); out.push(i); } };
  m.shots.forEach((s) => { push(s.from); push(s.to); });
  for (const stride of [8, 4, 2, 1]) for (let i = 0; i < m.count; i += stride) push(i);
  return out;
}

export async function loadFrames(onProgress: (p: number) => void, onManifest?: () => void): Promise<void> {
  const res = await fetch('./frames/manifest.json');
  const m: Manifest = await res.json();
  frames.manifest = m;
  frames.imgs = new Array(m.count).fill(null);
  onManifest?.();
  const dir = window.innerWidth < 820 ? 'sm' : 'lg';
  const order = loadOrder(m);
  const gate = Math.ceil(order.length / 4); // preloader waits for first quarter
  let gateDone = 0;
  let resolveGate!: () => void;
  const gateP = new Promise<void>((r) => (resolveGate = r));

  let cursor = 0;
  const worker = async () => {
    while (cursor < order.length) {
      const k = cursor++;
      const i = order[k];
      const img = new Image();
      img.src = `./frames/${dir}/f${String(i).padStart(3, '0')}.webp`;
      try { await img.decode(); frames.imgs[i] = img; frames.loaded++; } catch { /* nearest-frame fallback */ }
      if (k < gate) {
        gateDone++;
        onProgress(gateDone / gate);
        if (gateDone >= gate) resolveGate();
      }
    }
  };
  for (let w = 0; w < 6; w++) worker();
  return gateP;
}
