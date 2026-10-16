import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { Section } from '../components/Chrome';
import { layers, useDirector, mouse, isTouch } from '../engine/hooks';
import { state, smoothstep, textFade } from '../engine/director';
import { skills } from '../data';

// Fibonacci sphere
const N = skills.length;
const GA = Math.PI * (3 - Math.sqrt(5));
const PTS = skills.map((_, i) => {
  const y = 1 - ((i + 0.5) / N) * 2;
  const r = Math.sqrt(1 - y * y);
  return { x: Math.cos(GA * i) * r, y, z: Math.sin(GA * i) * r };
});

export default function Skills() {
  const backRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const frontRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const backWrap = useRef<HTMLDivElement>(null);
  const frontWrap = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const tape = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useDirector((s) => {
    const st = s.s.skills;
    if (!title.current) return;
    const f = textFade(st);
    title.current.style.opacity = String(f);
    tape.current!.style.opacity = String(f);
    track.current!.style.transform = `translate3d(${-10 - st.p * 40}%,0,0)`;
  });

  useEffect(() => {
    const touch = isTouch();
    let mx = 0, my = 0, t = 0;
    const tick = (_time: number, dt: number) => {
      const st = state.s.skills;
      const vis = st.vis;
      backWrap.current!.style.opacity = String(vis);
      frontWrap.current!.style.opacity = String(vis);
      if (vis <= 0) return;
      t += dt / 1000;
      mx += ((touch ? 0 : mouse.x) - mx) * 0.05;
      my += ((touch ? 0 : mouse.y) - my) * 0.05;
      const W = state.vw, H = state.vh;
      const R = state.mobile ? Math.min(W * 0.42, H * 0.3) : Math.min(W * 0.27, H * 0.46);
      const cx = W * 0.5, cy = H * (state.mobile ? 0.6 : 0.52);
      const A = t * 0.28 + st.p * 5 + mx * 0.9;
      const T = -0.28 + my * 0.18;
      const cA = Math.cos(A), sA = Math.sin(A), cT = Math.cos(T), sT = Math.sin(T);
      const rise = 0.55 + 0.45 * smoothstep(0, 1, st.enter);
      PTS.forEach((p, i) => {
        const x1 = p.x * cA + p.z * sA;
        const z1 = -p.x * sA + p.z * cA;
        const y2 = p.y * cT - z1 * sT;
        const z2 = p.y * sT + z1 * cT;
        const X = cx + x1 * R * rise;
        const Y = cy + y2 * R * 0.78 * rise;
        const sc = 0.78 + 0.32 * ((z2 + 1) / 2);
        const fa = smoothstep(-0.08, 0.08, z2);
        const tr = `translate3d(${X}px,${Y}px,0) translate(-50%,-50%) scale(${sc})`;
        const b = backRefs.current[i]!, fr = frontRefs.current[i]!;
        b.style.transform = tr; fr.style.transform = tr;
        b.style.opacity = String((1 - fa) * (0.45 + 0.35 * (z2 + 1)));
        fr.style.opacity = String(fa);
      });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const marquee = Array.from({ length: 3 }, () => skills).flat();

  return (
    <>
      {createPortal(
        <div className="orbit" ref={backWrap}>
          {skills.map((sk, i) => <span key={sk} className="chip chip--back" ref={(el) => (backRefs.current[i] = el)}>{sk}</span>)}
        </div>,
        layers.back,
      )}
      {createPortal(
        <div className="orbit" ref={frontWrap}>
          {skills.map((sk, i) => <span key={sk} className="chip chip--front" ref={(el) => (frontRefs.current[i] = el)}>{sk}</span>)}
        </div>,
        layers.front,
      )}
      <Section id="skills">
        <div className="skills-title" ref={title}>
          <p className="label"><em>(04)</em> — Toolkit</p>
          <h2 className="title">Everything<br /><span className="red">in orbit.</span></h2>
        </div>
        <div className="tape" ref={tape}>
          <div className="tape__track" ref={track}>
            {marquee.map((sk, i) => <span key={i}>{sk}<i>✦</i></span>)}
          </div>
        </div>
      </Section>
    </>
  );
}
