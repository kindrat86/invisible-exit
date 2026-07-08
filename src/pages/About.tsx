import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const About = () => {
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
        "https://www.youtube.com/@InvisibleExit",
        "https://www.linkedin.com/company/invisible-exit",
        "https://twitter.com/InvisibleExit",
        "https://github.com/kindrat86/invisible-exit",
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
      "@type": "AboutPage",
      name: "About Invisible Exit",
      description:
        "Invisible Exit is a membership platform with 5 AI-powered tools for corporate managers building anonymous micro-SaaS businesses. Founded by Adrian, an employed corporate manager who built a side business without quitting.",
      url: "https://invisibleexit.com/about",
      publisher: {
        "@type": "Organization",
        name: "Invisible Exit",
        url: "https://invisibleexit.com",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Adrian",
      jobTitle: "Founder, Invisible Exit",
      url: "https://invisibleexit.com/about",
      description:
        "Adrian is a corporate manager who built a profitable micro-SaaS business while employed, without his employer discovering it. He created Invisible Exit to share the exact frameworks, tools, and operating systems that worked for him.",
      sameAs: [
        "https://www.youtube.com/@InvisibleExit",
      ],
      worksFor: {
        "@type": "Organization",
        name: "Invisible Exit",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://invisibleexit.com/" },
        { "@type": "ListItem", position: 2, name: "About" },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="About Invisible Exit | Built by a Corporate Manager, for Corporate Managers"
        description="Invisible Exit was founded by Adrian, a corporate manager who built a profitable micro-SaaS while employed — without his employer finding out. The platform shares the exact frameworks that worked."
        url="/about"
      />
      {jsonLdArray.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <Navbar />

      <section className="bg-[#1B2A4A] pt-32 pb-16 px-6">
        <div className="mx-auto max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-white/40 mb-6">
            <Link to="/" className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/60">About</span>
          </nav>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            About Invisible Exit
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Built by a corporate manager, for corporate managers who want to build
            recurring revenue without risking their career.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 px-6">
        <div className="mx-auto max-w-3xl prose prose-lg prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Who we are</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Invisible Exit is a membership platform with 5 AI-powered tools that help
            corporate managers build anonymous micro-SaaS businesses. The platform was
            created by <strong>Adrian</strong>, a corporate manager who built a profitable
            side business while employed — without his employer discovering it.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            After years of watching talented colleagues stay trapped by golden handcuffs,
            non-compete fears, and the belief that building a business required quitting
            their job, Adrian decided to share the exact operating system that worked for
            him: validate ideas in 48 hours, build in 5 focused hours per week, reach
            $4,000/month in recurring revenue, and exit on your own terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-12">What we believe</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-[#3B82F6] font-bold mt-1">→</span>
              <span><strong>Financial freedom doesn't require millions.</strong> $4,000/month in recurring revenue changes everything for most corporate managers.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#3B82F6] font-bold mt-1">→</span>
              <span><strong>You don't need to quit your job to start.</strong> The invisible exit method proves you can validate, build, and reach profitability while employed.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#3B82F6] font-bold mt-1">→</span>
              <span><strong>Your employer doesn't need to know.</strong> Entity separation, digital compartmentalization, and stealth operations make anonymous building practical.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#3B82F6] font-bold mt-1">→</span>
              <span><strong>AI has changed the game.</strong> Solo founders with AI tools can now compete with funded 5-person startup teams on execution speed.</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-12">The 5 tools</h2>
          <div className="not-prose grid gap-4 mb-6">
            {[
              { name: "FYM Dashboard", desc: "Calculate your freedom number and track recurring revenue toward the exit threshold." },
              { name: "Idea Pipeline", desc: "Validate micro-SaaS ideas in 48 hours using AI-powered market testing." },
              { name: "Stealth Ops Hub", desc: "Entity separation, compliance audit, and invisibility scoring from 0-100." },
              { name: "Launch Control", desc: "Go-live automation for founders with 5 hours a week." },
              { name: "Brand Manager", desc: "Faceless audience building with YouTube scripts and Reddit playbooks." },
            ].map((tool) => (
              <div key={tool.name} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-1">{tool.name}</h3>
                <p className="text-sm text-gray-600">{tool.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-12">Connect</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We publish frameworks, case studies, and guides on the{" "}
            <Link to="/blog" className="text-[#3B82F6] hover:underline">blog</Link> and on{" "}
            <a
              href="https://www.youtube.com/@InvisibleExit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3B82F6] hover:underline"
            >YouTube</a>. Questions? Reach us anytime at{" "}
            <a href="mailto:hello@invisibleexit.com" className="text-[#3B82F6] hover:underline">
              hello@invisibleexit.com
            </a>{" "}
            or via the{" "}
            <Link to="/contact" className="text-[#3B82F6] hover:underline">contact page</Link>.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Ready to start? <Link to="/?checkout=starter" className="text-[#3B82F6] hover:underline">Get all 5 tools for $0.97/month</Link>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
