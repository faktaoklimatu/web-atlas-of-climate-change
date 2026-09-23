import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import { satteriBaseLinks, satteriNewTabLinks } from './satteri-plugins.mjs';

const base = import.meta.env.BASE_URL;

const processor = await createSatteriMarkdownProcessor({
  hastPlugins: [satteriBaseLinks(base), satteriNewTabLinks()],
});

/**
 * Render a short CMS text field (footer legal line, etc.) as inline HTML so
 * editors can add links, emails, and URLs with plain Markdown. Reuses the same
 * Sätteri pipeline as Markdown bodies, so bare emails autolink to `mailto:` and
 * links get the same base/new-tab handling. A single-paragraph result is
 * unwrapped (the caller supplies its own block element); multi-paragraph text
 * is returned as-is.
 */
export async function renderInlineMarkdown(text?: string): Promise<string> {
  if (!text) return '';
  const { code } = await processor.render(text);
  const single = code.trim().match(/^<p>([\s\S]*)<\/p>$/);
  return single && !single[1].includes('<p>') ? single[1] : code;
}
