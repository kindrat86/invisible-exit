#!/usr/bin/env python3
"""Pricing restructure sweep: $0.97/mo -> $9/mo (Founder), $47/mo Pro -> $29/mo (Stealth Pro).
Ordered exact-phrase replacements. Story content ("a stranger paid me $0.97",
"$0.97 received", taxi moment) is intentionally NOT touched.
Run from repo root. Prints per-rule hit counts and files changed.
"""
import os
import sys

# Ordered rules: (old, new). Longest/most-specific first.
RULES = [
    # ── FAQ/claims rewrites (do these before generic price rules) ──
    ("The $0.97/month founding member price is a loss-leader — it costs more to serve each member than $0.97/month.",
     "The $9/month Founder price is an early-believer price — priced to be a no-brainer, not to maximize margin."),
    ("There isn't one. The $0.97 exists for one reason: I need founding members and case studies before the public launch. When we go public, the price goes to $9.99/month. You're locking in $0.97 for life — not a trial, not an intro rate. Your card gets charged $0.97 every month until you cancel.",
     "There isn't one. The $9 Founder rate exists for one reason: I need founding members and case studies before the public launch. When we go public, the price goes to $19/month. You're locking in $9 for life — not a trial, not an intro rate. Your card gets charged $9 every month until you cancel."),
    ("Yes. Founding members lock in $0.97/month for life. When founding closes, the price goes to $12/month. You keep $0.97 forever.",
     "Yes. Founding members lock in $9/month for life. When founding closes, the price goes to $19/month. You keep $9 forever."),
    ("After that, the price goes to $12/month permanently.",
     "After that, the price goes to $19/month permanently."),
    ("That's 99.7% off.", "That's 97% off."),
    # Affiliate math (30% commission)
    ("$0.97 plan earns you $0.29/month. Founding plan ($17.99) earns you $5.40/month per referral.",
     "$9 plan earns you $2.70/month. Founding plan ($17.99) earns you $5.40/month per referral."),
    ('{ refs: 10, plan: "Starter ($0.97)", monthly: "$2.90", annual: "$34.80" }',
     '{ refs: 10, plan: "Starter ($9)", monthly: "$27", annual: "$324" }'),
    ('plan: "Starter ($0.97)", perRef: "$0.29/mo"',
     'plan: "Starter ($9)", perRef: "$2.70/mo"'),
    # JV math
    ('buyers: 20, price: "$0.97", monthly: "$10", annual: "$116"',
     'buyers: 20, price: "$9", monthly: "$90", annual: "$1,080"'),
    ('buyers: 6, price: "$47", monthly: "$141", annual: "$1,692"',
     'buyers: 6, price: "$29", monthly: "$87", annual: "$1,044"'),
    # A/B test copy data
    ("($11.64/yr) next to monthly ($0.97/mo)", "($108/yr) next to monthly ($9/mo)"),
    ('description: "$0.97/month — equivalent to $11.64/', 'description: "$9/month — equivalent to $108/'),
    ('description: "$0.97/month (monthly only)"', 'description: "$9/month (monthly only)"'),
    # Alternatives/comparison data
    ('pricing: "$0.97 trial, $29/mo"', 'pricing: "$9/mo, $29/mo Pro"'),
    # Google conversion values
    ("trackGoogleConversion(0.97)", "trackGoogleConversion(9)"),
    ("trackGoogleConversion(17.99)", "trackGoogleConversion(17.99)"),  # no-op keep

    # ── Core price strings: $0.97 -> $9 ──
    ("$0.97/month", "$9/month"),
    ("$0.97/Month", "$9/Month"),
    ("$0.97/mo", "$9/mo"),
    ("Start for $0.97", "Start for $9"),
    ("$0.97 charged today", "$9 charged today"),
    ("maximum risk is $0.97", "maximum risk is $9"),
    ("try the system for $0.97", "try the system for $9"),
    ("Try the tools for $0.97", "Try the tools for $9"),
    ("The $0.97 plan is", "The $9 plan is"),
    ("than the $0.97 plan", "than the $9 plan"),
    ("the basic $0.97 membership", "the basic $9 membership"),
    ("$0.97 is an impulse buy", "$9 is an impulse buy"),
    ("locking in $0.97 for life", "locking in $9 for life"),
    ("Founding Member: $0.97", "Founding Member: $9"),
    (">$0.97<", ">$9<"),
    ('">$0.97</span>', '">$9</span>'),

    # ── Pro tier: $47 -> $29 (offer surfaces only) ──
    ("Pro ($47/mo)", "Pro ($29/mo)"),
    ("Pro ($47/month)", "Pro ($29/month)"),
    ("Pro: $47/month", "Pro: $29/month"),
    ("Pro at $47/month", "Pro at $29/month"),
    ("Pro tier at $47/mo", "Pro tier at $29/mo"),
    ("$47/mo Pro", "$29/mo Pro"),
    ("$47 Pro", "$29 Pro"),
    ("Pro Upgrade ($47)", "Pro Upgrade ($29)"),
    ("go Pro ($47)", "go Pro ($29)"),
    ("Upgrade to Pro — $47/mo", "Upgrade to Pro — $29/mo"),
    ("The $47/month kicks in", "The $29/month kicks in"),
    ("Group Coaching + Community ($47/month)", "Group Coaching + Community ($29/month)"),
    ("done-with-others support. $47/month.", "done-with-others support. $29/month."),
    (">$47<span", ">$29<span"),
    ("→ $47/mo →", "→ $29/mo →"),
    ("Standard members pay $47/mo for the same usage", "Standard members pay $29/mo for the same usage"),
    ('"Confirm $47/month"', '"Confirm $29/month"'),
    ('"$47/month"', '"$29/month"'),
    ("$470/year", "$290/year"),
    ("save $94", "save $58"),
    ("Save $94/year", "Save $58/year"),
    ("$94 vs monthly", "$58 vs monthly"),
    ("Lock in $290/year — save $58", "Lock in $290/year — save $58"),  # normalize after chained rules

    # ── Public-price anchor $97.99 -> $29 (new public Pro price is $29) ──
    ("$97.99/month", "$29/month"),
    ("$97.99/mo", "$29/mo"),
    ("$97.99 after 100 members", "$29 after 100 members"),
    ("the price is $97.99", "the price is $29"),
    ("saves you $960/year", "saves you $132/year"),
    ("(saves $960/year vs public)", "(saves $132/year vs public)"),
]

EXTS = {".tsx", ".ts", ".html", ".xml", ".json", ".md", ".txt", ".js"}
SKIP_DIRS = {"node_modules", "dist", ".vercel", ".git", "scripts"}

roots = sys.argv[1:] or ["src"]
hits = {old: 0 for old, _ in RULES}
changed_files = []

for root in roots:
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if os.path.splitext(fn)[1] not in EXTS:
                continue
            path = os.path.join(dirpath, fn)
            try:
                with open(path, encoding="utf-8") as f:
                    content = f.read()
            except (UnicodeDecodeError, OSError):
                continue
            orig = content
            for old, new in RULES:
                if old in content:
                    hits[old] += content.count(old)
                    content = content.replace(old, new)
            if content != orig:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
                changed_files.append(path)

print(f"Files changed: {len(changed_files)}")
for old, n in hits.items():
    if n:
        print(f"  {n:3d}x  {old[:70]}")
print("\nChanged files:")
for p in changed_files:
    print(" ", p)
