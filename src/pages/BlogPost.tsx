import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBlogPostBySlug } from "@/data/blog-posts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Invisible Exit Blog`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", post.excerpt);
      }
    }
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="bg-[#1B2A4A] pt-32 pb-16 px-6">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/blog"
            className="text-white/50 hover:text-white/80 text-sm mb-6 inline-flex items-center gap-1 transition-colors"
          >
            &larr; Back to Blog
          </Link>
          <span className="block text-[#60A5FA] text-xs font-semibold uppercase tracking-wide mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-white/50 text-sm">
            <span>{post.readTime}</span>
            <span>&middot;</span>
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16 px-6">
        <article className="mx-auto max-w-3xl prose prose-lg prose-gray prose-headings:text-gray-900 prose-a:text-[#3B82F6] prose-strong:text-gray-900">
          {post.content.split("\n\n").map((block, i) => {
            if (block.startsWith("## ")) {
              return (
                <h2 key={i} className="text-2xl font-bold mt-10 mb-4">
                  {block.replace("## ", "")}
                </h2>
              );
            }
            if (block.startsWith("### ")) {
              return (
                <h3 key={i} className="text-xl font-semibold mt-8 mb-3">
                  {block.replace("### ", "")}
                </h3>
              );
            }
            if (block.startsWith("| ")) {
              const rows = block.split("\n").filter((r) => !r.match(/^\|\s*[-|]+\s*\|$/));
              if (rows.length === 0) return null;
              const header = rows[0].split("|").filter(Boolean).map((c) => c.trim());
              const body = rows.slice(1).map((r) =>
                r.split("|").filter(Boolean).map((c) => c.trim())
              );
              return (
                <div key={i} className="overflow-x-auto my-6">
                  <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50">
                        {header.map((h, j) => (
                          <th key={j} className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {body.map((row, ri) => (
                        <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-4 py-3 text-gray-600 border-b border-gray-100">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            if (block.startsWith("- ")) {
              const items = block.split("\n").filter(Boolean);
              return (
                <ul key={i} className="list-disc pl-6 space-y-2 my-4">
                  {items.map((item, j) => {
                    const text = item.replace(/^-\s+/, "");
                    return (
                      <li key={j} className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{
                        __html: text.replace(/\*\*(.+?)\*\*/g, "<strong class='text-gray-900'>$1</strong>"),
                      }} />
                    );
                  })}
                </ul>
              );
            }
            if (block.match(/^\d+\.\s/)) {
              const items = block.split("\n").filter(Boolean);
              return (
                <ol key={i} className="list-decimal pl-6 space-y-2 my-4">
                  {items.map((item, j) => {
                    const text = item.replace(/^\d+\.\s+/, "");
                    return (
                      <li key={j} className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{
                        __html: text.replace(/\*\*(.+?)\*\*/g, "<strong class='text-gray-900'>$1</strong>"),
                      }} />
                    );
                  })}
                </ol>
              );
            }
            if (block.startsWith("- [ ]") || block.startsWith("- [x]")) {
              const items = block.split("\n").filter(Boolean);
              return (
                <ul key={i} className="space-y-2 my-4 pl-2">
                  {items.map((item, j) => {
                    const checked = item.startsWith("- [x]");
                    const text = item.replace(/^- \[.\]\s*/, "");
                    return (
                      <li key={j} className="flex items-start gap-2 text-gray-600">
                        <input type="checkbox" checked={checked} readOnly className="mt-1.5" />
                        <span>{text}</span>
                      </li>
                    );
                  })}
                </ul>
              );
            }
            return (
              <p key={i} className="text-gray-600 leading-relaxed my-4" dangerouslySetInnerHTML={{
                __html: block.replace(/\*\*(.+?)\*\*/g, "<strong class='text-gray-900'>$1</strong>"),
              }} />
            );
          })}
        </article>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Invisible Exit?
          </h2>
          <p className="text-gray-600 mb-8">
            Track your progress from $0 to financial independence with the FYM
            Dashboard.
          </p>
          <Link
            to="/"
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

export default BlogPost;
