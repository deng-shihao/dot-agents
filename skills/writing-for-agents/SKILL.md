---
name: writing-for-agents
description: Improve agent instructions and their harness. Use when creating or editing skills, AGENTS.md, CLAUDE.md, or reference documents agents consume.
---

Make the agent's process predictable through clear context, usable tools, and observable completion criteria. Improve the environment that produces the behavior.

## Workflow

1. **Inspect the harness.** Read the owning instructions and their callers. Inspect referenced files, scripts, configuration, and available tools. Identify a concrete failure or missing capability before adding a rule.
2. **Choose the owner.** Fix executable behavior in its tool or check. Keep discoverable facts in configuration. Put durable judgment and constraints in the narrowest instruction file that needs them.
3. **Edit the path.** Give each entry point a distinct trigger. Order steps by dependency and put branch-specific reference behind a conditional pointer. Preserve user constraints while removing duplicate meanings.
4. **Validate structure.** Check metadata, local pointers, script paths, and command behavior from the target workspace. For skills, read [SKILL-MECHANICS.md](SKILL-MECHANICS.md).
5. **Exercise behavior.** Use a representative task and a relevant failure case. Check routing, reachable tools, expected output, and the stopping condition. Report which checks ran and which behavior remains untested.

Done means each changed instruction has an owner, each required pointer resolves, and completion can be distinguished from failure. A shorter document or passing linter alone does not prove better agent behavior.

For this skill collection, run the bundled [validator](scripts/validate.ts) with Bun. It checks metadata and explicit relative Markdown file links without network access:

```sh
bun /absolute/path/to/writing-for-agents/scripts/validate.ts /absolute/path/to/agents-repo
bun test /absolute/path/to/writing-for-agents/scripts/validate.test.ts
```

Replace the paths with the resolved skill and repository directories. The validator checks structure; review prose, tool availability, and task outcomes separately.

## Context pointers

A **context pointer** names out-of-context material and the condition for reading it. A skill description and an `AGENTS.md` link serve the same purpose.

- Front-load the concept that should trigger retrieval.
- Name each distinct branch once. Collapse synonyms for the same branch.
- Say what the target supplies and when it is needed.
- Use explicit relative Markdown links for bundled files. Resolve them from the containing document, not the shell's working directory.

If required material is repeatedly missed, sharpen its pointer first. Inline it only when a clearer pointer still fails.

## Information hierarchy

Place material where it is needed:

1. **Steps:** ordered actions, prerequisites, and completion criteria on the current path.
2. **In-file reference:** definitions and rules shared by those steps.
3. **Disclosed reference:** branch-specific details reached through a conditional pointer.

Inline what every branch needs. Disclose what only some branches use. Keep a concept's definition, constraints, and caveats together.

Every split has a cost. Always-loaded descriptions and instructions spend **context load** on every turn. Material the human must remember spends **cognitive load**. Split when a distinct branch or invocation earns that cost, not to meet a line count.

## Completion criteria

Specify observable evidence: every changed model accounted for, each cited source read, a command's output checked, or the failing scenario passing.

**Clarity** distinguishes done from not done. **Demand** determines how much evidence is required. A criterion should cover the whole relevant scope without requiring unrelated work.

Later steps can tempt an agent to rush a fuzzy criterion. Sharpen the criterion first. If observed rushing persists, split the sequence across a real context boundary, such as a handoff or scoped subagent task. Moving text under another heading does not hide it.

## Leading words

Use established concepts as compact hooks: **red** for a test that demonstrably fails, **frontier** for decisions whose prerequisites are settled. Define specialized meanings once.

Repeat the hook where useful, not its full explanation. Prefer a familiar term over an invented label that needs more explanation than it saves.

State the desired action positively. Keep prohibitions for hard boundaries, paired with the allowed next step.

## Pruning and harness repairs

- **Single source:** keep each meaning in one authoritative place. Point callers there.
- **Environment:** derive commands, versions, paths, and capabilities from their owners. Cache only expensive lookups, with a refresh condition.
- **Relevance:** retain constraints and failure modes that affect this document's task. Remove stale instructions and unrelated branches.
- **No-ops:** remove a sentence when it adds no behavior beyond the active harness. Settle uncertain cases through task evidence, not stronger wording.
- **Feedback:** turn repeated mechanical failures into checks or tool fixes. Keep judgment in prose, where context matters.
- **Scope:** preserve useful domain expertise. Repair observed friction without adding new policies, artifacts, or approval gates unrelated to the request.
