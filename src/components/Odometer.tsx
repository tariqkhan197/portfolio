import { forwardRef, useImperativeHandle, useRef } from 'react';
import { smoothstep } from '../engine/director';

export type OdometerHandle = { set: (v: number) => void };

const CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

/** Mechanical odometer: each column is a strip 0–9,0. The lowest wheel snaps
 *  with smoothstep(.55, 1); higher wheels only move while every lower wheel
 *  is rolling over from 9. Driven imperatively (no React re-render). */
const Odometer = forwardRef<OdometerHandle, { digits: number; initial?: number; className?: string }>(
  function Odometer({ digits, initial = 0, className = '' }, ref) {
    const cols = useRef<(HTMLSpanElement | null)[]>([]);
    const last = useRef(-1);

    useImperativeHandle(ref, () => ({
      set(v: number) {
        const fl = Math.floor(v);
        const L = fl + smoothstep(0.55, 1, v - fl);
        if (Math.abs(L - last.current) < 1e-4) return;
        last.current = L;
        for (let k = 0; k < digits; k++) {
          const unit = Math.pow(10, k);
          let pos: number;
          if (k === 0) pos = ((L % 10) + 10) % 10;
          else {
            const rem = L % unit;
            const carry = rem > unit - 1 ? rem - (unit - 1) : 0;
            pos = (Math.floor(L / unit) % 10) + carry;
          }
          const el = cols.current[digits - 1 - k];
          if (el) el.style.transform = `translate3d(0,${(-pos * 100) / 11}%,0)`;
        }
      },
    }), [digits]);

    const init = String(Math.floor(initial)).padStart(digits, '0');
    return (
      <span className={`odo ${className}`} aria-hidden="true">
        {Array.from({ length: digits }, (_, i) => (
          <span className="odo__win" key={i}>
            <span
              className="odo__col"
              ref={(el) => (cols.current[i] = el)}
              style={{ transform: `translate3d(0,${(-Number(init[i]) * 100) / 11}%,0)` }}
            >
              {CELLS.map((d, j) => <span key={j}>{d}</span>)}
            </span>
          </span>
        ))}
      </span>
    );
  },
);
export default Odometer;
