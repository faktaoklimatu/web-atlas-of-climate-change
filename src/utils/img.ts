/**
 * Build the URL for an atlas image, honouring Astro's `base`.
 * Accepts either a public path stored by the CMS (`/images/atlas/x.png`)
 * or a bare filename (`x.png`).
 */
export function imgUrl(image: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return image.startsWith('/') ? `${base}${image}` : `${base}/images/atlas/${image}`;
}

/**
 * Link attributes for the Atlas PDF (CMS: Settings → Navigation).
 * A stored path (`/images/atlas/x.pdf`) is served by this site, so prefix
 * `base` and let the browser save the file. An absolute URL lives on another
 * origin, where `download` is ignored by every browser — open it in a new tab
 * instead, rather than navigating the reader away from the Atlas.
 */
export function pdfLinkAttrs(url: string) {
  if (/^https?:\/\//.test(url)) {
    return { href: url, target: '_blank', rel: 'noopener noreferrer' };
  }
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return { href: `${base}${url}`, download: true };
}
