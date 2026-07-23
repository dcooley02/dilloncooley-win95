# dilloncooley.us

My personal site — Windows 95 desktop with the usual portfolio stuff and a couple of games.

## Stack

Vite, React, TypeScript, custom Win95-style CSS.

## Run locally

```bash
npm install
npm run dev
```

```bash
npm run build    # → dist/
npm run preview
```

## Layout

```
public/          # favicon, CNAME, PDFs
src/
  apps/          # window contents
  content/       # bio, links, notepad text
  shell/         # desktop chrome
  state/         # windows
  styles/
```

Bio and links: `src/content/site.ts`  
PDFs: `public/docs/`

## Deploy

Push to `main` → GitHub Actions → GitHub Pages. Domain is `dilloncooley.us` (`public/CNAME`), DNS via Cloudflare.
