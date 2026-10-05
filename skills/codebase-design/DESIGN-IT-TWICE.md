# Design It Twice

When the user wants to explore alternative interfaces for a chosen deepening candidate, use this parallel sub-agent pattern. Based on "Design It Twice" (Ousterhout) — your first idea is unlikely to be the best.

Uses the vocabulary in [SKILL.md](SKILL.md) — **module**, **interface**, **seam**, **adapter**, **leverage**.

## Process

### 1. Frame the problem space

Before spawning sub-agents, write a user-facing explanation of the problem space for the chosen candidate:

- The constraints any new interface would need to satisfy
- The dependencies it would rely on, and which category they fall into (see [DEEPENING.md](DEEPENING.md))
- A rough illustrative code sketch to ground the constraints — not a proposal, just a way to make the constraints concrete

Show this to the user, then immediately proceed to Step 2. The user reads and thinks while the sub-agents work in parallel.

### 2. Design candidates

Produce distinct candidate interfaces using the available subagent tool and capacity. Delegate independent candidates in parallel when possible. If capacity or the tool is unavailable, design the candidates sequentially. Each candidate must satisfy the same observed contracts and differ in ownership or interface shape, not merely naming.

Give each candidate a technical brief (file paths, coupling details, dependency category from [DEEPENING.md](DEEPENING.md), what sits behind the seam). Pass it to a subagent when delegating, or use it directly when working sequentially. Assign different design constraints:

- "Minimize the interface — aim for 1–3 entry points max. Maximise leverage per entry point."
- "Maximise flexibility for the observed use cases."
- "Optimise for the most common caller — make the default case trivial."
- When applicable: "Design around ports & adapters for cross-seam dependencies."

Include [SKILL.md](SKILL.md) vocabulary and the project's existing domain vocabulary in each brief. Read `CONTEXT.md` only when it exists; otherwise use names established in the code. Include relevant callers, file references, and behavioral constraints so each candidate is grounded in the same evidence.

Each candidate includes:

1. Interface (types, methods, params — plus invariants, ordering, error modes)
2. Usage example showing how callers use it
3. What the implementation hides behind the seam
4. Dependency strategy and adapters (see [DEEPENING.md](DEEPENING.md))
5. Trade-offs — where leverage is high, where it's thin

### 3. Present and compare

Present designs sequentially so the user can absorb each one, then compare them in prose. Contrast by **depth** (leverage at the interface), **locality** (where change concentrates), and **seam placement**.

After comparing, give your own recommendation: which design you think is strongest and why. If elements from different designs would combine well, propose a hybrid. Be opinionated — the user wants a strong read, not a menu.

Finish when each candidate accounts for the observed callers, preserved behavior, dependency strategy, and verification path. State unresolved assumptions and the concrete tradeoff behind the recommendation.
