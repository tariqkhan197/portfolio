import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Section } from '../components/Chrome';
import { layers, useDirector } from '../engine/hooks';
import { clamp, easeInOutCubic, easeOutCubic, textFade } from '../engine/director';
import { projects, type Visual } from '../data';

function Mock({ kind }: { kind: Visual }) {
  if (kind === 'gauge')
    return (
      <div className="mock mock--gauge">
        <svg viewBox="0 0 200 120" className="gauge">
          <path d="M20 110 A80 80 0 0 1 180 110" className="gauge__track" />
          <path d="M20 110 A80 80 0 0 1 180 110" className="gauge__val" pathLength={1} />
        </svg>
        <div className="gauge__num">2,481<small>orders today</small></div>
        <div className="bars">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ animationDelay: `${i * -0.37}s` }} />)}</div>
      </div>
    );
  if (kind === 'chat')
    return (
      <div className="mock mock--chat">
        <div className="bub bub--u" style={{ animationDelay: '0s' }}>VPN drops every 10 min 😩</div>
        <div className="bub bub--a" style={{ animationDelay: '1s' }}>Routing to Network agent…</div>
        <div className="bub bub--a" style={{ animationDelay: '2s' }}>Found it in KB-112: update the client to 4.2.</div>
        <div className="bub bub--u" style={{ animationDelay: '3s' }}>Fixed. Thanks!</div>
        <div className="typing"><i /><i /><i /></div>
      </div>
    );
  return (
    <div className="mock mock--heat">
      <div className="heat">
        {Array.from({ length: 35 }, (_, i) => (
          <i key={i} style={{ animationDelay: `${((i * 37) % 23) * -0.21}s`, opacity: 0.25 + ((i * 53) % 10) / 14 }} />
        ))}
      </div>
      <div className="heat__legend"><span>Protein</span><span>Carbs</span><span>Fat</span></div>
    </div>
  );
}

export default function Work() {
  const grid = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const lastIdx = useRef(-1);
  const N = projects.length;

  useDirector((s) => {
    const st = s.s.work;
    if (!grid.current) return;
    grid.current.style.opacity = String(st.vis);
    plane.current!.style.backgroundPosition = `0 ${st.p * 900}px`;

    const f = textFade(st);
    head.current!.style.opacity = String(f);
    const e = easeOutCubic(clamp((st.enter - 0.45) / 0.55));
    deck.current!.style.opacity = String(Math.max(0, 1 - st.exit * 2.4) * clamp(e * 1.4));
    deck.current!.style.transform = `perspective(1500px) translate3d(0,${(1 - e) * 45}vh,0) rotateY(${-25 * (1 - e)}deg)`;

    const raw = clamp((st.p - 0.06) / 0.86) * (N - 1);
    const i0 = Math.min(N - 2, Math.floor(raw));
    const q = i0 + easeInOutCubic(raw - i0);
    const idx = Math.round(q);
    if (idx !== lastIdx.current) { lastIdx.current = idx; count.current!.textContent = String(idx + 1).padStart(2, '0'); }
    bar.current!.style.transform = `scaleX(${q / (N - 1)})`;

    cards.current.forEach((el, j) => {
      if (!el) return;
      const d = q - j;
      let z: number, y: number, rx = 0, op: number;
      if (d <= 0) { z = d * 300; y = d * 3.2; op = clamp(1 + d * 0.55); }
      else { z = d * 900; y = -12 * d; rx = 28 * d; op = clamp(1 - 1.8 * d); }
      el.style.transform = `translate3d(0,${y}vh,${z}px) rotateX(${rx}deg)`;
      el.style.opacity = String(op);
      el.style.visibility = op <= 0.001 ? 'hidden' : 'visible';
      el.style.zIndex = String(100 - j);
    });
  });

  return (
    <>
      {createPortal(
        <div className="grid-floor" ref={grid}><div className="grid-floor__plane" ref={plane} /></div>,
        layers.back,
      )}
      <Section id="work">
        <div className="work-head" ref={head}>
          <p className="label"><em>(02)</em> — Selected work</p>
          <div className="work-head__count"><span ref={count}>01</span> / {String(N).padStart(2, '0')}</div>
          <span className="work-head__bar"><span ref={bar} /></span>
        </div>
        <div className="deck" ref={deck}>
          {projects.map((p, j) => (
            <article className="card" key={p.name} ref={(el) => (cards.current[j] = el)}>
              <div className="card__l">
                <div className="card__meta"><span className="card__n">{String(j + 1).padStart(2, '0')}</span>{p.category}</div>
                <h3 className="card__name">{p.name}</h3>
                <p className="card__desc">{p.desc}</p>
                <ul className="chips">{p.chips.map((c) => <li key={c}>{c}</li>)}</ul>
                <a className="card__link" href={p.link} target="_blank" rel="noopener noreferrer" data-cursor="Open" aria-label={`View ${p.name} on GitHub (opens in new tab)`}>View on GitHub ↗</a>
              </div>
              <div className="card__r"><Mock kind={p.visual} /></div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
