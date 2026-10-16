import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Section } from '../components/Chrome';
import Odometer, { type OdometerHandle } from '../components/Odometer';
import { layers, useDirector } from '../engine/hooks';
import { clamp, easeInOutCubic, easeOutCubic, textFade } from '../engine/director';
import { journey } from '../data';

export default function Journey() {
  const yearWrap = useRef<HTMLDivElement>(null);
  const odo = useRef<OdometerHandle>(null);
  const col = useRef<HTMLDivElement>(null);
  const line = useRef<SVGLineElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const N = journey.items.length;

  useDirector((s) => {
    const st = s.s.journey;
    if (!yearWrap.current) return;
    const e = easeOutCubic(st.enter);
    yearWrap.current.style.opacity = String(st.vis);
    yearWrap.current.style.transform = `translate3d(0,${(1 - e) * 6}vh,0)`;
    odo.current?.set(journey.fromYear + (journey.toYear - journey.fromYear) * easeInOutCubic(clamp((st.p - 0.05) / 0.8)));

    col.current!.style.opacity = String(textFade(st));
    const prog = clamp((st.p + 0.02) / 0.78);
    line.current!.style.strokeDashoffset = String(1 - prog);
    items.current.forEach((el, j) => {
      if (!el) return;
      const b = N - 1 - j; // bottom item reveals first
      const r = easeOutCubic(clamp((prog * N - b) / 0.9));
      el.style.opacity = String(r);
      el.style.transform = `perspective(900px) rotateY(${-55 * (1 - r)}deg)`;
      el.classList.toggle('on', prog >= (b + 0.5) / N);
    });
  });

  return (
    <>
      {createPortal(
        <div className="year" ref={yearWrap}><Odometer digits={4} initial={journey.fromYear} ref={odo} className="odo--outline" /></div>,
        layers.back,
      )}
      <Section id="journey">
        <div className="journey" ref={col}>
          <p className="label"><em>(03)</em> — Journey</p>
          <h2 className="title">Learning<br /><span className="red">out loud.</span></h2>
          <div className="tl">
            <span className="tl__track" />
            <svg className="tl__svg" viewBox="0 0 2 100" preserveAspectRatio="none" aria-hidden="true">
              <line ref={line} x1="1" y1="100" x2="1" y2="0" pathLength={1} />
            </svg>
            <ol>
              {journey.items.map((it, j) => (
                <li key={it.title} ref={(el) => (items.current[j] = el)}>
                  <span className="tl__node" />
                  <span className="tl__year">{it.year}</span>
                  <h3 className="tl__title">{it.title}</h3>
                  <span className="tl__org">{it.org}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>
    </>
  );
}
