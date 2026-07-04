/**
 * Reddit strategy pages for /reddit/:slug.
 * "How to use Reddit as a [profession] to build an audience"
 */
export interface RedditStrategy {
  slug: string;
  profession: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  bestSubreddits: { name: string; subscribers: string; why: string }[];
  postingStrategy: string;
  contentIdeas: string[];
  commonMistakes: string[];
  faqs: { question: string; answer: string }[];
}

interface ProfReddit {
  slug: string; name: string; subs: { name: string; subscribers: string; why: string }[];
}

const profRedditData: ProfReddit[] = [
  { slug: "accountants", name: "Accountants", subs: [
    { name: "Accounting", subscribers: "700K+", why: "Direct target audience for tax, bookkeeping, and compliance tools" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Business owners who need financial automation tools" },
    { name: "Bookkeeping", subscribers: "120K+", why: "Niche audience for bookkeeping-specific software" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Broad founder audience interested in financial tools" },
    { name: "FIRE", subscribers: "800K+", why: "Financial independence seekers who value recurring revenue" },
  ]},
  { slug: "lawyers", name: "Lawyers", subs: [
    { name: "LawFirm", subscribers: "150K+", why: "Firm owners who need practice management tools" },
    { name: "lawyers", subscribers: "300K+", why: "General legal professional community" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Business owners needing legal compliance tools" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Founders interested in legal tech" },
    { name: "SaaS", subscribers: "200K+", why: "Legal SaaS is a growing niche" },
  ]},
  { slug: "teachers", name: "Teachers", subs: [
    { name: "Teachers", subscribers: "500K+", why: "Direct audience for education tools" },
    { name: "education", subscribers: "300K+", why: "EdTech discussions and trends" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Teacher-entrepreneurs share experiences" },
    { name: "sidehustle", subscribers: "1.2M+", why: "Teachers looking for supplementary income" },
    { name: "EdTech", subscribers: "50K+", why: "Niche education technology community" },
  ]},
  { slug: "nurses", name: "Nurses", subs: [
    { name: "nursing", subscribers: "600K+", why: "Direct healthcare professional audience" },
    { name: "Healthcare", subscribers: "200K+", why: "Broad healthcare industry discussions" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Nurse entrepreneurs share journeys" },
    { name: "sidehustle", subscribers: "1.2M+", why: "Nurses seeking flexible income" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Healthcare business owners" },
  ]},
  { slug: "software-engineers", name: "Software Engineers", subs: [
    { name: "SideProject", subscribers: "400K+", why: "Developers building side projects — perfect audience" },
    { name: "cscareerquestions", subscribers: "900K+", why: "Engineers looking for career alternatives" },
    { name: "startups", subscribers: "1.3M+", why: "Startup-minded engineers and founders" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Broad founder community" },
    { name: "SaaS", subscribers: "200K+", why: "Micro-SaaS specific discussions" },
  ]},
  { slug: "marketers", name: "Marketers", subs: [
    { name: "marketing", subscribers: "800K+", why: "Direct audience for marketing tools" },
    { name: "digital_marketing", subscribers: "400K+", why: "Digital marketers seeking tools and strategies" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Founder community interested in growth" },
    { name: "SaaS", subscribers: "200K+", why: "Marketing SaaS discussions" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Small business owners needing marketing help" },
  ]},
  { slug: "hr-managers", name: "HR Managers", subs: [
    { name: "humanresources", subscribers: "300K+", why: "Direct HR professional audience" },
    { name: "recruiting", subscribers: "200K+", why: "HR and recruiting overlap" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Business owners needing HR tools" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "HR-tech founders share insights" },
    { name: "peopleops", subscribers: "50K+", why: "Niche people operations community" },
  ]},
  { slug: "consultants", name: "Consultants", subs: [
    { name: "consulting", subscribers: "400K+", why: "Direct consultant audience" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Consultants transitioning to founders" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Business owners seeking consulting tools" },
    { name: "SaaS", subscribers: "200K+", why: "Consulting SaaS is a growing niche" },
    { name: "sidehustle", subscribers: "1.2M+", why: "Consultants building side income" },
  ]},
  { slug: "designers", name: "Designers", subs: [
    { name: "webdev", subscribers: "1.4M+", why: "Web developers and designers building tools" },
    { name: "design", subscribers: "1.8M+", why: "Broad design community" },
    { name: "UIUC", subscribers: "50K+", why: "UI/UX specific discussions" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Designer-founders share journeys" },
    { name: "SaaS", subscribers: "200K+", why: "Design tool SaaS discussions" },
  ]},
  { slug: "financial-analysts", name: "Financial Analysts", subs: [
    { name: "financialanalysis", subscribers: "100K+", why: "Direct analyst audience" },
    { name: "Finance", subscribers: "500K+", why: "Broad finance community" },
    { name: "dataanalysis", subscribers: "200K+", why: "Data analysts seeking financial tools" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Finance professionals building businesses" },
    { name: "FIRE", subscribers: "800K+", why: "Financial independence community" },
  ]},
  { slug: "product-managers", name: "Product Managers", subs: [
    { name: "ProductManagement", subscribers: "500K+", why: "Direct PM audience" },
    { name: "startups", subscribers: "1.3M+", why: "PMs in startup environments" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "PM-founders building products" },
    { name: "SaaS", subscribers: "200K+", why: "SaaS product management discussions" },
    { name: "sidehustle", subscribers: "1.2M+", why: "PMs building side projects" },
  ]},
  { slug: "sales-managers", name: "Sales Managers", subs: [
    { name: "sales", subscribers: "400K+", why: "Direct sales professional audience" },
    { name: "Salesforce", subscribers: "150K+", why: "CRM and sales tool discussions" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Business owners needing sales tools" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Sales professionals transitioning to founders" },
    { name: "SaaS", subscribers: "200K+", why: "Sales SaaS discussions" },
  ]},
  { slug: "doctors", name: "Doctors", subs: [
    { name: "medicine", subscribers: "500K+", why: "Direct physician audience" },
    { name: "Healthcare", subscribers: "200K+", why: "Broad healthcare discussions" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Physician entrepreneurs share experiences" },
    { name: "sidehustle", subscribers: "1.2M+", why: "Doctors seeking supplementary income" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Healthcare practice owners" },
  ]},
  { slug: "real-estate-agents", name: "Real Estate Agents", subs: [
    { name: "realestate", subscribers: "800K+", why: "Direct real estate audience" },
    { name: "RealEstateInvesting", subscribers: "600K+", why: "Investors who use agent services" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Real estate as a business" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Agent-entrepreneurs share journeys" },
    { name: "sidehustle", subscribers: "1.2M+", why: "Part-time real estate income" },
  ]},
  { slug: "recruiters", name: "Recruiters", subs: [
    { name: "recruiting", subscribers: "200K+", why: "Direct recruiter audience" },
    { name: "jobs", subscribers: "300K+", why: "Job seekers who use recruiter services" },
    { name: "humanresources", subscribers: "300K+", why: "HR overlap with recruiting" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Recruiter-founders building products" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Businesses needing hiring tools" },
  ]},
  { slug: "project-managers", name: "Project Managers", subs: [
    { name: "projectmanagement", subscribers: "500K+", why: "Direct PM audience" },
    { name: "PMP", subscribers: "100K+", why: "Certified PMPs discussing tools" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Businesses needing PM tools" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "PM-founders building products" },
    { name: "SaaS", subscribers: "200K+", why: "Project management SaaS discussions" },
  ]},
  { slug: "data-analysts", name: "Data Analysts", subs: [
    { name: "dataanalysis", subscribers: "200K+", why: "Direct data analyst audience" },
    { name: "datascience", subscribers: "1.5M+", why: "Broader data community" },
    { name: "SQL", subscribers: "400K+", why: "Data professionals seeking tools" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Analysts building data products" },
    { name: "SaaS", subscribers: "200K+", why: "Data SaaS discussions" },
  ]},
  { slug: "customer-success", name: "Customer Success Managers", subs: [
    { name: "CustomerSuccess", subscribers: "50K+", why: "Direct CS professional audience" },
    { name: "SaaS", subscribers: "200K+", why: "CS is a SaaS-specific role" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Businesses needing CS tools" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "CS professionals building products" },
    { name: "startups", subscribers: "1.3M+", why: "CS in startup environments" },
  ]},
  { slug: "operations-managers", name: "Operations Managers", subs: [
    { name: "operations", subscribers: "100K+", why: "Direct ops professional audience" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Businesses needing ops tools" },
    { name: "supplychain", subscribers: "200K+", why: "Operations overlap with logistics" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Ops professionals building products" },
    { name: "SaaS", subscribers: "200K+", why: "Ops SaaS discussions" },
  ]},
  { slug: "executive-assistants", name: "Executive Assistants", subs: [
    { name: "administrative", subscribers: "50K+", why: "Direct EA/admin audience" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Businesses needing admin tools" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "EAs building productivity products" },
    { name: "sidehustle", subscribers: "1.2M+", why: "EAs seeking flexible income" },
    { name: "productivity", subscribers: "600K+", why: "Productivity tool discussions" },
  ]},
  { slug: "virtual-assistants", name: "Virtual Assistants", subs: [
    { name: "virtualassistants", subscribers: "30K+", why: "Direct VA community" },
    { name: "freelance", subscribers: "400K+", why: "Freelancers including VAs" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Businesses hiring VAs" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "VAs transitioning to founders" },
    { name: "sidehustle", subscribers: "1.2M+", why: "VA work as a side income" },
  ]},
  { slug: "photographers", name: "Photographers", subs: [
    { name: "photography", subscribers: "4.5M+", why: "Direct photographer audience" },
    { name: "photographers", subscribers: "200K+", why: "Professional photographer community" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Photographer-entrepreneurs" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Photo studio owners" },
    { name: "sidehustle", subscribers: "1.2M+", why: "Photography as side income" },
  ]},
  { slug: "writers", name: "Writers", subs: [
    { name: "writing", subscribers: "1.5M+", why: "Direct writer community" },
    { name: "freelance", subscribers: "400K+", why: "Freelance writers seeking tools" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Writer-entrepreneurs building products" },
    { name: "copywriting", subscribers: "150K+", why: "Copywriters seeking income diversification" },
    { name: "selfpublish", subscribers: "200K+", why: "Self-published writers" },
  ]},
  { slug: "trainers", name: "Trainers", subs: [
    { name: "training", subscribers: "100K+", why: "Direct trainer community" },
    { name: "instructionaldesign", subscribers: "100K+", why: "Instructional designers and trainers" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Businesses needing training tools" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Trainer-entrepreneurs building products" },
    { name: "sidehustle", subscribers: "1.2M+", why: "Training as side income" },
  ]},
  { slug: "supply-chain", name: "Supply Chain Managers", subs: [
    { name: "supplychain", subscribers: "200K+", why: "Direct supply chain audience" },
    { name: "logistics", subscribers: "300K+", why: "Logistics professionals seeking tools" },
    { name: "smallbusiness", subscribers: "2.5M+", why: "Businesses needing supply chain tools" },
    { name: "Entrepreneur", subscribers: "2.1M+", why: "Supply chain professionals building products" },
    { name: "SaaS", subscribers: "200K+", why: "Supply chain SaaS discussions" },
  ]},
];

function generateReddit(p: ProfReddit): RedditStrategy {
  const profLower = p.name.toLowerCase();
  return {
    slug: `reddit-for-${p.slug}`,
    profession: p.name,
    metaTitle: `Reddit Strategy for ${p.name}: Build an Audience Without Looking Like a Marketer (2026)`,
    metaDescription: `How ${profLower} can use Reddit to build an audience for their side business — best subreddits, posting strategy, content ideas, and mistakes to avoid.`,
    h1: `Reddit Strategy for ${p.name}: Build an Audience Without Looking Like a Marketer`,
    intro: `Reddit is one of the best traffic sources for ${profLower} building side businesses. But it's also the easiest place to get banned. This guide covers the exact subreddits, posting patterns, and content strategies that work for ${profLower} — without triggering spam filters or community backlash.`,
    bestSubreddits: p.subs,
    postingStrategy: `The 80/20 rule is non-negotiable on Reddit. For every promotional post, share 4 value-first contributions. For ${profLower}, this means sharing industry insights, answering questions, and providing free resources before ever mentioning your product. Comment first, post second. Build karma in the community for 2-4 weeks before sharing any links. When you do share, frame it as "I built this because I couldn't find X" — not "check out my product."`,
    contentIdeas: [
      `Share a detailed breakdown of a workflow problem you solved as a ${profLower.replace(/s$/, "")}`,
      "Post a case study showing real revenue numbers from your side business",
      `Create a comparison guide: "Tools I tested for [problem] and what actually worked"`,
      "Answer questions in daily/weekly help threads consistently for 30 days",
      `Share a free template or checklist that ${profLower} can use immediately`,
      "Write a post-mortem: 'What I learned in my first 90 days building a side business'",
      `Host an AMA: "I'm a ${profLower.replace(/s$/, "")} who built a profitable side business. Ask me anything."`,
      "Share data: survey results, benchmarks, or industry analysis you've collected",
    ],
    commonMistakes: [
      "Posting promotional links in the first 30 days of your account",
      "Cross-posting the same content to 5 subreddits simultaneously",
      "Using a username that includes your product or company name",
      "Arguing with moderators when your post gets removed",
      "Sharing only your own content — Reddit's algorithms penalize self-promotion ratios above 10%",
    ],
    faqs: [
      {
        question: `How often should ${profLower} post on Reddit?`,
        answer: "Aim for 3-5 quality contributions per week across your target subreddits. Consistency builds recognition. One excellent post outperforms ten mediocre ones.",
      },
      {
        question: "Can I link to my product in Reddit posts?",
        answer: "Only after establishing credibility (200+ karma in the subreddit, 30+ days active). Even then, link in comments when asked, not in the main post. Use 'I wrote about this' framing, not 'Buy my product.'",
      },
      {
        question: "What's the best time to post on Reddit?",
        answer: "Tuesday through Thursday, 9-11 AM EST, catches the morning browsing wave. Avoid weekends — engagement drops 40%+. Check each subreddit's 'top posts this week' to find peak activity patterns.",
      },
    ],
  };
}

export const redditStrategies: RedditStrategy[] = profRedditData.map(generateReddit);
