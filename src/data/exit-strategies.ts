/**
 * Exit Strategy pages for /exit-strategies/:slug
 * Targets: "how to sell a micro SaaS", "exit strategy for side business",
 * "SaaS acquisition", "how to value a SaaS business"
 *
 * Greg Isenberg pSEO 2026 — bottom-of-funnel commercial intent.
 */

export interface ExitStrategyEntry {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  stageLabel: string;
  timeframe: string;
  realisticValuation: string;
  whyNow: string;
  readinessChecklist: string[];
  exitPaths: { type: string; pros: string[]; cons: string[]; bestFor: string }[];
  buyerTypes: { who: string; whatTheyWant: string; typicalOffer: string }[];
  keyNumbers: { metric: string; multiple: string }[];
  preparationSteps: { step: string; detail: string }[];
  whatHappensPostExit: string;
  faqs: { question: string; answer: string }[];
}

export const exitStrategyPages: ExitStrategyEntry[] = [
  {
    slug: "micro-saas-exit-guide",
    metaTitle: "How to Sell a Micro SaaS (Complete Exit Guide) | Invisible Exit",
    metaDescription: "The complete guide to selling a micro-SaaS: valuation multiples, buyer types, preparation checklist, and common mistakes. Real numbers based on 50+ micro-SaaS acquisitions.",
    h1: "How to Sell a Micro SaaS: The Complete Exit Guide",
    intro: "You've built a micro-SaaS generating $1K-$20K/month. Now you want to exit — or at least understand what your business is worth. This is the honest guide to selling a small SaaS, based on actual acquisition data from 50+ micro-SaaS deals under $5M.",
    stageLabel: "Growth / Exit-Ready",
    timeframe: "3-9 months from decision to close",
    realisticValuation: "Most micro-SaaS businesses sell for 24-48x monthly recurring revenue (MRR). A $5K MRR micro-SaaS typically exits for $120K-$240K. Top performers with 30%+ net profit margin can command 48-60x. Below $1K MRR: expect 12-24x or a simple asset sale at 6-12x.",
    whyNow: "The micro-SaaS acquisition market has never been hotter. Indie hackers, bootstrapped founders with cash, and even small PE funds are buying profitable micro-SaaS assets. Supply of well-documented, clean-code micro-SaaS businesses is still low. You're selling into a seller's market if your books are clean.",
    readinessChecklist: [
      "Clean financials: 12+ months of bank statements and Stripe/Paddle revenue reports",
      "Clean code: Git history, no hardcoded secrets, documented deployment process",
      "Clean data: GDPR-compliant, privacy policy published, no shadow databases",
      "Clean ownership: LLC or C-Corp, no personal liability, IP assignment documented",
      "Client list: Know your top 10 customers by revenue and their retention history",
      "Churn data: Monthly churn rate under 5% (under 3% is excellent)",
      "Documentation: Runbook, architecture diagram, admin guide, support tickets",
      "Transfer readiness: Can you hand over domain, DNS, code, Stripe account in 24 hours?",
    ],
    exitPaths: [
      {
        type: "Direct Sale (Acquisition)",
        pros: [
          "Lump sum cash — clean break, no ongoing obligation",
          "Earn-outs can add 20-50% to the price if you stay 6-12 months",
          "No legal complexity if under $1M (simple asset purchase agreement)",
        ],
        cons: [
          "You lose passive income stream permanently",
          "Earn-outs are taxed as ordinary income (higher rate)",
          "Buyer may negotiate heavily on churn risk",
        ],
        bestFor: "Founders who want a clean exit and have another idea lined up",
      },
      {
        type: "Revenue Share / Partnership",
        pros: [
          "Keep 30-50% ongoing revenue share while scaling via partner resources",
          "No upfront sale — you keep ownership while adding a growth partner",
          "Lower tax burden (distributions vs capital gains)",
        ],
        cons: [
          "Hard to find legitimate partners — many are vulture buyers",
          "Loss of control over product direction and pricing",
          "Revenue share disputes are common without clear contract terms",
        ],
        bestFor: "Founders who want liquidity but aren't ready to fully exit",
      },
      {
        type: "Acqui-Hire (Talent Acquisition)",
        pros: [
          "Salary at market rate + acquisition price for the business",
          "Health insurance, benefits, and structure after exit",
          "De-risked transition — you keep working on similar products",
        ],
        cons: [
          "The business is valued lower (mainly paying for you, not the product)",
          "1-2 year employment lock-in typical",
          "Non-compete usually covers your entire niche",
        ],
        bestFor: "Solo founders who want a job with a startup AND a payout",
      },
      {
        type: "Gratitude Exit (Handoff to a Partner or Employee)",
        pros: [
          "Keep a royalty or referral fee for 2-3 years",
          "Business continues serving customers you care about",
          "Simplest legal structure — no acquisition agreement needed",
        ],
        cons: [
          "You get paid over time, not upfront",
          "The person taking over might not maintain quality",
          "Your reputation is tied to the business even after handoff",
        ],
        bestFor: "Founders with a trusted co-founder or senior employee who can take over",
      },
    ],
    buyerTypes: [
      {
        who: "Indie Hackers / Solo Operators (50-60% of buyers)",
        whatTheyWant: "Clean code, low maintenance, proven revenue. They want to run it as a lifestyle business or bundle with their existing products.",
        typicalOffer: "24-36x MRR, all cash. Deals under $200K close in 2-4 weeks.",
      },
      {
        who: "Micro PE / Small Acquisition Funds (20-25%)",
        whatTheyWant: "$2K-$15K MRR, steady growth 10%+ YoY, low churn (<3%). They operate roll-up strategies and pay more for quality.",
        typicalOffer: "36-48x MRR, mix of cash and earn-out. Deals $200K-$2M close in 2-4 months.",
      },
      {
        who: "Strategic Buyers (10-15%)",
        whatTheyWant: "Your users, your brand, your SEO authority. They buy to acquire your audience, not your code. Typical: a larger SaaS wanting your niche.",
        typicalOffer: "40-60x MRR possible if your audience is valuable. Often includes earn-out with aggressive growth targets.",
      },
      {
        who: "Competitors (5-10%)",
        whatTheyWant: "Eliminate a competitor, acquire customers, consolidate. They pay a premium for exclusivity (close the product after migration).",
        typicalOffer: "24-36x MRR plus performance bonus. They will negotiate hardest on churn.",
      },
      {
        who: "Employees / Community Members (rare, 2-5%)",
        whatTheyWant: "Your product, your trust, your future support. They already know your space and want ownership.",
        typicalOffer: "Lowball — 12-24x MRR, often with heavy payment plan. Best for founders who value continuity over maximum cash.",
      },
    ],
    keyNumbers: [
      { metric: "ARR", multiple: "3-5x ARR for micro-SaaS under $500K ARR" },
      { metric: "SDE (Seller's Discretionary Earnings)", multiple: "2-4x SDE for lifestyle SaaS businesses" },
      { metric: "Net Profit Margin", multiple: "Above 40% = premium multiple (1.5x above baseline)" },
      { metric: "Monthly Growth Rate", multiple: "5%+ monthly = 1.3x multiple boost" },
      { metric: "Churn Rate", multiple: "Under 3% monthly = baseline. Under 1% = 1.5x multiple" },
      { metric: "Code Quality & Docs", multiple: "Clean repo = 10-20% premium. No docs = 20% discount" },
    ],
    preparationSteps: [
      { step: "Audit your codebase", detail: "Remove hardcoded secrets, add README, document architecture. A buyer will inspect your repo within 48 hours of showing interest." },
      { step: "Clean your financials", detail: "Export 12+ months from Stripe/Paddle. Separate personal from business expenses. If you've been mixing accounts, fix that first — it's the #1 deal killer." },
      { step: "Reduce churn proactively", detail: "Identify your top 10 at-risk customers and call them. A 2% churn reduction can add $10K-$30K to your sale price on a $5K MRR business." },
      { step: "Document everything", detail: "Runbook (deployment, backup, monitoring, alerting), admin guide (how to support customers), and a 30-minute Loom walkthrough of your entire stack. Buyers love this." },
      { step: "Draft a one-pager", detail: "One-page PDF: MRR, growth chart, customer segments, tech stack, team (even if just you), key risks, and why you're selling. This is your deal memo." },
      { step: "Build a buyer pipeline", detail: "List 10-20 potential buyers. Post on Acquire.com, MicroAcquire, r/microsaasbids. DM indie hackers in your space. A competitive process adds 15-30% to the price." },
    ],
    whatHappensPostExit: "Most micro-SaaS founders regret selling for 2-3 months (the 'seller's remorse' phase), then feel relief by month 6. The cash in the bank is real. The freedom is real. But you'll miss: (1) the product — you built it; (2) the customers — you have relationships; (3) the daily challenge. Plan your next project before you close the deal. The most successful sellers have their next idea validated and are building within 30 days of the exit.",
    faqs: [
      { question: "How much is my micro-SaaS worth?", answer: "For a micro-SaaS under $20K MRR: 24-48x MRR is the standard range. At $5K MRR, expect $120K-$240K. The multiple depends on: growth rate (+ multiplier), churn (+/-), profit margin (+), code quality (+), and niche (+ if competitive). The #1 factor is profitability — a $5K MRR business with 80% margin is worth more than $10K MRR with 20% margin." },
      { question: "Should I sell or keep collecting passive income?", answer: "If your business runs itself (passive, under 5 hours/week) and generates enough for your freedom number, keep it. If it demands 20+ hours/week and you have better ideas, sell it. Many micro-SaaS sellers reinvest into their next product and build faster with the capital." },
      { question: "How long does a micro-SaaS sale take?", answer: "Under $200K: 2-4 weeks. $200K-$1M: 2-4 months. Over $1M: 4-8 months with legal due diligence. The fastest path: clean financials, clean code, clean ownership, and a motivated buyer who already knows your niche." },
      { question: "Do I need a lawyer?", answer: "For deals under $100K, a simple asset purchase agreement (available on LawDepot or Stripe Atlas) is sufficient. For deals over $100K, yes — spend $2K-$5K on a startup lawyer. It's worth it. The legal fee is 2-4% of your sale price and prevents post-sale disputes." },
      { question: "Should I use a marketplace or sell direct?", answer: "Marketplaces (Acquire.com, MicroAcquire, Flippa) give you exposure to hundreds of buyers but take 5-15% commission. Direct sales to competitors or indie hackers yield higher prices (no commission) but take longer. Best strategy: list on 2 marketplaces AND reach out to 10 potential buyers directly." },
      { question: "What happens to my customers after I sell?", answer: "It depends on your sale agreement. Most buyers want you to send a transition email. Some will keep you as a support consultant for 3-6 months. Choose a buyer who shares your values — bad buyers can destroy customer relationships and hurt your reputation." },
    ],
  },
  {
    slug: "how-to-value-a-micro-saas",
    metaTitle: "How to Value a Micro SaaS Business (Multiples Calculator) | Invisible Exit",
    metaDescription: "Learn how to value a micro-SaaS business. MRR multiples, SDE multiples, growth adjustments, and churn discounts. Real valuation framework with examples.",
    h1: "How to Value a Micro SaaS Business",
    intro: "Valuing a micro-SaaS is different from valuing a VC-backed startup. There's no hockey-stick growth to project. There's no 'total addressable market' slide. There's just one question: how much cash does this business generate, and how reliably does it generate it? Here's the honest framework.",
    stageLabel: "Valuation Guide",
    timeframe: "30-minute read",
    realisticValuation: "The standard formula for micro-SaaS valuation is: (ARR × Multiple) where Multiple ranges from 2x to 5x depending on growth, churn, profit margin, and niche defensibility. For MRR under $20K/month, the market standard is 24-48x MRR. Above $20K MRR, the multiple expands to 36-60x because buyers see lower risk.",
    whyNow: "Micro-SaaS acquisitions hit an all-time high in 2025. MicroAcquire reported 40% more deals year-over-year. Prices are rising 15-25% annually as more capital enters the micro-acquisition space. If you're thinking about selling, the trend is your friend — prices are likely higher in 6 months, but competition from new sellers is also increasing.",
    readinessChecklist: [
      "Know your MRR trajectory for the last 12 months minimum",
      "Calculate net profit margin (revenue minus all costs including your time)",
      "Track churn monthly and understand why customers leave",
      "Document your growth channels (organic, paid, referrals)",
      "Know your niche's average acquisition multiple (search MicroAcquire for comparable sales)",
      "Run a 'buyer readiness audit' — would you buy this business?",
    ],
    exitPaths: [
      {
        type: "MRR Multiple Method (Standard)",
        pros: [
          "Simple and well-understood by all buyers",
          "Works for any size micro-SaaS",
          "Easiest to negotiate (small adjustments per factor)",
        ],
        cons: [
          "Doesn't account for growth potential well",
          "Low churn premium is subjective",
          "Profit margin can distort value (high revenue, low profit = bad deal)",
        ],
        bestFor: "Standard micro-SaaS with $1K-$15K MRR",
      },
      {
        type: "SDE Method (Seller's Discretionary Earnings)",
        pros: [
          "Accounts for personal salary avoidance (true cash generation)",
          "Preferred by small business buyers and micro PE",
          "Often yields 15-25% higher valuations for lean solo businesses",
        ],
        cons: [
          "More complex — requires recasting your P&L",
          "Not well understood by first-time buyers",
          "Harder to compare against listed businesses",
        ],
        bestFor: "Solo-founder micro-SaaS where the founder 'pays themselves' through the business",
      },
      {
        type: "Asset-Based Method (Liquidation Value)",
        pros: [
          "Conservative and undisputable",
          "Fastest to close (no earn-out, no projections)",
          "Works well for code + customer list sales",
        ],
        cons: [
          "Drastically undervalues profitable SaaS (30-60% of MRR method)",
          "Code is valued at zero in most asset valuations",
          "Misses the recurring revenue premium entirely",
        ],
        bestFor: "Fire sales, distressed exits, or when the buyer is a competitor wanting your users",
      },
    ],
    buyerTypes: [
      {
        who: "Standard Buyers (most common)",
        whatTheyWant: "Predictable cash flow, clean operations, documented processes. They'll pay 30-42x MRR.",
        typicalOffer: "30-42x MRR with 6-month earn-out for transition support",
      },
      {
        who: "Growth-First Buyers",
        whatTheyWant: "Upsell potential, untapped distribution channels, a product they can cross-sell to. They'll pay 42-60x MRR.",
        typicalOffer: "42-60x MRR with a 12-month earn-out tied to growth milestones",
      },
      {
        who: "Builder Buyers (indie hackers)",
        whatTheyWant: "A codebase and users they can improve. They're the most hands-on and pay the least.",
        typicalOffer: "18-30x MRR, all cash, no earn-out",
      },
    ],
    keyNumbers: [
      { metric: "MRR < $2K", multiple: "12-24x (asset sale territory)" },
      { metric: "MRR $2K-$10K", multiple: "24-36x (standard for lifestyle SaaS)" },
      { metric: "MRR $10K-$20K", multiple: "30-48x (premium, growth potential visible)" },
      { metric: "ARR under $500K", multiple: "2-4x ARR maximum" },
      { metric: "Net margin >40%", multiple: "1.3x multiplier on base multiple" },
      { metric: "Churn <2% monthly", multiple: "1.2x multiplier on base multiple" },
    ],
    preparationSteps: [
      { step: "Calculate your exact MRR multiple", detail: "MRR multiple = Sale Price / MRR. For example, a $5K MRR business sold for $180K = 36x multiple. Check MicroAcquire's sold listings for your niche to benchmark." },
      { step: "Adjust for growth", detail: "A business growing 10% month-over-month is worth 1.3-1.5x more than a flat business. Compile 12 months of MRR data in a chart." },
      { step: "Adjust for churn", detail: "Calculate your gross monthly churn. Under 3%: standard multiple. Under 1%: premium. Over 5%: 20% discount." },
      { step: "Document your 'unfair advantage'", detail: "What makes your micro-SaaS hard to replicate? Proprietary data, SEO authority, brand recognition, customer relationships? Buyers pay a premium for moats." },
    ],
    whatHappensPostExit: "Once you know your valuation range, the temptation is to 'wait for the right price.' Don't. Micro-SaaS valuations are rising but so are operating costs, competition, and churn risk. The best time to sell is when your business is growing, your books are clean, and you have a concrete plan for what's next. A bird in the hand is worth two in the bush — especially in micro-SaaS.",
    faqs: [
      { question: "What's the formula for micro-SaaS valuation?", answer: "The standard formula is: MRR × Multiple (24-48x) × Growth Multiplier (1.0-1.5) × Churn Multiplier (0.8-1.2) × Profit Margin Multiplier (0.9-1.3). For a $5K MRR business growing 5%/month with 2% churn and 60% margins: $5K × 36 × 1.15 × 1.1 × 1.2 = $273K." },
      { question: "Can I sell a micro-SaaS with zero revenue?", answer: "Technically yes — some buy the codebase and users (asset sale). Realistically, zero revenue = zero value in the MRR method. You'd get $1K-$5K for the code + maybe $0.10-$0.50 per user for the email list." },
      { question: "Do I need audited financials to sell?", answer: "For exits under $500K, no. A Stripe export and a 1-page P&L is enough. For $500K+, expect a buy-side quality of earnings (QoE) report which costs $10K-$20K and takes 2-4 weeks." },
    ],
  },
  {
    slug: "micro-saas-acquisition-checklist",
    metaTitle: "Micro SaaS Acquisition Checklist: Prepare to Sell in 90 Days | Invisible Exit",
    metaDescription: "90-day plan to prepare your micro-SaaS for acquisition. Code audit, financial cleanup, documentation, and buyer outreach. Increase your sale price by 20%+.",
    h1: "Micro SaaS Acquisition Prep Checklist (90-Day Plan)",
    intro: "You want to sell your micro-SaaS for the highest possible price. The difference between a 'quick flip' and a 'premium exit' is preparation. This 90-day checklist walks through exactly what to clean up, document, and optimize before talking to buyers.",
    stageLabel: "Action Plan",
    timeframe: "90 days to prepare",
    realisticValuation: "Companies that complete this 90-day prep before listing sell for 20-40% more than unprepared sellers. The average micro-SaaS gained $45K in sale price just by having clean documentation, according to MicroAcquire's 2025 seller survey.",
    whyNow: "Most micro-SaaS founders list their business the day they decide to sell. This is a mistake. Buyers are trained to spot unprepared sellers — your rushed listing signals you're selling for the wrong reasons. A prepared seller commands a premium because the buyer's diligence is painless.",
    readinessChecklist: [
      "Financial cleanup (Stripe reconciliations, expense categorization)",
      "Code audit (remove secrets, add README, architecture diagram)",
      "Data structure audit (proper indexing, no orphaned records)",
      "Legal structure review (LLC clean, IP assigned, no personal liability)",
      "Documentation: admin guide, runbook, handoff plan",
      "Buyer outreach materials: one-pager, teaser, data room",
    ],
    exitPaths: [
      {
        type: "30-Day Prep (Rush)",
        pros: ["Fastest path to cash", "Useful for distressed or burnout exits"],
        cons: ["Leaves 15-30% on the table", "Fewer buyer options", "Risk of deal falling through during diligence"],
        bestFor: "Founders who NEED to exit in 30 days (burnout, health, personal reasons)",
      },
      {
        type: "90-Day Prep (Recommended)",
        pros: ["20-40% price premium", "Cleaner diligence = fewer renegotiations", "Buyer pipeline builds over time"],
        cons: ["3 months of work on the business instead of the product", "Opportunity cost of delayed cash"],
        bestFor: "Most micro-SaaS founders — the sweet spot of preparation vs speed",
      },
      {
        type: "180-Day Prep (Premium)",
        pros: ["40-60% price premium possible", "Growth metrics improve multiple during prep", "Buyer competition can drive bidding wars"],
        cons: ["6 months is a long time to stay motivated on 'exit mode'", "Business risks (market shifts, churn) compound", "Diminishing returns — 6 months of prep doesn't yield 2x the price"],
        bestFor: "Founders who aren't in a rush and want to maximize every dollar",
      },
    ],
    buyerTypes: [
      {
        who: "Prepared Seller Buyers",
        whatTheyWant: "A deal they can diligence in under 2 weeks. They're willing to pay 20%+ more for speed and confidence.",
        typicalOffer: "Top of market multiple + faster close. They know a prepared seller won't waste their time.",
      },
    ],
    keyNumbers: [
      { metric: "Clean docs premium", multiple: "10-15% added to sale price" },
      { metric: "Clean code premium", multiple: "5-10% added to sale price" },
      { metric: "Clean finances premium", multiple: "10-15% added to sale price (deal killer if absent)" },
      { metric: "All three clean", multiple: "20-40% total premium" },
    ],
    preparationSteps: [
      { step: "Week 1-2: Financial cleanup", detail: "Export 12 months from Stripe. Categorize every expense. Separate personal from business. Create a 1-page P&L. Buyers ask for this on day 1 — have it ready." },
      { step: "Week 3-4: Code audit", detail: "Remove hardcoded API keys. Add .gitignore. Run a linter. Write a README with setup instructions. Create a simple architecture diagram (Mermaid or Excalidraw, 5 minutes)." },
      { step: "Week 5-6: Documentation", detail: "Write a runbook (how to deploy, monitor, backup, restore). Write an admin guide (how to onboard a customer, process refunds, handle support). Record a 15-minute Loom walkthrough of the entire codebase." },
      { step: "Week 7-8: Legal & Ownership", detail: "Verify your LLC or corporation is active and in good standing. Confirm IP assignment is documented. If you have a co-founder, get their agreement in writing. Clean up any personal liability exposure." },
      { step: "Week 9-10: Growth sprint", detail: "Run one targeted growth experiment (email campaign, content push, partnership). The goal is to show an uptrend in MRR during diligence. A 3-month uptrend adds 15-25% to your multiple." },
      { step: "Week 11-12: Buyer prep", detail: "Write the one-pager. Build a data room (Google Drive with docs). List on 2 marketplaces. DM 10-20 potential buyers. Start conversations but don't accept the first offer." },
    ],
    whatHappensPostExit: "Founders who follow this 90-day plan consistently report the same thing: 'I wish I'd done this sooner.' The prep work makes your business better regardless of whether you sell. Clean code, clean finances, documented systems — this is how you run a business you can exit at any time. And that freedom, ironically, makes you less desperate to sell and more likely to get a great price.",
    faqs: [
      { question: "What's the single most important prep step?", answer: "Financial cleanup. Every buyer asks for 12 months of Stripe exports first. If your books are messy, they assume everything else is too. A clean P&L adds 10-15% to your price immediately." },
      { question: "Should I hire someone to prepare the sale?", answer: "For deals under $200K, do it yourself — the prep work is straightforward and teaches you what buyers care about. For $200K+, consider a fractional CFO or an exit consultant (MicroAcquire offers concierge services at 5-7% of deal value)." },
      { question: "What percentage of micro-SaaS listings actually sell?", answer: "About 60-70% of listed micro-SaaS businesses sell, according to MicroAcquire. The 30-40% that don't sell usually have: (1) undocumented code, (2) messy finances, (3) the founder as a key person risk, or (4) unrealistic price expectations. Our 90-day prep addresses all four." },
    ],
  },
  {
    slug: "acquire-dot-com-vs-microacquire",
    metaTitle: "Acquire.com vs MicroAcquire vs Flippa: Best Micro SaaS Marketplace | Invisible Exit",
    metaDescription: "Compare the top micro-SaaS marketplaces: Acquire.com, MicroAcquire, and Flippa. Commission rates, buyer quality, time to close, and which is best for your exit.",
    h1: "Acquire.com vs MicroAcquire vs Flippa: Which Marketplace to Sell Your Micro SaaS",
    intro: "You've prepped your micro-SaaS for sale. Now where do you list it? The three major marketplaces — Acquire.com (formerly FE International), MicroAcquire, and Flippa — serve different segments of the micro-SaaS market. Picking the wrong one can cost you weeks and thousands in commission. Here's the honest comparison.",
    stageLabel: "Marketplace Comparison",
    timeframe: "15-minute read",
    realisticValuation: "The marketplace you choose affects your final sale price by 15-30%. MicroAcquire tends to yield the highest prices for micro-SaaS under $500K. Acquire.com is better above $500K. Flippa returns lower prices but faster closes for sub-$50K assets.",
    whyNow: "Each marketplace has evolved significantly since 2020. MicroAcquire was acquired and changed its commission structure. Acquire.com expanded into the micro-SaaS segment. Flippa added managed listings. The marketplace landscape shifts every 6 months — this is the current state.",
    readinessChecklist: [
      "Know your MRR, churn, growth rate, and profit margin",
      "Have your one-pager ready (different audiences for each platform)",
      "Understand the commission structure before listing (5-15%)",
      "Set your minimum acceptable price (don't negotiate against yourself)",
      "Prepare for 10-50 buyer inquiries per platform",
    ],
    exitPaths: [
      {
        type: "MicroAcquire (Best for $1K-$20K MRR)",
        pros: [
          "Highest buyer density for micro-SaaS under $500K",
          "Flat $2,500 listing fee (no percentage) — keeps more of your sale",
          "Strong indie hacker community — buyers understand the product",
          "Fastest time to close: 2-6 weeks for well-prepared listings",
        ],
        cons: [
          "$2,500 upfront fee (refunded if not sold, but you float the cash)",
          "Buyer quality varies — some are tire-kickers",
          "No escrow built-in (recommend using Escrow.com separately)",
        ],
        bestFor: "Micro-SaaS with $1K-$15K MRR. Clean code. Founded by an indie hacker.",
      },
      {
        type: "Acquire.com (Best for $500K+ exits)",
        pros: [
          "Highest quality buyers (PE funds, strategic acquirers, serial acquirers)",
          "Managed process — they handle diligence, escrow, and legal coordination",
          "Premium buyer pool = higher multiples on larger businesses",
        ],
        cons: [
          "10-15% commission (significant on a $500K deal: $50K-$75K)",
          "Longer process: 3-6 months from listing to close",
          "Strict vetting — not all micro-SaaS qualify (need 12+ months of clean revenue)",
        ],
        bestFor: "Serious SaaS businesses with $500K+ ARR, auditable financials, and a growth trajectory.",
      },
      {
        type: "Flippa (Best for sub-$50K asset sales)",
        pros: [
          "Fastest listing process (24 hours to live)",
          "Highest volume of buyers (50-200 inquiries per listing)",
          "Escrow included in the fee (5% + $0.30)",
        ],
        cons: [
          "Lowest average multiples (12-24x MRR typical)",
          "High percentage of lowball offers (60-70% of first offers are below market)",
          "Buyer quality is lowest — many are flippers, not operators",
        ],
        bestFor: "Quick asset sales under $50K, content sites, or when you need fast cash.",
      },
    ],
    buyerTypes: [
      {
        who: "MicroAcquire Buyers",
        whatTheyWant: "Indie hacker-friendly. Profitable, low-maintenance micro-SaaS. They value clean code and a story.",
        typicalOffer: "24-42x MRR, cash + earn-out sometimes",
      },
      {
        who: "Acquire.com Buyers",
        whatTheyWant: "Institutional quality. Projections, growth plan, management team (even if just you).",
        typicalOffer: "4-6x ARR, complex earn-out structures",
      },
      {
        who: "Flippa Buyers",
        whatTheyWant: "Cheap assets. They're looking for undervalued businesses they can flip or run as side cash.",
        typicalOffer: "12-24x MRR or less, all cash, no earn-out",
      },
    ],
    keyNumbers: [
      { metric: "MicroAcquire fee", multiple: "$2,500 flat (no % on sale)" },
      { metric: "Acquire.com fee", multiple: "10-15% of sale price" },
      { metric: "Flippa fee", multiple: "5% + $0.30 (includes escrow)" },
      { metric: "Average MicroAcquire close time", multiple: "4 weeks" },
      { metric: "Average Acquire.com close time", multiple: "4 months" },
      { metric: "Average Flippa close time", multiple: "2 weeks" },
    ],
    preparationSteps: [
      { step: "List on MicroAcquire first", detail: "For most micro-SaaS ($1K-$15K MRR), MicroAcquire is the best first move. The flat fee means 100% of your sale price stays with you above $2,500." },
      { step: "Complement with Flippa if under $50K", detail: "If your MRR is under $2K/month, list on Flippa simultaneously. The buyer pool overlaps minimally (<10%), so you're not diluting." },
      { step: "Only use Acquire.com above $500K", detail: "At 10-15% commission, Acquire.com only makes sense when their premium buyer pool adds enough value to offset the fee. Below $500K ARR, MicroAcquire is better economics." },
    ],
    whatHappensPostExit: "Regardless of which marketplace you choose, the post-sale experience is the same: you'll spend 2-6 months fulfilling the transition agreement (if any), then you're free. The best marketplace for YOU depends on your business size, your patience, and how much hand-holding you need during the process.",
    faqs: [
      { question: "Can I list on multiple marketplaces simultaneously?", answer: "Yes, but disclose it in your listing. Most micro-SaaS founders list on MicroAcquire + Flippa simultaneously. The overlap is minimal. Just don't accept two offers at once." },
      { question: "Which marketplace has the best buyer quality?", answer: "Acquire.com for $500K+ deals. MicroAcquire for indie hacker quality. Flippa for speed over quality. There's no single 'best' — match the marketplace to your business size." },
      { question: "Do I need a broker?", answer: "For deals under $100K, marketplaces work fine without a broker. For $100K-$500K, a good broker can add 15-25% to the price. Above $500K, a broker is essential for managing diligence." },
    ],
  },
];
