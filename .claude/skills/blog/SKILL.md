---
name: agency-blog
description: Write full SEO + GEO (Generative Engine Optimization) blog posts end-to-end, output as Astro content-collection files (.md/.mdx) by default, using a unified agency playbook. Also audits, briefs, or refreshes blog content, plans blog architecture and internal linking, and generates JSON-LD schema. Use this skill whenever the user wants to draft a blog post, pillar page, or cluster article — especially inside an Astro project — so it ranks in Google AND gets cited by AI engines (ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude). Trigger this even when the user only says "write a blog post," "add a blog to my Astro site," "help me with content for SEO," "make this rank," or "get cited by AI" — they want the full system applied, not a generic draft.
---

# Agency Blog Skill — SEO + GEO Content

## What this skill is for

Produce blog content that wins on two fronts at once: traditional search ranking (Google/Bing) and AI citation (ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude). The two disciplines overlap ~90%, so this is **one system, not two**.

**The single decision rule when SEO and GEO conflict: write for clarity and extractability first.** The SEO benefits compound from there.

## Mental model — two readers, one post

Every post is consumed by (1) a human + traditional crawler that rewards depth, E-E-A-T, internal links, schema, and Core Web Vitals; and (2) a retrieval-augmented LLM that rewards machine-extractable answer blocks, statistics, named entities, citations, semantic HTML, and structured data. Build for both simultaneously.

## Pick the task

The primary job is **writing complete, publish-ready posts** (default output: Astro). Figure out which job the user wants, then follow that path. When ambiguous, default to writing a full post.

| User wants | Do this |
|---|---|
| A full blog post / pillar / cluster article (default) | Follow **Writing workflow** below; ship as an Astro file per `references/astro.md` |
| A writer brief or outline only | Use the brief template in `references/templates.md` (section C) |
| To check an existing post | Follow **Audit workflow** below |
| To plan site structure / internal linking | Read `references/architecture.md` |
| JSON-LD schema for a post | Use `references/templates.md` (section A) + `references/astro.md` for wiring |
| To know how a specific AI engine cites | Read `references/geo.md` (platform notes) |
| To decide if a post needs updating | Use the refresh trigger checklist in `references/templates.md` (section D) |

## Writing workflow

Work through these phases. Don't skip the pre-write research — drafting before a SERP audit is the most common failure.

### 1. Pre-write (research & plan)
- Identify the **target keyword** and classify **search intent** (informational / commercial / transactional / navigational). Intent dictates format — see `references/seo.md`.
- Do a **SERP audit**: look at the current top 10 for the keyword, identify the dominant format/angle, and plan to match it. If you have web search, actually search; otherwise tell the user this step needs their input or a live search.
- Decide the post's **role**: pillar (broad, 2,500–5,000+ words) or cluster (specific subtopic, 1,200–2,500 words). Identify the parent pillar.
- Identify **4–8 priority questions** the post must answer (these become question-phrased H2s).
- Source **≥3 statistics** (named source + date), **≥2 external authoritative citations**, and **≥1 expert quote** before drafting. These are non-negotiable per the Princeton GEO findings — see `references/geo.md`.
- Assign a **named author** with relevant credentials.

### 2. Draft (structure & content)
Follow this exact post skeleton:

```
H1 — matches the user's query (50–60 chars)
Hero image — descriptive alt, NOT lazy-loaded
TL;DR / Key Takeaways — 3–5 bullets, 40–60 words each, BLUF
Intro — 80–120 words: problem, answer, structure preview
H2 (question-phrased) → 40–60 word direct answer → evidence (stat/quote/example w/ source) → context/nuance → optional H3s, list, or table
H2 (question-phrased) → ...
H2 — comparison / framework (use a table)
H2 — common mistakes / what to avoid
H2 — FAQ (4–8 Q&As, FAQPage schema)
Conclusion — 80–120 words: restate answer, link to pillar + 2 clusters, soft CTA
Author bio — credentials + sameAs links
JSON-LD — Article + Person + BreadcrumbList + FAQPage
```

**The five rules that matter most while drafting** (full list in `references/geo.md`):
1. **Answer-first per section.** Every H2 opens with a 40–60 word direct answer; the first sentence (≤25 words) must stand alone as a quotable definition.
2. **Stats, citations, quotes are mandatory.** ≥3 stats with named/dated sources, ≥2 external citations, ≥1 expert quote per post. High fact density wins AI citations.
3. **Definitional language.** Use the "[Term] is [definition]" pattern for every major concept. AI ignores "you might be wondering what X is…".
4. **Question-based H2s.** Phrase headings the way a user would ask an AI ("How does X work?"). Add anchor IDs (`<h2 id="...">`) for deep-link citation targets.
5. **Structured blocks over prose walls.** Numbered lists (5–7 items), bulleted parallel lists, tables for comparisons, FAQs with schema. AI cites tables and FAQs disproportionately.

### 3. Technical / on-page
- **URL slug**: lowercase, hyphens, 3–5 words, ≤60 chars, primary keyword front-loaded, no dates, no stop words.
- **Title tag**: 50–60 chars, `Primary Keyword | Modifier — Brand`.
- **Meta description**: 140–160 chars, keyword + value prop + soft CTA.
- **Headings**: exactly one H1, clean H2/H3 hierarchy, no skipped levels.
- **Images**: descriptive filenames, alt ≤125 chars, WebP/AVIF, dimensions set to prevent layout shift, hero uses `loading="eager"` + `fetchpriority="high"` (NEVER lazy-load the LCP hero), below-fold images `loading="lazy"`.
- **Schema**: ship Article + Person + BreadcrumbList (+ FAQPage if there's an FAQ). Connect entities via `@id`. Template in `references/templates.md`.
- Clean semantic HTML: `<article>`, `<section>`, `<header>`, `<main>`, real `<table>`/`<ol>`/`<ul>`. Don't put critical content behind JavaScript — many AI crawlers don't execute JS.

### 4. Output the file (Astro)
Default deliverable is an **Astro content-collection file** — read `references/astro.md` for the full packaging guide (frontmatter/Zod schema, content collections, image optimization, JSON-LD in the layout, sitemap/canonical/RSS). In short:
- Write the post as `.md` (plain prose) or `.mdx` (needs components/callouts/charts) for `src/content/blog/`. Match the project's existing collection convention and `content.config.ts` schema if you can read it.
- Put the H1 in frontmatter `title` (don't add a body `#` H1). Body starts at `##` with explicit anchor IDs.
- Optimize images via `astro:assets` `<Image />`; hero is `loading="eager"` + `fetchpriority="high"`, never lazy-loaded.
- Generate Article + Person + BreadcrumbList (+ FAQPage) JSON-LD in the layout from frontmatter; template in `references/templates.md` (section A), Astro wiring in `references/astro.md`.
- If the user wants standalone Markdown or HTML instead of Astro, read `/mnt/skills/public/md/SKILL.md` or `/mnt/skills/public/frontend-design/SKILL.md` respectively.
- Save deliverables to `/mnt/user-data/outputs/` and tell the user exactly where each piece goes in their Astro project (`src/content/blog/`, `src/layouts/`, `astro.config.mjs`).
- After drafting, run the post against the **Draft checklist** in `references/checklist.md`.

## Audit workflow

When checking an existing post (the user pastes it, uploads it, or links it):

1. Read `references/checklist.md` — it's the full per-post production checklist (pre-write, draft, technical, post-publish).
2. Go through each item and mark pass / fail / partial. Be specific about what's missing.
3. For GEO-specific gaps (answer-first blocks, stat/citation/quote density, question H2s, schema), cross-reference `references/geo.md`.
4. Report findings as a prioritized list: critical fixes first (missing schema, no answer-first blocks, thin content under 500 words), then high-impact (stat/citation density, internal links), then polish.
5. If asked, produce a corrected version following the Writing workflow.

## Hard constraints (don't violate)

- **Never fabricate statistics, sources, or quotes.** Every stat needs a real, named, dated, ideally linked source. If you can't verify a number, don't invent one — flag it for the user to supply or search for it.
- **Thin content loses.** Don't mass-produce pages under 500 words. Length should match the SERP and intent, not a quota.
- **AI-assisted, human-accountable.** This system uses AI for ideation, research synthesis, and scaffolding — but every post needs a named human author and original elements (proprietary data, real screenshots, customer quotes) that AI alone can't produce. Generic unreviewed AI content was the explicit target of Google's December 2025 core update.
- **Don't fake freshness.** Never bump `dateModified` without substantive changes; Google detects and penalizes it.

## Reference files

Load these as the task requires — don't read all of them up front.

- `references/architecture.md` — Site structure, pillar+cluster model, URL conventions, internal linking rules, anchor text, orphan-page workflow.
- `references/seo.md` — On-page SEO, keyword/intent mapping, E-E-A-T, technical SEO, Core Web Vitals thresholds, image SEO, featured snippets, content length by type, readability targets, refresh cadence, CMS notes.
- `references/geo.md` — What GEO is, the Princeton paper's empirical tactic rankings, the 8 GEO operating rules, llms.txt guidance, per-platform citation behavior, AI crawler access, and how to measure GEO success.
- `references/astro.md` — How to ship the post as an Astro deliverable: content collections, frontmatter/Zod schema, MDX vs MD, `astro:assets` image optimization, JSON-LD in the layout, sitemap/canonical/RSS/robots.
- `references/templates.md` — Copy-paste JSON-LD, AI-friendly robots.txt, writer brief template, refresh trigger checklist.
- `references/checklist.md` — The full per-post production checklist (pre-write / draft / technical / post-publish) used for both writing QA and auditing.

## Caveats worth stating to the user

GEO is a young discipline; the Princeton paper (KDD 2024) is the only large-scale peer-reviewed work, and most other figures come from vendor studies with varying methodology — treat magnitudes as directional, not literal. AI engines change frequently, so the defense is the measurement loop, not loyalty to specific tactics. AI referral attribution is broken for ~60–80% of actual AI exposure, so set stakeholder expectations accordingly. And no amount of schema or structure rescues thin content — genuine expert authorship is the foundation.
