/**
 * UI microcopy for the Atlas — the fixed interface strings that live in code
 * (not the CMS): nav, feed chrome, detail sidebar labels, footer. Single source
 * so the whole interface can be reviewed or translated from one place.
 * CMS-managed text stays in site.json; chapter names/taglines in chapters.json;
 * site title and other SEO metadata in seo.json.
 */
export const ui = {
  a11y: {
    skipToContent: 'Skip to content',
  },

  nav: {
    title: 'Atlas of Climate Change',
    subtitle: 'A Visual Guide to the Science and Data',
    primaryLabel: 'Primary',
    about: 'About',
    downloadPdf: 'Download Atlas in PDF',
    changeLanguage: 'Change language',
    menu: 'Menu',
    closeMenu: 'Close menu',
    languages: 'Languages',
  },

  feed: {
    contents: 'Contents',
    closeContents: 'Close contents',
    tocLabel: 'Table of contents',
    viewMode: 'View mode',
    list: 'List',
    grid: 'Grid',
  },

  detail: {
    back: 'Back to homepage',
    download: 'Download',
    underlyingData: 'Underlying data',
    dataTable: 'Our data table',
    previousInfographic: 'Previous infographic',
    nextInfographic: 'Next infographic',
  },

  about: {
    externalLinks: 'External links',
  },

  notFound: {
    heading: '404',
    subheading: 'Page Submerged',
    homeLabel: 'Back to homepage',
  },

  footer: {
    followUs: 'Follow us on social media',
    downloadPdf: 'Download Atlas in PDF',
    languageLabel: 'Available language versions',
    languageInterest: 'Interested in the Atlas of Climate Change in your own language?',
    getInYourLanguage: 'Get the Atlas in your language',
  },
} as const;
