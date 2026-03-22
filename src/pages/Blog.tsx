import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const pillarArticles = [
  {
    title: "How Much Money Do You Actually Need to Never Work Again?",
    excerpt: "The math behind financial independence for corporate managers. Why $4,000/month in recurring revenue changes everything.",
    category: "Financial Independence",
    readTime: "8 min read",
  },
  {
    title: "Why Managing Directors Are Building Micro-SaaS Businesses in 2026",
    excerpt: "The golden handcuff trap is real. Here's why AI-powered micro-SaaS is the escape hatch for executives with constraints.",
    category: "Micro-SaaS",
    readTime: "10 min read",
  },
  {
    title: "The Invisible Business Model: How to Build Revenue Your Employer Can't See",
    excerpt: "Entity separation, compliance, digital footprint management. A complete guide to invisible operations.",
    category: "Stealth Operations",
    readTime: "12 min read",
  },
  {
    title: "From $0 to $4,000/Month: The 18-Month Invisible Exit Timeline",
    excerpt: "A month-by-month breakdown of building recurring revenue while maintaining your corporate role.",
    category: "Exit Planning",
    readTime: "15 min read",
  },
  {
    title: "AI Tools That Replace a 5-Person Startup Team",
    excerpt: "Why solo founders with AI can now compete with funded startups. The tools, the workflow, the economics.",
    category: "AI Tools",
    readTime: "7 min read",
  },
  {
    title: "Real Estate vs. Micro-SaaS: Freedom Math for Corporate Managers",
    excerpt: "Which path to financial independence is faster, cheaper, and more invisible? The numbers might surprise you.",
    category: "Financial Independence",
    readTime: "9 min read",
  },
];

const Blog = () => {
  useEffect(() => {
    document.title = "Blog: Invisible Exit Strategies for Corporate Managers | Invisible Exit";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Articles on building invisible recurring revenue, micro-SaaS businesses, and financial independence for corporate managers and executives."
      );
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#1B2A4A] pt-32 pb-16 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Invisible Exit Blog
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Strategies, frameworks, and case studies for corporate managers building invisible recurring revenue.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="bg-white py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillarArticles.map((article) => (
              <article
                key={article.title}
                className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow"
              >
                <span className="text-[#60A5FA] text-xs font-semibold uppercase tracking-wide mb-3">
                  {article.category}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex-1">
                  {article.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <span className="text-gray-400 text-xs">{article.readTime}</span>
              </article>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-gray-500 text-sm">
              New articles published weekly. Content repurposed from our YouTube channel.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Want the Full Framework?
          </h2>
          <p className="text-gray-600 mb-8">
            Get the free 15-minute training that covers the complete Invisible Exit Method.
          </p>
          <Link
            to="/training"
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors"
          >
            Get the Free Training
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
