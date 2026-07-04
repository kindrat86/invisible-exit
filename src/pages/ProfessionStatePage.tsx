import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { generateProfessionStatePages } from "@/data/profession-states";

const pages = generateProfessionStatePages();

export default function ProfessionStatePage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;

  const entry = pages.find((p) => p.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <Link to={`/ideas/${entry.professionSlug}`} className="hover:text-blue-600">{entry.profession} Ideas</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.state}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        {/* State Legal Quick Facts */}
        <section className="mt-8 rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">{entry.state} Quick Facts for Side Businesses</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold text-slate-500">LLC Filing Fee</dt>
              <dd className="text-lg font-bold text-slate-900">{entry.llcFilingFee}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-500">Non-Compete Status</dt>
              <dd className="text-lg font-bold text-slate-900">{entry.nonCompeteStatus}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-500">State Income Tax</dt>
              <dd className="text-lg font-bold text-slate-900">{entry.stateIncomeTax}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-500">Anonymous LLC</dt>
              <dd className="text-lg font-bold text-slate-900">{entry.anonymousLlc}</dd>
            </div>
          </dl>
        </section>

        {/* Ideas for this profession */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Micro-SaaS Ideas for {entry.profession} in {entry.state}</h2>
          <p className="mt-2 text-slate-600">{entry.ideasIntro}</p>
          <div className="mt-4 space-y-3">
            {entry.topIdeas.map((idea, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-900">{idea.name}</h3>
                  <span className="whitespace-nowrap rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    {idea.pricing}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{idea.description}</p>
                <p className="mt-2 text-sm font-semibold text-green-600">Revenue potential: {idea.revenuePotential}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Legal Considerations */}
        <section className="mt-10 rounded-xl bg-amber-50 p-6">
          <h2 className="text-xl font-bold text-amber-900">Legal Considerations for {entry.profession} in {entry.state}</h2>
          <p className="mt-2 text-amber-800">{entry.legalConsiderations}</p>
        </section>

        {/* FAQs */}
        {entry.faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">FAQs</h2>
            <div className="mt-4 space-y-4">
              {entry.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                  <p className="mt-1 text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <RelatedContent
          links={[
            { to: `/ideas/${entry.professionSlug}`, title: `All ${entry.profession} Ideas`, description: "See all 5 ideas" },
            { to: `/guides/${entry.stateSlug}`, title: `${entry.state} Business Guide`, description: "Full legal guide" },
            { to: `/stack/${entry.professionSlug}`, title: `Tool Stack for ${entry.profession}`, description: "What to buy" },
            { to: "/calculators/freedom-number", title: "Freedom Number Calculator", description: "Your target MRR" },
          ]}
          title="Related Resources"
        />
      </article>

      <Footer />
    </div>
  );
}
