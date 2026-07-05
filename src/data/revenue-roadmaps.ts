/**
 * Revenue Roadmap pSEO pages.
 * Pattern: /roadmap/to/:amount
 * Targets "how to make $X/month" searches.
 *
 * Each roadmap shows the path from $0 to a specific MRR target.
 */

export interface RevenueStage {
  mrr: string;
  customers: string;
  focus: string;
  timeToReach: string;
  keyActions: string[];
}

export interface RevenueRoadmap {
  slug: string;
  target: string;
  amount: number;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  customerMath: { pricing: string; customersNeeded: number; monthlyRevenue: string };
  stages: RevenueStage[];
  channelStrategy: { phase: string; channel: string; why: string }[];
  realisticTimeline: string;
  faqs: { question: string; answer: string }[];
}

export const revenueRoadmaps: RevenueRoadmap[] = [
  {
    slug: "to-500",
    target: "$500/month",
    amount: 500,
    metaTitle: "How to Make $500/Month in Micro-SaaS (Roadmap)",
    metaDescription: "The realistic path from $0 to $500/month in recurring revenue. Customer math, timeline, channels, and the exact steps to hit your first $500 MRR.",
    h1: "How to Make Your First $500/Month in Micro-SaaS",
    intro: "$500/month is the first meaningful milestone. It proves someone will pay for your product, covers your tool costs, and gives you the psychological boost to keep going. For an employed founder, this is achievable in 2-3 months of focused effort.",
    customerMath: { pricing: "$29/month", customersNeeded: 18, monthlyRevenue: "$522/month" },
    stages: [
      { mrr: "$0-$100", customers: "1-4 paying", focus: "Validate and build", timeToReach: "Weeks 1-4", keyActions: ["Pick a problem you can solve", "Build a minimal MVP", "Get 1 paying customer manually", "Charge from day one — no free tier"] },
      { mrr: "$100-$300", customers: "5-10 paying", focus: "Refine and find channels", timeToReach: "Weeks 5-8", keyActions: ["Talk to every customer", "Fix onboarding friction", "Find 1-2 reliable acquisition channels", "Post in relevant communities weekly"] },
      { mrr: "$300-$500", customers: "11-18 paying", focus: "Scale what works", timeToReach: "Weeks 9-12", keyActions: ["Double down on best channel", "Add annual billing option", "Ask for referrals", "Improve retention — reduce churn"] },
    ],
    channelStrategy: [
      { phase: "First 5 customers", channel: "Personal outreach + communities", why: "You need direct conversations to learn what customers actually want" },
      { phase: "Customers 5-15", channel: "Reddit + niche communities", why: "Your target audience hangs out in specific subreddits and forums" },
      { phase: "Customers 15-50", channel: "Content + SEO", why: "Write about the problem you solve. Organic search compounds." },
    ],
    realisticTimeline: "8-12 weeks for an employed founder working 5-8 hours/week on the side.",
    faqs: [
      { question: "How long does it take to make $500/month?", answer: "8-12 weeks if you are focused and building something people actually want. The biggest delay is usually not charging early enough. Start collecting money from customer #1." },
      { question: "What is the fastest path to $500 MRR?", answer: "A $29/month product where you need 18 customers. Price higher ($49-$99) to need fewer customers. Get your first 5 through personal outreach, then scale through communities and content." },
    ],
  },
  {
    slug: "to-1000",
    target: "$1,000/month",
    amount: 1000,
    metaTitle: "How to Make $1,000/Month in Micro-SaaS (2026 Guide)",
    metaDescription: "The path from $0 to $1,000/month recurring revenue. Customer math, pricing strategies, and the channels that work at this stage.",
    h1: "How to Make $1,000/Month in Micro-SaaS",
    intro: "$1,000/month in recurring revenue is a psychological turning point. It covers a mortgage payment, proves product-market fit, and means you have a real business, not a hobby.",
    customerMath: { pricing: "$29/month", customersNeeded: 35, monthlyRevenue: "$1,015/month" },
    stages: [
      { mrr: "$0-$300", customers: "1-10 paying", focus: "Validate and build", timeToReach: "Weeks 1-8", keyActions: ["Build MVP", "Get first paying customers", "Identify your best channel"] },
      { mrr: "$300-$700", customers: "11-24 paying", focus: "Productize and systematize", timeToReach: "Weeks 9-16", keyActions: ["Improve onboarding", "Start content marketing", "Set up email sequences", "Reduce manual work"] },
      { mrr: "$700-$1,000", customers: "25-35 paying", focus: "Scale acquisition", timeToReach: "Weeks 17-24", keyActions: ["Double down on best channel", "Add referral program", "Write SEO content weekly", "Improve free-trial conversion"] },
    ],
    channelStrategy: [
      { phase: "First 10 customers", channel: "Communities + personal outreach", why: "Direct relationships teach you what to build" },
      { phase: "Customers 10-25", channel: "Content marketing + SEO", why: "Writing about the problem you solve attracts qualified leads" },
      { phase: "Customers 25-50", channel: "Product Hunt + integrations", why: "One good launch can bring 20-30 customers at once" },
    ],
    realisticTimeline: "4-6 months for an employed founder working 8-10 hours/week.",
    faqs: [
      { question: "Is $1,000/month realistic while employed?", answer: "Yes. 4-6 months of focused effort (8-10 hours/week) is realistic. The key is pricing at $29-$49/month so you only need 20-35 customers, not 200." },
      { question: "What should I price my micro-SaaS at?", answer: "Start at $29/month minimum. $49 is better. Do not charge $9/month — you need 111 customers for $1K MRR vs 35 at $29. Higher pricing means fewer customers to support." },
    ],
  },
  {
    slug: "to-2000",
    target: "$2,000/month",
    amount: 2000,
    metaTitle: "How to Make $2,000/Month in Micro-SaaS (Roadmap)",
    metaDescription: "The realistic path from $0 to $2,000/month in recurring revenue. Customer math, pricing tiers, channels, and timeline for employed founders.",
    h1: "How to Make $2,000/Month in Micro-SaaS",
    intro: "$2,000/month covers most people's rent or mortgage. For an employed founder, this is the point where your side income starts to feel real — it changes how you think about your job.",
    customerMath: { pricing: "$49/month", customersNeeded: 41, monthlyRevenue: "$2,009/month" },
    stages: [
      { mrr: "$0-$1,000", customers: "1-35 paying", focus: "Product-market fit", timeToReach: "Weeks 1-24", keyActions: ["Build and validate", "Reach $1K MRR first", "Identify best acquisition channel", "Reduce churn below 5%"] },
      { mrr: "$1,000-$1,500", customers: "36-50 paying", focus: "Systematize growth", timeToReach: "Weeks 25-32", keyActions: ["Automate onboarding", "Start email marketing", "Add annual billing (20% discount)", "Create referral incentive"] },
      { mrr: "$1,500-$2,000", customers: "51-70 paying", focus: "Add a second channel", timeToReach: "Weeks 33-40", keyActions: ["Launch a second channel (ads, integrations, SEO)", "Increase pricing for new customers", "Add higher tier ($99/mo)", "Build case studies from existing customers"] },
    ],
    channelStrategy: [
      { phase: "$0-$1K", channel: "Communities + content", why: "Low-cost channels that build authority" },
      { phase: "$1K-$1.5K", channel: "SEO + integrations", why: "Compounding channels that scale without your time" },
      { phase: "$1.5K-$2K", channel: "Partnerships + referrals", why: "Leverage other people's audiences" },
    ],
    realisticTimeline: "6-10 months for an employed founder working 8-12 hours/week.",
    faqs: [
      { question: "How do I get from $1K to $2K MRR?", answer: "Two things: add a second acquisition channel (most founders plateau with one) and increase pricing. Raising from $29 to $39 for new customers adds 30% revenue instantly. Add a $99 tier for power users." },
    ],
  },
  {
    slug: "to-4000",
    target: "$4,000/month",
    amount: 4000,
    metaTitle: "How to Make $4,000/Month in Micro-SaaS (Freedom Number)",
    metaDescription: "The path from $0 to $4,000/month — the freedom number for most corporate managers. Customer math, channels, and exit planning.",
    h1: "How to Make $4,000/Month in Micro-SaaS",
    intro: "$4,000/month is the freedom number for most corporate managers. At this level, your recurring revenue covers core living expenses with a 12-month buffer. It is the point where your job becomes optional.",
    customerMath: { pricing: "$49/month", customersNeeded: 82, monthlyRevenue: "$4,018/month" },
    stages: [
      { mrr: "$0-$2,000", customers: "1-70 paying", focus: "Build the foundation", timeToReach: "Months 1-10", keyActions: ["Reach $2K MRR first", "Establish your primary channel", "Keep churn below 4% monthly"] },
      { mrr: "$2,000-$3,000", customers: "71-100 paying", focus: "Build a growth engine", timeToReach: "Months 11-14", keyActions: ["Scale content marketing (2 posts/week)", "Add SEO landing pages", "Build automated onboarding", "Create case studies"] },
      { mrr: "$3,000-$4,000", customers: "101-140 paying", focus: "Optimize everything", timeToReach: "Months 15-18", keyActions: ["Raise pricing for new customers ($59-$79)", "Add enterprise/team tier ($199+)", "Improve retention with annual plans", "Consider paid acquisition (profitable LTV)"] },
    ],
    channelStrategy: [
      { phase: "$2K-$3K", channel: "SEO + content engine", why: "Compounding traffic from search" },
      { phase: "$3K-$3.5K", channel: "Partnerships + integrations", why: "Leverage other platforms' user bases" },
      { phase: "$3.5K-$4K", channel: "Paid acquisition + referrals", why: "Once LTV > 3x CAC, paid scales fast" },
    ],
    realisticTimeline: "12-18 months for an employed founder working 10-15 hours/week.",
    faqs: [
      { question: "Can I really reach $4K/month while employed?", answer: "Yes. Most Invisible Exit members hit $4K MRR in 12-18 months. The key is consistency: 10-15 focused hours per week, pricing at $49-$79/month, and building one acquisition channel that compounds (SEO or content)." },
      { question: "What happens when I reach $4,000/month?", answer: "You have optionality. You can keep your job and invest the $4K. You can reduce hours. You can quit. The psychological shift — knowing you CAN leave — changes everything, even if you stay." },
      { question: "Should I quit my job when I hit $4K MRR?", answer: "Most people wait until $5K-$6K MRR to have a buffer. But $4K changes the power dynamic — you stop being afraid at work. That is the real freedom number." },
    ],
  },
  {
    slug: "to-10000",
    target: "$10,000/month",
    amount: 10000,
    metaTitle: "How to Make $10,000/Month in Micro-SaaS (Scale Guide)",
    metaDescription: "The path from $4K to $10K MRR. Scaling channels, adding team members, pricing optimization, and the transition from solo to small team.",
    h1: "How to Scale to $10,000/Month in Micro-SaaS",
    intro: "$10,000/month is beyond financial independence for most people. At this level, you can comfortably quit your job, hire help, and build a real company. But getting from $4K to $10K requires a different approach than getting from $0 to $4K.",
    customerMath: { pricing: "$79/month", customersNeeded: 127, monthlyRevenue: "$10,033/month" },
    stages: [
      { mrr: "$4,000-$6,000", customers: "83-190 paying", focus: "Professionalize operations", timeToReach: "Months 19-24", keyActions: ["Hire a virtual assistant ($500-$1K/mo)", "Implement customer support system", "Add automated email sequences", "Raise prices for new customers"] },
      { mrr: "$6,000-$8,000", customers: "191-254 paying", focus: "Scale acquisition", timeToReach: "Months 25-30", keyActions: ["Add paid acquisition (if LTV supports it)", "Build an affiliate program", "Launch on second platform (e.g., Shopify app store)", "Write pillar SEO content (3,000+ words)"] },
      { mrr: "$8,000-$10,000", customers: "255-317 paying", focus: "Maximize LTV", timeToReach: "Months 31-36", keyActions: ["Add annual plans (increase cash flow)", "Launch enterprise tier ($299-$999/mo)", "Build integrations with popular tools", "Reduce churn with customer success"] },
    ],
    channelStrategy: [
      { phase: "$4K-$6K", channel: "Scale existing channel", why: "Double down on what works before adding new channels" },
      { phase: "$6K-$8K", channel: "Paid + affiliate", why: "Once unit economics work, paid acquisition is the fastest scaler" },
      { phase: "$8K-$10K", channel: "Enterprise + integrations", why: "A few $299/mo customers are worth 6 regular customers" },
    ],
    realisticTimeline: "6-12 months from $4K to $10K MRR (faster than $0 to $4K because you have traction).",
    faqs: [
      { question: "Do I need to quit my job to reach $10K MRR?", answer: "Not necessarily, but it helps. Most founders hit $6K-$8K while employed, then quit to scale to $10K+. At $10K MRR, the business needs more attention than 10 hours/week allows." },
      { question: "What is the biggest challenge from $4K to $10K?", answer: "Customer support and churn. At 100-300 customers, you cannot answer every email yourself. You need help tickets, documentation, and eventually a support person. Retention matters more than acquisition." },
    ],
  },
  {
    slug: "to-100",
    target: "$100/month",
    amount: 100,
    metaTitle: "How to Make Your First $100/Month in Micro-SaaS",
    metaDescription: "The fastest path to your first $100/month in recurring revenue. The psychological importance of the first paying customer and how to get there.",
    h1: "How to Make Your First $100/Month",
    intro: "The first $100 is the hardest and most important. It proves someone will pay for your idea. Once you have one paying customer, getting to 10 is just repetition.",
    customerMath: { pricing: "$29/month", customersNeeded: 4, monthlyRevenue: "$116/month" },
    stages: [
      { mrr: "$0", customers: "0 paying", focus: "Build something chargeable", timeToReach: "Weeks 1-3", keyActions: ["Pick one problem", "Build the minimal version", "Add Stripe checkout", "Write a landing page"] },
      { mrr: "$0-$29", customers: "1 paying", focus: "Get customer #1", timeToReach: "Weeks 3-5", keyActions: ["DM 20 people in your target audience", "Offer a personal onboarding", "Charge from day one", "Ask for feedback"] },
      { mrr: "$29-$100", customers: "2-4 paying", focus: "Repeat what worked", timeToReach: "Weeks 5-8", keyActions: ["Ask customer #1 for referral", "Post in 3 relevant communities", "Write about the problem you solve", "Get to 4 paying customers"] },
    ],
    channelStrategy: [
      { phase: "Customer #1", channel: "Personal DMs + emails", why: "You need to learn what people actually want" },
      { phase: "Customers 2-4", channel: "Communities + word of mouth", why: "First customer refers others; community posts attract early adopters" },
    ],
    realisticTimeline: "4-8 weeks for an employed founder working 5 hours/week.",
    faqs: [
      { question: "Why is the first $100 so important?", answer: "It is proof. Proof that someone will pay. Proof that your idea has value. Most founders never make a single dollar online — getting to $100 puts you ahead of 90% of people who 'want to start something'." },
      { question: "What if nobody will pay for my idea?", answer: "Then you learned that before spending months building. Charge from day one. If 20 people say no, your problem or audience is wrong. Pivot. The $100 proves you found something real." },
    ],
  },
  {
    slug: "to-50000",
    target: "$50,000/month",
    amount: 50000,
    metaTitle: "How to Scale Micro-SaaS to $50K/Month (2026)",
    metaDescription: "The path from $10K to $50K MRR. Building a team, enterprise sales, platform expansion, and the transition from founder to CEO.",
    h1: "How to Scale Micro-SaaS to $50,000/Month",
    intro: "$50,000/month is beyond most solo founders' dreams. At this level, you have a real company — employees, systems, processes. But getting from $10K to $50K requires fundamentally different skills than building the product.",
    customerMath: { pricing: "$99/month", customersNeeded: 506, monthlyRevenue: "$50,094/month" },
    stages: [
      { mrr: "$10,000-$20,000", customers: "318-637 paying", focus: "Build a team", timeToReach: "Months 37-48", keyActions: ["Hire full-time developer", "Hire customer success person", "Implement proper CRM", "Build sales pipeline"] },
      { mrr: "$20,000-$35,000", customers: "638-1,116 paying", focus: "Enterprise + platform", timeToReach: "Months 49-60", keyActions: ["Launch on AWS/Azure/GCP marketplace", "Build SOC2/ISO compliance", "Hire sales rep (commission-based)", "Add SSO + SCIM"] },
      { mrr: "$35,000-$50,000", customers: "1,117-1,595 paying", focus: "Optimize for profit", timeToReach: "Months 61-72", keyActions: ["Increase enterprise pricing ($499-$999/mo)", "Reduce CAC through brand", "Improve gross margin", "Consider fundraising or acquisition"] },
    ],
    channelStrategy: [
      { phase: "$10K-$20K", channel: "Outbound sales + partnerships", why: "At this scale, personal sales moves the needle" },
      { phase: "$20K-$35K", channel: "Marketplaces + enterprise", why: "Platform marketplaces (AWS, Shopify) provide distribution" },
      { phase: "$35K-$50K", channel: "Brand + referrals + paid", why: "Brand awareness + paid = predictable growth" },
    ],
    realisticTimeline: "12-24 months from $10K to $50K MRR (requires team + funding or profitable reinvestment).",
    faqs: [
      { question: "Can a solo founder reach $50K/month?", answer: "Extremely rare. At $50K MRR you typically need at least 3-5 people: a developer, a support person, a marketer, and possibly a salesperson. The transition from solo to team is the hardest part." },
      { question: "Should I raise funding to scale to $50K MRR?", answer: "Only if you need to accelerate faster. Bootstrapping to $20K-$30K is very possible. Beyond that, funding can help you hire faster and capture market share before competitors." },
    ],
  },
  {
    slug: "to-5000",
    target: "$5,000/month",
    amount: 5000,
    metaTitle: "How to Make $5,000/Month in Micro-SaaS (Quit-Ready)",
    metaDescription: "The path from $2K to $5K MRR — the point where most corporate managers can consider quitting. Customer math, timeline, and strategy.",
    h1: "How to Make $5,000/Month in Micro-SaaS",
    intro: "$5,000/month is the quit-ready number for most corporate managers. At this level, your side income fully replaces your core living expenses with a buffer. You can confidently leave your job.",
    customerMath: { pricing: "$59/month", customersNeeded: 85, monthlyRevenue: "$5,015/month" },
    stages: [
      { mrr: "$2,000-$3,000", customers: "71-118 paying", focus: "Systematize and scale", timeToReach: "Months 11-14", keyActions: ["Automate onboarding completely", "Scale content to 2 posts/week", "Build referral program", "Start SEO landing pages"] },
      { mrr: "$3,000-$4,000", customers: "119-158 paying", focus: "Add a growth channel", timeToReach: "Months 15-18", keyActions: ["Add paid acquisition (if LTV supports it)", "Launch integration with popular tool", "Raise price for new customers ($59-$79)", "Hire VA for support"] },
      { mrr: "$4,000-$5,000", customers: "159-200 paying", focus: "Optimize for retention", timeToReach: "Months 19-22", keyActions: ["Annual billing push (20% discount)", "Customer success outreach", "Add team/enterprise tier ($149+)", "Reduce churn to <3%/month"] },
    ],
    channelStrategy: [
      { phase: "$2K-$3K", channel: "Content + SEO", why: "Compounding traffic from organic search" },
      { phase: "$3K-$4K", channel: "Integrations + paid", why: "Marketplace distribution + profitable paid" },
      { phase: "$4K-$5K", channel: "Referrals + enterprise", why: "Word of mouth + higher-tier customers" },
    ],
    realisticTimeline: "10-14 months from $0 to $5K MRR for an employed founder working 10-15 hours/week.",
    faqs: [
      { question: "Is $5K/month enough to quit my job?", answer: "For most corporate managers, yes — especially if you have 6-12 months of savings as a buffer. $5K covers core expenses. The question is not whether you CAN quit, but whether you have the confidence and the runway." },
      { question: "How do I prepare to quit?", answer: "Build a 6-month cash runway before quitting (your $5K MRR + savings). Document your business processes. Set up healthcare. Test running the business full-time during a 2-week vacation." },
    ],
  },
];
