#!/usr/bin/env python3
"""
Manual diagnostic: check a sample of sitemap URLs for 5xx responses.

This is a manual diagnostic tool, NOT a production monitor. It does not run on a
schedule, does not alert anyone, and does not persist results. Invoke it by hand
when investigating a suspected 5xx incident.

Important caveats:
- Uses HEAD requests by default. A successful HEAD response proves the server
  returns a non-5xx status code for that method+URL, but does NOT prove that
  Googlebot GET requests or JavaScript rendering would produce the same outcome.
- Samples URLs from the sitemap index. A clean sample does not guarantee all
  888 routes are healthy, it only proves the sampled subset is clean.
- Reports network failures (DNS, timeout, connection refused) separately from
  HTTP 5xx responses. Both are surfaced; only 5xx exits with code 1.

Exit codes:
  0, No 5xx found in sampled URLs (network failures may still exist).
  1, At least one HTTP 5xx response was found.
  2, A network-level failure prevented reliable checking (child sitemap
      unreachable, sitemap index unreachable, DNS failure). Fix the network
      issue and re-run.

Usage:
  python3 scripts/check-sitemap-5xx.py [--count N] [--full]
  --count N   Check N URLs (default 50, max 200)
  --full       Check ALL sitemap URLs (respectful rate limiting)
"""
import urllib.request
import urllib.error
import ssl
import sys
import os
import time
import random
import xml.etree.ElementTree as ET

SITEMAP_INDEX = "https://invisibleexit.com/sitemap.xml"
UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
ctx = ssl.create_default_context()


def get_all_urls():
    """
    Download sitemap index and all child sitemaps.

    Returns (urls, failures) where `urls` is a sorted deduplicated list of URLs
    and `failures` is a list of (child_sitemap_url, error_message) for any child
    sitemap that could not be fetched or parsed.
    """
    try:
        req = urllib.request.Request(SITEMAP_INDEX, headers={"User-Agent": UA})
        resp = urllib.request.urlopen(req, timeout=30, context=ctx)
        root = ET.fromstring(resp.read())
    except Exception as e:
        print(f"FATAL: Cannot fetch sitemap index {SITEMAP_INDEX}: {e}",
              file=sys.stderr)
        sys.exit(2)

    ns = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls = set()
    failures = []

    for sm in root.findall('.//ns:sitemap/ns:loc', ns):
        sm_url = sm.text.strip()
        try:
            req2 = urllib.request.Request(sm_url, headers={"User-Agent": UA})
            resp2 = urllib.request.urlopen(req2, timeout=30, context=ctx)
            sm_root = ET.fromstring(resp2.read())
            for loc in sm_root.findall('.//ns:url/ns:loc', ns):
                urls.add(loc.text.strip())
        except Exception as e:
            failures.append((sm_url, str(e)))

    return sorted(urls), failures


def check_url(url):
    """Returns (url, http_status, error_string_or_None)."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA},
                                     method="HEAD")
        resp = urllib.request.urlopen(req, timeout=15, context=ctx)
        return (url, resp.status, None)
    except urllib.error.HTTPError as e:
        return (url, e.code, None)
    except urllib.error.URLError as e:
        return (url, 0, f"Network error: {e.reason}")
    except Exception as e:
        return (url, 0, f"Error: {e}")


def main():
    count = 50
    full = False
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == '--count' and i + 1 < len(args):
            count = min(int(args[i + 1]), 200)
            i += 2
        elif args[i] == '--full':
            full = True
            i += 1
        else:
            i += 1

    urls, child_failures = get_all_urls()

    # Child sitemap fetch failures are a network-level problem, exit 2.
    if child_failures:
        print(f"\nNETWORK FAILURE: {len(child_failures)} child sitemap(s) "
              f"could not be fetched:", file=sys.stderr)
        for sm_url, err in child_failures:
            print(f"  {sm_url}: {err}", file=sys.stderr)
        print("\nCannot reliably check URLs when child sitemaps are "
              "unreachable. Fix the network issue and re-run.", file=sys.stderr)
        sys.exit(2)

    if full:
        sample = urls
    else:
        random.seed(int(time.time()))
        n_head = max(20, count // 3)
        n_tail = count - n_head
        # Take first N + random sample from the rest, then dedupe.
        head = urls[:n_head]
        if len(urls) > n_head + 1:
            tail = random.sample(urls[n_head:], min(n_tail, len(urls) - n_head))
        else:
            tail = []
        sample = list(dict.fromkeys(head + tail))

    network_errors = []
    http_5xx = []
    other_issues = []

    for idx, url in enumerate(sample):
        url, status, err = check_url(url)
        if status == 0:
            network_errors.append((url, err))
        elif 500 <= status < 600:
            http_5xx.append((url, status))
        elif status >= 400:
            other_issues.append((url, status))

        if (idx + 1) % 20 == 0:
            print(f"  {idx + 1}/{len(sample)} checked...", file=sys.stderr)
        time.sleep(0.15)

    print(f"\nChecked: {len(sample)} URLs (HEAD, Googlebot UA)")
    print(f"HTTP 5xx:  {len(http_5xx)}")
    print(f"Network errors: {len(network_errors)}")
    print(f"Non-5xx issues (4xx): {len(other_issues)}")

    if http_5xx:
        print(f"\n=== 5xx URLs ===")
        for url, status in http_5xx:
            print(f"  HTTP {status} | {url}")
        sys.exit(1)

    if network_errors:
        print(f"\n=== Network errors ===")
        for url, err in network_errors:
            print(f"  {url}: {err}")
        sys.exit(2)

    print("No 5xx found in sample.\n"
          "Caveat: HEAD-only test; does not verify Googlebot GET/rendering.")
    sys.exit(0)


if __name__ == '__main__':
    main()
