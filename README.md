# dilloncooley.us

My personal site — Windows 95 desktop with the usual portfolio stuff and a couple of games.

## Stack

Vite, React, TypeScript, custom Win95-style CSS.

## Run locally

```bash
npm install
npm run dev        # localhost only
npm run dev:host   # expose on LAN / Tailscale when needed
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

Production HTML includes a Content-Security-Policy meta tag and a strict referrer policy. For extra browser headers GitHub Pages cannot set (e.g. `X-Content-Type-Options`, `X-Frame-Options` / `frame-ancestors`), add them in Cloudflare **Transform Rules → Modify Response Header** if you want.
