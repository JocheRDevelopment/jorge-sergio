// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { satteri } from '@astrojs/markdown-satteri';
import { blogHastPlugins } from './src/lib/blog-markdown.mjs';

// Dominio de producción definitivo (ver el comentario de `site` abajo).
const SITE = 'https://jorgesergio.com';

// Artículos del blog (borradores incluidos) y los que tienen draft: false.
// Mismo criterio que la colección: se ignoran archivos que empiezan con "_".
const blogDir = new URL('./src/content/blog/', import.meta.url);
const allPosts = existsSync(blogDir)
  ? readdirSync(blogDir)
      .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
      .map((f) => ({ file: f, source: readFileSync(new URL(f, blogDir), 'utf-8') }))
  : [];
const publishedPosts = allPosts.filter(({ source }) => /^draft:\s*false\s*$/m.test(source));

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

// Hace fallar `astro build` si un artículo publicado:
//  1. conserva placeholders de anécdota. Para inspeccionar el HTML de un
//     borrador con placeholders se puede saltar con SKIP_BLOG_GUARD=1 (solo
//     para revisión local, nunca en CI);
//  2. enlaza a una ruta /blog/... que no se va a generar (no existe o el
//     artículo destino sigue en draft: true). Esta revisión no se puede saltar.
const PLACEHOLDER_MARKERS = ['ANÉCDOTA DE JORGE — PENDIENTE', 'PENDIENTE]'];

/** Rutas /blog/... que genera el build: índice, pilares con artículos publicados y artículos publicados. */
const postRoute = (/** @type {{ file: string, source: string }} */ { file, source }) =>
  `/blog/${frontmatterField(source, 'pillar')}/${file.replace(/\.md$/, '')}/`;
const blogRoutes = new Set([
  '/blog/',
  ...publishedPosts.map(({ source }) => `/blog/${frontmatterField(source, 'pillar')}/`),
  ...publishedPosts.map(postRoute),
]);

/** Enlaces Markdown o HTML a /blog/... (relativos o con el dominio del sitio). */
const BLOG_LINK_RE = new RegExp(
  String.raw`(?:\]\(|href=["'])(?:${SITE.replace(/[.]/g, '\\.')})?(\/blog\/[^)\s"'#?]*)`,
  'g'
);

/** @type {(route: string) => string} */
function brokenLinkReason(route) {
  const slug = route.split('/').filter(Boolean)[2];
  const target = slug && allPosts.find(({ file }) => file === `${slug}.md`);
  if (!target) return 'la ruta no existe';
  if (!publishedPosts.includes(target)) return `el artículo destino (src/content/blog/${target.file}) está en draft: true`;
  return `el artículo está en ${postRoute(target)}`;
}

/** @returns {import('astro').AstroIntegration} */
function blogPublishGuard() {
  return {
    name: 'blog-publish-guard',
    hooks: {
      'astro:config:setup': ({ command, logger }) => {
        if (command !== 'build') return;

        const skipPlaceholders = process.env.SKIP_BLOG_GUARD === '1';
        if (skipPlaceholders) logger.warn('SKIP_BLOG_GUARD=1: se omite la revisión de placeholders.');

        /** @type {string[]} */
        const placeholders = [];
        /** @type {string[]} */
        const brokenLinks = [];
        for (const { file, source } of publishedPosts) {
          source.split(/\r?\n/).forEach((line, i) => {
            const where = `  src/content/blog/${file}:${i + 1}`;
            if (!skipPlaceholders && PLACEHOLDER_MARKERS.some((m) => line.includes(m))) {
              placeholders.push(`${where}  ${line.trim().slice(0, 80)}`);
            }
            for (const [, link] of line.matchAll(BLOG_LINK_RE)) {
              const route = link.endsWith('/') ? link : `${link}/`;
              if (!blogRoutes.has(route)) brokenLinks.push(`${where}  ${link}  → ${brokenLinkReason(route)}`);
            }
          });
        }

        const errors = [
          placeholders.length &&
            `Hay artículos con draft: false que todavía tienen placeholders pendientes:\n${placeholders.join('\n')}\n` +
              'Completa el texto o regresa el artículo a draft: true.',
          brokenLinks.length &&
            `Hay artículos con draft: false que enlazan a rutas del blog que no se van a generar:\n${brokenLinks.join('\n')}\n` +
              'Publica primero el artículo destino, corrige el enlace o regresa este artículo a draft: true.',
        ].filter(Boolean);
        if (errors.length) throw new Error(errors.join('\n\n'));
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
