# HTML selector fallback

Apply the [fetch and pipeline checks](../SKILL.md#fallback-ladder) before using these recipes.

Use when `curl -fsSL --connect-timeout 10 --max-time 30 <url>` returns full HTML but defuddle's output is partial or wrong — typically Q&A pages, multi-post threads, or any layout where defuddle's "main article" heuristic drops sibling content.

When raw HTML contains only an application shell, use an available rendered-page or browser tool.

## Find the selector

Save the HTML to a unique temporary file and search for classes near the wanted content:

```bash
READ_URL_HTML=$(mktemp "${TMPDIR:-/tmp}/read-url.XXXXXX")
if ! curl -fsSL --connect-timeout 10 --max-time 30 '<url>' -o "$READ_URL_HTML"; then
  exit 1
fi
rg -o "class=[\"'][^\"']*" "$READ_URL_HTML" | sed 's/class=.//' | tr ' ' '\n' | sort -u
```

Handles both double- and single-quoted `class=` attrs; one class per line.

If the user can name the selector (e.g. from browser devtools), use that directly.

## Extract

```bash
"$READ_URL_DIR/scripts/html-select.py" '<css selector>' < "$READ_URL_HTML"
```

Resolve `READ_URL_DIR` from the loaded [skill](../SKILL.md), and check that `uv` is available. The [selector script](../scripts/html-select.py) declares `beautifulsoup4` and `markdownify` as isolated script dependencies. Its first run can require a download. A nonzero exit status or empty selection is a failed extraction.

If dependencies cannot be resolved, report the missing package and try another available reader.

## Still not working?

If the HTML lacks the requested content, inspect whether it contains an access challenge or application shell. Use another available fetch or browser route and report incomplete coverage if it also fails.
