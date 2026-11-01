# Zotero DOI/URL links: test plan for Word and Google Docs

## Why we're testing

NIH applications must have no hyperlinks, but preprints must be cited with their DOI. The plan was to propose a Zotero document preference to stop linking DOIs and URLs. Reading Zotero's code (zotero/zotero, release 10.0.7, October 2026) suggests that preference would change nothing. These tests check where the links really come from before we propose anything.

They also test this repository's README ("Before submitting: remove the preprint links") and the warning at the top of `nih-grant-proposal.csl`, which say Zotero turns any printed DOI into a live link in Word and Google Docs. Both get updated once the results are in. **Until then, keep following the README's steps:** removing links does no harm if there turn out to be none.

What the code suggests:

| Where | Prediction |
|---|---|
| Word, citations inserted with the plugin | **No DOI/URL links.** The RTF link output in citeproc (`chrome/content/zotero/xpcom/citeproc.js`) is commented out, and since Zotero 8.0.1 `xpcom/integration.js` also switches citeproc linking off for all word-processor integrations (commit 404667f, issue [zotero/zotero#5557](https://github.com/zotero/zotero/issues/5557)). LibreOffice should behave the same but isn't tested here. |
| Google Docs, citations inserted with the plugin | **Every citation and the whole bibliography is a hidden link** to `https://www.zotero.org/google-docs/?<key>` (no underline, normal colour). That's how the integration keeps track of its fields (zotero/zotero-google-docs-integration, `src/connector/document.js`). The DOI sits inside that link, so a preprint's DOI is still clickable (it goes to zotero.org, not doi.org). Zotero → Unlink Citations should remove these links. |
| Bibliography pasted from Quick Copy or Create Bibliography | **Live DOI/URL links** in both editors, if copied as HTML or rich text (`xpcom/style.js` always switches linking on). |

Not tested, for background: text typed by hand in Word or LibreOffice can be turned into a link by auto-format when you type a space or Enter after a URL.

## Style

Use **NLM/Vancouver**, listed in Zotero as "NLM/Vancouver: Citing Medicine 2nd edition (citation-sequence)" (`nlm-citation-sequence`). If it isn't installed, add it from Zotero Settings → Cite → Get additional styles. What it prints:
- journal articles with a DOI: a bare `doi:10.…`, no URL;
- other types (preprints, web pages, reports): `Available from: https://…`, `[cited …]` with the Accessed date (a bare `[cited]` if Accessed is empty), and `doi:…` if there is one.

Recommended as well: one more Word document and one more Google Doc in this repository's `nih-grant-proposal.csl`, part A only, with the same uploads. That's the exact grant setup and the case the README warning is about (it prints a DOI only for preprints, as `doi: 10…`). Install it first, as in the README's "Installing in Zotero".

## Test items (the same in every document)

Make these three by hand in Zotero (New Item, then fill in the fields), using made-up details like the ones below. Zotero links a DOI or URL whether or not it leads anywhere, so made-up items test the same thing, and nothing real ends up in the files or in the results written here.

Give each item the author "Alpha A" (last name Alpha, first name A) and put the year in Date.

1. **Journal Article**: Title "A made-up article", Publication "Made Up Journal", Date 2024, DOI `10.0000/made-up.1`.
2. **Preprint** (item type "Preprint"): Title "A made-up preprint", Repository "bioRxiv", Date 2025, DOI `10.0000/made-up.2`, URL `https://example.org/preprint`. This is the NIH case.
3. **Web Page**: Title "A made-up page", Date 2025, URL `https://example.org/page`, no DOI.

## Before you start

Zotero desktop must be running, with the Word plugin installed (Zotero Settings → Cite → Word Processors) and the Zotero Connector installed in the browser you use for Google Docs (it adds the Zotero menu there).

## Setup, in each document

1. Make a new document. On the Zotero toolbar or menu, open **Document Preferences** and choose the style.
2. In Word, leave "Store citation as bookmarks" unticked (the default) in Document Preferences.
3. For part B, set the Quick Copy style to the same style: Zotero Settings → Export → Item Format. Leave "Copy as HTML" unticked, and remove any site-specific settings listed there, so they don't override the style.

## Two parts, in each document

- **A. Plugin:** insert a citation for each item with the Zotero toolbar, then Add/Edit Bibliography.
- **B. Paste:** press Ctrl+End (Cmd+End on a Mac; Fn+Cmd+Right arrow on a Mac laptop) to go to the very end of the document, press Enter twice, and type the plain heading "Part B (pasted)". In Google Docs, click the heading: no link pop-up should appear. Then press Enter and paste a bibliography of the same items: select them in Zotero, press Ctrl+Shift+C (Cmd+Shift+C on a Mac), then paste with plain Ctrl+V (Cmd+V). Not Ctrl+Shift+V, which pastes plain text without links; in Word, if a Paste Options button appears, choose Keep Source Formatting. Starting B after a typed heading keeps the pasted text out of the Zotero bibliography, and out of its hidden link in Google Docs.

Don't type in or edit the bibliography text, and don't click Refresh after pasting.

## Files to upload to the session

**Word**
1. The saved `.docx`, citations still live.
2. A PDF made with the exact route below. The route matters: some routes drop all links, which would make the test look clean for the wrong reason.
   - Windows: File → Save As → PDF.
   - Mac: File → Save As → File Format "PDF" → "Best for electronic distribution and accessibility". Not File → Print → Save as PDF, which drops links.

**Google Docs** (every download is a conversion; Google's own format can't be downloaded)
1. File → Download → PDF (not the browser's Print), citations still live: the main evidence.
2. File → Download → Web page (.html, zipped), citations still live: the closest copy of the native links.
3. Make a copy, run Zotero → Unlink Citations in it, then download it as PDF the same way: checks that unlinking removes every link in part A. Part B's pasted DOI/URL links are expected to stay, since they aren't Zotero's.
4. Optional: `.docx` or `.odt` download, to compare a conversion.

If Zotero shows a warning when you download (PDF, Web page or Word), choose "Download Linked Version Anyway".

**Also note:** Zotero version, Word version, OS (Windows or Mac), the browser used for Google Docs, and the PDF route if it differed from the one above.

## What Claude will check

- **`.docx` / `.odt` / HTML:** every link, which text it covers, its target (doi.org, zotero.org, other) and how it's stored (Word hyperlink, `HYPERLINK` field, Zotero citation field, `zotero.org` marker).
- **PDF:** every link stored in the file and its target: the links a checker of the PDF would find. Some PDF viewers (Acrobat, for example) also make plain-text URLs clickable on their own, so what you see in a viewer can differ from what the file holds.
- **Report:** a table of links per entry, for part A vs part B, before vs after unlinking, compared with the predictions above.

The uploaded files stay in the session and aren't committed to any repository.

## After the results

Record the results in this file and update the README's "Before submitting" steps and the warning in `nih-grant-proposal.csl` to match.

- **Predictions confirmed:** the advice becomes "insert with the plugin, don't paste from Quick Copy; in Google Docs, unlink a final copy before exporting". The code change worth proposing is optional linking in Quick Copy and Create Bibliography (Zotero's local API already has an opt-in `linkwrap` parameter). Claude writes a design and a draft forum post for review; nothing is posted without approval.
- **Plugin-inserted DOIs show up as links:** find the source in the files and go back to the per-document preference idea.
- **Anything else** (for example, links that survive unlinking, links in a PDF but not in the document, or no links in part B): record it as found and decide with Venk before changing the README or the style.
