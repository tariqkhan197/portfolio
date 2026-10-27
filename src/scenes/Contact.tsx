import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Section } from '../components/Chrome';
import { layers, useDirector } from '../engine/hooks';
import { SCENES, clamp, easeOutCubic, smoothstep, scrollToScene } from '../engine/director';
import { person, year } from '../data';

function LinkedInIcon() {
  return (
    <svg className="links__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>
    </svg>
  );
}

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
            <li><a href={person.github} target="_blank" rel="noopener noreferrer" data-cursor="Open" aria-label="GitHub profile (opens in new tab)">GitHub <i aria-hidden="true">↗</i></a></li>
            <li>
              <a href={person.linkedin} target="_blank" rel="noopener noreferrer" data-cursor="Open" aria-label="LinkedIn profile (opens in new tab)">
                <span className="links__label"><LinkedInIcon />LinkedIn</span> <i aria-hidden="true">↗</i>
              </a>
            </li>
            <li><a href={person.cv} target="_blank" rel="noopener noreferrer" data-cursor="PDF" aria-label="View CV (PDF, opens in new tab)">View CV <i aria-hidden="true">↗</i></a></li>
            <li><a href={person.cv} download={person.cvFileName} data-cursor="PDF" aria-label="Download CV (PDF)">Download CV <i className="links__dl" aria-hidden="true">↓</i></a></li>
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
