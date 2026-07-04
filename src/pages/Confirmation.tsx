import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle,
  Check,
  BarChart3,
  Lightbulb,
  Shield,
  Rocket,
  Palette,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const TOOL_META: Record<
  string,
  { name: string; icon: typeof BarChart3; dashboardRoute: string }
> = {
  fym: { name: "FYM Dashboard", icon: BarChart3, dashboardRoute: "/dashboard/fym" },
  "idea-pipeline": {
    name: "Idea Pipeline",
    icon: Lightbulb,
    dashboardRoute: "/dashboard/idea-pipeline",
  },
  "stealth-ops": {
    name: "Stealth Ops Hub",
    icon: Shield,
    dashboardRoute: "/dashboard/stealth-ops",
  },
  "launch-control": {
    name: "Launch Control",
    icon: Rocket,
    dashboardRoute: "/dashboard/launch-control",
  },
  "brand-manager": {
    name: "Brand Manager",
    icon: Palette,
    dashboardRoute: "/dashboard/brand-manager",
  },
};

const FOUNDING_ITEMS = [
  "FYM Dashboard",
  "Idea Pipeline",
  "Stealth Ops Hub",
  "Launch Control",
  "Brand Manager",
  "Private Community",
  "Monthly Masterclass",
  "Beta Access",
  "Annual Strategy Call",
];

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const tier = searchParams.get("tier") || "tool";
  const tools = (searchParams.get("tools") || "fym").split(",");

  useEffect(() => {
    document.title =
      tier === "founding"
        ? "Welcome, Founding Member | Invisible Exit"
        : "Welcome | Invisible Exit";
  }, [tier]);

  if (tier === "founding") {
    return (
      <div className="min-h-screen bg-white">
        <SEOHead
          title="Welcome, Founding Member | Invisible Exit"
          description="Your founding membership is confirmed."
          url="/confirmation"
          noindex
        />
        <Navbar />

        {/* Section 1: Emotional Validation */}
        <section className="pt-32 pb-16 px-6">
          <div className="mx-auto max-w-2xl text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Welcome to the Founding Member Circle.
            </h1>
            <p className="text-gray-500 text-lg mb-2">
              You're one of 100 founding members. Your price is locked at
              $17.99/month for life.
            </p>
            <p className="text-gray-400 text-sm">
              Check your email for login details. Everything is ready.
            </p>
          </div>
        </section>

        {/* Section 2: What You Unlocked */}
        <section className="pb-16 px-6">
          <div className="mx-auto max-w-xl">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <ul className="space-y-3">
                {FOUNDING_ITEMS.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                    <span className="ml-auto text-green-600 text-xs font-medium">
                      Unlocked
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Your First Mission */}
        <section className="bg-slate-50 py-20 px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your First Mission
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Open your FYM Dashboard and enter your numbers. It takes 90
              seconds. You'll see your exact MRR, your invisibility score, and
              the date you can hand in your resignation. This is why you joined.
              Start here.
            </p>
            <Link
              to="/dashboard/fym"
              className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors"
            >
              Open My FYM Dashboard
            </Link>
            <p className="text-gray-400 text-sm mt-4">
              Your dashboard is live and ready.
            </p>
          </div>
        </section>

        {/* Section 4: What Happens Next */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">
              What Happens Next
            </h2>
            <div className="relative pl-8">
              <div className="absolute left-3 top-1 bottom-1 w-px bg-gray-200" />
              {[
                {
                  label: "Today",
                  text: "Your dashboard is live. Calculate your exit timeline.",
                  active: true,
                },
                {
                  label: "This Week",
                  text: "Explore all 5 tools. Start with FYM Dashboard and Idea Pipeline.",
                  active: false,
                },
                {
                  label: "Week 2",
                  text: "Your first monthly masterclass invite arrives by email.",
                  active: false,
                },
                {
                  label: "Week 4",
                  text: "Community access opens. Meet other Managing Directors building the same way.",
                  active: false,
                },
              ].map((step) => (
                <div key={step.label} className="relative mb-8 last:mb-0">
                  <div
                    className={`absolute -left-5 top-1 w-3 h-3 rounded-full border-2 ${
                      step.active
                        ? "bg-[#60A5FA] border-[#60A5FA]"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  <p
                    className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                      step.active ? "text-[#60A5FA]" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-gray-600 text-sm">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Community CTA */}
        <section className="pb-20 px-6">
          <div className="mx-auto max-w-xl">
            <div className="rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-gray-600 text-sm mb-4">
                You now have access to the private Founding Member community.
              </p>
              <Link
                to="/dashboard/community"
                className="inline-block border border-[#60A5FA] text-[#60A5FA] hover:bg-[#60A5FA] hover:text-white font-semibold text-sm px-8 py-3 rounded-xl transition-colors"
              >
                Join the Community
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // Variant B: Individual Tool Confirmation
  const firstToolSlug = tools[0];
  const firstTool = TOOL_META[firstToolSlug];
  const hasFym = tools.includes("fym");

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Welcome | Invisible Exit"
        description="Your purchase is confirmed."
        url="/confirmation"
        noindex
      />
      <Navbar />

      {/* Section 1: Purchase Confirmation */}
      <section className="pt-32 pb-16 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            You're In. Your Tools Are Ready.
          </h1>
          <p className="text-gray-500 text-lg">
            Check your email for login details. Your dashboard will be ready in
            under 60 seconds.
          </p>
        </div>
      </section>

      {/* Section 2: What You Got */}
      <section className="pb-16 px-6">
        <div className="mx-auto max-w-xl">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <ul className="space-y-3">
              {tools.map((slug) => {
                const meta = TOOL_META[slug];
                if (!meta) return null;
                return (
                  <li key={slug} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    <span className="text-gray-700 text-sm">{meta.name}</span>
                    <span className="ml-auto text-green-600 text-xs font-medium">
                      Unlocked
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: Your First Mission */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your First Mission
          </h2>
          {hasFym ? (
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Open your FYM Dashboard and enter your numbers. It takes 90
              seconds. You'll see your MRR, your invisibility score, and your
              exit timeline.
            </p>
          ) : (
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Open your dashboard and explore your new tool. Set it up in under
              5 minutes.
            </p>
          )}
          <Link
            to={
              tools.length === 1 && firstTool
                ? firstTool.dashboardRoute
                : "/dashboard"
            }
            className="inline-block bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold text-lg px-10 py-4 rounded-xl transition-colors"
          >
            Open My Dashboard
          </Link>
        </div>
      </section>

      {/* Section 4: Upgrade Nudge — One-Time Offer */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-blue-50">
        <div className="mx-auto max-w-2xl">
          <div className="relative rounded-2xl border-2 border-[#60A5FA] bg-white p-8 shadow-lg">
            {/* Badge */}
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#60A5FA] text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full whitespace-nowrap">
              ⚡ One-Time Offer — Only Available Now
            </span>

            <p className="text-xs uppercase tracking-wide text-[#60A5FA] font-semibold mb-2 mt-2 text-center">
              Wait — Before You Start
            </p>
            <h3 className="text-gray-900 text-xl font-bold mb-3 text-center">
              Want Lifetime Price Lock + Shape the Roadmap?
            </h3>
            <p className="text-gray-500 text-sm mb-5 text-center leading-relaxed">
              Founding Members lock in <strong className="text-gray-700">$17.99/month for life</strong> (goes to
              $97.99 after 100 members), vote on features, get beta access, and have their
              name on the founding wall.
            </p>

            {/* Mini value stack */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
              {[
                "Lifetime price lock at $17.99/mo (saves $960/year vs public)",
                "Vote on the roadmap — your feature requests go first",
                "Beta access to every new tool before public release",
                "Your name permanently on the founding wall",
                "Unlimited usage on all tools (no caps)",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </div>
              ))}
            </div>

            {/* Price anchor */}
            <div className="text-center mb-4">
              <p className="text-gray-400 text-sm">
                <span className="line-through">$97.99/mo</span> →{" "}
                <span className="text-2xl font-bold text-[#60A5FA]">$17.99/mo</span>
                <span className="text-gray-400 text-sm"> locked for life</span>
              </p>
            </div>

            {/* CTA */}
            <Link
              to="/oto/founding"
              className="block w-full text-center bg-[#60A5FA] hover:bg-[#3b82f6] text-white font-semibold py-3.5 px-6 rounded-xl transition-colors mb-2"
            >
              See the Founding Member Offer →
            </Link>
            <p className="text-gray-400 text-xs text-center">
              Available right now. After you leave this page, the price is $97.99/mo.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: What Happens Next */}
      <section className="pb-20 px-6">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">
            What Happens Next
          </h2>
          <div className="relative pl-8">
            <div className="absolute left-3 top-1 bottom-1 w-px bg-gray-200" />
            {[
              {
                label: "Today",
                text: "Your tool is live. Set it up and explore.",
                active: true,
              },
              {
                label: "Tomorrow",
                text: "You'll receive an email with tips for getting the most out of your tool.",
                active: false,
              },
              {
                label: "This Week",
                text: "Check your dashboard daily. Consistency is the compound interest of freedom.",
                active: false,
              },
            ].map((step) => (
              <div key={step.label} className="relative mb-8 last:mb-0">
                <div
                  className={`absolute -left-5 top-1 w-3 h-3 rounded-full border-2 ${
                    step.active
                      ? "bg-[#60A5FA] border-[#60A5FA]"
                      : "bg-white border-gray-300"
                  }`}
                />
                <p
                  className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                    step.active ? "text-[#60A5FA]" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-gray-600 text-sm">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Confirmation;
