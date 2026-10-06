// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

// ¿Hay al menos un artículo publicado (draft: false)? Mientras no lo haya,
// /blog/ se genera con noindex y se excluye del sitemap. Mismo criterio que
// la colección: se ignoran archivos que empiezan con "_".
const blogDir = new URL('./src/content/blog/', import.meta.url);
const hasPublishedPosts =
  existsSync(blogDir) &&
  readdirSync(blogDir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .some((f) => /^draft:\s*false\s*$/m.test(readFileSync(new URL(f, blogDir), 'utf-8')));

// https://astro.build/config
export default defineConfig({
  // Dominio de producción definitivo. Es la única fuente de verdad: canonical,
  // Open Graph, JSON-LD, robots.txt, llms.txt y sitemap se derivan de aquí
  // (vía Astro.site / import.meta.env.SITE). No se lee de una env var a
  // propósito, para que ningún build — ni los previews — publique otro host.
  site: 'https://jorgesergio.com',
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
      filter: (page) =>
        !page.includes('/gracias/') && (hasPublishedPosts || !page.endsWith('/blog/')),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
