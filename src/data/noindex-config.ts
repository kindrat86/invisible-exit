/**
 * NOINDEX config — thin programmatic pSEO pages that suppress crawl budget.
 * These URL patterns are excluded from sitemaps and marked noindex,follow.
 * 
 * Rationale: pages built from cross-products (profession × state, city × profession, 
 * etc.) have near-zero unique body content beyond swapped variable names.
 * 
 * Pages NOT in this list: blog, glossary, compare, guides, best tools, calculators,
 * data reports, resources, banking, tax-guides, nda-guides, insurance, time-frameworks,
 * niches, budget pages, hours pages, core marketing pages, single-profession idea pages
 * (/ideas/accountant, /ideas/software-engineer) — all have substantial unique content.
 */
export const NOINDEX_URL_PATTERNS: string[] = [
  "/ideas/",              // matches ALL /ideas/* — BUT overrides below keep single-profession pages
  "/cities/",             // city × profession cross-pages + individual city pages
  "/revenue/",            // revenue targets (extremely thin ~454 chars/entry)
  "/break-even/",         // break-even analysis (thin)
  "/cost-of-waiting/",    // cost of waiting (thin)
  "/non-compete/",        // non-compete matrix (thin legal template)
  "/first-year/",         // first year roadmaps (thin)
  "/mistakes/",           // profession mistakes (thin)
  "/reddit/",             // reddit strategies (thin)
  "/pricing-models/",     // pricing models (thin)
  "/skills/",             // skill monetization (thin template)
  "/audience/",           // audience/demographic pages (thin)
];

/**
 * Check if a URL path should be noindexed.
 * Page-specific overrides: homepage, /freedom, /site-index.html are NEVER noindexed.
 * Single-profession idea pages (/ideas/accountant) are KEPT — only cross-products 
 * (/ideas/accountant/in/california, /ideas/accountant/with/cursor) get noindexed.
 */
export function shouldNoindex(path: string): boolean {
  // NEVER noindex these
  if (path === "/" || path === "" || path.startsWith("/freedom") || path === "/site-index.html") {
    return false;
  }
  
  // KEEP single-profession idea pages (e.g. /ideas/accountant)
  // but NOINDEX cross-products (e.g. /ideas/accountant/in/california)
  if (path.startsWith("/ideas/")) {
    const segments = path.split("/").filter(Boolean);
    // /ideas/{profession} → 2 segments → KEEP
    // /ideas/{profession}/in/{state} → 4 segments → NOINDEX
    // /ideas/{profession}/with/{tool} → 4 segments → NOINDEX
    if (segments.length === 2) return false; // single profession page — KEEP
    return true; // cross-product — NOINDEX
  }
  
  return NOINDEX_URL_PATTERNS.filter(p => p !== "/ideas/").some(pattern => path.startsWith(pattern));
}
