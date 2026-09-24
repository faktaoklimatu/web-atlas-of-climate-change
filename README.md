# Atlas of Climate Change

A visual guide to the science and data behind climate change, for
[Fakta o Klimatu](https://faktaoklimatu.cz). Static site built with **Astro 7**
and edited through **Decap CMS** (Git-based, GitHub backend). Deployed to GitHub
Pages.

## Requirements

- Node **>= 22.12**
- npm

## Getting started

```bash
npm install
npm run dev      # dev server at http://localhost:4321/  (base path "/")
```

- `npm run dev` / `npm start` — runs the Astro dev server (`BASE_PATH=/`, so the
  Decap admin and CMS image previews resolve at the root) together with the
  Decap `local_backend` proxy (`decap-server`), via `concurrently`.
- `npm run dev:astro` — Astro dev server only, without the CMS proxy.
- `npm run build` — production build into `dist/` (site URL + base path come from
  `public/deploy.config.js`; default base `/AtlasOfClimateChange`).
- `npm run preview` — serve the production build locally.

The CMS admin lives at `/admin/` (`public/admin/`). `local_backend: true` in
`config.yml` makes it read/write the local file system during development —
but only while `decap-server` (started by `npm run dev`) is running. If that
proxy isn't running, the CMS silently falls back to the GitHub backend
instead of local files.

## Project structure

```
public/
  deploy.config.js  Per-fork deploy identity (site URL, base path, language, CMS repo/branch/OAuth)
  admin/            Decap CMS (index.html + config.yml)
  images/atlas/     Infographic images (managed by the CMS)
src/
  pages/
    index.astro     Homepage feed (chapters → infographics, grid/list, TOC)
    [slug].astro    Infographic detail page (dynamic)
    about.astro     About page (static, CMS-edited content)
    get-the-atlas-in-your-language/  "Get the Atlas in your language" page (English fork only)
    robots.txt.ts   robots.txt endpoint (points at the generated sitemap)
  layouts/Layout.astro   Base HTML + all SEO tags (meta, canonical, OG/Twitter, hreflang)
  components/        Nav, FancyBar, Button, Tag, CroppedInfographic, feed/*, icons/*
  scripts/           Page JS as ES modules (scroll-spy, overlays, nav)
  data/
    chapters.ts      Chapter interface + name lookup (loads chapters.json)
    chapters.json    CMS-managed chapter names / taglines / order
    infographics.ts  Feed assembly from the CMS collection
    ui.ts            All fixed UI microcopy (labels, buttons, aria-labels)
    site.json        CMS-managed external links (About sidebar), language switcher + footer
    seo.json         CMS-managed site title, default description, social share image
  content/infographics/   Markdown content (Decap collection)
  content/about/about.md  About page title + body (single-file Decap collection)
  content/language/language.md  "Get the Atlas in your language" page (English fork only)
  content.config.ts       Collection schemas
  utils/seo.ts       absoluteUrl() / truncate() helpers used by Layout.astro
  utils/markdown.ts  renderInlineMarkdown() — inline Markdown for short CMS fields (footer legal line)
  utils/satteri-plugins.mjs  shared Sätteri link plugins (base + external), used by config + markdown.ts
  styles/            tokens.css, typography.css, global.css
```

`@astrojs/sitemap` (configured in `astro.config.mjs`) generates `sitemap-index.xml`/
`sitemap-0.xml` at build time from every prerendered page (excluding `/404/`).

Deployment is automated: pushing to `main`/`master` runs
`.github/workflows/deploy.yml`, which builds the site and publishes it to
GitHub Pages.

## Editing content

- **Infographics** — CMS *Infographics* collection (`src/content/infographics/`).
- **About page** — CMS *About Page* collection (`src/content/about/about.md`).
- **Get the Atlas in your language** — CMS *Get the Atlas in your language*
  collection (`src/content/language/language.md`). Only present on the English
  fork (`deploy.config.js` `lang: 'en'`); there the footer's "Get the Atlas in
  your language" link points at this page. On any other fork the collection is
  hidden and that footer link goes to the external `languageVersionsUrl` from
  *Settings → Navigation* instead.
- **Navigation & languages** — CMS *Settings → Navigation & Languages*
  (`src/data/site.json`). The language switcher reads from here, and the
  "External links" box in the About page's sidebar reads from `menuLinks`.
- **Chapter names / taglines** — CMS *Settings → Chapters* (`src/data/chapters.json`).
  Translate the name and tagline; keep each chapter's `id` unchanged (it links
  infographics to their chapter).
- **SEO** — CMS *Settings → SEO* (`src/data/seo.json`): site title, default meta
  description, default social share image, and the page language code
  (`<html lang>`). Per-page descriptions/images come from existing content
  where possible (an infographic's `lead`/`image`, the About page's own
  `description` field) and only fall back to these defaults.
- **Fixed interface text** (labels, buttons, aria-labels) — `src/data/ui.ts`.

## Creating a new language version (fork)

Each language is its **own repository and its own deployment**. To spin up a new
mutation on your GitHub account:

1. **Fork this repository** to your GitHub account (or use *Use this template* /
   create a new repo from a copy). Give it a clear name, e.g.
   `AtlasOfClimateChange-DE`.

2. **Edit `public/deploy.config.js`** — the **single** file that holds your
   deployment's identity. The build (`astro.config.mjs`) and the CMS admin both
   read it, so nothing else needs changing to point the site and CMS at your repo:

   | Value | Set it to |
   |---|---|
   | `siteUrl` | The full origin your site is served from — `https://<user>.github.io` (GitHub Pages) or `https://your-domain.tld` (custom domain). Drives canonical URLs, Open Graph tags, and the sitemap. |
   | `basePath` | `/` for a custom domain at the root, or `/<your-repo-name>` for a GitHub Pages *project* site (must match the repo name). |
   | `lang` | Your fork's ISO language code (`en`, `cs`, …). Sets `<html lang="…">` and `og:locale`. |
   | `cms.repo` | `<your-user>/<your-repo-name>` — where the CMS reads and writes content. |
   | `cms.branch` | Your default branch (`main` or `master`). |
   | `cms.oauthBaseUrl` | The OAuth proxy for CMS "Login with GitHub" — see below. |

   Because this is the only file a fork edits (besides CMS content), pulling later
   improvements from upstream **won't cause merge conflicts** — upstream almost
   never touches `deploy.config.js`, and it never touches `astro.config.mjs` or
   `public/admin/config.yml` for deploy identity anymore.

   > Custom domain: also add a `public/CNAME` file containing just your domain
   > (e.g. `atlas.example.org`), so GitHub Pages serves the site there.

3. **Set up CMS login (OAuth proxy).** Decap's GitHub backend logs editors in
   through a small, **stateless OAuth broker** — it holds no data and no
   repository access; it only brokers the GitHub login and hands the resulting
   token to the browser. Which repo gets written to is decided by `cms.repo`
   above, not by the proxy. Two options:
   - **Run your own (required).** `cms.oauthBaseUrl` ships **empty**, so CMS
     login is not wired up out of the box. Deploy a Decap OAuth proxy tied to a
     **GitHub OAuth App you create** — this repo ships one in `oauth-worker/`
     (Cloudflare Worker + `wrangler.toml`) — then put its origin in
     `cms.oauthBaseUrl`. Each editor then logs in as their own GitHub user
     (needs push access to your repo) and writes only to your `cms.repo`.
     See Decap's *GitHub backend* docs for alternatives.

   Until a proxy is available you can still edit content locally with
   `local_backend: true` (run `npm run dev`), or commit Markdown directly on GitHub.

4. **Translate.** Replace the English text with your language:
   - `src/data/ui.ts` — all interface strings.
   - CMS *Settings → Chapters* (`src/data/chapters.json`) — chapter names and
     taglines (keep the `id`s unchanged).
   - `src/content/infographics/*.md` — titles, leads, and bodies (and swap in
     translated images under `public/images/atlas/` if needed).
   - `src/data/site.json` — the About page's external links, and the **language switcher links**:
     add an entry pointing back to every other language version so visitors can
     move between them. Set each entry's `hreflang` to its ISO language code
     (e.g. `en`, `cs`) — that's what drives the `hreflang` SEO tags, separate
     from `code`, which is just the switcher's display label.
   - CMS *Settings → SEO* (`src/data/seo.json`) — site title, default meta
     description, and social share image. (The page language `<html lang="…">`
     is set once in `public/deploy.config.js`'s `lang`, above.)

5. **Enable GitHub Pages.** In the fork's *Settings → Pages*, set the source to
   **GitHub Actions**. Pushing to the default branch then builds and deploys via
   the included workflow; your site appears at
   `https://<your-user>.github.io/<your-repo-name>/`.

6. **Cross-link the versions.** Once live, add the new site's URL to the
   `languages` list of every other language version (via their CMS *Settings →
   Navigation & Languages*) so the switcher lists it everywhere.
