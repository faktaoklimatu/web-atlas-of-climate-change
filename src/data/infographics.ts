/**
 * Feed data assembled from the Decap `infographics` collection, grouped by the
 * fixed chapters in chapters.ts. Replaces the old hand-written atlas.ts.
 */
import { getCollection } from 'astro:content';
import { chapterMeta } from './chapters';

export interface FeedInfographic {
  slug: string;
  title: string;
  lead: string;
  image: string; // public path, e.g. /images/atlas/causes-and-effects-of-climate-change.png
  chapterId: string;
}

export interface FeedChapter {
  id: string;
  name: string;
  tagline: string;
  subheading?: string;
  infographics: FeedInfographic[];
}

/** Chapters (in order), each with its infographics sorted by `order`. Empty
 *  chapters are dropped so the nav only lists sections that have content. */
export async function getChapters(): Promise<FeedChapter[]> {
  const entries = await getCollection('infographics');
  return [...chapterMeta]
    .sort((a, b) => a.order - b.order)
    .map((ch) => ({
      id: ch.id,
      name: ch.name,
      tagline: ch.tagline,
      subheading: ch.subheading,
      infographics: entries
        .filter((e) => e.data.chapter === ch.id)
        .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
        .map((e) => ({
          slug: e.id,
          title: e.data.title,
          lead: e.data.lead,
          image: e.data.image,
          chapterId: ch.id,
        })),
    }))
    .filter((ch) => ch.infographics.length > 0);
}

/** Flat, ordered list across all chapters — handy for prev/next and lookups. */
export async function getFlatInfographics(): Promise<FeedInfographic[]> {
  const chapters = await getChapters();
  return chapters.flatMap((ch) => ch.infographics);
}
