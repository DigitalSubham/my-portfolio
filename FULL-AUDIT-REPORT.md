# Full SEO Audit Report: subhams.site

Audit date: 2026-06-19  
Audited URL: https://subhams.site/  
Detected site type: personal portfolio / professional profile with blog and project content  
SEO health score: 61 / 100

Remediation update: the issues in this report were fixed locally on 2026-06-19. The post-fix local score is estimated at 86 / 100 pending production deployment and live retest. Local verification shows 200 responses for `/blog`, `/robots.txt`, `/sitemap.xml`, `/og-image.jpg`, and `/llms.txt`; corrected canonical/Open Graph metadata; JSON-LD present; no horizontal overflow; and no undersized interactive targets in the checked desktop/mobile viewports.

## Executive Summary

The site is indexable at the homepage level and presents a clear personal brand, work history, projects, skills, blog links, certificates, and contact information. The biggest SEO risk is not content absence; it is implementation polish around crawl discovery, canonical metadata, structured data, social preview assets, mobile layout, and several placeholder or broken destinations.

No confirmed critical indexing blocker was found. The homepage returned HTTP 200, did not expose a `noindex` directive, and rendered meaningful content in a browser. However, several high-impact issues are still present and should be fixed before investing in more content.

Top issues:

1. `robots.txt` returns 404.
2. `sitemap.xml` returns 404.
3. No self-referencing canonical link is present on the homepage.
4. Open Graph and Twitter metadata still point to `subhamkumar.dev`, not `subhams.site`.
5. The configured social image `/og-image.jpg` is missing on the audited domain.
6. No Schema.org JSON-LD was detected.
7. `/blog` is linked from the page but returns 404.
8. Mobile viewport has horizontal overflow: 454 px scroll width on a 390 px viewport.

Quick wins:

1. Change `metadataBase`, `authors.url`, `openGraph.url`, and social images in `src/app/layout.tsx`.
2. Add `src/app/robots.ts` and `src/app/sitemap.ts`.
3. Add `alternates.canonical` for `https://subhams.site/`.
4. Add `public/og-image.jpg` or update metadata to an existing image.
5. Replace placeholder project/certificate/blog images with real screenshots or remove generic placeholders.
6. Fix `/blog` or change the "View All Posts" link to a working page.
7. Give mobile buttons and links at least 44 px tap targets.

## Evidence Collected

Live crawl:

- Homepage: HTTP 200, final URL `https://subhams.site/`
- HTML size: 182,445 decoded bytes
- `robots.txt`: 404
- `sitemap.xml`: 404
- `/blog`: 404
- `/resume.pdf`: HTTP 200
- Homepage title: `Subham Kumar`
- Meta description length: 133 characters
- H1 count: 1
- Detected images: 20
- Detected JSON-LD scripts: 0

Browser checks:

- Desktop screenshot: `screenshots/subhams-desktop.png`
- Mobile screenshot: `screenshots/subhams-mobile.png`
- Desktop viewport: no horizontal overflow
- Mobile viewport: horizontal overflow detected, `scrollWidth` 454 vs `clientWidth` 390
- Console errors: none captured
- Desktop load timing from browser run: 2.29 s wall time, 24 resources, 7 script resources
- Mobile load timing from browser run: 6.49 s wall time, 25 resources, 7 script resources

Source evidence:

- Metadata and old domain references: `src/app/layout.tsx`
- Mobile nav button likely contributing to overflow/tap target issue: `src/components/common/Navbar.tsx`
- Placeholder project images and `href="#"`: `src/components/portfolio/Projects.tsx`
- `/blog` link and placeholder blog images: `src/components/portfolio/Blogs.tsx`

Prior cache:

- Used cached baseline from 2026-06-16 as comparison context only.
- Live findings on 2026-06-19 confirm most major issues remain.

## Category Scores

| Category | Weight | Score | Notes |
|---|---:|---:|---|
| Technical SEO | 22% | 70 | Homepage indexable, HTTPS ok, but missing robots/sitemap and broken internal `/blog` destination. |
| Content Quality | 23% | 64 | Good portfolio depth, but content is broad, mostly single-page, and lacks extractable summary blocks. |
| On-Page SEO | 20% | 76 | Title, description, H1, headings, and internal sections exist; canonical and metadata domain mismatch hurt. |
| Schema / Structured Data | 10% | 35 | No JSON-LD detected. |
| Performance | 10% | 52 | Reasonable resource count, but mobile browser load was slow and several images/assets need cleanup. |
| AI Search Readiness | 10% | 45 | Clear identity, but weak structured facts, no llms.txt, no schema, and limited answer-first passages. |
| Images | 5% | 58 | Alt text exists, but many placeholders remain and social image is missing. |

Weighted score: 61 / 100

## Technical SEO

### High: Missing robots.txt

`https://subhams.site/robots.txt` returned 404. This does not automatically block indexing, but it removes a standard crawler control surface and prevents declaring sitemap location.

Recommendation:

Create `src/app/robots.ts` with an allow-all policy and a sitemap reference:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://subhams.site/sitemap.xml",
  };
}
```

### High: Missing sitemap.xml

`https://subhams.site/sitemap.xml` returned 404. For a small portfolio this is not fatal, but it is still a missed discovery and freshness signal.

Recommendation:

Create `src/app/sitemap.ts` with at least the homepage. Add future real routes when blog/project pages are created.

### High: Broken internal destination

The crawl found `https://subhams.site/blog` returning 404. Source shows the "View All Posts" link in `src/components/portfolio/Blogs.tsx` points to `/blog`.

Recommendation:

Either implement the `/blog` route or change the link to a working external blog index such as Hashnode/DEV until a local route exists.

### Medium: Security headers are partial

The Vercel response includes `Strict-Transport-Security`, which is good. I did not see stronger hardening headers such as `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy` in the crawl response.

Recommendation:

Add conservative security headers in `next.config.ts`, especially `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`.

## On-Page SEO

### High: Canonical tag missing

The homepage has no rendered `<link rel="canonical">`. This matters because the source still references an old domain in metadata, increasing ambiguity about the preferred URL.

Recommendation:

In `src/app/layout.tsx`, set:

```ts
alternates: {
  canonical: "https://subhams.site/",
}
```

### High: Metadata points to old domain

`src/app/layout.tsx` uses `https://subhamkumar.dev` for `authors.url`, `metadataBase`, and `openGraph.url`. The live homepage therefore renders:

- `og:url`: `https://subhamkumar.dev`
- `og:image`: `https://subhamkumar.dev/og-image.jpg`
- `twitter:image`: `https://subhamkumar.dev/og-image.jpg`

`https://subhams.site/og-image.jpg` returned 404, and the older `subhamkumar.dev` hostname did not resolve from this environment.

Recommendation:

Update production metadata to `https://subhams.site`, add a real OG image, and replace `@yourTwitterHandle` with a real handle or remove it.

### Medium: Placeholder and empty links weaken quality signals

`src/components/portfolio/Projects.tsx` includes placeholder images for the first three projects and a `View All Projects` link with `href="#"`.

Recommendation:

Use real project screenshots for the mobile apps, and either add a project index route or remove the placeholder "View All Projects" link.

## Content Quality

The homepage has substantial content: work experience, project summaries, skills, blog links, certificates, and contact details. It is strong as a human portfolio, but less strong as a search result landing page because many claims are embedded in card text rather than concise, extractable sections.

Strengths:

- Clear personal brand and job role.
- Specific experience claims: 200+ ERP modules, 20,000+ DCS, 100,000+ farmers, 20M+ students.
- Projects include technologies and links.
- External profiles are present.

Gaps:

- No concise "About Subham Kumar" answer block near the top.
- No dedicated project detail pages for long-tail queries.
- Blog cards link externally, but the local `/blog` route is missing.
- Some blog snippets do not match their titles closely, for example the resume article snippet mentions React Hooks.

Recommendations:

1. Add a short, factual intro paragraph designed for snippets: who you are, what you build, primary stack, location/availability if relevant.
2. Add individual project pages for the strongest projects.
3. Align each blog card excerpt with the actual article.
4. Add author credentials near blog links: role, experience, and technical focus.

## Schema And Structured Data

No JSON-LD was detected on the homepage.

Recommended schema:

- `Person`
- `WebSite`
- `ProfilePage` or `WebPage`
- `BreadcrumbList`
- `BlogPosting` for each real article if local article pages are added

Example direction:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Subham Kumar",
  "url": "https://subhams.site/",
  "jobTitle": "Full Stack Developer",
  "sameAs": [
    "https://github.com/DigitalSubham",
    "https://www.linkedin.com/in/subham-kr"
  ]
}
```

## Performance

The site is statically served from Vercel and has a manageable number of resources, but the mobile browser run was slower than expected:

- Desktop wall-load run: 2.29 s
- Mobile wall-load run: 6.49 s
- Homepage decoded HTML: 182 KB
- CSS asset observed: 52 KB
- Script resources: 7
- Images: 20

Asset observations:

- `public/avatar.png`: 2.5 MB
- `public/subham.png`: 1.7 MB
- `public/shubham.jpg`: 948 KB
- `public/projects/youtube_Clone.svg`: 9.3 MB, currently a large public asset even if not rendered in the live homepage
- Several project and blog images are placeholder SVGs.

Recommendations:

1. Compress large local images and convert suitable assets to AVIF/WebP.
2. Remove unused large assets from `public/`, especially the 9.3 MB SVG if it is not needed.
3. Add `priority` only to the true above-the-fold hero image and keep below-fold images lazy.
4. Audit remote Hashnode image delivery because one rendered image showed `naturalWidth: 0` during the browser pass.

## Images

Alt text is present for all detected homepage images, which is a good baseline. The issue is quality and relevance:

- Many project images use generic `/placeholder.svg`.
- Blog images use generic alt text such as "Blog Post 2".
- Social preview image is missing.
- Some rendered SVG placeholders report unusual intrinsic dimensions.

Recommendations:

1. Add real screenshots for key projects.
2. Use descriptive blog image alt text based on the article topic.
3. Add `public/og-image.jpg` at 1200 x 630.
4. Replace certificate placeholder with actual certificate image or remove the image slot.

## Mobile And Visual SEO

The mobile browser run detected horizontal overflow:

- Viewport width: 390 px
- Document scroll width: 454 px

The mobile nav button also measured 24 x 24 px, below the 44 x 44 px recommended touch target. Several social and inline links are also 24 px tall.

Recommendations:

1. Make the mobile menu button at least `min-h-11 min-w-11`.
2. Check the header layout around the logo and menu button; the menu button appeared outside the visible viewport in the browser measurement.
3. Increase social icon link hit areas with padding while keeping the icon size visually compact.
4. Add a simple mobile menu or hide the button until it has functionality.

## AI Search Readiness

The homepage has useful facts, but AI answer engines will have to infer too much from a long single page.

Recommendations:

1. Add schema so identity, profiles, role, and projects are machine-readable.
2. Add answer-first sections such as "What I build", "Primary stack", and "Selected impact".
3. Add `llms.txt` with concise site context and important URLs.
4. Add dedicated project pages with problem, stack, contribution, result, and links.

## Prioritized Issues

| Priority | Issue | Recommended owner |
|---|---|---|
| High | Missing `robots.txt` and `sitemap.xml` | Next app routes |
| High | Canonical missing and metadata points to old domain | `src/app/layout.tsx` |
| High | Social preview image missing | `public/og-image.jpg` and metadata |
| High | `/blog` returns 404 | Blog route or link target |
| High | No structured data | Root layout or homepage component |
| Medium | Mobile horizontal overflow | Navbar/header layout |
| Medium | Tap targets below 44 px | Navbar, social links, card links |
| Medium | Placeholder images and `href="#"` links | Project/blog content |
| Medium | Large public image assets | Image optimization |
| Low | Add optional security headers | `next.config.ts` |

## Limitations

- Google Search Console, GA4, CrUX API, Moz, Bing Webmaster, and DataForSEO credentials were not available.
- Performance results are browser-lab observations, not real-user Core Web Vitals.
- The crawl was intentionally scoped to public linked pages from the homepage and key standard SEO endpoints.
- The installed audit skill referenced helper scripts that were not present locally, so equivalent local crawl/browser tooling was used.
