import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import {
  HEIGHTS, NAV, SCENES, registerSection, scrollToScene, startDirector, fireIntro, isContactLit,
  type SceneId,
} from '../engine/director';
import { loadFrames } from '../engine/frames';
import { useDirector, isTouch, mouse } from '../engine/hooks';
import { person } from '../data';

/* ───────────── Section shell: tall scroll track + sticky viewport ───────────── */
export function Section({ id, children, className = '' }: { id: SceneId; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`sec sec--${id} ${className}`} style={{ height: `${HEIGHTS[id]}vh` }} ref={(el) => registerSection(id, el)}>
      <div className="sticky">
        <div className="inner">{children}</div>
      </div>
    </section>
  );
}

/* ───────────── Magnetic pill button with slide-up fill + roll text ───────────── */
type BtnProps = {
  children: string; variant?: 'red' | 'outline' | 'ink'; href?: string; onClick?: () => void;
  cursor?: string; download?: boolean; external?: boolean;
};
export function Button({ children, variant = 'red', href, onClick, cursor = 'Go', download, external }: BtnProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (isTouch()) return;
    const el = ref.current!;
    const qx = gsap.quickTo(el, 'x', { duration: 1, ease: 'elastic.out(1, 0.35)' });
    const qy = gsap.quickTo(el, 'y', { duration: 1, ease: 'elastic.out(1, 0.35)' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      qx((e.clientX - (r.left + r.width / 2)) * 0.35);
      qy((e.clientY - (r.top + r.height / 2)) * 0.35);
    };
    const leave = () => { qx(0); qy(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, []);
  return (
    <a
      ref={ref}
      className={`btn btn--${variant}`}
      href={href ?? '#'}
      data-cursor={cursor}
      download={download || undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      onClick={(e) => { if (onClick) { e.preventDefault(); onClick(); } }}
    >
      <span className="btn__fill" />
      <span className="btn__roll"><span>{children}</span><span aria-hidden="true">{children}</span></span>
    </a>
  );
}

/* ───────────── Preloader ───────────── */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const r = root.current!;
    const counter = { v: 0 };
    const paint = () => { num.current!.textContent = String(Math.round(counter.v)).padStart(3, '0'); };
    const t0 = performance.now();
    let started = false;
    loadFrames(
      (p) => gsap.to(counter, { v: p * 100, duration: 0.5, ease: 'power2.out', overwrite: true, onUpdate: paint }),
      () => { if (!started) { started = true; startDirector(); } },
    ).then(() => {
      const wait = Math.max(0, 1100 - (performance.now() - t0)) / 1000;
      const tl = gsap.timeline({ delay: wait });
      tl.to(counter, { v: 100, duration: 0.35, ease: 'power2.out', onUpdate: paint })
        .to(r.querySelectorAll('.pre__line > span, .pre__num'), { yPercent: -120, opacity: 0, duration: 0.6, ease: 'power3.in', stagger: 0.05 })
        .to(r.querySelector('.pre__half--top'), { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, '-=0.15')
        .to(r.querySelector('.pre__half--bot'), { yPercent: 100, duration: 1.2, ease: 'expo.inOut' }, '<')
        .call(() => fireIntro(), [], '-=0.75')
        .set(r, { display: 'none' });
    }).catch(() => {
      num.current!.textContent = 'ERR';
    });
  }, []);
  return (
    <div className="pre" ref={root} role="status" aria-label="Loading">
      <div className="pre__half pre__half--top" />
      <div className="pre__half pre__half--bot" />
      <div className="pre__center">
        <div className="pre__line"><span>{person.full} — Portfolio</span></div>
        <div className="pre__num" ref={num}>000</div>
        <div className="pre__line"><span>Full-stack · AI · {person.location}</span></div>
      </div>
    </div>
  );
}

/* ───────────── HUD ───────────── */
export function Hud() {
  const root = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const pct = useRef<HTMLSpanElement>(null);
  const rail = useRef<HTMLSpanElement>(null);
  const last = useRef({ cur: -1, lit: false, pct: -1 });

  useDirector((s) => {
    if (!SCENES.length || !root.current) return;
    const L = last.current;
    if (s.cur !== L.cur) {
      L.cur = s.cur;
      const id = SCENES[s.cur].id;
      items.current.forEach((b, i) => b?.classList.toggle('on', NAV[i].id === id));
    }
    const lit = isContactLit(s);
    if (lit !== L.lit) { L.lit = lit; root.current.classList.toggle('hud--lit', lit); }
    const p = Math.round(s.progress * 100);
    if (p !== L.pct) { L.pct = p; pct.current!.textContent = String(p).padStart(2, '0') + '%'; }
    rail.current!.style.transform = `scaleY(${s.progress})`;
  });

  return (
    <div className="hud" ref={root}>
      <a className="hud__logo" href="#hero" data-cursor="Top" onClick={(e) => { e.preventDefault(); scrollToScene('hero'); }}>
        {person.first}<sup>®</sup>
      </a>
      <nav className="hud__nav" aria-label="Sections">
        {NAV.map((n, i) => (
          <button key={n.id} ref={(el) => (items.current[i] = el)} onClick={() => scrollToScene(n.id)} data-cursor="Go">
            {n.label}
          </button>
        ))}
      </nav>
      <div className="hud__progress">
        <span className="hud__pct" ref={pct}>00%</span>
        <span className="hud__rail"><span ref={rail} /></span>
      </div>
    </div>
  );
}

/* ───────────── Cursor (desktop only) ───────────── */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (isTouch()) return;
    document.documentElement.classList.add('has-cursor');
    let rx = -100, ry = -100;
    const tick = () => {
      rx += (mouse.px - rx) * 0.16; ry += (mouse.py - ry) * 0.16;
      dot.current!.style.transform = `translate3d(${mouse.px}px,${mouse.py}px,0)`;
      ring.current!.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest?.('[data-cursor]') as HTMLElement | null;
      if (t) { label.current!.textContent = t.dataset.cursor || ''; ring.current!.classList.add('big'); }
      else ring.current!.classList.remove('big');
    };
    gsap.ticker.add(tick);
    window.addEventListener('pointerover', over);
    return () => { gsap.ticker.remove(tick); window.removeEventListener('pointerover', over); };
  }, []);
  return (
    <>
      <div className="cur-ring" ref={ring} aria-hidden="true"><span ref={label} /></div>
      <div className="cur-dot" ref={dot} aria-hidden="true" />
    </>
  );
}
