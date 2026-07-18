import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Contact = () => {
  const jsonLdArray = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Invisible Exit",
      url: "https://invisibleexit.com",
      logo: "https://invisibleexit.com/og-image.png",
      description:
        "Invisible Exit is a membership platform with 5 AI-powered tools that help corporate managers build anonymous micro-SaaS businesses while employed.",
      sameAs: [
        "https://www.reddit.com/r/invisibleexit",
        "https://github.com/kindrat86/invisible-exit",
      ],
      knowsAbout: [
        "Micro-SaaS",
        "Anonymous business building",
        "Corporate career strategy",
        "Recurring revenue models",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@invisibleexit.com",
        url: "https://invisibleexit.com/contact",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact Invisible Exit",
      description:
        "Reach the Invisible Exit team. One inbox, real replies. Email hello@invisibleexit.com for support, partnerships, press, or membership questions.",
      url: "https://invisibleexit.com/contact",
      isPartOf: {
        "@type": "WebSite",
        name: "Invisible Exit",
        url: "https://invisibleexit.com",
      },
      about: {
        "@type": "Organization",
        name: "Invisible Exit",
        url: "https://invisibleexit.com",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://invisibleexit.com/" },
        { "@type": "ListItem", position: 2, name: "Contact" },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Contact Invisible Exit | One Inbox, Real Replies"
        description="Reach the Invisible Exit team. Email hello@invisibleexit.com for support, partnerships, press, or membership questions — one inbox, real replies."
        url="/contact"
      />
      {jsonLdArray.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <Navbar />

      <main>
        <section className="bg-[#1B2A4A] pt-32 pb-16 px-6">
          <div className="mx-auto max-w-3xl">
            <nav className="flex items-center gap-2 text-sm text-white/40 mb-6">
              <Link to="/" className="hover:text-white/70 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-white/60">Contact</span>
            </nav>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Contact Invisible Exit
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              One inbox, real replies. No ticket system pretending to be a person —
              your message reaches the team directly.
            </p>
          </div>
        </section>

        <section className="bg-white py-16 px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email us</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              The fastest way to reach us is email. Write to{" "}
              <a
                href="mailto:hello@invisibleexit.com"
                className="text-[#3B82F6] hover:underline font-medium"
              >
                hello@invisibleexit.com
              </a>{" "}
              and we&rsquo;ll reply — usually within one business day.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Membership support, partnerships, affiliate questions, and press all go
              to the same address. Put the topic in the subject line and we&rsquo;ll
              route it to the right place.
            </p>

            <div className="grid gap-4 mb-10">
              {[
                {
                  title: "Membership & support",
                  desc: "Questions about the 5 tools, billing, or your account.",
                },
                {
                  title: "Partnerships & affiliates",
                  desc: "Joint ventures, integrations, and the 30% affiliate program.",
                },
                {
                  title: "Press & media",
                  desc: "Interviews and coverage — include your outlet and deadline.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-gray-50 rounded-xl p-5 border border-gray-200"
                >
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Before you write</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A lot of common questions are already answered across the site. You may
              find what you need faster on the{" "}
              <Link to="/about" className="text-[#3B82F6] hover:underline">about page</Link>,
              the <Link to="/blog" className="text-[#3B82F6] hover:underline">blog</Link>, or by
              browsing the{" "}
              <Link to="/explore" className="text-[#3B82F6] hover:underline">full resource library</Link>.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Ready to start?{" "}
              <Link to="/?checkout=starter" className="text-[#3B82F6] hover:underline">
                Get all 5 tools for $0.97/month
              </Link>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
