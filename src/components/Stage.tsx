import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { state, SCENES, type SceneDef } from '../engine/director';
import { frames, frameImage, shotOf } from '../engine/frames';
import { mouse, isTouch } from '../engine/hooks';

const RED = '#ff1f1f';

export default function Stage() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext('2d')!;
    let dpr = 1, W = 0, H = 0, par = 0, key = '';
    const touch = isTouch();

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      key = '';
    };
    resize();
    window.addEventListener('resize', resize);

    const drawImg = (img: HTMLImageElement, box: number[], offX: number, offY: number, s: number) => {
      ctx.drawImage(img, offX + box[0] * s, offY + box[1] * s, box[2] * s, box[3] * s);
    };

    const drawShot = (f: number, sc: SceneDef, alpha: number, dx: number) => {
      const m = frames.manifest;
      if (!m) return;
      const a = Math.floor(f + 1e-6);
      const frac = f - a;
      const shot = m.shots[shotOf(a)];
      const imgA = frameImage(a);
      if (!imgA) return;
      const mobile = state.mobile;
      const s = mobile ? Math.min((H * 0.74) / 900, (W * 1.05) / shot.box[2]) : (H * sc.k) / 900;
      const x = mobile ? 0.5 : sc.x;
      const offY = H - 900 * s;
      const offX = x * W - shot.cx * 1600 * s + par + dx;
      ctx.globalAlpha = alpha;
      drawImg(imgA, shot.box, offX, offY, s);
      if (frac > 0.002 && a + 1 <= shot.to) {
        const imgB = frames.imgs[a + 1];
        if (imgB) { ctx.globalAlpha = alpha * frac; drawImg(imgB, shot.box, offX, offY, s); }
      }
      ctx.globalAlpha = 1;
    };

    const render = () => {
      if (!frames.manifest || !SCENES.length) return;
      const target = touch ? 0 : mouse.x * 14;
      par += (target - par) * 0.06;
      if (Math.abs(target - par) < 0.01) par = target;
      const k = `${state.cur}|${state.f.toFixed(3)}|${state.t.toFixed(4)}|${par.toFixed(2)}|${W}x${H}|${frames.loaded}|${state.mobile}`;
      if (k === key) return;
      key = k;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const cur = SCENES[state.cur];
      const t = state.t;
      if (state.prev < 0 || t >= 1) { drawShot(state.f, cur, 1, 0); return; }

      // ── Blade transition ──
      const prev = SCENES[state.prev];
      const skew = 0.2 * H;
      const e = -skew + (W + 2 * skew) * t;
      // outgoing: right of the blade
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(e + skew, 0); ctx.lineTo(W + 400, 0); ctx.lineTo(W + 400, H); ctx.lineTo(e - skew, H);
      ctx.closePath(); ctx.clip();
      drawShot(state.fPrev, prev, 1 - 0.35 * t, 60 * t);
      ctx.restore();
      // incoming: left of the blade
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-400, 0); ctx.lineTo(e + skew, 0); ctx.lineTo(e - skew, H); ctx.lineTo(-400, H);
      ctx.closePath(); ctx.clip();
      drawShot(state.f, cur, 1, -60 * (1 - t));
      ctx.restore();

      const col = cur.id === 'contact' ? '#ffffff' : RED;
      // trail (90px, behind the blade's direction of travel)
      const len = Math.hypot(H, 2 * skew), nx = H / len, ny = (2 * skew) / len;
      const g = ctx.createLinearGradient(e - nx * 90, H / 2 - ny * 90, e, H / 2);
      const tw = 90 / nx;
      g.addColorStop(0, 'rgba(255,31,31,0)');
      g.addColorStop(1, cur.id === 'contact' ? 'rgba(255,255,255,0.35)' : 'rgba(255,31,31,0.22)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(e + skew - tw, 0); ctx.lineTo(e + skew, 0); ctx.lineTo(e - skew, H); ctx.lineTo(e - skew - tw, H);
      ctx.closePath(); ctx.fill();
      // blade
      ctx.save();
      ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.shadowColor = col; ctx.shadowBlur = 24;
      ctx.beginPath(); ctx.moveTo(e + skew, 0); ctx.lineTo(e - skew, H); ctx.stroke();
      ctx.restore();
    };

    gsap.ticker.add(render);
    return () => { gsap.ticker.remove(render); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} className="stage" aria-hidden="true" />;
}
