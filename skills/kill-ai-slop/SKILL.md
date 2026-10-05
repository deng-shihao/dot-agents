---
name: kill-ai-slop
description: >
  Remove AI slop from web projects — templated visual and copy patterns that make
  landing pages, UIs, and docs feel generic. Covers HTML/CSS, React, Vue, Svelte,
  Astro, Tailwind, and Markdown.
disable-model-invocation: true
---

# Kill AI Slop

AI slop is **ugly** in a specific way: it piles on every possible style and detail without settling on a focus. A gradient, a glow, a mascot, emoji, a wall of glowing cards, every default switched on at once, until every product looks like the same garish template. It reads as "designed" in a thumbnail and falls apart the moment anyone looks. Your job is to strip it back to something a person would actually choose.

The principles, held on every fix you make:

1. **Decide before you decorate.** Every visual choice must be explainable.
2. **One accent, one voice.**
3. **Hierarchy from scale and space.** Coloring words or swapping fonts is a shortcut.
4. **Subtract first.** The first move toward not-ugly is removing things.
5. **Specific beats punchy** in copy.
6. **Decoration must mean something** — icons, badges, callouts are signals.

## Workflow

Follow these steps in order. For a review request, stop after the report. For an authorized cleanup, report the confirmed changes and continue within that scope.

### 1. Scope
Use the requested app/site source. If the project contains several apps and the target is unclear, resolve the target before scanning. Skip generated output, dependencies, lockfiles, and minified files.

### 2. Scan
Resolve this skill's directory from its supplied `SKILL.md` path. Run the bundled [scanner](scripts/scan.mjs) with that absolute path while keeping the project as the working directory:

```
bun "<absolute-skill-directory>/scripts/scan.mjs" "<project-root>"
bun "<absolute-skill-directory>/scripts/scan.mjs" "<project-root>" --json
```

The scanner has no dependencies and also runs with Node. It never edits files. Invalid roots and read errors must fail the scan; resolve the error before reporting coverage. It skips files larger than 512 KiB and lines longer than 2,000 characters. Inspect relevant skipped content separately and report any remaining coverage limits. Confirm each hit by reading the code.

### 3. Triage
For every hit, open the file and decide **slop vs. intentional**. This is the step that separates this skill from a lint rule. A gradient, a serif, or an emoji can be a real, defended choice. Keep anything the user clearly chose (brand tokens, a logo, a deliberate illustration). Flag only defaults.

Read the [taxonomy](references/taxonomy.md) for each signal's meaning and [detection reference](references/detection.md) for patterns and false positives.

### 4. Report
Before changing anything, give the user a grouped summary: each tell, the `file:line` hits you confirmed, one sentence on why, and the proposed fix. Mirror the format:

```
slop  src/Hero.tsx:12   indigo→violet gradient        → one solid accent
slop  src/Hero.tsx:31   gradient-clip headline        → solid ink, scale up
slop  src/Note.tsx:8    border-l-4 callout ×3         → 1 aside, rest is body
slop  copy.md:1         "not just X — it's Y"         → say the specific thing
→ 4 groups, 11 hits.
```

For review-only requests, leave the proposed fixes for the user. For cleanup requests, apply the confirmed groups already authorized. Ask only when a fix needs a brand or scope decision the user has not settled.

### 5. Fix
Apply the minimal change that removes the tell while preserving intent and function. Use the [fix examples](references/fixes.md) for remediation patterns.

- Prefer editing shared tokens/components over touching every call site.
- Preserve the project's existing palette and brand tokens. A new brand palette needs a user decision unless already authorized.
- Keep copy meaning; make it specific, don't just delete it.
- Re-run the scanner to find remaining signals. Record intentional hits and their reasons. Accept a fix when it preserves function and improves the rendered page; a lower hit count is not an acceptance criterion.

## Guardrails

- **Respect authorship.** Treat unfamiliar files and deliberate flourishes as someone's choice. When unsure whether something is slop, ask — don't strip it.
- **Small, reviewable diffs.** Never reformat unrelated code. Never run `git add -A`; stage explicit files only, and leave others' work-in-progress alone.
- **No new dependencies** to do this work.
- **Verify visually when possible.** If a dev server exists, look at the before and after; a passing scan is not the same as a better page.

## Completion

Report the reviewed scope, confirmed changes or findings, and intentional signals. For edits, run the project's relevant checks and inspect the changed views at desktop and mobile sizes. State which checks passed, failed, or were unavailable. If rendering is unavailable, report visual verification as incomplete.

For scanner changes, run `bun test "<absolute-skill-directory>/scripts/scan.test.mjs"`.
