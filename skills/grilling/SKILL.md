---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking or asks to be grilled on it.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** contains decisions whose prerequisites are settled. Ask up to three high-impact questions from that frontier per round, with a recommendation for each. Wait for the answers before asking dependent questions.

Each question should be formatted like so:

```
**Q1: <question title>**: <question and concise choices>

Recommendation: <answer and reason>
```

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Find environment facts through available tools. Delegate independent searches when subagents are available; otherwise inspect directly. Treat pending research as an unsettled prerequisite and continue with independent decisions. Ask the user for preferences and constraints that evidence cannot settle.

The interview is complete when decisions needed for the requested scope are settled or explicitly deferred. Summarize those decisions, assumptions, and remaining risks. Continue implementation when already authorized; an interview alone does not authorize implementation.
