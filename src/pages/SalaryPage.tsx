import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RelatedContent } from "@/components/RelatedContent";
import { salaries, type SalaryEntry } from "@/data/salaries";

export default function SalaryPage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) return <Navigate to="/blog" replace />;

  const entry = salaries.find((s) => s.slug === slug);
  if (!entry) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <SEOHead title={entry.metaTitle} description={entry.metaDescription} />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span>Salaries</span>
          <span className="mx-2">›</span>
          <span className="text-slate-700">{entry.role}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{entry.h1}</h1>
        <p className="mt-4 text-lg text-slate-600">{entry.intro}</p>

        {/* Salary Overview */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-blue-50 p-5 text-center">
            <div className="text-3xl font-extrabold text-blue-700">{entry.salaryRange}</div>
            <div className="mt-1 text-sm text-slate-600">Average Salary Range</div>
          </div>
          <div className="rounded-xl bg-green-50 p-5 text-center">
            <div className="text-3xl font-extrabold text-green-700">{entry.freedomNumber}</div>
            <div className="mt-1 text-sm text-slate-600">Freedom Number (MRR)</div>
          </div>
          <div className="rounded-xl bg-purple-50 p-5 text-center">
            <div className="text-3xl font-extrabold text-purple-700">{entry.timeline}</div>
            <div className="mt-1 text-sm text-slate-600">Estimated Timeline</div>
          </div>
        </section>

        {/* The Math */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">The Freedom Number Math</h2>
          <p className="mt-3 text-slate-700">
            As a {entry.role} earning {entry.avgSalary}, your freedom number — the monthly recurring revenue
            that gives you the option to leave — is <strong>{entry.freedomNumber}</strong>.
            That's the point where your side business income covers your core living expenses.
          </p>
          <p className="mt-3 text-slate-700">
            At $29/month per customer, you need approximately{" "}
            <strong>{Math.ceil(parseInt(entry.freedomNumber.replace(/[^0-9]/g, "")) / 29)} customers</strong>{" "}
            to reach freedom. Most founders get there in {entry.timeline}.
          </p>
        </section>

        {/* Transferable Skills */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Your Transferable Skills</h2>
          <p className="mt-2 text-slate-600">The skills you've developed as a {entry.role} that give you an unfair advantage:</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.transferableSkills.map((skill, i) => (
              <span key={i} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Best Micro-SaaS Ideas */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Best Micro-SaaS Ideas for {entry.role}s</h2>
          <div className="mt-4 space-y-3">
            {entry.bestMicroSaaSIdeas.map((idea, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
                <span className="text-2xl">{["💡", "🚀", "⚡"][i % 3]}</span>
                <span className="text-slate-700">{idea}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-10 rounded-xl bg-gradient-to-br from-slate-900 to-blue-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to Build Your Exit?</h2>
          <p className="mt-2 text-slate-300">
            Calculate your exact freedom number and get a personalized roadmap.
          </p>
          <Link
            to="/freedom"
            className="mt-4 inline-block rounded-lg bg-white px-8 py-3 font-bold text-slate-900 hover:bg-slate-100"
          >
            Calculate My Freedom Number →
          </Link>
        </section>

        {/* FAQs */}
        {entry.faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
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
            { to: `/ideas/for-${entry.slug.replace(/^(product-manager|software-engineer|data-analyst|marketing-manager|ux-designer|devops-engineer|sales-manager|financial-analyst|operations-manager|hr-manager)$/, "")}`, title: `Micro-SaaS Ideas for ${entry.role}s`, description: "5 tailored ideas with pricing" },
            { to: "/calculators/freedom-number", title: "Freedom Number Calculator", description: "Your exact number" },
            { to: `/cost-of-waiting/5-years-${entry.avgSalary.replace(/\$|K.*$/, "k")}-salary`, title: "Cost of Waiting 5 Years", description: "What you lose by waiting" },
            { to: "/resources/micro-saas-launch-checklist", title: "30-Step Launch Checklist", description: "Go from idea to launched" },
          ]}
          title="Next Steps"
        />
      </article>

      <Footer />
    </div>
  );
}
