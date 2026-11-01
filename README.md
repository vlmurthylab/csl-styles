# CSL styles for grant writing

Citation styles (CSL) for Zotero and other reference managers, for writing grant proposals.

| Style | File | What it does |
|---|---|---|
| National Institutes of Health Grant Proposal | [`nih-grant-proposal.csl`](nih-grant-proposal.csl) | NLM-style numbered references with **no hyperlinks**: no URLs, DOIs or access dates, since NIH doesn't allow links (even internal links can trigger a grants office). All authors are listed; a PMCID is printed as plain text when the item has one; preprints read "medRxiv [Preprint]. 2024." |
| Compact Grant Proposal (3 Authors) | [`compact-grant-proposal.csl`](compact-grant-proposal.csl) | For grants with strict page limits and no set style (first used for Wellcome Leap): up to 3 authors in full; for 4 or more, the first two, an ellipsis and the last author ("A, B, … Z"); journal abbreviations, year, volume and pages. Preprints show the server and DOI (Zotero makes the DOI a link). |
| Compact Grant Proposal (1 Author) | [`compact-grant-proposal-1-author.csl`](compact-grant-proposal-1-author.csl) | The same, with only the first author and "et al." whenever there are two or more. |

All three put superscript citation numbers in the text, in order of first citation. **[SAMPLES.md](SAMPLES.md)** shows how each style formats every common Zotero item type.

## Installing in Zotero

1. Download the `.csl` file: open it above, then click **Download raw file** (the download button at the top right of the file view).
2. In Zotero, open **Settings** (Edit → Settings on Windows, Zotero → Settings on a Mac) → **Cite** → **Styles**, click **+**, and choose the file.
3. In Word: **Zotero** tab → **Document Preferences** → choose the style.

To update a style, install the new file the same way; Zotero replaces the old one, because each style's ID is its address in this repository. Zotero doesn't update these automatically.

**Moving from the older copies** ("National Institute of Health Grant Proposal", "Wellcome Leap Grant Proposal" and "… (1 Author)"): they have different IDs, so Zotero keeps them alongside the new ones. Remove them in Settings → Cite → Styles (select, then **−**), and in any document in progress choose the new style in Document Preferences.

**NIH proposals:** a PMCID comes from the item's **Extra** field (`PMCID: PMC1234567`; items imported from PubMed already have it). Check the finished bibliography for links anyway: the style prints none, but a reference pasted by hand, or Word's own autoformatting, could add one.

## Changing a style

- The two compact styles are identical apart from their title, ID, summary and the author rule (`et-al-...`). Make any other change to both.
- Run the checks before pushing (GitHub runs them on every push, `.github/workflows/check-styles.yml`):
  - `pip install citeproc-py==0.12.1` then `python tests/check_styles.py`: schema, made-up references, no URL, DOI or access date in the NIH style (in its source and its output), and the compact styles kept in step;
  - `npm install citeproc@2.4.63` then `node tests/check_citeproc_js.js`: the same references through Zotero's own engine, with links switched on as in Zotero, plus stray punctuation;
  - `node scripts/make_samples.js` to rewrite SAMPLES.md, then commit it (the check fails if it's out of date).
- Test a changed style in Zotero with a few real references before using it in a proposal.
- Update `<updated>` in the style's `<info>`.

## Layout

| Path | What it holds |
|---|---|
| `*.csl` | the styles |
| `SAMPLES.md` | generated samples of every style |
| `tests/` | the checks, and the CSL project's US English locale they use |
| `scripts/make_samples.js` | writes SAMPLES.md |
| `hooks/`, `tools/`, `.github/`, `data/` | the lab's shared safeguards (see below); `data/` holds only its README, and never data |

## Where these came from

The styles grew out of the official CSL repository's NLM-based styles, whose authors are credited in each file. The Clinical Nuclear Medicine style that the lab wrote earlier is in the official repository already, so Zotero users can install it from there. The NIH style may be offered there too.

## License

The styles are [CC BY-SA 3.0](LICENSE), as required for styles derived from the official CSL repository's; each links to the NLM style it's based on.

## Lab safeguards

This repository holds only citation styles, but it uses the lab's shared safeguards like every lab repository: a PHI check on every commit and on GitHub, and the rules for AI assistants in [`AGENTS.md`](AGENTS.md). Turn the check on once in each clone: `git config core.hooksPath hooks`.

## Lab core files

Some files are the same in every lab repository and are changed only in the lab's project template; each says so at the top:

| Lab core (identical everywhere) | Per repository |
|---|---|
| `hooks/pre-commit`, `tools/phi_guard.pl`, `tools/install_hooks.R`, `.github/workflows/phi-check.yml`, `.github/CODEOWNERS`, `CLAUDE.md` | `phi-guard.conf` (settings, files to allow or block), `hooks/pre-commit.local` (extra checks, optional) |
| `.gitignore` and `.gitattributes` above their **This repository** sections | `.gitignore` and `.gitattributes` from **This repository** down |
| `AGENTS.md` above its **This project** section | `AGENTS.md` **This project** section |

