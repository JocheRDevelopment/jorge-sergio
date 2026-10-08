// Plugins HAST para el cuerpo Markdown de los artículos del blog. Usan la API
// de Sätteri, el procesador de Markdown por defecto de Astro 7 (los
// `rehypePlugins` clásicos exigirían instalar @astrojs/markdown-remark).
// Se registran en astro.config.mjs vía satteri({ hastPlugins }).

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

export const blogHastPlugins = [tableWrapPlugin, blockquoteKindPlugin, externalLinksPlugin];
