---
name: read-url
description: >
  Extract clean markdown from a web page. Use when curl output is noisy HTML or a fetch returns truncated or blocked content.
---

# Read URL

Inspect the session's available search, fetch, and browser tools first. Use a native reader when it returns the required content; apply the ladder below when it is missing, truncated, or blocked. Tool names vary across hosts.

For local helpers, resolve this skill's directory from the loaded `SKILL.md` path. Set `READ_URL_DIR` to that absolute directory, then use the scripts beneath it. Check a required executable with `command -v` before choosing its route.

## Fallback ladder

Try each applicable route once. Preserve the status or error before moving to a different route.

1. **Raw text.** Fetch a known `.md`, `.txt`, or raw-file URL with `curl -fsSL --connect-timeout 10 --max-time 30 '<url>'`.
2. **Known site.** Select the matching CLI or API recipe in the [routing table](#routing-table). These are candidate routes, not guarantees about the current host or service.
3. **Documentation.** Try the page's Markdown route, such as `<url>.md`. Accept it only when the response contains the requested page rather than an error or HTML shell.
4. **Blog or index.** Try a linked RSS/Atom feed, or one likely feed path (`/feed`, `/rss`, `/feed.xml`, `/atom.xml`, `/index.xml`). Check whether it contains the requested item and full text; a summary is partial evidence.
5. **Server-rendered HTML.** Use [Defuddle](references/defuddle.md). If extraction drops required sections, use the [HTML selector helper](references/html-selector.md).
6. **Rendered or blocked content.** Use another available fetch or browser tool. If it also fails, report the missing material. Request user-provided content only when the task cannot proceed without it.

Use bounded HTTP requests as in step 1. For Bash or Zsh pipelines, run `set -o pipefail` first and inspect the pipeline's exit status. Otherwise, fetch to a temporary file and parse only after a successful fetch. HTTP errors, authentication screens, empty bodies, and metadata-only responses do not establish access to the requested content.

## Routing table

Step 2: select by domain. Check returned content and pagination before calling a route complete.

| Domain / Pattern | Preferred path |
|---|---|
| `github.com` / `gist.github.com` | File via `raw.githubusercontent.com`; issue/PR via `gh issue view` / `gh pr view`; search via anonymous `api.github.com/search/issues` — see [GitHub](references/github.md) |
| `x.com` / `twitter.com` / `t.co` | `curl -fsSL --connect-timeout 10 --max-time 30 https://api.fxtwitter.com/<user>/status/<id> \| jq` |
| `youtube.com` / `youtu.be` | `yt-dlp --dump-json --skip-download` for title/description/metadata; `yt-dlp --write-auto-sub --sub-lang en --skip-download` for transcript |
| `arxiv.org` / `ssrn.com` | `curl -fsSL --connect-timeout 10 --max-time 30 'https://r.jina.ai/<url>'` for a candidate Markdown extraction; verify that it includes the requested paper text |
| `mp.weixin.qq.com` (微信公众号) | Available fetch or browser tool; validate that it returned the article body |
| `www.cnblogs.com` (博客园) | Plain defuddle works — server-rendered HTML with the article body inline. For a user's post index: `curl -fsSL --connect-timeout 10 --max-time 30 'https://www.cnblogs.com/<user>/rss'` (Atom feed) |
| `blog.csdn.net` (CSDN) | Available fetch or browser tool if local extraction is empty; `https://blog.csdn.net/<user>/rss/list` may supply an index or summaries |
| `zhihu.com` / `zhuanlan.zhihu.com` (知乎) | Available fetch or browser tool; check for an access challenge |
| `juejin.cn` (掘金) | Available fetch or browser tool when raw HTML contains only the application shell |
| `segmentfault.com` (思否) | Available fetch or browser tool if HTTP access or local extraction fails |
| `weibo.com` (微博) | Available fetch or browser tool for rendered status text |
| `xiaohongshu.com` (小红书) | Available fetch or browser tool; check for authentication or access challenges |
| `y.qq.com` (QQ 音乐) | Available fetch or browser tool; verify song-specific content instead of the homepage shell |
| `music.163.com` (网易云音乐) | Local HTML can expose title and artist. Use an available authorized reader for additional requested content |
| `wallstreetcn.com` (华尔街见闻) | Plain defuddle works; inspect `_articleBody_…` elements if extraction drops the article body |
| `www.v2ex.com` (V2EX) | `curl -fsSL --connect-timeout 10 --max-time 30 'https://www.v2ex.com/api/topics/show.json?id=<id>' \| jq` — returns topic + full content; `api/replies/show.json?topic_id=<id>` for replies |
| `gitee.com` | **Known file path**: `curl -fsSL --connect-timeout 10 --max-time 30 'https://gitee.com/<owner>/<repo>/raw/<ref>/<path>'`. **Repo metadata**: `curl -fsSL --connect-timeout 10 --max-time 30 'https://gitee.com/api/v5/repos/<owner>/<repo>' \| jq`. Shape mirrors GitHub |
| `reddit.com` | Available fetch or browser tool; check for access challenges and omitted comments |
| `stackoverflow.com` / `*.stackexchange.com` / `superuser.com` / `serverfault.com` / `askubuntu.com` | Stack Exchange API — see [Stack Exchange](references/stackexchange.md) |
| `*.fandom.com` | Available fetch or browser tool if local HTML contains an access challenge |
| Any other MediaWiki site — Wikipedia, Arch Wiki, cppreference, `*.wiki.gg`, etc. | Wikimedia-run wikis use the REST API + `prop=extracts`; third-party wikis use `?action=raw` or `api.php?action=parse` (some need defuddle due to heavy templates) — see [MediaWiki](references/mediawiki.md) |
| `www.rfc-editor.org` / any RFC | `curl -fsSL --connect-timeout 10 --max-time 30 'https://www.rfc-editor.org/rfc/rfc<N>.txt'` — canonical plaintext, no chrome. `.html` and `.json` also available (the JSON has metadata like obsoleted-by, authors, status) |
| `peps.python.org` | Individual PEP: `curl -fsSL --connect-timeout 10 --max-time 30 'https://peps.python.org/pep-<N>/'` (clean HTML). All PEPs indexed: `curl -fsSL --connect-timeout 10 --max-time 30 'https://peps.python.org/api/peps.json' \| jq` — number, title, status, authors, created date |
| `docs.claude.com` / `docs.anthropic.com` (Anthropic & Claude Code docs) | Append `.md` to the URL. Indexes: `platform.claude.com/llms.txt` (+ `llms-full.txt`) for API/SDK pages; `code.claude.com/llms.txt` for Claude Code |
| `news.ycombinator.com` | `curl -fsSL --connect-timeout 10 --max-time 30 'https://hn.algolia.com/api/v1/items/<id>' \| jq` — returns story + full comment tree as nested JSON |
| `pypi.org` | `curl -fsSL --connect-timeout 10 --max-time 30 'https://pypi.org/pypi/<package>/json' \| jq -r '.info.description'` for README; `.info.summary` / `.info.version` for metadata |
| `npmjs.com` / `registry.npmjs.org` | `curl -fsSL --connect-timeout 10 --max-time 30 'https://registry.npmjs.org/<package>' \| jq` for metadata and any included README |
| `lobste.rs` | append `.json` to the story URL (e.g. `lobste.rs/s/<id>.json`), fetch with `curl` |
| `dev.to` | `curl -fsSL --connect-timeout 10 --max-time 30 'https://dev.to/api/articles/<id>' \| jq -r '.title, .body_markdown'` — `<id>` is the numeric article ID |
| `*.substack.com` | `<subdomain>.substack.com/feed` — RSS with full post HTML in `<content:encoded>` |
| `medium.com` / `*.medium.com` | `https://medium.com/feed/@<user>` may contain recent posts. Check full-text coverage; otherwise use an available fetch or browser tool |
| `bsky.app` | `curl -fsSL --connect-timeout 10 --max-time 30 'https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=<at-uri>' \| jq` — no auth needed for public posts; convert `bsky.app/profile/<handle>/post/<rkey>` to `at://<handle>/app.bsky.feed.post/<rkey>` |
| `gitlab.com` | **Known file path** (preferred): `curl -fsSL --connect-timeout 10 --max-time 30 https://gitlab.com/<owner>/<repo>/-/raw/<ref>/<path>`. **Repo metadata / MR / issue bodies**: `curl -fsSL --connect-timeout 10 --max-time 30 'https://gitlab.com/api/v4/projects/<owner>%2F<repo>' \| jq` (URL-encode the slash in the project path) |
| `codeberg.org` / any Gitea or Forgejo instance | **Known file path**: `curl -fsSL --connect-timeout 10 --max-time 30 https://codeberg.org/<owner>/<repo>/raw/branch/<ref>/<path>`. **Metadata**: `curl -fsSL --connect-timeout 10 --max-time 30 'https://codeberg.org/api/v1/repos/<owner>/<repo>' \| jq` |
| `crates.io` | `curl -fsSL --connect-timeout 10 --max-time 30 'https://crates.io/api/v1/crates/<crate>' \| jq` for metadata; `.../<version>/readme` for README |
| `formulae.brew.sh` / any `brew` formula | `curl -fsSL --connect-timeout 10 --max-time 30 'https://formulae.brew.sh/api/formula/<name>.json' \| jq` — name, desc, versions, deps, caveats |
| `aur.archlinux.org` | `curl -fsSL --connect-timeout 10 --max-time 30 'https://aur.archlinux.org/rpc/v5/info/<pkg>' \| jq -r '.results[0]'` — Name, Version, Description, Maintainer, Depends, URL |
| `doi.org` / any bare DOI | `curl -fsSL --connect-timeout 10 --max-time 30 'https://api.crossref.org/works/<doi>' \| jq -r '.message \| .title[0], (.author[].family \| tostring)'` — reliable for title + authors + citation metadata (abstract hit-or-miss). For full text, try `curl -fsSL --connect-timeout 10 --max-time 30 'https://r.jina.ai/<url>'` or the publisher page |
| Any Discourse forum (`discuss.python.org`, `meta.discourse.org`, `forum.rust-lang.org`, `discuss.pytorch.org`, etc.) | Append `.json` to the topic URL: `curl -fsSL --connect-timeout 10 --max-time 30 '<forum>/t/<slug>/<id>.json' \| jq` — returns topic data; compare `post_stream.posts` with the complete post ID stream before claiming all posts were read |
| `huggingface.co` | README via `<repo>/raw/main/README.md`; metadata via `/api/models`, `/api/datasets`, `/api/papers` — see [Hugging Face](references/huggingface.md) |
| `web.archive.org` / any Wayback lookup | **Find closest snapshot**: `curl -fsSL --connect-timeout 10 --max-time 30 'https://archive.org/wayback/available?url=<url>&timestamp=<YYYYMMDD>' \| jq`. **Fetch raw archived response**: `curl -fsSL --connect-timeout 10 --max-time 30 'https://web.archive.org/web/<timestamp>id_/<url>'` — the `id_` suffix strips Wayback's toolbar injection and returns the original response body |
| `store.steampowered.com` | `curl -fsSL --connect-timeout 10 --max-time 30 'https://store.steampowered.com/api/appdetails?appids=<appid>&cc=us&l=en' \| jq -r '.["<appid>"].data'` — name, short_description, release_date, developers, categories, price |
| `speedrun.com` | `curl -fsSL --connect-timeout 10 --max-time 30 'https://www.speedrun.com/api/v1/games/<slug>' \| jq` — game metadata; further endpoints at `/games/<id>/categories`, `/runs?game=<id>` for leaderboards |
| Any WordPress site (self-hosted or `*.wordpress.com`) | `curl -fsSL --connect-timeout 10 --max-time 30 '<site>/wp-json/wp/v2/posts?per_page=10' \| jq` for recent posts; `/wp-json/wp/v2/posts/<id>` for a single post (`.content.rendered` has the HTML body). Works on any WP install with the REST API enabled — still the default |
| `openlibrary.org` | `curl -fsSL --connect-timeout 10 --max-time 30 'https://openlibrary.org/works/OL<id>W.json' \| jq` for works; `/isbn/<isbn>.json` for ISBN lookup; `/authors/OL<id>A.json` for authors. Note: `.description` is sometimes a string, sometimes `{type, value}` — handle both |
| `gutenberg.org` (Project Gutenberg) | `curl -fsSL --connect-timeout 10 --max-time 30 'https://www.gutenberg.org/cache/epub/<id>/pg<id>.txt'` — full plaintext of out-of-copyright books |

## Bulk discovery

For whole-site ingestion, probe `<site>/llms.txt` (URL index) and `/llms-full.txt` (full corpus). Convention adopted by Mintlify, Cloudflare, Stripe, Next.js, and others.

## Completion

Compare extracted content with the request: title, requested sections, code blocks, tables, and relevant replies or pages. Follow pagination when the answer requires complete coverage. Extraction can omit information even when the command succeeds.

Return the source URL and the requested findings or text. Mark missing sections and access failures explicitly. For a search without a URL, use an available search tool first.
