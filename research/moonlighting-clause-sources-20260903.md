# Moonlighting & Side-Business Clause Reference — Primary Source Research

Brand: Invisible Exit · Site: invisibleexit.com · Backlog order 5, research slices 1-3 (CA, WA, NY, TX, IL, CO, MA, ND)
Research dates: 2026-09-03, 2026-09-06 and 2026-09-07 (each quote records its live verification date)
Guardrail: NOTHING in this file is publishable as-is. This is a source inventory only.
Publishing tick must re-pull each URL, quote-check, satisfy §5.1 (sourced numbers only),
§5.2 (dataset assertions) and §5.7 (1:1 URL displacement, zero net-new until week 14).

Legend: VERIFIED = text captured live this session. PARTIAL = heading/some text captured,
rest pending. PENDING = not captured. Never upgrade a status without a live re-pull.

---

## California

### CA Bus. & Prof. Code § 16600 — restraints on trade void — VERIFIED
- source_url: https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=16600.&lawCode=BPC
  (NOTE: needs the trailing dot after 16600; the dotless URL renders an empty shell)
- Captured text: "(a) Except as provided in this chapter, every contract by which anyone is
  restrained from engaging in a lawful profession, trade, or business of any kind is to that
  extent void." Subsection (b)(1): "This section shall be read broadly, in accordance with
  Edwards v. Arthur Andersen LLP (2008) 44 Cal.4th 937, to void the application of any
  noncompete agreement in an employment context, or any noncompete clause in an employment
  contract, no matter how narrowly tailored, that does not satisfy an exception in this chapter."
- Side-business relevance: a broad "you may not run any side business" clause is a restraint
  on "a lawful ... business of any kind" -> void in CA outside the statutory exceptions
  (sale of business / partnership / LLC dissolution: §§ 16601, 16602, 16602.5, per Edwards).
- last_verified: 2026-09-06

### CA Bus. & Prof. Code § 16600.5 — out-of-state contracts and remedies — VERIFIED
- source_url: https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=16600.5&lawCode=BPC
- Captured text: "Any contract that is void under this chapter is unenforceable regardless of
  where and when the contract was signed." An employer or former employer may not attempt to
  enforce such a contract even when it was signed and employment was maintained outside California.
  An employer may not enter into a contract containing a provision void under the chapter.
- Captured remedies: an employee, former employee, or prospective employee may seek injunctive
  relief, actual damages, or both; a prevailing claimant is entitled to reasonable attorney's
  fees and costs. The section identifies SB 699 and an effective date of January 1, 2024.
- Side-business relevance: the statute addresses attempts to enforce out-of-state restraints
  that are void under the California chapter. It does not by itself answer which worker or
  transaction has enough California connection, so the future tool must not present it as a
  universal choice-of-law rule.
- last_verified: 2026-09-06

### Cal. Lab. Code § 2870 — employee inventions excluded from assignment — VERIFIED
- source_url: https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=2870.&lawCode=LAB
- Captured subsection (a): an invention-assignment provision "shall not apply to an invention
  that the employee developed entirely on his or her own time without using the employer's
  equipment, supplies, facilities, or trade secret information" except inventions that either
  "(1) Relate at the time of conception or reduction to practice of the invention to the
  employer's business, or actual or demonstrably anticipated research or development of the
  employer; or (2) Result from any work performed by the employee for the employer."
- Captured subsection (b): a provision requiring assignment of an invention otherwise excluded
  by subsection (a) "is against the public policy of this state and is unenforceable."
- Side-business relevance: the statutory anchor for "my side project on my own time is mine",
  subject to the employer-business/R&D and employer-work exceptions above.
- last_verified: 2026-09-06

### Edwards v. Arthur Andersen LLP (2008) 44 Cal.4th 937 — VERIFIED via two mirrors
- source_urls: https://scocal.stanford.edu/opinion/edwards-v-arthur-andersen-33130/
  (Stanford SCOCAL mirror, full opinion text) and
  https://www.gmsr.com/wp-content/uploads/2016/06/Edwards-v-Arthur-Andersen-LLP-Opinion.pdf
  (opinion PDF). The former official archive URL
  https://www4.courts.ca.gov/opinions/archive/S147190.PDF returned an HTTP error on 2026-09-07,
  and the current courts.ca.gov search surfaced only the superseded Court of Appeal opinion.
  The original Supreme Court PDF remains available at
  https://cases.justia.com/california/supreme-court/S147190.PDF?ts=1462305080 and the Stanford
  SCOCAL page identifies it as docket S147190, filed August 7, 2008. Neither is an official
  courts.ca.gov host, so keep the official-artifact gap explicit rather than mislabeling a mirror.
- Captured holding: "We hold that the noncompetition agreement here is invalid under section
  16600, and we reject the narrow-restraint exception urged by Andersen. Noncompetition
  agreements are invalid under section 16600 in California even if narrowly drawn, unless they
  fall within the applicable statutory exceptions of sections 16601, 16602, or 16602.5."
  Also captured: "section 16600 prohibits employee noncompetition agreements unless the
  agreement falls within a statutory exception".
- Side-business relevance: kills the "our noncompete is only a tiny side-business ban so it's
  fine" argument in CA.
- last_verified: 2026-09-03

---

## Washington — strongest statute set found so far

Full chapter text cached at: ~/.hermes/cache/web/app.leg.wa.gov-044aa3638a.md

### RCW 49.62.070 — "Employees having an additional job — When authorized" — VERIFIED
- source_url: https://app.leg.wa.gov/RCW/default.aspx?cite=49.62.070
- Captured text: "(1) Subject to subsection (2) of this section, an employer may not restrict,
  restrain, or prohibit an employee earning less than twice the applicable state minimum
  hourly wage from having an additional job, supplementing their income by working for another
  employer, working as an independent contractor, or being self-employed."
- Captured exceptions in subsection (2): the protection does not apply when the specific
  additional services raise safety issues for the employee, coworkers, or public, or interfere
  with the employer's reasonable and normal scheduling expectations. It also preserves existing
  obligations including the common-law duty of loyalty, conflict-of-interest law, and policies
  addressing those obligations.
- Side-business relevance: this is the single most on-point statute found for the asset —
  a direct statutory right to a side job / self-employment below the wage threshold, subject to
  the safety, scheduling, loyalty and conflict exceptions.
- last_verified: 2026-09-06

### RCW 49.62.010 — definitions — VERIFIED
- source_url: https://app.leg.wa.gov/RCW/default.aspx?cite=49.62.010
- Captured: '"Noncompetition covenant" includes every written or oral covenant, agreement, or
  contract by which an employee or independent contractor is prohibited or restrained from
  engaging in a lawful profession, trade, or business of any kind.' Does NOT include
  nonsolicitation agreements, confidentiality agreements, or trade-secret covenants.
- Effective-2027-06-30 version adds (d): noncompetition covenant includes any provision that
  "threatens, demands, requires, or otherwise effectuates that an individual return, repay, or
  forfeit any right, benefit, or compensation, as a consequence of the individual engaging in a
  lawful profession, trade, or business of any kind" (training-repayment-style clauses).
- last_verified: 2026-09-03

### RCW 49.62.020 — when void — VERIFIED (both versions)
- source_url: https://app.leg.wa.gov/RCW/default.aspx?cite=49.62.020
- Captured (current, until 2027-06-30): duration >18 months post-termination is "presume[d]
  ... unreasonable and unenforceable"; rebuttable by clear and convincing evidence.
- Captured (effective 2027-06-30, 2026 c 149): "(1) Beginning on June 30, 2027, all
  noncompetition covenants are void and unenforceable regardless of when the parties entered
  into the noncompetition covenant. (2) It is a violation of this chapter for an employer to
  enforce, attempt to enforce, or threaten to enforce ... any noncompetition covenant".
- Headline research finding (verify session-law chapter cite 2026 c 149 on next pull): WA moves
  from a wage-threshold regime to a full ban on noncompetition covenants on 2027-06-30.
- last_verified: 2026-09-03

### RCW 49.62.050 — out-of-state forum/choice-of-law carve-outs void — VERIFIED
- source_url: https://app.leg.wa.gov/RCW/default.aspx?cite=49.62.050
- Captured: a provision in a noncompetition covenant signed by a Washington-based employee or
  contractor is void if it "(1) ... requires ... adjudicate [a] noncompetition covenant outside
  of this state; (2) ... deprives ... of the protections or benefits of this chapter; or
  (3) ... allows or requires the application of choice of law principles or the substantive law
  of any jurisdiction other than Washington state."
- Side-business relevance: a WA employee moonlighting via a contract written in another state's
  law keeps RCW 49.62 protections.
- last_verified: 2026-09-03

### RCW 49.62.080 — remedies — VERIFIED
- source_url: https://app.leg.wa.gov/RCW/default.aspx?cite=49.62.080
- Captured current text: the attorney general may pursue any and all relief; a person aggrieved
  by a noncompetition covenant may bring an action. A violating party must pay the greater of
  actual damages or the section's statutory penalty, plus reasonable attorney's fees, expenses
  and costs. The current version applies the same remedy when a court or arbitrator reforms,
  rewrites, modifies or partially enforces a covenant.
- Captured future version, effective June 30, 2027: the private action and remedy apply to a
  person aggrieved by a violation of the chapter, not only to a noncompetition covenant.
- Numeric publication caution: the captured penalty is $5,000, but any future page must source
  that figure directly in the §5.1 manifest and re-pull both effective versions.
- last_verified: 2026-09-06

---

## New York

### NY Lab. Law § 201-d — lawful activities protection — VERIFIED
- source_url: https://www.nysenate.gov/legislation/laws/LAB/201-D
- Captured definition: '"Recreational activities" shall mean any lawful, leisure-time activity,
  for which the employee receives no compensation and which is generally engaged in for
  recreational purposes ...'.
- Captured operative subsection (2): the employer anti-discrimination rule covers listed
  political activities, legal consumable-product use, legal recreational activities, union
  membership/rights, and refusal to attend or consume specified employer speech about political
  or religious matters. It does not list paid outside work as a protected category.
- Captured subsection (3)(a): subsection (2) does not protect activity that "creates a material
  conflict of interest related to the employer's trade secrets, proprietary information or other
  proprietary or business interest." Other subsection (3) exceptions cover specified public
  employees, collective-bargaining restrictions, and certain professional obligations.
- ANALYSIS (keep labeled): a compensated side business does not meet the "receives no
  compensation" element of "recreational activities", so § 201-d should not be presented as a
  shield for paid moonlighting. NY paid moonlighting instead turns on contract terms and the
  common-law duty of loyalty; see Anderson v Anderson below.
- last_verified: 2026-09-06

### Anderson v Anderson, 120 A.D.3d 1559 (4th Dep't 2014) — VERIFIED
- source_url: https://nycourts.gov/reporter/3dseries/2014/2014_06415.htm
- Official source: New York State Law Reporting Bureau, 2014 NY Slip Op 06415.
- Captured holding: an employment relationship carried corresponding duties of loyalty; the
  employee breached that duty by opening a business in direct competition with the employer.
  The court stated: "An employee may not compete with his [or her] employer's business during
  the time of his [or her] employment."
- Side-business relevance: this is a direct primary-opinion anchor for the line between merely
  preparing a side venture and operating a directly competing business during employment.
- last_verified: 2026-09-06

---

## Texas

### Tex. Bus. & Com. Code § 15.50(a) — criteria for enforceability — VERIFIED on official legislative host
- source_url: https://tcss.legis.texas.gov/resources/bc/htm/bc.15.htm#15.50
- Official source host: Texas Constitution and Statutes / Texas Legislative Council. The older
  statutes.capitol.texas.gov deep links returned only the navigation shell to the extractor;
  the tcss.legis.texas.gov resource exposed the current statutory text on 2026-09-07.
- Captured current subsection (a): "Notwithstanding Section 15.05 and subject to any applicable
  provision of Subsection (b) and Section 15.501, a covenant not to compete is enforceable if it
  is ancillary to or part of an otherwise enforceable agreement at the time the agreement is
  made to the extent that it contains limitations as to time, geographical area, and scope of
  activity to be restrained that are reasonable and do not impose a greater restraint than is
  necessary to protect the goodwill or other business interest of the promisee."
- Currency correction: the 2023 mirror captured in slice 1 predates the 2025 amendment. The
  current text adds the cross-reference to § 15.501, and the official history records S.B. 1318
  as effective September 1, 2025. Never publish the old quote as current law.
- Side-business relevance: § 15.50 governs enforceability of covenants not to compete. It does
  not itself create permission to compete with an employer while still employed.
- last_verified: 2026-09-07

### Navigant Consulting, Inc. v. Wilkinson, 508 F.3d 277 (5th Cir. 2007) — VERIFIED
- source_url: https://www.ca5.uscourts.gov/Opinions/pub/06/06-11071-CV0.wpd.pdf
- Official source: published Fifth Circuit opinion, No. 06-11071, revised December 13, 2007,
  applying Texas law to employees who planned and acted toward a competing venture while employed.
- Captured rule: an at-will employee may plan to compete, take active preparatory steps while
  employed, and generally need not disclose those plans. The opinion then quotes Johnson v.
  Brewer & Pritchard, P.C., 73 S.W.3d 193, 202 (Tex. 2002), for the limits: the employee may not
  appropriate trade secrets, solicit the employer's customers while still employed, carry away
  customer lists, or pursue future interests at the employer's expense using employer funds or
  employees or conduct designed to hurt the employer.
- Captured application: the court held the evidence sufficient for a jury to find breach where
  trusted employees attempted to sell their employer's practice for personal gain, disclosed
  confidential information, solicited employees, and used a lease they negotiated for the
  employer as leverage. The court affirmed the judgment except for remanding the fee award.
- Side-business relevance: this supplies the missing Texas line between permissible preparation
  and disloyal in-employment conduct. It does not mean every Texas employee is a fiduciary; the
  opinion expressly analyzes employees in a relationship of trust and confidence.
- last_verified: 2026-09-07

---

## Illinois

### 820 ILCS 90 — Illinois Freedom to Work Act — VERIFIED (selected current sections)
- source_url: https://ilga.gov/Legislation/ILCS/Articles?ActID=3737&ChapterID=68&Print=True
- Correction to the candidate list: the current Act is codified at **820 ILCS 90**, not
  745 ILCS 42. Do not propagate the earlier candidate citation.
- Captured §10: an employer may not enter a covenant not to compete unless the employee's
  actual or expected annualized earnings exceed the statutory threshold; a covenant violating
  that rule is void and unenforceable. The official text schedules threshold changes over time.
- Captured §15: even where the earnings gate is met, a covenant is illegal and void unless it
  has adequate consideration, is ancillary to a valid employment relationship, is no greater
  than required for a legitimate business interest, does not impose undue hardship, and is not
  injurious to the public.
- Captured §20: the employer must advise the employee in writing to consult an attorney and
  provide the covenant before employment begins or provide the statutory review period.
- Side-business relevance: the Act's definition focuses on restrictions after termination.
  It does not itself create a general right to operate a competing business during employment.
- Numeric publication caution: do not publish earnings amounts or review-period length until
  they are re-pulled into the machine-readable manifest, because the official text has dated
  step-ups and recent amendments.
- last_verified: 2026-09-06

---

## Colorado

### Colo. Rev. Stat. § 8-2-113 as amended by SB25-083 — VERIFIED via official session law
- source_urls: https://leg.colorado.gov/laws/session-laws/SB25-083/366/download and
  https://leg.colorado.gov/bills/sb25-083
- Official status page: SB25-083 became law; chapter 366 has an effective date of August 6, 2025.
- Captured amended subsection (2)(a): except for enumerated exceptions, a covenant not to
  compete that restricts an individual's right to receive compensation for labor is void.
- Captured principal exception: a covenant for a highly compensated worker can survive only
  when it protects trade secrets and is no broader than reasonably necessary for that interest;
  the amendment separately limits covenants affecting specified health-care practices.
- Captured subsection (3): permitted categories include reasonable confidentiality/trade-secret
  provisions and sale-of-business covenants, with conditions in the statutory text.
- Side-business relevance: this is a strong default against compensation-restricting covenants,
  but the trade-secret, sale, and other enumerated exceptions prevent a simple yes/no answer.
- Numeric publication caution: the statute incorporates a changing "highly compensated worker"
  threshold. Do not publish a dollar value without a same-day source and manifest row.
- last_verified: 2026-09-06

---

## Massachusetts

### Mass. Gen. Laws ch. 149, § 24L — VERIFIED for scope; details need publishing-day re-pull
- source_url: https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXXI/Chapter149/Section24l
- Captured definition: a "noncompetition agreement" is one arising from an employment
  relationship under which the employee agrees not to engage in specified competitive
  activities **after the employment relationship has ended**. The definition excludes several
  other agreement types, including employee/customer nonsolicitation, confidentiality and
  sale-of-business agreements.
- Captured worker exclusions: the section says noncompetition agreements are not enforceable
  against specified groups including nonexempt employees, student interns, employees terminated
  without cause or laid off, and employees age 18 or younger.
- Side-business relevance: §24L mainly regulates post-employment noncompetition agreements. It
  should not be presented as statutory permission to run a concurrent competing side business.
  A Massachusetts page still needs primary authority on in-employment loyalty and invention/IP
  assignment before it can answer the asset's core question.
- Numeric publication caution: do not publish notice periods, duration limits, ages or garden-
  leave formulas until the entire current section is re-pulled into the §5.1 manifest.
- last_verified: 2026-09-06

### Chelsea Industries, Inc. v. Gaffney, 389 Mass. 1 (1983) — VERIFIED
- source_url: https://www.masscasesarchive.com/masscases.com/cases/sjc/389/389mass1.html
- Source: full Supreme Judicial Court opinion in the Massachusetts Cases Archive, linked to the
  Commonwealth's Trial Court Law Libraries. The opinion identifies the court, citation, dates and
  participating justices; use the official reporter citation rather than treating a case summary
  as authority.
- Captured rule: trusted executive employees "owe a duty of loyalty to their employer and must
  protect the interests of the employer." The court states that an executive employee is "barred
  from actively competing with his employer during the tenure of his employment, even in the
  absence of an express covenant so providing."
- Captured application: the court upheld the finding that the executives breached their duty by
  using their positions, employer resources and customer relationships while establishing a
  competing business. The opinion also recognizes forfeiture of compensation as a possible remedy
  for disloyal conduct even without proof of actual injury.
- Side-business relevance: this closes the Massachusetts in-employment gap for trusted executives.
  It does not establish that every employee owes the same fiduciary duty, and § 24L still concerns
  post-employment covenants rather than permission to compete during employment.
- last_verified: 2026-09-07

---

## North Dakota

### N.D. Cent. Code §§ 14-02.4-03 and 14-02.4-08 — lawful off-duty activity — VERIFIED
- source_url: https://ndlegis.gov/cencode/t14c02-4.pdf
- Official source: current North Dakota Century Code chapter 14-02.4 PDF on ndlegis.gov.
- Captured § 14-02.4-03(1): it is a discriminatory practice to refuse to hire, discharge, or give
  adverse or unequal treatment concerning listed employment terms because of "participation in
  lawful activity off the employer's premises during nonworking hours which is not in direct
  conflict with the essential business-related interests of the employer."
- Captured § 14-02.4-08 exception: an employer may act when the otherwise protected lawful activity
  is contrary to a bona fide occupational qualification that reasonably and rationally relates to
  the duties of a particular employee or employee group rather than all employees.
- Scope caution: the chapter does not define "lawful activity" as a side business specifically.
  Future Invisible Exit copy may say the text is broad enough to require analysis of off-duty work,
  but must not promise that a competing business is protected. Direct conflict with essential
  business interests and the occupational-qualification exception remain fact-specific limits.
- last_verified: 2026-09-07

---

## Rejected / dead ends (do not cite)

- RCW 49.44.270: the live RCW site returns "Citation not found ... repealed, expired,
  decodified, or recodified" (https://app.leg.wa.gov/RCW/default.aspx?cite=49.44.270,
  checked 2026-09-03). If it ever fed an older draft, it is dead; do not resurrect.
- leginfo.legislature.ca.gov dotless section URLs (e.g. sectionNum=16600) render an
  empty JS shell in this extractor — always use the trailing-dot form and verify text present.

## Candidate sources for the NEXT research slice (UNVERIFIED — pull before believing)

- California: the former official S147190 archive URL is dead and the current official search
  surfaced only the superseded appellate opinion. Ask the California Supreme Court archive or
  preserve the original-opinion mirrors with the source limitation explicit.
- North Dakota: find controlling state appellate interpretation of "lawful activity" and "direct
  conflict" before claiming the chapter covers a paid side business rather than off-duty conduct
  generally.
- States 9-10: select only states with primary statutes expressly covering lawful off-duty work or
  outside employment, not more generic post-employment noncompete statutes.
- Federal overlay: FTC noncompete rule status after the 2024 Texas litigation — must be
  re-verified from a primary court document before ANY federal mention is published.

## Verification checklist for the publishing tick

1. Re-pull every source_url above; confirm each captured quote still matches verbatim.
2. Keep the California official-artifact limitation explicit unless the Supreme Court archive
   supplies S147190; do not substitute the superseded appellate opinion.
3. Find controlling North Dakota interpretation before treating "lawful activity" as a blanket
   shield for paid moonlighting; cut any state whose core rule lacks primary authority.
4. No dollar thresholds, dates, or case cites may appear on-page without a row in the
   § 5.1 machine-readable manifest pointing at the exact source_url.
5. § 5.7: any page published must displace an existing URL 1:1 — reuse a retired /data/ or
   state-family URL rather than adding net-new.
6. Every page carries last-verified dates per state. This is legal-adjacent: a wrong cite is
   the worst available failure mode; when uncertain, cut the claim, not the caveat.

## Coverage status

CA core statutes done (4 sources; official Edwards artifact unavailable on the migrated archive) ·
WA core statutes done (5 sections plus session law) · NY statute + direct-competition duty-of-loyalty
case done · TX current official statute + federal appellate Texas-law case done · IL selected current
sections done · CO current session-law amendment done · MA post-employment statute + in-employment
trusted-executive case done · ND off-duty-activity statute done, judicial scope pending.
Eight states started; all eight have at least one official or primary-law source. Nothing is published.
