---
name: improve-codebase-architecture
description: Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick.
disable-model-invocation: true
---

# Improve Codebase Architecture

Surface architectural friction and propose **deepening opportunities** — refactors that turn shallow modules into deep ones. The aim is testability and AI-navigability.

This command is _informed_ by the project's domain model and built on a shared design vocabulary:

- Read [codebase-design](../codebase-design/SKILL.md) for the architecture vocabulary and its principles. Preserve the project's domain names when applying that vocabulary.
- Use the project's existing domain glossary and relevant ADRs when available. `CONTEXT.md` and `docs/adr/` are possible locations, not required files.

## Process

### 1. Explore

**Scope before you scan — YAGNI.** Deepening a module pays off by making future changes to it easier, so put extra weight on the parts of the codebase that have recently changed. Decide *where* to look before you look:

- If the user named a direction — a module, a subsystem, a pain point — take it, and skip the inference below.
- Otherwise, walk back a good stretch of the commit history (`git log --oneline`) to find the codebase's hot spots — the files and areas that keep coming up — and let those paths pull your attention first. If the changes are scattered with no clear hot spot, widen the net.

Read any existing domain glossary and relevant ADRs first. When they are absent, derive terminology from the code and record uncertain assumptions in the report.

Use available read-only search and file tools to walk the selected code. Delegate independent areas when a subagent tool and capacity are available; otherwise explore them sequentially. Note where you experience friction:

- Where does understanding one concept require bouncing between many small modules?
- Where are modules **shallow** — interface nearly as complex as the implementation?
- Where have pure functions been extracted just for testability, but the real bugs hide in how they're called (no **locality**)?
- Where do tightly-coupled modules leak across their seams?
- Which parts of the codebase are untested, or hard to test through their current interface?

Apply the **deletion test** to anything you suspect is shallow: would deleting it concentrate complexity, or just move it? A "yes, concentrates" is the signal you want.

Exploration is complete when each candidate names the affected callers, implementation, contracts to preserve, and existing verification. Ground each claimed problem in file and line evidence. If no candidate meets that bar, report that result without inventing a refactor.

### 2. Present candidates as an HTML report

Write a self-contained HTML file to the OS temp directory so nothing lands in the repo. Resolve the temp directory through the available runtime and create a fresh `architecture-review-<timestamp>.html`. Open it with the host's file or browser preview tool, or the operating system's opener when available. Quote paths passed to shell commands. Tell the user its absolute path.

Use inline CSS and SVG so the report works offline. If an installed Mermaid renderer is available, render its diagrams to SVG and embed them. Each candidate gets a **before/after visualisation** of the relevant call flow or ownership change. See [HTML-REPORT.md](HTML-REPORT.md) for the scaffold and diagram patterns.

For each candidate, render a card with:

- **Files** — which files/modules are involved, with line references for the observed friction
- **Problem** — why the current architecture is causing friction
- **Solution** — plain English description of what would change
- **Benefits** — explained in terms of locality and leverage, and how tests would improve
- **Before / After diagram** — side-by-side, custom-drawn, illustrating the shallowness and the deepening
- **Recommendation strength** — one of `Strong`, `Worth exploring`, `Speculative`, rendered as a badge

End the report with a **Top recommendation** section: which candidate you'd tackle first and why.

Use existing domain vocabulary for the domain and the `codebase-design` vocabulary for architecture. If the glossary defines "Order," use that name consistently.

**ADR conflicts**: if a candidate contradicts an existing ADR, only surface it when the friction is real enough to warrant revisiting the ADR. Mark it clearly in the card (e.g. a warning callout: _"contradicts ADR-0007 — but worth reopening because…"_). Don't list every theoretical refactor an ADR forbids.

Before presenting, verify that the file exists and inspect its rendered diagrams and text when a preview tool is available. Report rendering as unverified when it is unavailable; writing the file alone does not verify its presentation.

Do NOT propose interfaces yet. After the file is written, ask the user: "Which of these would you like to explore?"

### 3. Grilling loop

Once the user picks a candidate, read [grilling](../grilling/SKILL.md) to walk the decision tree with them: constraints, dependencies, the shape of the deepened module, what sits behind the seam, and what tests survive.

Record settled decisions as the conversation progresses. Keep document updates within the user's requested scope:

- **Naming a concept or sharpening a term?** Use the project's existing glossary when glossary updates are authorized. Otherwise include the proposed wording in the report. Create a new glossary only when requested.
- **User rejects the candidate with a load-bearing reason?** Offer an ADR, framed as: _"Want me to record this as an ADR so future architecture reviews don't re-suggest it?"_ Only offer when the reason would actually be needed by a future explorer to avoid re-suggesting the same thing — skip ephemeral reasons ("not worth it right now") and self-evident ones.
- **Want to explore alternative interfaces for the deepened module?** Read [DESIGN-IT-TWICE.md](../codebase-design/DESIGN-IT-TWICE.md) for the comparison process.
