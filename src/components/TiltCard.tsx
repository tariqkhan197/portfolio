import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { isTouch } from '../engine/hooks';

/** Glass card that tilts toward the cursor (±14°) with a moving radial glare. */
export default function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouch()) return;
    const o = outer.current!, c = card.current!;
    const rx = gsap.quickTo(c, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const ry = gsap.quickTo(c, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      const r = o.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 28);
      rx(-(py - 0.5) * 28);
      c.style.setProperty('--gx', `${px * 100}%`);
      c.style.setProperty('--gy', `${py * 100}%`);
      c.style.setProperty('--ga', '1');
    };
    const leave = () => { rx(0); ry(0); c.style.setProperty('--ga', '0'); };
    o.addEventListener('pointermove', move);
    o.addEventListener('pointerleave', leave);
    return () => { o.removeEventListener('pointermove', move); o.removeEventListener('pointerleave', leave); };
  }, []);

  return (
    <div className={`tilt ${className}`} ref={outer}>
      <div className="tilt__card" ref={card}>
        {children}
        <span className="tilt__glare" />
      </div>
    </div>
  );
}
