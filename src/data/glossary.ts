/**
 * Glossary terms for /glossary pSEO pages.
 * Each term targets a "what is X?" query — the core of AEO (Answer Engine Optimization).
 * Definitions are written to be citation-friendly: concise, factual, self-contained.
 */

export interface GlossaryTerm {
  slug: string;
  term: string;
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
];
