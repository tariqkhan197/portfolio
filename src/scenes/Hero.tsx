import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { Section, Button } from '../components/Chrome';
import { layers, useDirector, useIntro } from '../engine/hooks';
import { clamp, textFade, scrollToScene } from '../engine/director';
import { person, tagline } from '../data';

export default function Hero() {
  const name = useRef<HTMLDivElement>(null);
  const outers = useRef<(HTMLSpanElement | null)[]>([]);
  const copy = useRef<HTMLDivElement>(null);
  const hl = useRef<HTMLSpanElement>(null);
  const letters = person.first.toUpperCase().split('');

  useIntro(() => {
    gsap.fromTo(name.current!.querySelectorAll('.hn__i'),
      { y: 0, yPercent: 115, rotateX: -80 },
      { yPercent: 0, rotateX: 0, stagger: 0.07, duration: 1.6, ease: 'expo.out' });
    const c = copy.current!;
    gsap.fromTo(c.querySelectorAll('.mask > span'), { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.12, delay: 0.15 });
    gsap.fromTo(c.querySelectorAll('.hero__hi, .hero__desc, .hero__btns'), { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.1, delay: 0.35 });
  });

  useDirector((s) => {
    const st = s.s.hero;
    if (!name.current) return;
    name.current.style.opacity = String(st.vis);
    outers.current.forEach((el, i) => {
      if (el) el.style.transform = `translate3d(0,${(i % 2 ? 1 : -1) * st.p * 26}px,0)`;
    });
    copy.current!.style.opacity = String(textFade(st));
    copy.current!.style.transform = `translate3d(0,${-st.exit * 6}vh,0)`;
    hl.current!.style.backgroundSize = `${clamp(st.p / 0.72) * 100}% 0.34em`;
  });

  return (
    <>
      {createPortal(
        <div className="hero-name" ref={name}>
          {letters.map((l, i) => (
            <span className="hn__o" key={i} ref={(el) => (outers.current[i] = el)}>
              <span className="hn__i">{l}</span>
            </span>
          ))}
        </div>,
        layers.back,
      )}
      <Section id="hero">
        <div className="hero panel" ref={copy}>
          <p className="hero__hi">Hi, I'm <b>{person.full}</b> —</p>
          <h1 className="hero__title">
            <span className="mask"><span>{person.role[0]}</span></span>
            <span className="mask red"><span>{person.role[1]}</span></span>
          </h1>
          <p className="hero__desc"><span className="hl" ref={hl}>{tagline}</span></p>
          <div className="hero__btns">
            <Button onClick={() => scrollToScene('work')} cursor="Go">See my work ↘</Button>
            <Button variant="outline" href={person.cv} cursor="PDF" external ariaLabel="View CV (PDF, opens in new tab)">View CV</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
