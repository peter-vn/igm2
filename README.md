# Idle Guild Master: Circle 2 (C2-0.17)

Static web build, no build step. Deploy the repo root on Cloudflare Pages
(Framework preset: None, build command: empty, output directory: `/`).

CLI: `npx wrangler pages deploy . --project-name igm-circle2`

## Required file not in git history of this export
`img/sprites-bdb3dfd5.wasm` (4.4 MB) must be copied from the Circle 2 artifact
into `img/` before deploying. The game's sprites will not load without it.

## Files
- index.html, sw.js, data-c672d95f.json: game, service worker (cache `igm-c2-c672d95f-b28a0f`), data
- manifest.webmanifest, icon-*.png, img/: PWA assets and sprites
- _headers: no-cache for index/sw, wasm content type
