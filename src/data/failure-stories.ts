/**
 * Failure story pages for /failure-stories/:slug
 * Targets "why micro-SaaS startups fail" / "micro-SaaS failures"
 * Counter-positioning: honest analysis of what goes wrong.
 *
 * Greg Isenberg pSEO Round 5 — emotional dimension.
 */

export interface FailureStoryEntry {
  slug: string;
  failureType: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  theStory: string;
  whatWentWrong: { mistake: string; impact: string; lesson: string }[];
  theNumbers: { metric: string; value: string }[];
  whatWouldHaveWorked: string;
  warningSigns: string[];
  howToAvoid: string[];
  faqs: { question: string; answer: string }[];
}

export const failureStories: FailureStoryEntry[] = [
  {
    slug: "built-for-nobody",
    failureType: "No Market Need",
    metaTitle: "Why 'Built for Nobody' Startups Fail (Case Study) | Invisible Exit",
    metaDescription: "The #1 reason startups fail: building something nobody wants. Real failure patterns, warning signs, and how to validate before building.",
    h1: "The 'Built for Nobody' Failure: Building Something Nobody Wants",
    intro: "42% of startups fail because they build a product no one wants. This is the most common — and most preventable — failure mode. Here's the pattern, the warning signs, and how to avoid it.",
    theStory: "A developer (let's call him Alex) spent 6 months building an elaborate project management tool. Beautiful UI, dozens of features, clean code. He launched to crickets. No signups, no interest, no revenue. The problem? He never talked to potential users. He built what HE thought was cool, not what anyone was asking for. After 6 months of no traction, he shut it down. Total loss: $3,000 in hosting/tools and 6 months of evenings/weekends.",
    whatWentWrong: [
      { mistake: "Started with an idea, not a problem", impact: "Built a solution looking for a problem", lesson: "Always start by identifying a painful problem people already pay to solve" },
      { mistake: "Zero customer interviews before building", impact: "No validation that the problem was real or widespread", lesson: "Talk to 20+ potential customers before writing any code" },
      { mistake: "Built features based on assumptions", impact: "6 months of work on features no one needed", lesson: "Build the minimum to solve the core problem, then iterate based on feedback" },
      { mistake: "Launched with a big announcement", impact: "Embarrassing launch with no users", lesson: "Launch small, get 10 users, iterate, THEN announce" },
    ],
    theNumbers: [
      { metric: "Time invested", value: "6 months (evenings/weekends)" },
      { metric: "Money spent", value: "$3,000 (hosting, tools, domain)" },
      { metric: "Customer interviews", value: "0" },
      { metric: "Beta users", value: "3 (friends who felt bad)" },
      { metric: "Paying customers at shutdown", value: "0" },
      { metric: "Total revenue", value: "$0" },
    ],
    whatWouldHaveWorked: "If Alex had spent the first 2 weeks doing customer interviews (talking to project managers about their pain points), he would have discovered that his 'problem' wasn't actually painful. He could have pivoted to a real problem — perhaps automated standup summaries or deadline tracking — and built something people wanted. 2 weeks of interviews would have saved 6 months of building.",
    warningSigns: [
      "You can't name 10 specific people who have this problem",
      "No one is currently paying to solve this problem",
      "You're building features based on 'wouldn't it be cool if'",
      "Your target user is 'everyone' or 'all businesses'",
      "You haven't talked to a potential customer in the last week",
      "People say 'that sounds nice' instead of 'how do I get this?'",
    ],
    howToAvoid: [
      "Do 20+ customer interviews before writing any code",
      "Charge for the product BEFORE building it (presell)",
      "Build the smallest possible MVP in 1-2 weeks, not 6 months",
      "Get 10 paying customers before adding any new features",
      "If you can't get 10 customers in 60 days, pivot or kill it",
      "Fall in love with the problem, not your solution",
    ],
    faqs: [
      { question: "How do I know if my idea has market demand?", answer: "Three tests: (1) Are people already paying to solve this problem? (If yes, there's demand.) (2) Can you find 10+ people in a specific niche who describe this problem in their own words? (3) Will at least 3 of them commit to paying before you build? If you pass all three, build. If not, keep searching." },
      { question: "What if someone else is already doing it?", answer: "That's GOOD — it validates the market. Competition means there's demand. Your job is to serve a specific niche better than the general solution. Don't avoid proven markets — avoid unproven ones." },
    ],
  },
  {
    slug: "premature-scaling",
    failureType: "Premature Scaling",
    metaTitle: "Why Startups Fail from Premature Scaling | Invisible Exit",
    metaDescription: "The failure pattern of scaling before product-market fit. Warning signs, real numbers, and how to know when you're truly ready to scale.",
    h1: "The Premature Scaling Failure: Growing Before You're Ready",
    intro: "The second most common startup failure: scaling a product that hasn't found product-market fit. You spend money on ads, hire people, build features — all before knowing if the core product works. Here's the pattern and how to avoid it.",
    theStory: "A solo founder (Sarah) built a useful tool for freelance designers. After 2 months and 50 free users (5 paying), she thought she had product-market fit. She quit her job, hired a developer ($4K/month), started running ads ($2K/month), and launched 3 new features. Three months later: 200 free users but only 12 paying. Monthly costs: $8K. Revenue: $240/month. She burned through $24K in savings in 3 months and had to shut down.",
    whatWentWrong: [
      { mistake: "Confused free users with product-market fit", impact: "50 free users ≠ PMF. You need organic, paying growth.", lesson: "PMF looks like: users who would be 'very disappointed' if your product disappeared (Sean Ellis test)" },
      { mistake: "Hired before validating revenue model", impact: "$4K/month burn on a product making $100/month", lesson: "Don't hire until revenue covers the hire" },
      { mistake: "Ran ads before organic growth worked", impact: "Spent $2K/month acquiring users who didn't retain", lesson: "Ads amplify what works — they don't fix what doesn't" },
      { mistake: "Added features instead of deepening core value", impact: "Diluted focus, slow development", lesson: "Before adding features, ensure 40%+ of users use your core feature weekly" },
    ],
    theNumbers: [
      { metric: "Free users at 'PMF' decision", value: "50" },
      { metric: "Paying users at 'PMF' decision", value: "5 (10% conversion)" },
      { metric: "Monthly spend after scaling", value: "$8,000" },
      { metric: "Monthly revenue at shutdown", value: "$240" },
      { metric: "Savings burned", value: "$24,000 in 3 months" },
      { metric: "Time to shutdown", value: "3 months after scaling decision" },
    ],
    whatWouldHaveWorked: "Sarah should have stayed employed, kept the product as a side project, and focused on converting free users to paid. Once she hit 50 PAYING users (not free) with organic growth, THEN she could have started scaling slowly — maybe ads first, hire second. The right sequence: validate → monetize → prove organic growth → scale spend → hire.",
    warningSigns: [
      "Your free-to-paid conversion rate is under 5%",
      "Users sign up but don't come back (low retention)",
      "You can't name 10 users who'd be 'very disappointed' without your product",
      "Growth requires paid acquisition (no organic growth)",
      "You're thinking about hiring before you've hit $5K MRR",
      "You're spending on ads before you understand your unit economics",
    ],
    howToAvoid: [
      "Define product-market fit clearly: 40%+ of users 'very disappointed' without you",
      "Get to $5K-$10K MRR organically before scaling spend",
      "Never hire until revenue covers the salary + taxes + tools (1.5x)",
      "Understand CAC and LTV before running ads",
      "Focus on retention before acquisition",
      "Scale one thing at a time: first organic, then ads, then hires",
    ],
    faqs: [
      { question: "How do I know if I have product-market fit?", answer: "The Sean Ellis test: survey your users, 'How would you feel if you could no longer use this product?' If 40%+ say 'very disappointed,' you have PMF. Other signals: organic word-of-mouth growth, users asking for features, retention above 40% monthly, willingness to pay without discounts." },
      { question: "When is it safe to start running ads?", answer: "When you can answer: (1) What's your CAC (customer acquisition cost)? (2) What's your LTV (lifetime value)? (3) Is LTV > 3x CAC? If you don't know these numbers, you're not ready. Start with $100/day, measure for 30 days, and only scale if the math works." },
    ],
  },
  {
    slug: "single-founder-burnout",
    failureType: "Burnout",
    metaTitle: "Why Solo Founders Burn Out and Fail | Invisible Exit",
    metaDescription: "The hidden failure pattern: solo founder burnout. Warning signs, real costs, and how to build sustainably while employed.",
    h1: "The Solo Founder Burnout Failure",
    intro: "The most under-discussed failure mode: founders who burn out trying to do everything alone while employed. Here's what happens, the warning signs, and how to build sustainably.",
    theStory: "Mark was a senior developer making $180K. He started a side project — a B2B SaaS for HR teams. For 8 months, he worked 9-5 at his job, then 7pm-midnight on his side project. Weekends were 12-hour coding days. At month 6, he had $3K MRR. At month 8, he collapsed at work — severe burnout, doctor-ordered 2-week leave. During recovery, he couldn't look at code. His side project stagnated, customers churned, and he eventually shut it down. $3K MRR gone.",
    whatWentWrong: [
      { mistake: "Tried to do everything: coding, marketing, support, sales", impact: "12-14 hour days for 8 months = inevitable burnout", lesson: "Productize or delegate one function early (usually support or marketing)" },
      { mistake: "No rest days or boundaries", impact: "No recovery time, physical and mental breakdown", lesson: "Take at least 1 full day off per week. Non-negotiable." },
      { mistake: "Ignored physical health signs", impact: "Sleep deprivation, weight gain, eventually collapse", lesson: "Sleep, exercise, and nutrition are part of the work, not luxuries" },
      { mistake: "Didn't build systems or automation", impact: "Everything depended on Mark personally", lesson: "Automate support, marketing, and operations before scaling" },
    ],
    theNumbers: [
      { metric: "Hours worked per week (total)", value: "80-90 hours" },
      { metric: "Months before burnout", value: "8 months" },
      { metric: "MRR at peak", value: "$3,000" },
      { metric: "Medical costs", value: "$2,500 (tests, therapy)" },
      { metric: "MRR after recovery", value: "$800 (churned during leave)" },
      { metric: "Decision", value: "Shut down project to focus on health" },
    ],
    whatWouldHaveWorked: "Mark should have: (1) Worked 15-20 hours/week on the side project, not 40+, (2) Taken 1 full day off per week, (3) Hired a virtual assistant for support ($500/month) once he hit $2K MRR, (4) Automated onboarding and common support questions. Sustainable pace > heroic sprint.",
    warningSigns: [
      "You're working more than 60 hours/week total (job + side project)",
      "You haven't taken a full day off in 2+ weeks",
      "You're losing sleep regularly (under 7 hours)",
      "You feel dread when thinking about your side project",
      "Your relationships are suffering",
      "You can't focus or make simple decisions",
      "Physical symptoms: headaches, weight change, insomnia",
    ],
    howToAvoid: [
      "Cap your side project at 15-20 hours/week while employed",
      "Take at least 1 full day off per week — no exceptions",
      "Sleep 7+ hours per night. This is non-negotiable.",
      "Automate or delegate support once you hit 20+ users",
      "Use AI tools (Claude, Cursor) to 2-3x your coding speed",
      "Set a sustainable pace: this is a marathon, not a sprint",
      "Talk to other founders — isolation amplifies burnout",
    ],
    faqs: [
      { question: "Can I build a startup while working full-time sustainably?", answer: "Yes, if you: (1) Cap at 15-20 hours/week, (2) Take 1 day off, (3) Sleep enough, (4) Set realistic timelines (expect 12-24 months instead of 6), (5) Use AI tools to multiply your output. Sustainable founders reach $10K MRR in 18 months. Burned-out founders reach $5K MRR in 8 months then quit." },
      { question: "When should I quit my job to focus full-time?", answer: "When your side project generates 75% of your living expenses for 3+ months. Going full-time means you can work 40 hours/week instead of 15-20, but you also lose the safety net. The ideal: side-project revenue is clearly growing and would accelerate with more time. Don't quit to 'focus' if your side project has no revenue yet." },
    ],
  },
  {
    slug: "wrong-customer",
    failureType: "Wrong Target Customer",
    metaTitle: "Why Startups Fail by Targeting the Wrong Customer | Invisible Exit",
    metaDescription: "The failure pattern of building for the wrong audience. How to identify your real customer and avoid the most expensive startup mistake.",
    h1: "The Wrong Customer Failure: Building for People Who Won't Pay",
    intro: "You built something people 'love' — but they won't pay for it. This is the 'wrong customer' failure: targeting users who aren't buyers. Here's the pattern and how to fix it.",
    theStory: "Jenna built a beautiful personal finance app for Gen Z college students. It went viral on TikTok — 50,000 signups in 2 months. The problem? College students don't pay for software. After trying $2/month, $5/year, and freemium models, conversion was 0.3%. 150 paying users at $2/month = $300/month. Server costs: $400/month. She was losing money on every user. After 4 months, she shut it down.",
    whatWentWrong: [
      { mistake: "Optimized for free user growth, not revenue", impact: "50K free users but no way to monetize", lesson: "If they won't pay, they're not your customer" },
      { mistake: "Targeted a demographic with no purchasing power", impact: "College students expect everything free", lesson: "Build for people with budget and pain (businesses, professionals)" },
      { mistake: "Consumer pricing on a freemium model", impact: "$2/month doesn't cover costs even at scale", lesson: "Consumer SaaS is brutally hard — B2B is 10x easier" },
      { mistake: "Ignored unit economics", impact: "Every user cost more than they generated", lesson: "Calculate CAC and LTV before scaling any channel" },
    ],
    theNumbers: [
      { metric: "Free signups", value: "50,000" },
      { metric: "Conversion to paid", value: "0.3% (150 users)" },
      { metric: "Monthly revenue", value: "$300" },
      { metric: "Monthly server costs", value: "$400+" },
      { metric: "Net per user", value: "Negative $0.02" },
      { metric: "Time invested", value: "6 months" },
    ],
    whatWouldHaveWorked: "If Jenna had built the same app for a different customer — young professionals (25-35) with income — she could have charged $9-$15/month and achieved 3-5% conversion. Same product, different audience. Or she could have built a B2B version: personal finance benefits for companies to offer employees ($5/seat/month, 100+ employees per deal).",
    warningSigns: [
      "Users love your product but won't pay for it",
      "Your target user doesn't have a budget for software",
      "Conversion rate is under 1% even with aggressive pricing",
      "You're targeting consumers instead of businesses",
      "Your users aren't the decision-makers or buyers",
      "Every user requires extensive free support",
    ],
    howToAvoid: [
      "Target businesses, not consumers (B2B > B2C for indie hackers)",
      "Validate willingness to pay BEFORE building (presell)",
      "Charge from day one — free users tell you nothing about monetization",
      "Talk to the person who holds the budget, not just the user",
      "Calculate unit economics: can you profitably acquire this customer?",
      "If they won't pay, find who will — same product, different packaging",
    ],
    faqs: [
      { question: "Should I build B2B or B2C?", answer: "For solo founders and indie hackers: B2B, without question. Businesses have budget, willingness to pay, and clear ROI. Consumer apps require millions of users to be profitable and compete with free alternatives. The exception: if your consumer app has a clear monetization path (subscriptions, marketplace, ads) and you understand the unit economics." },
      { question: "How do I find customers who will pay?", answer: "Look for: (1) People already paying for similar tools, (2) Businesses with budget categories for your solution, (3) Professionals whose time is worth $50+/hour (they'll pay to save time), (4) Companies with 10+ employees who face the problem. Avoid: students, hobbyists, and anyone who expects software to be free." },
    ],
  },
  {
    slug: "technical-debt-explosion",
    failureType: "Technical Debt",
    metaTitle: "How Technical Debt Kills Startups | Invisible Exit",
    metaDescription: "The hidden failure pattern of accumulating technical debt. Real costs, warning signs, and how to balance speed and quality.",
    h1: "The Technical Debt Explosion Failure",
    intro: "You moved fast and broke things — and now everything is broken. Technical debt compounds like financial debt, and eventually the interest payments (bugs, slow features, downtime) kill the product. Here's the pattern.",
    theStory: "David built an e-commerce analytics tool in 3 weeks (impressive speed). It worked, got users, hit $5K MRR. But the codebase was a mess: no tests, monolithic architecture, copy-pasted code. Every new feature took longer. Bugs multiplied. By month 6, he spent 80% of time fixing bugs and 20% building features. By month 9, a major bug caused 4 hours of downtime. He lost 30% of customers. By month 12, he couldn't add features without breaking something else. He rewrote from scratch — losing 6 months and most of his customers.",
    whatWentWrong: [
      { mistake: "No tests from the beginning", impact: "Every change risked breaking something", lesson: "Write tests for critical paths from day one" },
      { mistake: "Monolithic architecture with no separation", impact: "Changes in one area broke others", lesson: "Separate concerns, even in a monolith" },
      { mistake: "Copy-pasted instead of abstracted", impact: "Bug fixes had to be applied in 10 places", lesson: "DRY (Don't Repeat Yourself) from the start" },
      { mistake: "No CI/CD or automated deployment", impact: "Deployments were manual and error-prone", lesson: "Automate testing and deployment early" },
      { mistake: "Rewrote instead of refactoring", impact: "6 months of no new features, lost customers", lesson: "Refactor incrementally, never rewrite" },
    ],
    theNumbers: [
      { metric: "Time to build MVP", value: "3 weeks" },
      { metric: "Time to first $5K MRR", value: "3 months" },
      { metric: "Bug-fix time at month 6", value: "80% of development time" },
      { metric: "Downtime incident", value: "4 hours, lost 30% of customers" },
      { metric: "Rewrite time", value: "6 months" },
      { metric: "Customers retained after rewrite", value: "20%" },
    ],
    whatWouldHaveWorked: "David should have: (1) Written basic tests for payment, authentication, and data integrity from week 1, (2) Spent 20% of time on refactoring/tech debt from the beginning, (3) Set up CI/CD in month 1, (4) When debt became overwhelming, refactored incrementally (Strangler Pattern) instead of rewriting. The rewrite killed the business.",
    warningSigns: [
      "Each new feature takes longer than the last",
      "You're afraid to change code because something might break",
      "Bug reports are increasing month over month",
      "You spend more time fixing than building",
      "New hires can't understand the codebase",
      "Deployments require manual steps and cause anxiety",
    ],
    howToAvoid: [
      "Write tests for critical paths (payments, auth, data) from day one",
      "Set up CI/CD in the first month",
      "Follow DRY and single-responsibility principles",
      "Spend 20% of dev time on refactoring/tech debt",
      "Never do a full rewrite — refactor incrementally",
      "Use the Strangler Pattern to replace old code gradually",
      "Code review everything, even if you're solo (review your own PRs after 24h)",
    ],
    faqs: [
      { question: "How much technical debt is acceptable?", answer: "In the early days, ship fast and accept some debt. But always distinguish between 'reckless debt' (no tests, copy-paste) and 'prudent debt' (quick implementation with a TODO for later). Prudent debt is fine; reckless debt compounds. Rule of thumb: never ship without tests for critical paths (payments, auth, data integrity). Everything else can be iterated." },
      { question: "Should I ever rewrite my app from scratch?", answer: "Almost never. Joel Spolsky's classic advice still holds: rewrites are the single worst strategic mistake. Instead, use the Strangler Pattern: replace old code piece by piece while keeping the system running. The only exception: if the architecture is fundamentally wrong AND you have 12+ months of runway AND no other option." },
    ],
  },
  {
    slug: "co-founder-conflict",
    failureType: "Team Breakup",
    metaTitle: "Why Co-Founder Conflicts Destroy Startups | Invisible Exit",
    metaDescription: "The #1 preventable cause of startup death after 'no market need.' Real patterns, legal pitfalls, and how to set up a founding team that lasts.",
    h1: "The Co-Founder Conflict Failure",
    intro: "65% of startups with co-founders fail due to co-founder conflict. It's the most emotionally devastating failure mode — and the most preventable. Here's what goes wrong and how to protect yourself.",
    theStory: "Mike and Tom were best friends who started a SaaS together. 50/50 equity, no vesting, no operating agreement. Mike coded, Tom did sales. After 8 months, they had $8K MRR. Then disagreements started: Mike wanted to raise prices, Tom wanted to lower them. Mike wanted to raise money, Tom wanted to bootstrap. Tom felt Mike wasn't working enough hours. Mike felt Tom wasn't bringing in enough deals. The relationship deteriorated. They stopped talking. Neither could make decisions alone (50/50). The product stagnated. Customers churned. They shut down after 14 months and stopped speaking entirely.",
    whatWentWrong: [
      { mistake: "50/50 equity with no vesting", impact: "No mechanism for someone leaving, no incentive to stay", lesson: "Always use 4-year vesting with 1-year cliff. Never do 50/50 without a tiebreaker." },
      { mistake: "No operating agreement", impact: "No decision-making process for disagreements", lesson: "Document how decisions are made, who has final say on what" },
      { mistake: "Undefined roles and expectations", impact: "Both thought the other should do more", lesson: "Clearly define roles, hours, and expectations in writing" },
      { mistake: "Didn't discuss exit strategy upfront", impact: "Fundamental disagreement on company direction", lesson: "Discuss fundraise vs bootstrap, exit timeline, and vision before starting" },
      { mistake: "Let relationship deteriorate without intervention", impact: "Small disagreements became resentment", lesson: "Address conflicts early. Use a mediator if needed" },
    ],
    theNumbers: [
      { metric: "Initial equity split", value: "50/50 (no vesting)" },
      { metric: "MRR at peak", value: "$8,000" },
      { metric: "Months to first major conflict", value: "8 months" },
      { metric: "Months to shutdown", value: "14 months" },
      { metric: "Legal costs unwinding", value: "$5,000+ (without an operating agreement)" },
      { metric: "Relationship after", value: "No longer friends" },
    ],
    whatWouldHaveWorked: "Mike and Tom should have: (1) Set up 4-year vesting with 1-year cliff (if someone leaves, they keep only what's vested), (2) Signed an operating agreement with decision-making rules, (3) Had one person as CEO with 51% for tie-breaking, (4) Discussed exit strategy and vision before starting, (5) Held weekly check-ins to address small issues before they compounded. These conversations are awkward but essential.",
    warningSigns: [
      "You avoid bringing up issues because it might cause conflict",
      "You feel your co-founder isn't contributing equally",
      "Decisions take weeks because you can't agree",
      "You have different visions for the company's future",
      "You've stopped socializing outside of work",
      "Neither of you has clear authority to make decisions",
    ],
    howToAvoid: [
      "ALWAYS use 4-year vesting with 1-year cliff (standard startup equity)",
      "Never do 50/50 — give one person 51% for tie-breaking authority",
      "Sign an operating agreement before writing any code",
      "Discuss vision, exit strategy, and work style before starting",
      "Define clear roles: who decides what (product, sales, hiring, money)",
      "Hold weekly alignment meetings — surface small issues early",
      "Consider a solo founder structure if you value autonomy",
    ],
    faqs: [
      { question: "Should I start a company alone or with a co-founder?", answer: "Solo if you can handle all functions (build + sell). Co-founder if you need complementary skills. But solo is better than a bad co-founder. 50% of a successful company is better than 100% of a failed one. If you go solo, build a network of advisors and mentors for the functions you lack." },
      { question: "How should I split equity with a co-founder?", answer: "Base it on contribution, not friendship. Consider: time commitment, capital, skills, and network. One common approach: split 60/40 or 55/45 based on who had the idea, who is full-time, who brings the key skill. ALWAYS use 4-year vesting with 1-year cliff. If someone leaves in year 1, they keep nothing (or a small amount). This protects both of you." },
    ],
  },
];
