import { useEffect, useLayoutEffect, useRef } from 'react';
import { subscribe, onIntro, type State } from './director';

/** Fixed layers created outside React's tree so scenes can portal into them
 *  (sticky sections create stacking contexts, so back elements can't live inside them). */
function makeLayer(cls: string) {
  const el = document.createElement('div');
  el.className = cls;
  el.setAttribute('aria-hidden', 'true');
  return el;
}
export const layers = {
  back: makeLayer('layer-back'),
  front: makeLayer('layer-front'),
};
export function mountLayers() {
  const root = document.getElementById('root')!;
  document.body.insertBefore(layers.back, root);
  document.body.insertBefore(layers.front, root);
}

/** Subscribe to the director. The callback mutates DOM via refs; never sets state. */
export function useDirector(fn: (s: State) => void) {
  const ref = useRef(fn);
  ref.current = fn;
  useLayoutEffect(() => subscribe((s) => ref.current(s)), []);
}

export function useIntro(fn: () => void) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => onIntro(() => ref.current()), []);
}

export const isTouch = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;

/** Shared normalised mouse position, -1..1 */
export const mouse = { x: 0, y: 0, px: -100, py: -100 };
window.addEventListener('pointermove', (e) => {
  mouse.px = e.clientX; mouse.py = e.clientY;
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
}, { passive: true });
