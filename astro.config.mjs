import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { deployConfig } from './public/deploy.config.js';
import { satteriBaseLinks, satteriNewTabLinks } from './src/utils/satteri-plugins.mjs';

// Deploy identity (site URL, base path, CMS repo) lives in one place —
// public/deploy.config.js — so a fork edits only that file. Local dev + the
// Decap admin run at the root (BASE_PATH=/ in the dev script) so CMS image
// previews, which don't know about Astro's base, resolve correctly — hence the
// env override, which wins over deployConfig.basePath in dev.
const base = process.env.BASE_PATH ?? deployConfig.basePath;

// Markdown cross-links are authored root-absolute (/slug/). Astro does NOT
// prefix Markdown link hrefs with `base`; satteriBaseLinks rewrites them so
// they resolve under /AtlasOfClimateChange (prod) and / (dev) alike, and
// satteriNewTabLinks opens absolute links in a new tab. Both live in
// src/utils/satteri-plugins.mjs so inline CMS-text rendering shares them.
//
// Sätteri (Astro 7's default Markdown processor) uses a filtered-visitor plugin
// model instead of remark/rehype: `filter` selects tags in Rust, `visit` runs
// per matched node, and mutations go through `ctx.setProperty`.

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: deployConfig.siteUrl,
  base,
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
  markdown: {
    processor: satteri({ hastPlugins: [satteriBaseLinks(base), satteriNewTabLinks()] }),
  },
});
