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

AUDIT_MODE = os.environ.get("AUDIT_MODE", "daily")
DATE = datetime.now().strftime("%Y-%m-%d")


def glm_chat(system_prompt: str, user_prompt: str, max_tokens: int = 8192) -> str:
    """Call GLM-5.2 via z.ai API with retries."""
    api_key = os.environ["GLM_API_KEY"]
    payload = {
        "model": "glm-5.2",
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
                GLM_API_URL,
                data=data,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=300) as resp:
                result = json.loads(resp.read())
                return result["choices"][0]["message"]["content"]
        except urllib.error.HTTPError as e:
            body = e.read().decode() if e.fp else ""
            print(f"GLM API error {e.code} (attempt {attempt+1}/3): {body}", file=sys.stderr)
            last_err = e
        except Exception as e:
            print(f"GLM API call failed (attempt {attempt+1}/3): {e}", file=sys.stderr)
            last_err = e
        
        if attempt < 2:
            import time
            time.sleep(10 * (attempt + 1))
    
    raise RuntimeError(f"GLM API failed after 3 attempts: {last_err}")


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

    return "\n\n".join(parts) if parts else "[No SEO files found]"


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
Respond with ONLY a JSON object, no markdown fences, with this exact structure:
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
"""

    user_prompt = f"""Run a {AUDIT_MODE} audit for {DATE}.

Here is the current repository state:

{repo_context}

Analyze the files above and produce your audit findings as the JSON object specified."""

    print("Calling GLM-5.2 for audit analysis...")
    response = glm_chat(system_prompt, user_prompt, max_tokens=12288)

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
                print("Diff saved but not applied automatically.")
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
