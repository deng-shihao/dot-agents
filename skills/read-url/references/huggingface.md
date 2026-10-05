# HuggingFace

Apply the [fetch and pipeline checks](../SKILL.md#fallback-ladder) before using these recipes.

## Model / dataset README

For public repos, fetch the README directly as a file — same pattern as GitHub raw:

```bash
curl -fsSL --connect-timeout 10 --max-time 30 'https://huggingface.co/<org>/<name>/raw/main/README.md'
```

Works for both models and datasets (`huggingface.co/<org>/<name>` = model repo; `huggingface.co/datasets/<org>/<name>` = dataset repo — note the `/datasets/` segment for the dataset raw URL).

## Metadata

Clean JSON, no auth required for public content:

```bash
curl -fsSL --connect-timeout 10 --max-time 30 'https://huggingface.co/api/models/<id>'    | jq   # model card, tags, downloads, likes, pipeline_tag
curl -fsSL --connect-timeout 10 --max-time 30 'https://huggingface.co/api/datasets/<id>'  | jq   # dataset card, size, downloads
curl -fsSL --connect-timeout 10 --max-time 30 'https://huggingface.co/api/papers/<arxiv>' | jq   # paper title, authors, published models/datasets
```

The `papers` endpoint takes an arXiv ID (e.g. `2402.19173`) and returns HF's curated paper page — useful when a paper has an associated model or dataset on HF.

## Gated models

Some repositories require authentication. A denied request can return a message such as:

```
Access to model <id> is restricted. You must have access to it and be authenticated to access it. Please log in.
```

Use an already configured, authorized read client when available; inspect that client's help for its download command. Otherwise, try the public model page for the requested details. Preserve the requested model's identity: an alternative or mirror is a different source and must be labeled. Report the access gap if the requested content remains unavailable.
