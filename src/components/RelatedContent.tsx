import { Link } from "react-router-dom";
import { useMemo } from "react";

/**
 * Internal linking system for SEO.
 * Shows related pages based on category, keywords, or manual selection.
 * Pass `links` as an array of {to, title, description} objects.
 */
interface RelatedLink {
  to: string;
  title: string;
  description?: string;
}

export function RelatedContent({
  links,
  title = "Related Content",
}: {
  links: RelatedLink[];
  title?: string;
}) {
  if (!links || links.length === 0) return null;
  return (
    <nav className="mt-12 border-t border-[#E2E8F0] pt-8" aria-label="Related content">
      <h2 className="mb-4 text-xl font-bold text-[#1B2A4A]">{title}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              to={link.to}
              className="block rounded-lg border border-[#E2E8F0] p-4 transition hover:border-[#3B82F6] hover:shadow-sm"
            >
              <span className="font-semibold text-[#3B82F6]">{link.title}</span>
              {link.description && (
                <span className="mt-1 block text-sm text-[#64748B]">{link.description}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Auto-link glossary terms within HTML text.
 * Replaces occurrences of glossary terms with internal links.
 */
const GLOSSARY_LINKS: { term: string; slug: string; pattern: RegExp }[] = [];

export function autoLinkGlossaryTerms(html: string, terms: { term: string; slug: string }[]) {
  // Sort by length descending so longer terms get linked first
  const sorted = [...terms].sort((a, b) => b.term.length - a.term.length);
  let result = html;
  for (const { term, slug } of sorted) {
    // Only link first occurrence, avoid inside existing <a> tags
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b(?!<)`, "i");
    result = result.replace(regex, `<a href="/glossary/${slug}" class="text-[#3B82F6] underline hover:text-[#2563EB]">${term}</a>`);
  }
  return result;
}

/**
 * Get related blog posts by category.
 */
export function getRelatedPosts(
  currentSlug: string,
  category: string,
  allPosts: { slug: string; title: string; excerpt: string; category: string }[],
  limit = 4
) {
  return allPosts
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, limit)
    .map((p) => ({
      to: `/blog/${p.slug}`,
      title: p.title,
      description: p.excerpt,
    }));
}

/**
 * Cross-link to relevant calculators based on content.
 */
export function getRelevantCalculators(category: string) {
  const calcMap: Record<string, RelatedLink[]> = {
    "Financial Independence": [
      { to: "/calculators/freedom-number", title: "Freedom Number Calculator", description: "How much MRR do you need to quit?" },
      { to: "/calculators/micro-saas-pricing", title: "Micro-SaaS Pricing Calculator", description: "Find your optimal price point" },
    ],
    "Micro-SaaS": [
      { to: "/calculators/micro-saas-pricing", title: "Micro-SaaS Pricing Calculator", description: "Find your optimal price point" },
      { to: "/calculators/freedom-number", title: "Freedom Number Calculator", description: "Calculate your exit number" },
    ],
    "Exit Planning": [
      { to: "/calculators/freedom-number", title: "Freedom Number Calculator", description: "When can you quit?" },
      { to: "/calculators/business-valuation", title: "Business Valuation Calculator", description: "What's your SaaS worth?" },
    ],
  };
  return calcMap[category] || [];
}
