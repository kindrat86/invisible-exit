/**
 * Glossary terms for /glossary pSEO pages.
 * Each term targets a "what is X?" query — the core of AEO (Answer Engine Optimization).
 * Definitions are written to be citation-friendly: concise, factual, self-contained.
 */

export interface GlossaryTerm {
  slug: string;
  term: string;
  metaTitle?: string; // optional override when GSC shows a better-matching query phrasing
  definition: string; // 1-2 sentence concise definition (featured-snippet optimized)
  detailed: string; // fuller explanation for the page body
  category: string;
  relatedTerms?: string[];
  faqs?: { question: string; answer: string }[];
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "what-is-micro-saas",
    term: "Micro-SaaS",
    // GSC 28d (2026-07-17): "micro saas meaning" pos 10, "micro saas definition" pos 10
    metaTitle: "Micro-SaaS Meaning: Definition, Examples & Revenue Math | Invisible Exit",
    category: "Business Model",
    definition:
      "A micro-SaaS is a small software-as-a-service business that targets a narrow niche, typically operated by a solo founder or tiny team, charging $10-$100/month per customer. It needs 50-500 paying customers to generate meaningful recurring revenue.",
    detailed:
      "Unlike traditional SaaS companies that raise venture capital and aim for millions of users, a micro-SaaS focuses on a specific, painful problem for a small, well-defined audience. The low overhead (no team, no office, minimal infrastructure) means profitability can be reached with as few as 30-50 customers. For corporate managers building a side business, micro-SaaS is ideal because it fits into 5-15 hours per week, can be operated anonymously, and generates recurring revenue that compounds over time.",
    relatedTerms: ["what-is-recurring-revenue", "what-is-freedom-number"],
    faqs: [
      {
        question: "How much does a micro-SaaS make?",
        answer:
          "A micro-SaaS charging $29/month with 138 customers generates $4,000/month in recurring revenue — the threshold where most corporate managers can consider leaving their job. At $50/month with 200 customers, it generates $10,000/month.",
      },
      {
        question: "How is micro-SaaS different from regular SaaS?",
        answer:
          "Regular SaaS companies raise capital, hire teams, and target large markets (millions of users). Micro-SaaS businesses are bootstrapped, solo-founded, and target narrow niches (hundreds to low thousands of users). The lower scale means lower revenue but also dramatically lower risk and overhead.",
      },
    ],
  },
  {
    slug: "what-is-recurring-revenue",
    term: "Recurring Revenue",
    category: "Financial Independence",
    definition:
      "Recurring revenue is income that automatically renews on a regular basis (monthly or annually) without requiring a new sale each time. Subscription payments are the most common form. Unlike one-time sales, recurring revenue compounds because existing customers continue paying while new customers are added.",
    detailed:
      "Recurring revenue is the foundation of financial independence through entrepreneurship. With one-time sales, you must find a new customer for every dollar earned. With recurring revenue, each customer you add increases your baseline income permanently (as long as they stay). At a 5% monthly churn rate, a micro-SaaS adding 7 new customers per month will maintain a stable $4,000/month income from 138 customers. This compounding effect is why recurring revenue changes how founders think about work — every customer added this month still pays next month.",
    relatedTerms: ["what-is-mrr", "what-is-freedom-number", "what-is-churn-rate"],
    faqs: [
      {
        question: "What is the difference between recurring revenue and passive income?",
        answer:
          "Recurring revenue requires ongoing delivery of value (software, service, content) to keep customers paying. Passive income implies no ongoing work. In practice, recurring revenue businesses require maintenance but generate more stable, predictable income than passive investments.",
      },
    ],
  },
  {
    slug: "what-is-freedom-number",
    term: "Freedom Number",
    category: "Financial Independence",
    definition:
      "Your freedom number is the monthly recurring revenue needed to cover your core living expenses, making your job optional. For most corporate managers earning $120K-$200K, the freedom number is $4,000/month in net recurring revenue.",
    detailed:
      "The freedom number is not the same as replacing your full salary. It's the point where leaving your job feels like a calculated risk rather than a cliff dive. For dual-income households, $4,000/month typically covers mortgage/rent, food, insurance, and basic costs — providing 12+ months of runway to grow the business full-time. Combined with savings, hitting the freedom number eliminates the 'I'll be homeless' fear that keeps most people trapped in golden handcuffs.",
    relatedTerms: ["what-is-recurring-revenue", "what-is-micro-saas"],
    faqs: [
      {
        question: "How do I calculate my freedom number?",
        answer:
          "Add up your essential monthly living expenses: housing, food, insurance, transportation, and minimum debt payments. Exclude discretionary spending (dining out, entertainment, vacations). For most corporate managers, this comes to $3,000-$5,000/month. That's your freedom number — the recurring revenue target that makes your job optional.",
      },
    ],
  },
  {
    slug: "what-is-mrr",
    term: "MRR (Monthly Recurring Revenue)",
    category: "Financial Independence",
    definition:
      "MRR (Monthly Recurring Revenue) is the predictable total revenue generated by all active subscriptions in a given month. For a micro-SaaS charging $29/month with 138 customers, MRR is $4,002.",
    detailed:
      "MRR is the primary metric for any subscription business. It excludes one-time payments, setup fees, and non-recurring charges. Tracking MRR growth over time shows whether a business is scaling (net new MRR > churned MRR) or shrinking. Net MRR = (New MRR + Expansion MRR) - (Churned MRR + Contraction MRR). For corporate managers building an invisible exit, MRR is the number that determines when your job becomes optional.",
    relatedTerms: ["what-is-recurring-revenue", "what-is-churn-rate", "what-is-freedom-number"],
  },
  {
    slug: "what-is-churn-rate",
    term: "Churn Rate",
    category: "Business Model",
    definition:
      "Churn rate is the percentage of customers who cancel their subscription in a given period. For micro-SaaS, a monthly churn rate of 3-7% is typical. At 5% monthly churn, you need to add about 7 new customers per month to maintain a base of 138 subscribers.",
    detailed:
      "Churn is the silent killer of subscription businesses. Gross churn measures lost revenue from cancellations. Net churn includes expansion revenue (existing customers upgrading) and is the more important metric — negative net churn means your business grows even without new customers. To reduce churn: improve onboarding, deliver consistent value, fix the top 3 cancellation reasons, and price correctly (too cheap attracts low-commitment customers who churn fast).",
    relatedTerms: ["what-is-mrr", "what-is-recurring-revenue"],
  },
  {
    slug: "what-is-stealth-operations",
    term: "Stealth Operations",
    category: "Operations",
    definition:
      "Stealth operations is the practice of building and running a side business while employed, using entity separation, digital compartmentalization, and compliance management to ensure your employer cannot discover or connect your business activity to your professional identity.",
    detailed:
      "Stealth operations encompasses legal, financial, and digital separation strategies: forming an LLC with a registered agent (not your home address), using separate email addresses and devices, avoiding employer IP or resources, building in non-competing niches, and managing your digital footprint. The goal is not deception but privacy — ensuring your entrepreneurial activity doesn't create unnecessary career risk while you build enough revenue to make leaving safe.",
    relatedTerms: ["what-is-invisible-exit", "what-is-entity-separation"],
    faqs: [
      {
        question: "Is stealth operations legal?",
        answer:
          "Yes. Building a business privately is legal in all jurisdictions. Stealth operations simply means exercising standard privacy — using a registered agent, separate accounts, and careful digital management. What matters legally is whether your business violates your employment contract (non-compete, IP assignment, moonlighting clauses), not whether your employer knows about it.",
      },
    ],
  },
  {
    slug: "what-is-invisible-exit",
    term: "Invisible Exit",
    category: "Strategy",
    definition:
      "An invisible exit is the transition from employment to entrepreneurship achieved by building a side business privately — without your employer knowing — until your recurring revenue replaces enough of your salary to make leaving feel safe.",
    detailed:
      "The invisible exit method was developed for corporate managers who want to build a business but cannot afford to quit their job or risk employer discovery. Unlike the 'quit and hustle' startup narrative, the invisible exit is methodical: validate ideas in 48 hours, build in 5 hours per week, reach $4,000/month in recurring revenue (the freedom number), then transition. The business is built, tested, and proven before you ever give notice.",
    relatedTerms: ["what-is-stealth-operations", "what-is-freedom-number"],
  },
  {
    slug: "what-is-entity-separation",
    term: "Entity Separation",
    category: "Operations",
    definition:
      "Entity separation is the legal practice of creating a distinct business entity (typically an LLC) that is legally distinct from your personal identity, providing liability protection and privacy for side business founders.",
    detailed:
      "For employed founders, entity separation serves two purposes: (1) liability protection — your personal assets are shielded from business debts or lawsuits, and (2) privacy — an LLC with a registered agent keeps your name off public address records. Form the LLC before your first paying customer. Use a registered agent service (not your home address) for maximum stealth. Cost: $50-$500 to form, $50-$300/year for the registered agent.",
    relatedTerms: ["what-is-stealth-operations"],
  },
  {
    slug: "what-is-golden-handcuffs",
    term: "Golden Handcuffs",
    category: "Financial Independence",
    definition:
      "Golden handcuffs are financial incentives (RSUs, stock options, bonuses, vesting schedules) that make it psychologically and financially difficult to leave a corporate job, even when the job is no longer fulfilling.",
    detailed:
      "Golden handcuffs work by tying future compensation to continued employment — unvested stock, pending bonuses, progressive benefits. The trap is that the 'guaranteed' future money often exceeds what you'd earn building a business in the same period, but it requires you to trade time and autonomy for it. The invisible exit strategy breaks golden handcuffs by building recurring revenue that eventually exceeds the value of unvested compensation, making the trade-off no longer worth it.",
    relatedTerms: ["what-is-freedom-number", "what-is-invisible-exit"],
  },
  {
    slug: "what-is-non-compete-clause",
    term: "Non-Compete Clause",
    category: "Legal",
    definition:
      "A non-compete clause is a contract provision that restricts an employee from working for competitors or starting a competing business for a specified period after leaving employment. Non-competes are generally narrower than people fear.",
    detailed:
      "Most non-compete clauses are restricted to direct competitors in your exact industry and role, for a limited time (6-24 months) and geographic area. They typically do not prevent you from building a business in an unrelated industry. The FTC ruled in 2024 that most non-competes are unenforceable for rank-and-file employees. Always review your specific contract with a legal professional, but don't let the phrase 'non-compete' paralyze you — most side businesses in different sectors are perfectly legal.",
    faqs: [
      {
        question: "Can I build a side business if I have a non-compete?",
        answer:
          "In most cases, yes — as long as your side business is not in direct competition with your employer. Non-competes typically restrict competing in the same industry, not general entrepreneurship. Build in a different sector, don't use company resources, and consult a lawyer about your specific clause.",
      },
    ],
  },
  {
    slug: "what-is-moonlighting-clause",
    term: "Moonlighting Clause",
    category: "Legal",
    definition:
      "A moonlighting clause is an employment contract provision that restricts or requires disclosure of outside employment or business activity. Some contracts ban moonlighting entirely; others require notification or prohibit using company time/resources.",
    detailed:
      "Moonlighting clauses vary widely. Some explicitly prohibit any outside business activity. Others only require disclosure or prohibit using company resources (equipment, time, IP). Read yours carefully. If it prohibits outside employment, you may still be able to build a business as a founder/investor (not an employee of another company). If it requires disclosure, weigh the career risk against the benefit of transparency. Most corporate managers find their moonlighting clause is narrower than they feared.",
    relatedTerms: ["what-is-non-compete-clause", "what-is-stealth-operations"],
  },
  {
    slug: "what-is-faceless-content",
    term: "Faceless Content",
    category: "Marketing",
    definition:
      "Faceless content is media (YouTube videos, social posts, blogs) created without showing the creator's face or revealing their identity. It's the primary content strategy for anonymous founders and corporate managers building stealth businesses.",
    detailed:
      "Faceless content formats include screen-recording tutorials, voiceover presentations, text-based posts, animated explainers, and curated content (reacting to others' work). The strategy routes attention through the value of the content rather than the personality of the creator — ideal for founders who need employer invisibility. Faceless YouTube channels can reach hundreds of thousands of subscribers, and SEO-driven blogs can rank without any personal identity attached.",
    relatedTerms: ["what-is-stealth-operations"],
  },
  {
    slug: "what-is-mrr-churn",
    term: "MRR Churn",
    category: "Business Model",
    definition:
      "MRR churn is the recurring revenue lost when customers cancel or downgrade subscriptions, expressed in dollars rather than a percentage. If 3 customers paying $29/month cancel, your MRR churn is $87/month.",
    detailed:
      "Tracking MRR churn separately from customer churn reveals whether your higher-paying customers are leaving faster than lower-paying ones. Gross MRR churn counts only cancellations; net MRR churn subtracts expansion revenue (upgrades, seat additions) and is the metric that determines whether your business grows or shrinks without new sales. A healthy micro-SaaS targets net MRR churn below 2% monthly, often achieving negative net churn once expansion revenue exceeds cancellations.",
    relatedTerms: ["what-is-churn-rate", "what-is-mrr", "what-is-recurring-revenue"],
    faqs: [
      {
        question: "What is a good MRR churn rate for micro-SaaS?",
        answer:
          "Gross MRR churn of 3-5% monthly is typical for consumer-facing micro-SaaS. B2B tools often see 1-2%. Net MRR churn below 2% is healthy; negative net churn (expansion revenue exceeding cancellations) means your business grows even without new customers.",
      },
      {
        question: "How is MRR churn different from customer churn?",
        answer:
          "Customer churn counts the number of customers who leave. MRR churn counts the revenue lost. If a $100/month customer cancels but you added a $50/month upgrade elsewhere, customer churn is 1 but net MRR churn is only $50.",
      },
    ],
  },
  {
    slug: "what-is-arr",
    term: "Annual Recurring Revenue (ARR)",
    category: "Financial Independence",
    definition:
      "ARR (Annual Recurring Revenue) is the yearly value of all active subscriptions, calculated as MRR × 12. A micro-SaaS with $4,000/month MRR has $48,000 ARR. ARR is the standard metric for valuing and comparing subscription businesses.",
    detailed:
      "Investors and acquirers use ARR to value SaaS businesses, typically applying a multiple of 3x-8x ARR for micro-SaaS exits. A $48,000 ARR business might sell for $150,000-$400,000 depending on growth rate, churn, and market. For corporate managers, ARR is the number that makes the invisible exit tangible — reaching $48,000 ARR means you have both income ($4K/month) and a sellable asset worth six figures.",
    relatedTerms: ["what-is-mrr", "what-is-recurring-revenue", "what-is-freedom-number"],
    faqs: [
      {
        question: "How do you calculate ARR?",
        answer:
          "Multiply your Monthly Recurring Revenue (MRR) by 12. If you have 138 customers paying $29/month, MRR is $4,002 and ARR is $48,024. Only include recurring subscription revenue — exclude one-time fees, setup charges, and non-recurring services.",
      },
      {
        question: "What is a good ARR for a solo founder?",
        answer:
          "For corporate managers building a side business, $48,000-$120,000 ARR ($4K-$10K/month) is the target range that replaces a mid-level salary. At $100,000+ ARR, the business is typically sellable for $300,000-$800,000.",
      },
    ],
  },
  {
    slug: "what-is-ltv",
    term: "Lifetime Value (LTV)",
    category: "Business Model",
    definition:
      "Lifetime Value (LTV) is the total revenue a single customer generates before they churn. For a micro-SaaS charging $29/month with a 20-month average customer lifespan, LTV is $580. LTV determines how much you can spend to acquire customers.",
    detailed:
      "LTV is calculated as (average monthly revenue per user) ÷ (monthly churn rate). At $29/month with 5% monthly churn, average customer lifespan is 20 months (1 ÷ 0.05), so LTV = $580. The LTV:CAC ratio is the golden rule of unit economics — most investors want at least 3:1, meaning you earn $3 for every $1 spent acquiring a customer. If your LTV is too low, either raise prices, reduce churn, or target customers who stay longer.",
    relatedTerms: ["what-is-cac", "what-is-mrr", "what-is-churn-rate"],
    faqs: [
      {
        question: "What is a good LTV:CAC ratio?",
        answer:
          "A ratio of 3:1 is considered healthy — you earn $3 in lifetime value for every $1 spent acquiring a customer. Below 2:1 means you're overspending on acquisition. Above 5:1 often means you're underinvesting in growth and leaving market share on the table.",
      },
      {
        question: "How do you increase LTV in a micro-SaaS?",
        answer:
          "Reduce churn (the biggest lever), raise prices, add expansion revenue (more seats, higher tiers), and upsell complementary features. Reducing monthly churn from 7% to 4% nearly doubles LTV without changing your pricing.",
      },
    ],
  },
  {
    slug: "what-is-cac",
    term: "Customer Acquisition Cost (CAC)",
    category: "Marketing",
    definition:
      "Customer Acquisition Cost (CAC) is the total cost of acquiring one new paying customer, including ads, content, tools, and labor. If you spend $500 on marketing and acquire 10 customers, your CAC is $50.",
    detailed:
      "For bootstrapped micro-SaaS, the lowest-CAC channels are SEO, content marketing, and word-of-mouth — often $0-$20 per customer. Paid ads typically cost $30-$150 per customer depending on the niche. CAC must be lower than LTV ÷ 3 for sustainable growth. Track CAC by channel to identify which marketing efforts actually produce profitable customers rather than vanity metrics like clicks or followers.",
    relatedTerms: ["what-is-ltv", "what-is-micro-saas", "what-is-faceless-content"],
    faqs: [
      {
        question: "What is a good CAC for micro-SaaS?",
        answer:
          "For a $29/month product with $580 LTV, target CAC below $190 (3:1 ratio). Bootstrapped founders using content and SEO often achieve $5-$20 CAC. Paid channels typically run $50-$150. Always compare CAC to LTV, not in isolation.",
      },
      {
        question: "How do you lower CAC?",
        answer:
          "Prioritize organic channels (SEO, content, referrals) over paid ads. Write articles targeting buyer-intent keywords, build an email list, and create referral programs. A customer acquired via SEO costs $0 in direct spend but requires time investment upfront.",
      },
    ],
  },
  {
    slug: "what-is-burn-rate",
    term: "Burn Rate",
    category: "Financial Independence",
    definition:
      "Burn rate is the amount of money a business spends (net) each month. For a bootstrapped micro-SaaS with $50/month in hosting and $12/month in tools, the gross burn rate is $62/month — dramatically lower than venture-backed startups.",
    detailed:
      "Burn rate matters most for funded startups burning capital until profitability. For bootstrapped micro-SaaS, burn is typically negligible ($50-$200/month for hosting, domains, and SaaS tools). The concept still applies to your personal finances: if your household spends $6,000/month and your business earns $4,000/month, your personal burn rate is $2,000/month. Understanding both business and personal burn rates is essential for calculating how long your savings last.",
    relatedTerms: ["what-is-runway", "what-is-freedom-number", "what-is-bootstrapping"],
    faqs: [
      {
        question: "What is a typical burn rate for a bootstrapped micro-SaaS?",
        answer:
          "$50-$200/month covers hosting (Vercel, Heroku), domain registration, email service, and essential SaaS tools. Some founders spend more on paid tools or contractors, but the floor is remarkably low. A profitable micro-SaaS has negative net burn — it generates more than it spends.",
      },
      {
        question: "Should I track personal or business burn rate?",
        answer:
          "Both. Business burn tells you how much revenue you need to stay operational. Personal burn (monthly living expenses minus business income) tells you how long your savings last. The goal is reaching the point where personal burn is zero or negative.",
      },
    ],
  },
  {
    slug: "what-is-runway",
    term: "Runway",
    category: "Financial Independence",
    definition:
      "Runway is the number of months a business (or person) can operate before running out of cash, calculated as cash on hand ÷ monthly burn rate. With $30,000 in savings and $3,000/month in expenses, your runway is 10 months.",
    detailed:
      "Runway is the safety metric that determines how much risk you can take. For corporate managers building an invisible exit, runway comes from two sources: savings and recurring revenue. A manager with $40,000 in savings and $4,000/month in MRR has effectively unlimited runway if expenses are $4,000/month or less. The invisible exit strategy aims to extend runway through revenue growth rather than savings depletion, so you never face a hard deadline.",
    relatedTerms: ["what-is-burn-rate", "what-is-freedom-number", "what-is-golden-handcuffs"],
    faqs: [
      {
        question: "How much runway do I need before quitting my job?",
        answer:
          "Most advisors recommend 12+ months of runway. With $4,000/month in recurring revenue covering core expenses, your runway from savings is infinite. Aim for at least 6 months of savings runway PLUS hitting your freedom number in MRR before giving notice.",
      },
      {
        question: "Does MRR count as runway?",
        answer:
          "Yes. If your micro-SaaS generates $4,000/month and your expenses are $4,000/month, you have infinite runway from revenue alone. Savings become a buffer for revenue fluctuations rather than your primary survival mechanism.",
      },
    ],
  },
  {
    slug: "what-is-bootstrapping",
    term: "Bootstrapping",
    category: "Business Model",
    definition:
      "Bootstrapping is building a business using personal savings and early revenue, without taking outside investment. A bootstrapped micro-SaaS founder might start with $500 for hosting and tools, then fund growth entirely from customer payments.",
    detailed:
      "Bootstrapping forces discipline: with no capital to burn, you must reach profitability quickly and spend only on what directly produces revenue. The trade-off is slower growth, but the payoff is 100% ownership and complete control. For corporate managers, bootstrapping is ideal because it eliminates investor pressure, preserves privacy (no pitch decks circulating), and aligns with building in 5-15 hours per week. Most micro-SaaS businesses are bootstrapped by design.",
    relatedTerms: ["what-is-micro-saas", "what-is-burn-rate", "what-is-freedom-number"],
    faqs: [
      {
        question: "Can you bootstrap a SaaS with less than $1,000?",
        answer:
          "Yes. A micro-SaaS can launch for $50-$500: domain ($12), hosting (free tier or $20/month), email service ($0-$30/month), and payment processing (Stripe, no upfront cost). The rest is your time. Revenue from the first 5-10 customers funds further growth.",
      },
      {
        question: "Bootstrapped vs. funded: which is better for side businesses?",
        answer:
          "Bootstrapping is almost always better for side businesses. You retain 100% equity, face no investor pressure to grow fast, and can operate privately. Funded startups require full-time commitment, board oversight, and aggressive scaling — incompatible with stealth operations.",
      },
    ],
  },
  {
    slug: "what-is-product-market-fit",
    term: "Product-Market Fit",
    category: "Strategy",
    definition:
      "Product-market fit (PMF) is the point where a product satisfies a strong market demand — customers actively want it, use it, and recommend it. The signal: your churn rate drops and word-of-mouth drives growth without heavy marketing spend.",
    detailed:
      "Marc Andreessen defined PMF as 'being in a good market with a product that can hit that market.' Practically, you know you have PMF when users are disappointed if they can't use your product, when support tickets are feature requests rather than complaints, and when your Net Promoter Score exceeds 40. Before PMF, every customer feels hard-won; after PMF, customers pull the product out of your hands. For micro-SaaS, reaching PMF typically means churn drops below 5% monthly and organic referrals begin.",
    relatedTerms: ["what-is-churn-rate", "what-is-validation", "what-is-micro-saas"],
    faqs: [
      {
        question: "How do you know when you have product-market fit?",
        answer:
          "Key signals: churn drops below 5% monthly, 40%+ of new users would be 'very disappointed' without your product (Sean Ellis test), organic word-of-mouth drives signups, and feature requests replace complaints in support tickets. Revenue growth feels easier, not harder.",
      },
      {
        question: "How long does it take to find product-market fit?",
        answer:
          "It varies widely — some founders find it in weeks, others take years of pivots. For micro-SaaS, the fastest path is rapid validation: launch a simple version, get 10-20 paying customers, and iterate based on who stays and who churns. Expect 2-4 major iterations.",
      },
    ],
  },
  {
    slug: "what-is-saas",
    term: "SaaS (Software as a Service)",
    category: "Business Model",
    definition:
      "SaaS (Software as a Service) is a software delivery model where customers access applications via the cloud and pay a recurring subscription, rather than buying a perpetual license. Examples include Slack, Notion, and most micro-SaaS products.",
    detailed:
      "SaaS replaced the old model of selling software on CDs with one-time licenses. The recurring revenue model means predictable income, easier forecasting, and continuous improvement through updates. For founders, SaaS is attractive because gross margins typically exceed 70%, distribution costs are low (digital delivery), and the compounding nature of subscriptions creates enterprise value. Micro-SaaS is the small-scale variant: a SaaS business targeting a narrow niche with a solo or tiny team.",
    relatedTerms: ["what-is-micro-saas", "what-is-recurring-revenue", "what-is-arr"],
    faqs: [
      {
        question: "What is the difference between SaaS and micro-SaaS?",
        answer:
          "SaaS is the broad category — any software sold as a subscription. Micro-SaaS is a subset: small-scale, niche-focused, typically solo-founded, with hundreds rather than millions of users. Slack is SaaS; a tool that automates invoices for freelance designers is micro-SaaS.",
      },
      {
        question: "Why is SaaS a good business model for side businesses?",
        answer:
          "Recurring revenue, 70%+ gross margins, low overhead, and digital distribution make SaaS ideal for part-time founders. Once built, a SaaS product generates income while you sleep, and the subscription model means each new customer permanently increases your baseline revenue.",
      },
    ],
  },
  {
    slug: "what-is-llc",
    term: "LLC (Limited Liability Company)",
    category: "Legal",
    definition:
      "An LLC (Limited Liability Company) is a business structure that combines the liability protection of a corporation with the tax simplicity of a sole proprietorship. For side business founders, an LLC shields personal assets from business debts and lawsuits.",
    detailed:
      "Forming an LLC costs $50-$500 depending on the state and takes 1-2 weeks. It creates a legal barrier between your personal assets (house, savings) and business liabilities — if the business is sued or defaults on debt, your personal property is generally protected. For stealth operations, an LLC with a registered agent keeps your home address off public records. LLCs offer 'pass-through' taxation: profits are taxed once on your personal return, avoiding the double taxation of C corporations.",
    relatedTerms: ["what-is-entity-separation", "what-is-stealth-operations", "what-is-s-corp"],
    faqs: [
      {
        question: "Do I need an LLC for my side business?",
        answer:
          "Not legally required, but strongly recommended before taking your first paying customer. An LLC protects personal assets from business liability and, with a registered agent, keeps your name and address private. Operating as a sole proprietorship offers zero liability protection.",
      },
      {
        question: "How much does it cost to form an LLC?",
        answer:
          "State filing fees range from $50 (Colorado) to $500 (Massachusetts). Budget $50-$300/year for a registered agent. Formation services like LegalZoom charge $79-$300, but you can file directly with your state's secretary of state website for the filing fee alone.",
      },
      {
        question: "Does an LLC keep my business private from my employer?",
        answer:
          "Partially. An LLC with a registered agent keeps your home address off public records, but LLC ownership is listed in state databases in some states. Use a registered agent service and check your state's public records to verify what's visible.",
      },
    ],
  },
  {
    slug: "what-is-s-corp",
    term: "S Corporation (S Corp)",
    category: "Legal",
    definition:
      "An S Corporation is a tax election (not a separate entity type) that allows an LLC or corporation to avoid self-employment tax on a portion of income. Owners pay themselves a 'reasonable salary' and take remaining profits as distributions, which are not subject to the 15.3% self-employment tax.",
    detailed:
      "To become an S Corp, you form an LLC (or corporation) and then file IRS Form 2553 to elect S Corp taxation. The tax savings kick in once your business profits exceed roughly $60,000-$80,000/year. For example, at $100,000 profit, you might pay yourself a $50,000 salary and take $50,000 as distributions, saving approximately $7,650 in self-employment tax. The trade-off is added complexity: payroll processing, quarterly tax filings, and potentially higher accounting fees ($1,000-$3,000/year).",
    relatedTerms: ["what-is-llc", "what-is-entity-separation", "what-is-sole-proprietorship"],
    faqs: [
      {
        question: "When should I elect S Corp status?",
        answer:
          "Generally once your business profits consistently exceed $60,000-$80,000/year. Below that threshold, the tax savings don't justify the added payroll and accounting costs ($1,000-$3,000/year). Consult a CPA to run the numbers for your specific situation.",
      },
      {
        question: "Is an S Corp different from an LLC?",
        answer:
          "An S Corp is a tax election, not a separate business entity. You form an LLC first, then elect S Corp taxation with the IRS. The LLC remains your legal structure; S Corp status only changes how you're taxed. You get liability protection either way.",
      },
    ],
  },
  {
    slug: "what-is-sole-proprietorship",
    term: "Sole Proprietorship",
    category: "Legal",
    definition:
      "A sole proprietorship is the simplest business structure — an unincorporated business owned and operated by one individual with no legal separation between the owner and the business. It requires no formation paperwork but offers zero liability protection.",
    detailed:
      "Starting a sole proprietorship costs nothing and requires no state filing — you're automatically a sole proprietorship the moment you start selling. The major downside: no liability protection. If your business is sued or accrues debt, your personal assets (house, savings, car) are exposed. For micro-SaaS founders, the risk is relatively low but real (e.g., a data breach or IP claim). Most advisors recommend upgrading to an LLC before your first paying customer. You can also operate as a sole proprietorship under a DBA ('Doing Business As' name).",
    relatedTerms: ["what-is-llc", "what-is-entity-separation", "what-is-s-corp"],
    faqs: [
      {
        question: "Is a sole proprietorship safe for a micro-SaaS?",
        answer:
          "Risky. Without liability protection, your personal assets are exposed to business lawsuits or debts. For a low-risk SaaS, the danger is small (data breaches, IP disputes), but an LLC costs only $50-$500 and eliminates the risk. Form the LLC before accepting payments.",
      },
      {
        question: "What's the difference between sole proprietorship and LLC?",
        answer:
          "A sole proprietorship offers no liability protection — you and the business are legally the same. An LLC is a separate legal entity that shields personal assets from business liabilities. Both have pass-through taxation, but only the LLC limits your personal risk.",
      },
    ],
  },
  {
    slug: "what-is-ip-assignment",
    term: "IP Assignment Clause",
    category: "Legal",
    definition:
      "An IP assignment clause is a contract provision that determines who owns intellectual property (code, designs, content) created during employment. Many corporate contracts claim ownership of ALL work done during your employment — including side projects.",
    detailed:
      "This is the most dangerous clause for employed founders. Broad IP assignment language can give your employer ownership of your side business's code, branding, and even ideas. Read your employment contract carefully for phrases like 'all inventions,' 'whether or not related to company business,' or 'during the term of employment.' Some states (California, Delaware, and others) protect side projects created on personal time with personal resources, but you must understand your specific contract. Build on personal devices, after hours, and never use employer tools or data.",
    relatedTerms: ["what-is-non-compete-clause", "what-is-moonlighting-clause", "what-is-stealth-operations"],
    faqs: [
      {
        question: "Can my employer claim ownership of my side project?",
        answer:
          "Possibly, if your contract has a broad IP assignment clause. Some contracts claim all work done during employment, even unrelated side projects. Read for language like 'all inventions' or 'whether or not related to company business.' States like California limit this, but always verify. Consult an employment lawyer.",
      },
      {
        question: "How do I protect my side business from IP claims?",
        answer:
          "Build only on personal devices, outside work hours, using no employer resources, data, or contacts. Avoid working in the same technical domain as your job. Keep dated records proving your side work was done independently. Have an employment lawyer review your contract before launching.",
      },
    ],
  },
  {
    slug: "what-is-dunbar-number",
    term: "Dunbar's Number",
    category: "Strategy",
    definition:
      "Dunbar's number (approximately 150) is the cognitive limit to the number of stable social relationships a person can maintain. In business, it explains why companies and communities break down beyond ~150 people — and why micro-SaaS thrives in small, tight-knit niches.",
    detailed:
      "Anthropologist Robin Dunbar found that primates' brain size correlates with social group size; humans max out at roughly 150 meaningful relationships. For micro-SaaS founders, this means your customer base can feel like a community — at 100-150 customers, you can know many by name, respond personally to feedback, and build fierce loyalty. Beyond Dunbar's number, customer relationships inevitably become transactional, requiring processes and support teams. Staying small isn't a limitation; it's a strategic advantage that high-churn competitors can't replicate.",
    relatedTerms: ["what-is-micro-saas", "what-is-churn-rate", "what-is-product-market-fit"],
    faqs: [
      {
        question: "What is Dunbar's number in business?",
        answer:
          "Around 150 people — the limit of stable relationships one person can maintain. In business, it explains why companies over ~150 employees need formal hierarchy and why micro-SaaS founders can maintain personal relationships with most of their 100-200 customers.",
      },
      {
        question: "How does Dunbar's number affect micro-SaaS strategy?",
        answer:
          "It means staying small is a feature, not a bug. With under 150 customers, you can know them personally, respond to every email, and build loyalty that large competitors can't match. Low churn and high retention become natural byproducts of relationship-driven service.",
      },
    ],
  },
  {
    slug: "what-is-compounding-revenue",
    term: "Compounding Revenue",
    category: "Financial Independence",
    definition:
      "Compounding revenue is the effect where recurring revenue grows on top of itself — each month's new customers add to last month's base, while existing customers continue paying. Adding 7 customers/month at $29 with 5% churn reaches $10,000/month MRR in about 24 months.",
    detailed:
      "Compounding is what makes subscription businesses qualitatively different from one-time sales. With one-time sales, revenue resets to zero each month. With recurring revenue, Month 2 starts where Month 1 ended plus new additions minus churn. The math: at $29/month, adding 7 net new customers monthly with 5% churn, you reach approximately $5,500/month MRR in year one and $10,000/month by year two. This compounding effect is why patient, consistent growth in micro-SaaS eventually produces life-changing income.",
    relatedTerms: ["what-is-recurring-revenue", "what-is-mrr", "what-is-freedom-number"],
    faqs: [
      {
        question: "How fast does recurring revenue compound?",
        answer:
          "Adding 7 net new customers per month at $29/month with 5% churn reaches roughly $5,500/month MRR in year one and $10,000/month by year two. The key is consistency — small monthly additions compound dramatically over 18-24 months.",
      },
      {
        question: "Why is compounding revenue different from regular income?",
        answer:
          "A salary is linear — each month's income is independent. Recurring revenue compounds — last month's customers keep paying while new ones are added. Over time, the growth curve becomes exponential, not linear, which is how small side businesses eventually replace full salaries.",
      },
    ],
  },
  {
    slug: "what-is-monetization",
    term: "Monetization",
    category: "Business Model",
    definition:
      "Monetization is the strategy for converting a product, audience, or asset into revenue. For micro-SaaS, common monetization models include monthly subscriptions ($10-$100/month), annual plans, usage-based pricing, and one-time lifetime deals.",
    detailed:
      "Choosing the right monetization model dramatically affects revenue and growth. Monthly subscriptions ($29-$99/month) provide predictable recurring revenue but require low churn. Annual plans ($290-$990/year) improve cash flow and reduce churn but require more upfront trust. Usage-based pricing (charging per API call, email, or action) aligns cost with value but is harder to forecast. Freemium models (free tier + paid upgrade) drive signups but convert only 2-5% of free users. For micro-SaaS, a single simple monthly tier is often the most effective starting point.",
    relatedTerms: ["what-is-recurring-revenue", "what-is-mrr", "what-is-micro-saas"],
    faqs: [
      {
        question: "What is the best monetization model for micro-SaaS?",
        answer:
          "Start with a single monthly subscription ($29-$99/month). It's simple, predictable, and proven. Add an annual plan (10-month price for 12 months) once you have 20+ customers. Avoid freemium initially — it complicates support and delays revenue. Most micro-SaaS businesses monetize best with one clear paid tier.",
      },
      {
        question: "Should I offer a free tier?",
        answer:
          "Usually no, at launch. Free tiers convert only 2-5% of users to paid, burden your support, and delay revenue. A 14-day free trial is more effective — users experience the full product, then decide. Add a free tier only if your acquisition strategy depends on virality or product-led growth.",
      },
    ],
  },
  {
    slug: "what-is-distribution",
    term: "Distribution",
    category: "Marketing",
    definition:
      "Distribution is the strategy and channels through which customers discover and acquire your product. For micro-SaaS, distribution includes SEO content, faceless YouTube, niche communities, email newsletters, and word-of-mouth — not paid ads.",
    detailed:
      "Distribution is harder than building the product for most founders. Common micro-SaaS distribution channels include SEO blog posts targeting 'how to [solve problem]' queries, faceless YouTube tutorials, posting in niche communities (Reddit, Discord, specialized forums), cold email outreach, and referral programs. The lowest-cost, highest-compounding channel is SEO: an article ranking for a buyer-intent keyword can drive free traffic for years. For corporate managers, faceless content combined with SEO is ideal because it builds an asset without exposing your identity.",
    relatedTerms: ["what-is-faceless-content", "what-is-cac", "what-is-validation"],
    faqs: [
      {
        question: "What is the best distribution channel for micro-SaaS?",
        answer:
          "For bootstrapped founders, SEO content targeting buyer-intent keywords ('how to automate [task]') is the highest-ROI channel — it compounds over time and costs only your writing time. Pair it with faceless YouTube tutorials and active participation in 2-3 niche communities where your customers gather.",
      },
      {
        question: "How long does distribution take to work?",
        answer:
          "SEO content typically takes 3-6 months to rank and drive consistent traffic. Community-driven distribution (Reddit, forums) can produce customers within weeks. Word-of-mouth compounds slowly but becomes the dominant channel once you have 50+ happy customers. Budget 6-12 months for organic channels to mature.",
      },
    ],
  },
  {
    slug: "what-is-validation",
    term: "Idea Validation",
    category: "Strategy",
    definition:
      "Idea validation is the process of testing whether a business idea has real demand before building it — through landing pages, pre-sales, customer interviews, or a simple MVP. The goal: spend 48 hours, not 6 months, to learn if people will pay.",
    detailed:
      "Validation kills bad ideas cheaply. Methods include: (1) a landing page describing the product with a 'pre-order' or 'join waitlist' button — if nobody gives their email, there's no demand; (2) posting in niche communities to gauge reactions; (3) cold-emailing 20 potential customers asking if they'd pay for a solution; (4) a 'concierge' MVP where you manually deliver the service before automating it. The golden rule: if you can't get 10 people to express willingness to pay, don't build it. Validation takes days, not months, and saves founders from building products nobody wants.",
    relatedTerms: ["what-is-product-market-fit", "what-is-micro-saas", "what-is-distribution"],
    faqs: [
      {
        question: "How do I validate a micro-SaaS idea in 48 hours?",
        answer:
          "Build a simple landing page describing the solution with a price and a 'buy' or 'join waitlist' button. Drive 100 visitors via a niche community or small ad spend. If 5+ people give their email or attempt to buy, you have signal. If zero engage, kill or pivot the idea before writing any code.",
      },
      {
        question: "What if people say they'd buy but don't actually pay?",
        answer:
          "Intent ≠ commitment. Always test with money — a pre-sale, deposit, or even a fake checkout button. People who say 'I'd pay for that' rarely do. Real validation is a credit card number, not a compliment. If nobody pre-pays, the problem isn't painful enough.",
      },
    ],
  },
];
