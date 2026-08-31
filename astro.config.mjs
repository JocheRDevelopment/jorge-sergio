// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TODO: replace with the final production domain once purchased.
  // Cloudflare Pages dev deploy uses its own *.pages.dev URL — override
  // via the PUBLIC_SITE_URL env var at build time on Cloudflare so this
  // stays in sync without a code change (see src/config/site.ts).
  site: process.env.PUBLIC_SITE_URL || 'https://jorge-sergio.pages.dev',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  output: 'static',
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.8,
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-MX' },
      },
      filter: (page) => !page.includes('/gracias/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
