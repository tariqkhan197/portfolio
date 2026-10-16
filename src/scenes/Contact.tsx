import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Section } from '../components/Chrome';
import { layers, useDirector } from '../engine/hooks';
import { SCENES, clamp, easeOutCubic, smoothstep, scrollToScene } from '../engine/director';
import { person, year } from '../data';

export default function Contact() {
  const red = useRef<HTMLDivElement>(null);
  const big = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const [user, domain] = person.email.split('@');

  useDirector((s) => {
    if (!red.current || !SCENES.length) return;
    const ci = SCENES.length - 1;
    const st = s.s.contact;
    // same blade maths as the canvas
    let t = 0;
    if (s.cur === ci) t = s.t;
    const W = s.vw, H = s.vh, skew = 0.2 * H;
    const e = -skew + (W + 2 * skew) * t;
    if (t <= 0) red.current.style.visibility = 'hidden';
    else {
      red.current.style.visibility = 'visible';
      red.current.style.clipPath = t >= 1 ? 'none'
        : `polygon(0 0, ${e + skew}px 0, ${e - skew}px ${H}px, 0 ${H}px)`;
    }
    const o = easeOutCubic(clamp((st.enter - 0.55) / 0.45));
    big.current!.style.opacity = String(o);
    big.current!.style.transform = `translate3d(-50%,${(1 - o) * 9}vh,0)`;
    front.current!.style.opacity = String(smoothstep(0.55, 1, t) * o);
  });

  return (
    <>
      {createPortal(
        <>
          <div className="contact-red" ref={red} />
          <div className="talk" ref={big}><span>Let's</span><span>Talk</span></div>
        </>,
        layers.back,
      )}
      <Section id="contact">
        <div className="contact" ref={front}>
          <p className="label label--light"><em>(06)</em> — Contact</p>
          <a className="mail" href={`mailto:${person.email}`} data-cursor="Write">
            <span className="mail__u">{user}</span>
            <span className="mail__d">@{domain}</span>
          </a>
          <ul className="links">
            <li><a href={person.github} target="_blank" rel="noreferrer" data-cursor="Open">GitHub <i>↗</i></a></li>
            <li><a href={person.resume} target="_blank" rel="noreferrer" data-cursor="PDF">Résumé <i>↗</i></a></li>
          </ul>
          <footer className="foot">
            <span>© {year} {person.full}</span>
            <a href="#hero" data-cursor="Top" onClick={(e) => { e.preventDefault(); scrollToScene('hero'); }}>Back to top ↑</a>
          </footer>
        </div>
      </Section>
    </>
  );
}
