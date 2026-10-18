# HLLMR web

Static websites for HLLMR projects, built with [Astro](https://astro.build) and Svelte 5 islands.
Today this repository holds one site, **silo.hllmr.com**, the home of
[Silo](https://github.com/HLLMR/silo), a free, open-source mod manager for Farming Simulator 25.

```
packages/design/   shared design core: tokens, base styles, self-hosted fonts, generic components,
                   and per-site skins (skins/silo.css)
sites/silo/        the silo.hllmr.com site (Astro, static output)
tests/url-contract the public URL contract (every legacy path must keep resolving)
deploy/silo/       proposed nginx config for the site server, reviewed and deployed by infra
scripts/           build checks, redirect generator, artifact packer, fixture API
```

## Working on the site

Requires Node 22.12 or newer (CI uses the version in `.nvmrc`).

```sh
npm ci
npm run dev          # http://localhost:4321
npm test             # build, static checks, URL contract (no Docker needed)
npm run test:contract:nginx   # same contract against the real nginx image (needs Docker)
```

Pages that talk to the Silo catalog read one build-time API origin. To work against local
fixtures instead of the live API:

```sh
npm run fixtures                                  # fixture API on http://127.0.0.1:8787
PUBLIC_SILO_API=http://127.0.0.1:8787 npm run dev
```

## Principles

- **Static only.** No server-side rendering, no adapter. Interactive pieces are Svelte islands.
- **No third parties in the page.** No analytics, trackers, cookies, font CDNs or embeds. Fonts
  (Fraunces, Hanken Grotesk, JetBrains Mono; SIL OFL) are bundled. Every page carries a strict
  Content-Security-Policy generated at build time; `npm test` fails on any inline script or style
  the policy does not cover.
- **One origin setting.** Every absolute URL comes from `SITE_URL` (default
  `https://silo.hllmr.com`), so moving the site is a one-variable change.
- **Stable links.** Old URLs never break: `tests/url-contract/silo.urls.json` lists every public
  path, and CI checks each one. Outside links (the app, the Discord bot, docs) use the redirect
  layer in `sites/silo/redirects.json`: `/go/<key>` and `/discord`. Keys never change; targets can.
- **Write once.** Features, FAQ and screenshots live in `sites/silo/src/content/` and feed the
  page, the structured data and `llms.txt`.
- **Pinned dependencies.** Exact versions only (`.npmrc` sets `save-exact`).

## Releases

On `main`, `.github/workflows/release-silo.yml` builds the site, runs every check in strict mode,
and publishes a GitHub Release tagged `silo-site/<date>-<id>` with `site-<id>.tar.gz`,
`SHA256SUMS` and `ARTIFACT.json`. The id is derived from the content, so an unchanged rebuild is
not republished. The hosting side pulls these assets and switches releases atomically; nothing in
this repository deploys to a server or holds a deploy credential.

`deploy/silo/redirects.conf` is generated: edit `sites/silo/redirects.json`, then run
`npm run gen:redirects` and commit both.

## License

Code is MIT licensed (see `LICENSE`). Site content, text, screenshots and the Silo name and
marks are © HLLMR Ventures LLC. Silo is not affiliated with GIANTS Software.
