import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Infographics — the Atlas content model, edited in Decap CMS.
 * One markdown file per infographic; the markdown body is the article text.
 * Chapter metadata (name / tagline / order) lives in src/data/chapters.json.
 */
const infographicsCollection = defineCollection({
  // Content Layer API (Astro 5+): the glob loader replaces the old
  // `type: 'content'`. Entry ids are the filenames (e.g. `accelerating-sea-
  // level-rise`), matching the slugs used by the CMS `related` relations.
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/infographics' }),
  schema: z.object({
    title: z.string(),
    lead: z.string(),
    chapter: z.enum([
      'introduction',
      'the-science',
      'the-impacts',
      'the-trajectory',
      'the-solutions',
    ]),
    order: z.number().default(0),
    image: z.string(), // public path, e.g. /images/atlas/causes-and-effects-of-climate-change.png
    // List of downloadable files (public paths). The button label is derived
    // from each file's extension (e.g. `.pdf` → "PDF"). No longer auto-includes
    // the cover image — every download, PNG included, is added explicitly.
    downloads: z.array(z.string()).optional(),
    data: z
      .object({
        tableUrl: z.string().optional(),
        // Data sources exactly as printed in the bottom-right corner of the
        // infographic ("data source: ..."). One entry per source; `url` is
        // optional — without it the name is printed as plain text.
        sources: z
          .array(z.object({ label: z.string(), url: z.string().optional() }))
          .optional(),
        // Legacy fields, kept for backwards compatibility: when `sources` is
        // missing, a single list entry is built from them.
        sourceUrl: z.string().optional(),
        citation: z.string().optional(),
      })
      .optional(),
    related: z.array(z.string()).optional(),
  }),
});

/**
 * About — single markdown file (CMS: Settings → About Page). Title +
 * markdown body, rendered the same way as an infographic's body.
 */
const aboutCollection = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/about' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

/**
 * Language — single markdown file for the "Get the Atlas in your language"
 * page. Same shape as About. Only surfaced (in the CMS and on the site) on the
 * English fork; see src/pages/get-the-atlas-in-your-language/[...slug].astro.
 */
const languageCollection = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/language' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = {
  infographics: infographicsCollection,
  about: aboutCollection,
  language: languageCollection,
};
