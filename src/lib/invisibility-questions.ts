import type { InvisibilityQuestion } from "@/types/fym";

export const INVISIBILITY_QUESTIONS: InvisibilityQuestion[] = [
  // Category 1: Entity Separation (Max 20 points)
  {
    id: "entity_1",
    category: "entity",
    categoryLabel: "Entity Separation",
    text: "Is your side business registered as a separate legal entity (LLC, Ltd, etc.)?",
    hint: "A separate entity creates a legal wall between you and your business. Without one, your personal name appears on every contract and invoice.",
    yesScore: 5,
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
    hint: "If your LLC is called 'John Smith Consulting LLC', anyone who Googles it finds you instantly. Use a brand name instead.",
    yesScore: 4,
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
    hint: "Without WHOIS privacy, anyone can look up your domain and see your full name, email, and home address in a public database.",
    yesScore: 3,
    fixTitle: "Enable WHOIS privacy on all domains",
    fixDescription:
      "Most registrars offer free WHOIS privacy. Enable it immediately on every domain you own. Takes 2 minutes.",
    priority: "Medium",
  },
  {
    id: "entity_4",
    category: "entity",
    categoryLabel: "Entity Separation",
    text: "Did you use a registered agent service so your home address is NOT listed on public LLC filings?",
    hint: "LLC filings are public records. Without a registered agent, your home address is searchable on your state's business registry website.",
    yesScore: 3,
    fixTitle: "Get a registered agent",
    fixDescription:
      "Services like Northwest Registered Agent or LegalZoom cost $100-150/year and keep your home address off public filings.",
    priority: "High",
  },
  {
    id: "entity_5",
    category: "entity",
    categoryLabel: "Entity Separation",
    text: "Is your business mailing address a PO Box or virtual mailbox — not your home address?",
    hint: "Customers, vendors, and payment processors may need a mailing address. Using your home address ties your identity to the business.",
    yesScore: 3,
    fixTitle: "Set up a virtual mailbox or PO Box",
    fixDescription:
      "Services like iPostal1 or a USPS PO Box ($20-50/month) give you a business address that isn't your home. Use it everywhere.",
    priority: "Medium",
  },
  {
    id: "entity_6",
    category: "entity",
    categoryLabel: "Entity Separation",
    text: "Does your business have its own phone number that isn't your personal cell?",
    hint: "If a customer or vendor calls your personal number, caller ID apps can reveal your real name. A separate number prevents this.",
    yesScore: 2,
    fixTitle: "Get a separate business phone number",
    fixDescription:
      "Google Voice is free, or use OpenPhone/Grasshopper ($15-30/month). Never give out your personal cell for business.",
    priority: "Low",
  },

  // Category 2: Digital Footprint (Max 20 points)
  {
    id: "digital_1",
    category: "digital",
    categoryLabel: "Digital Footprint",
    text: "Do you use a completely separate email address (not your personal or work email) for all business communications?",
    hint: "Your personal Gmail or work email can be cross-referenced with social profiles, leaking your identity to anyone you email.",
    yesScore: 4,
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
    hint: "When customers pay you, their bank statement shows the account holder's name. If it says your personal name, you're exposed.",
    yesScore: 4,
    fixTitle: "Open a business bank account",
    fixDescription:
      "Open an account under your LLC. Mercury, Relay, or a local credit union. Keeps personal and business finances separate.",
    priority: "High",
  },
  {
    id: "digital_3",
    category: "digital",
    categoryLabel: "Digital Footprint",
    text: 'Have you searched your real name + your business name on Google and found zero connections?',
    hint: "Your employer or colleagues could Google you at any time. If your side business shows up alongside your name, your cover is blown.",
    yesScore: 3,
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
    hint: "Browsers track cookies across sites. If you're logged into personal accounts in the same browser, ad networks and trackers can link your identities.",
    yesScore: 2,
    fixTitle: "Set up a separate browser profile",
    fixDescription:
      "Create a dedicated Chrome/Firefox profile for business. Use a VPN. Never cross-login between personal and business profiles.",
    priority: "Low",
  },
  {
    id: "digital_5",
    category: "digital",
    categoryLabel: "Digital Footprint",
    text: "Are all your business social media accounts logged into from a separate browser or device — never your personal ones?",
    hint: "Platforms like Instagram and Twitter suggest 'People You May Know' based on device and login patterns. Logging in from the same device links your accounts.",
    yesScore: 3,
    fixTitle: "Separate business social media logins",
    fixDescription:
      "Use a dedicated browser profile or device for business social accounts. Never log into both personal and business accounts on the same browser.",
    priority: "Medium",
  },
  {
    id: "digital_6",
    category: "digital",
    categoryLabel: "Digital Footprint",
    text: "Have you checked that your business domain's DNS records don't expose personal email or hosting tied to your name?",
    hint: "MX records, TXT records, and nameservers are public. If your domain points to hosting registered under your real name, it creates a traceable link.",
    yesScore: 2,
    fixTitle: "Audit your DNS records",
    fixDescription:
      "Run your domain through a DNS lookup tool (e.g., MXToolbox). Ensure no records reveal personal email addresses or hosting accounts in your name.",
    priority: "Low",
  },
  {
    id: "digital_7",
    category: "digital",
    categoryLabel: "Digital Footprint",
    text: "Do you use a separate phone number for any business 2FA or SMS verifications?",
    hint: "If you use your personal cell for business 2FA, a data breach or SIM swap could expose both your personal and business identities at once.",
    yesScore: 2,
    fixTitle: "Use a separate number for business 2FA",
    fixDescription:
      "Use Google Voice or a prepaid SIM for business-related 2FA and verifications. Keep it completely separate from your personal phone number.",
    priority: "Low",
  },

  // Category 3: Compliance Safety (Max 25 points)
  {
    id: "compliance_1",
    category: "compliance",
    categoryLabel: "Compliance Safety",
    text: "Have you reviewed your employment contract's non-compete and IP assignment clauses?",
    hint: "Many contracts include clauses that give your employer ownership of anything you build — even on your own time. You need to know exactly what yours says.",
    yesScore: 5,
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
    hint: "If your employer is a fintech company and your side business is also fintech, you could face non-compete lawsuits — even if you're not directly competing.",
    yesScore: 5,
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
    hint: "Using your company laptop or office Wi-Fi — even once — could give your employer a legal claim over your side project under most IP assignment clauses.",
    yesScore: 3,
    fixTitle: "Separate work and side-business devices",
    fixDescription:
      "Never use company laptop, phone, or Wi-Fi for your side business. Use personal devices only. Work on personal time only.",
    priority: "High",
  },
  {
    id: "compliance_4",
    category: "compliance",
    categoryLabel: "Compliance Safety",
    text: "Have you checked whether your state/country requires you to disclose outside business activities to your employer?",
    hint: "Some jurisdictions and industries (e.g., finance, government) legally require disclosure of side businesses. Not disclosing when required can result in termination.",
    yesScore: 4,
    fixTitle: "Research disclosure requirements",
    fixDescription:
      "Check your local employment laws and industry regulations. If disclosure is mandatory, consult a lawyer about how to comply without exposing yourself unnecessarily.",
    priority: "High",
  },
  {
    id: "compliance_5",
    category: "compliance",
    categoryLabel: "Compliance Safety",
    text: "Are you confident your side business does NOT use any proprietary knowledge, trade secrets, or internal data from your employer?",
    hint: "Even subconsciously applying internal strategies, pricing data, or customer insights from your day job could be grounds for a trade-secrets lawsuit.",
    yesScore: 5,
    fixTitle: "Establish a clean-room separation",
    fixDescription:
      "Document that your side business ideas, strategies, and data come from public sources only. Keep notes showing independent origin of your work.",
    priority: "High",
  },
  {
    id: "compliance_6",
    category: "compliance",
    categoryLabel: "Compliance Safety",
    text: "Do you avoid working on your side business during work hours — including lunch breaks at the office?",
    hint: "Even if you use personal devices, working during paid hours (or on company premises) can void your ownership claim and give your employer legal leverage.",
    yesScore: 3,
    fixTitle: "Strictly separate work hours",
    fixDescription:
      "Set a hard rule: no side-business work before clocking out. Avoid even checking business emails or Slack during work hours. Keep time logs if possible.",
    priority: "Medium",
  },

  // Category 4: Operational Security (Max 20 points)
  {
    id: "operational_1",
    category: "operational",
    categoryLabel: "Operational Security",
    text: "Have you told zero colleagues at work about your side business?",
    hint: "Even your most trusted work friend can accidentally mention it. One offhand comment in a meeting or Slack channel can reach your manager within hours.",
    yesScore: 4,
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
    hint: "Reverse image search (Google Images, PimEyes) can match a business headshot to your LinkedIn profile in seconds. A colleague could stumble on it.",
    yesScore: 3,
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
    hint: "LinkedIn is the first place employers and recruiters check. Even a 'like' on a related post can show up in your network's feed.",
    yesScore: 3,
    fixTitle: "Keep business off professional profiles",
    fixDescription:
      "Never mention your side business on LinkedIn, your company Slack, or any platform where colleagues can see. Use anonymous accounts for business promotion.",
    priority: "High",
  },
  {
    id: "operational_4",
    category: "operational",
    categoryLabel: "Operational Security",
    text: "Have you set all personal social media accounts to private, or removed anything that links to your business?",
    hint: "A public Instagram with a link to your business in the bio, or a tweet mentioning your product, creates a direct trail from your real identity.",
    yesScore: 3,
    fixTitle: "Lock down personal social media",
    fixDescription:
      "Set personal accounts to private. Remove any business links from bios, posts, or highlights. Search your own name to see what's publicly visible.",
    priority: "Medium",
  },
  {
    id: "operational_5",
    category: "operational",
    categoryLabel: "Operational Security",
    text: "Do you use a pseudonym or brand name (not your real name) for all customer-facing communication?",
    hint: "If customers know you as 'Alex from BrandName' instead of your real name, even a disgruntled customer can't easily connect you to your employer.",
    yesScore: 4,
    fixTitle: "Adopt a pseudonym for business",
    fixDescription:
      "Use a first-name-only alias or brand persona for customer support, emails, and public-facing content. Keep your legal name off customer touchpoints.",
    priority: "Medium",
  },
  {
    id: "operational_6",
    category: "operational",
    categoryLabel: "Operational Security",
    text: "Have you checked that your side business doesn't appear in any public directory that also lists your real name?",
    hint: "Business directories, app stores, Chrome Web Store listings, and marketplace profiles sometimes auto-populate your legal name from your account.",
    yesScore: 3,
    fixTitle: "Audit public directory listings",
    fixDescription:
      "Search for your business on Google, Product Hunt, app stores, and business directories. If your real name appears anywhere, update or request removal.",
    priority: "Medium",
  },

  // Category 5: Financial Separation (Max 15 points)
  {
    id: "financial_1",
    category: "financial",
    categoryLabel: "Financial Separation",
    text: "Do you have a separate bank account exclusively for business income and expenses?",
    hint: "Mixing personal and business funds in one account makes it easy for an auditor or legal dispute to surface your side business during tax reviews.",
    yesScore: 4,
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
    hint: "Improperly reported side income can trigger an audit, which creates a paper trail your employer's HR team could potentially discover.",
    yesScore: 3,
    fixTitle: "Consult a tax advisor",
    fixDescription:
      "A CPA can help you set up proper tax reporting for your LLC. Cost: $200-500 for initial consultation. Prevents issues during tax season.",
    priority: "Medium",
  },
  {
    id: "financial_3",
    category: "financial",
    categoryLabel: "Financial Separation",
    text: "Is your Stripe, PayPal, or payment processor registered under your LLC — not your personal name?",
    hint: "Payment processor accounts often display the business name on customer receipts and bank statements. Your personal name showing up blows your cover.",
    yesScore: 3,
    fixTitle: "Register payment processors under your LLC",
    fixDescription:
      "Update your Stripe/PayPal/Square business profile to use your LLC name, not your personal name. Check what appears on customer statements.",
    priority: "High",
  },
  {
    id: "financial_4",
    category: "financial",
    categoryLabel: "Financial Separation",
    text: "Do you pay yourself from the business account to your personal account via a proper transfer (not mixing funds directly)?",
    hint: "Proper owner draws or salary payments create clean records. Directly spending business funds from a personal card blurs the legal separation.",
    yesScore: 3,
    fixTitle: "Set up proper owner draws",
    fixDescription:
      "Transfer a fixed amount from your business account to your personal account monthly. Label it as an owner's draw. This maintains clean financial separation.",
    priority: "Medium",
  },
  {
    id: "financial_5",
    category: "financial",
    categoryLabel: "Financial Separation",
    text: "Are all business expenses (domains, tools, hosting) paid from the business account — not your personal card?",
    hint: "If you pay for business tools with your personal credit card, those charges show up on statements that could be seen during a background check or dispute.",
    yesScore: 2,
    fixTitle: "Move all business expenses to the business account",
    fixDescription:
      "Get a business debit or credit card. Update billing for all business services (hosting, domains, SaaS tools) to use it. Stop using personal cards for business.",
    priority: "Low",
  },
];

export const CATEGORIES = [
  { key: "entity" as const, label: "Entity Separation", maxScore: 20 },
  { key: "digital" as const, label: "Digital Footprint", maxScore: 20 },
  { key: "compliance" as const, label: "Compliance Safety", maxScore: 25 },
  { key: "operational" as const, label: "Operational Security", maxScore: 20 },
  { key: "financial" as const, label: "Financial Separation", maxScore: 15 },
];
