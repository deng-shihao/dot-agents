# MediaWiki

Apply the [fetch and pipeline checks](../SKILL.md#fallback-ladder) before using these recipes.

Any site running MediaWiki — Wikipedia, Fandom, Arch Wiki, cppreference, game wikis, and many docs sites. The API shape depends on whether the install is run by Wikimedia Foundation (gets extra endpoints) or third-party (vanilla MediaWiki).

## Wikimedia-run (Wikipedia / Wiktionary / Wikiquote / Wikibooks / etc.)

Has the REST API + the TextExtracts extension — gives the cleanest output:

```bash
# Short summary
curl -fsSL --connect-timeout 10 --max-time 30 'https://<lang>.wikipedia.org/api/rest_v1/page/summary/<title>' | jq

# Clean rendered HTML (no chrome)
curl -fsSL --connect-timeout 10 --max-time 30 'https://<lang>.wikipedia.org/api/rest_v1/page/html/<title>'

# Full plaintext extract via TextExtracts
curl -fsSL --connect-timeout 10 --max-time 30 'https://<lang>.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=<title>&format=json' | jq -r '.query.pages | to_entries[0].value.extract'
```

## Third-party MediaWiki installs

Extensions and REST routes vary by installation. Try these routes in order, checking returned content:

1. **Try `?action=raw` appended to the article URL** — works on many installs (Arch Wiki, cppreference, OSRS wiki, UESP, `*.wiki.gg`):

   ```bash
   curl -fsSL --connect-timeout 10 --max-time 30 'https://en.cppreference.com/w/cpp/container/vector?action=raw'
   curl -fsSL --connect-timeout 10 --max-time 30 'https://wiki.archlinux.org/index.php?title=Systemd&action=raw'
   ```

2. **If empty, use `api.php?action=parse`** — some installs (notably `minecraft.wiki`) return 200-empty on `?action=raw`:

   ```bash
   curl -fsSL --connect-timeout 10 --max-time 30 '<wiki>/api.php?action=parse&page=<Page>&prop=wikitext&format=json' | jq -r '.parse.wikitext."*"'
   ```

   Swap `prop=wikitext` for `prop=text` to get rendered HTML instead.

3. **If the wikitext is template-heavy** (cppreference especially — `{{dcl}}`, `{{cpp/title}}`, etc. without template expansion look cryptic), fall back to `defuddle` on the rendered page. The rendered HTML has templates expanded:

   ```bash
   bun x defuddle parse 'https://en.cppreference.com/w/cpp/container/vector' --markdown
   ```

## Notable wikis

Covered by this reference — the URL/API patterns are all the same, just vary in which step (1 / 2 / 3) works best:

- **Fandom: `*.fandom.com`**: if local fetching returns an access challenge, try an available fetch or browser tool.
- Game wikis on `*.wiki.gg` (Terraria, Minecraft Legacy, many others migrated off Fandom) — step 1
- Minecraft Wiki: `minecraft.wiki` — step 2 (api.php) needed
- Pokémon: `bulbapedia.bulbagarden.net` — step 1
- Elder Scrolls: `en.uesp.net` — step 1
- OSRS: `oldschool.runescape.wiki` — step 1
- C++: `en.cppreference.com` — step 3 (defuddle) preferred due to templates
- Wikitech: `wikitech.wikimedia.org` — step 1 (vanilla MediaWiki despite the .wikimedia.org domain)

## Completion

An unavailable extension or REST route does not establish that the article is missing. Try the applicable raw or parse route and verify that templates expanded into the requested text. Report missing content when every applicable route fails.
