# Zotero DOI/URL links: test plan for Word and Google Docs

## Why we're testing

NIH applications must have no hyperlinks, but preprints must be cited with their DOI. The plan was to propose a Zotero document preference to stop linking DOIs and URLs. Reading the code (zotero/zotero main, October 2026; release 10.0.7) suggests that preference would change nothing. These tests check where the links really come from before we propose anything. They also test this repository's README ("Before submitting: remove the preprint links") and the warning at the top of `nih-grant-proposal.csl`, which say Zotero turns any printed DOI into a live link in Word and Google Docs. Both get updated once the results are in.

What the code suggests:

| Where | Prediction |
|---|---|
| Word / LibreOffice, citations inserted with the plugin | **No DOI/URL links.** The RTF link output in citeproc is commented out, and since 8.0.1 Zotero also switches citeproc linking off for all word-processor integrations (`integration.js:1994`, issue #5557). |
| Google Docs, citations inserted with the plugin | **Every citation and the whole bibliography is a hidden link** to `https://www.zotero.org/google-docs/?<key>` (no underline, normal colour). That's how the integration keeps track of its fields. Zotero → Unlink Citations should remove these links. |
| Bibliography pasted from Quick Copy or Create Bibliography | **Live DOI/URL links** in both editors (`style.js:865` always switches linking on). |
| Text edited by hand in Word / LibreOffice | Auto-format can turn URLs into links when you type a space or Enter after them. |

## Style

Use **NLM/Vancouver (`nlm-citation-sequence`)**. What it prints:
- journal articles: a bare `doi:10.…`, no URL;
- other types (preprints, web pages, reports): `Available from: https://…` and `doi:…`.

Optional: a second document in this repository's `nih-grant-proposal.csl` tests the exact grant setup (it prints a DOI only for preprints, as `doi: 10…`).

## Test items (the same in every document)

Use published papers or public preprints only: no references from a proposal in progress, so the files reveal no unpublished work.

1. Journal article with a DOI.
2. Preprint (item type "Preprint", e.g. bioRxiv) with a DOI and a URL. This is the NIH case.
3. Web page with a URL only.

## Two ways in, in each document

- **A. Plugin:** insert a citation for each item with the Zotero toolbar, then Add/Edit Bibliography.
- **B. Paste:** below part A, paste a bibliography of the same items copied with Quick Copy (Ctrl/Cmd+Shift+C, NLM as the Quick Copy style) or with Create Bibliography from Items → Copy to Clipboard.

Don't type in or edit the bibliography text.

## Files to upload to the session

**Word**
1. The saved `.docx`, citations still live.
2. PDF from File → Save as PDF (the form you'd submit).

**Google Docs** (every download is a conversion; Google's own format can't be downloaded)
1. PDF, citations still live: the main evidence.
2. File → Download → Web page (.html, zipped), citations still live: the closest copy of the native links.
3. Make a copy, run Zotero → Unlink Citations in it, then download it as PDF: checks that unlinking removes every link.
4. Optional: `.docx` or `.odt` download, to compare a conversion.

When Zotero warns before a download, choose "Download Linked Version Anyway".

**Also note:** Zotero version, Word version and OS (Windows or Mac), and the browser used for Google Docs.

## What Claude will check

- **`.docx` / `.odt` / HTML:** every link, which text it covers, its target (doi.org, zotero.org, other) and how it's stored (Word hyperlink, `HYPERLINK` field, Zotero citation field, `zotero.org` marker).
- **PDF:** every clickable link area and its target. This is what a grants office checker sees.
- **Report:** a table of links per entry, for part A vs part B, before vs after unlinking, compared with the predictions above.

The uploaded files stay in the session and aren't committed to any repository.

## After the results

- Record the results in this file and update the README's "Before submitting" steps and the warning in `nih-grant-proposal.csl` to match.

- **Predictions confirmed:** the advice becomes "insert with the plugin, don't paste from Quick Copy; in Google Docs, unlink a final copy before exporting". The code change worth proposing is optional linking in Quick Copy and Create Bibliography (Zotero's local API already has an opt-in `linkwrap` parameter). Claude writes a design and a draft forum post for review; nothing is posted without approval.
- **Plugin-inserted DOIs show up as links:** find the source in the files and go back to the per-document preference idea.
