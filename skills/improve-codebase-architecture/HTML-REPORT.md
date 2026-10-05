# HTML Report Format

Render the review as one offline HTML file in the OS temp directory. Inline the CSS and SVG. If an installed Mermaid renderer is available, embed its SVG output; otherwise draw the diagrams with HTML and SVG. The report must remain readable without network access or scripts.

## Scaffold

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture review — {{repo name}}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; background: #fafaf9; color: #0f172a; font: 16px/1.5 system-ui, sans-serif; }
      main { max-width: 64rem; margin: auto; padding: 3rem 1.5rem; }
      section, article { margin-block: 3rem; }
      .comparison { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
      .diagram { padding: 1rem; background: white; border: 1px solid #cbd5e1; }
      svg { display: block; width: 100%; height: auto; }
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { fill: #0f172a; }
      @media (max-width: 40rem) { .comparison { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <main>
      <header>...</header>
      <section id="candidates">...</section>
      <section id="top-recommendation">...</section>
    </main>
  </body>
</html>
```

Escape repository text inserted into HTML or SVG. Replace every placeholder and provide each SVG with a descriptive title. Inspect the saved report at narrow and wide viewport sizes when rendering tools are available. Verify that text, labels, arrows, and diagrams remain readable; report any unavailable visual checks.

## Header

Repo name, date, and a compact legend: solid box = module, dashed line = seam, red arrow = leakage, thick dark box = deep module. No introduction paragraph — straight into the candidates.

## Candidate card

The diagrams carry the weight. Prose is sparse, plain, and uses the glossary terms (from the `/codebase-design` skill) without ceremony.

Each candidate is one `<article>`:

- **Title** — short, names the deepening (e.g. "Collapse the Order intake pipeline").
- **Badge row** — recommendation strength (`Strong` = emerald, `Worth exploring` = amber, `Speculative` = slate), plus a tag for the dependency category (`in-process`, `local-substitutable`, `ports & adapters`, `mock`).
- **Files** — monospaced paths with line references for the observed problem.
- **Before / After diagram** — the centrepiece. Two columns, side by side. See patterns below.
- **Problem** — one sentence. What hurts.
- **Solution** — one sentence. What changes.
- **Wins** — bullets, ≤6 words each. e.g. "Tests hit one interface", "Pricing logic stops leaking", "Delete 4 shallow wrappers".
- **ADR callout** (if applicable) — one line in an amber-tinted box.

No paragraphs of explanation. If the diagram needs a paragraph to be understood, redraw the diagram.

## Diagram patterns

Pick the pattern that fits the candidate. Mix them. Don't make every diagram look the same — variety is part of the point.

### Call-flow graph

Show the observed call direction and identify the proposed change. Use Mermaid only when a local renderer can produce embedded SVG. This plain SVG example has no runtime dependency:

```html
<div class="diagram">
  <svg viewBox="0 0 440 90" role="img" aria-labelledby="order-flow-title">
    <title id="order-flow-title">Order intake calls order storage</title>
    <defs>
      <marker id="order-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 Z" fill="#475569" />
      </marker>
    </defs>
    <g fill="white" stroke="#475569">
      <rect x="10" y="15" width="170" height="60" rx="4" />
      <rect x="260" y="15" width="170" height="60" rx="4" />
      <path d="M180 45 H255" marker-end="url(#order-arrow)" />
    </g>
    <g text-anchor="middle" fill="#0f172a" font-size="16">
      <text x="95" y="51">Order intake</text>
      <text x="345" y="51">Order storage</text>
    </g>
  </svg>
</div>
```

Use distinct SVG IDs for each diagram so marker and title references remain local to the intended graphic.

### Hand-built boxes-and-arrows (when Mermaid's layout fights you)

Modules as `<div>`s with borders and labels. Arrows as inline SVG `<line>` or `<path>` elements positioned absolutely over a relative container. Reach for this when you want the "after" diagram to feel like one thick-bordered deep module with greyed-out internals — Mermaid won't render that with the right weight.

### Cross-section (good for layered shallowness)

Stack horizontal bands to show layers a call passes through. Before: 6 thin layers each doing nothing. After: 1 thick band labelled with the consolidated responsibility.

### Mass diagram (good for "interface as wide as implementation")

Two rectangles per module — one for interface surface area, one for implementation. Before: interface rectangle is nearly as tall as the implementation rectangle (shallow). After: interface rectangle is short, implementation rectangle is tall (deep).

### Call-graph collapse

Before: a tree of function calls rendered as nested boxes. After: the same tree collapsed into one box, with the now-internal calls shown faded inside it.

## Style guidance

- Lean editorial, not corporate-dashboard. Use generous whitespace and system fonts; serif is optional for headings.
- Colour sparingly: one accent (emerald or indigo) plus red for leakage and amber for warnings.
- Keep diagrams ~320px tall so before/after sits comfortably side by side without scrolling.
- Keep module labels legible at the diagram's rendered size.
- Keep the artifact static and self-contained: embedded styles and diagrams, with no CDN requests.

## Top recommendation section

One larger card. Candidate name, one sentence on why, anchor link to its card. That's it.

## Tone

Plain English, concise — but the architectural nouns and verbs come straight from the `/codebase-design` skill. Concision is not an excuse to drift.

**Use exactly:** module, interface, implementation, depth, deep, shallow, seam, adapter, leverage, locality.

**Never substitute:** component, service, unit (for module) · API, signature (for interface) · boundary (for seam) · layer, wrapper (for module, when you mean module).

**Phrasings that fit the style:**

- "Order intake module is shallow — interface nearly matches the implementation."
- "Pricing leaks across the seam."
- "Deepen: one interface, one place to test."
- "Two adapters justify the seam: HTTP in prod, in-memory in tests."

**Wins bullets** name the gain in glossary terms: *"locality: bugs concentrate in one module"*, *"leverage: one interface, N call sites"*, *"interface shrinks; implementation absorbs the wrappers"*. Don't write *"easier to maintain"* or *"cleaner code"* — those terms aren't in the glossary and don't earn their place.

No hedging, no throat-clearing, no "it's worth noting that…". If a sentence could be a bullet, make it a bullet. If a bullet could be cut, cut it. If a term isn't in the `/codebase-design` glossary, reach for one that is before inventing a new one.
