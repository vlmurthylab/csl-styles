# Why Google Docs citations are links, and what to do about it

NIH applications must contain no active hyperlinks. In Google Docs, every citation and the whole bibliography that Zotero inserts is a link. This note explains why, what can be done, and what can't. The steps for an application are in the README ("Before submitting"); this is the background.

## What happens

With the Zotero plugin in Google Docs, each citation and the bibliography are linked to `https://www.zotero.org/google-docs/?<key>`. The links have no underline and keep the text's colour, so they only show when you hover over them. Our tests ([results](zotero-link-test-plan.md#results-november-2026-predictions-confirmed)) found these links in every Google Docs download: PDF, Web page and `.docx`. This happens with any style, ours included: the plugin makes the links, not the style.

## Why

The plugin uses the links to find its citations in the text. Each one is a link whose address ends in a key, and the citation's data (which items it cites, its formatting) is stored in a hidden "named range" under the same key. When Zotero refreshes the document, it scans the links to find every citation and bibliography. Without the links, it can't find them. You can see this in the plugin's source, `src/connector/document.js` in [zotero/zotero-google-docs-integration](https://github.com/zotero/zotero-google-docs-integration): it writes the link onto the field text and reads it back when it scans the document.

Word works differently: Zotero keeps its citations in Word's own fields, which aren't links, so citations inserted with the plugin in Word have no links at all.

## What you can do

| Option | Removes the links? | Tested? |
|---|---|---|
| **Unlink a final copy.** File → Make a copy, run **Zotero → Unlink Citations** in the copy, and download that copy as PDF. Keep editing the original, which stays connected to Zotero. | Yes, every Zotero link | Yes |
| **Switch the document to Word.** In Google Docs, Zotero → Document Preferences → **Switch to a different word processor**, then download the `.docx`, open it in Word and let Zotero reconnect the citations. From then on you work in Word. | Should, once Word takes over | No |
| **Change the style** | No: the plugin makes the links | Yes |
| **Download without unlinking.** Zotero warns before a download and suggests unlinking; "Download Linked Version Anyway" keeps the links | No | Yes |

Unlinking is the one tested way, and it's what the README recommends. Zotero itself points to it: its developers say the plugin intercepts downloads "only to notify the user to unlink the citations" ([issue #43](https://github.com/zotero/zotero-google-docs-integration/issues/43), 2020).

## Could Zotero change this?

Not easily. The links are how the plugin tracks its citations, so turning them off would mean a different way to find them in the text. One smaller change that could help is a download option that makes the unlinked copy for you, combining the two steps above. For bibliographies pasted from Quick Copy or Create Bibliography, which carry live DOI and URL links in both Word and Google Docs, a change is simpler; see the README.

Checked against Zotero 10.0.7 and the plugin's source in November 2026.
