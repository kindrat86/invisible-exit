import { useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { skills, type SkillPage as SkillPageData } from "@/data/skills";

export default function SkillMonetizationPage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;

  const entry = skills.find((s) => s.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <>
      <SEOHead
        title={entry.metaTitle}
        description={entry.metaDescription}
        canonical={`https://invisibleexit.com/skills/${entry.slug}`}
      />
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-4">
          <a href="/" className="text-blue-600 hover:underline">Home</a> ›{" "}
          <span>Skills</span>
        </nav>
        <h1 className="text-3xl font-bold mb-4">{entry.h1}</h1>
        <p className="text-lg text-muted-foreground mb-6">{entry.intro}</p>

        <section className="mb-8 grid grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg text-center">
            <div className="text-sm text-muted-foreground">Category</div>
            <div className="font-semibold">{entry.category}</div>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <div className="text-sm text-muted-foreground">Demand</div>
            <div className="font-semibold">{entry.demandLevel}</div>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <div className="text-sm text-muted-foreground">Freelance Rate</div>
            <div className="font-semibold">{entry.avgFreelanceRate}</div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Monetization Paths</h2>
          <ul className="list-disc pl-6 space-y-2">
            {entry.monetizationPaths.map((path, i) => (
              <li key={i}>{path}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Micro-SaaS Ideas Using {entry.skill}</h2>
          <ul className="list-disc pl-6 space-y-2">
            {entry.microSaaSIdeas.map((idea, i) => (
              <li key={i}>{idea}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Time to Revenue</h2>
          <p className="text-muted-foreground">{entry.timeToRevenue}</p>
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
