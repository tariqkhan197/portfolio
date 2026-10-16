import { useRef } from 'react';
import { Section } from '../components/Chrome';
import { useDirector } from '../engine/hooks';
import { clamp, easeOutCubic, textFade } from '../engine/director';
import { counters, certifications } from '../data';

const N = certifications.length;
const STEP = 360 / N;

export default function Awards() {
  const col = useRef<HTMLDivElement>(null);
  const flips = useRef<(HTMLDivElement | null)[]>([]);
  const cyl = useRef<HTMLDivElement>(null);
  const cylWrap = useRef<HTMLDivElement>(null);

  useDirector((s) => {
    const st = s.s.awards;
    if (!col.current) return;
    col.current.style.opacity = String(textFade(st));
    flips.current.forEach((el, j) => {
      if (!el) return;
      const r = easeOutCubic(clamp((st.enter - 0.35 - j * 0.12) / 0.4));
      el.style.transform = `perspective(800px) rotateX(${-100 * (1 - r)}deg)`;
      el.style.opacity = String(clamp(r * 1.5));
    });
    const c = easeOutCubic(clamp((st.enter - 0.5) / 0.5));
    cylWrap.current!.style.opacity = String(c);
    cyl.current!.style.transform = `translateZ(-360px) rotateX(-14deg) rotateY(${-st.p * (360 - STEP)}deg)`;
  });

  return (
    <Section id="awards">
      <div className="awards" ref={col}>
        <p className="label"><em>(05)</em> — Recognition</p>
        <div className="counters">
          {counters.map((c, j) => (
            <div key={c.label} className={`flip ${j % 2 ? 'flip--ink' : 'flip--red'}`} ref={(el) => (flips.current[j] = el)}>
              <div className="flip__num">{String(c.value).padStart(2, '0')}<span>{c.suffix}</span></div>
              <div className="flip__label">{c.label}</div>
            </div>
          ))}
        </div>
        <div className="cyl-stage" ref={cylWrap}>
          <div className="cyl-scale">
            <div className="cyl" ref={cyl}>
              {certifications.map((c, i) => (
                <div className={`cert ${i % 3 === 2 ? 'cert--red' : ''}`} key={c.title} style={{ transform: `rotateY(${STEP * i}deg) translateZ(360px)` }}>
                  <div className="cert__face cert__front">
                    <span className="cert__issuer">{c.issuer}</span>
                    <h3 className="cert__title">{c.title}</h3>
                    <span className="cert__seal">✓</span>
                  </div>
                  <div className="cert__face cert__back"><span>{c.issuer}</span><span className="cert__seal">✓</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
