# CSL styles

Citation styles (CSL) for Zotero and other reference managers: an NIH grant style with no hyperlinks, and a family of compact styles for anything with a strict page limit (grants, letters, short reports).

| Style | File | What it does |
|---|---|---|
| National Institutes of Health (grant proposals) | [`national-institutes-of-health-grant-proposals.csl`](national-institutes-of-health-grant-proposals.csl) | NLM-style numbered references for NIH applications, which allow no active hyperlinks: no URLs or access dates, so nothing can become a link, and a DOI only for preprints, where NIH asks for it ("medRxiv [Preprint]. 2024 Mar 13. doi: 10.1101/…"). All authors are listed; a PMCID is printed as plain text when the item has one. **Insert references with the Zotero plugin, never paste a bibliography, and in Google Docs unlink a final copy** ([below](#nih-applications)). |
| Compact (3 Authors) | [`compact-3-authors.csl`](compact-3-authors.csl) | Tight numbered references for strict page limits with no set style (first used for Wellcome Leap grants): up to 3 authors in full; for 4 or more, the first two, an ellipsis and the last author ("A, B, … Z"); article titles; journal abbreviations, year, volume and pages. Preprints show the server and DOI (a link if pasted; see [NIH applications](#nih-applications)). |
| Compact (1 Author) | [`compact-1-author.csl`](compact-1-author.csl) | The same, with only the first author and "et al." whenever there are two or more. |
| Compact (1 Author, No Title) | [`compact-1-author-no-title.csl`](compact-1-author-no-title.csl) | The same, without titles: `Alpha A, et al. J Made-Up Med. 2021;12:100–110.` Items with nothing else to identify them (datasets, software, documents, a preprint with no server or DOI) keep their title. |
| Compact (1 Author, No Title, Short Pages) | [`compact-1-author-no-title-short-pages.csl`](compact-1-author-no-title-short-pages.csl) | The same, with page ranges cut to the digits that change, keeping at least two (100-110 → 100-10, 1095-1101 → 1095-101, 101-109 → 101-09) and a plain hyphen: `…2021;12:100-10.` |

The compact styles go from least to most compact. All of them put superscript citation numbers in the text, in order of first citation. **[SAMPLES.md](SAMPLES.md)** shows how each style formats every common Zotero item type.

## Installing in Zotero

1. Download the `.csl` file: open it above, then click **Download raw file** (the download button at the top right of the file view).
2. In Zotero, open **Settings** (Edit → Settings on Windows, Zotero → Settings on a Mac) → **Cite** → **Styles**, click **+**, and choose the file.
3. In Word: **Zotero** tab → **Document Preferences** → choose the style.

To update a style, install the new file the same way; Zotero replaces the old one, because each style's ID is its address in this repository. Zotero doesn't update these automatically.

**Renamed NIH style:** "National Institutes of Health Grant Proposal" (`nih-grant-proposal.csl`) became "National Institutes of Health (grant proposals)", the name it was offered under to the official CSL repository. Its ID changed with the file name, so Zotero keeps both. If you installed the old one: install this one, choose it in Document Preferences in every document in progress, then remove the old one in Settings → Cite → Styles (select, then **−**).

**Moving from the older copies** ("National Institute of Health Grant Proposal", "Wellcome Leap Grant Proposal", "… (1 Author)", and "Grant Proposal Compact (1 Author, No Title)" with its "Short Pages" version): they have different IDs, so Zotero keeps them alongside the new ones. Remove them in Settings → Cite → Styles (select, then **−**), and in any document in progress choose the new style in Document Preferences.

## NIH applications

**Why not the standard NLM style?** NIH suggests NLM, and this style is based on Zotero's "NLM/Vancouver" (`nlm-citation-sequence`). NIH requires no particular citation format ("We do not require a specific citation format", [Format Attachments](https://grants.nih.gov/grants-process/write-application/how-to-apply-application-guide/format-attachments)), and asks for little: preprints cited a particular way, no active hyperlinks, and the PMCID for your NIH-supported papers. Plain NLM misses the preprint rule, and prints URLs, which pasted from Zotero become live links. This style also makes choices of its own, marked below:

| Standard NLM style | NIH's rule | This style |
|---|---|---|
| Prints the DOI of every item that has one, and for everything but journal articles "[cited date]. Available from: URL"; pasted from Zotero, each one is a live link | No active hyperlinks. The Bibliography & References Cited instructions ([G.220](https://grants.nih.gov/grants/how-to-apply-application-guide/forms-i/general/g.220-r&r-other-project-information-form.htm)) say both "Use of hyperlinks and URLs in this section is not allowed unless specified in the Notice of Funding Opportunity" and that freely available references "may include URLs or PubMed ID (PMID) numbers along with the full reference. Active hyperlinks in this section are not allowed." Grants offices flag links, even ones inside the document | No URL or access date anywhere, a choice: a URL that isn't printed can't become a link; a DOI only for preprints |
| Shortens author lists to six names and "et al." | "List the names of authors in the same sequence in which they appear in the publication. You may use the "et al." convention." ([Advice on Application Sections](https://grants.nih.gov/grants-process/write-application/advice-on-application-sections)) | Every author, in order: a choice, not an NIH rule |
| Preprints aren't marked, even when saved as Zotero's Preprint type: "[Internet]. medRxiv; 2024. Available from: URL doi:…", with the year only | Preprints cited with "[Preprint]", a date for the version and the DOI ([NOT-OD-17-050](https://grants.nih.gov/grants/guide/notice-files/NOT-OD-17-050.html)) | Server, "[Preprint]", posting date and DOI (with no DOI, the Archive ID, such as an arXiv number). NIH's own example gives the DOI as a doi.org address with a [cited] date; this style prints `doi: 10…` instead, so there is no URL |

Plain NLM does print the PMCID ("PubMed Central PMCID: …"), which the [NIH Public Access Policy](https://grants.nih.gov/grants/policy/nihgps/html5/section_8/8.2.2_nih_public_access_policy.htm) (Grants Policy Statement 8.2.2) requires for your own NIH-supported papers. This style keeps it as plain `PMCID: PMC…`, taken from the item's **Extra** field (`PMCID: PMC1234567`; items imported from PubMed already have it).

At a glance, with references inserted with the Zotero plugin (✅ meets NIH's rule, ❌ doesn't):

<table>
<thead>
<tr><th rowspan="2">NIH's rule</th><th colspan="2">Standard NLM</th><th colspan="2">This style</th></tr>
<tr><th>Word</th><th>Google Docs</th><th>Word</th><th>Google Docs</th></tr>
</thead>
<tbody>
<tr><td>No hyperlinks</td><td align="center">✅</td><td align="center">❌</td><td align="center">✅</td><td align="center">❌</td></tr>
<tr><td>Preprints marked "[Preprint]"</td><td align="center">❌</td><td align="center">❌</td><td align="center">✅</td><td align="center">✅</td></tr>
<tr><td>Preprint dated by the version cited</td><td align="center">❌</td><td align="center">❌</td><td align="center">✅</td><td align="center">✅</td></tr>
<tr><td>Preprint DOI</td><td align="center">✅</td><td align="center">✅</td><td align="center">✅</td><td align="center">✅</td></tr>
<tr><td>PMCID for your NIH-supported papers</td><td align="center">✅</td><td align="center">✅</td><td align="center">✅</td><td align="center">✅</td></tr>
</tbody>
</table>

Not clear NIH rules, so not in the table: this style also prints no URLs (G.220 both bans them and allows them as plain text for freely available references), lists every author (NIH accepts "et al.") and prints no access dates (NIH allows a cited date for a preprint "if relevant"). Google Docs fails "No hyperlinks" with either style because of Zotero's own links to zotero.org, which **Zotero → Unlink Citations** removes (see the "Before submitting" step below); the style can't change that. For the three preprint rows, the item must be saved in Zotero as a Preprint, with its posting date (see "Preprints" below).

**Preprints:** save each one in Zotero as item type **Preprint**, with **Repository** set to the server (e.g. medRxiv) and **Date** set to the posting date of the version you cite (the version's page on the server shows it). Imports sometimes arrive as Journal Article, and the style then prints no "[Preprint]" and no DOI: change **Item Type** at the top of the item pane to Preprint, then fill in Repository and Date.

**Before submitting: make sure there are no links.** We tested where Zotero's links come from (Zotero 10.0.7, Word on Windows, Google Docs, with plain NLM and with this style; [results](docs/zotero-link-test-plan.md#results-november-2026-predictions-confirmed)). The style doesn't decide it; how the references get into the document does:

With this style:

| How the references got into the document | Journal articles, web pages and other items | Preprint DOI |
|---|---|---|
| Word, inserted with the Zotero plugin | ✅ no link | ✅ no link (plain text) |
| Google Docs, inserted with the plugin | ❌ the citation numbers and the whole bibliography link to zotero.org | ❌ the citation numbers and the whole bibliography link to zotero.org |
| Google Docs, after **Zotero → Unlink Citations** | ✅ no link | ✅ no link |
| Pasted from Quick Copy or Create Bibliography (Word or Google Docs) | ❌ don't paste: these have no link (this style prints no DOI or URL for them), but the preprint in the same paste does | ❌ live link to doi.org, and unlinking doesn't remove it |

✅ means ready to submit; ❌ means not ready, because a link is still there in the document. So:
- **Word:** references inserted with the Zotero plugin (citations, then **Add/Edit Bibliography**) carry no links; the preprint DOI is plain text. Nothing to remove. (Tested on Windows; Word on a Mac wasn't tested.)
- **Google Docs:** the Zotero plugin links every citation and the whole bibliography to zotero.org, to keep track of them, and the preprint DOI sits inside that link. Last of all, make a copy, run **Zotero → Unlink Citations** in it, and download or export that copy. Unlinking removes every Zotero link but disconnects the copy from Zotero, hence the copy.
- **Never paste a bibliography** from Quick Copy (Ctrl+Shift+C) or Create Bibliography: in both editors pasted DOIs become live links to doi.org and URLs link to themselves, and Unlink Citations doesn't remove them. (Create Bibliography wasn't tested, but works the same way in Zotero's code.)

Then check the final PDF for links: hover over each reference, since Zotero's Google Docs links have no underline or colour and only show on hover. A reference pasted or typed by hand, or Word's autoformatting, can bring one in. To remove one, fix it in the document and make the PDF again: for a link that isn't Zotero's, right-click it and choose **Remove Hyperlink** (Word), or click it and choose **Remove link** (Google Docs); for Zotero's own links in Google Docs, use Unlink Citations as above.

**NIHMS ID:** NIH also accepts the NIHMS ID in place of the PMCID (G.220), for example before the PMCID exists. Zotero has no field for it, so add it to that reference by hand. In Word, click **Add/Edit Bibliography** on the Zotero tab once the bibliography is in place; Zotero's bibliography editor keeps the edit when the bibliography refreshes. Add `NIHMSID: NIHMS1234567.` Once the PMCID exists, put it in the item's Extra field and remove the hand edit.

**Don't use the compact styles for NIH:** they don't mark preprints as NIH asks or print the PMCID.

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
| `docs/` | notes: the [test of where Zotero's DOI and URL links come from](docs/zotero-link-test-plan.md), with its results, and [why Google Docs citations are links](docs/google-docs-links.md) |
| `hooks/`, `tools/`, `.github/`, `data/` | the lab's shared safeguards (see below); `data/` holds only its README, and never data |

## Where these came from

The styles grew out of the official CSL repository's NLM-based styles, whose authors are credited in each file. The Clinical Nuclear Medicine style that the lab wrote earlier is in the official repository already, so Zotero users can install it from there. The NIH style has been offered there as "National Institutes of Health (grant proposals)".

The PI revised the official repository's Circulation style in June 2011 (commit [e718ceb](https://github.com/citation-style-language/styles/commit/e718ceb1), "fix for circulation from venkmurthy"), which made him its listed author. That version, with later maintenance edits, was the official Circulation style until October 2025. That month the maintainers replaced it with a dependent of "Stroke", noting that the American Heart Association journals share one reference style ([commit 28e8faa](https://github.com/citation-style-language/styles/commit/28e8faae), which closed pull request [#7824](https://github.com/citation-style-language/styles/pull/7824), a proposed update to the Circulation style). Zotero users who choose "Circulation" now get Stroke's formatting. The PI's version is kept in that repository's history.

## License

The styles are [CC BY-SA 3.0](LICENSE), as required for styles derived from the official CSL repository's; each links to the NLM style it's based on.

## Lab safeguards

This repository holds only citation styles, but it uses the lab's shared safeguards like every lab repository: a PHI check on every commit and on GitHub, and the rules for AI assistants in [`AGENTS.md`](AGENTS.md). Turn the check on once in each clone: `git config core.hooksPath hooks`.

## Lab core files

Some files are the same in every lab repository and are changed only in the lab's project template; each says so at the top:

| Lab core (identical everywhere) | Per repository |
|---|---|
| `hooks/pre-commit`, `tools/phi_guard.pl`, `tools/test_phi_guard.pl`, `tools/install_hooks.R`, `.github/workflows/phi-check.yml`, `.github/CODEOWNERS`, `CLAUDE.md` | `phi-guard.conf` (settings, files to allow or block), `hooks/pre-commit.local` (extra checks, optional) |
| `.gitignore` and `.gitattributes` above their **This repository** sections | `.gitignore` and `.gitattributes` from **This repository** down |
| `AGENTS.md` above its **This project** section | `AGENTS.md` **This project** section |

