import type { InvisibilityQuestion } from "@/types/fym";

export const INVISIBILITY_QUESTIONS: InvisibilityQuestion[] = [
  // Category 1: Entity Separation (Max 20 points)
  {
    id: "entity_1",
    category: "entity",
    categoryLabel: "Entity Separation",
    text: "Is your side business registered as a separate legal entity (LLC, Ltd, etc.)?",
    yesScore: 7,
    fixTitle: "Register a separate LLC",
    fixDescription:
      "Cost: $50-500 depending on state. Timeline: 1-3 days. This is the single most important step for invisibility.",
    priority: "High",
  },
  {
    id: "entity_2",
    category: "entity",
    categoryLabel: "Entity Separation",
    text: "Is the entity registered under a name that has zero connection to your personal name?",
    yesScore: 7,
    fixTitle: "Use a non-personal business name",
    fixDescription:
      "Register your LLC under a brand name, not your personal name. Use a registered agent service for extra privacy.",
    priority: "High",
  },
  {
    id: "entity_3",
    category: "entity",
    categoryLabel: "Entity Separation",
    text: "Do you have WHOIS privacy enabled on all domains?",
    yesScore: 6,
    fixTitle: "Enable WHOIS privacy on all domains",
    fixDescription:
      "Most registrars offer free WHOIS privacy. Enable it immediately on every domain you own. Takes 2 minutes.",
    priority: "Medium",
  },
  // Category 2: Digital Footprint (Max 20 points)
  {
    id: "digital_1",
    category: "digital",
    categoryLabel: "Digital Footprint",
    text: "Do you use a completely separate email address (not your personal or work email) for all business communications?",
    yesScore: 5,
    fixTitle: "Create a dedicated business email",
    fixDescription:
      "Set up a business email using your domain (e.g., hello@yourbusiness.com) or a new Gmail. Never use your work email.",
    priority: "High",
  },
  {
    id: "digital_2",
    category: "digital",
    categoryLabel: "Digital Footprint",
    text: "Is your business bank account / payment processor under the business entity (not your personal name)?",
    yesScore: 5,
    fixTitle: "Open a business bank account",
    fixDescription:
      "Open an account under your LLC. Mercury, Relay, or a local credit union. Keeps personal and business finances separate.",
    priority: "High",
  },
  {
    id: "digital_3",
    category: "digital",
    categoryLabel: "Digital Footprint",
    text: "Have you searched your real name + your business name on Google and found zero connections?",
    yesScore: 5,
    fixTitle: "Audit your digital footprint",
    fixDescription:
      'Google "[your name] + [business name]" and fix any connections. Remove social posts, update profiles, request takedowns if needed.',
    priority: "Medium",
  },
  {
    id: "digital_4",
    category: "digital",
    categoryLabel: "Digital Footprint",
    text: "Do you use a VPN or separate browser profile when working on your side business?",
    yesScore: 5,
    fixTitle: "Set up a separate browser profile",
    fixDescription:
      "Create a dedicated Chrome/Firefox profile for business. Use a VPN. Never cross-login between personal and business profiles.",
    priority: "Low",
  },
  // Category 3: Compliance Safety (Max 25 points)
  {
    id: "compliance_1",
    category: "compliance",
    categoryLabel: "Compliance Safety",
    text: "Have you reviewed your employment contract's non-compete and IP assignment clauses?",
    yesScore: 8,
    fixTitle: "Review your employment contract",
    fixDescription:
      "Read your contract's non-compete, IP assignment, and moonlighting clauses carefully. Consider consulting an employment lawyer if unclear.",
    priority: "High",
  },
  {
    id: "compliance_2",
    category: "compliance",
    categoryLabel: "Compliance Safety",
    text: "Does your side business operate in a completely different industry/domain than your employer?",
    yesScore: 9,
    fixTitle: "Ensure industry separation",
    fixDescription:
      "Your side business should not compete with or relate to your employer's business. Choose a different industry or niche to minimize legal risk.",
    priority: "High",
  },
  {
    id: "compliance_3",
    category: "compliance",
    categoryLabel: "Compliance Safety",
    text: "Do you ONLY work on your side business using personal devices, personal internet, and personal time?",
    yesScore: 8,
    fixTitle: "Separate work and side-business devices",
    fixDescription:
      "Never use company laptop, phone, or Wi-Fi for your side business. Use personal devices only. Work on personal time only.",
    priority: "High",
  },
  // Category 4: Operational Security (Max 20 points)
  {
    id: "operational_1",
    category: "operational",
    categoryLabel: "Operational Security",
    text: "Have you told zero colleagues at work about your side business?",
    yesScore: 7,
    fixTitle: "Maintain strict confidentiality",
    fixDescription:
      "Tell nobody at work. Not your closest colleague, not your work friend. One slip can travel fast in corporate environments.",
    priority: "High",
  },
  {
    id: "operational_2",
    category: "operational",
    categoryLabel: "Operational Security",
    text: "Is your side business brand/content free of any photos of your real face?",
    yesScore: 7,
    fixTitle: "Remove personal photos from business",
    fixDescription:
      "Use brand imagery, illustrations, or AI-generated avatars instead of your real face. Your business brand should not be traceable to you.",
    priority: "Medium",
  },
  {
    id: "operational_3",
    category: "operational",
    categoryLabel: "Operational Security",
    text: "Do you avoid posting about your side business on LinkedIn or any platform connected to your professional identity?",
    yesScore: 6,
    fixTitle: "Keep business off professional profiles",
    fixDescription:
      "Never mention your side business on LinkedIn, your company Slack, or any platform where colleagues can see. Use anonymous accounts for business promotion.",
    priority: "High",
  },
  // Category 5: Financial Separation (Max 15 points)
  {
    id: "financial_1",
    category: "financial",
    categoryLabel: "Financial Separation",
    text: "Do you have a separate bank account or payment processor for business income?",
    yesScore: 8,
    fixTitle: "Set up separate business finances",
    fixDescription:
      "Open a business checking account and connect Stripe/PayPal to it. Never commingle personal and business funds.",
    priority: "High",
  },
  {
    id: "financial_2",
    category: "financial",
    categoryLabel: "Financial Separation",
    text: "Have you consulted a tax advisor about how to report side income separately?",
    yesScore: 7,
    fixTitle: "Consult a tax advisor",
    fixDescription:
      "A CPA can help you set up proper tax reporting for your LLC. Cost: $200-500 for initial consultation. Prevents issues during tax season.",
    priority: "Medium",
  },
];

export const CATEGORIES = [
  { key: "entity" as const, label: "Entity Separation", maxScore: 20 },
  { key: "digital" as const, label: "Digital Footprint", maxScore: 20 },
  { key: "compliance" as const, label: "Compliance Safety", maxScore: 25 },
  { key: "operational" as const, label: "Operational Security", maxScore: 20 },
  { key: "financial" as const, label: "Financial Separation", maxScore: 15 },
];
