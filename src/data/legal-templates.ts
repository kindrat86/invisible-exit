import type { LegalTemplate } from "@/types/stealth";

export const LEGAL_TEMPLATES: LegalTemplate[] = [
  {
    id: "tpl_1",
    title: "Single-Member LLC Articles of Organization",
    description:
      "The foundational document to register your LLC with the state. This creates the legal wall between your personal identity and your side business.",
    category: "Entity Formation",
    risk_level: "High",
    estimated_cost: "$50–$500 (state filing fees vary)",
    time_to_complete: "1–3 business days",
    when_you_need_it:
      "Before you accept your first payment, sign any contract, or register a domain under a business name. This is step one.",
    template_content: `ARTICLES OF ORGANIZATION
OF
[YOUR LLC NAME], LLC

The undersigned, acting as organizer of a limited liability company under [STATE] law, adopts the following Articles of Organization:

ARTICLE I — NAME
The name of the limited liability company is: [YOUR LLC NAME], LLC

ARTICLE II — PURPOSE
The purpose of the Company is to engage in any lawful business activity for which a limited liability company may be organized under the laws of [STATE].

ARTICLE III — REGISTERED AGENT
The name and address of the Company's registered agent is:
Name: [REGISTERED AGENT NAME]
Address: [REGISTERED AGENT ADDRESS]

ARTICLE IV — MANAGEMENT
The Company shall be managed by its Members.

ARTICLE V — PRINCIPAL OFFICE
The principal office address of the Company is:
[BUSINESS ADDRESS — use virtual mailbox or PO Box, NOT your home address]

ARTICLE VI — DURATION
The Company shall have perpetual duration.

ARTICLE VII — ORGANIZER
Name: [ORGANIZER NAME]
Address: [ORGANIZER ADDRESS]
Signature: ___________________________
Date: [DATE]

---
NOTE: This is a structural template for educational purposes only. State requirements vary significantly. Consult an attorney or use a service like Northwest Registered Agent, LegalZoom, or Incfile for your specific state.`,
    checklist: [
      "Choose your LLC state (consider Wyoming, New Mexico, or Delaware for privacy)",
      "Select a business name with zero connection to your personal name",
      "Hire a registered agent service to keep your home address off public filings",
      "File Articles of Organization with the Secretary of State",
      "Obtain an EIN (Employer Identification Number) from the IRS — free, takes 5 minutes online",
      "Open a business bank account under the LLC",
      "Set up a virtual mailbox or PO Box as your business address",
    ],
  },
  {
    id: "tpl_2",
    title: "Anonymous LLC Formation Guide (Wyoming / NM / Delaware)",
    description:
      "Step-by-step guide to forming an LLC in a privacy-friendly state where your name never appears on public filings.",
    category: "Entity Formation",
    risk_level: "High",
    estimated_cost: "$100–$800 (filing + registered agent)",
    time_to_complete: "3–7 business days",
    when_you_need_it:
      "When your invisibility score is low and you need to create a legal entity that cannot be traced back to your personal name through public records.",
    template_content: `ANONYMOUS LLC FORMATION CHECKLIST

STEP 1: Choose Your State
━━━━━━━━━━━━━━━━━━━━━━━
- Wyoming: No state income tax, strong privacy, no public disclosure of members. Filing fee ~$100. Best overall choice.
- New Mexico: No annual report, no publication requirement, no operating agreement filing. Filing fee ~$50. Cheapest option.
- Delaware: Strong case law, well-understood by investors. Filing fee ~$90 + $300/yr franchise tax. Best if you plan to raise funding.

STEP 2: Select a Registered Agent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Your registered agent's name and address appear on public filings INSTEAD of yours.
- Recommended services:
  * Northwest Registered Agent ($125/yr)
  * Wyoming Agents ($50/yr for WY only)
  * Incfile (free first year with formation package)

STEP 3: Choose a Business Name
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- NEVER use your personal name
- NEVER use a name related to your employer's industry
- Check availability on the state's Secretary of State website
- Example format: [BRAND NAME] LLC or [BRAND NAME] Holdings LLC

STEP 4: File Formation Documents
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Most registered agent services will file on your behalf
- Your name will NOT appear on the public filing
- Processing time: 1-3 business days (expedited) or 1-2 weeks (standard)

STEP 5: Obtain EIN
━━━━━━━━━━━━━━━━━
- Apply online at IRS.gov — free, immediate
- You need this for bank accounts and payment processors
- The EIN application DOES require your SSN but this is NOT public record

STEP 6: Open Business Bank Account
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Mercury, Relay, or a local credit union
- Need: EIN, Articles of Organization, Operating Agreement
- Your name is on the bank account (required by law) but this is NOT public

STEP 7: Set Up Payment Processing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Register Stripe/PayPal under the LLC name
- Customer statements will show LLC name, not your personal name
- Connect to business bank account

---
NOTE: This guide is for educational purposes. Privacy laws and formation requirements change. Verify current rules with your state's Secretary of State office.`,
    checklist: [
      "Research and select your formation state (WY, NM, or DE)",
      "Choose and hire a registered agent service",
      "Pick a brand name — verify it has zero connection to your real name",
      "File formation documents through your registered agent",
      "Obtain EIN from IRS (irs.gov — free, immediate)",
      "Open a business bank account under the LLC",
      "Register payment processors (Stripe, PayPal) under the LLC",
      "Verify your name does NOT appear on any public filing",
    ],
  },
  {
    id: "tpl_3",
    title: "Operating Agreement (Single-Member LLC)",
    description:
      "The internal governance document for your LLC. Not always required by state law, but essential for bank accounts and maintaining your LLC's legal protection.",
    category: "Entity Formation",
    risk_level: "Medium",
    estimated_cost: "$0 (DIY) or $200–$500 (attorney review)",
    time_to_complete: "30 minutes",
    when_you_need_it:
      "Immediately after forming your LLC. Most banks require an operating agreement to open a business account. It also protects your limited liability status.",
    template_content: `OPERATING AGREEMENT
OF
[YOUR LLC NAME], LLC
A [STATE] Limited Liability Company

Effective Date: [DATE]

ARTICLE I — FORMATION
1.1 The Company was formed on [FORMATION DATE] by filing Articles of Organization with the [STATE] Secretary of State.
1.2 The Company name is [YOUR LLC NAME], LLC.

ARTICLE II — PURPOSE
2.1 The Company is formed for the purpose of [GENERAL DESCRIPTION — e.g., "providing software-as-a-service products and related digital services"].

ARTICLE III — MEMBER
3.1 The sole Member of the Company is:
    Name: [YOUR LEGAL NAME]
    Address: [YOUR ADDRESS — can use virtual mailbox]
    Ownership: 100%

ARTICLE IV — MANAGEMENT
4.1 The Company shall be member-managed.
4.2 The Member shall have full authority to manage the business and affairs of the Company.

ARTICLE V — CAPITAL CONTRIBUTIONS
5.1 The Member has contributed $[AMOUNT] as initial capital.
5.2 No additional contributions are required.

ARTICLE VI — DISTRIBUTIONS
6.1 Distributions shall be made at the sole discretion of the Member.
6.2 All profits and losses shall be allocated to the sole Member.

ARTICLE VII — TAX TREATMENT
7.1 The Company shall be treated as a disregarded entity for federal tax purposes.

ARTICLE VIII — DISSOLUTION
8.1 The Company may be dissolved at any time by written decision of the Member.

ARTICLE IX — LIABILITY
9.1 The Member shall not be personally liable for any debts, obligations, or liabilities of the Company.

Signed:
___________________________
[YOUR LEGAL NAME], Sole Member
Date: [DATE]

---
NOTE: This is a basic template for educational purposes. Your state may have specific requirements. Consider having an attorney review before signing.`,
    checklist: [
      "Fill in your LLC name and formation details",
      "Specify the business purpose (keep it broad)",
      "Record your initial capital contribution amount",
      "Sign and date the agreement",
      "Keep a copy in your business records",
      "Provide a copy to your bank when opening the business account",
    ],
  },
  {
    id: "tpl_4",
    title: "Independent Contractor Agreement",
    description:
      "A contract to hire freelancers and contractors under your LLC. Protects your IP, establishes the working relationship, and keeps everything under your business entity.",
    category: "Contracts & Agreements",
    risk_level: "Medium",
    estimated_cost: "$0 (DIY) or $300–$800 (attorney review)",
    time_to_complete: "20 minutes",
    when_you_need_it:
      "Before hiring any freelancer, developer, designer, or VA for your side business. Never start work without a signed agreement.",
    template_content: `INDEPENDENT CONTRACTOR AGREEMENT

This Agreement is entered into as of [DATE] between:

COMPANY: [YOUR LLC NAME], LLC ("Company")
Address: [BUSINESS ADDRESS]

CONTRACTOR: [CONTRACTOR NAME] ("Contractor")
Address: [CONTRACTOR ADDRESS]

1. SERVICES
Contractor agrees to perform the following services:
[DETAILED DESCRIPTION OF WORK]

2. COMPENSATION
Company shall pay Contractor [AMOUNT] for the services described above.
Payment terms: [e.g., "Net 15 upon delivery of completed work"]
Payment method: [e.g., "Bank transfer to Contractor's designated account"]

3. TERM
This Agreement begins on [START DATE] and ends on [END DATE / "completion of services"].

4. INDEPENDENT CONTRACTOR STATUS
Contractor is an independent contractor, not an employee. Contractor is responsible for their own taxes, insurance, and equipment.

5. INTELLECTUAL PROPERTY
All work product, deliverables, code, designs, and materials created under this Agreement are the exclusive property of the Company. Contractor assigns all rights, title, and interest to the Company upon creation. This is a "work made for hire" agreement.

6. CONFIDENTIALITY
Contractor shall not disclose any confidential information about the Company, its business, clients, or operations to any third party during or after this Agreement.

7. NON-DISCLOSURE OF COMPANY OWNER
Contractor agrees not to disclose the identity of the Company's owner(s) or member(s) to any third party without prior written consent.

8. NON-COMPETE
During the term and for [6/12] months after, Contractor shall not directly compete with the Company using knowledge or materials gained through this engagement.

9. TERMINATION
Either party may terminate this Agreement with [7/14/30] days written notice.

10. GOVERNING LAW
This Agreement shall be governed by the laws of [STATE].

SIGNATURES:

Company: [YOUR LLC NAME], LLC
By: ___________________________
Name: [YOUR NAME OR ALIAS]
Title: Managing Member
Date: [DATE]

Contractor:
___________________________
Name: [CONTRACTOR NAME]
Date: [DATE]

---
NOTE: This template is for educational purposes. Have an attorney review before use, especially the IP assignment and non-compete clauses.`,
    checklist: [
      "Fill in company (LLC) and contractor details",
      "Describe the scope of work in detail",
      "Set compensation and payment terms",
      "Ensure IP assignment clause is included",
      "Add confidentiality and non-disclosure of owner identity",
      "Both parties sign and date",
      "Keep a signed copy in your business records",
    ],
  },
  {
    id: "tpl_5",
    title: "Freelancer Service Agreement",
    description:
      "A lighter-weight agreement for hiring freelancers for small projects. Covers the basics: scope, payment, IP, and confidentiality.",
    category: "Contracts & Agreements",
    risk_level: "Medium",
    estimated_cost: "$0 (DIY)",
    time_to_complete: "15 minutes",
    when_you_need_it:
      "For smaller engagements like a logo design, copywriting project, or one-off development task where a full contractor agreement feels excessive.",
    template_content: `FREELANCER SERVICE AGREEMENT

Date: [DATE]
Project: [PROJECT NAME]

Between:
Client: [YOUR LLC NAME], LLC
Freelancer: [FREELANCER NAME / BUSINESS NAME]

SCOPE OF WORK:
[Describe the deliverables, timeline, and any specifications]

DELIVERABLES:
1. [DELIVERABLE 1]
2. [DELIVERABLE 2]
3. [DELIVERABLE 3]

TIMELINE:
- Start: [DATE]
- Draft delivery: [DATE]
- Final delivery: [DATE]

PAYMENT:
- Total: $[AMOUNT]
- 50% upfront: $[AMOUNT] due upon signing
- 50% on delivery: $[AMOUNT] due upon acceptance of final deliverables

REVISIONS:
[NUMBER] rounds of revisions included. Additional revisions at $[RATE]/hour.

OWNERSHIP:
Upon full payment, all deliverables become the exclusive property of [YOUR LLC NAME], LLC. Freelancer may not use deliverables in their portfolio without written permission.

CONFIDENTIALITY:
Freelancer agrees to keep all project details, business information, and client identity confidential.

CANCELLATION:
Either party may cancel with [7] days notice. Client pays for work completed to date.

Agreed:

Client: ___________________________  Date: _________
Freelancer: ___________________________  Date: _________

---
NOTE: Template for educational purposes only.`,
    checklist: [
      "Define specific deliverables and timeline",
      "Set payment schedule (recommend 50/50 split)",
      "Include IP ownership transfer clause",
      "Add confidentiality terms",
      "Both parties sign before work begins",
    ],
  },
  {
    id: "tpl_6",
    title: "Mutual Non-Disclosure Agreement (NDA)",
    description:
      "A two-way NDA for situations where both parties share confidential information. Use when partnering with other founders, discussing potential collaborations, or sharing business details.",
    category: "Privacy & NDAs",
    risk_level: "High",
    estimated_cost: "$0 (DIY) or $200–$400 (attorney review)",
    time_to_complete: "15 minutes",
    when_you_need_it:
      "Before any conversation where you share business details, revenue numbers, strategies, or proprietary information with another person — especially other founders or potential partners.",
    template_content: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of [DATE] between:

Party A: [YOUR LLC NAME], LLC
Address: [BUSINESS ADDRESS]

Party B: [OTHER PARTY NAME]
Address: [OTHER PARTY ADDRESS]

1. PURPOSE
The parties wish to explore a potential business relationship ("Purpose") and may need to share confidential information.

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" includes all non-public information disclosed by either party, including but not limited to:
- Business strategies, plans, and financial data
- Customer lists, pricing, and revenue figures
- Technical specifications, code, and trade secrets
- Marketing strategies and product roadmaps
- The identity of either party's owners, members, or principals

3. OBLIGATIONS
Each party agrees to:
a) Keep all Confidential Information strictly confidential
b) Not disclose Confidential Information to any third party without prior written consent
c) Use Confidential Information only for the stated Purpose
d) Protect Confidential Information with at least the same degree of care used for their own confidential information

4. EXCLUSIONS
This Agreement does not apply to information that:
a) Is or becomes publicly available through no fault of the receiving party
b) Was known to the receiving party before disclosure
c) Is independently developed without use of Confidential Information
d) Is required to be disclosed by law (with prompt notice to the disclosing party)

5. TERM
This Agreement remains in effect for [2/3/5] years from the date of execution.

6. RETURN OF INFORMATION
Upon request or termination, each party shall return or destroy all Confidential Information received.

7. NO LICENSE
Nothing in this Agreement grants either party any rights to the other's intellectual property.

8. GOVERNING LAW
This Agreement is governed by the laws of [STATE].

SIGNATURES:

Party A: [YOUR LLC NAME], LLC
By: ___________________________
Title: Managing Member
Date: [DATE]

Party B: [OTHER PARTY NAME]
By: ___________________________
Title: [TITLE]
Date: [DATE]

---
NOTE: Template for educational purposes. Consider attorney review for high-stakes situations.`,
    checklist: [
      "Fill in both party details (use LLC name, not personal name)",
      "Define the purpose of the disclosure",
      "Set the term (2-5 years is standard)",
      "Both parties sign before any information is shared",
      "Keep a signed copy in your business records",
      "Send the signed copy to the other party",
    ],
  },
  {
    id: "tpl_7",
    title: "One-Way NDA (You Disclosing to Contractor)",
    description:
      "A simpler NDA for when you hire a contractor and need to share confidential business information with them. Protects your information without requiring them to share theirs.",
    category: "Privacy & NDAs",
    risk_level: "Medium",
    estimated_cost: "$0 (DIY)",
    time_to_complete: "10 minutes",
    when_you_need_it:
      "Before sharing any business details, login credentials, customer data, or proprietary information with a freelancer or contractor.",
    template_content: `ONE-WAY NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of [DATE] between:

Disclosing Party: [YOUR LLC NAME], LLC ("Company")
Receiving Party: [CONTRACTOR NAME] ("Recipient")

1. The Company may disclose confidential and proprietary information to the Recipient in connection with [PROJECT/PURPOSE].

2. "Confidential Information" means any non-public information about the Company's business, including but not limited to:
   - Business plans, strategies, and financial information
   - Customer data and lists
   - Technical specifications, source code, and trade secrets
   - The identity of the Company's owners and members
   - Any information marked as "Confidential"

3. The Recipient agrees to:
   a) Hold all Confidential Information in strict confidence
   b) Not disclose it to any third party without prior written consent
   c) Use it only for the purpose of performing work for the Company
   d) Return or destroy all Confidential Information upon request or project completion

4. This obligation of confidentiality survives for [2/3] years after the date of disclosure.

5. This Agreement is governed by the laws of [STATE].

Signed:

Company: [YOUR LLC NAME], LLC
By: ___________________________
Date: [DATE]

Recipient:
___________________________
Name: [CONTRACTOR NAME]
Date: [DATE]

---
NOTE: Template for educational purposes only.`,
    checklist: [
      "Fill in company and contractor details",
      "Describe the project or purpose",
      "Set the confidentiality term (2-3 years standard)",
      "Have the contractor sign BEFORE sharing any business information",
      "Store the signed copy securely",
    ],
  },
  {
    id: "tpl_8",
    title: "IP Assignment Agreement (Contractor to LLC)",
    description:
      "Ensures all intellectual property created by a contractor belongs to your LLC. Critical for code, designs, content, and any creative work.",
    category: "IP Protection",
    risk_level: "High",
    estimated_cost: "$0 (DIY) or $300–$600 (attorney review)",
    time_to_complete: "15 minutes",
    when_you_need_it:
      "Every time a contractor creates anything for your business — code, designs, copy, logos, architecture. Without this, the contractor may legally own what they built for you.",
    template_content: `INTELLECTUAL PROPERTY ASSIGNMENT AGREEMENT

This IP Assignment Agreement ("Agreement") is entered into as of [DATE] between:

Assignee: [YOUR LLC NAME], LLC ("Company")
Assignor: [CONTRACTOR NAME] ("Contractor")

RECITALS:
Contractor has been engaged to perform [DESCRIPTION OF WORK] for the Company.

1. ASSIGNMENT OF INTELLECTUAL PROPERTY
Contractor hereby irrevocably assigns to the Company all right, title, and interest in and to all Work Product created in connection with services for the Company, including but not limited to:
- Source code, software, and applications
- Designs, graphics, logos, and visual materials
- Written content, documentation, and copy
- Inventions, processes, and methodologies
- All patent rights, copyrights, trade secrets, and other IP rights

2. WORK MADE FOR HIRE
To the extent permitted by law, all Work Product is considered a "work made for hire" as defined by the Copyright Act.

3. MORAL RIGHTS
Contractor waives any moral rights in the Work Product to the fullest extent permitted by law.

4. FURTHER ASSURANCES
Contractor agrees to execute any additional documents needed to perfect the Company's ownership of the Work Product.

5. PRE-EXISTING IP
Contractor represents that the Work Product does not incorporate any pre-existing intellectual property owned by Contractor or third parties, except as disclosed in writing.

6. WARRANTY
Contractor represents that the Work Product is original and does not infringe any third-party rights.

SIGNATURES:

Company: [YOUR LLC NAME], LLC
By: ___________________________
Title: Managing Member
Date: [DATE]

Contractor:
___________________________
Name: [CONTRACTOR NAME]
Date: [DATE]

---
NOTE: This template is critical for protecting your business. Consider attorney review, especially for high-value projects.`,
    checklist: [
      "Include specific description of work product being assigned",
      "Ensure 'work made for hire' language is included",
      "Have contractor disclose any pre-existing IP they'll incorporate",
      "Both parties sign BEFORE work begins",
      "Keep with the corresponding contractor agreement",
      "Review with an attorney for high-value projects ($5K+)",
    ],
  },
  {
    id: "tpl_9",
    title: "Invention Assignment Disclaimer",
    description:
      "A personal record documenting that your side business was developed independently, using no employer resources, time, or proprietary knowledge. Your insurance policy if questions arise.",
    category: "IP Protection",
    risk_level: "Critical",
    estimated_cost: "$0 (DIY) or $300–$500 (attorney review for extra protection)",
    time_to_complete: "30 minutes",
    when_you_need_it:
      "IMMEDIATELY. Create this document on Day 1 of your side business and update it regularly. This is your evidence trail proving your work is yours.",
    template_content: `INVENTION ASSIGNMENT DISCLAIMER & INDEPENDENCE LOG

Date Created: [DATE]
Last Updated: [DATE]

I, [YOUR LEGAL NAME], maintain this document to establish a clear record that my side business activities are conducted independently of my employment with [EMPLOYER NAME — optional, can leave blank for extra privacy].

DECLARATION OF INDEPENDENCE:

1. SEPARATE RESOURCES
I certify that all work on [YOUR LLC NAME / SIDE BUSINESS DESCRIPTION] is performed:
- On my personal devices (laptop, phone, tablet) — never on company equipment
- On my personal internet connection — never on company Wi-Fi or VPN
- On my personal time — never during work hours, lunch breaks at the office, or company events

2. NO PROPRIETARY KNOWLEDGE
I certify that [YOUR LLC NAME / SIDE BUSINESS DESCRIPTION]:
- Does not use any proprietary information from my employer
- Does not use any trade secrets, internal data, or confidential strategies
- Does not compete with my employer's business
- Was conceived and developed entirely from publicly available information
- Industry: [YOUR SIDE BUSINESS INDUSTRY] — distinct from employer's industry: [EMPLOYER'S INDUSTRY]

3. IDEA ORIGIN
The idea for [PRODUCT/SERVICE] originated from:
[DESCRIBE HOW YOU CAME UP WITH THE IDEA — be specific about public sources, personal experience, etc.]

4. TOOLS & RESOURCES
All tools and services used are:
- Paid for from personal funds or LLC account
- Licensed under personal or LLC accounts
- Not provided by or associated with my employer

LIST OF TOOLS:
[LIST YOUR TOOLS — e.g., "Personal MacBook Pro (purchased [DATE]), personal Figma account, personal GitHub account, AWS account under LLC"]

5. TIME LOG
I maintain records showing all side business work occurs outside of work hours:
[OPTIONAL: Reference your time tracking method — e.g., "Toggl time entries", "Calendar blocks", "Git commit timestamps"]

SIGNED:
___________________________
[YOUR LEGAL NAME]
Date: [DATE]

---
IMPORTANT: Update this document monthly. Save copies with timestamps. This is your primary evidence if your employer ever questions ownership of your side business. Consider having this notarized for additional legal weight.`,
    checklist: [
      "Fill in all sections honestly and completely",
      "List every tool and resource you use — prove they're personal/LLC-owned",
      "Document the origin of your business idea with specific public sources",
      "Sign and date the document",
      "Update monthly with any changes",
      "Store securely — consider a cloud backup separate from work accounts",
      "Consider having it notarized for additional legal weight",
      "Keep git commit timestamps as supporting evidence of after-hours work",
    ],
  },
  {
    id: "tpl_10",
    title: "Privacy Policy Template (SaaS)",
    description:
      "A privacy policy for your SaaS product or website. Required by law in most jurisdictions and by payment processors like Stripe.",
    category: "Privacy & NDAs",
    risk_level: "Low",
    estimated_cost: "$0 (DIY) or $100–$300 (generator service)",
    time_to_complete: "30 minutes",
    when_you_need_it:
      "Before launching any website or app that collects user data, processes payments, or uses analytics. Stripe and most payment processors require one.",
    template_content: `PRIVACY POLICY

Last Updated: [DATE]

[YOUR LLC NAME], LLC ("we", "us", "our") operates [WEBSITE URL] ("Service"). This Privacy Policy explains how we collect, use, and protect your information.

1. INFORMATION WE COLLECT
- Account information: email address, name (if provided)
- Payment information: processed securely through [Stripe/PayPal] — we do not store card numbers
- Usage data: pages visited, features used, browser type, IP address
- Cookies: we use cookies for session management and analytics

2. HOW WE USE YOUR INFORMATION
- To provide and maintain our Service
- To process payments and send receipts
- To send important updates about the Service
- To improve our Service based on usage patterns
- To respond to support requests

3. DATA SHARING
We do NOT sell your personal information. We share data only with:
- Payment processors (Stripe, PayPal) to process transactions
- Hosting providers to deliver the Service
- Analytics tools to improve the Service (anonymized where possible)

4. DATA RETENTION
We retain your data for as long as your account is active. You may request deletion at any time by contacting [SUPPORT EMAIL].

5. SECURITY
We implement industry-standard security measures including encryption in transit (HTTPS) and at rest. However, no method of transmission over the internet is 100% secure.

6. YOUR RIGHTS
Depending on your jurisdiction, you may have the right to:
- Access your personal data
- Request correction of inaccurate data
- Request deletion of your data
- Opt out of marketing communications
- Data portability

7. CHILDREN'S PRIVACY
Our Service is not directed to individuals under 16. We do not knowingly collect data from children.

8. CHANGES
We may update this Privacy Policy. We will notify registered users of material changes via email.

9. CONTACT
Questions about this policy? Contact us at [SUPPORT EMAIL].

---
NOTE: This is a basic template. If you operate in the EU (GDPR), California (CCPA), or other regulated jurisdictions, you may need additional clauses. Consider using a privacy policy generator for comprehensive coverage.`,
    checklist: [
      "Replace all placeholders with your LLC and service details",
      "List all third-party services that receive user data",
      "Add GDPR-specific clauses if you have EU users",
      "Add CCPA clauses if you have California users",
      "Link the privacy policy in your website footer",
      "Submit the URL to Stripe/PayPal during account setup",
    ],
  },
  {
    id: "tpl_11",
    title: "Terms of Service Template (SaaS)",
    description:
      "Terms of Service for your SaaS product. Establishes the rules users agree to, limits your liability, and protects your LLC.",
    category: "Contracts & Agreements",
    risk_level: "Low",
    estimated_cost: "$0 (DIY) or $200–$500 (attorney review)",
    time_to_complete: "30 minutes",
    when_you_need_it:
      "Before launching any paid product or service. Required by payment processors and protects your LLC from liability.",
    template_content: `TERMS OF SERVICE

Last Updated: [DATE]

Welcome to [SERVICE NAME], operated by [YOUR LLC NAME], LLC.

By using our Service, you agree to these Terms. If you do not agree, do not use the Service.

1. SERVICE DESCRIPTION
[SERVICE NAME] provides [BRIEF DESCRIPTION OF YOUR SERVICE].

2. ACCOUNTS
- You must provide accurate information when creating an account
- You are responsible for maintaining the security of your account
- You must be at least 16 years old to use the Service

3. PAYMENTS & SUBSCRIPTIONS
- Prices are listed on our website and may change with 30 days notice
- Subscriptions renew automatically unless cancelled
- You may cancel at any time through your account settings
- Refunds are handled per our refund policy: [DESCRIBE REFUND POLICY]

4. ACCEPTABLE USE
You agree NOT to:
- Use the Service for any illegal purpose
- Attempt to gain unauthorized access to our systems
- Reverse engineer or copy our Service
- Use the Service to harm others

5. INTELLECTUAL PROPERTY
All content, code, and materials in the Service are owned by [YOUR LLC NAME], LLC. You may not copy, modify, or distribute our materials without permission.

6. USER CONTENT
You retain ownership of content you upload. By uploading, you grant us a license to store and display it as part of the Service.

7. LIMITATION OF LIABILITY
TO THE MAXIMUM EXTENT PERMITTED BY LAW, [YOUR LLC NAME], LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.

Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.

8. DISCLAIMER
THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.

9. TERMINATION
We may terminate your access if you violate these Terms. You may terminate your account at any time.

10. GOVERNING LAW
These Terms are governed by the laws of [STATE], without regard to conflict of law provisions.

11. CHANGES
We may update these Terms with 30 days notice. Continued use constitutes acceptance.

12. CONTACT
Questions? Contact [SUPPORT EMAIL].

---
NOTE: Basic template for educational purposes. Attorney review recommended before launch.`,
    checklist: [
      "Replace all placeholders with your LLC and service details",
      "Define your refund policy clearly",
      "Choose your governing law state (match your LLC state)",
      "Link Terms of Service in your website footer",
      "Require agreement at signup (checkbox)",
      "Keep a versioned history of changes",
    ],
  },
  {
    id: "tpl_12",
    title: "Quarterly Tax Estimation Worksheet",
    description:
      "A worksheet to estimate and track your quarterly estimated tax payments. Helps you stay compliant and avoid penalties for underpayment.",
    category: "Tax & Compliance",
    risk_level: "Medium",
    estimated_cost: "$0 (DIY) or $200–$500 (CPA consultation)",
    time_to_complete: "20 minutes per quarter",
    when_you_need_it:
      "Once your side business generates more than $1,000/year in profit. The IRS requires quarterly estimated payments to avoid penalties.",
    template_content: `QUARTERLY TAX ESTIMATION WORKSHEET

Tax Year: [YEAR]
Business: [YOUR LLC NAME], LLC
EIN: [YOUR EIN]
Filing Status: [SINGLE / MARRIED FILING JOINTLY / etc.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUARTERLY DEADLINES:
Q1 (Jan-Mar): Due April 15
Q2 (Apr-May): Due June 15
Q3 (Jun-Aug): Due September 15
Q4 (Sep-Dec): Due January 15 (following year)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INCOME TRACKER:

                    Q1          Q2          Q3          Q4          TOTAL
Gross Revenue:      $________   $________   $________   $________   $________
Returns/Refunds:   -$________  -$________  -$________  -$________  -$________
NET REVENUE:        $________   $________   $________   $________   $________

DEDUCTIBLE EXPENSES:

Hosting/Domains:    $________   $________   $________   $________   $________
Software/Tools:     $________   $________   $________   $________   $________
Contractor Payments:$________   $________   $________   $________   $________
Advertising:        $________   $________   $________   $________   $________
Office/Mailbox:     $________   $________   $________   $________   $________
Phone/Internet:     $________   $________   $________   $________   $________
Professional Fees:  $________   $________   $________   $________   $________
Other:              $________   $________   $________   $________   $________
TOTAL EXPENSES:     $________   $________   $________   $________   $________

NET PROFIT:         $________   $________   $________   $________   $________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ESTIMATED TAX CALCULATION:

Annual Net Profit (estimated):              $________
Self-Employment Tax Rate (15.3%):           $________
Income Tax Rate (use your marginal rate):   $________
Total Estimated Tax:                        $________
Quarterly Payment (÷ 4):                    $________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAYMENT TRACKER:
Q1 Payment: $________ Paid on: _________ Confirmation: _________
Q2 Payment: $________ Paid on: _________ Confirmation: _________
Q3 Payment: $________ Paid on: _________ Confirmation: _________
Q4 Payment: $________ Paid on: _________ Confirmation: _________

---
NOTE: This worksheet provides a simplified estimation. Your actual tax situation may be more complex. Consult a CPA who understands single-member LLCs and side business income. Pay via IRS Direct Pay (irs.gov/payments) or EFTPS.`,
    checklist: [
      "Track all business income and expenses monthly",
      "Calculate estimated quarterly payment before each deadline",
      "Pay via IRS Direct Pay or EFTPS — never use a check linked to personal account",
      "Keep all receipts for deductible business expenses",
      "Set aside 25-30% of profit for taxes in a separate savings account",
      "Consult a CPA before your first tax filing",
      "File Form 1040-ES with your quarterly payments",
    ],
  },
];
