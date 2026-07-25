#!/usr/bin/env python3
"""
SEO/GEO Automation Agent for invisibleexit.com
Runs via GitHub Actions, powered by GLM-5.2 via z.ai API.
Replaces anthropics/claude-code-action.
"""
import os
import sys
import json
import urllib.request
import urllib.error
import subprocess
import re
from datetime import datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
INSTRUCTIONS_FILE = REPO_ROOT / ".github" / "seo-geo-automation" / "claude.md"
MEMORY_FILE = REPO_ROOT / ".github" / "seo-geo-automation" / "memory.md"
GOTCHAS_FILE = REPO_ROOT / ".github" / "seo-geo-automation" / "gotchas.md"
CHANGELOG_FILE = REPO_ROOT / "SEO_CHANGELOG.md"
GLM_API_URL = "https://api.z.ai/api/coding/paas/v4/chat/completions"
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
# DeepSeek retired the `deepseek-chat` alias — /v1/models now serves only
# deepseek-v4-pro and deepseek-v4-flash, and the old name 400s. Both are
# reasoning models, so reasoning tokens eat into the same output budget as
# the JSON answer (see TruncatedResponse below).
DEEPSEEK_MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-pro")

AUDIT_MODE = os.environ.get("AUDIT_MODE", "daily")
DATE = datetime.now().strftime("%Y-%m-%d")


class TruncatedResponse(RuntimeError):
    """Model stopped because it hit max_tokens — the JSON object is incomplete."""

    def __init__(self, content: str):
        super().__init__("response truncated at max_tokens")
        self.content = content


# Per-model output ceilings. Asking for more than the model can emit just
# means the response gets cut mid-JSON (that is how the 2026-07-24 run died:
# GLM was quota-exhausted, the DeepSeek fallback inherited GLM's 16384 and
# truncated at the then-current deepseek-chat's 8192 cap, so json.loads()
# had nothing parseable). Models absent from this table keep the requested
# budget — finish_reason == "length" is the backstop either way.
MODEL_MAX_TOKENS = {
    "glm-5.2": 16384,
    "deepseek-chat": 8192,
    "deepseek-v4-pro": 16384,
    "deepseek-v4-flash": 16384,
}


def _chat_api(api_url: str, api_key: str, model: str, system_prompt: str, user_prompt: str, max_tokens: int, label: str) -> str:
    """Call an OpenAI-compatible chat API with retries."""
    max_tokens = min(max_tokens, MODEL_MAX_TOKENS.get(model, max_tokens))
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "max_tokens": max_tokens,
        "temperature": 0.4,
    }
    data = json.dumps(payload).encode()

    last_err = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(
                api_url,
                data=data,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=300) as resp:
                result = json.loads(resp.read())
                choice = result["choices"][0]
                content = choice["message"]["content"]
                if choice.get("finish_reason") == "length":
                    print(
                        f"{label} response hit the {max_tokens}-token ceiling — truncated.",
                        file=sys.stderr,
                    )
                    raise TruncatedResponse(content)
                return content
        except TruncatedResponse:
            # Retrying the identical request just truncates again — the caller
            # re-asks in a shorter format instead.
            raise
        except urllib.error.HTTPError as e:
            body = e.read().decode() if e.fp else ""
            print(f"{label} API error {e.code} (attempt {attempt+1}/3): {body}", file=sys.stderr)
            last_err = e
            # Rate-limited or quota exhausted — don't retry, let caller fall back
            if e.code == 429:
                break
        except Exception as e:
            print(f"{label} API call failed (attempt {attempt+1}/3): {e}", file=sys.stderr)
            last_err = e

        if attempt < 2:
            import time
            time.sleep(10 * (attempt + 1))

    raise RuntimeError(f"{label} API failed: {last_err}")


def glm_chat(system_prompt: str, user_prompt: str, max_tokens: int = 8192) -> str:
    """Call GLM-5.2, falling back to DeepSeek on rate limits."""
    glm_key = os.environ.get("GLM_API_KEY", "")
    ds_key = os.environ.get("DEEPSEEK_API_KEY", "")

    if glm_key:
        try:
            return _chat_api(GLM_API_URL, glm_key, "glm-5.2", system_prompt, user_prompt, max_tokens, "GLM")
        except TruncatedResponse:
            raise
        except RuntimeError as e:
            err_str = str(e)
            is_rate_limit = "429" in err_str or "limit" in err_str.lower()
            if not is_rate_limit or not ds_key:
                raise
            print("GLM rate-limited, falling back to DeepSeek...", file=sys.stderr)

    if ds_key:
        return _chat_api(DEEPSEEK_API_URL, ds_key, DEEPSEEK_MODEL, system_prompt, user_prompt, max_tokens, "DeepSeek")

    raise RuntimeError("No API key available — set GLM_API_KEY or DEEPSEEK_API_KEY")


def read_file(path: Path) -> str:
    try:
        return path.read_text()
    except FileNotFoundError:
        return f"[File not found: {path}]"


def collect_repo_context() -> str:
    """Gather key SEO-related files for the LLM to analyze."""
    seo_files = [
        "public/robots.txt",
        "public/sitemap.xml",
        "public/llms.txt",
        "index.html",
        "vercel.json",
        "src/components/SEOHead.tsx",
        "src/data/blog-posts.ts",
    ]

    # Find all page components
    pages_dir = REPO_ROOT / "src" / "pages"
    if pages_dir.exists():
        for p in pages_dir.rglob("*.tsx"):
            rel = str(p.relative_to(REPO_ROOT))
            if rel not in seo_files:
                seo_files.append(rel)

    parts = []
    for f in seo_files:
        full = REPO_ROOT / f
        if full.exists() and full.is_file():
            content = full.read_text()
            # Truncate very large files
            if len(content) > 8000:
                content = content[:8000] + "\n... [truncated]"
            parts.append(f"--- FILE: {f} ---\n{content}")

    inventory = collect_asset_inventory()
    if inventory:
        parts.append(f"--- ASSET INVENTORY (public/) ---\n{inventory}")

    return "\n\n".join(parts) if parts else "[No SEO files found]"


def collect_asset_inventory() -> str:
    """List the non-page assets that ship in public/.

    Without this the model only ever saw meta tags REFERENCING assets, never
    evidence of the assets themselves — so it inferred absence from silence
    and reported `og-image.png` as missing on every run for weeks, while the
    file was tracked in git and serving 200. The 4005-page HTML fleet is
    deliberately excluded; it is covered by the sitemap checks.
    """
    public_dir = REPO_ROOT / "public"
    if not public_dir.is_dir():
        return ""

    asset_suffixes = {
        ".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".ico", ".avif",
        ".txt", ".xml", ".json", ".pdf", ".woff", ".woff2",
    }
    image_suffixes = {".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".ico", ".avif"}
    root_rows = []
    by_dir = {}
    for path in sorted(public_dir.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in asset_suffixes:
            continue
        rel = path.relative_to(public_dir)
        if any(part.startswith(".") for part in rel.parts):
            continue  # .vercel/, .well-known/ — build and protocol internals
        if len(rel.parts) == 1:
            root_rows.append(f"/{rel} ({path.stat().st_size} bytes)")
        elif path.suffix.lower() in image_suffixes:
            # Per-page sidecars across the 4005-page fleet (public/og/ alone
            # holds ~1070 cards) get summarised, not enumerated — listing
            # them would cost more prompt than the rest of the audit.
            by_dir.setdefault("/" + rel.parts[0], []).append(rel.name)

    rows = list(root_rows)
    for directory, names in sorted(by_dir.items()):
        if len(names) <= 10:
            rows.extend(f"{directory}/{n}" for n in names)
        else:
            rows.append(f"{directory}/ — {len(names)} image files (e.g. {names[0]})")

    if not rows:
        return ""
    return (
        "These files EXIST and are served from the site root. Any path listed "
        "here is present — never report it as missing.\n" + "\n".join(rows)
    )


def run_audit():
    print(f"=== SEO/GEO Audit Starting — Mode: {AUDIT_MODE} — {DATE} ===")

    instructions = read_file(INSTRUCTIONS_FILE)
    memory = read_file(MEMORY_FILE)
    gotchas = read_file(GOTCHAS_FILE)
    repo_context = collect_repo_context()

    system_prompt = f"""You are an automated SEO/GEO optimization agent for invisibleexit.com.
You run inside a GitHub Actions workflow. You analyze repository files and produce
specific, actionable code changes as a unified diff.

Follow these instructions precisely:
{instructions}

Past learnings (memory.md):
{memory}

Known gotchas (gotchas.md):
{gotchas}

CRITICAL OUTPUT FORMAT:
Respond with ONLY a JSON object. No prose, no markdown fences, no commentary before or after.
First character must be `{{` and last character must be `}}`.
If you want to add notes, put them inside the JSON values.
{{
  "findings": [
    {{"check": "Sitemap", "status": "PASS", "notes": "..."}},
    {{"check": "Meta tags", "status": "FAIL", "notes": "..."}}
  ],
  "changes_made": ["List each change you want applied"],
  "diff": "Optional: unified diff (git format) of changes to apply. Empty string if none.",
  "memory_update": "Any new learnings to append to memory.md. Empty string if none.",
  "gotchas_update": "Any new gotchas to append to gotchas.md. Empty string if none.",
  "changelog_entry": "Entry for SEO_CHANGELOG.md. Empty string if no changes.",
  "summary": "Human-readable summary of this audit run"
}}

Rules:
1. Be specific. Reference exact files and line content.
2. Only suggest changes for public-facing marketing pages.
3. Never mention the target audience by name.
4. If everything passes, say so — don't invent issues.
5. Never report a file as missing unless it is absent from the ASSET
   INVENTORY section of the repo context. That list is the only evidence
   about which non-page files exist; a meta tag referencing a path is not
   evidence that the path is broken.
"""

    user_prompt = f"""Run a {AUDIT_MODE} audit for {DATE}.

Here is the current repository state:

{repo_context}

Analyze the files above and produce your audit findings as the JSON object specified."""

    print("Calling AI for audit analysis...")
    try:
        response = glm_chat(system_prompt, user_prompt, max_tokens=16384)
    except TruncatedResponse:
        # The diff is what blows the budget. Re-ask for findings only: a
        # report-only audit run is far more useful than a red X on the cron,
        # and a half-written diff must never reach `git apply` anyway.
        print(
            "Response was truncated — re-running in findings-only mode (no diff).",
            file=sys.stderr,
        )
        compact_prompt = (
            user_prompt
            + "\n\nIMPORTANT: keep the response short enough to finish. Set "
            '"diff" to "" and report findings, changes_made, and summary only. '
            "Keep every `notes` value under 200 characters."
        )
        response = glm_chat(system_prompt, compact_prompt, max_tokens=8192)

    # Save raw response for debugging
    debug_path = REPO_ROOT / ".github" / "seo-geo-automation" / "last-response.json"
    debug_path.write_text(response)

    # Parse JSON (handle potential markdown fences)
    clean = response.strip()
    if clean.startswith("```"):
        clean = re.sub(r"^```(?:json)?\s*", "", clean)
        clean = re.sub(r"\s*```$", "", clean)

    try:
        result = json.loads(clean)
    except json.JSONDecodeError:
        # Try to find JSON object in the response
        match = re.search(r"\{[\s\S]*\}", clean)
        if match:
            try:
                result = json.loads(match.group())
            except json.JSONDecodeError:
                print("ERROR: Could not parse GLM response as JSON")
                print(f"Raw response saved to {debug_path}")
                print(response[:2000])
                sys.exit(1)
        else:
            print("ERROR: No JSON found in GLM response")
            print(response[:2000])
            sys.exit(1)

    return result


def apply_changes(result: dict):
    """Apply the audit results."""
    findings = result.get("findings", [])
    changes = result.get("changes_made", [])

    print(f"\n=== AUDIT FINDINGS ({DATE}) ===")
    for f in findings:
        status_icon = "✅" if f.get("status") == "PASS" else "❌"
        print(f"  {status_icon} {f['check']}: {f['status']} — {f.get('notes', '')}")

    print(f"\n=== CHANGES ({len(changes)}) ===")
    for c in changes:
        print(f"  • {c}")

    # Apply diff if provided
    diff = result.get("diff", "").strip()
    if diff:
        print("\n=== APPLYING DIFF ===")
        # Save diff to temp file and apply
        diff_path = REPO_ROOT / ".seo-audit-changes.diff"
        diff_path.write_text(diff)
        proc = subprocess.run(
            ["git", "apply", str(diff_path)],
            cwd=str(REPO_ROOT),
            capture_output=True,
            text=True,
        )
        if proc.returncode != 0:
            print(f"git apply failed: {proc.stderr}")
            # Try patch as fallback
            proc2 = subprocess.run(
                ["git", "apply", "--3way", str(diff_path)],
                cwd=str(REPO_ROOT),
                capture_output=True,
                text=True,
            )
            if proc2.returncode != 0:
                print(f"git apply --3way also failed: {proc2.stderr}")
                # Do NOT leave the .diff in the tree: `git add -A` below would
                # commit the temp artifact to main, and the PR would claim the
                # changes landed when nothing was applied.
                print(
                    "DIFF NOT APPLIED — discarding it; the findings below still stand."
                )
                diff_path.unlink(missing_ok=True)
                result["changes_made"] = [
                    "NOTE: the proposed diff did not apply cleanly and was discarded — "
                    "no code changes were made this run."
                ] + list(changes)
                changes = result["changes_made"]
            else:
                print("Diff applied with 3-way merge.")
                diff_path.unlink()
        else:
            print("Diff applied successfully.")
            diff_path.unlink()
    else:
        print("\nNo diff to apply.")

    # Update memory.md
    mem_update = result.get("memory_update", "").strip()
    if mem_update:
        with open(MEMORY_FILE, "a") as f:
            f.write(f"\n\n## {DATE}\n{mem_update}")
        print(f"✓ Updated memory.md")

    # Update gotchas.md
    got_update = result.get("gotchas_update", "").strip()
    if got_update:
        with open(GOTCHAS_FILE, "a") as f:
            f.write(f"\n\n## {DATE}\n{got_update}")
        print(f"✓ Updated gotchas.md")

    # Update changelog
    changelog = result.get("changelog_entry", "").strip()
    if changelog:
        existing = ""
        if CHANGELOG_FILE.exists():
            existing = CHANGELOG_FILE.read_text()
        CHANGELOG_FILE.write_text(
            f"# SEO Change Log\n\n## {DATE} ({AUDIT_MODE})\n{changelog}\n\n{existing}"
        )
        print(f"✓ Updated SEO_CHANGELOG.md")

    # Git commit if there are changes
    proc = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=str(REPO_ROOT),
        capture_output=True,
        text=True,
    )
    if proc.stdout.strip():
        subprocess.run(["git", "add", "-A"], cwd=str(REPO_ROOT))
        subprocess.run(
            ["git", "commit", "-m", f"seo({AUDIT_MODE}): {result.get('summary', 'audit ' + DATE)}"],
            cwd=str(REPO_ROOT),
        )
        print("✓ Committed changes")
        return True
    else:
        print("No file changes to commit.")
        return False


def main():
    result = run_audit()
    has_changes = apply_changes(result)

    # Output summary for GitHub Actions
    summary = result.get("summary", "Audit complete")
    print(f"\n=== SUMMARY ===\n{summary}")

    # Write to GITHUB_STEP_SUMMARY
    gh_summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if gh_summary:
        findings_md = "\n".join(
            f"| {f.get('check','')} | {f.get('status','')} | {f.get('notes','')} |"
            for f in result.get("findings", [])
        )
        with open(gh_summary, "w") as f:
            f.write(f"## SEO/GEO Audit — {DATE} ({AUDIT_MODE})\n\n")
            f.write(f"{summary}\n\n")
            if findings_md:
                f.write(f"| Check | Status | Notes |\n|-------|--------|-------|\n{findings_md}\n\n")
            if result.get("changes_made"):
                f.write("### Changes\n")
                for c in result["changes_made"]:
                    f.write(f"- {c}\n")

    if not has_changes:
        print("\nNo changes needed — site is clean.")


if __name__ == "__main__":
    main()
