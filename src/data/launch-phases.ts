import type { LaunchPhase } from "@/types/fym";

export const LAUNCH_PHASES: LaunchPhase[] = [
  {
    id: "validate",
    name: "Validate",
    tagline: "The 48-Hour Gut Check",
    description:
      "Before you build anything, prove that real people will pay for this. Skip this step and you'll waste months building something nobody wants.",
    sortOrder: 1,
    completionCopy:
      "Validated. You just did more market research than 90% of first-time founders. You know there's demand. Now let's scope what to build.",
    tasks: [
      {
        id: "validate-01",
        phaseId: "validate",
        title: "Write your one-sentence pitch",
        description:
          "Describe what you sell, who you sell it to, and why they'd pay. If you can't say it in one sentence, you don't understand it yet.",
        estimatedMinutes: 15,
        tip: "Use the format: I help [WHO] do [WHAT] so they can [RESULT].",
        sortOrder: 1,
      },
      {
        id: "validate-02",
        phaseId: "validate",
        title: "Find 10 potential customers online",
        description:
          "Search Reddit, LinkedIn groups, Twitter, or niche forums for people actively complaining about the problem you solve.",
        estimatedMinutes: 45,
        tip: "Search '[your niche] is broken' or 'I wish there was a...' on Reddit.",
        sortOrder: 2,
      },
      {
        id: "validate-03",
        phaseId: "validate",
        title: "DM or email 5 of them",
        description:
          "Ask if they'd pay for a solution. Don't pitch -- ask. 'If something existed that [solved X], would you pay $Y/month?'",
        estimatedMinutes: 30,
        tip: "You need 3 out of 5 to say yes. If not, pivot the idea.",
        sortOrder: 3,
      },
      {
        id: "validate-04",
        phaseId: "validate",
        title: "Research 3 competitors",
        description:
          "Find who else solves this problem. No competitors = no market. Many competitors = proven demand.",
        estimatedMinutes: 30,
        tip: "If competitors exist and are making money, that's a GOOD sign.",
        sortOrder: 4,
      },
      {
        id: "validate-05",
        phaseId: "validate",
        title: "Define your unfair advantage",
        description:
          "What do you know from your corporate career that outsiders don't? Your managing director experience IS your moat.",
        estimatedMinutes: 20,
        tip: "Your corporate network, domain knowledge, and process expertise are worth more than code.",
        sortOrder: 5,
      },
    ],
  },
  {
    id: "scope",
    name: "Scope",
    tagline: "The Ruthless MVP",
    description:
      "Define the absolute minimum you need to build to charge money. If your MVP takes more than 2 weeks, you're overbuilding.",
    sortOrder: 2,
    completionCopy:
      "Scoped and priced. You've got a plan that's tight enough to execute in your spare time. Most people never get this far.",
    tasks: [
      {
        id: "scope-01",
        phaseId: "scope",
        title: "List every feature you think you need",
        description:
          "Brain dump everything. Get it all out of your head.",
        estimatedMinutes: 20,
        tip: "Write freely. We're going to cut 80% of this list next.",
        sortOrder: 1,
      },
      {
        id: "scope-02",
        phaseId: "scope",
        title: "Cross out everything except the core",
        description:
          "What's the ONE thing that delivers the core value? Cut everything else. Ruthlessly.",
        estimatedMinutes: 15,
        tip: "Ask: 'Would someone pay for JUST this one feature?' If yes, that's your MVP.",
        sortOrder: 2,
      },
      {
        id: "scope-03",
        phaseId: "scope",
        title: "Choose your build path",
        description:
          "No-code (Bubble, Webflow, Notion), low-code (Airtable + Zapier), or code. Pick the fastest path to revenue.",
        estimatedMinutes: 15,
        tip: "No-code is almost always the right first choice. You can rebuild later.",
        sortOrder: 3,
      },
      {
        id: "scope-04",
        phaseId: "scope",
        title: "Set your price before you build",
        description:
          "Name your price now. Not 'free trial.' Not 'I'll figure it out later.' A number.",
        estimatedMinutes: 10,
        tip: "Start at $29-99/month for B2B services. You can always adjust.",
        sortOrder: 4,
      },
      {
        id: "scope-05",
        phaseId: "scope",
        title: "Create a 2-week build timeline",
        description:
          "Break your MVP into daily tasks. If it takes longer than 14 days, cut more features.",
        estimatedMinutes: 20,
        tip: "Block 1-2 hours per day from your schedule. Protect this time like a meeting with your CEO.",
        sortOrder: 5,
      },
    ],
  },
  {
    id: "build",
    name: "Build",
    tagline: "Ship Ugly, Ship Fast",
    description:
      "Build your MVP. It doesn't need to be pretty. It needs to work well enough for someone to pay you.",
    sortOrder: 3,
    completionCopy:
      "Built. You have a working product. It's ugly and it's yours. You're already ahead of 95% of people who 'have an idea.'",
    tasks: [
      {
        id: "build-01",
        phaseId: "build",
        title: "Set up your build environment",
        description:
          "Create accounts for your chosen tools. No-code: sign up for Bubble/Webflow. Code: init your repo.",
        estimatedMinutes: 30,
        tip: "Use free tiers for everything. Don't spend money until customers do.",
        sortOrder: 1,
      },
      {
        id: "build-02",
        phaseId: "build",
        title: "Build the core feature",
        description:
          "The ONE thing from your scope. Nothing else. Resist the urge to add 'just one more thing.'",
        estimatedMinutes: 0,
        tip: "Set a timer. If you're stuck on something for 30 minutes, find a workaround.",
        sortOrder: 2,
      },
      {
        id: "build-03",
        phaseId: "build",
        title: "Add basic auth / user management",
        description:
          "People need to log in. Use Supabase Auth, Clerk, or your platform's built-in auth.",
        estimatedMinutes: 45,
        tip: "Magic links (email login) are the fastest to implement and users love them.",
        sortOrder: 3,
      },
      {
        id: "build-04",
        phaseId: "build",
        title: "Test with one real person",
        description:
          "Not your spouse. Not your friend. Someone who represents your target customer.",
        estimatedMinutes: 30,
        tip: "Watch them use it over a screen share. Don't explain anything -- observe where they get stuck.",
        sortOrder: 4,
      },
      {
        id: "build-05",
        phaseId: "build",
        title: "Fix the 3 biggest issues from testing",
        description:
          "You'll find bugs and confusion. Fix the top 3 only. Ship imperfect.",
        estimatedMinutes: 60,
        tip: "Perfect is the enemy of revenue. Ship when it works, not when it's polished.",
        sortOrder: 5,
      },
    ],
  },
  {
    id: "landing",
    name: "Landing Page",
    tagline: "Your 24/7 Sales Rep",
    description:
      "Create a landing page that converts visitors into customers. This is your storefront -- it needs to sell while you sleep.",
    sortOrder: 4,
    completionCopy:
      "Live on the internet. You now have a professional online presence that works while you're in your day job meetings. The invisible empire grows.",
    tasks: [
      {
        id: "landing-01",
        phaseId: "landing",
        title: "Write your headline and subheadline",
        description:
          "The headline states the outcome. The subheadline explains how. No jargon.",
        estimatedMinutes: 20,
        tip: "Formula: [Outcome they want] without [thing they hate]. Example: 'Automate your reporting without learning to code.'",
        sortOrder: 1,
      },
      {
        id: "landing-02",
        phaseId: "landing",
        title: "Create 3 benefit sections",
        description:
          "Not features. Benefits. 'Save 10 hours per week' beats 'Automated dashboard generation.'",
        estimatedMinutes: 30,
        tip: "Each benefit should answer the question: 'So what? Why should I care?'",
        sortOrder: 2,
      },
      {
        id: "landing-03",
        phaseId: "landing",
        title: "Add social proof or credibility",
        description:
          "Testimonials, company logos you've worked with, results from beta testers, or your professional background.",
        estimatedMinutes: 20,
        tip: "No testimonials yet? Use your corporate credentials: '15 years as Managing Director in [industry].'",
        sortOrder: 3,
      },
      {
        id: "landing-04",
        phaseId: "landing",
        title: "Build the page",
        description:
          "Use Carrd ($19/yr), Framer, or your existing site. One page, one CTA, one conversion goal.",
        estimatedMinutes: 60,
        tip: "Carrd is the fastest. You can have a professional landing page live in under an hour.",
        sortOrder: 4,
      },
      {
        id: "landing-05",
        phaseId: "landing",
        title: "Set up analytics",
        description:
          "Install Plausible or PostHog (privacy-friendly). You need to know where visitors drop off.",
        estimatedMinutes: 15,
        tip: "At minimum, track: page views, CTA clicks, and conversion rate.",
        sortOrder: 5,
      },
    ],
  },
  {
    id: "payments",
    name: "Payments",
    tagline: "Get Paid or Go Home",
    description:
      "Set up payment processing so customers can give you money. This is where 'side project' becomes 'business.'",
    sortOrder: 5,
    completionCopy:
      "Payment-ready. You can now accept money from strangers on the internet. Read that again. You built this while keeping your day job.",
    tasks: [
      {
        id: "payments-01",
        phaseId: "payments",
        title: "Create a Stripe account",
        description:
          "Use your LLC (not personal name) for the business. Connect your business bank account.",
        estimatedMinutes: 20,
        tip: "Use your LLC details from the Invisibility Score setup. Keep your personal name off everything.",
        sortOrder: 1,
      },
      {
        id: "payments-02",
        phaseId: "payments",
        title: "Set up your pricing in Stripe",
        description:
          "Create your product, set the price you decided in Phase 2. Monthly recurring preferred.",
        estimatedMinutes: 15,
        tip: "Start with one plan. Add tiers later when you understand what customers value.",
        sortOrder: 2,
      },
      {
        id: "payments-03",
        phaseId: "payments",
        title: "Integrate checkout into your product",
        description:
          "Stripe Checkout is the fastest. One link, hosted by Stripe, works everywhere.",
        estimatedMinutes: 30,
        tip: "Stripe Payment Links require ZERO code. Create one in the Stripe dashboard and paste it on your landing page.",
        sortOrder: 3,
      },
      {
        id: "payments-04",
        phaseId: "payments",
        title: "Test the full purchase flow",
        description:
          "Use Stripe test mode. Go through the entire flow: landing page -> checkout -> access.",
        estimatedMinutes: 15,
        tip: "Test on mobile too. Over 50% of purchases happen on phones.",
        sortOrder: 4,
      },
      {
        id: "payments-05",
        phaseId: "payments",
        title: "Set up invoice and receipt emails",
        description:
          "Stripe handles this automatically, but verify they're sending from your business name, not your personal email.",
        estimatedMinutes: 10,
        tip: "Check the email templates in Stripe Settings > Emails. Brand them with your business name.",
        sortOrder: 5,
      },
    ],
  },
  {
    id: "launch",
    name: "Launch",
    tagline: "Tell the World, Quietly",
    description:
      "Time to get your first customers. Not a massive Product Hunt launch -- a quiet, targeted push to the people who need this most.",
    sortOrder: 6,
    completionCopy:
      "Launched. Your product is in the hands of real people. Every notification is potential revenue. The invisible exit just became very real.",
    tasks: [
      {
        id: "launch-01",
        phaseId: "launch",
        title: "Write 3 launch messages",
        description:
          "One for LinkedIn DMs (professional), one for email (personal), one for communities (helpful, not salesy).",
        estimatedMinutes: 30,
        tip: "Lead with the problem, not the product. 'I noticed you struggle with X. I built something that helps...'",
        sortOrder: 1,
      },
      {
        id: "launch-02",
        phaseId: "launch",
        title: "Send to your 5 validated contacts",
        description:
          "Remember the people from Phase 1 who said they'd pay? Time to follow up.",
        estimatedMinutes: 20,
        tip: "These are warm leads. They already told you they want this. Make it easy for them to say yes.",
        sortOrder: 2,
      },
      {
        id: "launch-03",
        phaseId: "launch",
        title: "Post in 3 relevant communities",
        description:
          "Reddit, Slack groups, Discord servers, LinkedIn groups. Be helpful first, promotional second.",
        estimatedMinutes: 30,
        tip: "Share your story, not your product. 'I was frustrated with X, so I built Y. Here's what I learned...'",
        sortOrder: 3,
      },
      {
        id: "launch-04",
        phaseId: "launch",
        title: "Set up a simple referral incentive",
        description:
          "Offer first customers 1 free month for every referral. Word of mouth is your best invisible marketing.",
        estimatedMinutes: 15,
        tip: "A personal 'thank you' email with a referral link is more effective than any automated system.",
        sortOrder: 4,
      },
      {
        id: "launch-05",
        phaseId: "launch",
        title: "Create a 30-day content plan",
        description:
          "Plan 2-3 posts per week on LinkedIn or Twitter. Share insights from your industry, not sales pitches.",
        estimatedMinutes: 30,
        tip: "Content = trust = customers. Nobody buys from someone they don't trust.",
        sortOrder: 5,
      },
    ],
  },
  {
    id: "customers",
    name: "First Customers",
    tagline: "From Zero to Proof of Life",
    description:
      "Convert interest into paying customers. This phase isn't over until you've hit Freedom Level 1: a stranger pays you real money.",
    sortOrder: 7,
    completionCopy:
      "PROOF OF LIFE. A real stranger paid you real money for something you built. Your side business is no longer a dream -- it's a revenue-generating business. Welcome to Freedom Level 1.",
    tasks: [
      {
        id: "customers-01",
        phaseId: "customers",
        title: "Follow up with every lead",
        description:
          "Nobody buys on the first touch. Send a follow-up 3 days after your initial outreach. Then again 7 days later.",
        estimatedMinutes: 20,
        tip: "80% of sales happen after the 5th contact. Most people give up after 1.",
        sortOrder: 1,
      },
      {
        id: "customers-02",
        phaseId: "customers",
        title: "Offer a founding member deal",
        description:
          "First 10 customers get a locked-in lower rate. Creates urgency and rewards early adopters.",
        estimatedMinutes: 10,
        tip: "'Founding member: $X/month locked for life' is incredibly compelling.",
        sortOrder: 2,
      },
      {
        id: "customers-03",
        phaseId: "customers",
        title: "Do a live demo or walkthrough",
        description:
          "Offer 15-minute screen shares. High-touch, but converts like crazy for B2B.",
        estimatedMinutes: 0,
        tip: "Schedule these during your lunch break or after hours. Invisible, remember?",
        sortOrder: 3,
      },
      {
        id: "customers-04",
        phaseId: "customers",
        title: "Collect your first testimonial",
        description:
          "As soon as someone says anything positive, ask: 'Mind if I quote you on that?'",
        estimatedMinutes: 5,
        tip: "Screenshots of Slack messages or emails work just as well as formal testimonials.",
        sortOrder: 4,
      },
      {
        id: "customers-05",
        phaseId: "customers",
        title: "Track and celebrate your first dollar",
        description:
          "Log your first payment in the FYM Calculator. This is Freedom Level 1: Proof of Life.",
        estimatedMinutes: 5,
        tip: "Go update your Calculator tab right now. Watch your freedom level change.",
        sortOrder: 5,
      },
    ],
  },
  {
    id: "optimize",
    name: "Optimize",
    tagline: "Build the Machine",
    description:
      "Turn your first customers into a growth engine. Systematize, automate, and prepare to scale -- all while your boss thinks you're just focused on Q3 targets.",
    sortOrder: 8,
    completionCopy:
      "Optimized. You're not just earning side income -- you're building a machine. Every week it gets a little more automatic, a little more profitable, and a little closer to the day you hand in your resignation.",
    tasks: [
      {
        id: "optimize-01",
        phaseId: "optimize",
        title: "Analyze your conversion funnel",
        description:
          "Where are people dropping off? Landing page? Checkout? Onboarding? Fix the biggest leak first.",
        estimatedMinutes: 30,
        tip: "Check your analytics from Phase 4. If landing page conversion is under 3%, rewrite the headline.",
        sortOrder: 1,
      },
      {
        id: "optimize-02",
        phaseId: "optimize",
        title: "Automate one manual process",
        description:
          "What are you doing manually that could be automated? Email sequences, onboarding, invoicing?",
        estimatedMinutes: 45,
        tip: "Zapier + your existing tools can automate almost anything without code.",
        sortOrder: 2,
      },
      {
        id: "optimize-03",
        phaseId: "optimize",
        title: "Set up a feedback loop",
        description:
          "Create a simple way for customers to tell you what they need. A Typeform survey or even a reply-to email.",
        estimatedMinutes: 15,
        tip: "Ask: 'What's the one thing that would make this 10x more valuable to you?'",
        sortOrder: 3,
      },
      {
        id: "optimize-04",
        phaseId: "optimize",
        title: "Plan your next price increase",
        description:
          "Your first price was a guess. After 10+ customers, you have data. Raise prices for new customers.",
        estimatedMinutes: 15,
        tip: "Grandfather existing customers at their current rate. Raise prices 20-50% for new signups.",
        sortOrder: 4,
      },
      {
        id: "optimize-05",
        phaseId: "optimize",
        title: "Update your FYM Dashboard",
        description:
          "Log your current revenue. Check your freedom level. Set your next milestone.",
        estimatedMinutes: 10,
        tip: "Head to the Calculator tab and update your numbers. Watch the Exit Timeline shift.",
        sortOrder: 5,
      },
      {
        id: "optimize-06",
        phaseId: "optimize",
        title: "Set a recurring weekly review",
        description:
          "Every Sunday, 30 minutes: check revenue, respond to customers, plan next week's tasks.",
        estimatedMinutes: 15,
        tip: "Consistency beats intensity. 30 minutes every week beats 8-hour weekend sprints.",
        sortOrder: 6,
      },
    ],
  },
];

export const TOTAL_TASKS = LAUNCH_PHASES.reduce(
  (sum, phase) => sum + phase.tasks.length,
  0
);

export const ENCOURAGEMENT_MESSAGES = [
  "Done. Keep moving.",
  "Checked off. Momentum is everything.",
  "One step closer to freedom.",
  "That's how exits are built -- one task at a time.",
  "Progress. Your future self will thank you.",
  "Another brick in the wall of your invisible empire.",
  "Your day job doesn't know what's coming.",
  "Keep this pace and you'll surprise yourself.",
];
