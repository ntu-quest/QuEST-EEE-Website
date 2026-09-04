// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/* The canonical URL follows wherever the site is deployed, so sitemap and
   canonical tags are right on a Vercel preview, on production, and on GitHub
   Pages without anyone editing this file:
     SITE_URL                        set it explicitly (a custom domain)
     VERCEL_PROJECT_PRODUCTION_URL   Vercel sets this on every build
   BLUEPRINT §15: a custom domain is a redirect away. */
const site =
  process.env.SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://quest-eee.github.io');

export default defineConfig({
  site,
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'auto' },
  image: { responsiveStyles: true },
});
