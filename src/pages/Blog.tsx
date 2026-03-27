import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { blogPosts } from "@/data/blog-posts";

const Blog = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Blog: Invisible Exit Strategies for Corporate Managers | Invisible Exit"
        description="Articles on building invisible recurring revenue, micro-SaaS businesses, and financial independence for corporate managers and executives."
        url="/blog"
      />
      <Navbar />

      {/* Hero */}
      <section className="bg-[#1B2A4A] pt-32 pb-16 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Invisible Exit Blog
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Strategies, frameworks, and case studies for corporate managers
            building invisible recurring revenue.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="bg-white py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((article) => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow group"
              >
                <span className="text-[#60A5FA] text-xs font-semibold uppercase tracking-wide mb-3">
                  {article.category}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex-1 group-hover:text-[#3B82F6] transition-colors">
                  {article.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">
                    {article.readTime}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}
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
            Start tracking your invisible income and plan your exit with the FYM
            Dashboard.
          </p>
          <Link
            to="/?checkout=starter"
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors"
          >
            Get Started for $0.97/month
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
