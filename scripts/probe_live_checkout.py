#!/usr/bin/env python3
"""Probe live invisibleexit.com checkout: create sessions, then read amounts via Stripe API."""
import json
import urllib.request
import base64
import time

key = open("/tmp/ie_stripe_key.txt").read().strip()
auth = base64.b64encode(f"{key}:".encode()).decode()

def stripe_get(path):
    req = urllib.request.Request(f"https://api.stripe.com{path}",
                                 headers={"Authorization": f"Basic {auth}"})
    return json.load(urllib.request.urlopen(req))

def create_session(tier):
    body = json.dumps({"tier": tier}).encode()
    req = urllib.request.Request(
        "https://invisibleexit.com/api/create-checkout",
        data=body,
        headers={"Content-Type": "application/json",
                 "Origin": "https://invisibleexit.com"},
        method="POST",
    )
    try:
        resp = json.load(urllib.request.urlopen(req, timeout=30))
        return resp.get("url", "")
    except Exception as e:
        return f"ERROR: {e}"

results = {}
for tier in ["starter", "standard", "founding"]:
    url = create_session(tier)
    results[tier] = url
    print(f"{tier}: {url[:80] if url else 'EMPTY'}")
    time.sleep(1)

# Now list the most recent checkout sessions and print their line items
print("\n--- Recent checkout sessions ---")
sessions = stripe_get("/v1/checkout/sessions?limit=6")
for s in sessions["data"]:
    li = stripe_get(f"/v1/checkout/sessions/{s['id']}/line_items")
    items = ", ".join(f"{i['description']} x{i['quantity']} = {i['amount_total']}" for i in li["data"])
    print(f"{s['id'][:30]} | mode={s['mode']} | total={s['amount_total']} {s['currency']} | meta={s.get('metadata')} | [{items}]")
