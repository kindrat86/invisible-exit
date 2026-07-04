/**
 * AI Tool × Profession cross-dimensional pSEO pages.
 * Pattern: /ideas/:profession/with/:tool
 * Generates pages like "Micro-SaaS Ideas for Accountants Using ChatGPT"
 *
 * Targets high-intent searches like:
 *   "side business ideas using chatgpt"
 *   "micro saas ideas with claude"
 *   "how to use cursor for side projects"
 */

export interface AiToolProfessionPage {
  slug: string; // e.g., "accountants-with-chatgpt"
  profession: string;
  professionSlug: string; // e.g., "for-accountants"
  tool: string;
  toolSlug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  ideas: {
    name: string;
    concept: string;
    howToUseTool: string;
    pricing: string;
    revenuePotential: string;
    difficulty: "Low" | "Medium" | "High";
  }[];
  workflow: string[];
  toolTips: string[];
  limitations: string;
  faqs: { question: string; answer: string }[];
}

const PROFESSIONS = [
  "Accountants", "Product Managers", "Software Engineers", "Marketers",
  "Consultants", "Designers", "Financial Analysts", "Sales Managers",
  "HR Managers", "Operations Managers",
];

const TOOLS = [
  { name: "ChatGPT", slug: "chatgpt", strength: "natural language generation, customer support automation, and rapid prototyping" },
  { name: "Claude", slug: "claude", strength: "long-form analysis, document processing, and nuanced reasoning over complex materials" },
  { name: "Cursor", slug: "cursor", strength: "AI-assisted code generation, refactoring, and rapid feature shipping" },
  { name: "Midjourney", slug: "midjourney", strength: "visual asset creation, marketing imagery, and brand design without a designer" },
  { name: "Zapier AI", slug: "zapier", strength: "workflow automation connecting 6,000+ apps without code" },
  { name: "Perplexity", slug: "perplexity", strength: "real-time research, competitor analysis, and market intelligence" },
  { name: "ElevenLabs", slug: "elevenlabs", strength: "voice synthesis for content creation, accessibility, and automated narration" },
  { name: "Vercel v0", slug: "v0", strength: "UI generation from text prompts — spin up landing pages and dashboards in minutes" },
];

function generateIdeas(profession: string, tool: string, toolStrength: string) {
  const baseIdeas = [
    {
      name: `${profession} Workflow Automation Tool`,
      concept: `A SaaS that automates the most repetitive ${profession.toLowerCase()} workflow using ${tool}'s ${toolStrength}.`,
      pricing: "$29-$79/month",
      revenuePotential: "$3K-$8K/month",
      difficulty: "Medium" as const,
    },
    {
      name: `${profession} AI Assistant`,
      concept: `A domain-specific chatbot trained on ${profession.toLowerCase()} knowledge that answers questions, drafts documents, and handles routine queries using ${tool}.`,
      pricing: "$19-$49/month",
      revenuePotential: "$2K-$6K/month",
      difficulty: "Low" as const,
    },
    {
      name: `${profession} Report Generator`,
      concept: `Tool that takes raw data or notes and generates professional ${profession.toLowerCase()} reports, summaries, and presentations powered by ${tool}.`,
      pricing: "$39-$99/month",
      revenuePotential: "$4K-$10K/month",
      difficulty: "Medium" as const,
    },
    {
      name: `${profession} Client Onboarding System`,
      concept: `Automated onboarding flow that uses ${tool} to generate personalized welcome materials, setup guides, and checklists for new ${profession.toLowerCase()} clients.`,
      pricing: "$25-$69/month",
      revenuePotential: "$2K-$5K/month",
      difficulty: "Low" as const,
    },
    {
      name: `${profession} Compliance Checker`,
      concept: `A tool that scans documents, configurations, or workflows for compliance issues using ${tool}'s ${toolStrength}, specific to ${profession.toLowerCase()} regulations.`,
      pricing: "$49-$149/month",
      revenuePotential: "$5K-$12K/month",
      difficulty: "High" as const,
    },
  ];

  return baseIdeas.map(idea => ({
    ...idea,
    howToUseTool: generateHowTo(tool, idea.name),
  }));
}

function generateHowTo(tool: string, ideaName: string): string {
  const templates: Record<string, string> = {
    "ChatGPT": `Use ChatGPT to generate the core logic prompts, create templated outputs, and build a prompt library that powers the tool's responses. Fine-tune with few-shot examples from your domain.`,
    "Claude": `Use Claude's 200K context window to process large documents, extract structured data, and generate detailed analysis. Claude excels at maintaining consistency across long outputs.`,
    "Cursor": `Use Cursor's AI code generation to build the frontend, API routes, and database schemas rapidly. Use Cmd+K to generate boilerplate and inline-edit for refinements.`,
    "Midjourney": `Generate template visuals, marketing assets, and UI mockups with Midjourney. Create a style guide prompt that ensures consistency across all generated imagery.`,
    "Zapier AI": `Build the automation backbone with Zapier. Use AI steps to transform data between apps, classify inputs, and generate personalized outputs without writing integration code.`,
    "Perplexity": `Use Perplexity for real-time market research, competitor monitoring, and sourcing up-to-date data that feeds into the tool's recommendations and alerts.`,
    "ElevenLabs": `Generate voice-overs for tutorial content, create audio versions of reports, and build accessibility features with natural-sounding AI narration.`,
    "Vercel v0": `Describe the UI in natural language and let v0 generate the React/Tailwind components. Iterate on the prompt until the design matches your vision, then export the code.`,
  };
  return templates[tool] || `Use ${tool} as the core engine, wrapping its capabilities behind a domain-specific interface.`;
}

function generateWorkflow(tool: string, toolStrength: string): string[] {
  return [
    `Identify the most painful, repetitive task in your target industry that ${tool}'s ${toolStrength} can address.`,
    `Build a prototype using ${tool} — a simple prompt chain, a Cursor-generated frontend, or a Zapier automation.`,
    `Test with 3-5 potential customers. Charge from day one, even if it's $9/month.`,
    `Productize: wrap the ${tool} workflow in a simple web interface using Cursor or v0.`,
    `Set up Stripe billing ($29/month minimum) and launch to your initial customers.`,
    `Distribute via Reddit, industry forums, and SEO content targeting your profession's pain points.`,
  ];
}

function generateToolTips(tool: string): string[] {
  const tips: Record<string, string[]> = {
    "ChatGPT": [
      "Build a prompt library with 10-20 domain-specific prompts that produce consistent outputs.",
      "Use structured outputs (JSON mode) to feed data into your app's backend reliably.",
      "Set temperature to 0.3 for factual tasks, 0.7 for creative tasks.",
    ],
    "Claude": [
      "Leverage Claude's long context to process entire documents, not just snippets.",
      "Use Claude's XML tagging system for structured prompts that produce reliable outputs.",
      "Claude is better than GPT-4 at following complex multi-step instructions.",
    ],
    "Cursor": [
      "Use Cmd+K for inline generation and Cmd+L for multi-file refactors.",
      "Reference existing files with @ to give the AI context about your codebase.",
      "Build the MVP in one weekend — Cursor can generate 80% of boilerplate code.",
    ],
    "Midjourney": [
      "Create a consistent style by reusing the same --style and --ar parameters.",
      "Save your best prompts in a Notion database for reuse.",
      "Upscale with Topaz or Magnific for production-quality assets.",
    ],
    "Zapier AI": [
      "Use Zapier's AI steps to classify, summarize, and transform data between apps.",
      "Start with a 2-step Zap (trigger + AI action) before adding complexity.",
      "Use Paths to handle different scenarios automatically.",
    ],
    "Perplexity": [
      "Use Perplexity Pro for API access to feed real-time data into your tool.",
      "Set up saved searches for competitor monitoring and trend detection.",
      "Use the Focus mode to get academic or industry-specific sources.",
    ],
    "ElevenLabs": [
      "Clone a consistent voice for your brand — one that sounds professional and trustworthy.",
      "Use the API for dynamic text-to-speech in your app.",
      "Generate audio versions of blog posts for podcast distribution.",
    ],
    "Vercel v0": [
      "Describe the complete page layout in one prompt — v0 handles responsive design automatically.",
      "Use the chat interface to iterate on specific sections without regenerating everything.",
      "Export the code and integrate with your existing React app via shadcn/ui components.",
    ],
  };
  return tips[tool] || [`Master ${tool}'s core features before building a product around them.`];
}

export const aiToolProfessionPages: AiToolProfessionPage[] = [];

for (const prof of PROFESSIONS) {
  const profSlug = "for-" + prof.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  for (const tool of TOOLS) {
    const slug = `${profSlug}-with-${tool.slug}`;
    const ideas = generateIdeas(prof, tool.name, tool.strength);
    aiToolProfessionPages.push({
      slug,
      profession: prof,
      professionSlug: profSlug,
      tool: tool.name,
      toolSlug: tool.slug,
      metaTitle: `Micro-SaaS Ideas for ${prof} Using ${tool.name} (2026)`,
      metaDescription: `5 profitable micro-SaaS ideas ${prof.toLowerCase()} can build with ${tool.name}. Real revenue potential, pricing models, and a step-by-step workflow for each.`,
      h1: `${prof} + ${tool.name}: 5 Micro-SaaS Ideas`,
      intro: `${prof} have a unfair advantage when building with ${tool.name}: they understand domain-specific pain points that ${tool.name}'s ${tool.strength} can solve. Here are 5 micro-SaaS ideas at that intersection — each with revenue potential, pricing, and exactly how to use the tool.`,
      ideas,
      workflow: generateWorkflow(tool.name, tool.strength),
      toolTips: generateToolTips(tool.name),
      limitations: `${tool.name} is powerful but not magic. It hallucinates occasionally, requires careful prompt engineering for production use, and you remain responsible for the accuracy of outputs. Always add human review for compliance-critical features. Budget $20-$200/month for API costs depending on volume.`,
      faqs: [
        {
          question: `Can I really build a profitable micro-SaaS as a ${prof.toLowerCase()} using ${tool.name}?`,
          answer: `Yes. ${prof} earn $70K-$200K/year and have deep domain expertise. ${tool.name} handles the technical execution. You handle the domain knowledge, customer relationships, and distribution. That combination is exactly what the market rewards — most AI tools fail because they're built by developers who don't understand the industry, not because the technology doesn't work.`,
        },
        {
          question: `How much does it cost to start?`,
          answer: `${tool.name} costs $20/month for the pro tier. Add a domain ($12/year), hosting on Vercel (free tier), and Stripe (free, takes 2.9% per transaction). Total startup cost: under $50. The first paying customer covers your tool subscription for a year.`,
        },
        {
          question: `How long until I have paying customers?`,
          answer: `Most ${prof.toLowerCase()} who follow the Invisible Exit framework get their first paying customer within 4-8 weeks. The bottleneck isn't building — ${tool.name} makes that fast. The bottleneck is finding the right customers and charging enough.`,
        },
        {
          question: `Is this safe to do while employed?`,
          answer: `Yes, if you follow the Stealth Ops framework. Build in an unrelated industry, use your own tools and time, operate through a separate LLC entity, and never use employer resources or compete with your employer. The Stealth Ops Hub includes a compliance audit for common contract clauses.`,
        },
      ],
    });
  }
}
