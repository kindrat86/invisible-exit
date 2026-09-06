# Moonlighting & Side-Business Clause Reference — Primary Source Research

Brand: Invisible Exit · Site: invisibleexit.com · Backlog order 5, research slices 1-2 (CA, WA, NY, TX, IL, CO, MA)
Research dates: 2026-09-03 and 2026-09-06 (each quote records its live verification date)
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
  (opinion PDF). Official courts.ca.gov opinion PDF not yet pulled — grab before publishing.
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

### Tex. Bus. & Com. Code § 15.50(a) — criteria for enforceability — VERIFIED via unofficial mirror
- source_url (captured this session, UNOFFICIAL 2023 mirror):
  https://law.justia.com/codes/texas/2023/business-and-commerce-code/title-2/chapter-15/subchapter-e/section-15-50/
  Universal citation shown: TX Bus & Com Code § 15.50 (2023).
- Official source NOT yet captured: https://statutes.capitol.texas.gov/Docs/BC/htm/BC.15.50.htm
  renders only a nav shell to this extractor (2 attempts), and statutes.legis.texas.gov gave a
  connect_error. Before publishing: verify quote against the official site (browser, not
  extractor) or law.justia is acceptable ONLY with the official cite confirmed elsewhere.
- Captured text: "(a) Notwithstanding Section 15.05 of this code, and subject to any applicable
  provision of Subsection (b), a covenant not to compete is enforceable if it is ancillary to
  or part of an otherwise enforceable agreement at the time the agreement is made to the extent
  that it contains limitations as to time, geographical area, and scope of activity to be
  restrained that are reasonable and do not impose a greater restraint than is necessary to
  protect the goodwill or other business interest of the promisee."
- PENDING: subsection (b) (court reformation of overbroad covenants) not captured; TX
  anti-moonlighting caselaw (Pharma-Serve/Elfield-style "additional employment" disputes is a
  memory, NOT a verified cite — do not use until pulled) not researched.
- Side-business relevance: TX is a reasonableness jurisdiction — an otherwise-enforceable
  agreement with a reasonably-scoped restraint CAN stand, unlike CA/WA. That contrast is the
  editorial spine of the TX page.
- last_verified: 2026-09-03

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

---

## Rejected / dead ends (do not cite)

- RCW 49.44.270: the live RCW site returns "Citation not found ... repealed, expired,
  decodified, or recodified" (https://app.leg.wa.gov/RCW/default.aspx?cite=49.44.270,
  checked 2026-09-03). If it ever fed an older draft, it is dead; do not resurrect.
- leginfo.legislature.ca.gov dotless section URLs (e.g. sectionNum=16600) render an
  empty JS shell in this extractor — always use the trailing-dot form and verify text present.

## Candidate sources for the NEXT research slice (UNVERIFIED — pull before believing)

- California: locate the official courts.ca.gov S147190 Supreme Court opinion artifact. The
  current official case page found in search is the superseded Court of Appeal decision; keep
  the Stanford full-opinion mirror until the Supreme Court artifact is verified.
- Texas: official § 15.50 text plus in-employment anti-moonlighting / duty-of-loyalty cases.
- Massachusetts: in-employment duty-of-loyalty and employee-invention statutes/cases; §24L alone
  only answers post-employment noncompetes.
- State 8: pick a state with a primary law explicitly addressing lawful off-duty employment,
  not another generic post-employment noncompete statute.
- Federal overlay: FTC noncompete rule status after the 2024 Texas litigation — must be
  re-verified from a primary court document before ANY federal mention is published.

## Verification checklist for the publishing tick

1. Re-pull every source_url above; confirm each captured quote still matches verbatim.
2. Close the remaining source gaps: official Edwards S147190 opinion, official Texas §15.50,
   Massachusetts in-employment authority, and one additional state with an off-duty-work law.
3. Cut any state whose core in-employment rule is not supported by primary authority; a
   post-employment noncompete statute alone does not answer whether a current employee may compete.
4. No dollar thresholds, dates, or case cites may appear on-page without a row in the
   § 5.1 machine-readable manifest pointing at the exact source_url.
5. § 5.7: any page published must displace an existing URL 1:1 — reuse a retired /data/ or
   state-family URL rather than adding net-new.
6. Every page carries last-verified dates per state. This is legal-adjacent: a wrong cite is
   the worst available failure mode; when uncertain, cut the claim, not the caveat.

## Coverage status

CA core statutes done (4 sources; official Edwards artifact still pending) · WA core statutes done
(5 sections plus session law) · NY statute + direct-competition duty-of-loyalty case done ·
IL selected current sections done · CO current session-law amendment done · MA post-employment
scope done but in-employment authority pending · TX official text/caselaw pending.
Seven states started; six have at least one official primary source. Nothing is published.
