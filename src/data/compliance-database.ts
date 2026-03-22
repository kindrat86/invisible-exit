import type { ComplianceEntry } from "@/types/stealth";

export const COMPLIANCE_ENTRIES: ComplianceEntry[] = [
  {
    id: "comp_1",
    clause_type: "Non-Compete Agreement",
    description:
      "Prohibits you from working for or starting a competing business during and after employment. The most feared clause for side business builders — but also the most frequently unenforceable.",
    risk_level: "Critical",
    common_in: ["Technology", "Finance", "Consulting", "Sales", "Healthcare"],
    what_it_means:
      "If your side business operates in the same industry as your employer, this clause could theoretically be used to shut you down or sue for damages. However, enforcement varies dramatically by state and the specifics of your business. A SaaS tool for plumbers built by someone at a fintech company is almost certainly not competing.",
    what_to_do:
      "First, read the exact language. Check the scope (industry, geography, duration). If your side business is in a completely different industry, most non-competes won't apply. If there's any overlap, consult an employment attorney. Consider choosing a side business in an industry your employer has zero presence in.",
    jurisdiction_notes:
      "California: Non-competes are completely unenforceable (Business & Professions Code 16600). Colorado: Banned for most workers earning under $123K (2024). Illinois: Unenforceable for workers earning under $75K. Minnesota: Banned entirely as of July 2023. Oklahoma: Generally unenforceable. Oregon: Limited to 1 year, requires written notice. FTC proposed a nationwide ban in 2024 — check current status.",
    example_language:
      '"During employment and for a period of [12/24] months following termination, Employee shall not directly or indirectly engage in, own, manage, or participate in any business that competes with the Company within [geographic area]."',
  },
  {
    id: "comp_2",
    clause_type: "Non-Solicitation Clause",
    description:
      "Prevents you from contacting or doing business with your employer's clients, customers, or employees after leaving. Different from a non-compete — focused on relationships, not industries.",
    risk_level: "High",
    common_in: ["Consulting", "Finance", "Sales", "Recruiting", "Legal"],
    what_it_means:
      "You cannot reach out to your employer's clients or recruit their employees for your side business. This is more commonly enforced than non-competes because courts see protecting client relationships as more reasonable. However, it only applies to clients/employees you had contact with.",
    what_to_do:
      "Never target your employer's clients for your side business. Build an entirely separate customer base in a different market. If a client independently finds your side business, that's generally not solicitation — but document the circumstances. Never recruit colleagues to help with your side project.",
    jurisdiction_notes:
      "Most states enforce non-solicitation clauses more readily than non-competes because they're seen as narrower and more reasonable. California is the exception — non-solicitation of employees may be unenforceable. Duration is typically limited to 1-2 years post-employment. Must be limited to clients/employees you actually worked with.",
    example_language:
      '"For [12/24] months after termination, Employee shall not directly or indirectly solicit, contact, or do business with any client, customer, or prospective customer of the Company with whom Employee had contact during the last [12/24] months of employment."',
  },
  {
    id: "comp_3",
    clause_type: "Moonlighting / Outside Employment Restriction",
    description:
      "Requires employer approval for any outside employment or business activity. Some companies ban it outright; others require disclosure and approval.",
    risk_level: "Critical",
    common_in: [
      "Technology",
      "Finance",
      "Government",
      "Healthcare",
      "Consulting",
    ],
    what_it_means:
      "If your contract includes this, your employer technically has the right to know about and approve (or deny) your side business. Violating this could be grounds for termination. However, enforcement depends on whether they actually discover it and whether they choose to act.",
    what_to_do:
      "Read the exact language carefully. Some clauses only restrict 'employment' (being hired by another company) not 'business ownership' (running your own LLC). Some only apply during work hours. If the clause is broad, consult an attorney about whether it's enforceable in your state. Consider the risk/reward of disclosure vs. invisibility.",
    jurisdiction_notes:
      "California: Labor Code 96(k) protects lawful conduct during off-hours — moonlighting bans may be unenforceable. Colorado: Off-duty conduct protections exist. New York: Labor Law 201-d protects legal off-duty activities. North Dakota: Similar protections. Many states have no specific protections, meaning the restriction may be enforceable if you agreed to it.",
    example_language:
      '"Employee shall not engage in any outside employment, consulting, or business activity without prior written approval from their manager and Human Resources. This includes but is not limited to freelance work, consulting engagements, and ownership interest in any business entity."',
  },
  {
    id: "comp_4",
    clause_type: "Intellectual Property Assignment (Employer)",
    description:
      "Assigns ownership of inventions and intellectual property you create to your employer — potentially including work done on your own time and with your own equipment.",
    risk_level: "Critical",
    common_in: ["Technology", "Engineering", "Pharma", "Biotech", "Design"],
    what_it_means:
      "This is the most dangerous clause for side business builders. In its broadest form, it means your employer owns everything you create — even on weekends, on your personal laptop, in a completely different industry. However, many states have carved out protections for personal inventions.",
    what_to_do:
      "Read the exact scope. Does it cover ALL inventions or only those 'related to the company's business'? Check if your state has inventor protection laws (see jurisdiction notes). If broad, create an Invention Assignment Disclaimer (see Legal Templates) to document that your side business was developed independently. Ensure your side business is in a different industry.",
    jurisdiction_notes:
      "California: Labor Code 2870 — employer CANNOT claim inventions developed on your own time, with your own equipment, unrelated to employer's business. Delaware: Similar protection under Title 19 §805. Illinois: Employee Patent Act (765 ILCS 1060). Minnesota: Statute 181.78. Washington: RCW 49.44.140. North Carolina: GS 66-57.1. These states require employers to notify you of these protections in the contract.",
    example_language:
      '"Employee agrees that all inventions, discoveries, improvements, ideas, and works of authorship, whether or not patentable, that are conceived, developed, or reduced to practice during the period of employment shall be the sole and exclusive property of the Company."',
  },
  {
    id: "comp_5",
    clause_type: "Invention Disclosure Obligation",
    description:
      "Requires you to disclose all inventions and creative works to your employer, even if they were created on personal time. Disclosure doesn't always mean assignment, but it creates a record.",
    risk_level: "High",
    common_in: ["Technology", "Engineering", "Pharma", "R&D", "Defense"],
    what_it_means:
      "You may be required to notify your employer about any invention or creative work, including your side business. The employer then decides whether to claim ownership. Even if they don't claim it, the disclosure creates a paper trail that your employer knows about your side business.",
    what_to_do:
      "Check if your state protects personal inventions (see IP Assignment clause above). If your side business is clearly unrelated to your employer's business and you used no company resources, many disclosure obligations don't apply. Document the independence of your work. If disclosure is required, consult an attorney about how to disclose minimally.",
    jurisdiction_notes:
      "States with invention protection laws (CA, DE, IL, MN, WA, NC) generally limit disclosure obligations to inventions related to the employer's business. In these states, you do NOT need to disclose personal inventions that are unrelated to your employer's business and were developed on personal time and equipment. Other states may not have such protections.",
    example_language:
      '"Employee shall promptly and fully disclose to the Company all inventions, improvements, and works of authorship made or conceived by Employee, whether solely or jointly, during the period of employment, and shall assist the Company in obtaining patents or copyrights thereon."',
  },
  {
    id: "comp_6",
    clause_type: "Confidentiality / NDA (Employment)",
    description:
      "Prohibits sharing your employer's confidential information, trade secrets, and proprietary knowledge. Standard in virtually all employment contracts.",
    risk_level: "High",
    common_in: [
      "Technology",
      "Finance",
      "Healthcare",
      "Consulting",
      "All Industries",
    ],
    what_it_means:
      "You cannot use your employer's internal strategies, customer data, pricing information, proprietary processes, or trade secrets in your side business. This is entirely reasonable and enforceable. The risk is if your employer argues that skills or knowledge you learned on the job are 'confidential information.'",
    what_to_do:
      "This clause is legitimate — respect it fully. Never use employer data, strategies, or proprietary knowledge in your side business. Build your side business using only publicly available information. Document the public sources of your business ideas and strategies. The key distinction: general skills and industry knowledge are NOT trade secrets. Specific processes, customer lists, and pricing data ARE.",
    jurisdiction_notes:
      "Confidentiality agreements are enforceable in all states. The Defend Trade Secrets Act (DTSA) provides federal protection for trade secrets. However, courts distinguish between 'trade secrets' (protectable) and 'general knowledge and skills' (not protectable). Your ability to code, manage projects, or understand an industry is NOT a trade secret — even if you learned it at your job.",
    example_language:
      '"Employee agrees to hold in strict confidence and not disclose, publish, or use for any purpose other than Company business, any Confidential Information of the Company, including but not limited to trade secrets, customer lists, pricing strategies, business plans, technical specifications, and proprietary processes."',
  },
  {
    id: "comp_7",
    clause_type: "Non-Disparagement Clause",
    description:
      "Prohibits making negative public statements about your employer. Typically survives termination. Relevant if your side business involves content or social media.",
    risk_level: "Medium",
    common_in: ["All Industries", "Finance", "Media", "Technology"],
    what_it_means:
      "You cannot publicly criticize your employer, its products, management, or practices. This matters for side business builders who create content, podcasts, or courses where they might be tempted to tell their 'corporate escape' story. Your employer could argue that your exit narrative disparages them.",
    what_to_do:
      "Keep your content focused on helping others, not criticizing your employer. Never name your employer in any business content. If telling your story, keep it general: 'I worked in corporate finance' not 'I worked at [Company Name].' Avoid any content that could be interpreted as criticizing a specific company.",
    jurisdiction_notes:
      "The NLRA (National Labor Relations Act) protects employees' right to discuss working conditions with coworkers, which limits some non-disparagement clauses. However, public statements to customers or in marketing are typically not protected. Some states (like California) have limited the scope of non-disparagement clauses in severance agreements.",
    example_language:
      '"Employee agrees not to make, publish, or communicate any disparaging, negative, or derogatory statements about the Company, its officers, directors, employees, products, or services, whether orally, in writing, or through any electronic or social media platform."',
  },
  {
    id: "comp_8",
    clause_type: "Work-for-Hire Clause",
    description:
      "Declares that anything you create as part of your job is automatically owned by the employer. Standard and reasonable for work done within your job scope.",
    risk_level: "High",
    common_in: ["Technology", "Design", "Media", "Marketing", "Engineering"],
    what_it_means:
      "Work you produce during your job, using company resources, within the scope of your employment, belongs to the company. This is standard and reasonable. The danger is when the clause is written so broadly that it could be interpreted to cover your side business work too.",
    what_to_do:
      "Review the scope. If it only covers work 'within the scope of employment' or 'using company resources,' your side business (different industry, personal time, personal equipment) is not covered. If it's broad, check your state's invention protection laws. Maintain clear documentation that your side business work is done independently.",
    jurisdiction_notes:
      "Under U.S. Copyright Act, 'work made for hire' only applies to: (1) work by an employee within the scope of employment, or (2) certain categories of commissioned works with a written agreement. Your side business work, created on personal time and equipment, is NOT work for hire — regardless of what the contract says. State invention protection laws (CA, DE, IL, etc.) further protect personal creations.",
    example_language:
      "\"All works, materials, and deliverables created by Employee in the course of employment shall be considered 'works made for hire' under the Copyright Act and shall be the sole property of the Company.\"",
  },
  {
    id: "comp_9",
    clause_type: "Garden Leave Clause",
    description:
      "Requires you to remain employed (and paid) for a notice period after announcing your departure, during which you may be restricted from starting new work.",
    risk_level: "Medium",
    common_in: ["Finance", "Banking", "Insurance", "Senior Management"],
    what_it_means:
      "When you resign, you must serve a notice period (typically 1-6 months) where you're still employed and paid but may not start working elsewhere. This delays your full transition to your side business but doesn't prevent you from having already built it. Your side business can continue running during garden leave since it was already in operation.",
    what_to_do:
      "Plan your exit timeline accounting for garden leave. Since your side business should already be running, garden leave is mostly a paid vacation where your business runs on autopilot. Avoid making major business moves (new hires, big launches) during garden leave. Use the time to prepare for your full-time transition.",
    jurisdiction_notes:
      "Garden leave is more common in the UK and Europe than the US. In the US, it's primarily found in finance, banking, and senior executive contracts. Courts generally enforce garden leave because the employee continues to be paid. Duration is typically 1-6 months. Some contracts allow the employer to waive garden leave.",
    example_language:
      "\"Upon notice of termination, the Company may place Employee on 'garden leave' for a period of up to [3/6] months, during which Employee shall remain employed, receive full salary and benefits, but shall not be required to perform duties and shall not commence employment or engagement with any other entity.\"",
  },
  {
    id: "comp_10",
    clause_type: "Duty of Loyalty",
    description:
      "A common-law obligation (not always written) that requires employees to act in their employer's best interest and not compete while employed. Exists even without a written clause.",
    risk_level: "High",
    common_in: [
      "All Industries",
      "Especially Senior Roles",
      "Management",
      "Directors",
    ],
    what_it_means:
      "Even without a non-compete or moonlighting clause, employees have a common-law duty of loyalty to their employer. This means you shouldn't actively compete with your employer while employed. However, courts have consistently held that preparing to start a non-competing business (forming an LLC, building a product in a different industry) does not violate the duty of loyalty.",
    what_to_do:
      "Ensure your side business does not compete with your employer. Do not use work time, resources, or relationships for your side business. Do not solicit your employer's clients or recruit their employees. Preparing for your eventual departure (forming an LLC, building a product, getting customers in a different industry) is legal — just don't actively harm your employer while doing it.",
    jurisdiction_notes:
      "The duty of loyalty is a common-law principle recognized in all states. It's stronger for officers, directors, and senior management than for regular employees. Courts distinguish between 'preparation to compete' (legal) and 'active competition' (not legal). Building a side business in a different industry while employed is generally considered preparation, not competition.",
    example_language:
      '"This is a common-law obligation and may not appear as a written clause. However, some contracts include: Employee acknowledges a duty of loyalty to the Company and agrees to devote their best efforts to the Company\'s business during the term of employment."',
  },
  {
    id: "comp_11",
    clause_type: "Use of Company Resources",
    description:
      "Restricts using company equipment, software, email, network, or facilities for personal or outside business purposes.",
    risk_level: "Medium",
    common_in: ["Technology", "Finance", "Government", "All Industries"],
    what_it_means:
      "You cannot use your company laptop, phone, email, Wi-Fi, VPN, or office space for your side business. Even briefly checking your business email on the company Wi-Fi could technically violate this clause. More importantly, using company resources could give your employer an IP claim over your side business work.",
    what_to_do:
      "This one is simple: NEVER use any company resource for your side business. No company laptop, not even to check a quick email. No company Wi-Fi, not even at lunch. No company software licenses. Buy your own everything. This is both the easiest rule to follow and the most important for protecting your IP rights.",
    jurisdiction_notes:
      "This clause is enforceable in all states. Using company resources for your side business is one of the strongest arguments an employer can make for claiming ownership of your side project. Even in states like California that protect personal inventions, the protection requires that you did NOT use company resources. This is the one rule you cannot afford to break.",
    example_language:
      '"Company equipment, software, email systems, network, and facilities are provided for Company business use only. Employee shall not use Company resources for personal business, outside employment, or any non-Company purpose without prior written authorization."',
  },
  {
    id: "comp_12",
    clause_type: "Social Media Policy",
    description:
      "Guidelines and restrictions on how employees can use social media, including posting about work, industry topics, or representing the company online.",
    risk_level: "Low",
    common_in: ["Technology", "Media", "Finance", "Healthcare", "Government"],
    what_it_means:
      "Your employer may monitor employees' public social media. If your business social accounts are linked to your personal identity, or if your personal accounts reference your side business, your employer could discover it through routine social media monitoring.",
    what_to_do:
      "Keep your business social media completely separate from your personal accounts (see Anonymity Playbook). Don't mention your side business on any platform connected to your professional identity. Set personal accounts to private. Never post about your employer or industry from your business accounts in a way that could link the two.",
    jurisdiction_notes:
      "Employers can legally monitor public social media. The NLRA protects some employee speech about working conditions, but does not protect disclosing your side business. Some states (like California, Colorado, New York) protect lawful off-duty conduct, which could include running a side business — but social media posts are voluntary disclosures, not protected activity.",
    example_language:
      '"Employees are expected to exercise good judgment when using social media. Employees should not post confidential company information, speak on behalf of the Company without authorization, or engage in online activity that could reflect negatively on the Company or create a conflict of interest."',
  },
  {
    id: "comp_13",
    clause_type: "Conflict of Interest Disclosure",
    description:
      "Requires employees to disclose any personal financial interests or business relationships that could conflict with their employer's interests.",
    risk_level: "Medium",
    common_in: [
      "Finance",
      "Government",
      "Healthcare",
      "Consulting",
      "Publicly Traded Companies",
    ],
    what_it_means:
      "You may be required to disclose business interests that could create a conflict with your employer. If your side business is in a completely different industry, there's typically no conflict to disclose. If there's any industry overlap, you may have a disclosure obligation.",
    what_to_do:
      "Choose a side business in a clearly different industry from your employer. If there's zero overlap, most conflict of interest policies don't require disclosure. If you're unsure, consult an attorney. If disclosure is required by law or regulation (common in finance and government), discuss with an attorney how to disclose minimally while protecting yourself.",
    jurisdiction_notes:
      "Conflict of interest disclosure is most stringent in regulated industries. FINRA-registered employees (finance) must disclose outside business activities (Rule 3270). Government employees have strict disclosure requirements. Publicly traded companies often require annual COI certifications. In unregulated industries, disclosure is typically only required if there's an actual conflict.",
    example_language:
      '"Employee shall promptly disclose to the Company any personal financial interest, business relationship, or outside activity that could create an actual or potential conflict of interest with the Employee\'s duties or the Company\'s business interests."',
  },
  {
    id: "comp_14",
    clause_type: "Post-Employment Restrictions",
    description:
      "A catch-all for various restrictions that survive after you leave the company, including non-compete, non-solicitation, confidentiality, and IP obligations.",
    risk_level: "High",
    common_in: [
      "Technology",
      "Finance",
      "Consulting",
      "Senior Management",
      "Sales",
    ],
    what_it_means:
      "Even after you resign, certain obligations continue — typically confidentiality (forever), non-compete (6-24 months), non-solicitation (12-24 months), and IP assignment (for work done during employment). Understanding these timelines is critical for planning your exit.",
    what_to_do:
      "Map out exactly what restrictions survive and for how long. Build your exit timeline around these dates. Remember: confidentiality of trade secrets is permanent and legitimate. Non-competes and non-solicitation have expiration dates. Start your countdown when you give notice. If your side business is in a different industry, post-employment restrictions are largely irrelevant.",
    jurisdiction_notes:
      "Post-employment restrictions must be 'reasonable' in scope, duration, and geography to be enforceable. Most courts won't enforce restrictions longer than 2 years. Some states (CA, MN, OK) have banned or severely limited post-employment non-competes. Confidentiality obligations for actual trade secrets can last indefinitely in all states. When in doubt, consult an employment attorney before your exit.",
    example_language:
      '"The obligations set forth in Sections [X] (Confidentiality), [Y] (Non-Competition), and [Z] (Non-Solicitation) shall survive the termination of employment for the periods specified therein, regardless of the reason for termination."',
  },
  {
    id: "comp_15",
    clause_type: "At-Will Employment Caveat",
    description:
      "Most US employment is 'at will,' meaning either party can end the relationship at any time for any legal reason — including discovering a side business.",
    risk_level: "Low",
    common_in: ["All US Industries"],
    what_it_means:
      "Even if you've done nothing wrong, your employer can fire you for having a side business in most states. At-will employment means they don't need a 'good' reason — just not an illegal one (discrimination, retaliation, etc.). This is why invisibility matters: the best protection is not being discovered.",
    what_to_do:
      "Understand that legal compliance alone doesn't guarantee job security. Your employer may fire you simply for having a side business, even if it doesn't violate any contract clause. This is why the entire Stealth Ops framework exists — prevention is better than legal arguments. Build your side business to the point where losing your job is an acceleration of your plan, not a catastrophe.",
    jurisdiction_notes:
      "At-will employment is the default in all US states except Montana. However, at-will doesn't override: (1) anti-discrimination laws, (2) whistleblower protections, (3) off-duty conduct protections (CA, CO, NY, ND), or (4) contractual protections you may have. If you have an employment contract with a fixed term or 'for cause' termination requirement, you have more protection than at-will employees.",
    example_language:
      '"Employee acknowledges that their employment is at-will, meaning either the Company or the Employee may terminate the employment relationship at any time, with or without cause, and with or without notice."',
  },
];
