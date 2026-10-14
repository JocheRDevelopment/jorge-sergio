# Blog — briefs SEO y publicación

Briefs de referencia de cada artículo (`<slug>.brief.md`). Esta carpeta no la procesa Astro y no se publica. Los artículos viven en `src/content/blog/`.

## Chequeos del build

`npm run build` falla si un artículo con `draft: false`:

- conserva placeholders `[ANÉCDOTA DE JORGE — PENDIENTE…]`, o
- enlaza a una ruta `/blog/...` que no se va a generar, porque no existe o porque el artículo destino sigue en `draft: true`.

El error indica el archivo, la línea, el enlace y el motivo. Para revisar localmente el HTML de un borrador con placeholders, usa `SKIP_BLOG_GUARD=1 npm run build`. Esa variable solo salta la revisión de placeholders, nunca la de enlaces, y no se usa en CI ni en deploy. Ver `blogPublishGuard` en `astro.config.mjs`.

## Orden de publicación

1. Publicar `que-es-un-ppr` primero.
2. Al publicar `ppr-sat-deducible-de-impuestos`, agregar estos 2 enlaces en `src/content/blog/que-es-un-ppr.md`:
   - Al final del H3 "¿Qué es un PPR para el SAT?", agregar:
     `Te lo explico a detalle en la guía de [PPR y SAT](/blog/retiro/ppr-sat-deducible-de-impuestos/).`
   - En el H2 "¿Cuánto puedes deducir de un PPR en 2026?", convertir en enlace a `/blog/retiro/ppr-sat-deducible-de-impuestos/` la primera aparición de la palabra "deducir" que esté en el cuerpo (no en el título).

Con el chequeo de enlaces, el build no deja publicar `ppr-sat-deducible-de-impuestos` mientras `que-es-un-ppr` siga en borrador.

### Proceso de ventas (pilar `ventas`)

`proceso-de-ventas` es la guía pilar de Ventas y no depende de otros artículos del blog. Usa el diagrama `public/images/blog/diagrama-proceso-de-ventas.svg`: si cambian las etapas o los puntos de decisión del artículo, actualiza también el SVG (incluido su `<desc>`). Cuando se publiquen los artículos #7, #8, #12, #19 y #24, agrega los enlaces de la tabla "Keywords que se mencionan…" de `proceso-de-ventas.brief.md`.

### Coaching empresarial (pilar `coaching`)

`coaching-empresarial` es la guía pilar de Coaching y no depende de otros artículos del blog. Solo enlaza a páginas de servicio (`/coaching-de-ventas/` y `/agenda/`). Cuando se publiquen los artículos #3 (`proceso-de-ventas`), #16 y #20, agrega los enlaces de la tabla "Keywords que pertenecen a otro artículo o página" de `coaching-empresarial.brief.md`.
