---
name: everyday-note-summary
description: >
  Organize and summarize daily notes into structured, searchable documents.
  Use when asked to summarize, organize, or clean up daily notes, including YYYY-MM-DD*.md files.
---

# Everyday Note Summary

## File Naming

Format: `YYYY-MM-DD-{brief-title}.md`

- ISO date prefix for sortable listing.
- Brief English title describing the main topic.

## Summary Block

Place after any frontmatter, before the original content. Update an existing summary instead of adding another:

```
YYYY-MM-DD: Title

Topics:
- topic: one-line description
- topic: one-line description
```

## Workflow

Run only the steps requested. For an unspecified summary request, summarize in chat. Edit or rename source files only when the request calls for it.

### 1. Read and Summarize
Read the full note. Summarize each substantive topic without adding inferred facts. For a file update, use the Summary Block format above.

### 2. Restructure
- Group related topics under `##` headings, `###` for subtopics.
- Merge scattered or duplicated content into one section.
- Preserve all facts and information.

### 3. Correct
Fix spelling and typos. Skip code blocks, links, and technical references.

### 4. Rename
When renaming is requested, use `YYYY-MM-DD-{brief-title}.md`. Preserve a known date, check for collisions, and update affected links within scope.

## Edge Cases

- **No date in filename**: Use an explicit date in the note or its metadata. If none exists, retain the filename and ask only if the requested rename requires a date. Filesystem timestamps are not evidence of the note's date.
- **No discernible topic**: Use broadest category (e.g. "notes").
- **Multiple files in session**: Process each file independently.
- **File already well-structured**: Preserve its structure and update only the requested content.

## Completion

For file edits, compare against the original: preserve facts, code, links, frontmatter, and all content outside the requested changes. Confirm there is one summary and no overwritten file. Report any rename and unresolved date.
