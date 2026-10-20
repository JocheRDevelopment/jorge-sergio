# Blog — briefs SEO y publicación

Briefs de referencia de cada artículo (`<slug>.brief.md`). Esta carpeta no la procesa Astro y no se publica. Los artículos viven en `src/content/blog/`.

## Publicación

No hay borradores: todo archivo `.md` en `src/content/blog/` se publica en local, dev y producción. Solo se ignoran los que empiezan con `_` (como `_plantilla.md`).

## Chequeos del build

`npm run build` falla si un artículo:

- conserva placeholders `[ANÉCDOTA DE JORGE — PENDIENTE…]`, o
- enlaza a una ruta `/blog/...` que no existe.

El error indica el archivo, la línea, el enlace y el motivo. Para revisar localmente el HTML de un artículo con placeholders, usa `SKIP_BLOG_GUARD=1 npm run build`. Esa variable solo salta la revisión de placeholders, nunca la de enlaces, y no se usa en CI ni en deploy. Ver `blogPublishGuard` en `astro.config.mjs`.

Ojo: el chequeo de enlaces revisa solo los artículos del blog, no las páginas `.astro` como `simulador-ppr.astro`; confirma a mano que el artículo destino exista antes de enlazarlo desde ahí.

## Enlaces internos

Los enlaces entre `que-es-un-ppr`, `ppr-sat-deducible-de-impuestos`, `pension-ley-73`, `coaching-empresarial`, `proceso-de-ventas` y `/simulador-ppr/` ya están puestos. Cuando se cree un artículo nuevo, agrega los enlaces de la tabla "Keywords que pertenecen a otro artículo o página" del brief de cada artículo que lo mencione:

- `proceso-de-ventas`: artículos #7, #8, #12, #19 y #24 (tabla "Keywords que se mencionan…" de `proceso-de-ventas.brief.md`). Si cambian las etapas o los puntos de decisión del artículo, actualiza también `public/images/blog/diagrama-proceso-de-ventas.svg` (incluido su `<desc>`).
- `coaching-empresarial`: artículos #16 y #20 (`coaching-empresarial.brief.md`).
- `pension-ley-73`: artículos #9 (Ley 97) y #13 (Modalidad 40) (`pension-ley-73.brief.md`).

Si al escribir un artículo un enlace apunta a una página que todavía no existe, deja el texto sin enlace y anótalo en [`enlaces-pendientes.md`](enlaces-pendientes.md).
