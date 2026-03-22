import type { PlaybookMission } from "@/types/stealth";

export const PLAYBOOK_MISSIONS: PlaybookMission[] = [
  {
    id: "mission_1",
    title: "Ghost LLC Setup",
    description:
      "Form a privacy-first LLC where your name never appears on public records. This is the foundation of your invisible business.",
    difficulty: "Beginner",
    estimated_time: "2-3 hours + 3-7 days processing",
    category: "Entity Setup",
    tools_needed: [
      "Northwest Registered Agent or similar service",
      "IRS.gov (for EIN)",
      "State Secretary of State website",
    ],
    cost_estimate: "$100–$500",
    steps: [
      {
        id: "mission_1_step_1",
        title: "Choose Your Privacy State",
        description:
          "Research Wyoming, New Mexico, and Delaware. Wyoming is the top choice: no state income tax, strong privacy protections, and your name never appears on public filings. New Mexico is cheapest ($50 filing, no annual report). Delaware is best if you plan to raise funding.",
        estimated_time: "30 minutes",
        tip: "Wyoming is the gold standard for anonymous LLCs. Unless you have a specific reason for another state, start here.",
      },
      {
        id: "mission_1_step_2",
        title: "Select a Brand Name",
        description:
          "Choose a business name with absolutely zero connection to your personal name, your employer, or your employer's industry. Check availability on the state's Secretary of State website. Avoid anything clever that a colleague might recognize.",
        estimated_time: "30 minutes",
        tip: "Think generic but professional: 'Apex Digital Solutions LLC' not 'JohnSmithApps LLC'. Search the name on Google to ensure it's not already associated with anything.",
      },
      {
        id: "mission_1_step_3",
        title: "Hire a Registered Agent",
        description:
          "A registered agent's name and address appear on your public LLC filing instead of yours. This is the single most important privacy step. Sign up with Northwest Registered Agent ($125/yr), Wyoming Agents ($50/yr for WY), or Incfile (free first year with formation).",
        estimated_time: "15 minutes",
        tools: ["Northwest Registered Agent", "Wyoming Agents", "Incfile"],
        cost: "$50–$150/year",
      },
      {
        id: "mission_1_step_4",
        title: "File Formation Documents",
        description:
          "File your Articles of Organization through your registered agent service. They'll handle the paperwork and ensure your personal name stays off public records. Most services offer online filing with 1-3 day processing.",
        estimated_time: "15 minutes + 1-7 days processing",
        cost: "$50–$300 (state filing fee)",
      },
      {
        id: "mission_1_step_5",
        title: "Obtain Your EIN",
        description:
          "Apply for an Employer Identification Number at irs.gov. It's free and takes 5 minutes online. You need this for bank accounts and payment processors. The EIN application requires your SSN but this information is NOT public.",
        estimated_time: "10 minutes",
        tools: ["IRS.gov EIN Application"],
        cost: "Free",
        tip: "Apply online Monday-Friday during business hours for instant processing. The EIN is issued immediately.",
      },
      {
        id: "mission_1_step_6",
        title: "Set Up Virtual Business Address",
        description:
          "Get a virtual mailbox or PO Box as your official business address. Never use your home address for any business purpose. iPostal1, Anytime Mailbox, or a USPS PO Box all work.",
        estimated_time: "20 minutes",
        tools: ["iPostal1", "Anytime Mailbox", "USPS"],
        cost: "$10–$50/month",
      },
    ],
  },
  {
    id: "mission_2",
    title: "Digital Shadow Cleanup",
    description:
      "Audit and scrub your digital footprint so your side business cannot be traced back to your personal identity through online records.",
    difficulty: "Intermediate",
    estimated_time: "3-4 hours",
    category: "Digital Identity",
    tools_needed: [
      "Google Search",
      "WHOIS lookup tools",
      "Data broker removal services",
      "VPN service",
    ],
    cost_estimate: "$0–$200",
    steps: [
      {
        id: "mission_2_step_1",
        title: "Google Yourself + Business Name",
        description:
          "Search your real name combined with your business name, your LLC name, your product name, and your business domain. Check the first 5 pages of results. Screenshot anything that connects your identity to your business.",
        estimated_time: "30 minutes",
        tip: "Also try Google Images with your photo and reverse image search with PimEyes or TinEye.",
      },
      {
        id: "mission_2_step_2",
        title: "Remove Data Broker Listings",
        description:
          "Data brokers like Spokeo, WhitePages, BeenVerified, and Intelius aggregate your personal data and make it searchable. Request removal from each. Consider using DeleteMe ($129/yr) or Privacy Duck to automate this.",
        estimated_time: "1 hour (or 10 minutes with DeleteMe)",
        tools: ["DeleteMe", "Privacy Duck", "Manual removal forms"],
        cost: "$0 (manual) or $129/yr (automated)",
      },
      {
        id: "mission_2_step_3",
        title: "Enable WHOIS Privacy on All Domains",
        description:
          "Check every domain you own using a WHOIS lookup tool. If your name, email, or home address is visible, enable WHOIS privacy immediately through your registrar. Most registrars offer this for free.",
        estimated_time: "15 minutes",
        tools: ["WHOIS lookup (who.is)", "Domain registrar dashboard"],
        cost: "Free (most registrars)",
      },
      {
        id: "mission_2_step_4",
        title: "Create Business-Only Email",
        description:
          "Set up a dedicated email address on your business domain (hello@yourbusiness.com) or a fresh Gmail. Never use your personal email or work email for any business activity.",
        estimated_time: "15 minutes",
        tools: ["Google Workspace", "Zoho Mail (free)", "Proton Mail"],
        cost: "$0–$6/month",
      },
      {
        id: "mission_2_step_5",
        title: "Separate Browser Profiles",
        description:
          "Create a dedicated Chrome or Firefox profile for all business activity. Never log into personal accounts from your business profile. This prevents cross-site tracking, cookie sharing, and 'People You May Know' suggestions.",
        estimated_time: "10 minutes",
        tip: "Use different profile pictures and names for each browser profile so you never accidentally switch.",
      },
      {
        id: "mission_2_step_6",
        title: "Set Up a VPN for Business Activity",
        description:
          "Use a VPN whenever working on your side business. This prevents your ISP from logging business-related activity and adds a layer of IP-based privacy. Mullvad, ProtonVPN, or NordVPN are solid choices.",
        estimated_time: "15 minutes",
        tools: ["Mullvad VPN", "ProtonVPN", "NordVPN"],
        cost: "$5–$12/month",
      },
      {
        id: "mission_2_step_7",
        title: "Audit DNS Records",
        description:
          "Run your business domain through MXToolbox or DNSChecker. Check that MX records, TXT records, and nameservers don't reveal personal email addresses or hosting accounts registered under your real name.",
        estimated_time: "15 minutes",
        tools: ["MXToolbox", "DNSChecker.org"],
        cost: "Free",
      },
    ],
  },
  {
    id: "mission_3",
    title: "Phantom Bank Account",
    description:
      "Set up a completely separate financial infrastructure for your side business. No co-mingling of personal and business funds.",
    difficulty: "Beginner",
    estimated_time: "1-2 hours",
    category: "Financial Separation",
    tools_needed: [
      "Business bank (Mercury, Relay, or credit union)",
      "Stripe or PayPal Business",
      "Accounting software",
    ],
    cost_estimate: "$0–$50/month",
    steps: [
      {
        id: "mission_3_step_1",
        title: "Research Business-Friendly Banks",
        description:
          "Mercury and Relay are the top choices for online business banking — free accounts, no minimum balance, and easy to set up with just an EIN and Articles of Organization. Local credit unions are also great.",
        estimated_time: "20 minutes",
        tools: ["Mercury", "Relay", "Local credit union"],
        cost: "Free (most business checking accounts)",
      },
      {
        id: "mission_3_step_2",
        title: "Open the Business Account",
        description:
          "Apply online with your EIN, Articles of Organization, and Operating Agreement. Your personal name will be on the bank account (legally required) but this is NOT public information. Only you and the bank see it.",
        estimated_time: "20 minutes",
        tip: "Mercury can approve you in under 24 hours. Have your formation documents ready to upload.",
      },
      {
        id: "mission_3_step_3",
        title: "Set Up Payment Processor Under LLC",
        description:
          "Register Stripe and/or PayPal under your LLC name. This is critical — when customers pay you, their bank statement will show your LLC name, not your personal name. Connect to your business bank account.",
        estimated_time: "30 minutes",
        tools: ["Stripe", "PayPal Business"],
        cost: "Processing fees only (2.9% + $0.30 standard)",
      },
      {
        id: "mission_3_step_4",
        title: "Configure Invoicing Under LLC",
        description:
          "Set up your invoicing system (Stripe Invoicing, FreshBooks, or Wave) under your LLC name and business address. All invoices should show your LLC name, business email, and virtual address — never personal details.",
        estimated_time: "15 minutes",
        tools: ["Stripe Invoicing", "FreshBooks", "Wave (free)"],
        cost: "$0–$15/month",
      },
      {
        id: "mission_3_step_5",
        title: "Establish the No-Co-Mingling Rule",
        description:
          "Set a hard rule: ALL business income goes into the business account. ALL business expenses come from the business account. Pay yourself via monthly owner's draw to your personal account. Never use a personal card for business purchases.",
        estimated_time: "10 minutes",
        tip: "Get a business debit card and update billing for all business services immediately.",
      },
    ],
  },
  {
    id: "mission_4",
    title: "Secure Comms Protocol",
    description:
      "Set up a complete communication system for your side business that is entirely separate from your personal and work communications.",
    difficulty: "Intermediate",
    estimated_time: "2-3 hours",
    category: "Communication",
    tools_needed: [
      "Business email provider",
      "Google Voice or OpenPhone",
      "Encrypted messaging app",
      "Video conferencing tool",
    ],
    cost_estimate: "$0–$30/month",
    steps: [
      {
        id: "mission_4_step_1",
        title: "Set Up Business Email on Custom Domain",
        description:
          "Create a professional email address on your business domain (you@yourbusiness.com). Use Google Workspace ($6/mo), Zoho Mail (free for 1 user), or Proton Mail for extra privacy. Never use your personal or work email.",
        estimated_time: "30 minutes",
        tools: ["Google Workspace", "Zoho Mail", "Proton Mail"],
        cost: "$0–$6/month",
      },
      {
        id: "mission_4_step_2",
        title: "Get a Separate Business Phone Number",
        description:
          "Set up Google Voice (free), OpenPhone ($15/mo), or Hushed for a dedicated business number. Use this for all customer calls, 2FA verifications, and business sign-ups. Never give out your personal cell.",
        estimated_time: "15 minutes",
        tools: ["Google Voice (free)", "OpenPhone", "Hushed"],
        cost: "$0–$15/month",
      },
      {
        id: "mission_4_step_3",
        title: "Configure Encrypted Messaging",
        description:
          "For sensitive conversations with contractors or partners, use Signal or WhatsApp Business (registered to your business number). Set up disappearing messages for extra security.",
        estimated_time: "15 minutes",
        tools: ["Signal", "WhatsApp Business"],
        cost: "Free",
      },
      {
        id: "mission_4_step_4",
        title: "Set Up Virtual Meetings with Business Persona",
        description:
          "Create a Zoom or Google Meet account under your business email. Set your display name to your business alias (e.g., 'Alex from BrandName'). Use a professional but non-personal profile photo or logo.",
        estimated_time: "15 minutes",
        tools: ["Zoom", "Google Meet"],
        cost: "Free (basic) or $13/month (pro)",
      },
      {
        id: "mission_4_step_5",
        title: "Create a Dedicated Browser Profile",
        description:
          "Set up a separate Chrome/Firefox profile exclusively for business. Log into all business accounts from this profile only. Use a different profile picture and bookmark bar to avoid accidentally mixing profiles.",
        estimated_time: "10 minutes",
        tip: "Pin this browser profile to your taskbar with a distinct icon for quick access during after-hours sessions.",
      },
      {
        id: "mission_4_step_6",
        title: "Build Your Business Email Signature",
        description:
          "Create a professional email signature using only your LLC name, business role (e.g., 'Founder'), business email, and business phone. Never include your personal name, LinkedIn, or any personally identifiable information.",
        estimated_time: "10 minutes",
        tip: "Use a first name or alias only: 'Alex | [Brand Name] | hello@brand.com'",
      },
    ],
  },
  {
    id: "mission_5",
    title: "Contractor Firewall",
    description:
      "Build airtight processes for hiring and managing contractors so they never learn your real identity or connect your side business to your day job.",
    difficulty: "Advanced",
    estimated_time: "4-6 hours",
    category: "Operational Security",
    tools_needed: [
      "Project management tool",
      "Contract templates (from Legal Templates)",
      "Payment system under LLC",
    ],
    cost_estimate: "$0–$50/month",
    steps: [
      {
        id: "mission_5_step_1",
        title: "Create Contractor Onboarding Document",
        description:
          "Write a welcome doc that introduces your company (LLC), explains the project, and sets expectations — all without revealing your personal identity. Use your business alias and LLC name throughout.",
        estimated_time: "1 hour",
        tip: "Frame yourself as 'the founder' or use a first-name alias. Contractors don't need your last name or personal details.",
      },
      {
        id: "mission_5_step_2",
        title: "Set Up NDA Workflow",
        description:
          "Before sharing any project details, have every contractor sign a One-Way NDA (see Legal Templates). Use DocuSign, HelloSign, or PandaDoc under your LLC account for digital signatures.",
        estimated_time: "30 minutes",
        tools: ["DocuSign", "HelloSign", "PandaDoc"],
        cost: "$0–$25/month",
      },
      {
        id: "mission_5_step_3",
        title: "Configure Project Management Under LLC",
        description:
          "Set up a project management tool (Notion, Linear, Asana, or Trello) under your business email. Invite contractors using their email. All project communications go through this tool — not personal channels.",
        estimated_time: "30 minutes",
        tools: ["Notion", "Linear", "Asana", "Trello"],
        cost: "Free (basic plans)",
      },
      {
        id: "mission_5_step_4",
        title: "Establish LLC-Only Payment Pipeline",
        description:
          "Pay all contractors from your business bank account via Wise, PayPal Business, or direct bank transfer. Never use personal Venmo, Zelle, or your personal bank. Contractors should only see your LLC name on payments.",
        estimated_time: "20 minutes",
        tools: ["Wise", "PayPal Business", "Business bank transfer"],
        cost: "Transfer fees only",
      },
      {
        id: "mission_5_step_5",
        title: "Create Contractor Agreement Template",
        description:
          "Customize the Independent Contractor Agreement from Legal Templates. Include IP assignment, confidentiality, and non-disclosure of owner identity clauses. Have every contractor sign before starting work.",
        estimated_time: "30 minutes",
      },
      {
        id: "mission_5_step_6",
        title: "Build an Offboarding Checklist",
        description:
          "When a contractor engagement ends: revoke all tool access, remove from project management, confirm return/deletion of confidential materials, send final payment, and archive the signed agreements.",
        estimated_time: "20 minutes",
        tip: "Keep a spreadsheet of all contractor access (tools, repos, accounts) so you can revoke everything quickly.",
      },
    ],
  },
  {
    id: "mission_6",
    title: "Tax Invisibility Shield",
    description:
      "Set up your tax infrastructure so your side business income is properly reported without creating paper trails that could alert your employer.",
    difficulty: "Advanced",
    estimated_time: "3-5 hours + CPA consultation",
    category: "Financial Separation",
    tools_needed: [
      "Accounting software",
      "CPA/Tax advisor",
      "IRS Direct Pay or EFTPS",
    ],
    cost_estimate: "$200–$800 (CPA) + software",
    steps: [
      {
        id: "mission_6_step_1",
        title: "Understand Pass-Through Taxation",
        description:
          "As a single-member LLC, your business income 'passes through' to your personal tax return on Schedule C. The LLC itself doesn't file a separate return (unless you elect S-Corp status). This means your employer CANNOT see your LLC's tax filings — they only see your W-2.",
        estimated_time: "30 minutes",
        tip: "The key insight: your employer only sees your W-2. They never see your Schedule C, Schedule SE, or any LLC-related tax forms.",
      },
      {
        id: "mission_6_step_2",
        title: "Set Up Quarterly Estimated Payments",
        description:
          "Once your side business earns more than $1,000/year in profit, you must make quarterly estimated tax payments. Use IRS Direct Pay (irs.gov/payments) or EFTPS. Pay from your business bank account.",
        estimated_time: "30 minutes",
        tools: ["IRS Direct Pay", "EFTPS"],
        cost: "Your estimated tax amount",
      },
      {
        id: "mission_6_step_3",
        title: "Track All Deductible Expenses",
        description:
          "Every business expense reduces your taxable income. Track: hosting, domains, software subscriptions, contractor payments, advertising, phone/internet (business portion), home office (if applicable). Keep receipts for everything.",
        estimated_time: "1 hour (initial setup)",
        tip: "Set up a dedicated folder in Google Drive or Dropbox for receipts. Snap photos of physical receipts immediately.",
      },
      {
        id: "mission_6_step_4",
        title: "Set Up Accounting Software",
        description:
          "Use Wave (free), QuickBooks Self-Employed ($15/mo), or FreshBooks ($17/mo) to track income and expenses. Connect to your business bank account for automatic transaction import. Categorize everything monthly.",
        estimated_time: "1 hour",
        tools: ["Wave (free)", "QuickBooks", "FreshBooks"],
        cost: "$0–$17/month",
      },
      {
        id: "mission_6_step_5",
        title: "Find a CPA Who Understands Side Businesses",
        description:
          "Find a CPA who works with small business owners and freelancers. They'll help you maximize deductions, set up proper quarterly payments, and ensure your filing doesn't create any red flags. Ask specifically about single-member LLC taxation.",
        estimated_time: "1-2 hours (research + initial consultation)",
        cost: "$200–$500 (initial consultation)",
        tip: "Ask the CPA: 'Can my employer see any of my LLC's tax information through their HR or benefits systems?' The answer should be no.",
      },
    ],
  },
  {
    id: "mission_7",
    title: "Domain & Hosting Lockdown",
    description:
      "Register domains and set up hosting in a way that creates zero traceable links back to your personal identity.",
    difficulty: "Beginner",
    estimated_time: "1-2 hours",
    category: "Digital Identity",
    tools_needed: [
      "Privacy-first domain registrar",
      "Cloudflare",
      "Hosting provider",
    ],
    cost_estimate: "$10–$30/month",
    steps: [
      {
        id: "mission_7_step_1",
        title: "Register Domains Through Privacy-First Registrar",
        description:
          "Use Cloudflare Registrar (at-cost pricing, automatic WHOIS privacy), Namecheap (free WHOIS privacy), or Porkbun. Register using your business email and virtual address. Never use your personal email or home address.",
        estimated_time: "15 minutes",
        tools: ["Cloudflare Registrar", "Namecheap", "Porkbun"],
        cost: "$8–$15/year per domain",
      },
      {
        id: "mission_7_step_2",
        title: "Set Up Cloudflare for DNS",
        description:
          "Route your domain through Cloudflare (free plan). This hides your origin server IP, provides DDoS protection, and adds a layer between your hosting and the public. Point your domain's nameservers to Cloudflare.",
        estimated_time: "20 minutes",
        tools: ["Cloudflare (free plan)"],
        cost: "Free",
      },
      {
        id: "mission_7_step_3",
        title: "Choose Anonymous-Friendly Hosting",
        description:
          "Use Vercel, Netlify, Railway, or Render — they don't require personal identification beyond an email. Sign up with your business email. For more control, use DigitalOcean or Linode with your LLC details.",
        estimated_time: "20 minutes",
        tools: ["Vercel", "Netlify", "Railway", "DigitalOcean"],
        cost: "$0–$20/month",
      },
      {
        id: "mission_7_step_4",
        title: "Configure SSL/HTTPS",
        description:
          "Ensure every domain has SSL enabled. Cloudflare provides free SSL. If hosting directly, use Let's Encrypt (free, automatic). SSL encrypts traffic and prevents ISP-level snooping of your business content.",
        estimated_time: "10 minutes",
        cost: "Free",
      },
      {
        id: "mission_7_step_5",
        title: "Set Up Business Email Forwarding",
        description:
          "Configure email forwarding on your domain so emails to hello@yourbusiness.com forward to your business Gmail/Zoho inbox. Use Cloudflare Email Routing (free) or your registrar's forwarding feature.",
        estimated_time: "15 minutes",
        tools: ["Cloudflare Email Routing", "Registrar forwarding"],
        cost: "Free",
      },
    ],
  },
  {
    id: "mission_8",
    title: "Social Media Alias Protocol",
    description:
      "Create and maintain social media accounts for your business that cannot be linked to your personal profiles through platform algorithms or public information.",
    difficulty: "Intermediate",
    estimated_time: "2-3 hours",
    category: "Digital Identity",
    tools_needed: [
      "Dedicated browser profile",
      "Business email",
      "Social media scheduling tool",
    ],
    cost_estimate: "$0–$20/month",
    steps: [
      {
        id: "mission_8_step_1",
        title: "Create Business-Only Social Accounts",
        description:
          "Create new accounts on relevant platforms (Twitter/X, Instagram, LinkedIn Page, Reddit, etc.) using your business email and business phone number. Use your brand name and logo — never your face or real name.",
        estimated_time: "30 minutes",
        tip: "Create a LinkedIn Company Page (not a personal profile) for your business. Company pages don't require linking to a personal profile's network.",
      },
      {
        id: "mission_8_step_2",
        title: "Enforce Device and Profile Separation",
        description:
          "Log into business social accounts ONLY from your dedicated business browser profile. Never log into personal and business accounts on the same browser, device, or app instance. Platform algorithms will link them.",
        estimated_time: "15 minutes",
      },
      {
        id: "mission_8_step_3",
        title: "Set Up Scheduling Tools",
        description:
          "Use Buffer (free for 3 channels), Hootsuite, or Typefully to schedule posts from your business accounts. This prevents you from needing to log in manually and reduces the risk of accidentally posting from the wrong account.",
        estimated_time: "30 minutes",
        tools: ["Buffer (free)", "Hootsuite", "Typefully"],
        cost: "$0–$20/month",
      },
      {
        id: "mission_8_step_4",
        title: "Establish a Distinct Brand Voice",
        description:
          "Develop a writing style for your business that is noticeably different from your personal social media voice. If you're formal on LinkedIn, be casual on your business accounts (or vice versa). Consistency in difference matters.",
        estimated_time: "30 minutes",
        tip: "A colleague reading your business posts should not think 'this sounds like [you].' Vary your vocabulary, tone, and posting style.",
      },
      {
        id: "mission_8_step_5",
        title: "Audit Connection Graphs",
        description:
          "Check that your business accounts don't follow or interact with your personal accounts. Don't follow colleagues from your business accounts. Regularly check 'People You May Know' suggestions to ensure no crossover.",
        estimated_time: "20 minutes",
      },
    ],
  },
  {
    id: "mission_9",
    title: "Client Intake Stealth Mode",
    description:
      "Build a client acquisition and onboarding process where every touchpoint is through your LLC, never your personal identity.",
    difficulty: "Intermediate",
    estimated_time: "3-4 hours",
    category: "Operational Security",
    tools_needed: [
      "Form builder",
      "Business phone",
      "Virtual office (optional)",
      "Contract signing tool",
    ],
    cost_estimate: "$0–$100/month",
    steps: [
      {
        id: "mission_9_step_1",
        title: "Build Client Intake Form Under LLC Brand",
        description:
          "Create a professional intake form using Tally (free), Typeform, or Google Forms under your business email. The form should collect client details without revealing yours. Brand it with your LLC name and logo.",
        estimated_time: "30 minutes",
        tools: ["Tally (free)", "Typeform", "Google Forms"],
        cost: "Free–$25/month",
      },
      {
        id: "mission_9_step_2",
        title: "Route All Calls Through Business Number",
        description:
          "Set up your Google Voice or OpenPhone number as the only contact number clients ever see. Set business hours so calls don't come during your day job. Use voicemail with a professional LLC-branded greeting.",
        estimated_time: "20 minutes",
      },
      {
        id: "mission_9_step_3",
        title: "Set Up Virtual Office for Meetings",
        description:
          "If you need to meet clients, use your Zoom/Meet account under your business email. For in-person meetings (rare), consider a coworking space day pass or virtual office that provides meeting rooms on demand.",
        estimated_time: "30 minutes",
        tools: ["Zoom (business account)", "WeWork On Demand", "Regus"],
        cost: "$0 (virtual) or $30-100 (coworking day pass)",
      },
      {
        id: "mission_9_step_4",
        title: "Create LLC-Branded Proposals",
        description:
          "Build proposal templates in Google Docs or Notion using your LLC letterhead, brand colors, and business contact information. Sign proposals as '[First Name], Founder at [LLC Name]' — never your full legal name.",
        estimated_time: "45 minutes",
      },
      {
        id: "mission_9_step_5",
        title: "Set Up Contract Signing via LLC",
        description:
          "Use DocuSign, HelloSign, or PandaDoc under your business account. All contracts should list your LLC as the contracting party. The signature block should read '[LLC Name], LLC' with your alias as the authorized signer.",
        estimated_time: "30 minutes",
        tools: ["DocuSign", "HelloSign", "PandaDoc"],
        cost: "$0–$25/month",
      },
      {
        id: "mission_9_step_6",
        title: "Ensure Payment Only to LLC Accounts",
        description:
          "All client payments must go to your LLC's Stripe, PayPal Business, or business bank account. Include payment instructions in your proposals and contracts. The client should only ever see your LLC name on invoices and receipts.",
        estimated_time: "15 minutes",
      },
    ],
  },
  {
    id: "mission_10",
    title: "Emergency Exposure Protocol",
    description:
      "Prepare a response plan for the worst-case scenario: your employer discovers your side business. Know your rights, have your evidence ready, and stay calm.",
    difficulty: "Advanced",
    estimated_time: "3-4 hours",
    category: "Operational Security",
    tools_needed: [
      "Employment attorney contact",
      "Your employment contract",
      "Invention Assignment Disclaimer (from Legal Templates)",
    ],
    cost_estimate: "$0–$500 (attorney consultation)",
    steps: [
      {
        id: "mission_10_step_1",
        title: "Prepare Your Response Framework",
        description:
          "Write a calm, factual response for if your employer confronts you. Key points: (1) the business operates in a different industry, (2) you use zero company resources, (3) all work is done on personal time and equipment, (4) the business is owned by an LLC, not you personally.",
        estimated_time: "45 minutes",
        tip: "Never volunteer information. Answer only what is asked. Stay calm and professional. Do not apologize — you've done nothing wrong if you've followed the playbook.",
      },
      {
        id: "mission_10_step_2",
        title: "Know Your Legal Rights",
        description:
          "Research your state's laws on moonlighting and non-compete enforcement. Key facts: California bans non-competes entirely. Many states limit them severely. Even in strict states, a side business in a different industry is rarely enforceable. Document your research.",
        estimated_time: "1 hour",
      },
      {
        id: "mission_10_step_3",
        title: "Compile Your Evidence Trail",
        description:
          "Gather and organize: (1) Your Invention Assignment Disclaimer (with dates), (2) Git commit timestamps showing after-hours work, (3) Receipts proving personal device and tool purchases, (4) Time logs showing all work on personal time, (5) Your LLC formation date and documents.",
        estimated_time: "1 hour",
        tip: "Store this evidence package outside your work devices and network — personal cloud storage, encrypted USB, or your attorney's office.",
      },
      {
        id: "mission_10_step_4",
        title: "Have an Attorney on Speed Dial",
        description:
          "Identify an employment attorney in your state who handles non-compete and IP disputes. Have an initial consultation ($200-500) to review your specific situation BEFORE any issue arises. Keep their contact information readily accessible.",
        estimated_time: "1 hour",
        cost: "$200–$500 (initial consultation)",
      },
      {
        id: "mission_10_step_5",
        title: "Understand Non-Compete Enforceability",
        description:
          "Research how non-competes are enforced in your state. Key factors: (1) Duration — courts rarely enforce beyond 1-2 years, (2) Geographic scope — must be reasonable, (3) Industry scope — must be specific, (4) Consideration — you must have received something in exchange. Many non-competes are unenforceable.",
        estimated_time: "30 minutes",
        tip: "The FTC has proposed banning most non-competes nationwide. Check the current status of this regulation at ftc.gov.",
      },
    ],
  },
];
