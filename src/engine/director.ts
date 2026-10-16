import Lenis from 'lenis';
import { gsap } from 'gsap';
import { frames } from './frames';

export type SceneId = 'hero' | 'about' | 'work' | 'journey' | 'skills' | 'awards' | 'contact';
export type SceneDef = { id: SceneId; from: number; to: number; x: number; k: number; label: string };
export type SceneState = { enter: number; p: number; exit: number; vis: number; top: number; h: number };
export type State = {
  y: number; vw: number; vh: number; mobile: boolean; progress: number;
  s: Record<SceneId, SceneState>;
  /** active scene index, its fractional frame; previous scene + blade t (1 = settled) */
  cur: number; f: number; prev: number; fPrev: number; t: number;
};

export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
export const smoothstep = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
/** Standard text-block fade: in on enter, out fast on exit. */
export const textFade = (st: SceneState) => easeOutCubic(clamp((st.enter - 0.6) / 0.4)) * Math.max(0, 1 - st.exit * 2.4);

export const HEIGHTS: Record<SceneId, number> = {
  hero: 230, about: 280, work: 460, journey: 240, skills: 280, awards: 320, contact: 240,
};

export let SCENES: SceneDef[] = [];

function buildScenes() {
  const sh = frames.manifest!.shots;
  const [S1, S2, S3, S4] = sh;
  const n4 = S4.to - S4.from;
  const a = S4.from + n4 * 0.6, b = S4.from + n4 * 0.85;
  SCENES = [
    { id: 'hero', label: 'Hello', from: S1.from, to: S1.to, x: 0.7, k: 1.0 },
    { id: 'about', label: 'About', from: S2.from, to: S2.to, x: 0.27, k: 1.0 },
    { id: 'work', label: 'Work', from: S3.from, to: S3.to, x: 0.77, k: 0.86 },
    { id: 'journey', label: 'Journey', from: S4.from, to: a, x: 0.26, k: 1.0 },
    { id: 'skills', label: 'Toolkit', from: a, to: b, x: 0.5, k: 0.98 },
    { id: 'awards', label: 'Awards', from: b, to: S4.to, x: 0.75, k: 1.0 },
    { id: 'contact', label: 'Contact', from: S1.to, to: S1.from, x: 0.5, k: 1.0 },
  ];
}

export const NAV: { id: SceneId; label: string }[] = [
  { id: 'hero', label: 'Hello' }, { id: 'about', label: 'About' }, { id: 'work', label: 'Work' },
  { id: 'journey', label: 'Journey' }, { id: 'skills', label: 'Toolkit' }, { id: 'awards', label: 'Awards' },
  { id: 'contact', label: 'Contact' },
];

const blank = (): SceneState => ({ enter: 0, p: 0, exit: 0, vis: 0, top: 0, h: 0 });
export const state: State = {
  y: 0, vw: window.innerWidth, vh: window.innerHeight, mobile: window.innerWidth < 820, progress: 0,
  s: { hero: blank(), about: blank(), work: blank(), journey: blank(), skills: blank(), awards: blank(), contact: blank() },
  cur: 0, f: 0, prev: -1, fPrev: 0, t: 1,
};

type Sub = (s: State) => void;
const subs = new Set<Sub>();
export const subscribe = (fn: Sub) => { subs.add(fn); fn(state); return () => { subs.delete(fn); }; };

type IntroSub = () => void;
const introSubs = new Set<IntroSub>();
let introFired = false;
export const onIntro = (fn: IntroSub) => { if (introFired) fn(); else introSubs.add(fn); return () => { introSubs.delete(fn); }; };

const sections = new Map<SceneId, HTMLElement>();
export const registerSection = (id: SceneId, el: HTMLElement | null) => { if (el) { sections.set(id, el); measure(); } };

let lenis: Lenis | null = null;
let dirty = true;

function measure() {
  state.vw = window.innerWidth;
  state.vh = window.innerHeight;
  state.mobile = state.vw < 820;
  sections.forEach((el, id) => {
    const r = el.getBoundingClientRect();
    state.s[id].top = r.top + window.scrollY;
    state.s[id].h = r.height;
  });
  dirty = true;
}

function compute() {
  const { y, vh } = state;
  for (const sc of SCENES) {
    const st = state.s[sc.id];
    st.enter = clamp((y - (st.top - vh)) / vh);
    st.p = clamp((y - st.top) / Math.max(1, st.h - vh));
    st.exit = clamp((y - (st.top + st.h - vh)) / vh);
    st.vis = clamp(Math.min(st.enter * 1.6, 1 - st.exit * 2.2));
  }
  const max = document.documentElement.scrollHeight - vh;
  state.progress = max > 0 ? clamp(y / max) : 0;

  // frame selection
  const lead = 0.78 * vh, span = 0.62 * vh;
  let cur = 0;
  SCENES.forEach((sc, i) => { if (y >= state.s[sc.id].top - lead) cur = i; });
  const sc = SCENES[cur];
  state.cur = cur;
  state.f = sc.from + (sc.to - sc.from) * state.s[sc.id].p;
  if (cur > 0) {
    const raw = clamp((y - (state.s[sc.id].top - lead)) / span);
    state.t = easeInOutSine(raw);
    state.prev = cur - 1;
    state.fPrev = SCENES[cur - 1].to;
    if (raw < 1) state.f = sc.from;
  } else { state.t = 1; state.prev = -1; }
}

let lastY = -1;
function tick() {
  const y = lenis ? lenis.scroll : window.scrollY;
  if (y !== lastY || dirty) {
    state.y = y; lastY = y; dirty = false;
    compute();
    subs.forEach((fn) => fn(state));
  }
}

export function startDirector() {
  buildScenes();
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  lenis = new Lenis({ lerp: 0.075, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
  lenis.stop();
  (window as unknown as { __lenis: Lenis }).__lenis = lenis; // used by QA screenshots
  gsap.ticker.add((time) => { lenis!.raf(time * 1000); tick(); });
  gsap.ticker.lagSmoothing(0);
  const ro = new ResizeObserver(measure);
  ro.observe(document.body);
  sections.forEach((el) => ro.observe(el));
  window.addEventListener('resize', measure);
  measure();
}

export function fireIntro() {
  introFired = true;
  lenis?.start();
  introSubs.forEach((fn) => fn());
  introSubs.clear();
}

export function scrollToScene(id: SceneId) {
  const st = state.s[id];
  const target = id === 'hero' ? 0 : st.top;
  lenis?.scrollTo(target, { duration: 2.2, easing: easeOutQuart });
}

export const isContactLit = (s: State) => SCENES[s.cur]?.id === 'contact' && s.t > 0.6;
export const isSceneActive = (s: State, id: SceneId) => SCENES[s.cur]?.id === id;
