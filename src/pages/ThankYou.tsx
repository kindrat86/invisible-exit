import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Lightbulb, Shield, Rocket, Megaphone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const toolCards = [
  {
    name: "FYM Dashboard",
    description: "Track recurring revenue, churn, growth rate, and exit timeline.",
    price: "$0.97/mo",
    route: "/fym",
    icon: BarChart3,
    ready: true,
  },
  {
    name: "Idea Pipeline",
    description: "Validate new micro-SaaS ideas in 48 hours.",
    price: "$0.97/mo",
    route: "/idea-pipeline",
    icon: Lightbulb,
    ready: false,
  },
  {
    name: "Stealth Ops Hub",
    description: "Automate backend operations invisibly.",
    price: "$0.97/mo",
    route: "/stealth-ops",
    icon: Shield,
    ready: false,
  },
  {
    name: "Launch Control",
    description: "Release products faster than your day job allows.",
    price: "$0.97/mo",
    route: "/launch-control",
    icon: Rocket,
    ready: false,
  },
  {
    name: "Brand Manager",
    description: "Build organic YouTube and Reddit presence with AI.",
    price: "$0.97/mo",
    route: "/brand-manager",
    icon: Megaphone,
    ready: false,
  },
];

const ThankYou = () => {
  useEffect(() => {
    document.title = "Check Your Email | Invisible Exit";
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#1B2A4A] pt-32 pb-20 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Check Your Email
          </h1>
          <p className="text-white/70 text-lg mb-4">
            Your training is on its way. While you wait, choose your first tool below.
          </p>
          <p className="text-white/50 text-base">
            Each tool is $0.97/month. Cancel anytime. Start with the one that matches where you are right now.
          </p>
        </div>
      </section>

      {/* Video Teaser */}
      <section className="bg-white py-16 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl bg-gradient-to-br from-[#1B2A4A] to-[#60A5FA]/30 border border-gray-200 flex items-center justify-center h-48 md:h-64">
            <span className="text-white/40 text-sm">Phase 1 overview video coming soon</span>
          </div>
        </div>
      </section>

      {/* Tool Cards */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Choose Your First Tool
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            Each tool solves one piece of the invisible exit puzzle. Start with the one that matches your biggest pain right now.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolCards.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.name}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col"
                >
                  <div className="bg-[#1B2A4A] rounded-lg w-10 h-10 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-[#60A5FA]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{tool.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#60A5FA] font-bold">{tool.price}</span>
                    {tool.ready ? (
                      <Link
                        to={tool.route}
                        className="text-[#60A5FA] hover:text-[#3B82F6] font-medium text-sm flex items-center gap-1 transition-colors"
                      >
                        Start Now <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <span className="text-gray-400 text-sm">Coming Soon</span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Founding Member Card */}
            <div className="bg-[#1B2A4A] rounded-xl p-6 shadow-sm border border-[#60A5FA]/30 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#60A5FA]/20 text-[#60A5FA] text-xs font-bold px-2 py-1 rounded">RECOMMENDED</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Founding Member</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4 flex-1">
                All 5 tools + private community + monthly masterclass + beta access. Limited to 100 members.
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[#60A5FA] font-bold">$19/mo</span>
                  <span className="text-white/40 text-xs ml-2">locked for life</span>
                </div>
                <Link
                  to="/founding-member"
                  className="text-[#60A5FA] hover:text-white font-medium text-sm flex items-center gap-1 transition-colors"
                >
                  Lock In Price <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThankYou;
