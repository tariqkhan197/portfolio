# Tariq Khan — Scroll-Driven Portfolio

A modern, responsive portfolio showcasing my projects, skills, and passion for building exceptional digital experiences with AI and web technologies.

The site is a **scroll-driven experience**: as you scroll, a pre-rendered frame sequence plays on a canvas, with smooth scrolling and scene transitions tied to your scroll position.

<!-- Add a screenshot or GIF here -->
<!-- ![Portfolio preview](./docs/preview.png) -->

🔗 **Live demo:** _add your deployed link here_

---

## ✨ Features

- 🎞️ Scroll-controlled frame animation rendered on a `<canvas>`
- 🧈 Buttery smooth scrolling powered by Lenis
- 📱 Fully responsive, with separate large (`lg`) and small (`sm`) frame sets for desktop and mobile
- ⚡ Optimized `.webp` frames for fast loading
- 🧩 All content lives in a single data file, so updating the site is easy
- 📦 Static build that can be deployed anywhere

## 🛠️ Tech Stack

- **React** + **TypeScript**
- **Vite** (build tool and dev server)
- **Lenis** (smooth scroll)
- **Canvas API** (frame rendering)

## 📁 Project Structure

```
portfolio/
├── public/
│   └── frames/
│       ├── lg/              # Desktop frames (fNNN.webp)
│       ├── sm/              # Mobile frames (fNNN.webp)
│       └── manifest.json    # Frame manifest
├── src/
│   ├── data.ts              # All portfolio content (edit this!)
│   ├── engine/
│   │   ├── director.ts      # Lenis + scene maths
│   │   └── frames.ts        # Frame loader
│   └── components/
│       └── Stage.tsx        # Canvas + blade
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/tariqkhan197/portfolio.git
cd portfolio

# Install dependencies
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

The static output is generated in the `dist/` folder (base path is `./`, so it can be deployed anywhere).

## ✏️ Customizing Content

All text, projects, skills, and links are managed from **`src/data.ts`**. Edit only this file to update the site.

> Items marked `⚠ EDIT` are not on the résumé (GitHub/LinkedIn URLs, journey years). Replace them with your own details.

## 🎞️ Frames

The scroll animation uses frames stored in `public/frames/`:

- `public/frames/lg/fNNN.webp` — desktop version
- `public/frames/sm/fNNN.webp` — mobile version
- `manifest.json` — describes the frames

The sequence is split into 4 shots by frame range:

| Shot | Frames    |
| ---- | --------- |
| 1    | 0 – 56    |
| 2    | 57 – 118  |
| 3    | 119 – 191 |
| 4    | 192 – 239 |

## 🌐 Deployment

Since the build is fully static, you can deploy the `dist/` folder to any static host:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

## 📬 Contact

**Tariq Khan**

- GitHub: [@tariqkhan197](https://github.com/tariqkhan197)
-
- Email: ta5549611@gmail.com



---

⭐ If you like this project, consider giving it a star!
