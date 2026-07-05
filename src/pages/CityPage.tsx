import { useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { cities, type CityPage as CityPageData } from "@/data/cities";

export default function CityPage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;

  const entry = cities.find((c) => c.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <>
      <SEOHead
        title={entry.metaTitle}
        description={entry.metaDescription}
        canonical={`https://invisibleexit.com/cities/${entry.slug}`}
      />
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-4">
          <a href="/" className="text-blue-600 hover:underline">Home</a> ›{" "}
          <span>Cities</span>
        </nav>
        <h1 className="text-3xl font-bold mb-4">{entry.h1}</h1>
        <p className="text-lg text-muted-foreground mb-6">{entry.intro}</p>

        <section className="mb-8 grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Avg Salary</div>
            <div className="font-semibold">{entry.avgSalary}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Cost of Living</div>
            <div className="font-semibold">{entry.costOfLiving}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Population</div>
            <div className="font-semibold">{entry.population}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Ecosystem</div>
            <div className="font-semibold">{entry.startupEcosystem}</div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Legal Context</h2>
          <p className="text-muted-foreground">{entry.legalContext}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Local Advantage</h2>
          <p className="text-muted-foreground">{entry.localAdvantage}</p>
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
