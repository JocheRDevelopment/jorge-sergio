---
name: astro
description: Build production-grade Astro sites — landing pages, blogs, marketing sites, and content-driven sites — with React islands, Tailwind, SEO, and GEO (Generative Engine Optimization) baked in. Use this skill whenever the user mentions Astro, .astro files, astro.config, content collections, or wants to build a landing page, marketing page, blog, content site, documentation site, or portfolio. Also trigger when the user wants SEO-optimized static sites, AI-search-friendly content sites, or sites with strong Core Web Vitals. Targets Astro 5/6 (current stable as of 2026).
---

# Astro Framework Skill

Build fast, SEO/GEO-optimized Astro sites — landing pages, blogs, marketing sites, content-driven sites — with React (or other framework) islands where interactivity is needed.

This skill targets **Astro 5 / 6**. The mental model is: server-rendered HTML by default, zero JavaScript unless you explicitly opt in, content collections for any structured content, and SEO + GEO treated as first-class concerns from day one.

## When to use this skill

Trigger this skill whenever the user is:

- Creating, scaffolding, or modifying an Astro project (`.astro` files, `astro.config.mjs`, `src/content/`, etc.)
- Building a landing page, marketing page, blog, portfolio, documentation site, or content-driven site — even when they don't explicitly say "Astro"
- Asking about content collections, dynamic routes, MDX, server islands, or `astro:content`
- Working on SEO (canonical URLs, OG tags, JSON-LD, sitemaps, RSS, robots.txt) or GEO (llms.txt, AI crawlers, structured data for LLMs) for a static or content site
- Migrating from Next.js / Gatsby / Hugo / Jekyll to Astro
- Optimizing Core Web Vitals or Lighthouse scores on a content site

If the user says "build me a landing page" or "I need a blog" without naming a framework, Astro is the right default for static content. Confirm Astro briefly if unsure, then proceed.

## The Astro mental model (hold these in mind)

1. **Default to `.astro` and zero JavaScript.** Reach for `client:*` directives only when you genuinely need browser interactivity.
2. **Push expensive work to build time.** Use Content Collections + `getStaticPaths()` to prerender as much as possible.
3. **Server islands** (`server:defer`) for dynamic-on-otherwise-static content (personalized hero on a cached marketing page, etc.).
4. **Centralize SEO** in one `<SEO />` component called from every layout. Always emit canonical, OG, Twitter, and JSON-LD.
5. **Auto-generate everything crawlers want**: sitemap, RSS, `llms.txt`, `llms-full.txt` — all from Content Collections at build time.
6. **Adapters only when needed.** Pure static sites need none. SSR (auth, sessions, dynamic per-user) needs an adapter (`@astrojs/node`, `@astrojs/vercel`, `@astrojs/netlify`, `@astrojs/cloudflare`).
7. **Trailing-slash and base-URL consistency** matter — pick one config and enforce it everywhere (canonical, sitemap, links).

## Workflow for building a new Astro site

Follow this sequence. Don't skip steps — each one prevents a real, common bug.

### Step 1 — Scaffold and configure

```bash
npm create astro@latest
# Pick a template (Empty / Blog / Basic); enable TypeScript (strict); install deps; init git.
```

Then add the integrations the project will need. For a landing-page + blog with React islands + SEO + Tailwind:

```bash
npx astro add react tailwind sitemap mdx
```

Open `astro.config.mjs` and **immediately** set:

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://example.com',     // REQUIRED — without this, canonical/sitemap/RSS break
  trailingSlash: 'always',          // Pick one and never change it
  build: { format: 'directory', inlineStylesheets: 'auto' },
  output: 'static',                 // 'server' only when you need SSR
  integrations: [mdx(), sitemap(), react()],
  vite: { plugins: [tailwindcss()] },
});
```

`site:` is the #1 forgotten setting. Set it before anything else.

### Step 2 — Set up content collections (any time content is involved)

For a blog, define the collection schema in `src/content.config.ts` (Astro 5+ path — note the move out of `src/content/`):

```ts
import { defineCollection, z, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string().max(70),
    description: z.string().min(50).max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: image().optional(),
    tags: z.array(z.string()).default([]),
    author: reference('authors'),
    draft: z.boolean().default(false),
    canonicalURL: z.string().url().optional(),
  }),
});

export const collections = { blog /*, authors, ... */ };
```

Then run `npx astro sync` to regenerate types. The schema doubles as SEO validation — `description.min(50).max(160)` enforces meta-description length at build time.

For deeper patterns (custom loaders, references, live collections), see `references/content-collections.md`.

### Step 3 — Build the SEO foundation BEFORE pages

Before writing pages, create the SEO primitives — they get called by every layout:

1. `src/components/SEO.astro` — central `<head>` component (title, description, canonical, OG, Twitter, JSON-LD slot)
2. `src/components/SchemaArticle.astro` — JSON-LD `BlogPosting` for blog posts
3. `src/layouts/BaseLayout.astro` — wraps every page, uses `<SEO />`
4. `src/layouts/BlogPostLayout.astro` — wraps blog posts, uses `<SEO />` + `<SchemaArticle />`

Full templates for all four are in `references/seo.md`. Use them verbatim as a starting point — don't reinvent.

### Step 4 — Build the GEO foundation alongside SEO

If the site is content-driven (blog, marketing, docs), set up GEO from day one:

- `public/robots.txt` — allow GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.
- `src/pages/llms.txt.ts` — auto-generated llms.txt from content collections at build time
- (optional) `src/pages/llms-full.txt.ts` — full-text concatenation for deep AI ingestion

Full templates and the AI-content-structuring rules in `references/geo.md`. Apply the semantic HTML + content-structure rules to every article you write, not just the technical files.

### Step 5 — Build pages and routes

File-based routing under `src/pages/`. Key patterns covered in `references/routing.md`:

- Static routes: `src/pages/about.astro` → `/about/`
- Dynamic + collection-driven: `src/pages/blog/[...slug].astro` with `getStaticPaths()` from `getCollection('blog')`
- Pagination via `paginate()` helper
- Custom 404, redirects, rewrites

Every page imports `BaseLayout` (or `BlogPostLayout` for posts). Never write a raw `<html>` in a page file — always go through a layout so the `<head>` stays centralized.

### Step 6 — Add interactivity sparingly (React islands)

For interactive pieces (forms, carousels, dashboards), use React (or Svelte/Vue/Solid) with the right hydration directive:

| Use case | Directive |
|---|---|
| Above-the-fold form, header search | `client:load` |
| Below-the-fold carousel, video player, comment widget | `client:visible` (**best default**) |
| Mobile-only nav, dark-mode toggle that's not critical | `client:idle` |
| Canvas / WebGL / `window`-dependent components with no SSR output | `client:only="react"` |

**Never** put indexable content behind `client:only` — it's invisible to Google and AI crawlers. See `references/islands-and-rendering.md` for the full table plus server islands (`server:defer`) for personalized-on-static-page patterns.

### Step 7 — Optimize images

Use `<Image />` and `<Picture />` from `astro:assets` for every content image. **Never use raw `<img>`** for content imagery — you lose responsive variants, format negotiation, and CLS-safe dimensions.

```astro
---
import { Image } from 'astro:assets';
import heroImg from '../assets/hero.jpg';
---
<Image
  src={heroImg}
  alt="Descriptive sentence — required for SEO + GEO + a11y"
  width={1200} height={630}
  loading="eager" fetchpriority="high"   {/* LCP image only */}
  format="webp" quality={80}
/>
```

For OG images and other URLs outside JSX, use the `getImage()` helper. Details + remote-image config + `<Picture>` for art direction in `references/images.md`.

### Step 8 — Generate sitemap, RSS, llms.txt

These are non-negotiable for content sites. Each is a small static endpoint that reads from content collections at build time. Templates in `references/seo.md` (sitemap, RSS) and `references/geo.md` (llms.txt, llms-full.txt).

Reference them from `<head>` and `robots.txt`:

```html
<link rel="alternate" type="application/rss+xml" title="My Site" href="/rss.xml" />
```
```
Sitemap: https://example.com/sitemap-index.xml
```

### Step 9 — Forms with type-safe Actions

For contact / newsletter / lead-capture forms, use **Astro Actions** (Astro 4.15+, stable in 5+). They work without JS (progressive enhancement) and give type-safe client-side calls when JS is available. Pattern in `references/actions-forms.md`. Actions require on-demand rendering on the action route — `export const prerender = false` is enough; the rest of the site can stay static.

### Step 10 — Build, test, deploy

```bash
npm run build      # produces ./dist
npm run preview    # serve the production build locally
npx astro check    # type-check — run in CI
```

Deploy: static sites need **no adapter** — push `dist/` to Netlify / Vercel / Cloudflare Pages / GitHub Pages. SSR or server-islands sites need `npx astro add netlify` (or vercel/node/cloudflare) which configures the adapter automatically. Deployment specifics in `references/deployment.md`.

## Reference files — when to read which

Read these on demand. Each is self-contained.

| File | Read when |
|---|---|
| `references/quick-reference.md` | You need the cheat sheet — CLI commands, common snippets, the `Astro` global object, runtime modules. Skim first if helpful. |
| `references/project-setup.md` | Scaffolding a new project; choosing template/integrations; full `astro.config.mjs` reference; TypeScript + `astro:env` setup. |
| `references/syntax.md` | Writing `.astro` components — frontmatter, props, slots, expressions, escaping, styles, `class:list`, `set:html`. |
| `references/routing.md` | Static routes, dynamic routes, `getStaticPaths()`, rest params, pagination, redirects, rewrites, 404. |
| `references/content-collections.md` | **Read for any blog or structured-content work.** Schema design, loaders (glob/file/custom), querying, rendering, references, migration v4→v5/v6. |
| `references/islands-and-rendering.md` | Choosing between `client:*` directives; server islands (`server:defer`); SSG vs SSR vs per-route opt-in; adapters. |
| `references/images.md` | `<Image>`, `<Picture>`, `getImage()`, remote images, `public/` vs `src/assets/`, image services. |
| `references/styling.md` | Scoped styles, global styles, `define:vars`, Tailwind v4 setup, CSS modules, performance settings. |
| `references/markdown-mdx.md` | Markdown config, Shiki/Expressive Code, MDX with components, math (KaTeX), Mermaid diagrams, code-block best practices. |
| `references/seo.md` | **Read on every site build.** `<SEO />` component, `<SchemaArticle />` JSON-LD, sitemap, RSS, canonical URLs, Core Web Vitals checklist, common gotchas. |
| `references/geo.md` | **Read on every content-site build.** `llms.txt`, `llms-full.txt`, semantic HTML rules for AI crawlers, robots.txt for AI bots, content-structure best practices. |
| `references/actions-forms.md` | Type-safe forms, Zod validation, progressive enhancement, calling actions from islands. |
| `references/middleware-sessions.md` | `Astro.cookies`, `Astro.session`, middleware patterns (auth, locale, security headers), `Astro.locals`. |
| `references/i18n.md` | Multi-locale routing, helpers, translations pattern, hreflang for SEO. |
| `references/view-transitions.md` | `<ClientRouter />`, transition directives, lifecycle events, when NOT to use it. |
| `references/deployment.md` | Static deploy targets, SSR adapters, Node self-host, edge functions, Docker. |
| `references/migration.md` | v4 → v5 changes, v5 → v6 changes, `npx @astrojs/upgrade`, common errors. |
| `references/recipes.md` | Auth (Lucia, Clerk, etc.), CMS integrations (Sanity, Storyblok, WP), e-commerce, search (Pagefind, Algolia), reading time, tag pages, related posts. |

## Critical rules — never violate

These are the things that break sites. Re-check them every time.

1. **Always set `site:` in `astro.config.mjs`** before anything else. Without it, `Astro.site` is `undefined` and every canonical / sitemap / RSS URL silently breaks.
2. **Trailing slash consistency**: pick `always` or `never` and use the SAME setting in canonical tags, sitemap output, and internal links. Mismatched trailing slashes cause duplicate-content penalties.
3. **Never use `client:only` for indexable content.** Crawlers don't execute it. If users and Google both need to see it, render it on the server.
4. **Never use raw `<img>` for content imagery.** Use `<Image />` from `astro:assets` — you need responsive variants, modern formats, and explicit dimensions for CLS.
5. **Every image needs meaningful `alt`.** Decorative-only images get `alt=""`. Never omit the attribute.
6. **One `<h1>` per page, no skipped heading levels.** Crawlers and AI parsers both rely on this.
7. **Set `<html lang="...">`.** Always.
8. **For Astro 5+, use the Content Layer API:** `loader` + `schema`, `entry.id` (not `entry.slug`), `await render(entry)` (not `entry.render()`). Astro 6 makes this mandatory — there is no fallback.
9. **Never write `<head>` content directly in pages.** Always go through a layout with a centralized `<SEO />` component, or you'll have inconsistent meta tags.
10. **Run `npx astro sync` after editing `content.config.ts`.** Otherwise TypeScript won't see the new types.

## Quick decision tree

Use this to pick the right pattern fast.

- **"How do I make this page?"** — Static `.astro` in `src/pages/`. Layout wrapping `<SEO />`. Done.
- **"Where does this content live?"** — Content Collection in `src/content/<name>/`, with a Zod schema in `src/content.config.ts`.
- **"This needs to be interactive."** — Framework island (React) with `client:visible` unless above the fold.
- **"This needs per-user data on a cacheable page."** — Server island (`server:defer`). Requires an adapter.
- **"This needs a form."** — Astro Action (`src/actions/index.ts`) with Zod input schema, called from a plain `<form>` for progressive enhancement.
- **"This needs auth."** — Middleware reads cookie → `Astro.locals.user`. Pages check `Astro.locals` and redirect. Requires `output: 'server'` or per-route `prerender = false`.
- **"This needs to be fast."** — It already is. Verify with `astro build` + Lighthouse. If something is slow, it's almost always an over-hydrated React component or an unoptimized image.

## Verifying knowledge is current

This skill targets Astro 5/6 as of 2026. If you encounter an API or pattern not covered here, or the user mentions a new feature, **search the official docs** at `https://docs.astro.build/en/` before guessing — Astro evolves quickly and training-data answers may be stale. The reference files in this skill capture the patterns that have been stable since the Content Layer API shipped.
