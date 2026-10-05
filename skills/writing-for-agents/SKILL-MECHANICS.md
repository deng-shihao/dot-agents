# Skill mechanics

Use this reference when creating or editing a skill. [SKILL.md](SKILL.md) owns the general writing rules.

## Metadata and invocation

Keep a nonempty `name` and `description` in YAML frontmatter. Match the name to the directory. Write the description as a concise retrieval condition.

Invocation controls vary by host. Inspect the host's documented schema and current skill catalog before relying on metadata such as `disable-model-invocation` or `user-invocable`. A field in a file is not evidence that the host enforces it.

- **Automatic use:** describe the distinct tasks that benefit from the skill. Keep the body focused on what to do after selection.
- **Explicit use:** where supported, set `disable-model-invocation: true`. Also state the explicit trigger in the body when accidental invocation would change scope, such as a harsh review or forced response format.

Retain descriptions for portability and discovery. Do not assume that disabling automatic invocation hides a description or prevents reading a referenced file.

## Shared reference and routers

Several skills can link to one plain reference file. File retrieval is separate from automatic skill selection.

Create another skill when it has a distinct trigger that must be discoverable independently. Otherwise, keep the branch as linked reference inside its owner.

A router lists branches, their entry points, and the conditions for choosing them. Match routing to the host's actual capabilities. Read references directly; invoke another workflow only when its trigger and the user's scope support it.

## Scripts and validation

- Resolve scripts relative to the installed skill directory. Pass the target workspace explicitly so commands work from unrelated directories.
- Inspect runtime availability and existing dependency configuration before installing anything. Prefer the environment's supplied tools.
- Document required inputs, outputs, success conditions, and actionable failure behavior beside the command.
- A helper must distinguish empty results from failure. Test missing inputs and the failure that motivated the helper, alongside a successful case.
- Keep structural checks executable. The collection's [validator](scripts/validate.ts) checks metadata and relative Markdown file links; its [tests](scripts/validate.test.ts) cover valid and broken fixtures.

Before delivery, exercise changed commands and inspect their outputs. Verify every routing branch changed by the edit through a representative task or explicitly report it as untested.
