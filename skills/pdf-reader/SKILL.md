---
name: "pdf-reader"
description: "Use when a task involves reading, creating, or reviewing a PDF where rendering and layout matter."
---


# PDF Skill

## Workflow
1. Prefer visual review: render PDF pages to PNGs and inspect them.
   - Use `pdftoppm` if available.
   - Discover the repository or bundled document runtime before setting up dependencies. In Codex, use the available workspace-dependency discovery tool.
   - If no renderer is available, report visual verification as unavailable and preserve the source and output for review.
2. Use `reportlab` to generate PDFs when creating new documents.
3. Use `pdfplumber` (or `pypdf`) for text extraction and quick checks; do not rely on it for layout fidelity.
4. After each meaningful update, re-render pages and verify alignment, spacing, and legibility.

## Temp and output conventions
- Use `tmp/pdfs/` for intermediate files; delete when done.
- Write final artifacts under `output/pdf/` when working in this repo.
- Keep filenames stable and descriptive.

## Dependencies

Use libraries from the repository or bundled runtime first. Check imports and `pdftoppm -h` in that runtime. If Python packages are missing, use an isolated `uv run --with <required-package>` environment for only the packages this task needs. Leave global Python and system packages unchanged unless the user requests installation.

Report unavailable dependencies and the checks they prevent. A missing renderer does not establish that the PDF layout is correct.

## Rendering command
```
pdftoppm -png "$INPUT_PDF" "$OUTPUT_PREFIX"
```

## Quality expectations
- Maintain polished visual design: consistent typography, spacing, margins, and section hierarchy.
- Avoid rendering issues: clipped text, overlapping elements, broken tables, black squares, or unreadable glyphs.
- Charts, tables, and images must be sharp, aligned, and clearly labeled.
- Use ASCII hyphens only. Avoid U+2011 (non-breaking hyphen) and other Unicode dashes.
- Citations and references must be human-readable; never leave tool tokens or placeholder strings.

## Final checks
- When rendering is available, inspect the latest pages and resolve visible defects before delivery. Otherwise, label layout verification as unavailable.
- Confirm headers/footers, page numbering, and section transitions look polished.
- Keep intermediate files organized or remove them after final approval.
