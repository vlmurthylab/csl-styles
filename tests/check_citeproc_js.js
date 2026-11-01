// Renders made-up references through every style with citeproc-js, the engine
// Zotero uses, with links switched on as Zotero does, and checks:
//  - every style renders every item type;
//  - the NIH style's output has no link, URL, DOI or access date at all;
//  - no entry has a stray semicolon (";." or ending in ";") or a doubled edition.
// Run:  npm install citeproc@2.4.63  &&  node tests/check_citeproc_js.js
// tests/locales-en-US.xml is the CSL project's US English locale (CC BY-SA 3.0).
const CSL = require("citeproc");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const locale = fs.readFileSync(path.join(__dirname, "locales-en-US.xml"), "utf8");
const A = (n) => Array.from({ length: n }, (_, i) => ({ family: "Auth" + String.fromCharCode(65 + i), given: "Q R" }));
const web = { URL: "https://example.org/x", DOI: "10.0000/made.up", accessed: { "date-parts": [[2024, 1, 5]] } };
const items = [
  { id: "j5", type: "article-journal", title: "Five-author trial", "container-title": "Journal of Made Up", "container-title-short": "J Made Up", volume: "12", issue: "3", page: "100-110", issued: { "date-parts": [[2021, 5]] }, author: A(5), PMCID: "PMC0000001", ...web },
  { id: "aop", type: "article-journal", title: "Ahead of print article", "container-title": "Journal of Made Up", issued: { "date-parts": [[2025]] }, author: A(2), ...web },
  { id: "pre", type: "article", title: "A made-up preprint", publisher: "medRxiv", issued: { "date-parts": [[2024]] }, author: A(2), ...web },
  { id: "pre0", type: "article", title: "A preprint with no server", issued: { "date-parts": [[2024]] }, author: A(1), ...web },
  { id: "book", type: "book", title: "A made-up book", edition: "2", publisher: "Made Up Press", "publisher-place": "Ann Arbor", issued: { "date-parts": [[2019]] }, author: A(2), ...web },
  { id: "chap", type: "chapter", title: "A made-up chapter", "container-title": "A made-up volume", publisher: "Made Up Press", "publisher-place": "Ann Arbor", page: "1-20", issued: { "date-parts": [[2018]] }, author: A(1), editor: A(1), ...web },
  { id: "conf", type: "paper-conference", title: "A made-up paper", "container-title": "Proceedings of Made Up", publisher: "Made Up Society", page: "5-6", issued: { "date-parts": [[2020]] }, author: A(1), ...web },
  { id: "rep", type: "report", title: "A made-up report", number: "TR-1", publisher: "Made Up Agency", "publisher-place": "Bethesda (MD)", issued: { "date-parts": [[2022]] }, author: A(1), ...web },
  { id: "thes", type: "thesis", title: "A made-up thesis", genre: "PhD thesis", publisher: "Made Up University", "publisher-place": "Ann Arbor (MI)", issued: { "date-parts": [[2017]] }, author: A(1), ...web },
  { id: "page", type: "webpage", title: "A made-up web page", "container-title": "Made Up Site", issued: { "date-parts": [[2023]] }, author: A(1), ...web },
  { id: "data", type: "dataset", title: "A made-up dataset", publisher: "Made Up Repository", issued: { "date-parts": [[2022]] }, author: A(1), ...web },
  { id: "news", type: "article-newspaper", title: "A made-up story", "container-title": "Made Up Times", issued: { "date-parts": [[2022, 4, 1]] }, author: A(1), ...web },
];
const byId = Object.fromEntries(items.map((i) => [i.id, i]));

function render(style, fmt) {
  const eng = new CSL.Engine({ retrieveLocale: () => locale, retrieveItem: (id) => byId[id] }, style);
  eng.opt.development_extensions.wrap_url_and_doi = true; // as Zotero does
  eng.setOutputFormat(fmt);
  eng.updateItems(items.map((i) => i.id));
  return eng.makeBibliography()[1].map((l) => l.trim());
}

const failures = [];
const styles = fs.readdirSync(root).filter((f) => f.endsWith(".csl")).sort();
for (const f of styles) {
  const style = fs.readFileSync(path.join(root, f), "utf8");
  const text = render(style, "text");
  const html = render(style, "html").join("\n");
  console.log("== " + f);
  text.forEach((l) => console.log("   " + l));
  if (text.length !== items.length) failures.push(`${f}: rendered ${text.length} of ${items.length} items`);
  text.forEach((l) => {
    if (/;\s*\.|;$/.test(l)) failures.push(`${f}: stray semicolon in: ${l}`);
    if ((l.match(/\bed\./g) || []).length > 1) failures.push(`${f}: edition printed twice in: ${l}`);
  });
  if (f.startsWith("nih")) {
    for (const [what, re] of [["a link", /<a /i], ["a URL", /http|example\.org/i], ["a DOI", /doi|10\.0000/i], ["an access date", /cited|accessed|2024 Jan/i]]) {
      if (re.test(html)) failures.push(`${f}: output contains ${what} (NIH allows no hyperlinks)`);
    }
  }
}
if (failures.length) {
  console.log("\nFAILED:\n  " + failures.join("\n  "));
  process.exit(1);
}
console.log("\nAll citeproc-js checks passed.");
