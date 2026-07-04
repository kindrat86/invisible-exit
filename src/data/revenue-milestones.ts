/**
 * Revenue milestone pages for /milestones/:slug.
 * Each page targets a specific MRR stage with stage-specific tactics and metrics.
 */

export interface RevenueMilestone {
  slug: string;
  stage: string;
  mrrRange: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  whatThisMeans: string;
  keyMetrics: { metric: string; target: string }[];
  tactics: { tactic: string; description: string; effort: string }[];
  commonMistakes: string[];
  toolsNeeded: string[];
  timeEstimate: string;
  faqs: { question: string; answer: string }[];
}

export const revenueMilestones: RevenueMilestone[] = [
  {
    slug: "0-to-100",
    stage: "First Customers",
    mrrRange: "$0-$100",
    metaTitle: "How to Get Your First $100 MRR in Micro-SaaS (2026)",
    metaDescription: "The exact steps to go from zero to $100/month in recurring revenue. Pre-selling, first customer acquisition, and validation tactics for solo founders.",
    h1: "From $0 to $100 MRR: Your First Micro-SaaS Customers",
    intro: "The hardest revenue to earn. Once you cross $100 MRR, you've proven someone will pay for what you built. Here's how to get there without wasting months building the wrong thing.",
    whatThisMeans: "At $100 MRR, you've validated that at least 3-5 people will pay for your solution. You've cleared the hardest hurdle: first customer acquisition. This is the proof that your idea has a pulse.",
    keyMetrics: [
      { metric: "Total customers", target: "3-5 paying" },
      { metric: "Monthly churn", target: "<15%" },
      { metric: "Time to first $100", target: "30-60 days" },
      { metric: "Support tickets/week", target: "<5" },
      { metric: "Onboarding completion", target: ">70%" },
    ],
    tactics: [
      { tactic: "Pre-sell before you build", description: "Create a landing page describing your solution. Offer 50% lifetime discount to the first 5 customers. If 3 people pay before the product exists, build it.", effort: "Low" },
      { tactic: "Sell to your network (carefully)", description: "Reach out to former colleagues in your target industry. Frame it as: 'I'm building something, would love your feedback on this problem.' Don't ask for payment — ask for the problem.", effort: "Low" },
      { tactic: "Offer done-for-you service first", description: "Instead of building automation, offer to do the task manually for $99. When you understand the workflow deeply, then build the automation. This funds your build phase.", effort: "Medium" },
      { tactic: "One customer at a time", description: "Don't try to scale yet. Find one customer, deliver exceptional value, ask for a testimonial, then find the next one. Manual outreach works at this stage.", effort: "Medium" },
    ],
    commonMistakes: [
      "Building for 6 months without talking to a single customer",
      "Pricing too low ($5-$10/month) — you can't validate demand at that price",
      "Adding features before you have 5 paying customers",
      "Focusing on SEO and ads instead of direct conversations",
    ],
    toolsNeeded: ["Landing page (Framer/Carrd)", "Stripe payment link", "Typeform for intake", "Calendly for calls", "Linear for task tracking"],
    timeEstimate: "30-60 days",
    faqs: [
      { question: "Should I charge from day one?", answer: "Yes. Free users don't validate demand. Charging $19-$49/month from day one proves willingness to pay. If no one pays, you have the wrong idea, not the wrong price." },
      { question: "How many customers do I need for $100 MRR?", answer: "At $29/month, you need 4 customers. At $49/month, 2 customers. Higher prices mean faster validation. Don't underprice." },
    ],
  },
  {
    slug: "100-to-500",
    stage: "Early Traction",
    mrrRange: "$100-$500",
    metaTitle: "How to Grow from $100 to $500 MRR in Micro-SaaS (2026)",
    metaDescription: "Stage-specific tactics for growing your micro-SaaS from $100 to $500 MRR. Customer acquisition, pricing optimization, and retention strategies.",
    h1: "From $100 to $500 MRR: Building Early Traction",
    intro: "You have paying customers. Now you need more of them. This stage is about finding repeatable acquisition channels and improving your product based on real user feedback.",
    whatThisMeans: "At $500 MRR, you're approaching ramen profitability. It's no longer a hobby — it's a real business that covers one or two bills. This is where you learn whether you can scale.",
    keyMetrics: [
      { metric: "Total customers", target: "10-20 paying" },
      { metric: "Monthly churn", target: "<10%" },
      { metric: "Customer acquisition cost", target: "<$20" },
      { metric: "Net promoter score", target: ">30" },
      { metric: "Weekly active users", target: ">50% of customers" },
    ],
    tactics: [
      { tactic: "Ask every customer for referrals", description: "Send a personal email to each customer: 'If you know someone who would benefit from this, can I buy you coffee?' Offer a free month for referrals.", effort: "Low" },
      { tactic: "Write 10 blog posts targeting customer pain points", description: "Each post should answer the exact question your customer typed into Google before they found you. Use Keyword research from the actual words your customers use.", effort: "Medium" },
      { tactic: "Offer an annual plan at 2 months discount", description: "Convert monthly customers to annual. This improves retention AND gives you cash upfront. 'Pay $297/year instead of $29/month.'", effort: "Low" },
      { tactic: "Add a simple referral program", description: "Give both parties 1 month free. Use a simple link. Track manually. Don't over-engineer it.", effort: "Medium" },
    ],
    commonMistakes: [
      "Raising prices too fast before understanding willingness to pay",
      "Adding features instead of improving the core workflow",
      "Neglecting customer success — losing customers at $500 hurts more than at $100",
      "Scaling paid ads before organic channels are proven",
    ],
    toolsNeeded: ["Blog (Ghost or built-in)", "PostHog analytics", "Stripe", "Simple CRM (Airtable)", "Calendly"],
    timeEstimate: "2-4 months",
    faqs: [
      { question: "How much should I spend on marketing at this stage?", answer: "Close to $0. Every dollar goes to building. Organic content, direct outreach, and referrals are all free. Paid ads only make sense when you know your LTV:CAC ratio." },
      { question: "Should I raise prices?", answer: "Only if you're at capacity and customers are delighted. A 10-20% price increase on new customers is safe. Grandfather existing customers to avoid churn." },
    ],
  },
  {
    slug: "500-to-1k",
    stage: "Ramen Profitable",
    mrrRange: "$500-$1,000",
    metaTitle: "How to Grow from $500 to $1,000 MRR in Micro-SaaS (2026)",
    metaDescription: "Stage-specific tactics for scaling your micro-SaaS from $500 to $1,000 MRR. Content marketing, pricing experiments, and building for retention.",
    h1: "From $500 to $1,000 MRR: Reaching Ramen Profitable",
    intro: "You're past the fragile stage. Multiple customers, proven retention, and a product people use daily. Now it's about scaling what works and building the foundations for $4K/month.",
    whatThisMeans: "At $1,000 MRR, your micro-SaaS covers rent or mortgage. It's a real income stream. The question shifts from 'will anyone pay' to 'how do I get to a large enough number of customers.'",
    keyMetrics: [
      { metric: "Monthly churn", target: "<8%" },
      { metric: "Customer acquisition cost", target: "<$50" },
      { metric: "Customer LTV", target: ">$600" },
      { metric: "Organic traffic", target: ">1,000 visits/month" },
      { metric: "Feature requests/feedback", target: ">5/week" },
    ],
    tactics: [
      { tactic: "Double down on your best acquisition channel", description: "Look at where your last 10 customers came from. Is it blog posts? Reddit? Referrals? Do more of that. Kill channels that haven't produced a customer.", effort: "Medium" },
      { tactic: "Run a price test", description: "Split new signups: half at current price, half at +20%. Run for 1 month. If revenue per customer goes up more than conversion drops, raise prices.", effort: "Medium" },
      { tactic: "Build 'aha moment' onboarding", description: "Analyze your best customers: what did they do in their first week? Create an onboarding flow that gets every new user to that moment faster.", effort: "High" },
      { tactic: "Write competitor comparison pages", description: "If competitors exist, write detailed comparison pages. 'X vs Y' pages capture high-intent traffic from people ready to switch or choose.", effort: "Low" },
    ],
    toolsNeeded: ["PostHog for analytics", "Stripe for billing", "Ghost/blog for content", "Airtable for ops", "Linear for roadmap"],
    timeEstimate: "3-6 months",
    faqs: [
      { question: "When should I hire help?", answer: "Not yet. At $1,000 MRR, you can't afford an employee. But you can afford contractors: a freelancer for a one-time task, a VA for 5 hours/week." },
      { question: "Should I add more payment options?", answer: "Only if customers ask. Adding Paddle for EU customers or accepting bank transfers can reduce friction for specific segments." },
    ],
  },
  {
    slug: "1k-to-4k",
    stage: "Freedom Number",
    mrrRange: "$1,000-$4,000",
    metaTitle: "How to Grow from $1,000 to $4,000 MRR in Micro-SaaS (2026)",
    metaDescription: "The playbook for scaling your micro-SaaS from $1,000 to $4,000 MRR — the freedom number. SEO, partnerships, advanced retention, and the first hires.",
    h1: "From $1,000 to $4,000 MRR: Reaching Your Freedom Number",
    intro: "This is the most important journey in micro-SaaS. Crossing $4,000 MRR transforms your side business from 'extra income' into 'I could quit my job' territory. The tactics change from survival to systems.",
    whatThisMeans: "At $4,000 MRR, you've reached the freedom number. At this point, your recurring revenue covers core living expenses. You can walk into your employer's office and resign without panic.",
    keyMetrics: [
      { metric: "Monthly churn", target: "<5%" },
      { metric: "Customer count", target: "138+ (at $29/mo)" },
      { metric: "Organic traffic", target: ">5,000 visits/month" },
      { metric: "Customer LTV", target: ">$1,200" },
      { metric: "Support requests/week", target: "<20 (tools should reduce this)" },
    ],
    tactics: [
      { tactic: "SEO content engine", description: "Build a content calendar with 4 posts/month targeting long-tail keywords. Use existing customer questions as blog topics. Aim for 10k organic visits/month.", effort: "High" },
      { tactic: "Partner with complementary products", description: "Find non-competing SaaS tools in adjacent niches. Offer their users a discount. Offer yours a discount on their product. Cross-promote via email.", effort: "Medium" },
      { tactic: "Run a 'win-back' campaign for churned customers", description: "Export your churned customers. Send a personal email: 'I noticed you left. What would it take to get you back?' Offer a free month. You'll recover 5-10% of churned MRR.", effort: "Low" },
      { tactic: "Implement self-serve onboarding", description: "Remove yourself from the funnel. Video onboarding, knowledge base, and automated email sequences should handle 90% of new signups.", effort: "High" },
    ],
    toolsNeeded: ["PostHog", "Stripe", "Intercom (or Crisp)", "Ghost/blog", "Google Search Console", "Supabase"],
    timeEstimate: "6-12 months",
    faqs: [
      { question: "Can I quit my job at $4,000 MRR?", answer: "Yes, if your lifestyle aligns. $4,000/month covers core expenses for most single people in non-VHCOL areas. Factor in taxes ($4K MRR ≈ $3K after taxes) and health insurance ($300-$600/month)." },
      { question: "Should I raise prices at this stage?", answer: "Grandfather existing customers. Raise prices for new customers by 20-30%. Your product is worth more now than when you started. Test it on a cohort." },
    ],
  },
  {
    slug: "4k-to-10k",
    stage: "Full Replacement",
    mrrRange: "$4,000-$10,000",
    metaTitle: "How to Grow from $4K to $10K MRR in Micro-SaaS (2026)",
    metaDescription: "Scaling your micro-SaaS from $4,000 to $10,000 MRR. Systems, team, and advanced growth strategies for full-time founders.",
    h1: "From $4,000 to $10,000 MRR: Full-Time Founder Mode",
    intro: "You've proven the model. Now it's about systems, leverage, and building a business that runs without you. At $10K MRR, you're a full-time founder — whether you've quit your job or not.",
    whatThisMeans: "At $10,000 MRR, your business replaces a $120K-$150K salary. It's a serious business. You can hire your first employee, invest in growth, and take money off the table.",
    keyMetrics: [
      { metric: "Monthly churn", target: "<4%" },
      { metric: "Customer count", target: "200+ (at $49/mo)" },
      { metric: "Organic traffic", target: ">20K visits/month" },
      { metric: "Support tickets", target: "<50/week (automated)" },
      { metric: "Team size", target: "1 FTE + contractors" },
    ],
    tactics: [
      { tactic: "Hire your first contractor", description: "Delegate support or content. Pay $500-$1K/month. Free up 10 hours/week for growth work. This is the most important investment you'll make.", effort: "Medium" },
      { tactic: "Build an affiliate program", description: "Offer 30% recurring commission. Existing customers and niche influencers can be your sales team. Automated signup and tracking.", effort: "Medium" },
      { tactic: "Product-led growth loops", description: "Add features that create virality: shareable reports, team invites, public dashboards. Each user brings more users.", effort: "High" },
    ],
    commonMistakes: [
      "DIY-ing everything when you should delegate",
      "Ignoring customer segments with different needs",
      "Letting churn creep up as customer base grows",
    ],
    toolsNeeded: ["Stripe", "PostHog", "Intercom/Crisp", "Affiliate platform", "QuickBooks"],
    timeEstimate: "6-12 months",
    faqs: [
      { question: "Should I form an S-Corp at this stage?", answer: "Yes. At $10K+ MRR ($120K+ ARR), an S-Corp election saves you self-employment tax. Talk to a CPA about the election timing." },
      { question: "How do I handle customer support at scale?", answer: "Hire a part-time support person. Create a knowledge base that answers the top 20 questions. Automate responses for common issues." },
    ],
  },
  {
    slug: "10k-to-25k",
    stage: "Scaling",
    mrrRange: "$10,000-$25,000",
    metaTitle: "How to Grow from $10K to $25K MRR in Micro-SaaS",
    metaDescription: "Advanced growth strategies for scaling your micro-SaaS from $10,000 to $25,000 MRR. Team building, advanced SEO, and acquisition readiness.",
    h1: "From $10,000 to $25,000 MRR: Serious Business",
    intro: "Your micro-SaaS is now a real company. At $25K MRR ($300K ARR), you're in the top 5% of bootstrapped SaaS businesses. The game changes from 'survive' to 'systematize.'",
    whatThisMeans: "At $25,000 MRR, you're generating $300K ARR — more than most founder salaries. You can hire 2-3 people, build a real product team, and think about market expansion.",
    keyMetrics: [
      { metric: "Monthly churn", target: "<3%" },
      { metric: "Customer count", target: "500+ (at $49/mo)" },
      { metric: "Organic growth", target: ">70% of new customers" },
      { metric: "Team size", target: "2-3 FTE" },
      { metric: "Gross margin", target: ">80%" },
    ],
    tactics: [
      { tactic: "Expand to adjacent markets", description: "Your product serves one niche. Expand to a related niche with similar workflow. The code is 80% the same; the messaging is different.", effort: "High" },
      { tactic: "Enterprise features for higher tiers", description: "Add SSO, role-based access, audit logs, and SLA support. Charge $199-$499/month. Enterprise customers are stickier and more valuable.", effort: "High" },
      { tactic: "SEO content at scale", description: "Publish 8+ articles/month. Target 'best X for Y', 'X vs Y', and 'X alternative' keywords. Build topical clusters for domain authority.", effort: "Medium" },
    ],
    commonMistakes: [
      "Not differentiating between user segments",
      "Under-investing in brand and positioning",
      "Keeping prices too low for enterprise value delivered",
    ],
    toolsNeeded: ["Full Supabase/backend", "Enterprise auth (Auth0)", "Intercom", "Salesforce (or similar CRM)", "QuickBooks"],
    timeEstimate: "12-18 months",
    faqs: [
      { question: "Should I raise venture capital?", answer: "Probably not. Most micro-SaaS businesses don't need VC. If you want to grow faster, consider revenue-based financing or a small business loan instead." },
      { question: "How do I find my first hire?", answer: "Look for someone who uses your product and loves it. They already understand the customer. Hire for attitude first, skills second." },
    ],
  },
  {
    slug: "25k-to-50k",
    stage: "High Growth",
    mrrRange: "$25,000-$50,000",
    metaTitle: "How to Scale from $25K to $50K MRR in SaaS",
    metaDescription: "Growth strategies for scaling your SaaS from $25,000 to $50,000 MRR. Enterprise features, partnerships, and acquisition preparation.",
    h1: "From $25,000 to $50,000 MRR: Acquisition Target",
    intro: "At $50K MRR ($600K ARR), your business is an acquisition target. This is the sweet spot for MicroAcquire and bootstrapped SaaS buyers. Build for transferability.",
    whatThisMeans: "At $50K MRR, you've built a $600K ARR business worth $1.5M-$3M on the acquisition market. You can sell, continue growing, or hire a CEO and step back.",
    keyMetrics: [
      { metric: "Monthly churn", target: "<2%" },
      { metric: "Enterprise customers", target: ">20% of revenue" },
      { metric: "Net revenue retention", target: ">110%" },
      { metric: "Team size", target: "5-8 people" },
      { metric: "Valuation range", target: "$1.5M-$3M" },
    ],
    tactics: [
      { tactic: "Build for acquisition", description: "Document all systems, reduce founder dependency, build a management team. Buyers pay more for businesses that don't need the founder.", effort: "High" },
      { tactic: "Add a second product line", description: "Expand with a complementary product. Cross-sell to existing customers. A second product doubles your TAM and your valuation multiple.", effort: "High" },
      { tactic: "Develop strategic partnerships", description: "Integrate with complementary platforms. Revenue-sharing partnerships can open distribution channels you can't access alone.", effort: "Medium" },
    ],
    commonMistakes: [
      "Not starting the acquisition readiness process early enough",
      "Founder being a bottleneck on every decision",
      "Neglecting to diversify customer concentration risk",
    ],
    toolsNeeded: ["Full system stack", "Enterprise billing (Orbit)", "Customer success tool", "BI/analytics", "Legal docs template"],
    timeEstimate: "12-24 months",
    faqs: [
      { question: "What multiple can I expect in an acquisition?", answer: "Bootstrapped SaaS businesses sell for 3-5x ARR. At $600K ARR with good growth and low churn, expect $1.8M-$3M. Add 1-2x for strategic buyers." },
      { question: "Should I sell or keep growing?", answer: "That's a personal question. If you love building, keep going. If you want liquidity or a new challenge, sell. Both paths are valid." },
    ],
  },
  {
    slug: "50k-plus",
    stage: "Exit Ready",
    mrrRange: "$50,000+",
    metaTitle: "How to Build a $50K+ MRR SaaS Business (2026)",
    metaDescription: "Strategies for reaching $50,000+ MRR. Enterprise sales, multiple products, team building, and preparing for acquisition.",
    h1: "From $50,000+ MRR: The Exit-Ready Business",
    intro: "You've built a $600K+ ARR business. You're in the top 1% of bootstrapped founders. Now it's about scale, systems, and optionality: acqui-hire, growth equity, or lifestyle business.",
    whatThisMeans: "At $50K+ MRR, you've built a generational asset. The business runs without you. You have real options: sell, hire a CEO and step back, or keep building. You're free.",
    keyMetrics: [
      { metric: "Monthly churn", target: "<2%" },
      { metric: "Net revenue retention", target: ">120%" },
      { metric: "Annual recurring revenue", target: "$600K+" },
      { metric: "Team size", target: "5-15 people" },
      { metric: "Valuation", target: "$2M-$5M+" },
    ],
    tactics: [
      { tactic: "Hire a CEO or COO", description: "Step away from day-to-day operations. Hire someone to run the business. Keep your equity. Become the product visionary.", effort: "High" },
      { tactic: "Explore secondary sales", description: "Sell 10-20% of your equity to an investor or employee. Get liquidity without selling the whole company. Diversity your net worth.", effort: "High" },
      { tactic: "Product-led growth engine", description: "Your product should sell itself. Self-serve onboarding, viral loops, and community-driven growth should generate most new customers.", effort: "High" },
    ],
    commonMistakes: [
      "Not building a management team early enough",
      "Letting the business plateau instead of experimenting",
      "Failing to diversify revenue across segments and geographies",
    ],
    toolsNeeded: ["Full enterprise stack", "Board reporting software", "Financial planning tool", "Employment law counsel", "Wealth management advisor"],
    timeEstimate: "3-5 years total journey",
    faqs: [
      { question: "Is it worth staying at this stage or sell?", answer: "If you love building, stay. If you want financial freedom, sell at 3-5x ARR. The 'right' answer depends on your goals, not the business metrics." },
      { question: "How do I prevent the business from plateauing?", answer: "Keep innovating. Don't optimize what exists at the expense of new experiments. Dedicate 20% of engineering to new product bets." },
    ],
  },
];

export function getMilestoneBySlug(slug: string): RevenueMilestone | undefined {
  return revenueMilestones.find((m) => m.slug === slug);
}
