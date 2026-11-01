"""Checks for the styles in this repository, run on every push (check-styles.yml).

- Every style is well-formed XML and renders made-up references with
  citeproc-py (no real references or data are used).
- Every style is valid against the CSL schema (citeproc-py's validator).
- The NIH style never prints a URL or an access date, and prints a DOI only
  for preprints (NIH asks for it there, NOT-OD-17-050): NIH does not allow
  hyperlinks, and a printed URL or DOI can become one in Word. Checked in the
  style's source as well as in rendered output.
- The compact styles differ only in their title, ID, self link, summary,
  author rule, whether they print the article title, and page-range format, so
  a fix made to one is made to all.

Run:  pip install citeproc-py==0.12.1  &&  python tests/check_styles.py
"""
import re
import sys
import xml.dom.minidom
import xml.etree.ElementTree as ET
from pathlib import Path

from citeproc import (Citation, CitationItem, CitationStylesBibliography,
                      CitationStylesStyle, formatter)
from citeproc.source.json import CiteProcJSON

ROOT = Path(__file__).resolve().parent.parent
STYLES = sorted(ROOT.glob("*.csl"))
# The NIH style's extra rules apply to this file; the check fails if it goes
# missing, so a rename can't silently skip them.
NIH = "national-institutes-of-health-grant-proposals.csl"

# Made-up references covering the item types the styles handle differently.
REFS = [
    {"id": "article", "type": "article-journal", "title": "A made-up trial",
     "container-title": "Journal of Made Up", "container-title-short": "J Made Up",
     "volume": "12", "issue": "3", "page": "100-110", "issued": {"date-parts": [[2021, 5]]},
     "author": [{"family": f, "given": "A"} for f in ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"]],
     "URL": "https://example.org/article", "DOI": "10.0000/made.up.1",
     "accessed": {"date-parts": [[1999, 1, 5]]}, "PMCID": "PMC0000001"},
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
    style = CitationStylesStyle(str(style_path), validate=True)  # CSL schema
    bib = CitationStylesBibliography(style, CiteProcJSON(REFS), formatter.plain)
    for r in REFS:
        bib.register(Citation([CitationItem(r["id"])]))
    return [str(item) for item in bib.bibliography()]


def main():
    failures = []
    if not STYLES:
        failures.append("no .csl files found")
    if NIH not in [p.name for p in STYLES]:
        failures.append(f"{NIH} not found: its NIH rules weren't checked")
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
        if p.name == NIH:
            # Static, read with an XML parser so quoting and spacing can't hide
            # anything: no element may print a URL or access date, no "cited"
            # term, and the only DOI is inside the preprint branch
            ns = "{http://purl.org/net/xbiblio/csl}"
            root = ET.parse(str(p)).getroot()
            parent = {c: q for q in root.iter() for c in q}
            def in_preprint_branch(el):
                while el in parent:
                    el = parent[el]
                    if el.tag == ns + "if" and el.get("type") == "article" and len(el.attrib) == 1:
                        return True
                return False
            dois = 0
            for el in root.iter():
                # conditions (<if variable="DOI">) test a variable; they don't print it
                variables = [] if el.tag in (ns + "if", ns + "else-if") else (el.get("variable") or "").split()
                if "URL" in variables or "accessed" in variables:
                    failures.append(f"{p.name}: prints {el.get('variable')} (<{el.tag.replace(ns, '')}>)")
                if "DOI" in variables:
                    dois += 1
                    if not in_preprint_branch(el):
                        failures.append(f"{p.name}: prints a DOI outside the preprint branch")
                if el.get("term") in ("cited", "accessed", "retrieved"):
                    failures.append(f"{p.name}: uses the {el.get('term')} term")
            if dois != 1:
                failures.append(f"{p.name}: expected exactly one DOI element (preprints), found {dois}")
            for r, line in zip(REFS, lines):
                text = line.lower()
                for bad in ("http", "example.org", "cited", "1999"):
                    if bad in text:
                        failures.append(f"{p.name}: output contains '{bad}' (NIH allows no hyperlinks): {line}")
                has_doi = "doi" in text or "10.0000" in text
                if has_doi != (r["type"] == "article"):
                    failures.append(f"{p.name}: DOI {'printed' if has_doi else 'missing'} for {r['id']}: {line}")

    compact = {p.name: p.read_text() for p in STYLES if p.name.startswith("compact-")}
    if len(compact) < 4:
        failures.append(f"expected 4 compact styles, found {sorted(compact)}")

    def strip(s):
        """Remove what the compact styles may differ in."""
        s = re.sub(r"<title>.*?</title>|<id>.*?</id>|<link [^>]*rel=\"self\"/>|<summary>.*?</summary>|<updated>.*?</updated>", "", s)
        s = re.sub(r'et-al-[a-z-]+="[^"]*"|page-range-format="[^"]*"', "", s)
        s = s.replace('<term name="page-range-delimiter">-</term>', "")
        return s.replace('<text macro="title-extras"/>', '<text macro="title"/>')
    # Each is compared with compact-1-author.csl. That the no-title and
    # short-pages styles really drop titles and shorten pages is checked on
    # their output in check_citeproc_js.js (citeproc-py mangles short page
    # ranges, printing 1-0 for 1-20, so pages aren't checked here).
    stripped = {name: strip(s).split() for name, s in compact.items()}
    ref = "compact-1-author.csl"
    for name, words in stripped.items():
        if ref in stripped and words != stripped[ref]:
            failures.append(f"{name} differs from {ref} beyond title, ID, summary, dates, author rule, "
                            "article title and page ranges; keep the compact styles in step")

    if failures:
        print("\nFAILED:\n  " + "\n  ".join(failures))
        sys.exit(1)
    print("\nAll checks passed.")


if __name__ == "__main__":
    main()
