---
name: code-review
description: Strict maintainability review of abstractions, module ownership, branching complexity, and opportunities to delete unnecessary structure.
disable-model-invocation: true
---

# Strict code quality review

Use when the user requests a strict maintainability audit or explicitly invokes this skill. Review requests produce findings. Apply fixes only when the user requests implementation.

Look for structural changes that preserve behavior while deleting concepts, branches, or layers. Hold a high bar for maintainability, with evidence for each finding.

## Process

1. **Establish scope.** Inspect status and the requested files or diff. For a branch review, identify the base and compare from the merge base. Preserve unrelated work.
2. **Read the contracts.** Inspect surrounding code, callers, types, tests, and relevant design decisions. Locate the module that owns each changed behavior.
3. **Apply the standards below.** Evaluate every meaningful change. Trace suspected problems to a concrete caller, failure mode, or maintenance burden.
4. **Challenge the remedy.** Show how the proposed structure reduces complexity while preserving the contract. Check whether an existing abstraction already solves the problem.
5. **Report.** Rank actionable findings by impact. State the reviewed scope and any verification gaps. A clean review requires examination of the whole requested scope.

## Review standards

### Delete complexity

Prefer remedies that remove moving parts over rearrangements that spread the same complexity across more files. Look for redundant modes, repeated branches, identity wrappers, and unnecessary orchestration. Explain what disappears and why behavior remains intact.

### Keep ownership clear

Keep feature logic in its canonical module. Reuse existing utilities when their contracts fit. Flag implementation details leaking through interfaces, feature checks scattered across shared flows, and duplicate sources of truth.

### Make state and contracts explicit

Trace optional values, casts, flags, and fallback branches to their actual invariants. Flag shapes that permit impossible states or conceal required data. A clearer type or state model earns its place when it removes ambiguity or branching.

### Control branching growth

Inspect special cases in their surrounding flow. Prefer a direct default path or a coherent model when it removes repeated decisions. A state machine, dispatcher, helper, or policy object must simplify the actual problem; it is not a required remedy for every conditional.

### Preserve cohesive modules

Treat a changed file crossing 1,000 lines as a prompt to inspect cohesion and scan cost. Report its measured size and the concrete ownership problem. Size alone does not justify a blocker or automatic split. Propose decomposition only when responsibilities and callers support it.

### Keep mechanisms direct

Flag generic machinery that hides simple data assumptions, brittle compatibility paths, and thin abstractions that add indirection. Prefer explicit failure behavior and readable control flow.

### Inspect orchestration

Look for unnecessarily serialized independent work and related writes that can leave partial state. Recommend parallelism or atomic updates only after checking ordering, resource limits, cancellation, and failure semantics.

## Findings

For each finding, include:

- File and line, with the concrete pattern or triggering path.
- The correctness or maintenance impact and its supporting evidence.
- The smallest remedy that addresses the cause, with the contract to preserve.
- Verification that would distinguish the fix from a cosmetic rearrangement.

Prioritize structural regressions, demonstrated simplification opportunities, contract or ownership problems, then local legibility. Combine findings with one root cause. Omit cosmetic nits when stronger issues dominate.

Treat a defect as blocking when its impact and remedy are supported by the code. Mark speculative alternatives as design options, with the assumption they depend on. Passing tests do not excuse a demonstrated structural regression.

## Completion

Account for every meaningful change in scope. Report no findings when no actionable issue meets the evidence bar. State checks run, checks unavailable, and any code not inspected. If fixes were requested, run the affected behavior checks and inspect the final diff before reporting completion.
