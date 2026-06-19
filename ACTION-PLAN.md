# SEO Action Plan: subhams.site

Audit date: 2026-06-19  
Current score: 61 / 100  
Target after first cleanup pass: 78+

Remediation update: completed locally on 2026-06-19. Build passes, `/blog`, `/robots.txt`, `/sitemap.xml`, `/og-image.jpg`, and `/llms.txt` return 200 on the local production server. Browser verification found no horizontal overflow and no undersized interactive targets at 1440 px desktop or 390 px mobile.

## This Week

### 1. Fix production metadata

Status: Done

Priority: High  
Impact: High  
Effort: Low  
Files: `src/app/layout.tsx`, `public/og-image.jpg`

Actions:

- Change `metadataBase` from `https://subhamkumar.dev` to `https://subhams.site`.
- Change `authors.url` and `openGraph.url` to `https://subhams.site/`.
- Add `alternates.canonical` for the homepage.
- Replace `@yourTwitterHandle` with the real handle or remove it.
- Add a real 1200 x 630 `public/og-image.jpg`.

Acceptance checks:

- Homepage renders `<link rel="canonical" href="https://subhams.site/">`.
- `og:url` is `https://subhams.site/`.
- `og:image` resolves with HTTP 200.

### 2. Add robots.txt and sitemap.xml

Status: Done

Priority: High  
Impact: High  
Effort: Low  
Files: `src/app/robots.ts`, `src/app/sitemap.ts`

Actions:

- Add allow-all robots configuration.
- Reference `https://subhams.site/sitemap.xml` from robots.
- Add sitemap entry for the homepage.
- Add future entries when real blog/project pages exist.

Acceptance checks:

- `https://subhams.site/robots.txt` returns 200.
- `https://subhams.site/sitemap.xml` returns 200.
- Sitemap includes `https://subhams.site/`.

### 3. Fix broken and placeholder destinations

Status: Done

Priority: High  
Impact: Medium  
Effort: Low to Medium  
Files: `src/components/portfolio/Blogs.tsx`, `src/components/portfolio/Projects.tsx`

Actions:

- Implement `/blog` or point "View All Posts" to a working external blog profile.
- Replace `href="#"` on "View All Projects" with a real route or remove the link.
- Check all demo links and use clear labels when demo and code point to the same URL.

Acceptance checks:

- No linked internal URL returns 404.
- No visible CTA uses `href="#"`.

### 4. Add Person and WebSite schema

Status: Done

Priority: High  
Impact: Medium  
Effort: Low  
Files: `src/app/layout.tsx` or `src/app/page.tsx`

Actions:

- Add JSON-LD for `Person`.
- Add JSON-LD for `WebSite`.
- Include GitHub and LinkedIn in `sameAs`.
- Keep schema facts aligned with visible page content.

Acceptance checks:

- Rendered HTML includes `application/ld+json`.
- Schema validates in Rich Results Test or Schema Markup Validator.

## This Month

### 5. Fix mobile overflow and tap targets

Status: Done

Priority: Medium  
Impact: Medium  
Effort: Medium  
Files: `src/components/common/Navbar.tsx`, hero/social link components

Actions:

- Make the mobile nav button at least 44 x 44 px.
- Ensure the mobile button is inside the viewport.
- Add padding around social icon links.
- Re-run a 390 px viewport check and confirm `scrollWidth <= clientWidth`.

Acceptance checks:

- No horizontal scroll on a 390 px viewport.
- Main interactive targets are at least 44 px tall/wide or have equivalent padded hit area.

### 6. Replace generic imagery

Status: Done

Priority: Medium  
Impact: Medium  
Effort: Medium  
Files: project/blog/certificate components and `public/`

Actions:

- Replace placeholder project images with real screenshots.
- Replace generic blog alt text with article-specific alt text.
- Add real certificate or project visuals where available.
- Remove unused large public assets.

Acceptance checks:

- No visible key card uses generic placeholder imagery.
- No important image has generic alt text like "Blog Post 2".
- Largest unused assets are removed or compressed.

### 7. Improve portfolio content for search snippets

Priority: Medium  
Impact: Medium  
Effort: Medium  
Files: homepage sections

Actions:

- Add a concise "About Subham Kumar" answer block.
- Add a "Selected impact" block with measurable outcomes.
- Align blog excerpts with actual article topics.
- Add project detail pages for the strongest projects.

Acceptance checks:

- Page has a concise, factual intro that can stand alone in a snippet.
- Project pages include problem, stack, contribution, outcome, and links.

## Backlog

### 8. Add `llms.txt`

Status: Done

Priority: Low  
Impact: Medium  
Effort: Low

Actions:

- Add a short `public/llms.txt` with site purpose, author identity, core expertise, and canonical URLs.

### 9. Add security headers

Status: Done

Priority: Low  
Impact: Low to Medium  
Effort: Low  
Files: `next.config.ts`

Actions:

- Add `X-Content-Type-Options`.
- Add `Referrer-Policy`.
- Consider a conservative `Permissions-Policy`.
- Add CSP only after checking external image/script requirements.

## Retest Checklist

Run these after deployment:

```bash
curl -I https://subhams.site/
curl -I https://subhams.site/robots.txt
curl -I https://subhams.site/sitemap.xml
curl -I https://subhams.site/og-image.jpg
curl -I https://subhams.site/blog
```

Also retest:

- 390 px mobile viewport has no horizontal scroll.
- Rendered HTML contains canonical and JSON-LD.
- Social preview card shows the correct image and domain.
