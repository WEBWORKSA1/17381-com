# 17381.com — Phase-wise Build Prompts

Concept: **17381 Numbers Lab** — free business, money & AI calculators, an any-number analyzer and plain-English guides, monetised with Google AdSense and built around a high-intent "Free Numbers Check-up" lead funnel. Static site, GitHub Pages (main branch, root), custom domain 17381.com.

Global rules for every phase:
- AdSense head code on every page: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>`
- Top bar on every page: "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership" → https://web.works/contact
- One inbox only, never printed in HTML/JS source as plain text: all forms post via AJAX to FormSubmit using an encoded address assembled at runtime; "Email us" links open mailto built at runtime.
- No "17381" trademark claims; include a Trademark & Copyright disclosure page.
- Static HTML/CSS/vanilla JS only, `.nojekyll`, root-relative links, mobile-first, WCAG AA contrast, Lighthouse 90+.

---

## Phase 1 — Foundation & brand
> Create a static site skeleton for 17381.com: `index.html`, `assets/css/main.css`, `assets/js/main.js`, `favicon.svg`, `site.webmanifest`, `robots.txt`, `sitemap.xml`, `ads.txt`, `CNAME` (17381.com), `.nojekyll`, `404.html`. Design system: deep ink navy background, mint (#3EE6B0) and amber (#FFB547) accents, light theme toggle, numerals in a monospaced face (JetBrains Mono), UI in Inter. Logo = the five digits in tiles. Shared header (logo, nav: Tools, Analyzer, Guides, Videos, Check-up, Support, Contests), the sitewide sponsor/contact top bar, footer with all legal links, cookie notice, back-to-top, AdSense script in `<head>`.

## Phase 2 — Number Analyzer (signature tool)
> Build `/number.html?n=` — any integer up to 2^53: prime test, prime factorisation, divisors, divisor sum, abundant/deficient, sphenic/semiprime, digit sum/root, palindrome, reverse & reverse-is-prime, nearest primes, binary/octal/hex/base-36, Roman (≤3999), English words (international + Indian lakh/crore), square/cube/roots/logs, Collatz steps, date readings (DD/MM/YY, Unix day, Excel serial), SHA-256 via SubtleCrypto, code snippets, prev/next/random, shareable URL and copy buttons. Default number 17381. Add `/17381.html`, a long-form "story of 17381" page.

## Phase 3 — Business, money & AI calculators
> Build `/tools.html` (searchable, filterable hub) and 13 tool pages in `/tools/`: profit margin & markup, break-even, ROI, CAGR, compound growth, loan payment & amortisation, cash runway, unit economics (LTV:CAC), AI token cost, AI automation ROI, percentage (3 modes), number-to-words cheque writer, base converter. Each page: calculator (instant, client-side, validated), result cards that "show the work", 400–700 words (how it works, formula, worked example, mistakes to avoid, FAQ), related tools, in-content ad slot, "Email me this result" micro lead form, and Check-up CTA.

## Phase 4 — Content engine for AdSense approval & SEO
> Write 8 original guides in `/guides/` (the 10 numbers every owner should know, break-even, margin vs markup, cash runway, CAGR vs average growth, pricing psychology, lucky & unlucky numbers in global commerce, primes & internet security). Add `/videos.html` with click-to-load YouTube embeds (privacy-enhanced youtube-nocookie) grouped by topic, plus about, editorial policy, disclaimer. JSON-LD (Organization, WebSite+SearchAction, FAQPage on tools, Article on guides), canonical tags, Open Graph.

## Phase 5 — Lead generation funnel
> Build `/checkup.html`: a 3-step form (business profile → numbers & pain point → contact + consent) with progress indicator, benefit stack, objection handling FAQ and privacy reassurance. Add sticky mobile CTA, contextual CTAs in every tool result, end-of-guide CTA blocks and the micro "email me this result" form. All submissions AJAX to the private inbox with honeypot spam trap, success state, and session flag to stop repeat prompts.

## Phase 6 — Support, donations, contests, hiring, advertising
> `/support.html`: supporter tiers ($5/$25/$100/custom, one-time or monthly), "where each dollar goes" bars (operations, promotion & marketing, hiring talent, contest prizes), pledge form (we reply with a secure payment link), supporter wall. `/contests.html` + `/rules.html`: free, skill-based monthly Number Challenge with prize table, judging criteria, entry form, winners gallery. `/careers.html`: open freelance roles + talent pool form. `/advertise.html`: sponsored calculators, category sponsorship, newsletter, lead partnerships, media kit request form.

## Phase 7 — Legal & trust
> `/privacy.html` (Google AdSense/DoubleClick cookie wording, opt-out links, GDPR/CCPA/PIPEDA rights), `/terms.html`, `/cookies.html`, `/disclaimer.html` (not financial advice), `/editorial-policy.html`, `/trademark.html` (trademark & copyright disclosure: no affiliation with any party using "17381"; third-party marks and embedded videos belong to their owners), `/contact.html`.

## Phase 8 — QA, deploy, grow
> Validate links, check no plain-text inbox address exists in any file, confirm AdSense code + top bar on every page, test forms, run Lighthouse mobile. Push to `WEBWORKSA1/17381-com` main, enable GitHub Pages (main / root), set custom domain 17381.com + enforce HTTPS. Submit sitemap to Google Search Console, apply for AdSense, enable Auto ads and the Google CMP. Growth: publish 2 guides/week, one short video per tool, monthly contest announcements, outreach to accountants/lenders for lead partnerships.
