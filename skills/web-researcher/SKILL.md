---
name: web-researcher
description: Deep web research synthesized into a chat answer. Use for a one-off investigation that needs source comparison without a saved report.
---

# Web research

Research in chat using the search, fetch, browser, and delegation tools actually available in the current session. Inspect their descriptions before choosing a route. Keep work read-only apart from temporary extraction files; deliver the answer in chat.

## Workflow

1. **Scope.** Identify the question, decision, subtopics, and relevant versions or dates. Use the supplied date context when assessing freshness. For a complex topic, identify distinct search angles before searching.
2. **Search.** Search primary sources first. Use both English and the user's language when each offers relevant evidence. Community discussions can reveal failure cases or useful leads; follow technical claims to the source that owns them.
3. **Read.** Open promising results and inspect the passages supporting the answer. Follow cited sources when they bear on a requested question. For library or tool behavior, inspect official documentation or source code for the relevant version.
4. **Recover.** If fetching is truncated or blocked, use [read-url](../read-url/SKILL.md) when its local extraction tools are available. Otherwise, use another available fetch or browser route. After distinct applicable routes fail, record the missing evidence and continue independent research.
5. **Validate.** A single authoritative source can establish its own API, specification, or announcement. Seek independent corroboration for contested or consequential claims. Explain material contradictions and separate inference from reported facts.
6. **Finish.** Each requested question has a sourced answer or an explicit unresolved status. Stop when further searches repeat existing evidence without resolving a remaining gap. Report any material gap and the failed approaches; do not imply exhaustive coverage.

Delegate independent reading when a supported agent tool saves time. Give each agent a bounded question and evidence requirements, then inspect its sources before relying on the result.

## Answer

Lead with the answer or recommendation. Organize supporting findings by the user's questions, with direct source links beside the claims they support. Include relevant dates, tradeoffs, contradictions, and limitations. Scale detail to the request; omit search logs unless failure history explains a gap.
