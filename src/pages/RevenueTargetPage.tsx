import { useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { revenueTargets, type RevenueTarget } from "@/data/revenue-targets";

export default function RevenueTargetPage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;

  const entry = revenueTargets.find((r) => r.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <>
      <SEOHead
        title={entry.metaTitle}
        description={entry.metaDescription}
        canonical={`https://invisibleexit.com/revenue/${entry.slug}`}
      />
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-4">
          <a href="/" className="text-blue-600 hover:underline">Home</a> ›{" "}
          <span>Revenue Targets</span>
        </nav>
        <h1 className="text-3xl font-bold mb-4">{entry.h1}</h1>
        <p className="text-lg text-muted-foreground mb-6">{entry.intro}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">The Revenue Math</h2>
          <p className="mb-3"><strong>Monthly Target:</strong> {entry.monthlyRevenue}</p>
          <p className="mb-3"><strong>Customer Count:</strong> {entry.customerMath}</p>
          <p className="mb-3"><strong>Pricing Strategy:</strong> {entry.pricingStrategy}</p>
          <p className="mb-3"><strong>Timeline:</strong> {entry.timeline}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Best Micro-SaaS Ideas for {entry.profession}</h2>
          <ul className="list-disc pl-6 space-y-2">
            {entry.bestIdeas.map((idea, i) => (
              <li key={i}>{idea}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">FAQs</h2>
          {entry.faqs.map((faq, i) => (
            <div key={i} className="mb-4">
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </section>

        <div className="text-center py-8 border-t">
          <a href="/freedom" className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800">
            Calculate Your Freedom Number →
          </a>
        </div>

        <RelatedContent />
      </main>
      <Footer />
    </>
  );
}
