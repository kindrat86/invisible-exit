/**
 * Month-by-month timeline pages for /timeline/:slug.
 * Each page targets a specific month milestone.
 */

export interface TimelineEntry {
  slug: string;
  month: number;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  milestones: { milestone: string; completed: boolean; description: string }[];
  metricsToCheck: string[];
  commonAtThisStage: string[];
  mistakes: string[];
  whatsNext: string;
  faqs: { question: string; answer: string }[];
}

export const timelines: TimelineEntry[] = [
  {
    slug: "month-1",
    month: 1,
    metaTitle: "Month 1 of Your Micro-SaaS Journey: Idea + Validation (2026)",
    metaDescription: "What to accomplish in your first month of building a micro-SaaS: idea selection, customer interviews, landing page, and pre-sell strategy.",
    h1: "Month 1: Idea + Validation",
    intro: "Month 1 is the most important. Don't build anything yet. Your goal is to have a validated idea and at least one person who's willing to pay. Everything else comes later.",
    milestones: [
      { milestone: "List 10 problems you've experienced or observed", completed: true, description: "Write down every business problem you've encountered. The best ideas come from your own experience." },
      { milestone: "Interview 5 potential customers", completed: true, description: "Find 5 people who have each problem. Ask about current solutions and frustrations. Do not pitch." },
      { milestone: "Choose one problem to solve", completed: false, description: "Based on interviews, pick the problem that's most painful and most common." },
      { milestone: "Write a one-page problem statement", completed: false, description: "Define the problem, who has it, and why existing solutions fail. 1 page maximum." },
      { milestone: "Create a landing page with email capture", completed: false, description: "Build a simple page describing the solution. Collect emails. No product yet." },
    ],
    metricsToCheck: ["Emails collected (target: 10+)", "Interview willingness (target: 80% say 'yes')", "Problem pain level (target: 7+/10)"],
    commonAtThisStage: ["Feeling overwhelmed by all the possibilities", "Wanting to skip validation and start coding", "Doubting whether your idea is good enough"],
    mistakes: ["Falling in love with your solution instead of the problem", "Interviewing friends who will tell you what you want to hear", "Picking an idea from 'cool tech' instead of painful problems"],
    whatsNext: "Month 2 is about pre-selling. If you can't get 3 people to pay before you build, go back to month 1 with a different idea.",
    faqs: [
      { question: "How many hours per week should I spend in month 1?", answer: "5-10 hours. Most of it on customer conversations, not building. If you're spending more time coding than talking to people, you're moving too fast." },
      { question: "What if I can't find people to interview?", answer: "Then you're not in the right industry or you don't understand the problem deeply enough. Go where your target customers are: LinkedIn, Reddit, industry forums, professional networks." },
    ],
  },
  {
    slug: "month-3",
    month: 3,
    metaTitle: "Month 3 of Your Micro-SaaS: MVP Launch (2026)",
    metaDescription: "What to accomplish by month 3 of your micro-SaaS journey: MVP launch, first paying customer, and validation infrastructure.",
    h1: "Month 3: MVP Launch",
    intro: "By month 3, you should have a functional MVP and your first paying customer. The goal is not perfection — it's a working solution that one person pays for.",
    milestones: [
      { milestone: "Pre-sell to at least 3 customers", completed: true, description: "Convince 3 people to pay before you build. If you can't, the problem isn't painful enough." },
      { milestone: "Build the MVP (one core feature only)", completed: true, description: "Build only the single feature that solves the core problem. Resist scope creep fiercely." },
      { milestone: "Launch to your pre-sold customers", completed: false, description: "Give your 3 pre-sold customers access. Get their feedback. Ship improvements daily." },
      { milestone: "Set up analytics", completed: false, description: "Install product analytics. Track signups, activations, and daily usage from day one." },
      { milestone: "Write welcome email sequence", completed: false, description: "Create a 3-email onboarding: welcome, setup guide, first win checklist." },
    ],
    metricsToCheck: ["Topline MRR", "Daily/weekly active users", "Onboarding completion rate", "Support tickets per day"],
    commonAtThisStage: ["The MVP feels embarrassingly small", "Customers request features that feel obvious but weren't planned", "Impostor syndrome about charging for a simple tool"],
    mistakes: ["Adding features before the core workflow works", "Polishing UI instead of testing the value proposition", "Not charging enough (price is part of validation)"],
    whatsNext: "Month 4-6 is about getting to $500 MRR. Focus on retention, not acquisition. If your first customers stay, you have something worth building on.",
    faqs: [
      { question: "What if my MVP has bugs?", answer: "Ship it anyway. Early customers tolerate bugs if the value is clear. Fix bugs fast, but don't delay launch for perfection." },
      { question: "How do I handle support in month 3?", answer: "You ARE support. Every ticket is a product insight. Reply within 1 hour during business hours. Use issues as fuel for your roadmap." },
    ],
  },
  {
    slug: "month-6",
    month: 6,
    metaTitle: "Month 6 of Your Micro-SaaS: First $500 MRR (2026)",
    metaDescription: "What to accomplish by month 6: first $500 MRR, repeatable acquisition, and product-market fit signals.",
    h1: "Month 6: First $500 MRR",
    intro: "Six months in, you should be at or approaching $500 MRR. The product is working for your early customers and you're starting to find repeatable acquisition patterns.",
    milestones: [
      { milestone: "Reach $500 MRR", completed: true, description: "10-20 paying customers at $29/month or 5-10 at $49/month." },
      { milestone: "Find one repeatable acquisition channel", completed: true, description: "Identify where your last 5 customers came from. Double down on that channel." },
      { milestone: "Reduce churn to under 10%", completed: false, description: "Analyze why customers leave. Fix the top 3 reasons. Reach out to every churned customer personally." },
      { milestone: "Implement feedback loop", completed: false, description: "Create a system for collecting, prioritizing, and acting on customer feedback weekly." },
      { milestone: "Write 5 blog posts", completed: false, description: "Answer the exact questions your customers Googled before finding you. Each post drives organic traffic." },
    ],
    metricsToCheck: ["MRR trend (up or flat?)", "Churn rate (below 10%?)", "Customer acquisition cost", "Net promoter score or customer satisfaction"],
    commonAtThisStage: ["Growth plateau — same customers, same channels", "Feature request overwhelm — everyone wants something different", "The realization that building is only half the job (distribution is the other half)"],
    mistakes: ["Building features when you should be selling", "Neglecting churn analysis (losers disguise as 'busy')", "Being everywhere instead of dominating one channel"],
    whatsNext: "Months 7-12 are about scaling to $2K+ MRR. Invest in content, referrals, and the product improvements that reduce churn.",
    faqs: [
      { question: "Is $500 MRR in 6 months good?", answer: "Yes. Most micro-SaaS ideas die before reaching $500. You've proven demand. Now the question is whether you can scale it." },
      { question: "Should I raise prices at $500 MRR?", answer: "Not yet. Focus on getting more customers at your current price. Raise prices once you're at capacity or have clear evidence of underpricing." },
    ],
  },
  {
    slug: "month-12",
    month: 12,
    metaTitle: "Month 12 of Your Micro-SaaS: $2K+ MRR (2026)",
    metaDescription: "What to accomplish by month 12: $2K+ MRR, established content engine, and repeatable growth systems.",
    h1: "Month 12: $2K+ MRR",
    intro: "One year in, you should be at $2K+ MRR with a clear path to $4K/month (your freedom number). The business has momentum and you know what works.",
    milestones: [
      { milestone: "Reach $2K+ MRR", completed: true, description: "40-70 paying customers. Steady growth trend." },
      { milestone: "Content engine running", completed: true, description: "2-4 posts per month, 2K+ organic visits, consistent new signups from content." },
      { milestone: "Customer referral system in place", completed: true, description: "Referral program active. 10-20% of new customers come from referrals." },
      { milestone: "Automated onboarding complete", completed: false, description: "New users can sign up, onboard, and get value without your involvement." },
      { milestone: "Annual plans offered", completed: false, description: "15%+ of customers on annual billing. Improves retention and cash flow." },
    ],
    metricsToCheck: ["MRR growth rate (month over month)", "Churn rate (under 8%?)", "Referral source breakdown", "Annual vs monthly revenue split"],
    commonAtThisStage: ["Growth feels slow — you're not doubling every month", "Competing with your own product's feature requests", "Balancing job, business, and life is exhausting"],
    mistakes: ["Giving up too early (most $2K MRR businesses die before $4K)", "Hiring too soon (you don't have margin yet)", "Not raising prices (your product is worth more now)"],
    whatsNext: "Months 13-18 are the final push to $4K/month (freedom number). Focus on SEO, partnerships, and the features that unlock higher price tiers.",
    faqs: [
      { question: "Should I quit my job at $2K MRR?", answer: "No. $2K MRR is ~$1.5K after taxes. That's not enough to replace your salary. Wait until you're at $4K MRR consistently for 3+ months." },
      { question: "How do I break through the $2K plateau?", answer: "Find one channel you've under-invested in and go all-in. Most people spread across 5 channels and get 10% from each. Pick one and get 80% from it." },
    ],
  },
  {
    slug: "month-18",
    month: 18,
    metaTitle: "Month 18 of Your Micro-SaaS: Freedom Number ($4K+ MRR) (2026)",
    metaDescription: "What to accomplish by month 18: $4K+ MRR (freedom number), scalable systems, and the option to leave your job.",
    h1: "Month 18: The Freedom Number",
    intro: "Eighteen months is the target. You should be at $4K+ MRR with a business that runs well enough that quitting your job is a real, mathematical option.",
    milestones: [
      { milestone: "Reach $4K+ MRR (freedom number)", completed: true, description: "138+ customers at $29/month. Your side business covers core living expenses." },
      { milestone: "Business runs without you", completed: true, description: "Onboarding, support, and billing are automated. You could take a week off without revenue dropping." },
      { milestone: "Clear decision on job vs business", completed: true, description: "You know your number. You know your runway. The decision is psychological, not financial." },
      { milestone: "Systems and documentation in place", completed: true, description: "All processes documented. A contractor could run the business for 2 weeks." },
      { milestone: "Growth plan for post-job phase", completed: true, description: "Plan for what you'll do with full-time focus: double down on content, build second product, or enterprise sales." },
    ],
    metricsToCheck: ["MRR stability (3+ months above $4K)", "Churn rate (under 5%?)", "Profit margin", "Time you spend vs revenue generated"],
    commonAtThisStage: ["Fear of actually quitting (golden handcuffs)", "Analysis paralysis on whether $4K is 'enough'", "Pressure from peers/family about leaving a stable job"],
    mistakes: ["Waiting for $10K MRR to quit (you don't need that)", "Not having a health insurance plan", "Staying for 'one more bonus cycle' indefinitely"],
    whatsNext: "You've reached the freedom number. Now you decide: grow the business, start another, or take a breather. You've earned the right to choose.",
    faqs: [
      { question: "Is $4K MRR really enough to quit?", answer: "For most single people in non-VHCOL areas, yes. $4K MRR = ~$3K after taxes. If your core expenses are under $3K, you have a decision to make." },
      { question: "What if I want more before quitting?", answer: "That's fine. Keep growing. But be honest — is it about financial safety or fear? Your business has customers who pay you every month. That's more predictable than any job." },
    ],
  },
];
