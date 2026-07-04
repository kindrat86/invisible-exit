import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { hoursPages } from "@/data/hours-pages";

export default function HoursPage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;

  const entry = hoursPages.find((h) => h.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>{entry.timeLabel}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-4">{entry.h1}</h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">{entry.intro}</p>

        {/* Weekly Schedule */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Weekly Schedule ({entry.hoursPerWeek} hours)</h2>
          <div className="space-y-3">
            {entry.weeklySchedule.map((s, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-slate-200">
                <div className="w-32 shrink-0">
                  <p className="text-xs font-bold text-blue-600">{s.day}</p>
                  <p className="text-xs text-slate-500">{s.duration}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{s.block}</p>
                  <p className="text-sm text-slate-600">{s.task}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What you can accomplish */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">What You Can Accomplish</h2>
          <ul className="space-y-2">
            {entry.whatYouCanAccomplish.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-600 font-bold shrink-0">✓</span>
                <span className="text-sm text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* What you cannot */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">What You Can't</h2>
          <ul className="space-y-2">
            {entry.whatYouCannot.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">✗</span>
                <span className="text-sm text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Framework */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">The Framework</h2>
          <div className="space-y-3">
            {entry.framework.map((f, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-slate-200">
                <div className="w-28 shrink-0">
                  <p className="text-xs font-bold text-blue-600">{f.phase}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{f.focus}</p>
                  <p className="text-xs text-slate-500 mt-1">{f.timeAllocation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Milestone estimate */}
        <section className="bg-blue-50 rounded-xl p-6 mb-10 border-l-4 border-blue-500">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Milestone Timeline</h2>
          <p className="text-sm text-slate-700">{entry.milestoneEstimate}</p>
        </section>

        {/* Tips */}
        <section className="bg-slate-50 rounded-xl p-6 mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Pro Tips</h2>
          <ul className="space-y-2">
            {entry.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm text-slate-700">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">FAQ</h2>
          <div className="space-y-4">
            {entry.faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-5">
                <h3 className="font-semibold text-slate-900 mb-2 text-sm">{faq.question}</h3>
                <p className="text-sm text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center border-t border-slate-200 pt-8">
          <Link to="/freedom" className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors">
            Calculate Your Freedom Number →
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}
