# GitHub

Apply the [fetch and pipeline checks](../SKILL.md#fallback-ladder) before using these recipes.

## Known file path (preferred)

For a known public file:

```bash
curl -fsSL --connect-timeout 10 --max-time 30 https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>
```

Use this whenever you have an explicit file path. For wiki pages: `https://raw.githubusercontent.com/wiki/<owner>/<repo>/<page>.md`.

## Issue or PR body + comments

```bash
gh issue view <n> -R <owner>/<repo> --json title,body,state,author,comments,labels
gh pr   view <n> -R <owner>/<repo> --json title,body,state,author,comments,files,reviews
```

Alternatively, pass a URL instead of `<n> -R ...`:

```bash
gh issue view https://github.com/<owner>/<repo>/issues/<n> --json ...
```

The `comments` field returns an array of `{author, body, createdAt}` — no need for a separate call.

## Search issues / PRs

For public search, try the endpoint and inspect its status and rate-limit response:

```bash
curl -fsSL --connect-timeout 10 --max-time 30 'https://api.github.com/search/issues?q=is:issue+<query>&per_page=10' | jq
```

Narrow queries with `is:issue` or `is:pr`. Other useful qualifiers include `repo:<owner>/<repo>`, `author:<user>`, `label:<label>`, `state:open`, and `in:title`. Encode the query as a URL parameter.

When available, `gh search issues <query>` and `gh search prs <query>` provide CLI search. Inspect their help for supported filters and limits.

## Repo / gist metadata

```bash
gh repo view <owner>/<repo> --json name,description,defaultBranchRef,stargazerCount,languages
gh repo view <owner>/<repo>
gh gist view <id>
```

The plain `gh repo view` command displays the README; `readme` is not a supported JSON field.

## Other read endpoints

Use available authenticated read tooling when the task requires private content or a REST endpoint absent from the view commands. Inspect `gh api --help` and use an explicit GET method for REST reads. Follow pagination when the requested scope requires every result. Tool availability and permissions come from the current session.
