---
name: astro-react-seo
description: 'Production-grade SEO for Astro.js sites with React islands. Use this skill whenever the user is building, auditing, migrating, or shipping an Astro site — even when they do not say "SEO" out loud. Triggers include creating an Astro page or project, building a BaseLayout, configuring meta tags, canonical URLs, robots.txt, or sitemap, adding JSON-LD or schema.org markup, Open Graph or Twitter Card tags, hreflang or multi-locale setup, improving Core Web Vitals (LCP, INP, CLS), optimizing for AI search (AI Overviews, ChatGPT, Claude, Perplexity, GEO, AEO, llms.txt), pre-launch audits, debugging "not indexed" or "soft 404" issues, configuring trailingSlash, choosing SSG vs SSR, getStaticPaths, @astrojs/sitemap, astro:content collections, or hydration directives (client:load, client:visible, client:only). Reflects May 2026 SEO including the FAQ rich-result deprecation, June 2025 schema retirements, August 2025 Spam Update, and AI crawler norms.'
---

# Astro.js + React SEO

Production-grade SEO for Astro 5.x sites with React islands. The guidance here reflects the search landscape as of May 2026 — including the recent FAQ rich-result deprecation, AI Overviews everywhere, and the rise of LLM crawlers as a distinct audience.

## Core principles (read these first)

1. **Ship static HTML by default.** Astro's biggest SEO advantage is also the simplest: zero JS gets the content to crawlers immediately. Prefer `output: 'static'`; only opt into SSR per-route when freshness or auth demands it.
2. **Server-render the SEO layer.** Title, meta, canonical, hreflang, OG, JSON-LD must exist in the initial HTML response — never JS-injected. Google may skip rendering on non-200 responses, and most AI crawlers don't execute JS at all.
3. **Treat Googlebot, GPTBot, and ClaudeBot as different audiences with overlapping needs.** Most AI bots don't execute JS; HTML-first discipline serves them all.
4. **Measure field, not lab.** Real-user Core Web Vitals are what rank. Ship a RUM beacon.
5. **Schema is content infrastructure.** Rich results come and go (FAQ deprecated May 2026, HowTo dropped 2023). The underlying entity graph keeps paying off in AI extraction.
6. **One BaseLayout owns all SEO meta.** Centralize so no page can ship without canonical + og:image. Use `astro:content` Zod schemas to enforce required frontmatter at build time — this prevents the #1 SEO bug: forgetting metadata on a new page.

## When to read which reference

Don't read every reference up front. Look at the user's task, then load only what applies. References live in `references/` next to this file.

| If the task involves… | Read |
|---|---|
| robots.txt, sitemap, canonical, redirects, trailing slash, status codes, crawl budget, faceted nav | `references/technical-seo.md` |
| Core Web Vitals, LCP/INP/CLS, image optimization, fonts, caching, resource hints, RUM | `references/performance.md` |
| Title/meta/headings, internal linking, alt text, E-E-A-T, featured snippets, keyword intent | `references/on-page.md` |
| Any JSON-LD / schema.org markup (Article, Product, BreadcrumbList, LocalBusiness, etc.) | `references/structured-data.md` |
| Astro config, BaseLayout, getStaticPaths, content collections, hydration directives, React islands, View Transitions | `references/astro-react-patterns.md` |
| Google's JS rendering pipeline, hydration mismatches, soft 404s in SPAs, cloaking | `references/javascript-seo.md` |
| hreflang, multi-locale, ccTLD vs subdomain vs subdirectory, translation/localization | `references/international-seo.md` |
| Google Business Profile, LocalBusiness schema, NAP consistency, multi-location | `references/local-seo.md` |
| AI Overviews, AI crawlers (GPTBot/ClaudeBot/PerplexityBot), llms.txt, GEO/AEO, robots.txt for AI | `references/ai-geo.md` |
| Open Graph, Twitter Cards, Pinterest, LinkedIn, dynamic OG images | `references/social-og.md` |
| HSTS, CSP, security headers, HTTPS migration | `references/security-headers.md` |
| GSC, GA4, Bing Webmaster, log file analysis, rank tracking, RUM vs lab | `references/analytics.md` |
| Topic clusters, pillar pages, content freshness, thin content, intent mapping | `references/content-strategy.md` |
| Algorithm history (March 2024 → May 2026), recovery posture | `references/algorithm-updates.md` |
| Pre-launch, post-launch, recurring audit, migration | `references/checklists.md` |
| Free/paid tools, browser extensions, Astro-specific packages | `references/tools.md` |

If multiple apply, read them in order of importance to the user's task. For example, "build a new blog page" → `astro-react-patterns.md` first, then `on-page.md`, then `structured-data.md` for the `BlogPosting` snippet.

## Quickstart: brand-new Astro site

When the user is starting a fresh project or hasn't yet wired up SEO basics, work through this in order. Each step links to deeper coverage if the user needs it.

### 1. Set `site` and `trailingSlash` explicitly

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  trailingSlash: 'always', // or 'never' — pick one and never mix
});
```

The `site` value feeds canonical URLs, the sitemap, and OG absolute URLs. If you skip it, half the SEO layer silently breaks.

### 2. Install the sitemap integration

```bash
npx astro add sitemap
```

For SSG routes this is enough. For SSR-heavy sites the integration produces empty output — hand-roll an endpoint that queries your CMS. See `references/technical-seo.md` § Sitemaps and `references/astro-react-patterns.md` § SSR sitemap endpoint.

### 3. Ship a dynamic `robots.txt`

Make robots.txt an endpoint so the sitemap URL stays in sync with `site`. Decide AI crawler policy explicitly (default: allow the major search bots; block low-value scrapers like Bytespider). Full template in `references/technical-seo.md` and AI-specific reasoning in `references/ai-geo.md`.

### 4. Build a single `BaseLayout.astro`

One layout owns all `<head>` tags: title, description, canonical, OG, Twitter, hreflang, sitewide JSON-LD. No page should hand-roll its own head. Full implementation in `references/astro-react-patterns.md` § BaseLayout.

### 5. Define a Zod schema for content collections

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string().max(60),
    description: z.string().min(120).max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string(),
    ogImage: image().optional(),
    noindex: z.boolean().default(false),
    tags: z.array(z.string()),
  }),
});
export const collections = { blog };
```

This is the most underrated SEO win in Astro. The build fails if a post is missing a title or description.

### 6. Ship sitewide Organization + WebSite JSON-LD

Inject on every page from BaseLayout. Critical: use `set:html` on the `<script type="application/ld+json">` tag or Astro escapes the JSON and the markup silently fails. Full snippet and gotchas in `references/structured-data.md`.

### 7. Configure performance baseline

- Use `<Image>` / `<Picture>` from `astro:assets` (never `<img>` for content images).
- `priority` prop on the LCP image (auto-sets `loading="eager"` + `fetchpriority="high"`).
- Self-host fonts, preload only above-the-fold weights.
- Ship a `web-vitals` RUM beacon from day one.

See `references/performance.md` for full Core Web Vitals tactics.

### 8. Run the pre-launch checklist

Before flipping DNS, work `references/checklists.md` § Pre-Launch end to end. The most common production bugs are staging carryovers (orphan `noindex`) and missing canonicals on edge templates.

## Common-task playbooks

### "Add a new blog post template"

1. Read `references/astro-react-patterns.md` § Dynamic routes (`getStaticPaths` + `astro:content`).
2. Read `references/on-page.md` § Headings + E-E-A-T (author bylines matter).
3. Add `BlogPosting` JSON-LD per `references/structured-data.md` § BlogPosting.
4. Add `BreadcrumbList` schema (always worth it).
5. Validate with Rich Results Test before merging.

### "This page isn't getting indexed"

Diagnose in this order:

1. Is the response status 200? Non-200 may skip rendering entirely (Dec 2025 Google clarification).
2. Is `<meta name="robots" content="noindex">` in the raw HTML (not just rendered)? Check via View Source, not DevTools.
3. Is the canonical pointing somewhere else?
4. Is the URL in the sitemap, and does the sitemap actually generate? (SSR sites with `@astrojs/sitemap` often produce empty sitemaps silently.)
5. Is content fetched in a React `useEffect`? If yes, AI crawlers won't see it and Googlebot may not either. Move data fetching to the `.astro` frontmatter.
6. Soft 404? Check for "no results found" placeholders on valid URLs.

Full diagnostic flow in `references/javascript-seo.md` § Soft 404s and `references/technical-seo.md` § Status codes.

### "Migrate a site to Astro"

Work `references/checklists.md` § Migration top to bottom. Critical: full URL inventory → 1:1 redirect map (single hop, no chains) → preserve internal link structure → submit both old and new sitemaps after launch (Google needs to fetch the 301s).

### "Optimize for AI Overviews / ChatGPT / Perplexity citations"

1. Decide AI crawler policy in `robots.txt` (default: allow the major bots — see `references/ai-geo.md`).
2. Remove any `nosnippet` directives (as of March 2025, `nosnippet` also blocks AI Overviews).
3. Add a quick-answer block in the first 100–200 words of each pillar page — declarative, no hedging.
4. Use question-led H2s. AI engines preferentially extract them.
5. Ship Author + Organization schema with full entity identity.
6. Refresh evergreen content every 7–14 days (~13-week AI citation half-life observed).
7. Ship an `llms.txt` (low effort, low payoff currently, but standardizing).

Full GEO playbook in `references/ai-geo.md`.

### "Audit existing site"

Walk `references/checklists.md` § Recurring Quarterly Audit. The big four findings on most audits: missing self-canonicals, orphan `noindex` on production pages, soft 404s from SPA-style routing, and React islands fetching content client-side.

## Astro-specific gotchas (memorize these)

These are the bugs Claude should proactively check for when reviewing Astro code:

1. **`client:only` on SEO-critical content** → invisible to crawlers. Use `client:visible` instead, or move logic out of the island.
2. **JSON-LD without `set:html`** → Astro escapes the JSON and the schema silently fails validation. Always: `<script type="application/ld+json" set:html={JSON.stringify(schema)} />`.
3. **Images in `public/`** → not processed by Astro's image pipeline. Put content images in `src/assets/` instead.
4. **`useEffect` data fetching in React islands** → not in SSR output, invisible to crawlers. Fetch in `.astro` frontmatter, pass as props.
5. **SSR mode + `@astrojs/sitemap`** → silently produces an empty sitemap. Hand-roll an endpoint.
6. **Mixing trailing-slash conventions** between `astro.config.mjs` and CMS-generated links → duplicate URLs in the index.
7. **Endpoint routes (`.ts`) returning 200 for missing resources** → soft 404s. Return real 404/410 status.
8. **View Transitions breaking re-init of analytics** → wire `astro:page-load` and `astro:after-swap` listeners.
9. **Hero / above-the-fold marked `client:only`** → blank LCP, tanks Core Web Vitals.
10. **Forgetting to set `Astro.site`** → canonical URLs become relative, OG images break preview rendering.

## What's changed recently (May 2026)

Be aware when giving advice — outdated guidance is everywhere on the web.

- **May 7, 2026** — FAQ rich results deprecated globally. **Keep the schema** — AI Overviews, Perplexity, ChatGPT Search, and Claude still use it for Q&A extraction. Just don't promise the dropdown UI to clients.
- **August 26, 2025** — Spam Update targeting scaled content abuse, expired domain abuse, parasite SEO. Don't template location pages.
- **June 12, 2025** — Seven structured data types retired from rich results (still valid schemas): BookActions, CourseInfo, ClaimReview, EstimatedSalary, LearningVideo, SpecialAnnouncement, VehicleListing.
- **March 2025** — `nosnippet` now also blocks AI Overviews and AI Mode. Critical lever for publishers who want zero AI use; deadly for everyone else.
- **December 2025** — Google clarified: non-200 responses may have rendering skipped entirely. If a route should be indexed, it must return 200. Conversely, never serve 200 for genuine errors.

Full timeline in `references/algorithm-updates.md`.

## How to use this skill effectively

- **Don't dump the full reference** when answering a question. Pick the relevant subfile, read it, then answer with the specific pattern.
- **Quote thresholds and current dates** rather than vague advice. "LCP ≤ 2.5s at p75" beats "make it fast".
- **Show code** when the user is building. Astro frontmatter, BaseLayout snippets, JSON-LD blocks — concrete beats abstract.
- **Validate claims against the reference** before answering with conviction. Search results from the open web may give outdated 2022 SEO advice; the reference files reflect May 2026 reality.
- **Flag when a request conflicts with current best practice** — e.g., a user asking to add FAQ schema "for the rich result" should be told the rich result is gone (May 2026) but the schema is still worth shipping for AI extraction.
