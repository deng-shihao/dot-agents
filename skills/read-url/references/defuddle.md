# Defuddle

Extract article content from HTML with Defuddle. Check for an installed `defuddle` first; otherwise use Bun's package runner. Inspect `--help` before relying on the installed version's flags. The runner may download the package into its cache; it does not require a project dependency.

## Usage

Markdown output:

```bash
bun x defuddle parse <url> --markdown
```

Extract metadata only:

```bash
bun x defuddle parse <url> --property title
bun x defuddle parse <url> --property description
```

## Fallback when output is partial or wrong

Defuddle can drop sections or interleave comments and metadata on complex layouts. Compare its output with the required content. If raw HTML contains missing material, use the [HTML selector helper](html-selector.md).
