#!/usr/bin/env python3
"""
Fix fabricated first-party research claims in src/data/data-reports.ts.

Found 2026-07-25 by running churnlens's provenance gate
(~/churnlens/scripts/check_provenance_claims.py --root ~/invisible-exit)
across the portfolio.

WHAT WAS FALSE
--------------
Four of the five data reports asserted original research this site never did.
All four render live under /data/<slug> and are syndicated into public/llms.txt
and public/llms-full.txt, which is what AI crawlers ingest:

  * "We analyzed revenue data from 500+ solo-founded SaaS businesses"
  * "Original data on micro-SaaS revenue benchmarks"
  * "proprietary survey of 1,200 employed professionals earning $100K+"
  * "Stripe payment data (anonymized)" / "Stripe anonymized data"
  * "founder surveys" (x3)
  * "We analyzed 300+ bootstrapped micro-SaaS products"

Invisible Exit ran no surveys and has no access to private Stripe payment data.

WHAT STAYS
----------
The numbers themselves, and the genuinely public sources already named:
Baremetrics Open Startups, Indie Hackers milestones, Stripe Atlas *reports*
(public), MicroAcquire/Flippa listings, US Census non-employer statistics, BLS,
Upwork Freelance Forward, Bankrate. Only the attribution changes - from
"we measured this" to "compiled from public sources; editorial estimates".

`non-compete-enforcement-by-state` is left ALONE: its methodology cites state
statutes, the FTC rule and ABA case-law summaries, which is legitimate.

Idempotent. Run from ~/invisible-exit.
"""
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "src/data/data-reports.ts"

DISCLAIMER = (
    " Invisible Exit ran no surveys and has no access to private payment data; "
    "these are editorial estimates compiled from public figures, so verify any "
    "number against its primary source before relying on it."
)

# (description, exact substring to find, replacement)
EDITS = [
    (
        "report1 metaDescription: 'Original data' + '500+'",
        "Original data on micro-SaaS revenue benchmarks. Average MRR by niche, age, pricing tier, and team size. Based on 500+ bootstrapped SaaS businesses.",
        "Micro-SaaS revenue benchmarks: indicative MRR ranges by niche, age, pricing tier, and team size, compiled from publicly available sources.",
    ),
    (
        "report1 intro: 'We analyzed ... 500+' + 'first comprehensive'",
        "How much do bootstrapped micro-SaaS businesses actually make? We analyzed revenue data from 500+ solo-founded SaaS businesses to create the first comprehensive benchmark report for the micro-SaaS category.",
        "How much do bootstrapped micro-SaaS businesses actually make? This report compiles indicative revenue benchmarks for the micro-SaaS category from publicly available sources. The figures are editorial estimates, not first-party research - see the methodology below.",
    ),
    (
        "report1 methodology: drop 'founder surveys'",
        "Data collected from public SaaS metrics dashboards (Baremetrics, Stripe Atlas reports, Indie Hackers milestones), founder surveys, and acquired business listings on MicroAcquire and Flippa between January 2024 and June 2026. All businesses are bootstrapped or pre-seed with under 5 employees.",
        "Compiled from publicly available sources: openly published SaaS metrics dashboards (Baremetrics Open Startups, Indie Hackers milestones), Stripe Atlas reports, and acquired-business listings on MicroAcquire and Flippa, January 2024 to June 2026. Businesses referenced are bootstrapped or pre-seed with under 5 employees."
        + DISCLAIMER,
    ),
    (
        "report2 metaDescription: 'most comprehensive'",
        "50+ statistics on side businesses in 2026. Revenue, failure rates, demographics, time investment, and success factors. The most comprehensive side business data report.",
        "50+ statistics on side businesses in 2026. Revenue, failure rates, demographics, time investment, and success factors, each traced to a public source.",
    ),
    (
        "report2 intro: 'definitive reference'",
        "We compiled 50+ statistics from government data, industry surveys, and academic research to create the definitive reference on side business economics.",
        "We compiled 50+ statistics from government data, published industry surveys, and academic research into a single reference on side business economics.",
    ),
    (
        "report2 methodology: drop the invented 1,200-person proprietary survey",
        "Data compiled from US Census Bureau non-employer statistics, Bureau of Labor Statistics, Upwork Freelance Forward report, Bankrate side hustle survey, Stripe Atlas data, and proprietary survey of 1,200 employed professionals earning $100K+ who operate a side business.",
        "Compiled from published sources: US Census Bureau non-employer statistics, Bureau of Labor Statistics, the Upwork Freelance Forward report, the Bankrate side-hustle survey, and Stripe Atlas data. Invisible Exit ran no survey of its own; every figure here restates a public source, so check that source before relying on it.",
    ),
    (
        "report4 intro: 'We analyzed 300+'",
        "Stop guessing your pricing. We analyzed 300+ bootstrapped micro-SaaS products to determine what solo founders actually charge, and what converts. This report gives you the data to price with confidence.",
        "Stop guessing your pricing. This report compiles publicly listed pricing from bootstrapped micro-SaaS products to show what solo founders actually charge. The figures are editorial estimates drawn from public pricing pages, not first-party research.",
    ),
    (
        "report4 methodology: drop Stripe payment data + founder surveys",
        "Pricing data collected from 300+ micro-SaaS pricing pages, Stripe payment data (anonymized), MicroAcquire listings, and founder surveys. All products are solo-founded or under 3 people, bootstrapped, and generating $500-$50K MRR.",
        "Compiled from publicly visible micro-SaaS pricing pages and MicroAcquire listings. Products referenced are solo-founded or under 3 people, bootstrapped, and generating $500-$50K MRR."
        + DISCLAIMER,
    ),
    (
        "report5 metaDescription: 'against real data'",
        "Benchmark your churn against real data.",
        "Benchmark your churn against published figures.",
    ),
    (
        "report5 methodology: drop Stripe anonymized data + founder surveys",
        "Churn data collected from 400+ SaaS businesses via Baremetrics open startups, Stripe anonymized data, founder surveys, and public metrics dashboards. Monthly churn calculated as (customers lost in month / customers at start of month).",
        "Compiled from openly published metrics: Baremetrics Open Startups and other public founder dashboards. Monthly churn is calculated as (customers lost in month / customers at start of month)."
        + DISCLAIMER,
    ),
]


def main() -> int:
    if not SRC.is_file():
        print(f"ERROR: {SRC} not found", file=sys.stderr)
        return 1
    text = SRC.read_text(encoding="utf-8")
    orig = text
    applied, already = [], []

    for label, find, repl in EDITS:
        if find in text:
            text = text.replace(find, repl, 1)
            applied.append(label)
        elif repl.split(".")[0] in text:
            already.append(label)
        else:
            print(f"  !! NOT FOUND, and replacement absent: {label}", file=sys.stderr)
            return 1

    if text != orig:
        SRC.write_text(text, encoding="utf-8")

    for a in applied:
        print(f"  fixed   {a}")
    for a in already:
        print(f"  ok      {a} (already clean)")

    banned = [
        "We analyzed revenue data from 500+",
        "proprietary survey of 1,200",
        "Stripe payment data (anonymized)",
        "Stripe anonymized data",
        "founder surveys",
        "Original data on micro-SaaS",
        "We analyzed 300+",
    ]
    leaks = [b for b in banned if b in text]
    if leaks:
        print(f"\nFAIL: still present: {leaks}", file=sys.stderr)
        return 1
    print(f"\nOK - {len(applied)} edit(s). No fabricated first-party research remains.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
