// silo.hllmr.com build configuration. Static output only: no adapter, no SSR server.
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import { copyLegacyScreenshots } from "./src/lib/legacy-assets.mjs";

/**
 * The one build-time origin. Every absolute URL the site emits (canonical, og:*, JSON-LD,
 * sitemap, robots.txt, llms.txt) derives from it, so a later domain move is a one-variable change
 * plus the /go/ redirect layer. Must be a bare origin: no path, no trailing slash.
 */
const SITE_URL = process.env.SITE_URL ?? "https://silo.hllmr.com";
const parsed = new URL(SITE_URL);
if (parsed.origin !== SITE_URL) {
  throw new Error(`SITE_URL must be a bare origin like https://silo.hllmr.com (got ${SITE_URL})`);
}

/** SiloAPI origin. Fixed per build; there is deliberately no runtime ?api= override. */
const SILO_API = process.env.PUBLIC_SILO_API ?? "https://silo-api.hllmr.com";
if (new URL(SILO_API).origin !== SILO_API) {
  throw new Error(`PUBLIC_SILO_API must be a bare origin (got ${SILO_API})`);
}

export default defineConfig({
  site: SITE_URL,
  output: "static",
  // `preserve` keeps legacy file URLs byte-for-byte: src/pages/legal/[slug].astro is emitted as
  // legal/privacy-policy.html (and so on), and folder index pages as <dir>/index.html.
  build: {
    format: "preserve",
    inlineStylesheets: "never",
    assets: "_astro",
  },
  trailingSlash: "ignore",
  compressHTML: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  integrations: [svelte(), copyLegacyScreenshots()],
  vite: {
    build: {
      // Never inline scripts or assets as data: URIs; everything is a hashed same-origin file.
      assetsInlineLimit: 0,
    },
  },
  security: {
    // Astro emits a per-page <meta http-equiv="content-security-policy"> with hashes for the
    // scripts and styles it renders. Directives a <meta> policy cannot carry (frame-ancestors)
    // are sent as a response header by the site's nginx config (deploy/silo/nginx.conf).
    csp: {
      directives: [
        "default-src 'self'",
        `connect-src 'self' ${SILO_API} https://api.github.com`,
        `img-src 'self' data: ${SILO_API} https://avatars.githubusercontent.com https://*.githubusercontent.com`,
        "font-src 'self'",
        "media-src 'self'",
        "object-src 'none'",
        "base-uri 'none'",
        "form-action 'none'",
      ],
    },
  },
});
