import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { professionVsCareer } from "@/data/profession-vs-career";

export default function ProfessionVsCareerPage() {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;
  const entry = professionVsCareer.find((e) => e.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} url={`/vs/${entry.slug}`} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link><span className="mx-2">›</span>
          <span>Career vs SaaS</span><span className="mx-2">›</span>
          <span className="text-slate-700">{entry.profession}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
            <h2 className="text-xl font-bold text-blue-900">The {entry.profession} Career Path</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div><dt className="text-slate-500">Salary Range</dt><dd className="font-semibold text-slate-900">{entry.careerPath.salaryRange}</dd></div>
              <div><dt className="text-slate-500">Growth Potential</dt><dd className="font-semibold text-slate-900">{entry.careerPath.growthPotential}</dd></div>
              <div><dt className="text-slate-500">Risk Level</dt><dd className="font-semibold text-slate-900">{entry.careerPath.riskLevel}</dd></div>
              <div><dt className="text-slate-500">Time to Mastery</dt><dd className="font-semibold text-slate-900">{entry.careerPath.timeToMastery}</dd></div>
            </dl>
            <div className="mt-4">
              <h4 className="text-sm font-bold text-green-700">Pros</h4>
              <ul className="mt-1 space-y-1">{entry.careerPath.pros.map((p, i) => <li key={i} className="text-sm text-slate-700">✓ {p}</li>)}</ul>
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-bold text-red-700">Cons</h4>
              <ul className="mt-1 space-y-1">{entry.careerPath.cons.map((c, i) => <li key={i} className="text-sm text-slate-700">✗ {c}</li>)}</ul>
            </div>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <h2 className="text-xl font-bold text-green-900">The Micro-SaaS Path</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div><dt className="text-slate-500">Potential Revenue</dt><dd className="font-semibold text-slate-900">{entry.saasPath.potentialRevenue}</dd></div>
              <div><dt className="text-slate-500">Time to First Dollar</dt><dd className="font-semibold text-slate-900">{entry.saasPath.timeToFirstDollar}</dd></div>
              <div><dt className="text-slate-500">Risk Level</dt><dd className="font-semibold text-slate-900">{entry.saasPath.riskLevel}</dd></div>
              <div><dt className="text-slate-500">Skills Required</dt><dd className="font-semibold text-slate-900">{entry.saasPath.skillsRequired.join(", ")}</dd></div>
            </dl>
            <div className="mt-4">
              <h4 className="text-sm font-bold text-green-700">Pros</h4>
              <ul className="mt-1 space-y-1">{entry.saasPath.pros.map((p, i) => <li key={i} className="text-sm text-slate-700">✓ {p}</li>)}</ul>
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-bold text-red-700">Cons</h4>
              <ul className="mt-1 space-y-1">{entry.saasPath.cons.map((c, i) => <li key={i} className="text-sm text-slate-700">✗ {c}</li>)}</ul>
            </div>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900">Head-to-Head Comparison</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white"><tr><th className="p-3">Factor</th><th className="p-3">Career</th><th className="p-3">Micro-SaaS</th></tr></thead>
              <tbody>
                {entry.comparison.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100"><td className="p-3 font-semibold">{row.factor}</td><td className="p-3 text-slate-600">{row.career}</td><td className="p-3 text-slate-600">{row.saas}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-xl bg-slate-900 p-6">
          <h2 className="text-xl font-bold text-white">The Verdict</h2>
          <p className="mt-3 text-slate-300">{entry.verdict}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900">The Hybrid Approach</h2>
          <p className="mt-4 text-slate-700">{entry.hybridApproach}</p>
        </section>

        {entry.faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">FAQs</h2>
            <div className="mt-4 space-y-4">
              {entry.faqs.map((f, i) => (<div key={i}><h3 className="font-bold text-slate-900">{f.question}</h3><p className="mt-1 text-slate-600">{f.answer}</p></div>))}
            </div>
          </section>
        )}

        <div className="mt-10 rounded-xl bg-slate-900 p-6 text-center">
          <Link to="/freedom" className="text-white font-semibold underline">Calculate Your Freedom Number →</Link>
        </div>
      </article>
      <Footer />
    </div>
  );
}
