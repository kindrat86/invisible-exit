#!/usr/bin/env python3
"""Audit current Stripe prices for invisibleexit (reads .env.local directly)."""
import json
import os
import urllib.request
import base64

env = {}
with open(os.path.join(os.path.dirname(__file__), "..", ".env.local")) as f:
    for line in f:
        line = line.strip()
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            env[k] = v.strip().strip('"').strip("'")

key = env.get("STRIPE_SECRET_KEY", "")
if not key.startswith("sk_"):
    key = open("/tmp/ie_stripe_key.txt").read().strip()
auth = base64.b64encode(f"{key}:".encode()).decode()

def get(path):
    req = urllib.request.Request(f"https://api.stripe.com{path}",
                                 headers={"Authorization": f"Basic {auth}"})
    return json.load(urllib.request.urlopen(req))

for name in ["STARTER", "FOUNDING", "STANDARD", "TRIPWIRE"]:
    pid = env.get(f"STRIPE_{name}_PRICE_ID", "")
    if not pid:
        print(f"{name}: NO ENV VAR")
        continue
    try:
        p = get(f"/v1/prices/{pid}")
        prod = get(f"/v1/products/{p['product']}")
        rec = p.get("recurring") or {}
        print(f"{name}: {p['unit_amount']} {p['currency']} "
              f"{rec.get('interval', 'one-time')} active={p['active']} "
              f"product='{prod['name']}' ({p['product']}) price_id={pid[:14]}...")
    except Exception as e:
        print(f"{name}: ERROR {e}")

# Also list all active recurring prices on the account tied to products with 'FYM'/'Invisible'/'Exit' in name
print("\n--- All active prices for invisible-exit-looking products ---")
prices = get("/v1/prices?active=true&limit=100&expand[]=data.product")
for p in prices["data"]:
    prod = p["product"]
    pname = prod["name"] if isinstance(prod, dict) else str(prod)
    if any(t in pname.lower() for t in ["fym", "invisible", "exit", "stealth", "freedom"]):
        rec = p.get("recurring") or {}
        print(f"  {p['id']} | {p['unit_amount']} {p['currency']} {rec.get('interval','one-time')} | {pname}")
