#!/usr/bin/env python3
"""Convert InvisibleExit markdown lead magnets to branded HTML + PDF."""
import subprocess, sys, pathlib
import markdown

CSS = """
@page { size: A4; margin: 18mm 16mm; }
body { font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;
  color: #111827; line-height: 1.6; font-size: 13px; max-width: 720px; margin: 0 auto; padding: 24px; }
h1 { font-size: 26px; line-height: 1.2; color: #0f172a; border-bottom: 3px solid #0066cc; padding-bottom: 10px; }
h2 { font-size: 18px; color: #0f172a; margin-top: 28px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
h3 { font-size: 15px; color: #1e40af; }
strong { color: #0f172a; }
blockquote { background: #f0f7ff; border-left: 4px solid #0066cc; margin: 14px 0; padding: 10px 16px; border-radius: 0 6px 6px 0; color: #1e3a5f; }
table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 12px; }
th, td { border: 1px solid #d1d5db; padding: 6px 8px; text-align: left; vertical-align: top; }
th { background: #eff6ff; font-weight: 600; }
code { background: #f3f4f6; padding: 1px 5px; border-radius: 4px; font-size: 12px; }
a { color: #0066cc; text-decoration: none; }
hr { border: none; border-top: 1px solid #e5e7eb; margin: 22px 0; }
li { margin-bottom: 4px; }
.brand-footer { margin-top: 30px; padding-top: 12px; border-top: 2px solid #0066cc; font-size: 11px; color: #6b7280; }
"""

def convert(md_path: str):
    p = pathlib.Path(md_path)
    md_text = p.read_text()
    body = markdown.markdown(md_text, extensions=["tables", "fenced_code", "sane_lists"])
    title = md_text.splitlines()[0].lstrip("# ").strip()
    html = f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>{title}, InvisibleExit</title><style>{CSS}</style></head>
<body>{body}
<div class="brand-footer">InvisibleExit, the faceless side-business system for employed professionals · invisibleexit.com</div>
</body></html>"""
    html_path = p.with_suffix(".pdf.html")
    html_path.write_text(html)
    pdf_path = p.with_suffix(".pdf")
    subprocess.run([
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}", f"file://{html_path.resolve()}",
    ], check=True, capture_output=True, timeout=90)
    html_path.unlink()
    print(f"OK {pdf_path} ({pdf_path.stat().st_size} bytes)")

if __name__ == "__main__":
    for f in sys.argv[1:]:
        convert(f)
