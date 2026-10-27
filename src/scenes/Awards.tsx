import { useRef } from 'react';
import { Section } from '../components/Chrome';
import { useDirector } from '../engine/hooks';
import { clamp, easeOutCubic, textFade, scrollToSceneProgress } from '../engine/director';
import { counters, certifications, certificateUrl } from '../data';

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
                <div
                  className={`cert ${i % 3 === 2 ? 'cert--red' : ''}`}
                  key={c.file}
                  style={{ transform: `rotateY(${STEP * i}deg) translateZ(360px)` }}
                  onFocus={(e) => {
                    // keyboard focus only — a mouse click must not rotate the ring mid-click
                    if ((e.target as HTMLElement).matches(':focus-visible')) scrollToSceneProgress('awards', i / (N - 1));
                  }}
                >
                  <article className="cert__face cert__front">
                    <div className="cert__top">
                      <span className="cert__issuer">{c.issuer}</span>
                      <span className="cert__date">{c.date}</span>
                    </div>
                    <h3 className="cert__title">{c.title}</h3>
                    <div className="cert__actions">
                      <a
                        className="cert__view"
                        href={certificateUrl(c)}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="PDF"
                        aria-label={`View ${c.title} certificate (PDF, opens in new tab)`}
                      >
                        View Certificate <i aria-hidden="true">↗</i>
                      </a>
                      <a
                        className="cert__verify"
                        href={c.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="Open"
                        aria-label={`Verify ${c.title} certificate on Coursera (opens in new tab)`}
                      >
                        Verify
                      </a>
                    </div>
                    <span className="cert__seal" aria-hidden="true">✓</span>
                  </article>
                  <div className="cert__face cert__back" aria-hidden="true"><span>{c.issuer}</span><span className="cert__seal">✓</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
