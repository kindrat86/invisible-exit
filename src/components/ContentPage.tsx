import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ContentPageProps {
  title: string;
  description: string;
  url: string;
  breadcrumbs: BreadcrumbItem[];
  children: ReactNode;
  ogImage?: string;
  maxWidth?: "narrow" | "standard";
}

export function ContentPage({
  title,
  description,
  url,
  breadcrumbs,
  children,
  ogImage,
  maxWidth = "narrow",
}: ContentPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SEOHead title={title} description={description} url={url} image={ogImage} />
      <article className={`mx-auto px-4 sm:px-6 py-12 sm:py-16 ${maxWidth === "narrow" ? "max-w-3xl" : "max-w-5xl"}`}>
        {/* Breadcrumbs */}
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-muted-foreground/50">/</span>}
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-primary transition-colors">{crumb.label}</Link>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        {children}
      </article>
      <Footer />
    </div>
  );
}

// ── CTA Box ──
export function CTABox({
  title = "Ready to find your freedom number?",
  description = "See exactly how close you are to financial independence.",
  buttonText = "Calculate Your Freedom Number",
  buttonHref = "/freedom",
  secondaryButtonText,
  secondaryButtonHref,
}: {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}) {
  return (
    <div className="mt-12 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-light p-8 text-center text-white shadow-lg">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-white/80">{description}</p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          to={buttonHref}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-primary shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          style={{ minHeight: "48px" }}
        >
          {buttonText} →
        </Link>
        {secondaryButtonText && secondaryButtonHref && (
          <Link
            to={secondaryButtonHref}
            className="inline-flex items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
            style={{ minHeight: "44px" }}
          >
            {secondaryButtonText}
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Disclaimer ──
export function Disclaimer({ text }: { text?: string }) {
  return (
    <p className="mt-8 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground/60">
      <strong className="font-semibold">Disclaimer:</strong>{" "}
      {text || "This article is for informational and educational purposes only and does not constitute legal, financial, or tax advice. Consult a qualified professional before making decisions based on this content."}
    </p>
  );
}

// ── Scrollable table wrapper ──
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="table-wrap my-6">
      {children}
    </div>
  );
}

// ── Section heading ──
export function SectionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`mt-12 mb-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl scroll-margin-top ${className}`}>
      {children}
    </h2>
  );
}

// ── FAQ Accordion using native <details> for zero-JS ──
export function FAQAccordion({
  faqs,
  title = "Frequently Asked Questions",
}: {
  faqs: { question: string; answer: string }[];
  title?: string;
}) {
  if (!faqs || faqs.length === 0) return null;
  return (
    <section className="mt-12">
      <SectionHeading>{title}</SectionHeading>
      <div className="mt-4 space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-xl border border-border bg-card overflow-hidden transition-colors hover:border-border-hover"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-semibold text-foreground select-none [&::-webkit-details-marker]:hidden">
              {faq.question}
              <svg
                className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
