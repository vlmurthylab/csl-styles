# CSL styles

Citation styles (CSL) for Zotero and other reference managers: an NIH grant style with no hyperlinks, and a family of compact styles for anything with a strict page limit (grants, letters, short reports).

| Style | File | What it does |
|---|---|---|
| National Institutes of Health Grant Proposal | [`nih-grant-proposal.csl`](nih-grant-proposal.csl) | NLM-style numbered references for NIH applications, which allow no hyperlinks: no URLs or access dates, and a DOI only for preprints, where NIH asks for it ("medRxiv [Preprint]. 2024 Mar 13. doi: 10.1101/…"). All authors are listed; a PMCID is printed as plain text when the item has one. **Zotero makes a preprint's DOI a live link: remove it before submitting** ([below](#nih-applications)). |
| Compact (3 Authors) | [`compact-3-authors.csl`](compact-3-authors.csl) | Tight numbered references for strict page limits with no set style (first used for Wellcome Leap grants): up to 3 authors in full; for 4 or more, the first two, an ellipsis and the last author ("A, B, … Z"); article titles; journal abbreviations, year, volume and pages. Preprints show the server and DOI (Zotero makes the DOI a link). |
| Compact (1 Author) | [`compact-1-author.csl`](compact-1-author.csl) | The same, with only the first author and "et al." whenever there are two or more. |
| Compact (1 Author, No Title) | [`compact-1-author-no-title.csl`](compact-1-author-no-title.csl) | The same, without titles: `Alpha A, et al. J Made-Up Med. 2021;12:100–110.` Items with nothing else to identify them (datasets, software, documents, a preprint with no server or DOI) keep their title. |
| Compact (1 Author, No Title, Short Pages) | [`compact-1-author-no-title-short-pages.csl`](compact-1-author-no-title-short-pages.csl) | The same, with page ranges cut to the digits that change, keeping at least two (100-110 → 100-10, 1095-1101 → 1095-101, 101-109 → 101-09) and a plain hyphen: `…2021;12:100-10.` |

The compact styles go from least to most compact. All of them put superscript citation numbers in the text, in order of first citation. **[SAMPLES.md](SAMPLES.md)** shows how each style formats every common Zotero item type.

## Installing in Zotero

1. Download the `.csl` file: open it above, then click **Download raw file** (the download button at the top right of the file view).
2. In Zotero, open **Settings** (Edit → Settings on Windows, Zotero → Settings on a Mac) → **Cite** → **Styles**, click **+**, and choose the file.
3. In Word: **Zotero** tab → **Document Preferences** → choose the style.

To update a style, install the new file the same way; Zotero replaces the old one, because each style's ID is its address in this repository. Zotero doesn't update these automatically.

**Moving from the older copies** ("National Institute of Health Grant Proposal", "Wellcome Leap Grant Proposal", "… (1 Author)", and "Grant Proposal Compact (1 Author, No Title)" with its "Short Pages" version): they have different IDs, so Zotero keeps them alongside the new ones. Remove them in Settings → Cite → Styles (select, then **−**), and in any document in progress choose the new style in Document Preferences.

## NIH applications

**Why not the standard NLM style?** NIH suggests NLM, and this style is based on Zotero's "NLM / Vancouver" (`nlm-citation-sequence`). Used for an NIH application, that style falls short in three ways:

| Standard NLM style | NIH's rule | This style |
|---|---|---|
| Prints the DOI of every item that has one, and for everything but journal articles "[cited date]. Available from: URL"; Zotero turns each DOI and URL into a live link | Hyperlinks and URLs only where a funding opportunity or form instructions allow them (SF424 application guide, Format Attachments); grants offices flag links, even ones inside the document | No URL or access date anywhere; a DOI only for preprints |
| Shortens author lists to six names and "et al." | All authors, in the order on the paper | Every author |
| Preprints aren't marked ("medRxiv; 2024. doi:…") | Preprints cited with "[Preprint]", a date for the version and the DOI ([NOT-OD-17-050](https://grants.nih.gov/grants/guide/notice-files/NOT-OD-17-050.html)) | Server, "[Preprint]", posting date and DOI (with no DOI, the Archive ID, such as an arXiv number). NIH's own example gives the DOI as a doi.org address with a [cited] date; this style prints `doi: 10…` instead, so there is no URL |

Plain NLM does print the PMCID ("PubMed Central PMCID: …"), which the [NIH Public Access Policy](https://grants.nih.gov/grants/policy/nihgps/html5/section_8/8.2.2_nih_public_access_policy.htm) (Grants Policy Statement 8.2.2) requires, at the end of the reference, for your own NIH-supported papers. This style keeps it as plain `PMCID: PMC…`, taken from the item's **Extra** field (`PMCID: PMC1234567`; items imported from PubMed already have it).

**Before submitting: remove the preprint links.** Zotero turns any DOI a style prints into a live link, in Word and in Google Docs alike, and a style can't stop it. So each preprint's DOI arrives as a link. Do this last, in a final copy: any Zotero refresh puts the links back.
- **Word:** select the bibliography and press Ctrl+Shift+F9 (on a Mac, ⌘+Shift+F9, adding Fn on a laptop keyboard). That makes the links and fields in it plain text, and disconnects them from Zotero, hence the copy. If a DOI is still blue and underlined, select it and remove the colour and underline, so it doesn't look like a link.
- **Google Docs:** click each preprint DOI and choose **Remove link**.

Then check the whole bibliography for links: the style prints none apart from those, but a reference pasted by hand, or Word's autoformatting, can bring one in.

**NIHMS ID:** within three months of publication NIH also accepts the NIHMS ID in place of the PMCID. Zotero has no field for it, so add it to that reference by hand. In Word, click **Add/Edit Bibliography** on the Zotero tab once the bibliography is in place; Zotero's bibliography editor keeps the edit when the bibliography refreshes. Add `NIHMSID: NIHMS1234567.` Once the PMCID exists, put it in the item's Extra field and remove the hand edit.

**Don't use the compact styles for NIH:** they shorten author lists and print DOIs for every item.

Check the current SF424 application guide and your funding opportunity before each submission; NIH's instructions change.

## Changing a style

- The compact styles are identical apart from their title, ID, summary, the author rule (`et-al-...`), whether they print the title (`title` or `title-extras` in the bibliography) and the page-range format. Make any other change to all four.
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
| `docs/` | notes, such as the plan for testing where Zotero's DOI and URL links come from |
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

