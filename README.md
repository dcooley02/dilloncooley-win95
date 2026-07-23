# dilloncooley.us

Personal portfolio for [dilloncooley.us](https://dilloncooley.us) — a Windows 95–style desktop shell with professional content and a few classic games.

## Stack

- [Vite](https://vite.dev/)
- [React](https://react.dev/) + TypeScript
- Custom Win95-inspired CSS (no third-party UI kit)

## Features

- Desktop shell: icons, draggable windows, taskbar, Start menu, system clock, boot splash
- About, resume PDF, thesis PDF, and Network Neighborhood (LinkedIn, X, Substack, GitHub)
- Playable Minesweeper and Klondike Solitaire
- Responsive layout for phones and desktops

## Project layout

```
├── index.html
├── public/
│   ├── CNAME                 # dilloncooley.us
│   ├── docs/                 # resume.pdf, thesis.pdf
│   └── favicon.svg
└── src/
    ├── apps/                 # Window contents (About, games, PDFs, …)
    ├── content/site.ts       # Bio, links, notepad copy
    ├── shell/                # Desktop, taskbar, windows, Start menu
    ├── state/                # Window manager
    ├── styles/win95.css
    ├── App.tsx
    └── main.tsx
```

## Local development

```bash
npm install
npm run dev
```

```bash
npm run build    # production bundle → dist/
npm run preview  # serve dist locally
npm run lint
```

## Content

Edit bio, links, and the in-app readme in `src/content/site.ts`.  
Replace PDFs under `public/docs/` as needed.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds the site and publishes `dist/` to **GitHub Pages** on every push to `main` (or via **Run workflow**).

- Custom domain: `public/CNAME` → `dilloncooley.us`
- DNS / CDN: Cloudflare pointing at GitHub Pages

Optional repo settings (GitHub UI): Homepage URL `https://dilloncooley.us`, Pages source **GitHub Actions**.

## License

All rights reserved.
