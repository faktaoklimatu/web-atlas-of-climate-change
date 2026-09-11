// ─── Fork configuration ───────────────────────────────────────────────
// The ONLY file you edit when forking this Atlas to a new language version
// / deployment. Read by the build (astro.config.mjs) and by the CMS admin
// (public/admin/index.html). Nothing here is secret — every value is public.
export const deployConfig = {
  // Full origin where THIS site is served (no trailing slash, no path).
  // Drives canonical URLs, Open Graph tags and the sitemap.
  siteUrl: 'https://atlasofclimatechange.org',

  // Path the site is served under:
  //   '/'          → custom domain at the root
  //   '/RepoName'  → GitHub Pages project site (must match the repo name)
  basePath: '/',

  // Language of THIS fork (ISO code, e.g. 'en', 'cs'). Sets <html lang> and
  // og:locale. One value per fork — the site is single-language.
  lang: 'en',

  // Decap CMS GitHub backend (admin login + content writes).
  cms: {
    repo: 'hiiampadik/AtlasOfClimateChange', // '<owner>/<repo>'
    branch: 'master',
    // OAuth broker for "Login with GitHub". Reuse the shared default,
    // or deploy your own — see README, "Creating a new language version".
    oauthBaseUrl: 'https://decap-oauth.brona-musil.workers.dev',
  },
};
