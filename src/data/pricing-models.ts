/**
 * Pricing model pages for /pricing-models/:slug.
 * "How to price a [type] micro-SaaS"
 */
export interface PricingModel {
  slug: string;
  model: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  howItWorks: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  realExamples: { product: string; pricing: string; revenue: string }[];
  benchmarks: { metric: string; value: string }[];
  implementation: string;
  faqs: { question: string; answer: string }[];
}

const modelData = [
  {
    slug: "freemium-pricing", model: "Freemium",
    howItWorks: "Offer a free tier with core features, then charge for advanced functionality, higher limits, or premium support. The free tier acts as a lead generation tool — users try without risk, then upgrade when they hit limits.",
    bestFor: "Products with low marginal cost per user, high viral coefficient, and a natural 'aha moment' that demonstrates value within the free tier.",
    examples: [
      { product: "Notion", pricing: "Free for individuals, $8-14/user/mo for teams", revenue: "$500M+ ARR" },
      { product: "Slack", pricing: "Free up to 10K messages, $7-12/user/mo for unlimited", revenue: "$1.5B+ ARR" },
      { product: "Mailchimp", pricing: "Free up to 500 contacts, $13+/mo for paid", revenue: "$800M+ ARR" },
    ],
    benchmarks: [
      { metric: "Free-to-paid conversion rate", value: "2-5% (good), 5-10% (excellent)" },
      { metric: "Time to first upgrade", value: "30-90 days average" },
      { metric: "Free tier cost per user", value: "$0.10-$1.00/month" },
    ],
  },
  {
    slug: "per-user-pricing", model: "Per-User",
    howItWorks: "Charge a fixed monthly amount for each user seat. This is the dominant B2B SaaS model because revenue scales linearly with team size and buyers intuitively understand the value.",
    bestFor: "B2B team collaboration tools, project management, CRM, and any product where value increases with team-wide adoption.",
    examples: [
      { product: "Linear", pricing: "$8-14/user/mo", revenue: "$20M+ ARR" },
      { product: "Figma", pricing: "$12-45/user/mo", revenue: "$400M+ ARR" },
      { product: "Jira", pricing: "$7-14/user/mo", revenue: "$1B+ ARR" },
    ],
    benchmarks: [
      { metric: "Average seats per account", value: "5-15 for SMB, 50+ for enterprise" },
      { metric: "Annual seat growth", value: "20-40% (healthy teams)" },
      { metric: "Churn impact of per-seat", value: "Lower than flat-rate (harder to remove seats)" },
    ],
  },
  {
    slug: "tiered-pricing", model: "Tiered",
    howItWorks: "Offer 2-4 pricing tiers with increasing feature sets and limits. Each tier serves a different customer segment. The classic pattern is Starter → Pro → Business → Enterprise.",
    bestFor: "Products serving multiple customer segments with different budgets and needs. Works best when features have clear 'gates' that justify higher tiers.",
    examples: [
      { product: "HubSpot", pricing: "$20 (Starter) to $3,600+/mo (Enterprise)", revenue: "$1.7B+ ARR" },
      { product: "Vercel", pricing: "Free (Hobby) to $20 (Pro) to $2,500+/mo (Enterprise)", revenue: "$100M+ ARR" },
      { product: "Zapier", pricing: "$19.99 to $799+/mo", revenue: "$250M+ ARR" },
    ],
    benchmarks: [
      { metric: "Most popular tier", value: "Middle tier (60-70% of revenue)" },
      { metric: "Top tier adoption", value: "5-10% of customers, 30%+ of revenue" },
      { metric: "Optimal tier count", value: "3-4 (more causes decision paralysis)" },
    ],
  },
  {
    slug: "usage-based-pricing", model: "Usage-Based",
    howItWorks: "Charge based on consumption — API calls, emails sent, storage used, or transactions processed. Customers pay only for what they use, which reduces friction to start and scales naturally.",
    bestFor: "Infrastructure, API, and developer tools where usage is measurable and predictable. Also works for email, SMS, and cloud services.",
    examples: [
      { product: "Stripe", pricing: "2.9% + $0.30 per transaction", revenue: "$14B+ revenue" },
      { product: "Twilio", pricing: "$0.0075+ per SMS, per-minute voice", revenue: "$3.8B+ ARR" },
      { product: "AWS", pricing: "Pay per compute-hour, GB stored, GB transferred", revenue: "$80B+ ARR" },
    ],
    benchmarks: [
      { metric: "Net revenue retention", value: "120-140% (usage grows over time)" },
      { metric: "Time to $1K MRR", value: "3-6 months (faster than tiered)" },
      { metric: "Revenue predictability", value: "Lower (usage fluctuates)" },
    ],
  },
  {
    slug: "flat-rate-pricing", model: "Flat-Rate",
    howItWorks: "One product, one price. No tiers, no usage limits, no per-user charges. This is the simplest model and works well for solo founders who want minimal pricing complexity.",
    bestFor: "Single-feature tools, consumer apps, and products where all users get the same value regardless of size.",
    examples: [
      { product: "Basecamp", pricing: "$99/month flat (unlimited users)", revenue: "$200M+ ARR" },
      { product: "Carrd", pricing: "$19/year for Pro features", revenue: "$500K+ ARR" },
      { product: "Write.as", pricing: "$6-9/month flat", revenue: "$300K+ ARR" },
    ],
    benchmarks: [
      { metric: "Pricing simplicity", value: "Highest (no sales calls needed)" },
      { metric: "Revenue ceiling", value: "Lower (hard to capture enterprise value)" },
      { metric: "Churn rate", value: "4-8% monthly (typical for flat-rate SaaS)" },
    ],
  },
  {
    slug: "value-based-pricing", model: "Value-Based",
    howItWorks: "Price based on the value delivered to the customer, not the cost to produce. If your product saves a company $50,000/year, charging $5,000/year is a no-brainer.",
    bestFor: "B2B products with clear ROI metrics, enterprise tools, and niche industry solutions where alternatives are expensive.",
    examples: [
      { product: "Salesforce", pricing: "$25-500/user/mo based on value tier", revenue: "$35B+ ARR" },
      { product: "Workday", pricing: "$50-200+/user/mo enterprise", revenue: "$6B+ ARR" },
      { product: "Bloomberg Terminal", pricing: "$24,000/year per seat", revenue: "$10B+ revenue" },
    ],
    benchmarks: [
      { metric: "Price-to-value ratio", value: "1:10 or better (charge 10% of value delivered)" },
      { metric: "Sales cycle length", value: "30-90 days (requires consultation)" },
      { metric: "Gross margin", value: "70-85% (high margin, high touch)" },
    ],
  },
  {
    slug: "lifetime-deal-pricing", model: "Lifetime Deal",
    howItWorks: "Charge a one-time fee for permanent access. This generates cash upfront and works well for bootstrapped founders who need runway, but creates long-term support obligations.",
    bestFor: "Tools with low ongoing infrastructure costs, early-stage products needing validation, and self-serve products that don't require active support.",
    examples: [
      { product: "AppSumo deals", pricing: "$49-299 one-time", revenue: "$100M+ lifetime deal marketplace" },
      { product: "Lemon Squeezy", pricing: "Started as $99 LTD, moved to subscription", revenue: "$5M+ ARR post-transition" },
      { product: "SendFox", pricing: "$49 lifetime for 5,000 contacts", revenue: "$2M+ ARR" },
    ],
    benchmarks: [
      { metric: "Refund rate", value: "5-15% (higher than subscription)" },
      { metric: "LTD-to-subscription conversion", value: "30-50% will pay for upgrades" },
      { metric: "Customer lifetime value", value: "Capped (no recurring revenue)" },
    ],
  },
  {
    slug: "free-trial-pricing", model: "Free Trial",
    howItWorks: "Offer full access for a limited time (7, 14, or 30 days), then require payment. This reduces signup friction while creating urgency. Often combined with tiered or per-user pricing.",
    bestFor: "Products with a clear 'aha moment' that occurs within the trial period, and where switching costs are low enough that users need to experience the value before paying.",
    examples: [
      { product: "Netflix", pricing: "30-day free trial → $7-20/mo", revenue: "$31B+ revenue" },
      { product: "Adobe Creative Cloud", pricing: "7-day trial → $55/mo", revenue: "$19B+ revenue" },
      { product: "Semrush", pricing: "7-day trial → $120-450/mo", revenue: "$250M+ ARR" },
    ],
    benchmarks: [
      { metric: "Trial-to-paid conversion", value: "15-25% (B2B), 2-5% (B2C)" },
      { metric: "Optimal trial length", value: "7-14 days (urgency > generosity)" },
      { metric: "Trial churn reason #1", value: "Never had the 'aha moment'" },
    ],
  },
  {
    slug: "annual-prepaid-pricing", model: "Annual Prepaid",
    howItWorks: "Charge for a full year upfront, usually with a 15-20% discount vs. monthly billing. This improves cash flow, reduces churn, and lowers payment processing costs.",
    bestFor: "Any subscription product. Annual plans should always be offered alongside monthly — they capture different buyer preferences.",
    examples: [
      { product: "Substack", pricing: "$5-50/mo or $48-480/year (20% savings)", revenue: "$300M+ revenue" },
      { product: "GitHub", pricing: "$4/user/mo or $36/year (25% savings)", revenue: "$1B+ ARR" },
      { product: "Notion", pricing: "$8-14/user/mo or $72-126/year (save ~20%)", revenue: "$500M+ ARR" },
    ],
    benchmarks: [
      { metric: "Annual plan adoption rate", value: "30-50% of paying customers" },
      { metric: "Annual churn vs monthly", value: "50-70% lower (annual contracts stick)" },
      { metric: "Cash flow improvement", value: "10-12 months of runway freed up" },
    ],
  },
  {
    slug: "money-back-guarantee-pricing", model: "Money-Back Guarantee",
    howItWorks: "Offer a full refund within a specific window (30, 60, or 90 days). This removes risk for the buyer and is particularly effective for higher-priced products or courses.",
    bestFor: "Products with high perceived risk, info products, courses, and premium tools where buyers hesitate before committing.",
    examples: [
      { product: "ConvertKit", pricing: "30-day money-back guarantee on all plans", revenue: "$30M+ ARR" },
      { product: "Teachable", pricing: "30-day refund on course platform fees", revenue: "$80M+ ARR" },
      { product: "Thinkific", pricing: "30-day money-back on paid plans", revenue: "$50M+ ARR" },
    ],
    benchmarks: [
      { metric: "Refund rate", value: "2-8% (healthy), >15% (product issue)" },
      { metric: "Conversion uplift", value: "20-40% (vs. no guarantee)" },
      { metric: "Optimal guarantee length", value: "30 days (standard), 90 days (premium)" },
    ],
  },
  {
    slug: "pay-what-you-want-pricing", model: "Pay What You Want",
    howItWorks: "Let customers choose their own price, including $0. This is rare for SaaS but works for digital products, content, and community access. The psychology is that it builds goodwill and captures price-insensitive buyers.",
    bestFor: "Digital products with zero marginal cost, content creators with loyal audiences, and early-stage products seeking maximum distribution.",
    examples: [
      { product: "Humble Bundle", pricing: "Pay what you want for game bundles", revenue: "$100M+ raised for charity" },
      { product: "Substack (some pubs)", pricing: "Optional paid tier, reader chooses amount", revenue: "$300M+ platform-wide" },
      { product: "Bandcamp", pricing: "Artists set 'name your price' for music", revenue: "$100M+ in artist payouts" },
    ],
    benchmarks: [
      { metric: "Average payment", value: "$5-15 (much less than fixed pricing)" },
      { metric: "Percentage who pay $0", value: "60-80% of downloads" },
      { metric: "Top 10% payers revenue share", value: "60-70% of total revenue" },
    ],
  },
  {
    slug: "dynamic-pricing", model: "Dynamic Pricing",
    howItWorks: "Prices adjust automatically based on demand, usage patterns, customer segment, or market conditions. Common in travel and e-commerce, increasingly used in SaaS for usage-based add-ons.",
    bestFor: "Products with variable demand (API rate limits), marketplace platforms, and enterprise tools where pricing negotiations are standard.",
    examples: [
      { product: "Snowflake", pricing: "Per-second compute + storage, auto-scaling", revenue: "$3B+ ARR" },
      { product: "DataDog", pricing: "Per host, per million traces, per GB logs", revenue: "$2B+ ARR" },
      { product: "Algolia", pricing: "Per 1,000 operations + records stored", revenue: "$200M+ ARR" },
    ],
    benchmarks: [
      { metric: "Revenue per customer variance", value: "10-50x between small and large users" },
      { metric: "Pricing transparency", value: "Low (custom quotes for enterprise)" },
      { metric: "Net revenue retention", value: "130%+ (usage grows with customer success)" },
    ],
  },
];

function generatePricing(m: typeof modelData[0]): PricingModel {
  return {
    slug: m.slug,
    model: m.model,
    metaTitle: `${m.model} Pricing for Micro-SaaS: Does It Still Work in 2026?`,
    metaDescription: `Complete guide to ${m.model.toLowerCase()} pricing for micro-SaaS: how it works, pros and cons, real examples, benchmarks, implementation steps, and FAQs.`,
    h1: `${m.model} Pricing for Micro-SaaS: A Complete Guide`,
    intro: `${m.model} pricing is ${m.howItWorks.includes("dominant") ? "one of the most common" : "a specialized"} pricing model in SaaS. ${m.howItWorks} In this guide, we'll break down when to use it, real-world examples, benchmarks, and how to implement it in your micro-SaaS.`,
    howItWorks: m.howItWorks,
    pros: m.model === "Freemium" ? [
      "Massive top-of-funnel — free users become your distribution channel",
      "Reduces customer acquisition cost (organic word-of-mouth growth)",
      "Creates data moat — you learn from free users' behavior",
      "Viral coefficient is higher (free users invite other free users)",
    ] : [
      "Aligns revenue with customer value",
      "Reduces pricing complexity for buyers",
      "Creates predictable, recurring revenue",
      "Scales naturally as customers grow",
    ],
    cons: m.model === "Freemium" ? [
      "Free users cost money (server, support, onboarding) with no revenue",
      "Conversion rates are low (2-5%), so you need large free user volume",
      "Free tier can cannibalize paid conversions",
      "Support burden from free users can overwhelm a solo founder",
    ] : [
      "Requires clear value metrics that buyers understand",
      "Can be harder to forecast revenue vs. flat pricing",
      "May require sales conversations for enterprise pricing",
      "Risk of underpricing if value metrics aren't well-calibrated",
    ],
    bestFor: m.bestFor,
    realExamples: m.examples,
    benchmarks: m.benchmarks,
    implementation: `To implement ${m.model.toLowerCase()} pricing: 1) Define your value metric (what unit determines price). 2) Set your entry price point (start high — you can always lower). 3) Build the billing logic into your product (Stripe Billing, Lemon Squeezy, or Paddle handle most models). 4) Create a pricing page that clearly communicates the model. 5) Track your core metric (conversion, expansion, churn) weekly for the first 90 days.`,
    faqs: [
      {
        question: `Is ${m.model.toLowerCase()} pricing still profitable in 2026?`,
        answer: `Yes, when applied to the right product and audience. ${m.model} works best when ${m.bestFor.toLowerCase()}`,
      },
      {
        question: `What's the biggest mistake with ${m.model.toLowerCase()} pricing?`,
        answer: `Not testing enough. Most founders set a price based on gut feeling and never iterate. Run pricing experiments every 90 days — test different price points, tiers, and presentation formats. You're likely undercharging by 2-3x.`,
      },
      {
        question: "Should I offer discounts for annual prepayment?",
        answer: "Always. Annual prepayments improve cash flow by 10-12 months, reduce churn by 50-70%, and lower payment processing fees. Offer 15-20% discount vs. monthly billing. Most B2B customers prefer annual anyway (budget cycles are annual).",
      },
    ],
  };
}

export const pricingModels: PricingModel[] = modelData.map(generatePricing);
