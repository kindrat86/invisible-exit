import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { generateNonCompeteMatrix } from "@/data/non-compete-matrix";

const matrix = generateNonCompeteMatrix();

export default function NonCompeteMatrixPage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;

  const entry = matrix.find((p) => p.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  const statusColor =
    entry.enforceabilityStatus === "Banned" ? "green" :
    entry.enforceabilityStatus === "Limited" ? "yellow" : "red";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Non-Compete Guide</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.profession} in {entry.state}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        {/* Verdict Box */}
        <section className={`mt-8 rounded-xl p-6 ${statusColor === "green" ? "bg-green-50 border-2 border-green-200" : statusColor === "yellow" ? "bg-yellow-50 border-2 border-yellow-200" : "bg-red-50 border-2 border-red-200"}`}>
          <div className="flex items-center gap-4">
            <span className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${statusColor === "green" ? "bg-green-500" : statusColor === "yellow" ? "bg-yellow-500" : "bg-red-500"} text-white`}>
              {entry.canBuild ? "✓" : "!"}
            </span>
            <div>
              <h2 className={`text-xl font-bold ${statusColor === "green" ? "text-green-900" : statusColor === "yellow" ? "text-yellow-900" : "text-red-900"}`}>
                {entry.canBuild ? "Yes, You Can Build a Side Business" : "Proceed with Caution"}
              </h2>
              <p className={`${statusColor === "green" ? "text-green-800" : statusColor === "yellow" ? "text-yellow-800" : "text-red-800"}`}>
                Non-compete status: {entry.enforceabilityStatus}
              </p>
            </div>
          </div>
        </section>

        {/* Key Risks */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Key Risks to Understand</h2>
          <ul className="mt-4 space-y-3">
            {entry.keyRisks.map((risk, i) => (
              <li key={i} className="flex gap-3 rounded-lg border border-slate-200 p-4">
                <span className="text-red-500">⚠</span>
                <span className="text-slate-700">{risk}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Safe Harbors */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Safe Harbors — What You CAN Do</h2>
          <ul className="mt-4 space-y-3">
            {entry.safeHarbors.map((harbor, i) => (
              <li key={i} className="flex gap-3 rounded-lg border border-slate-200 p-4">
                <span className="text-green-500">✓</span>
                <span className="text-slate-700">{harbor}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Disclaimer */}
        <section className="mt-8 rounded-xl bg-slate-900 p-6 text-center text-white">
          <p className="text-sm text-slate-300">
            ⚖️ This is general guidance based on {entry.state} non-compete law as of 2026. It is not legal advice.
            Always review your specific employment contract with a qualified attorney before starting a side business.
          </p>
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
            { to: `/guides/${entry.stateSlug}`, title: `${entry.state} Business Guide`, description: "LLC, taxes, fees" },
            { to: `/ideas/for-${entry.professionSlug}`, title: `Micro-SaaS Ideas for ${entry.profession}`, description: "5 tailored ideas" },
            { to: "/glossary/what-is-non-compete-clause", title: "What Is a Non-Compete Clause?", description: "Full definition" },
            { to: "/resources/stealth-operations-playbook", title: "Stealth Operations Playbook", description: "Stay invisible" },
          ]}
          title="Related Resources"
        />
      </article>

      <Footer />
    </div>
  );
}
