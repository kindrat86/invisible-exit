#!/usr/bin/env python3
"""Static-page sweep for the pricing restructure ($0.97 -> $9, $47 Pro -> $29).
JSON-LD-safe: does whole-file phrase replacement, then re-validates every
<script type="application/ld+json"> block still parses.
"""
import json
import os
import re
import sys

RULES = [
    # FAQ rewrite fragments present in prerendered HTML (mirror src/ rewrites)
    ("The $0.97/month founding member price is a loss-leader, it costs more to serve each member than $0.97/month.",
     "The $9/month Founder price is an early-believer price, priced to be a no-brainer, not to maximize margin."),
    ("it costs more to serve each member than $0.97/month",
     "it is priced to be a no-brainer, not to maximize margin"),
    ("Is the $0.97/month price sustainable?", "Is the $9/month price sustainable?"),
    ("The $0.97 founding member price is", "The $9 founding member price is"),
    ("maximum risk is $0.97", "maximum risk is $9"),
    ("upgrade to Pro ($47/month)", "upgrade to Pro ($29/month)"),
    ("Pro: $47/month", "Pro: $29/month"),
    ("Pro</strong>: $47/month", "Pro</strong>: $29/month"),
    ("Founding Member: $0.97/month", "Founding Member: $9/month"),
    ("Founding Member</strong>: $0.97/month", "Founding Member</strong>: $9/month"),
    ("you keep $0.97/month even after founding", "you keep $9/month even after founding"),
    # Generic price strings
    ("$0.97/month", "$9/month"),
    ("$0.97/Month", "$9/Month"),
    ("$0.97/mo", "$9/mo"),
    (">$0.97<", ">$9<"),
    ("$0.97</span>", "$9</span>"),
    ("starts at $0.97", "starts at $9"),
    ("Plans start at $0.97", "Plans start at $9"),
    ("Pricing starts at $0.97", "Pricing starts at $9"),
    ("membership: $0.97", "membership: $9"),
    ('"price": "0.97"', '"price": "9"'),
    ('"price":"0.97"', '"price":"9"'),
    ('price: "0.97"', 'price: "9"'),
    ("From $0.97", "From $9"),
    ("from $0.97", "from $9"),
    ("for $0.97", "for $9"),
    ("at $0.97", "at $9"),
]

LDJSON_RE = re.compile(
    r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',
    re.DOTALL | re.IGNORECASE,
)

targets = sys.argv[1:]
changed, ld_errors = [], []

def sweep_file(path):
    try:
        with open(path, encoding="utf-8") as f:
            content = f.read()
    except (UnicodeDecodeError, OSError):
        return
    orig = content
    for old, new in RULES:
        content = content.replace(old, new)
    if content == orig:
        return
    # Validate JSON-LD blocks in HTML
    if path.endswith((".html", ".htm")):
        for m in LDJSON_RE.finditer(content):
            try:
                json.loads(m.group(1))
            except json.JSONDecodeError as e:
                ld_errors.append(f"{path}: {e}")
                return  # do NOT write a file with broken JSON-LD
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    changed.append(path)

SKIP_DIRS = {"node_modules", "dist", ".vercel", ".git"}
EXTS = {".html", ".htm", ".txt", ".xml", ".json", ".jsonl", ".md", ".css", ".svg", ".csv", ".js"}

for target in targets:
    if os.path.isfile(target):
        sweep_file(target)
        continue
    for dirpath, dirnames, filenames in os.walk(target):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if os.path.splitext(fn)[1] in EXTS:
                sweep_file(os.path.join(dirpath, fn))

print(f"Files changed: {len(changed)}")
for p in changed[:60]:
    print(" ", p)
if len(changed) > 60:
    print(f"  ... and {len(changed)-60} more")
if ld_errors:
    print("\nJSON-LD ERRORS (files NOT written):")
    for e in ld_errors:
        print(" ", e)
    sys.exit(1)
