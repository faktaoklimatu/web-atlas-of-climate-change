# Changelog

## 2026-09-23 — Structure sync with the Czech fork + content matched to the print PDF

Two phases. Phase 1 brought the English fork level with the structural work done on
`web-atlas-klimaticke-zmeny`. Phase 2 matched the content to the print edition.
**Phase 2 is written up as a reusable playbook at the bottom — read that before forking
a new language.**

**Source of text:** `atlas-of-climate-change-online.pdf` — *Atlas of Climate Change:
A Visual Guide to the Science and Data*, second edition, revised and extended
(Fakta o klimatu, Brno, 2026, ISBN 978-80-909942-0-1).

---

### Phase 1 — structure ported from the Czech fork

| # | Change | Files |
| --- | --- | --- |
| 1 | `sources[]` replaces `sourceUrl` + `citation`. One row per source, Font Awesome icons, optional URL. A back-compat shim keeps legacy entries rendering. | `src/content.config.ts`, `src/pages/[slug].astro`, `src/layouts/Layout.astro`, `public/admin/config.yml`, `src/data/ui.ts` |
| 2 | `TeaserImage` deleted. All three feed cards use `CroppedInfographic` with a `rounded` prop, so a card preview shows the same crop as the detail page. | `CroppedInfographic.astro`, `feed/ArticleCard.astro`, `feed/ArticleSmall.astro`, `feed/RelatedCard.astro` |
| 3 | `pdfLinkAttrs()` — `download` for same-origin paths, new tab for absolute URLs (browsers ignore `download` cross-origin). | `src/utils/img.ts`, `Nav.astro`, `feed/SiteFooter.astro` |
| 4 | `satteriExternalLinks` → `satteriNewTabLinks`. Cross-links to other Atlas pages also open in a new tab; in-page `#hash` anchors do not. | `src/utils/satteri-plugins.mjs`, `src/utils/markdown.ts`, `astro.config.mjs` |
| 5 | Publisher logo cell in the footer; the PDF button moved to its own `.footer__download` cell. | `feed/SiteFooter.astro`, `public/images/logo-fakta-o-klimatu.svg` |
| 6 | Infographic PNGs renamed `atlas-_NN.png` → English slug (`atlas-_08.png` → `causes-and-effects-of-climate-change.png`). | `public/images/atlas/`, all 21 content files, `src/data/seo.json` |
| 7 | `CodeIcon.astro` deleted (only consumer was the old `sourceUrl` button). | `src/components/icons/` |

#### Deliberate divergences from the Czech fork — do not "fix" these

- **The footer language block stays live.** Czech comments it out; English keeps the
  switcher and *Get the Atlas in your language*. Because of this, **do not copy the Czech
  `.footer__brand { grid-column: 1 }` / `.footer__legal { grid-column: 2 / 3 }` rules** —
  they exist only to patch the hole the removed cell leaves. English has five cells and
  needs plain auto-flow.
- **The internal About page stays.** `aboutHref` remains `${base}/about/`. Czech repoints
  it at `faktaoklimatu.cz/atlas` in a new tab.
- The footer logo reuses `logo-fakta-o-klimatu.svg` — same publisher, one file.

#### Fixed en route (both pre-existing)

- `seo.json → ogImageFallback` pointed at `/images/atlas/atlas-_01.png`, which is not in
  `public/`. Every social card served a 404. Repointed at the first infographic.
  (The file sits at the stray, unreferenced `src/data/public/images/atlas-_01.png` in both
  forks.)
- `site.json → atlasPdfUrl` pointed at a nonexistent file; a junk
  `ebook_cz_zelenina_kterou_vypestuje_kazdy.pdf` was the only PDF in `public/images/atlas/`.
  Junk deleted, URL blanked — **the nav and footer PDF buttons hide themselves while
  `atlasPdfUrl` is empty**, so set it when the English PDF has a home.

---

### Phase 2 — content matched to the print PDF

Print pagination: **odd pages are infographics, even pages are their text.** Endnotes run
pp. 47–49, numbered 1–52 continuously across the book.

#### What was already correct

The 21 body texts were already verbatim against this edition — bold runs, paragraph breaks,
and endnotes included. Verified by counting footnote definitions per file against the
endnote block of each spread: all 52 endnotes were present, correctly split, and
renumbered per page. **Nothing in the bodies was rewritten.** All 21 titles matched too.

#### What was changed

- **Leads (18 of 21).** The `lead` is the subtitle set under the title on the graphic page.
  Most had drifted into paraphrase — shortened, second sentence dropped, or em-dashed.
  Restored verbatim from the PDF. Three (`causes-and-effects-of-climate-change`,
  `century-of-climate-science`, `co2-concentrations-at-an-800000-year-high`) already matched.
- **Data sources (18 of 21).** `data.sources` populated from the *"Data source: …"* line
  printed bottom-right of each graphic, split one entry per source. URLs are not printed on
  the graphic — they were resolved from the matching endnote (see the table below).
  Three spreads print no data-source line and correctly have none:
  `causes-and-effects-of-climate-change`, `century-of-climate-science`,
  `who-drives-change-state-business-and-people`.
- **Two invented citations removed.** `causes-and-effects-of-climate-change` carried
  `citation: IPCC AR6 Synthesis Report` and `century-of-climate-science` carried
  `citation: Historical review, Fakta o klimatu`. Neither is printed in the Atlas. Removed,
  because the printed graphic is the authority. **Re-add them if editorial wants them** —
  this is the one change in Phase 2 that removes information rather than correcting it.
- **Em-dashes normalised to en-dashes (3 files).** The PDF uses `–` throughout and never
  `—`. Body counts were 96 `–` vs 8 `—`; the 8 were drift.
- **Footer credit.** `site.json → footerLegal` now leads with the PPG credit from the
  colophon (p. 2), mirroring the Czech footer.

#### Source → URL resolution table (reusable; these datasets recur across languages)

| Printed label | URL | From endnote |
| --- | --- | --- |
| NOAA, Global Monitoring Library, Mauna Loa | `https://gml.noaa.gov/ccgg/trends/` | 4, 6, 17 |
| NOAA, Antarctic Ice Cores Revised 800KYr CO₂ Data | `https://www.ncei.noaa.gov/access/paleo-search/study/17975` | 4 |
| Scripps O₂ Program, Mauna Loa Observatory | `https://scrippso2.ucsd.edu/data/mlo.html` | 7 |
| NASA GISTEMP v4 | `https://data.giss.nasa.gov/gistemp/` | 9, 11, 15, 18 |
| IPCC, AR6 WGI | `https://doi.org/10.1017/9781009157896` | 1, 23, 25 |
| IPCC, AR6 WGI SPM | `https://doi.org/10.1017/9781009157896.001` | 2, 30, 32 |
| Osman et al. (2021) | `https://doi.org/10.1038/s41586-021-03984-4` | 14 |
| CSIRO 2017 | `https://www.cmar.csiro.au/sealevel/sl_data_cmar.html` | 26 |
| NASA-SSH | `https://doi.org/10.5067/NSIND-GMSV1` | 27 |
| McKay et al. (2022) | `https://doi.org/10.1126/science.abn7950` | 37, 38 |
| EDGAR 2025 | `https://edgar.jrc.ec.europa.eu/report_2025` | 40, 43, 49, 52 |
| GCB 2025 | `https://doi.org/10.5194/essd-2025-659` | 40, 43, 46 |
| CAT Thermometer | `https://climateactiontracker.org/global/cat-thermometer/` | 47 |
| Eurostat, env-air-gge | `https://doi.org/10.2908/env_air_gge` | 51 |
| UN · IPCC · European Commission | *(no dataset URL — label only)* | — |

#### Print page → slug map (English edition)

| Graphic p. | Text p. | Slug | Chapter / order |
| ---: | ---: | --- | --- |
| 5 | 6 | `causes-and-effects-of-climate-change` | introduction 1 |
| 7 | 8 | `century-of-climate-science` | introduction 2 |
| 9 | 10 | `co2-concentrations-at-an-800000-year-high` | the-science 1 |
| 11 | 12 | `the-changing-balance-of-atmospheric-co2-and-o2` | the-science 2 |
| 13 | 14 | `how-much-is-the-planet-warming` | the-science 3 |
| 15 | 16 | `global-map-of-temperature-changes` | the-science 4 |
| 17 | 18 | `warming-from-last-glacial-period-to-present` | the-science 5 |
| 19 | 20 | `the-direct-link-between-co2-and-temperature` | the-science 6 |
| 21 | 22 | `the-greenhouse-effect-and-energy-imbalance` | the-science 7 |
| 23 | 24 | `accelerating-sea-level-rise` | the-impacts 1 |
| 25 | 26 | `extreme-weather-is-growing-more-severe` | the-impacts 2 |
| 27 | 28 | `map-of-climate-tipping-points` | the-impacts 3 |
| 29 | 30 | `the-thresholds-of-climate-tipping-risks` | the-impacts 4 |
| 31 | 32 | `which-greenhouse-gases-matter-most` | the-trajectory 1 |
| 33 | 34 | `global-emissions-continue-to-grow` | the-trajectory 2 |
| 35 | 36 | `the-carbon-budget-how-much-remains` | the-trajectory 3 |
| 37 | 38 | `projections-of-warming-in-2100` | the-trajectory 4 |
| 39 | 40 | `the-history-of-international-climate-agreements` | the-solutions 1 |
| 41 | 42 | `climate-solutions-across-sectors` | the-solutions 2 |
| 43 | 44 | `the-steady-decline-of-eu-emissions` | the-solutions 3 |
| 45 | 46 | `who-drives-change-state-business-and-people` | the-solutions 4 |

#### Static pages

Both were placeholder stubs. Filled from the copy document *"Drobné texty na web atlasu"*
(Google Docs `1y8rCOVg8kFOye2wWcC1JH6oqCxza4jO1aVVzXdDS21s`), **not** from the PDF:

- `src/content/about/about.md` — *About the Atlas of Climate Change*.
- `src/content/language/language.md` — *Get the Atlas in your language*.

The document interleaves Czech design directions with the English copy
(*"ideálně formou tří ikon…"*, *"Logo PPG?"*). Those are instructions to the designer, not
page text — they were stripped. Two are unbuilt requests, noted under *Still open*.

Both prose containers style `h2 / p / ul / ol / a` only — no `h3` — so the copy is written
at that level. The PDF download link needs no special handling: `satteriNewTabLinks` gives
any root-absolute link `target="_blank"`, which is the "open in a new window" the document
asks for.

#### Still open

- **Drop the final PDF at `public/images/atlas/atlas-of-climate-change-online.pdf`.**
  `atlasPdfUrl` now points there, so the nav, footer, and About-page download links are all
  live — and all three 404 until the file exists. `~/Downloads` holds only comment rounds
  (`…online pripominky PD.pdf`, `…online_corPD.pdf`), so no file was copied in.
- The About page's three benefits are a plain `<ul>`. The copy document asks for **three
  icons**, like the Czech promo page — needs a component and icon assets.
- *Atlas Localisation Guide* on the language page is italic text with no link — no URL yet.
- `site.json → languageVersionsUrl` is still `https://google.com/` — a placeholder.

---

## Playbook — matching a fork's content to its print PDF

Written after doing it for Czech and English. Follow it for Spanish.

### 0. Before you start

Confirm the PDF is the **final** edition. Both the Czech and English runs used the online
export; the print page numbering is what the endnotes and cross-references depend on.

### 1. Lift the text

Body text comes from the **PDF text layer**. **Bold does not** — the Atlas sets bold as
a variable-font instance of Inter that is still named `Inter-Regular` in the PDF, so
poppler merges bold into body text and `pdftohtml` emits no `<b>`. Verified; do not retry
it programmatically.

Read bold off a **rendered page image** instead:

```sh
pdftoppm -r 150 -f N -l N -png atlas.pdf page   # one page at 150 dpi is legible enough
```

**Bold differs between language editions.** Never copy the emphasis from another fork's
markdown — re-read it from that language's own PDF.

### 2. Frontmatter, field by field

- `title` — the H1 on the graphic page, verbatim.
- `lead` — the subtitle under that H1, verbatim, **including the second sentence**. This is
  the field that drifts most: the temptation is to trim it for the card layout. Don't; the
  card handles long leads.
- `image` / `downloads` — `/images/atlas/<slug>.png`. Name PNGs after the slug, not
  `atlas-_NN`. Then a re-export is a pure file swap with no frontmatter edit.
- `data.sources` — the *"Data source: …"* line at the bottom right of the graphic, **split
  one entry per source** (the print line joins them with `;` or `,`). Resolve each URL from
  the endnote that cites the same dataset; reuse the table above. Leave `url` off when no
  dataset link exists — it renders as plain text.
- `order` — position within the chapter, following print order.

### 3. Body conventions

- Endnotes become GFM footnotes, **renumbered from 1 per page**. Print 9 and 10 on a spread
  become `[^1]` and `[^2]` in that file.
- Print cross-references (*"see X on p. 21"*) become markdown links to `/slug/`.
  `satteriNewTabLinks` opens them in a new tab.
- Print-only constructs need a web equivalent, not a transcription:
  *"The text with other tipping points continues on p. 30"* → a link to that page;
  a circular feedback diagram → a linear sentence ending *"and the loop repeats"*.
- Typography: `–` (en dash), never `—`. Straight apostrophes. `°C` with the degree sign.

### 4. Verify — cheap checks that catch real drift

```sh
# every endnote accounted for, correctly split per spread
for f in src/content/infographics/*.md; do
  printf '%-52s %s\n' "$(basename $f .md)" "$(grep -c '^\[\^' $f)"
done
# sum must equal the endnote count in the PDF

grep -oh '—' src/content/infographics/*.md | wc -l    # expect 0
npm run build
# then, in dist/: every local png/svg/pdf href must resolve, and the
# sources list must render on exactly the pages that print one
```

### 5. Language-independent gotchas

- The CMS chapter labels in `public/admin/config.yml` are translated per fork, but the
  `value:` keys (`introduction`, `the-science`, …) **must stay English** — they are the
  content-collection enum in `src/content.config.ts`.
- `public/deploy.config.js` is the only file a fork must edit for deploy identity
  (`siteUrl`, `base`, `lang`, CMS repo). `.firebaserc` needs its own project id.
- Check the artwork for leftovers from the source language before shipping the PNGs —
  see below. Both the Czech and English editions shipped with some.

### 6. Illustrator tooling (`tools/`)

Excluded from typecheck via `tsconfig.json → exclude`, because ExtendScript `.jsx` is not
React and TypeScript chokes on it.

- **`illustrator-rename-artboards.jsx`** — renames artboards to the web slugs, in Atlas
  order, so `File → Export → Export for Screens` emits exactly the filenames in
  `public/images/atlas/`. Refuses to run unless the artboard count matches the name count
  (the list is positional; a single missing artboard would silently shift every name onto
  the wrong graphic), and previews first/last before writing.
  **For a new language: translate the `NAMES` list, keep the order.**
- **`illustrator-fix-artwork.jsx`** — fixes the leftovers listed below. Previews every hit
  and applies nothing until confirmed.

  It replaces **character by character rather than assigning `textFrame.contents`**.
  Assigning `contents` rewrites the frame and flattens per-character formatting; several of
  these strings are half-bold (`**931 Mt CO₂eq** v roce 2024`), so the whole-frame approach
  would destroy the design. The match's first character takes the replacement (inheriting
  its style) and the leftover characters are removed.

  The decimal-comma rule is *one digit after the comma, and no digit after that* — so
  `5,6 °C` → `5.6 °C` while `1,000 Gt`, `800,000 BCE` and `26,000` are untouched. Validated
  against 27 real strings from the PDF, including every thousands-separator trap.

### 7. Artwork issues spotted in the English PDF

Found while reading the pages for bold. These are print-artwork bugs, not web bugs — worth
fixing before the PNGs are re-exported. Everything except the last row is automated by
`tools/illustrator-fix-artwork.jsx`.

| Page | Issue |
| ---: | --- |
| 15 | Map legend reads **"Nedostatečná data"** (Czech) — should be *Insufficient data* |
| 15 | **"Madagaskar"** (Czech spelling) — should be *Madagascar* |
| 15 | Czech decimal commas: `↑ 5,6 °C`, `↑ 1,0 °C`, `↑ 1,5 °C` — others on the same map use dots |
| 43 | **"931 Mt CO₂eq v roce 2024"** — Czech *v roce*, should be *in 2024* |
| 39 | **"COP 3 Kyotu"** — Czech declension, should be *Kyoto* |
| 39 | **"report their emissionsand participate"** — missing space |
| 7 | **"atmosfphere"** — typo for *atmosphere* |
| 11 | **"approximatel 0.04 % CO₂"** — typo for *approximately* |
| 17 | `1.47 ºC` uses the masculine ordinal indicator `º` (U+00BA), not the degree sign `°` — twice |
| 25 | Mixed decimal separators: `+0,3 sd`, `2,4×`, `4,1×`, `5,6×`, `2,8×` vs `1.3×`, `1.7×`, `9.4×` |
| 35 | `Below 2,0 °C` comma, vs `1.5 °C` / `1.7 °C` dots on the same chart |
| 41 | The artwork's subtitle text object is a garbled stale draft — *"…requires different strategies. Most sectors rely on a combination of several strategies rather than a single solutions rather than a single fix."* The visible rendered heading differs. Looks like an old text layer left behind the live one. |
