// Writes SAMPLES.md: how each style formats the common Zotero item types, made
// with citeproc-js (the engine Zotero uses in Word). Every sample uses the same
// made-up title, authors and year, so item types that a style formats the same
// way give identical output and are shown once, with their names together.
//   npm install citeproc@2.4.63
//   node scripts/make_samples.js           write SAMPLES.md
//   node scripts/make_samples.js --check   fail if SAMPLES.md is out of date (CI)
const CSL = require("citeproc");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const locale = fs.readFileSync(path.join(root, "tests", "locales-en-US.xml"), "utf8");
const people = (n) => ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta"].slice(0, n).map((f) => ({ family: f, given: "A" }));
// Fields every item has in Zotero, including the ones NIH proposals mustn't link to
const base = { title: "A made-up title", author: people(2), issued: { "date-parts": [[2021, 5, 4]] },
               URL: "https://example.org/item", accessed: { "date-parts": [[2024, 1, 5]] } };
const journal = { "container-title": "Journal of Made-Up Medicine", "container-title-short": "J Made-Up Med", volume: "12", issue: "3", page: "100-110", DOI: "10.0000/made.up" };

// Common item types, in Zotero's names, with the fields Zotero gives each
const TYPES = [
  ["Journal article", { type: "article-journal", ...journal }],
  ["Journal article, ahead of print (no volume or pages)", { type: "article-journal", "container-title": journal["container-title"], "container-title-short": journal["container-title-short"], DOI: journal.DOI }],
  ["Journal article with a PMCID (in Zotero's Extra field)", { type: "article-journal", ...journal, PMCID: "PMC0000001" }],
  ["Preprint", { type: "article", publisher: "medRxiv", DOI: "10.0000/made.up" }],
  ["Book", { type: "book", publisher: "Made-Up Press", "publisher-place": "Ann Arbor (MI)", edition: "2" }],
  ["Edited book", { type: "book", author: undefined, editor: people(2), publisher: "Made-Up Press", "publisher-place": "Ann Arbor (MI)" }],
  ["Book section (chapter)", { type: "chapter", "container-title": "A made-up edited volume", editor: people(1), publisher: "Made-Up Press", "publisher-place": "Ann Arbor (MI)", page: "1-20" }],
  ["Conference paper", { type: "paper-conference", "container-title": "Proceedings of the Made-Up Meeting", publisher: "Made-Up Society", page: "5-6" }],
  ["Report", { type: "report", number: "TR-1", publisher: "Made-Up Agency", "publisher-place": "Bethesda (MD)" }],
  ["Thesis", { type: "thesis", genre: "PhD thesis", publisher: "Made-Up University", "publisher-place": "Ann Arbor (MI)" }],
  ["Web page", { type: "webpage", "container-title": "Made-Up Site" }],
  ["Dataset", { type: "dataset", publisher: "Made-Up Repository", DOI: "10.0000/made.up" }],
  ["Software", { type: "software", publisher: "Made-Up Lab", version: "1.2" }],
  ["Newspaper article", { type: "article-newspaper", "container-title": "The Made-Up Times" }],
  ["Magazine article", { type: "article-magazine", "container-title": "Made-Up Monthly", volume: "4", page: "10" }],
  ["Document", { type: "document", publisher: "Made-Up Organization" }],
  ["Manuscript", { type: "manuscript" }],
];
const AUTHOR_COUNTS = [1, 2, 3, 4, 5, 7];

function entry(style, item) {
  const it = { id: "x", ...base, ...item };
  if (it.author === undefined) delete it.author;
  const eng = new CSL.Engine({ retrieveLocale: () => locale, retrieveItem: () => it }, style);
  eng.opt.development_extensions.wrap_url_and_doi = true; // as Zotero does
  eng.setOutputFormat("html");
  eng.updateItems(["x"]);
  const html = eng.makeBibliography()[1][0];
  // Bibliography entry without citeproc's wrapping divs; GitHub shows <i>, <sup>, <a>
  return html.replace(/<\/?div[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function citation(style) {
  const items = [1, 2, 3, 5].map((n) => ({ id: "c" + n, ...base, type: "article-journal", ...journal, title: "Made-up title " + n }));
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  const eng = new CSL.Engine({ retrieveLocale: () => locale, retrieveItem: (id) => byId[id] }, style);
  eng.setOutputFormat("html");
  eng.updateItems(items.map((i) => i.id));
  const one = eng.processCitationCluster({ citationID: "A", citationItems: [{ id: "c1" }], properties: { noteIndex: 0 } }, [], [])[1][0][1];
  const many = eng.processCitationCluster({ citationID: "B", citationItems: items.map((i) => ({ id: i.id })), properties: { noteIndex: 0 } }, [["A", 0]], [])[1].pop()[1];
  return `one source: text${one}; four sources in a row: text${many}`;
}

// Same output for several types: show it once, with their names together
function grouped(style, rows) {
  const groups = new Map();
  for (const [label, item] of rows) {
    const out = entry(style, item);
    if (!groups.has(out)) groups.set(out, []);
    groups.get(out).push(label);
  }
  return [...groups].map(([out, labels]) => `| ${labels.join("; ")} | ${out.replace(/\|/g, "\\|")} |`);
}

const lines = [
  "# Samples",
  "",
  "How each style formats the common Zotero item types, made with citeproc-js 2.4.63, the engine Zotero uses in Word, from made-up references. Item types a style formats the same way are shown once, together. Every sample item has a URL and an access date in Zotero, and most have a DOI, so you can see which styles print them: the NIH style never does.",
  "",
  "Regenerated by `node scripts/make_samples.js`; GitHub checks it's up to date. Don't edit by hand.",
  "",
];
// NIH first, then the compact styles from least to most compact
const ORDER = ["nih-grant-proposal.csl", "compact-3-authors.csl", "compact-1-author.csl",
  "compact-1-author-no-title.csl", "compact-1-author-no-title-short-pages.csl"];
const rank = (f) => (ORDER.includes(f) ? ORDER.indexOf(f) : ORDER.length);
const styles = fs.readdirSync(root).filter((f) => f.endsWith(".csl")).sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
for (const f of styles) {
  const style = fs.readFileSync(path.join(root, f), "utf8");
  const title = (style.match(/<title>([^<]*)<\/title>/) || [])[1] || f;
  lines.push(`## ${title}`, "", `\`${f}\` · In the text: ${citation(style)}`, "");
  lines.push("| Item type | Reference list |", "|---|---|", ...grouped(style, TYPES), "");
  lines.push("| Number of authors (journal article) | Reference list |", "|---|---|",
    ...grouped(style, AUTHOR_COUNTS.map((n) => [`${n} author${n > 1 ? "s" : ""}`, { type: "article-journal", ...journal, author: people(n) }])), "");
}
const md = lines.join("\n");
const target = path.join(root, "SAMPLES.md");
if (process.argv.includes("--check")) {
  const now = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  if (now !== md) { console.log("SAMPLES.md is out of date: run node scripts/make_samples.js and commit it."); process.exit(1); }
  console.log("SAMPLES.md is up to date.");
} else {
  fs.writeFileSync(target, md);
  console.log("wrote SAMPLES.md");
}
