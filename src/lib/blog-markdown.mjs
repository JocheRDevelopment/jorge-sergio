// Plugins HAST para el cuerpo Markdown de los artículos del blog. Usan la API
// de Sätteri, el procesador de Markdown por defecto de Astro 7 (los
// `rehypePlugins` clásicos exigirían instalar @astrojs/markdown-remark).
// Se registran en astro.config.mjs vía satteri({ hastPlugins }).

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE_HOST = 'jorgesergio.com';

/** Placeholder de anécdota que Jorge todavía no escribe (ver blogPublishGuard). */
export const PLACEHOLDER_PREFIX = '[ANÉCDOTA DE JORGE — PENDIENTE';

function withClass(node, cls) {
  const current = node.properties?.className ?? [];
  return [...(Array.isArray(current) ? current : [current]), cls];
}

/** Envuelve cada <table> en un contenedor con scroll horizontal propio. */
export const tableWrapPlugin = {
  name: 'blog-table-wrap',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      ctx.wrapNode(node, {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-wrap'] },
        children: [],
      });
    },
  },
};

function hasLink(node) {
  return (node.children ?? []).some((child) => child.tagName === 'a' || hasLink(child));
}

/**
 * Tres tipos de blockquote: placeholder pendiente (alerta), callout con
 * enlace (caja CTA) y anécdota o cita (caja de historia).
 */
export const blockquoteKindPlugin = {
  name: 'blog-blockquote-kind',
  element: {
    filter: ['blockquote'],
    visit(node, ctx) {
      const kind = ctx.textContent(node).trim().startsWith(PLACEHOLDER_PREFIX)
        ? 'bq-placeholder'
        : hasLink(node)
          ? 'bq-callout'
          : 'bq-story';
      ctx.setProperty(node, 'className', withClass(node, kind));
    },
  },
};

/** Enlaces absolutos a otros dominios: nueva pestaña, sin nofollow. */
export const externalLinksPlugin = {
  name: 'blog-external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = String(node.properties?.href ?? '');
      if (!/^https?:\/\//i.test(href)) return;
      const host = new URL(href).hostname.replace(/^www\./, '');
      if (host === SITE_HOST || host.endsWith(`.${SITE_HOST}`)) return;
      ctx.setProperty(node, 'target', '_blank');
      ctx.setProperty(node, 'rel', ['noopener']);
    },
  },
};

const imageSizes = new Map();

/**
 * Dimensiones de una imagen de /public referenciada como "/images/...".
 * Por ahora solo SVG (width/height o viewBox); devuelve undefined si no las
 * encuentra. Se resuelve desde process.cwd() porque este módulo también se
 * empaqueta (vía src/lib/blog.ts) y ahí import.meta.url ya no apunta a src/.
 * @param {string} src
 * @returns {{ width: number, height: number } | undefined}
 */
export function publicImageSize(src) {
  if (imageSizes.has(src)) return imageSizes.get(src);
  let size;
  if (/\.svg$/i.test(src)) {
    try {
      const svg = readFileSync(join(process.cwd(), 'public', decodeURI(src)), 'utf-8');
      const root = svg.match(/<svg\b[^>]*>/i)?.[0] ?? '';
      const attr = (name) => Number(root.match(new RegExp(`\\s${name}="([\\d.]+)(?:px)?"`))?.[1]);
      const viewBox = root.match(/\sviewBox="([^"]+)"/)?.[1].trim().split(/[\s,]+/).map(Number);
      const width = attr('width') || viewBox?.[2];
      const height = attr('height') || viewBox?.[3];
      if (width && height) size = { width: Math.round(width), height: Math.round(height) };
    } catch {
      // Archivo inexistente: la imagen se queda sin dimensiones.
    }
  }
  imageSizes.set(src, size);
  return size;
}

/**
 * Imágenes de /public ("/images/..."): Sätteri las deja como <img> simple, sin
 * dimensiones. Se agregan width/height (evita CLS) y carga diferida. Los SVG
 * (diagramas) llevan la clase blog-diagram para limitar su ancho.
 */
export const publicImagePlugin = {
  name: 'blog-public-image',
  element: {
    filter: ['img'],
    visit(node, ctx) {
      const src = String(node.properties?.src ?? '');
      if (!src.startsWith('/') || src.startsWith('//')) return;
      const size = publicImageSize(src);
      if (size) {
        ctx.setProperty(node, 'width', size.width);
        ctx.setProperty(node, 'height', size.height);
      }
      ctx.setProperty(node, 'loading', 'lazy');
      ctx.setProperty(node, 'decoding', 'async');
      if (/\.svg$/i.test(src)) ctx.setProperty(node, 'className', withClass(node, 'blog-diagram'));
    },
  },
};

export const blogHastPlugins = [tableWrapPlugin, blockquoteKindPlugin, externalLinksPlugin, publicImagePlugin];
