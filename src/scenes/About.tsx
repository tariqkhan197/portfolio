import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Section } from '../components/Chrome';
import TiltCard from '../components/TiltCard';
import Odometer, { type OdometerHandle } from '../components/Odometer';
import { layers, useDirector } from '../engine/hooks';
import { clamp, easeOutCubic, textFade } from '../engine/director';
import { manifesto, stats } from '../data';

const words = manifesto.split(' ').map((w) => ({ hot: w.includes('*'), text: w.replace(/\*/g, '') }));

export default function About() {
  const shade = useRef<HTMLDivElement>(null);
  const col = useRef<HTMLDivElement>(null);
  const ws = useRef<(HTMLSpanElement | null)[]>([]);
  const cards = useRef<HTMLDivElement>(null);
  const odos = useRef<(OdometerHandle | null)[]>([]);

  useDirector((s) => {
    const st = s.s.about;
    if (!shade.current) return;
    const e = easeOutCubic(st.enter);
    shade.current.style.opacity = String(st.vis);
    shade.current.style.transform = `translate3d(${(1 - e) * -8}vw,0,0)`;
    col.current!.style.opacity = String(textFade(st));
    col.current!.style.transform = `translate3d(0,${(1 - easeOutCubic(st.enter)) * 5}vh,0)`;

    const N = words.length, W = 5;
    const q = clamp((st.p + 0.04) / 0.58) * (N + W);
    ws.current.forEach((el, i) => {
      if (!el) return;
      const w = clamp((q - i) / W);
      el.style.opacity = String(0.1 + 0.9 * w);
      el.style.transform = `translate3d(0,${(1 - w) * 0.25}em,0)`;
      el.style.filter = w >= 1 ? 'none' : `blur(${(1 - w) * 4}px)`;
    });

    const c = easeOutCubic(clamp((st.p - 0.3) / 0.25));
    cards.current!.style.opacity = String(c);
    cards.current!.style.transform = `translate3d(0,${(1 - c) * 4}vh,0)`;
    const n = easeOutCubic(clamp((st.p - 0.36) / 0.5));
    odos.current.forEach((o, i) => o?.set(stats[i].value * n));
  });

  return (
    <>
      {createPortal(<div className="about-shade" ref={shade} />, layers.back)}
      <Section id="about">
        <div className="about" ref={col}>
          <div>
            <p className="label"><em>(01)</em> — About me</p>
            <p className="manifesto">
              {words.map((w, i) => (
                <span key={i} ref={(el) => (ws.current[i] = el)} className={w.hot ? 'hot' : undefined}>{w.text} </span>
              ))}
            </p>
          </div>
          <div className="stats" ref={cards}>
            {stats.map((st, i) => (
              <TiltCard key={st.label} className="stat">
                <div className="stat__num">
                  <Odometer digits={st.pad} ref={(h) => (odos.current[i] = h)} />
                  {st.suffix && <span className="stat__suf">{st.suffix}</span>}
                </div>
                <div className="stat__label">{st.label}</div>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
