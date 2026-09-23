// Shared Sätteri (Astro 7 Markdown) HAST plugins, used by both the build
// config (astro.config.mjs) and inline string rendering (markdown.ts) so link
// handling can't drift between Markdown bodies and CMS text fields.

// Prefix Markdown-authored root-absolute links (/slug/) with the deploy base so
// they resolve under /AtlasOfClimateChange (prod) and / (dev) alike. Astro does
// not do this for Markdown link hrefs.
export function satteriBaseLinks(prefix) {
  const clean = prefix.replace(/\/$/, ''); // '' when base is '/'
  return {
    name: 'satteri-base-links',
    element: {
      filter: ['a'],
      visit(node, ctx) {
        if (!clean) return;
        const href = node.properties?.href;
        if (
          typeof href === 'string' &&
          href.startsWith('/') &&
          !href.startsWith('//') &&
          !href.startsWith(clean + '/')
        ) {
          ctx.setProperty(node, 'href', clean + href);
        }
      },
    },
  };
}

// Open links in a new tab: external ones (absolute http(s) or
// protocol-relative) and cross-links to another page of the Atlas, so a
// reader following one never loses their place in the text they were reading.
// In-page anchors (footnote refs and back-refs, #hash) stay in this tab.
export function satteriNewTabLinks() {
  return {
    name: 'satteri-new-tab-links',
    element: {
      filter: ['a'],
      visit(node, ctx) {
        const href = node.properties?.href;
        if (typeof href !== 'string') return;
        const isExternal = /^https?:\/\//.test(href) || href.startsWith('//');
        const isCrossLink = href.startsWith('/'); // another Atlas page
        if (isExternal || isCrossLink) {
          ctx.setProperty(node, 'target', '_blank');
          ctx.setProperty(node, 'rel', 'noopener noreferrer');
        }
      },
    },
  };
}
