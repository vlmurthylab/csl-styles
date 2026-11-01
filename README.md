# Project name

One or two sentences: what question this project answers.

**Lead:** your name · **PI:** Venk Murthy · **Status:** active / paused / done

## Data

> **No subject-level data in this repo, identified or de-identified.**
> Data stays on lab storage; this repo holds code, plots and summary results only.

- **Where the data lives:** path on lab storage, e.g. `/path/to/project/data`
- **Source and version:** e.g. CARDIA exam 8 release, date received
- **Approvals:** IRB / DUA numbers, if any

## First-time setup

Turn on the PHI check once in each copy of this repo, from the repo folder: in R (for example an RStudio project) run `source("tools/install_hooks.R")`, or in a terminal run:

```sh
git config core.hooksPath hooks
```

Every commit is then checked for data files, text that looks like PHI (SSNs, MRN-like numbers, phone numbers, emails, and full dates in outputs such as notebooks and tables), and row-level data even without identifiers, such as a de-identified cohort study extract (long tables, participant ID columns, notebooks saved with outputs); see `tools/phi_guard.pl`. GitHub runs the same check on every push. If it flags a line that looks like PHI but isn't about a person, such as a random seed or a published sample size, add `phi-ok` in a comment on that line and say so in the commit message. For other stops, follow the check's message: clear notebook outputs, or ask Venk to list a large published table in `ALLOW_FILES`. Settings, including small-cell suppression, are in `phi-guard.conf`.

## AI assistants

Claude Code, Codex and similar tools are used only in cloud sessions on this GitHub repo, never on a machine that can reach the lab's data: PHI, and also the de-identified or licensed research data on the lab's other Turbo volume, which is covered by data use agreements. Their rules are in [`AGENTS.md`](AGENTS.md), which Codex reads directly and Claude Code loads through [`CLAUDE.md`](CLAUDE.md); fill in its **This project** section when you start.

## How to run

1. Point the code at the data location (e.g. set `DATA_DIR` in a local `.env` file, which git ignores).
2. Run the scripts in `code/` in order: ...

## Layout

| Folder | What goes there | In git? |
|---|---|---|
| `code/` | Analysis scripts and functions | Yes |
| `data/` | Local copy or link to the data | **No** (ignored) |
| `results/figures/` | Plots | Yes |
| `results/tables/` | Summary tables (no individual rows) | Yes |
| `reference/` | Small reference files: lookup tables, published coefficients | Yes |
| `docs/` | Notes, analysis plan, manuscript drafts | Yes |
| `hooks/`, `tools/` | The PHI check (lab core; leave as is) | Yes |

## Lab core files

Some files are the same in every lab repository and are changed only in [vlmurthylab/project-template](https://github.com/vlmurthylab/project-template); each says so at the top:

| Lab core (identical everywhere) | Per repository |
|---|---|
| `hooks/pre-commit`, `tools/phi_guard.pl`, `tools/install_hooks.R`, `.github/workflows/phi-check.yml`, `.github/CODEOWNERS`, `CLAUDE.md` | `phi-guard.conf` (settings, files to allow or block), `hooks/pre-commit.local` (extra checks, optional) |
| `.gitignore` and `.gitattributes` above their **This repository** sections | `.gitignore` and `.gitattributes` from **This repository** down |
| `AGENTS.md` above its **This project** section | `AGENTS.md` **This project** section |

## Before you push

Check what you're committing (`git status`, RStudio's Git pane or VS Code's Source Control view).
Make sure no subject-level data is included, including in notebook output.
The PHI check catches common patterns, not everything: it is a safety net, not a substitute for looking.
If something sensitive gets committed, tell Venk right away; deleting the file isn't enough.
