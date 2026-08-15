#!/usr/bin/env python3
"""Create the new pricing-restructure prices on existing products.
Founder: $9/mo + $79/yr on the Starter product.
Stealth Pro: $29/mo on the Pro product.
Idempotent: checks for existing prices with our lookup_keys first.
"""
import json
import urllib.request
import urllib.parse
import base64

key = open("/tmp/ie_stripe_key.txt").read().strip()
auth = base64.b64encode(f"{key}:".encode()).decode()

def stripe(path, data=None):
    url = f"https://api.stripe.com{path}"
    body = urllib.parse.urlencode(data).encode() if data else None
    req = urllib.request.Request(url, data=body,
                                 headers={"Authorization": f"Basic {auth}"})
    return json.load(urllib.request.urlopen(req))

STARTER_PRODUCT = None
PRO_PRODUCT = None

# Resolve product IDs from the known current price IDs
p = stripe("/v1/prices/price_1TssJ0CwGoUDklRePDdyKpmX")  # $0.97 starter
STARTER_PRODUCT = p["product"]
p = stripe("/v1/prices/price_1TssJ1CwGoUDklRezd1Jqftu")  # $47 pro
PRO_PRODUCT = p["product"]
print(f"starter product: {STARTER_PRODUCT}")
print(f"pro product:     {PRO_PRODUCT}")

def ensure_price(lookup_key, product, unit_amount, interval):
    existing = stripe(f"/v1/prices?lookup_keys[]={lookup_key}&limit=1")
    if existing["data"]:
        pr = existing["data"][0]
        print(f"EXISTS  {lookup_key}: {pr['id']} ({pr['unit_amount']} usd/{interval})")
        return pr["id"]
    data = {
        "product": product,
        "unit_amount": str(unit_amount),
        "currency": "usd",
        "recurring[interval]": interval,
        "lookup_key": lookup_key,
        "nickname": lookup_key,
    }
    pr = stripe("/v1/prices", data)
    print(f"CREATED {lookup_key}: {pr['id']} ({pr['unit_amount']} usd/{interval})")
    return pr["id"]

founder_mo = ensure_price("ie_founder_monthly_900", STARTER_PRODUCT, 900, "month")
founder_yr = ensure_price("ie_founder_annual_7900", STARTER_PRODUCT, 7900, "year")
pro_mo = ensure_price("ie_stealthpro_monthly_2900", PRO_PRODUCT, 2900, "month")

# Rename products to match new tier naming
stripe(f"/v1/products/{STARTER_PRODUCT}", {"name": "Invisible Exit Founder (All 5 Tools)"})
stripe(f"/v1/products/{PRO_PRODUCT}", {"name": "Invisible Exit Stealth Pro (Coaching + Community)"})
print("products renamed")

out = {
    "STRIPE_STARTER_PRICE_ID": founder_mo,
    "STRIPE_FOUNDER_ANNUAL_PRICE_ID": founder_yr,
    "STRIPE_STANDARD_PRICE_ID": pro_mo,
}
with open("/tmp/ie_new_price_ids.json", "w") as f:
    json.dump(out, f, indent=2)
print(json.dumps(out, indent=2))
