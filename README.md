# CSL styles for grant writing

Citation styles (CSL) for Zotero and other reference managers, for writing grant proposals.

| Style | File | What it does |
|---|---|---|
| National Institutes of Health Grant Proposal | [`nih-grant-proposal.csl`](nih-grant-proposal.csl) | NLM-style numbered references with **no hyperlinks**: no URLs, DOIs or access dates, which NIH doesn't allow (even internal links can trouble grants offices). All authors are listed; a PMCID is printed as plain text when the item has one; preprints read "bioRxiv [Preprint]. 2024." |
| Compact Grant Proposal (3 Authors) | [`compact-grant-proposal.csl`](compact-grant-proposal.csl) | For grants with strict page limits and no set style (first used for Wellcome Leap): three authors, then "et al." and the last author; journal abbreviations, year, volume and pages. |
| Compact Grant Proposal (1 Author) | [`compact-grant-proposal-1-author.csl`](compact-grant-proposal-1-author.csl) | The same, with only the first author and "et al.", for the tightest limits. |

All three put superscript citation numbers in the text, in order of first citation.

## Installing in Zotero

1. Download the `.csl` file: open it above, then **Download raw file** (the download button at the top right of the file view).
2. In Zotero: **Settings** (Preferences on a Mac) → **Cite** → **Styles**, click **+**, and choose the file. Or double-click the file.
3. In Word: **Zotero** tab → **Document Preferences** → choose the style.

To update a style, install the new file the same way; Zotero replaces the old one (each style's ID is its address in this repository). Zotero doesn't update these automatically.

**NIH proposals:** put a PMCID in an item's **Extra** field as `PMCID: PMC1234567` and the style prints it. Check the finished bibliography for links anyway: the style prints none, but a pasted reference or Word's own autoformat could add one.

## Changing a style

- The two compact styles are identical apart from their title, ID, summary and the author rule (`et-al-...`). Make any other change to both.
- Run the checks before pushing: `pip install citeproc-py` then `python tests/check_styles.py`. GitHub runs them on every push too (`.github/workflows/check-styles.yml`). They render made-up references through each style and fail if the NIH output ever contains a URL, DOI or access date, or if the compact styles drift apart.
- Test a changed style in Zotero with a few real references before using it in a proposal.
- Update `<updated>` in the style's `<info>`.

## Where these came from

The styles grew out of the official CSL repository's NLM-based styles, whose authors are credited in each file. The Clinical Nuclear Medicine style that the lab wrote earlier is in the official repository already, so Zotero users can install it from there. The NIH style may be offered there too.

## License

[CC BY-SA 3.0](LICENSE), as required for styles derived from the official CSL repository's.

## Lab safeguards

This repository holds only citation styles, but it uses the lab's shared safeguards like every lab repository: a PHI check on every commit and on GitHub, and the rules for AI assistants in [`AGENTS.md`](AGENTS.md). Turn the check on once in each clone: `git config core.hooksPath hooks`.

## Lab core files

Some files are the same in every lab repository and are changed only in the lab's project template; each says so at the top:

| Lab core (identical everywhere) | Per repository |
|---|---|
| `hooks/pre-commit`, `tools/phi_guard.pl`, `tools/install_hooks.R`, `.github/workflows/phi-check.yml`, `.github/CODEOWNERS`, `CLAUDE.md` | `phi-guard.conf` (settings, files to allow or block), `hooks/pre-commit.local` (extra checks, optional) |
| `.gitignore` and `.gitattributes` above their **This repository** sections | `.gitignore` and `.gitattributes` from **This repository** down |
| `AGENTS.md` above its **This project** section | `AGENTS.md` **This project** section |

