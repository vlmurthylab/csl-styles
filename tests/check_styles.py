"""Checks for the styles in this repository, run on every push (check-styles.yml).

- Every style is well-formed XML and renders made-up references with
  citeproc-py (no real references or data are used).
- The NIH style never prints a URL, DOI, "doi" or an access date: NIH does not
  allow hyperlinks, and a printed URL or DOI can become one in Word.
- The two compact styles differ only in their title, ID, self link, summary and
  author rule, so a fix made to one is made to both.

Run:  pip install citeproc-py  &&  python tests/check_styles.py
"""
import re
import sys
import xml.dom.minidom
from pathlib import Path

from citeproc import (Citation, CitationItem, CitationStylesBibliography,
                      CitationStylesStyle, formatter)
from citeproc.source.json import CiteProcJSON

ROOT = Path(__file__).resolve().parent.parent
STYLES = sorted(ROOT.glob("*.csl"))

# Made-up references covering the item types the styles handle differently.
REFS = [
    {"id": "article", "type": "article-journal", "title": "A made-up trial",
     "container-title": "Journal of Made Up", "container-title-short": "J Made Up",
     "volume": "12", "issue": "3", "page": "100-110", "issued": {"date-parts": [[2021, 5]]},
     "author": [{"family": f, "given": "A"} for f in ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"]],
     "URL": "https://example.org/article", "DOI": "10.0000/made.up.1",
     "accessed": {"date-parts": [[2024, 1, 5]]}, "PMCID": "PMC0000001"},
    {"id": "preprint", "type": "article", "title": "A made-up preprint", "publisher": "bioRxiv",
     "issued": {"date-parts": [[2024]]}, "author": [{"family": "Zeta", "given": "Z"}],
     "DOI": "10.0000/made.up.2", "URL": "https://example.org/preprint"},
    {"id": "book", "type": "book", "title": "A made-up book", "publisher": "Made Up Press",
     "publisher-place": "Ann Arbor", "issued": {"date-parts": [[2019]]},
     "author": [{"family": "Eta", "given": "H"}, {"family": "Theta", "given": "T"}],
     "URL": "https://example.org/book"},
    {"id": "chapter", "type": "chapter", "title": "A made-up chapter", "container-title": "A made-up volume",
     "publisher": "Made Up Press", "publisher-place": "Ann Arbor", "page": "1-20",
     "issued": {"date-parts": [[2018]]}, "author": [{"family": "Iota", "given": "I"}],
     "editor": [{"family": "Kappa", "given": "K"}], "DOI": "10.0000/made.up.3"},
]


def render(style_path):
    style = CitationStylesStyle(str(style_path), validate=False)
    bib = CitationStylesBibliography(style, CiteProcJSON(REFS), formatter.plain)
    for r in REFS:
        bib.register(Citation([CitationItem(r["id"])]))
    return [str(item) for item in bib.bibliography()]


def main():
    failures = []
    if not STYLES:
        failures.append("no .csl files found")
    for p in STYLES:
        try:
            xml.dom.minidom.parse(str(p))
        except Exception as e:
            failures.append(f"{p.name}: not well-formed XML ({e})")
            continue
        lines = render(p)
        print(f"== {p.name}")
        for line in lines:
            print("   " + line)
        if len(lines) != len(REFS):
            failures.append(f"{p.name}: rendered {len(lines)} of {len(REFS)} references")
        if p.name.startswith("nih"):
            text = "\n".join(lines).lower()
            for bad in ("http", "doi", "example.org", "10.0000", "cited"):
                if bad in text:
                    failures.append(f"{p.name}: output contains '{bad}' (NIH allows no hyperlinks)")

    compact = {p.name: p.read_text() for p in STYLES if p.name.startswith("compact-grant-proposal")}
    if len(compact) == 2:
        def strip(s):
            s = re.sub(r"<title>.*?</title>|<id>.*?</id>|<link [^>]*rel=\"self\"/>|<summary>.*?</summary>", "", s)
            return re.sub(r'et-al-[a-z-]+="[^"]*"', "", s)
        a, b = (strip(s) for s in compact.values())
        if a.split() != b.split():
            failures.append("compact styles differ beyond title, ID, summary and author rule; keep them in step")

    if failures:
        print("\nFAILED:\n  " + "\n  ".join(failures))
        sys.exit(1)
    print("\nAll checks passed.")


if __name__ == "__main__":
    main()
