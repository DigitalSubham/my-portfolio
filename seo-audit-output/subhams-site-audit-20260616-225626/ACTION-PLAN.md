# Action Plan

## Priority Queue

| Severity | Issue |
|----------|-------|
| Critical | Content: Several long sentences may reduce scannability. |
| Critical | Content: The page has limited answer-first formatting such as lists or tables. |
| Critical | Geo: Author/date attribution is weak in the visible content. |
| Critical | Geo: No llms.txt file was detected. |
| Critical | Geo: No strong 134-167 word self-contained answer block was detected. |
| Critical | Performance: INP is above target at 348ms. |
| Critical | Performance: LCP is above target at 2.89s. |
| Critical | Performance: Real-user/PageSpeed performance data was unavailable, so the report uses deterministic lab heuristics. |
| Critical | Schema: No schema markup was detected on the page. |
| High | Technical: No actual `<link rel="canonical">` tag was found in the homepage HTML. |
| High | On Page: Open Graph and Twitter image URLs point to `subhamkumar.dev` instead of `subhams.site`. |
| High | Visual: Mobile horizontal scroll and undersized touch targets were detected. |
| Critical | Schema: Recommended schema type(s) are missing: WebPage, WebSite, Organization. |

## Recommended Actions

- **Technical**: Publish a root-level robots.txt that clearly references the sitemap.
- **Technical**: Add a self-referencing canonical tag for `https://subhams.site/` to stabilize indexation signals.
- **Technical**: Add baseline security headers such as CSP, HSTS, X-Frame-Options, and X-Content-Type-Options.
- **Technical**: Prioritize the hero/LCP element, reduce render-blocking resources, and compress above-the-fold assets.
- **Technical**: Reduce main-thread JavaScript work and defer non-critical third-party scripts.
- **Technical**: Consider IndexNow if faster Bing/Yandex discovery matters to the publishing workflow.
- **Performance**: Prioritize the hero/LCP element, reduce render-blocking resources, and compress above-the-fold assets.
- **Performance**: Reduce main-thread JavaScript work and defer non-critical third-party scripts.
- **Performance**: Provide `PAGESPEED_API_KEY` or re-run in an environment with PageSpeed API access for richer CWV evidence.
- **On Page**: Tighten the title tag so it stays in the 50-60 character band where possible.
- **On Page**: Update `og:url`, `og:image`, `twitter:image`, and `twitter:creator` to match the live domain and brand.
- **Content**: Use bullets, comparisons, or short structured sections to improve extractability for AI citations.
- **Content**: Shorten dense sentences and tighten paragraph structure for easier reading.
- **Visual**: Remove mobile horizontal overflow and make social/icon tap targets at least 44px.
