---
name: handoff
description: Preserve task state for a fresh agent. Use for a requested handoff or when compacting a conversation.
argument-hint: "What will the next session be used for?"
---

Write a handoff that lets a fresh agent continue the current objective. If arguments specify the next session's focus, retain the objective and tailor the next actions to that focus.

## Preserve state

Use this order:

1. Architecture decisions, system invariants, and constraints, with their reasons intact.
2. Modified file paths and substantive changes. Separate user changes from agent changes when relevant.
3. Verification commands and observed results: pass, fail, skip, or unavailable. Condense passing suites; name unverified requirements.
4. Open TODOs, blockers, risks, rollback instructions, and the next concrete action. Include pending user decisions and existing authorization boundaries.
5. Exact failing commands and their first actionable errors.
6. Suggested skills, with verified paths and the condition for invoking each.

Reference existing artifacts by absolute path or URL instead of copying their contents. Include the working directory and relevant branch or worktree. Preserve enough context to explain why each artifact matters. Redact credentials and unnecessary personal information while retaining technical identifiers needed to continue.

## Save and verify

Create a unique directory using the host OS temporary-directory API, then save one Markdown file inside it. For example, Python's `tempfile.mkdtemp(prefix="agent-handoff-")` avoids collisions and uses the OS temporary location. Keep the handoff outside the workspace unless the user requests another destination.

Read the saved file back. Confirm that the objective, next action, modified paths, check results, and unresolved work are present. Verify local artifact pointers and remove stale suggested skills. Return the absolute handoff path; identify temporary storage so the user knows it is not a durable archive.
