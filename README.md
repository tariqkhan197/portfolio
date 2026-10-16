# Tariq Khan — scroll-driven portfolio

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/ (base './', deployable anywhere)
```

- **Content:** edit `src/data.ts` only. Items marked `⚠ EDIT` aren't on the résumé (GitHub/LinkedIn URLs, journey years).
- **Frames:** `public/frames/{lg,sm}/fNNN.webp` + `manifest.json` (4 shots: 0–56, 57–118, 119–191, 192–239).
- **Engine:** `src/engine/director.ts` (Lenis + scene maths), `frames.ts` (loader), `components/Stage.tsx` (canvas + blade).
