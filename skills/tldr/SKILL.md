---
name: tldr
description: Append a one-line TLDR summary to the prior response. User-invoked via /tldr only.
disable-model-invocation: true
user-invocable: true
---

Use only when the user requests `/tldr` or explicitly invokes this skill. Append one line summarizing the prior response's verdict.

Format strictly:
  TLDR: <verdict in at most 20 words>

Rules:
  - Write the verdict in the same language as your previous response.
  - Lead with the key verdict / answer / decision — not a recap of topics.
  - One sentence, hard cap 20 words.
  - Preserve any qualification essential to the verdict. Add no new information or bullet list.
  - Output ONLY that single summary line. Nothing else.
