// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { satteri } from '@astrojs/markdown-satteri';
import { blogHastPlugins } from './src/lib/blog-markdown.mjs';

// Dominio de producción definitivo (ver el comentario de `site` abajo).
const SITE = 'https://jorgesergio.com';

// Artículos del blog con draft: false. Mismo criterio que la colección: se
// ignoran archivos que empiezan con "_".
const blogDir = new URL('./src/content/blog/', import.meta.url);
const publishedPosts = existsSync(blogDir)
  ? readdirSync(blogDir)
      .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
      .map((f) => ({ file: f, source: readFileSync(new URL(f, blogDir), 'utf-8') }))
      .filter(({ source }) => /^draft:\s*false\s*$/m.test(source))
  : [];

// Mientras no haya artículos publicados, /blog/ se genera con noindex y se
// excluye del sitemap.
const hasPublishedPosts = publishedPosts.length > 0;

// <lastmod> de cada artículo publicado en el sitemap: updatedDate o pubDate.
/** @type {(source: string, key: string) => string | undefined} */
const frontmatterField = (source, key) =>
  source.match(new RegExp(`^${key}:\\s*["']?([^"'\\r\\n]+?)["']?\\s*$`, 'm'))?.[1];
const postLastmod = new Map(
  publishedPosts.map(({ file, source }) => [
    `${SITE}/blog/${frontmatterField(source, 'pillar')}/${file.replace(/\.md$/, '')}/`,
    // pubDate es obligatorio en el schema de la colección.
    new Date(/** @type {string} */ (frontmatterField(source, 'updatedDate') ?? frontmatterField(source, 'pubDate'))).toISOString(),
  ])
);

// Hace fallar `astro build` si un artículo publicado conserva placeholders
// de anécdota. Para inspeccionar el HTML de un borrador con placeholders se
// puede saltar con SKIP_BLOG_GUARD=1 (solo para revisión local, nunca en CI).
const PLACEHOLDER_MARKERS = ['ANÉCDOTA DE JORGE — PENDIENTE', 'PENDIENTE]'];

/** @returns {import('astro').AstroIntegration} */
function blogPublishGuard() {
  return {
    name: 'blog-publish-guard',
    hooks: {
      'astro:config:setup': ({ command, logger }) => {
        if (command !== 'build') return;
        if (process.env.SKIP_BLOG_GUARD === '1') {
          logger.warn('SKIP_BLOG_GUARD=1: se omite la revisión de placeholders.');
          return;
        }
        const problems = publishedPosts.flatMap(({ file, source }) =>
          source.split(/\r?\n/).flatMap((line, i) =>
            PLACEHOLDER_MARKERS.some((m) => line.includes(m))
              ? [`  src/content/blog/${file}:${i + 1}  ${line.trim().slice(0, 80)}`]
              : []
          )
        );
        if (problems.length) {
          throw new Error(
            `Hay artículos con draft: false que todavía tienen placeholders pendientes:\n${problems.join('\n')}\n` +
              'Completa el texto o regresa el artículo a draft: true.'
          );
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  // Dominio de producción definitivo. Es la única fuente de verdad: canonical,
  // Open Graph, JSON-LD, robots.txt, llms.txt y sitemap se derivan de aquí
  // (vía Astro.site / import.meta.env.SITE). No se lee de una env var a
  // propósito, para que ningún build — ni los previews — publique otro host.
  site: SITE,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  output: 'static',
  markdown: {
    processor: satteri({ hastPlugins: blogHastPlugins }),
  },
  integrations: [
    blogPublishGuard(),
    sitemap({
      changefreq: 'monthly',
      priority: 0.8,
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-MX' },
      },
      filter: (page) =>
        !page.includes('/gracias/') && (hasPublishedPosts || !page.endsWith('/blog/')),
      serialize: (item) => {
        const lastmod = postLastmod.get(item.url);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
