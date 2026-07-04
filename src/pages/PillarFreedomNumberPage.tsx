import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calculator,
  TrendingUp,
  Shield,
  Rocket,
  DollarSign,
  Target,
  Check,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ContentUpgrade from "@/components/ContentUpgrade";
import ShareButtons from "@/components/ShareButtons";
import { trackEvent } from "@/lib/analytics";

const TABLE_OF_CONTENTS = [
  { id: "what-is", label: "What Is a Freedom Number?" },
  { id: "formula", label: "The Freedom Number Formula" },
  { id: "calculate", label: "How to Calculate Yours (Step by Step)" },
  { id: "examples", label: "Freedom Number Examples by Salary" },
  { id: "customers", label: "How Many Customers You Need" },
  { id: "timeline", label: "How Long It Takes to Hit" },
  { id: "framework", label: "The 5-Tool Framework to Reach It" },
  { id: "mistakes", label: "5 Mistakes That Delay Freedom" },
  { id: "faq", label: "Frequently Asked Questions" },
];

const SALARY_TABLE = [
  { salary: "$80,000", expenses: "$4,000/mo", freedom: "$10,700/mo", customers29: "370", customers9: "1,189" },
  { salary: "$100,000", expenses: "$4,500/mo", freedom: "$12,800/mo", customers29: "442", customers9: "1,422" },
  { salary: "$120,000", expenses: "$5,000/mo", freedom: "$15,000/mo", customers29: "518", customers9: "1,667" },
  { salary: "$150,000", expenses: "$6,000/mo", freedom: "$18,500/mo", customers29: "638", customers9: "2,056" },
  { salary: "$200,000", expenses: "$8,000/mo", freedom: "$24,700/mo", customers29: "852", customers9: "2,745" },
  { salary: "$250,000", expenses: "$10,000/mo", freedom: "$30,800/mo", customers29: "1,063", customers9: "3,422" },
];

const MISTAKES = [
  {
    title: "Not accounting for taxes on your side income",
    body: "Your $4,000/month MRR isn't $4,000 in your pocket. After self-employment taxes (~15.3%), income taxes, and business expenses, you net roughly 65-70%. Calculate your gross freedom number, then multiply by 1.35 to get the MRR you actually need.",
  },
  {
    title: "Forgetting healthcare and benefits",
    body: "Your employer covers health insurance, retirement match, and other benefits worth $15,000-$30,000/year. Your freedom number must replace ALL compensation, not just salary. Add $1,500-$2,500/month to your target.",
  },
  {
    title: "Using churn-ignoring math",
    body: "If your monthly churn is 5%, you need to add ~5% new customers every month just to break even. At 138 customers and 5% churn, you lose 7 customers/month. Your acquisition rate must exceed that. Always model churn into your timeline.",
  },
  {
    title: "Picking a price point that's too low",
    body: "At $9/month, you need 445 customers for $4,000 MRR. At $29/month, you need 138. At $97/month, you need 41. Higher prices mean fewer customers, less support burden, and faster freedom. Don't race to the bottom.",
  },
  {
    title: "Not building the system before the idea",
    body: "Most people spend 3 months choosing the 'right' idea and zero months building the system that validates, launches, and distributes it. Build the pipeline first. Then ideas become interchangeable cartridges.",
  },
];

const FAQS = [
  {
    q: "What exactly is a freedom number?",
    a: "Your freedom number is the monthly recurring revenue (MRR) you need from products you own to fully replace your employment income and living expenses. It's not about quitting your job — it's about having the option to. Once your MRR hits your freedom number, the golden handcuffs are off. You stay because you choose to, not because you have to.",
  },
  {
    q: "How is this different from the 4% rule in FIRE?",
    a: "The FIRE 4% rule requires you to accumulate a large lump sum (typically $1M-$3M) invested in index funds, then withdraw 4% annually. The freedom number approach replaces that with recurring revenue from products you own. Instead of drawing down a finite pool, you're building a renewable income stream that doesn't deplete. Both paths lead to freedom; the MRR path gets there faster because you don't need to accumulate the full lump sum first.",
  },
  {
    q: "Do I need to quit my job to hit my freedom number?",
    a: "No. That's the entire point of the Invisible Exit system. You build in 5 hours per week while employed. Your salary funds the build. Your corporate skills give you an advantage solo founders lack. Most members hit their first $1,000 MRR within 6-8 months while still fully employed.",
  },
  {
    q: "What if my expenses are higher than the examples?",
    a: "The formula works at any expense level. Higher expenses mean a higher freedom number, which means either more customers or higher pricing. The math doesn't change — it scales. If your freedom number feels unreachable at $9/month pricing, raise your price. At $97/month, a $15,000 freedom number needs just 155 customers.",
  },
  {
    q: "How accurate is the freedom number calculator?",
    a: "The calculator uses standard financial modeling: salary replacement + expense coverage + a 30% buffer for taxes and benefits. It's directionally accurate — it tells you the order of magnitude you're targeting. For exact planning, use the detailed breakdown in your dashboard after calculating.",
  },
];

const PillarFreedomNumberPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="The Complete Freedom Number Guide (2026) | Invisible Exit"
        description="The definitive guide to calculating your freedom number — the exact monthly recurring revenue you need to never work for someone else again. Formula, examples, timeline, and the 5-tool framework."
        url="/guides/freedom-number"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-8">
            <Calculator className="w-4 h-4" />
            Definitive Guide · 3,500+ words
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
            The Complete{" "}
            <span className="text-gradient-light">Freedom Number</span> Guide
          </h1>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto mb-4">
            How to calculate the exact monthly recurring revenue you need to
            never work for someone else again — with real numbers, timelines,
            and the framework to hit it.
          </p>
          <p className="text-base text-white/50 max-w-xl mx-auto mb-8">
            Updated July 2026 · 12 min read
          </p>
          <div className="flex justify-center">
            <ShareButtons title="The Complete Freedom Number Guide (2026)" />
          </div>
        </div>
      </section>

      {/* Sticky Table of Contents */}
      <div className="sticky top-[64px] z-30 bg-white border-y border-border shadow-sm">
        <div className="container-narrow py-3">
          <div className="flex items-center gap-1 overflow-x-auto">
            {TABLE_OF_CONTENTS.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="shrink-0 text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5"
              >
                {i + 1}. {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <article className="section-wide">
        <div className="container-narrow" style={{ maxWidth: "44rem" }}>
          {/* What Is */}
          <section id="what-is" className="scroll-mt-32 mb-16">
            <h2 className="text-h2 text-foreground mb-6">What Is a Freedom Number?</h2>
            <div className="text-body text-muted-foreground space-y-5 leading-[1.8]">
              <p>
                Your <strong className="text-foreground">freedom number</strong> is the
                monthly recurring revenue (MRR) you need from products you own to fully
                replace your employment income and living expenses.
              </p>
              <p>
                It's the number that makes the golden handcuffs irrelevant. When your
                side business generates this much per month, consistently, you have
                optionality — the freedom to choose whether you keep working for someone
                else or not.
              </p>
              <p>
                Most corporate managers have never calculated this number. They operate
                on a vague feeling that "someday" they'll have enough. That vagueness
                is what keeps them trapped. A specific number changes everything. It
                turns an abstract dream into a math problem. And math problems have
                solutions.
              </p>
              <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-5 my-6">
                <p className="text-foreground font-medium">
                  The average freedom number for a corporate manager earning $120K-$200K
                  is <strong className="text-primary">$12,000-$20,000/month in MRR</strong>.
                  That sounds like a lot — until you realize it's 138-450 customers at
                  $29-$97/month. Boring products for boring industries.
                </p>
              </div>
            </div>
          </section>

          {/* Formula */}
          <section id="formula" className="scroll-mt-32 mb-16">
            <h2 className="text-h2 text-foreground mb-6">The Freedom Number Formula</h2>
            <div className="text-body text-muted-foreground space-y-5 leading-[1.8]">
              <p>The formula has three components:</p>
              <div className="bg-surface rounded-xl p-6 border border-border font-mono text-sm">
                <p className="text-foreground font-bold mb-3">Freedom Number =</p>
                <p className="text-muted-foreground">Monthly Living Expenses</p>
                <p className="text-muted-foreground">+ Monthly Salary Replacement (Annual Salary ÷ 12)</p>
                <p className="text-muted-foreground">+ Tax & Benefits Buffer (+30%)</p>
                <p className="text-foreground font-bold mt-3 border-t border-border pt-3">
                  = Your Monthly MRR Target
                </p>
              </div>
              <p>
                <strong className="text-foreground">Why the 30% buffer?</strong> Your
                employer covers more than just salary — there's healthcare, retirement
                match, paid time off, and other benefits worth $15,000-$30,000/year. Plus,
                self-employment tax is ~15.3% in the US (or equivalent elsewhere). The
                buffer ensures your freedom number actually replaces your total
                compensation, not just your base pay.
              </p>
            </div>
          </section>

          {/* Calculate */}
          <section id="calculate" className="scroll-mt-32 mb-16">
            <h2 className="text-h2 text-foreground mb-6">How to Calculate Yours (Step by Step)</h2>
            <div className="space-y-6">
              {[
                {
                  num: 1,
                  title: "Determine your annual salary (including bonuses)",
                  body: "Use your total compensation — base salary plus any expected bonus, not just your base pay. If you earn $120K base + $15K bonus, your number is $135,000.",
                },
                {
                  num: 2,
                  title: "Calculate monthly living expenses",
                  body: "Include everything: mortgage/rent, food, transportation, childcare, debt payments, subscriptions, healthcare premiums, and discretionary spending. Be honest — underestimating here is the #1 mistake.",
                },
                {
                  num: 3,
                  title: "Add the 30% tax and benefits buffer",
                  body: "Take your monthly salary replacement + expenses and multiply by 1.30. This covers self-employment taxes, healthcare, retirement contributions, and the benefits you're leaving behind.",
                },
                {
                  num: 4,
                  title: "Round up to the nearest $100",
                  body: "Round to give yourself a small margin. This is your freedom number — the monthly MRR target that replaces your employment.",
                },
              ].map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-primary/5 rounded-xl p-5 border border-primary/20 text-center">
              <p className="text-sm text-foreground mb-3">
                Want the calculator to do this for you?
              </p>
              <Link
                to="/freedom"
                onClick={() => trackEvent("pillar_guide_calculator_clicked")}
                className="btn-primary text-sm inline-flex items-center gap-2"
              >
                Calculate My Freedom Number (Free)
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* Examples Table */}
          <section id="examples" className="scroll-mt-32 mb-16">
            <h2 className="text-h2 text-foreground mb-6">Freedom Number Examples by Salary</h2>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-surface">
                    <th className="text-left p-3 font-semibold text-foreground">Salary</th>
                    <th className="text-left p-3 font-semibold text-foreground">Monthly Expenses</th>
                    <th className="text-left p-3 font-semibold text-primary">Freedom Number</th>
                    <th className="text-center p-3 font-semibold text-muted-foreground hidden sm:table-cell">@ $29/mo</th>
                    <th className="text-center p-3 font-semibold text-muted-foreground hidden sm:table-cell">@ $9/mo</th>
                  </tr>
                </thead>
                <tbody>
                  {SALARY_TABLE.map((row) => (
                    <tr key={row.salary} className="border-t border-border hover:bg-surface/50">
                      <td className="p-3 text-foreground font-medium">{row.salary}</td>
                      <td className="p-3 text-muted-foreground">{row.expenses}</td>
                      <td className="p-3 text-primary font-bold">{row.freedom}</td>
                      <td className="p-3 text-center text-muted-foreground hidden sm:table-cell">{row.customers29}</td>
                      <td className="p-3 text-center text-muted-foreground hidden sm:table-cell">{row.customers9}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Freedom number = (monthly expenses + monthly salary equivalent) × 1.30 buffer.
              Customer counts assume 100% of revenue goes toward freedom number (in practice, expect 70-80% margin).
            </p>
          </section>

          {/* Customers */}
          <section id="customers" className="scroll-mt-32 mb-16">
            <h2 className="text-h2 text-foreground mb-6">How Many Customers You Need</h2>
            <div className="text-body text-muted-foreground space-y-5 leading-[1.8]">
              <p>
                The beauty of the freedom number is that it reframes the problem. You're
                not trying to "build a business" — you're trying to acquire a specific
                number of customers at a specific price point.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                {[
                  { price: "$9/month", customers: "1,667", label: "for $15K freedom" },
                  { price: "$29/month", customers: "518", label: "for $15K freedom" },
                  { price: "$97/month", customers: "155", label: "for $15K freedom" },
                ].map((tier) => (
                  <div key={tier.price} className="card-base p-5 text-center">
                    <p className="text-3xl font-bold text-primary mb-1">{tier.customers}</p>
                    <p className="text-xs text-muted-foreground">{tier.label}</p>
                    <p className="text-sm font-medium text-foreground mt-2">{tier.price}</p>
                  </div>
                ))}
              </div>
              <p>
                Higher pricing = fewer customers needed = faster path to freedom. A
                $97/month product serving a boring industry (electricians, plumbers,
                accountants) needs just 155 customers. That's achievable in 12-18 months
                with consistent distribution.
              </p>
            </div>
          </section>

          {/* Timeline */}
          <section id="timeline" className="scroll-mt-32 mb-16">
            <h2 className="text-h2 text-foreground mb-6">How Long It Takes to Hit</h2>
            <div className="text-body text-muted-foreground space-y-5 leading-[1.8]">
              <p>
                Based on Invisible Exit member data, here's the honest timeline for
                hitting your freedom number at 5 hours per week:
              </p>
              <div className="space-y-3">
                {[
                  { phase: "Months 1-3", milestone: "Build and launch first product", mrr: "$0" },
                  { phase: "Month 4", milestone: "First paying customer", mrr: "$9-50/mo" },
                  { phase: "Month 6", milestone: "Early traction, pricing validated", mrr: "$500-1,000/mo" },
                  { phase: "Month 9", milestone: "Growth phase, second product", mrr: "$1,500-2,500/mo" },
                  { phase: "Month 12-18", milestone: "Approaching or hitting freedom number", mrr: "$3,000-5,000+/mo" },
                ].map((stage) => (
                  <div key={stage.phase} className="flex items-start gap-4 p-4 rounded-lg border border-border">
                    <div className="w-20 shrink-0">
                      <p className="text-xs font-bold text-primary">{stage.phase}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{stage.milestone}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-foreground">{stage.mrr}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p>
                <strong className="text-foreground">Important:</strong> These are
                averages, not guarantees. Some members hit $2,000 MRR in 4 months. Others
                take 18 months to reach $1,000. The variable is execution consistency —
                how reliably you show up for your 5 hours each week.
              </p>
            </div>
          </section>

          {/* Framework */}
          <section id="framework" className="scroll-mt-32 mb-16">
            <h2 className="text-h2 text-foreground mb-6">The 5-Tool Framework to Reach It</h2>
            <div className="text-body text-muted-foreground space-y-5 leading-[1.8]">
              <p>
                Calculating your freedom number is step one. Building the system to hit
                it is everything else. The Invisible Exit System uses 5 connected tools:
              </p>
              <div className="space-y-4">
                {[
                  { icon: Calculator, name: "FYM Dashboard", job: "Calculates and tracks your freedom number", num: 1 },
                  { icon: Target, name: "Idea Pipeline", job: "Finds and validates the product that hits it", num: 2 },
                  { icon: Shield, name: "Stealth Ops Hub", job: "Keeps your employer from finding out", num: 3 },
                  { icon: Rocket, name: "Launch Control", job: "Ships products in your 5 hours/week", num: 4 },
                  { icon: TrendingUp, name: "Brand Manager", job: "Gets customers without showing your face", num: 5 },
                ].map((tool) => (
                  <div key={tool.name} className="flex items-center gap-4 p-4 rounded-lg border border-border card-hover">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                      {tool.num}
                    </span>
                    <tool.icon className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">{tool.job}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Content Upgrade */}
          <ContentUpgrade
            title="Get the Freedom Number Calculator + Checklist (Free)"
            description="The interactive calculator plus a 27-point checklist for planning your exit timeline. Takes 90 seconds. Sent to your inbox."
            source="pillar_freedom_number_guide"
            slug="freedom-number-guide"
          />

          {/* Mistakes */}
          <section id="mistakes" className="scroll-mt-32 mb-16">
            <h2 className="text-h2 text-foreground mb-6">5 Mistakes That Delay Freedom</h2>
            <div className="space-y-4">
              {MISTAKES.map((mistake, i) => (
                <div key={i} className="card-base p-5">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-destructive/10 text-destructive font-bold text-sm shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 text-sm">{mistake.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{mistake.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-32 mb-16">
            <h2 className="text-h2 text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <div key={faq.q} className="card-base p-5">
                  <h3 className="font-semibold text-foreground mb-2 text-sm">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section className="bg-surface rounded-2xl p-8 text-center border border-border">
            <h2 className="text-h2 text-foreground mb-3">Know your number yet?</h2>
            <p className="text-body text-muted-foreground mb-6">
              Stop guessing. Calculate your exact freedom number in 90 seconds.
            </p>
            <Link
              to="/freedom"
              onClick={() => trackEvent("pillar_guide_final_cta")}
              className="btn-primary text-lg inline-flex items-center gap-2"
            >
              Calculate My Freedom Number
              <ArrowRight className="w-5 h-5" />
            </Link>
          </section>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default PillarFreedomNumberPage;
