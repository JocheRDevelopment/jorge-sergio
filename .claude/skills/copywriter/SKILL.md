---
name: copywriting
description: Write, rewrite, audit, or critique marketing copy — landing pages, headlines, CTAs, button microcopy, email subject lines and bodies, ads, hero sections, value propositions, taglines, product page copy, signup flows, and onboarding copy. Use this skill whenever the user asks for help with promotional, persuasive, or conversion-focused writing, including phrases like "write a landing page," "punch up this headline," "make this CTA stronger," "rewrite this for our website," "draft a cold email," "this copy is flat — fix it," or whenever they share marketing copy and want feedback. Also use when the user shares an ad, hero section, or signup page and asks "is this any good?" or "what would you change?" Even tasks framed as "just polish this" or "make it sound better" should trigger this skill if the content is marketing/sales copy.
---

# Copywriting

Direct-response copywriting for landing pages, ads, emails, CTAs, and other persuasive marketing copy. The skill compresses what consistently moves conversion across thousands of A/B tests into a working method: research before writing, match the reader's awareness level, lead with specifics, and write so the next sentence is impossible not to read.

## When to do what

**Writing copy from scratch (landing page, email, ad, hero section):** Work through the full method below — research → diagnose awareness → pick a framework → draft → edit.

**Rewriting or punching up existing copy:** Skip the framework selection. Diagnose what's broken (usually: too vague, talks about the company instead of the reader, no proof, weak CTA, wrong awareness stage), then rewrite with the relevant principles below.

**Auditing or critiquing:** Use the audit checklist in `references/audit-checklist.md`. Give specific verdicts on what's working and what's not — don't list every principle, only the ones this piece is violating.

**A single element (one headline, one CTA, one subject line):** Skip research and frameworks. Generate 5–10 variants using the formulas in `references/headline-and-cta-patterns.md`, then recommend the strongest one with reasoning.

## The non-negotiables

Everything else is situational. These five aren't.

### 1. Use the reader's language, not your own

The single biggest determinant of whether copy lands is whether the words on the page match the words in the reader's head. "Plagiarize your customers" (Joanna Wiebe) — mine reviews, support tickets, sales calls, and forum posts for the exact phrases your audience uses about their problem, then write the headline using those phrases.

If the user hasn't done voice-of-customer (VoC) research and you're writing for them cold, **say so explicitly**. Offer to:
- Mine reviews of competitors or adjacent products (Amazon, G2, Capterra, Trustpilot) if URLs or product names are available
- Write provisional copy and flag every claim that needs VoC validation
- Suggest specific questions for them to ask 3–5 customers

Never silently invent customer-sounding language. Generic AI prose ("Transform your workflow with cutting-edge solutions") is the failure mode this skill exists to prevent.

### 2. Be ruthlessly specific

Replace every superlative, round number, and abstraction with something concrete. Claude Hopkins' 1923 rule still wins every A/B test that's tested it:

- "Fast" → "78 seconds"
- "Trusted by leading brands" → "Used by 12,847 marketing teams"
- "Save time" → "Save 4.2 hours per week"
- "Significant ROI" → "Pays for itself if it books you one extra call per month"
- "World-class support" → "Median first response: 11 minutes"

If you don't have the specific number, write `[SPECIFIC NUMBER]` in brackets and flag it. Do not invent statistics.

### 3. Match the awareness stage

Eugene Schwartz's five stages — unaware, problem aware, solution aware, product aware, most aware — are the framework that matters more than any other. Same product, same offer, completely different copy depending on where the reader is.

- **Unaware:** Story, surprising fact, identity hook. Do not pitch.
- **Problem aware:** Validate the pain, name it back to them, then introduce the solution category.
- **Solution aware:** Differentiate against the alternatives they're already considering.
- **Product aware:** Specifics, proof, comparisons. They know you exist.
- **Most aware:** Get out of the way. Offer, price, CTA.

Before writing a single line, ask: where is this reader? If the user can't tell you, infer from the traffic source. Cold ad → problem aware at best. Pricing page visitor → product aware. Comparison-page click → solution aware.

A landing page that runs Stage-5 copy ("Buy now — 30% off") at a Stage-2 audience converts at 1%. A page that runs Stage-1 copy ("In a world where...") at Stage-5 buyers wastes everyone's time.

### 4. One page, one job

Every page, email, and ad has exactly **one** thing it's trying to make the reader do. Multiple competing CTAs of equal visual weight murder conversion. Pick the action, then strip everything that doesn't drive toward it.

This is also the rule for headlines: a headline that tries to communicate three benefits communicates none. Pick the sharpest one.

### 5. Earn every line

Joe Sugarman's Slippery Slide: the only job of the headline is to make them read the first line. The only job of the first line is to make them read the second. If a sentence doesn't pull the reader to the next one, it's costing you conversions — cut it or rewrite it.

This is also why bucket-brigade phrases work: "Here's the thing." "But it gets weirder." "Now, this matters." They're handholds down the page.

## How to write a landing page

If the task is a full landing page, follow this loose sequence. It's a guide, not a checklist — adapt to what the user actually needs.

### Step 1: Diagnose before drafting

Establish, in order:
1. **Who is the reader?** One person, fully described. Not "marketers" — "Maya, 32, head of growth at a 40-person Series B SaaS, frustrated that her last three Webflow contractors ghosted her mid-project."
2. **Where are they on the awareness spectrum?** (See §3 above.)
3. **What is the one action the page must drive?** Sign up, book demo, buy, download, etc.
4. **What's the offer?** Not the product — the specific thing being offered on this page. ("14-day free trial, no card" is an offer. "Our software" is not.)
5. **What proof exists?** Numbers, logos, testimonials, case studies, screenshots, certifications.
6. **What's the objection?** What's the #1 reason a qualified reader doesn't convert?

If the user hasn't given you 3+ of these, ask. Don't draft into a void.

### Step 2: Pick a framework

Match the framework to the awareness stage and offer complexity. Defaults that work:

- **PAS (Problem, Agitate, Solution)** — when pain is acute and conscious. Best for problem-aware audiences.
- **AIDA (Attention, Interest, Desire, Action)** — the default for solution-aware traffic. Works for most landing pages.
- **PASTOR (Problem, Amplify, Story, Transformation, Offer, Response)** — long-form, high-consideration, high-trust-required offers (coaching, B2B SaaS demo pages, courses).
- **BAB (Before, After, Bridge)** — transformation pitches. Strong for hero sections.

Frameworks for section-level work (BAB inside a feature block, FAB for translating specs to outcomes) live in `references/frameworks.md`. Read that file when you need depth or are choosing between options.

### Step 3: Write the CTA first

Joanna Wiebe's principle: write the button copy first, then write only the copy needed to make someone want to click that button. Anything that doesn't drive toward the click is cut.

CTA principles:
- Complete the sentence "I want to ___" — that's the button copy. ("Start my free trial," not "Submit.")
- First person (my/me) beats second person (your/you) in most tests.
- Lead with a strong verb: Get, Start, Claim, See, Build, Try, Send, Download. Avoid "Submit," "Learn More," "Click Here."
- State the value, not the work. "Watch the 3-min demo" beats "Click to view video."
- Pair with reassurance microcopy underneath: "No credit card required," "Cancel anytime," "Join 12,847 teams." (Frame privacy as a guarantee, not a denial — "I guarantee 100% privacy" lifts; "We will never spam you" depresses, because "spam" plants the anxiety.)

### Step 4: Build the page in order

Standard anatomy (adapt as needed):

1. **Hero**: Benefit-led headline + specific subhead + primary CTA + visual showing the desired after-state
2. **Social proof bar**: Logos or a number ("Trusted by 12,000+ teams")
3. **The problem**: Call out the pain in the reader's language
4. **The solution / how it works**: 3–5 benefit blocks
5. **Features as outcomes**: Apply the "So what?" test to every feature
6. **Testimonials, case studies, numbers**: Real names, real photos, real companies. No "John D., NY."
7. **Objection handling**: FAQ, guarantee, risk reversal
8. **Pricing or offer details**
9. **Final CTA** (the same primary CTA, restated)
10. **Trust footer**

Primary CTA repeats 2–4 times down the page. Same action, same words. Don't introduce a new CTA at the bottom.

### Step 5: Headlines

Generate 10+ candidates. Score each against Michael Masterson's 4 U's: **Useful, Urgent, Unique, Ultra-specific** (rate 1–4 on each; if it doesn't score ≥3 on at least three of the four, rewrite). Then pick two competing angles to test (benefit-led vs. curiosity-led vs. problem-led) — not two word-level variants.

Headline mistakes to avoid:
- Cleverness over clarity (puns the reader has to decode)
- Talking about the company ("Welcome to our new platform")
- Vague platitudes ("Innovative solutions for modern teams")
- Buzzword soup ("AI-powered next-gen synergistic workflows")
- No specificity ("Save time and money")

Formula patterns and reference examples in `references/headline-and-cta-patterns.md`.

### Step 6: The "So what?" pass

For every feature claim, ask "So what?" until you reach a concrete emotional or functional outcome. Then write the outcome, not the feature.

- Feature: "Live collaboration"
- So what? → "Two people can edit at once"
- So what? → "You stop emailing v2_final_FINAL.docx around"
- So what? → "You ship the deck without the 11pm panic"

That last one goes on the page.

### Step 7: Edit

Before delivering, run the self-edit pass. (Full checklist in `references/editing-checklist.md`.) The high-leverage subset:

- [ ] "You/your" appears 3–5× more than "we/our"
- [ ] Every claim has proof (number, quote, logo, screenshot)
- [ ] Every feature has a "so what?" benefit translated
- [ ] No sentence over 25 words unless deliberate
- [ ] No paragraph over 4 lines (3 on mobile)
- [ ] CTA copy completes "I want to ___"
- [ ] Headline + CTA could stand alone and still sell the page
- [ ] Flesch Reading Ease ≥ 60 (rough 7th–8th grade)
- [ ] Read-aloud test: no stumble points

Aim to cut 20% of your first-draft word count on the first revision pass.

## Voice and tone

Default to **conversational, specific, second person**. Read it aloud — if you'd never say it in conversation, rewrite it. Cut throat-clearing ("I think," "In my opinion," "It's important to note that," "Basically," "Just"). Replace "in order to" with "to." Active voice except when passive is clearly better.

Match the brand's register if the user provides examples; if they don't, default to clear and warm rather than corporate-formal or aggressively casual.

## Honesty about claims and uncertainty

- **Never invent statistics, customer quotes, or case studies.** If a draft needs one, write `[NEEDS REAL NUMBER]` or `[INSERT CUSTOMER QUOTE]` and call it out.
- **Don't fabricate scarcity or urgency.** "Only 3 seats left" is fine if it's true. Fake countdown timers damage trust more than they lift conversion.
- **Stat-driven claims in the reference doc are A/B test results, not laws.** "First-person CTAs lift CTR 90%" was one Unbounce test. Cite the pattern, not the specific number, when advising users.
- **AI personalization stats are often misquoted.** McKinsey's "5–15% revenue lift" is revenue-share growth, not page-conversion lift. Be precise.

## When to push back on the user

Push back, kindly but directly, if:
- They've written feature-dump copy and ask you to "make it punchier" — the fix isn't punchier verbs, it's translating features to outcomes.
- They want clever wordplay in a headline at a problem-aware audience — clarity beats cleverness when readers don't yet know they need you.
- They want to add a third CTA "just in case" — one page, one job.
- They've fabricated stats or testimonials — refuse, suggest alternatives (case-study placeholders, ranges, "early customers report").
- The brief is vague ("just make it good"). Ask the diagnostic questions in Step 1 before writing.

Don't push back on legitimate stylistic preferences — playful brands get playful copy, serious B2B gets serious copy. The principles above are about what converts; tone is about who the brand is.

## Reference files

Consult these when the SKILL.md guidance isn't enough:

- `references/frameworks.md` — Full breakdown of AIDA, PAS, PASTOR, FAB, BAB, 4 Ps, Star-Story-Solution, ACCA, and when to pick which.
- `references/headline-and-cta-patterns.md` — Headline formulas with examples, the 4 U's scoring guide, CTA button-copy patterns, microcopy templates, power-word categories (Jon Morrow's taxonomy).
- `references/audit-checklist.md` — Structured rubric for critiquing existing copy. Use when the task is "what's wrong with this?"
- `references/editing-checklist.md` — Full self-edit pass, beyond the high-leverage subset above.
- `references/persuasion-and-psychology.md` — Cialdini's principles applied to landing pages, cognitive biases (loss aversion, anchoring, decoy effect), storytelling patterns.
- `references/voice-of-customer.md` — How to mine reviews, run interviews, write VoC questions, and harvest sticky phrases.
- `references/awareness-and-sophistication.md` — Schwartz's five stages, how to diagnose, market sophistication levels.
- `references/full-reference.md` — The complete source document this skill was built from. Read for deep dives, attribution, expert quotes, or when answering a question the focused references don't cover.

The focused references are sized for in-context reading. `full-reference.md` is the comprehensive backup — go there when you need depth, citations, or topics not covered elsewhere.
