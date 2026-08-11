---
name: geo-web
description: Generative Engine Optimization (GEO) for React/Next.js websites built with the Anthropic JS SDK. Use this skill whenever the user is building, scaffolding, or improving a React or Next.js website and any of these apply — they mention SEO, GEO, AI search, ChatGPT/Claude/Perplexity/Gemini visibility, getting cited by AI, AI Overviews, llms.txt, robots.txt for AI crawlers, schema markup, structured data, E-E-A-T, content authority, or answer-first content. Also use it proactively when the user is shipping any public-facing marketing site, blog, docs site, or landing page with the Anthropic JS SDK — modern sites should be GEO-ready by default, and the user often won't think to ask. Covers technical foundations (AI crawler access, llms.txt, JSON-LD schema, SSR/SSG), content patterns (inverted pyramid, conversational queries, authority signals), and Anthropic SDK patterns that don't sabotage crawlability.
---

# GEO for React / Next.js Sites Using the Anthropic JS SDK

## What this skill is for

Generative Engine Optimization (GEO) is making a site *citable* by AI answer engines (ChatGPT, Claude, Perplexity, Gemini), not just rankable on Google. The bar is different: AI engines pull from sources they consider authoritative, parse content semantically, and quote chunks that read as direct answers. A React app built the default way — client-rendered, no JSON-LD, no `llms.txt`, prose buried under marketing fluff — is nearly invisible to them.

This skill applies when building or improving public-facing React/Next.js sites where being found by AI matters. It does **not** apply to internal tools, authenticated app surfaces, or pure SPAs that aren't meant to be indexed.

## The mental model — 4 layers

Work through these in order. Skipping the first layer makes the others pointless: if AI crawlers can't read the page, nothing else matters.

1. **Crawlability** — AI bots can fetch the page and see real content (not a JS shell)
2. **Machine-readable structure** — schema.org JSON-LD + `llms.txt` + semantic HTML
3. **Content shape** — answer-first, conversational, authority-backed
4. **Off-site presence** — Wikipedia, Reddit, YouTube, Stack Overflow (out of scope for code, but flag it to the user)

## Layer 1 — Crawlability (do this first, always)

### Server-render anything you want cited

AI crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot, Google-Extended) often don't execute JavaScript reliably. A pure CSR React app shows them an empty `<div id="root">`.

**Required pattern by framework:**

- **Next.js (App Router)** — Server Components by default. Marketing/content pages must NOT be marked `"use client"`. Use `"use client"` only for interactive leaf components (forms, dropdowns, the Anthropic SDK chat widget). Wrap client islands inside server pages.
- **Next.js (Pages Router)** — use `getStaticProps` / `getServerSideProps`. Avoid `useEffect`-fetched content for anything that should be cited.
- **Remix / React Router** — use loaders, not client fetches, for cite-worthy content.
- **Vite + React SPA** — add a pre-rendering step (e.g. `vite-plugin-prerender`, `react-snap`) for marketing/content routes, or migrate those routes to a framework with SSR. Don't ship a CSR-only marketing site and call it GEO-ready.

**Anthropic SDK caveat:** the `@anthropic-ai/sdk` is a client to Anthropic's API. It should run **server-side only** — in route handlers, server actions, or API routes — both for security (API keys) and so crawlers see the rendered output, not a chat shell. If you're streaming model output into a page that should be cited, render the final text server-side on first load; use client streaming only for interactive sessions. See `references/anthropic-sdk-patterns.md`.

### `robots.txt` — explicitly allow AI crawlers

Default Next.js doesn't ship one. Create `public/robots.txt` (or `app/robots.ts` for App Router dynamic). See `references/robots-txt.md` for the full file. Minimum:

```
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://example.com/sitemap.xml
```

Ask the user before doing this: some sites deliberately *block* AI crawlers (paywalled news, proprietary research). Don't assume.

### `llms.txt` — the AI equivalent of `robots.txt`

A markdown file at the site root that tells LLMs what the site is, what's authoritative, and which pages matter. Place at `public/llms.txt`. See `references/llms-txt.md` for the template and a worked example.

### Performance and HTTPS

Standard hygiene: HTTPS, Core Web Vitals in the green, mobile-responsive, clean URLs. Next.js + Vercel defaults usually handle this; verify with Lighthouse before shipping.

## Layer 2 — Machine-readable structure

### JSON-LD schema markup

This is the single highest-leverage technical move. AI engines parse JSON-LD to understand what a page *is*. In Next.js, render it as a `<script type="application/ld+json">` tag inside a Server Component — never `dangerouslySetInnerHTML` on the client side for this.

**Priority order** (implement in this sequence):

1. `Organization` — site-wide, in root layout
2. `Article` / `BlogPosting` — every content page, with `author`, `datePublished`, `dateModified`
3. `Person` — author profiles, with credentials
4. `FAQPage` — any page with Q&A
5. `HowTo` — tutorials and step-by-step content
6. `BreadcrumbList` — navigation hierarchy
7. `WebSite` with `SearchAction` — root layout

Full ready-to-paste React/Next.js components with TypeScript types live in `references/schema-snippets.md`. Always include the AI-relevant properties: `dateModified`, `sourceOrganization`, `citation`, `factCheckingPolicy` where applicable.

### Semantic HTML

Use the elements that carry meaning, not `<div>` for everything:

- `<article>` — wraps each post/page's primary content
- `<section>` — for distinct subsections with headings
- `<nav>` — site and in-page navigation
- `<aside>` — tangential content (related posts, callouts)
- `<header>` / `<footer>` — for the page AND for `<article>`
- `<h1>` once per page, then `<h2>`–`<h6>` in logical hierarchy — don't skip levels

In React this means importing the elements, not custom-named components like `<Heading>` that obscure the tag. If you use a design system that wraps headings, verify the rendered HTML still emits real `<h1>`/`<h2>`.

## Layer 3 — Content shape

This layer is about what the page *says* and how it's structured. Writing pattern matters as much as markup.

### Inverted pyramid (answer-first)

Every cite-worthy page follows this:

1. **First 50 words** — direct, complete answer to the page's primary question
2. **Next ~200 words** — supporting evidence (one original stat, one expert quote or authoritative citation, links to primary sources)
3. **Rest of the page** — comprehensive detail, edge cases, examples

AI engines often quote the first paragraph. If the first paragraph is "In today's rapidly evolving digital landscape...", you've lost. If it directly answers the query the user typed, you've won.

When generating page content with the Anthropic SDK, prompt the model to follow this structure explicitly — see `references/content-prompts.md` for prompts that produce inverted-pyramid output.

### Conversational queries (10–11 words, not 2–3)

AI search queries are long and conversational. Your headings and FAQ entries should match.

- **Bad headings:** "Pricing", "Features", "Use Cases"
- **Good headings:** "How much does [Product] cost for a 10-person team?", "What can I build with [Product] that I couldn't with [Alternative]?"

Add a real FAQ section to every important page with 5–10 questions phrased the way a user would ask an AI assistant. Wrap it in `FAQPage` JSON-LD so the structure is explicit.

### Authority signals

On every important page, include:

- One original statistic, ideally first-party data (not "studies show...")
- One expert quote with name, title, affiliation
- 2–3 links to primary sources with publication dates
- Author byline with credentials, linked to a `Person`-schema'd bio page

For sites generated with help from the Anthropic SDK: be honest about it. Don't fabricate statistics or quotes. AI engines and human editors are increasingly good at spotting invented citations, and one fake stat poisons the whole site's authority.

### Freshness

Content under 30 days old reportedly gets meaningfully higher citation rates on Perplexity. Set up a content cadence and surface `dateModified` prominently — both in JSON-LD and visibly on the page.

## Layer 4 — Off-site (out of scope for code, flag to user)

Citations on ChatGPT skew heavily toward Wikipedia; Perplexity skews heavily toward Reddit. No amount of on-site optimization substitutes for presence there. When wrapping up a build, mention this to the user as a non-code follow-up — don't try to automate Wikipedia edits or Reddit posts.

## Workflow when starting a new site

1. Confirm the framework. If it's CSR-only, raise that first — the user may want to switch to Next.js or add pre-rendering before going further.
2. Ask whether they want AI crawlers allowed (default: yes).
3. Scaffold `robots.txt`, `llms.txt`, root-layout JSON-LD (Organization + WebSite), and a `sitemap.xml`.
4. For each content page they're building, add Article/FAQ/HowTo JSON-LD as appropriate, semantic HTML, and an inverted-pyramid opening.
5. If they're using the Anthropic SDK to generate content, set up prompts that produce GEO-shaped output (see `references/content-prompts.md`).
6. Run Lighthouse + view-source to verify content is in the initial HTML, not injected client-side.
7. Flag off-site work (Wikipedia, Reddit, YouTube) as a separate stream of work the user owns.

## Workflow when improving an existing site

1. View-source on a representative page. Is content there, or is it `<div id="root"></div>`? If the latter, fix that before anything else.
2. Check `https://site/robots.txt` and `https://site/llms.txt`. Add them if missing.
3. Grep for `application/ld+json`. Catalog what schema exists and what's missing.
4. Audit headings: are there `<h1>`s? Are they questions or marketing slogans?
5. Read the first 50 words of the top 5 pages. Do they answer anything?
6. Produce a prioritized list and execute top-down.

## What NOT to do

- Don't keyword-stuff for AI — modern models detect unnatural repetition and penalize it.
- Don't fabricate statistics, quotes, or citations to look authoritative. This is the fastest way to torch a site's credibility.
- Don't ship a CSR-only marketing site and add `llms.txt` thinking that fixes anything — crawlers still see no content.
- Don't put the Anthropic SDK in client components with a hardcoded API key. Always server-side.
- Don't game Wikipedia or Reddit on the user's behalf. Surface the strategy; let them do the engagement.
- Don't treat GEO as a replacement for SEO. The fundamentals (HTTPS, performance, real content) carry over directly.

## Reference files

Read these as needed; don't load them all upfront:

- `references/robots-txt.md` — full robots.txt with AI crawler list and `app/robots.ts` example
- `references/llms-txt.md` — template and worked example
- `references/schema-snippets.md` — ready-to-paste React/Next.js JSON-LD components (Organization, Article, FAQ, HowTo, Person, BreadcrumbList, WebSite)
- `references/anthropic-sdk-patterns.md` — server-side SDK usage, streaming patterns, content generation for GEO
- `references/content-prompts.md` — prompts for the Anthropic SDK that produce inverted-pyramid, citation-friendly content
- `references/caveats.md` — known statistical conflicts and forward-looking claims in GEO source material, so you don't repeat numbers as gospel
