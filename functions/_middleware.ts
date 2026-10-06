/**
 * Cloudflare Pages Functions middleware.
 *
 * - Host de producción de Pages (`jorge-sergio.pages.dev`) → 301 a
 *   https://jorgesergio.com conservando ruta y query string.
 * - Previews de rama/commit (`<hash>.jorge-sergio.pages.dev`,
 *   `<rama>.jorge-sergio.pages.dev`) → se sirven normal, con
 *   `X-Robots-Tag: noindex` para que Google no los indexe.
 * - Cualquier otro host (jorgesergio.com) → pasa sin tocar.
 *
 * `_redirects` no sirve aquí porque no puede filtrar por host.
 */

// Tipos mínimos para no depender de @cloudflare/workers-types.
interface PagesContext {
  request: Request;
  next: () => Promise<Response>;
}

const CANONICAL_ORIGIN = 'https://jorgesergio.com';

// Se incluyen ambos nombres de proyecto por si el sitio vive en cualquiera.
const PAGES_HOSTS = ['jorge-sergio.pages.dev', 'jorge-sergio-ramirez.pages.dev'];

export const onRequest = async ({ request, next }: PagesContext): Promise<Response> => {
  const url = new URL(request.url);
  const host = url.hostname;

  if (PAGES_HOSTS.includes(host)) {
    return Response.redirect(`${CANONICAL_ORIGIN}${url.pathname}${url.search}`, 301);
  }

  if (PAGES_HOSTS.some((h) => host.endsWith(`.${h}`))) {
    const response = await next();
    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'noindex');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return next();
};

/*
 * ALTERNATIVA SIN CÓDIGO — Bulk Redirects en el dashboard de Cloudflare
 * (requiere que jorgesergio.com esté en la misma cuenta de Cloudflare):
 *
 * 1. Account Home → Bulk Redirects → Create Bulk Redirect List
 *    (p. ej. "pages-dev-a-produccion").
 * 2. Agregar la URL:
 *      Source URL: jorge-sergio.pages.dev
 *      Target URL: https://jorgesergio.com
 *      Status:     301
 *    Edit parameters:
 *      ✔ Preserve query string
 *      ✔ Subpath matching
 *      ✔ Preserve path suffix
 *      ✘ Include subdomains   ← déjalo APAGADO para no redirigir los previews
 * 3. Create Bulk Redirect Rule usando esa lista y desplegarla.
 * 4. Si usas la regla, borra este archivo (functions/_middleware.ts) para
 *    que no se invoque una Function en cada request. Los previews perderían
 *    el header noindex; para conservarlo, agrega en public/_headers:
 *      https://:branch.jorge-sergio.pages.dev/*
 *        X-Robots-Tag: noindex
 *
 * Nota: con este middleware, cada request al sitio invoca una Pages Function
 * y cuenta contra la cuota de requests de Workers (100k/día en el plan
 * gratuito). Bulk Redirects no consume esa cuota.
 */
