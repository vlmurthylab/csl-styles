// Renders made-up references through every style with citeproc-js, the engine
// Zotero uses, with links switched on as Zotero does, and checks:
//  - every style renders every item type;
//  - the NIH style prints no URL or access date for any CSL item type, and a
//    DOI (the only link) for preprints alone;
//  - no entry has a stray semicolon (";." or ending in ";") or a doubled edition;
//  - each compact style does what its name says: no-title styles print no
//    article title (but keep a dataset's), short-pages styles print 100-10;
//  - a chapter with no editor still reads "In: Book title".
// Run:  npm install citeproc@2.4.63  &&  node tests/check_citeproc_js.js
// tests/locales-en-US.xml is the CSL project's US English locale (CC BY-SA 3.0).
const CSL = require("citeproc");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const locale = fs.readFileSync(path.join(__dirname, "locales-en-US.xml"), "utf8");
const A = (n) => Array.from({ length: n }, (_, i) => ({ family: "Auth" + String.fromCharCode(65 + i), given: "Q R" }));
const web = { URL: "https://example.org/x", DOI: "10.0000/made.up", accessed: { "date-parts": [[1999, 1, 5]] } };
const items = [
  { id: "j5", type: "article-journal", title: "Five-author trial", "container-title": "Journal of Made Up", "container-title-short": "J Made Up", volume: "12", issue: "3", page: "100-110", issued: { "date-parts": [[2021, 5]] }, author: A(5), PMCID: "PMC0000001", ...web },
  { id: "aop", type: "article-journal", title: "Ahead of print article", "container-title": "Journal of Made Up", issued: { "date-parts": [[2025]] }, author: A(2), ...web },
  { id: "pre", type: "article", title: "A made-up preprint", publisher: "medRxiv", issued: { "date-parts": [[2024]] }, author: A(2), ...web },
  { id: "pre0", type: "article", title: "A preprint with no server", issued: { "date-parts": [[2024]] }, author: A(1), ...web },
  { id: "book", type: "book", title: "A made-up book", edition: "2", publisher: "Made Up Press", "publisher-place": "Ann Arbor", issued: { "date-parts": [[2019]] }, author: A(2), ...web },
  { id: "chap0", type: "chapter", title: "A chapter with no editor", "container-title": "A made-up volume", publisher: "Made Up Press", page: "1-20", issued: { "date-parts": [[2018]] }, author: A(1), ...web },
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
  const line = (id) => text[items.findIndex((i) => i.id === id)] || "";
  if (!/In: A made-up volume/.test(line("chap0"))) failures.push(`${f}: a chapter with no editor lacks "In:": ${line("chap0")}`);
  if (f.startsWith("compact")) {
    const noTitle = f.includes("no-title"), short = f.includes("short-pages");
    if (line("j5").includes("Five-author trial") === noTitle) failures.push(`${f}: article title ${noTitle ? "printed" : "missing"}: ${line("j5")}`);
    if (!line("data").includes("A made-up dataset")) failures.push(`${f}: a dataset lost its title: ${line("data")}`);
    const pages = short ? "100-10" : "100–110";
    if (!line("j5").includes(pages)) failures.push(`${f}: expected pages ${pages}: ${line("j5")}`);
  }
  if (f.startsWith("nih")) {
    // Every CSL 1.0.2 item type, each with a URL, DOI and access date: only a
    // preprint (type article) may carry its DOI, and so the only link
    const ALL_TYPES = ["article", "article-journal", "article-magazine", "article-newspaper", "bill", "book",
      "broadcast", "chapter", "classic", "collection", "dataset", "document", "entry", "entry-dictionary",
      "entry-encyclopedia", "event", "figure", "graphic", "hearing", "interview", "legal_case", "legislation",
      "manuscript", "map", "motion_picture", "musical_score", "pamphlet", "paper-conference", "patent",
      "performance", "periodical", "personal_communication", "post", "post-weblog", "regulation", "report",
      "review", "review-book", "software", "song", "speech", "standard", "thesis", "treaty", "webpage"];
    const typed = ALL_TYPES.map((t) => ({ id: "t-" + t, type: t, title: "A made-up " + t, "container-title": "Made Up Container",
      publisher: "Made Up Pub", number: "N-1", issued: { "date-parts": [[2022, 3, 4]] }, author: A(1), ...web }));
    const tById = Object.fromEntries(typed.map((i) => [i.id, i]));
    const eng = new CSL.Engine({ retrieveLocale: () => locale, retrieveItem: (id) => tById[id] }, style);
    eng.opt.development_extensions.wrap_url_and_doi = true;
    for (const fmt of ["html", "text"]) {
      eng.setOutputFormat(fmt);
      eng.updateItems(typed.map((i) => i.id));
      const out = eng.makeBibliography()[1].map((l) => l.trim());
      if (out.length !== typed.length) failures.push(`${f}: rendered ${out.length} of ${typed.length} item types`);
      typed.forEach((it, k) => {
        const h = out[k] || "", preprint = it.type === "article";
        const checks = [["a URL", /example\.org/i], ["an access date", /cited|accessed|1999/i]];
        if (!preprint) checks.push(["a link", /<a /i], ["a DOI", /doi|10\.0000/i]);
        for (const [what, re] of checks) {
          if (re.test(h)) failures.push(`${f}: ${it.type} (${fmt}) contains ${what} (NIH allows no hyperlinks): ${h}`);
        }
        if (preprint && fmt === "text" && !h.includes("doi: " + it.DOI)) failures.push(`${f}: preprint lacks its DOI: ${h}`);
        if (preprint && /<a /i.test(h) && !/href="https:\/\/doi\.org\//.test(h)) failures.push(`${f}: preprint links somewhere other than doi.org: ${h}`);
      });
    }
  }
}
if (failures.length) {
  console.log("\nFAILED:\n  " + failures.join("\n  "));
  process.exit(1);
}
console.log("\nAll citeproc-js checks passed.");
