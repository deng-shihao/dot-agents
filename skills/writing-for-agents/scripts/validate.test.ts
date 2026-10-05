import { afterEach, expect, test } from "bun:test";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const script = join(import.meta.dir, "validate.ts");
const roots: string[] = [];

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "agent-skills-"));
  roots.push(root);
  mkdirSync(join(root, "skills"));
  return root;
}

function write(root: string, path: string, text: string) {
  const file = join(root, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
}

function skill(root: string, metadata = "name: example\ndescription: Example skill", body = "Do the work.") {
  write(root, "skills/example/SKILL.md", `---\n${metadata}\n---\n\n${body}\n`);
}

function run(root: string, path = script, explicitRoot = true) {
  const result = Bun.spawnSync([process.execPath, path, ...(explicitRoot ? [root] : [])], { cwd: tmpdir() });
  return { code: result.exitCode, output: result.stdout.toString() + result.stderr.toString() };
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

test("accepts folded and quoted YAML with additional metadata", () => {
  const root = fixture();
  skill(root, 'name: "example"\ndescription: >-\n  Example: a folded\n  description.\ndisable-model-invocation: true\nmetadata:\n  owner: personal');
  const result = run(root);
  expect(result.code).toBe(0);
  expect(result.output).toMatch(/PASS.*1 skill/i);
});

test.each([
  ["missing description", "name: example", /description.*nonempty string/i],
  ["missing name", "description: Example", /name.*nonempty string/i],
  ["non-string description", "name: example\ndescription: false", /description.*nonempty string/i],
  ["directory mismatch", "name: other\ndescription: Example", /name.*directory.*example/i],
  ["non-boolean invocation flag", "name: example\ndescription: Example\ndisable-model-invocation: yes", /disable-model-invocation.*boolean/i],
  ["malformed YAML", "name: example\ndescription: [broken", /invalid YAML/i],
  ["long description", `name: example\ndescription: ${"x".repeat(1025)}`, /description.*1024/i],
  ["uppercase name", "name: Example\ndescription: Example", /name.*lowercase/i],
  ["long name", `name: ${"x".repeat(65)}\ndescription: Example`, /name.*64/i],
])("rejects %s", (_label, metadata, diagnostic) => {
  const root = fixture();
  skill(root, metadata);
  const result = run(root);
  expect(result.code).toBe(1);
  expect(result.output).toMatch(/skills\/example\/SKILL\.md:\d+:/);
  expect(result.output).toMatch(diagnostic);
});

test("requires frontmatter and a nonempty body", () => {
  const root = fixture();
  skill(root, undefined, "");
  expect(run(root).output).toMatch(/body.*nonempty/i);
  write(root, "skills/example/SKILL.md", "# Example\n");
  const result = run(root);
  expect(result.code).toBe(1);
  expect(result.output).toMatch(/frontmatter/i);
});

test("checks local links in skill references and AGENTS.md", () => {
  const root = fixture();
  skill(root, undefined, "[Reference](references/details.md)");
  write(root, "skills/example/references/details.md", "# Details\n[Missing](missing.md)\n");
  write(root, "AGENTS.md", "[Missing guide](guide.md)\n");
  const result = run(root);
  expect(result.code).toBe(1);
  expect(result.output).toMatch(/references\/details\.md:2:.*missing\.md/);
  expect(result.output).toMatch(/AGENTS\.md:1:.*guide\.md/);
});

test("accepts sibling links, escaped spaces, angle destinations, and reference definitions", () => {
  const root = fixture();
  skill(root, undefined, "[Sibling](../shared/notes.md#details)\n[Space](some%20notes.md)\n[Angle](<some notes.md>)\n[notes]: ../shared/notes.md \"Title\"");
  write(root, "skills/shared/SKILL.md", "---\nname: shared\ndescription: Shared notes\n---\nRead notes.\n");
  write(root, "skills/shared/notes.md", "# Details\n");
  write(root, "skills/example/some notes.md", "# Notes\n");
  expect(run(root).code).toBe(0);
});

test("ignores fenced examples, URLs, anchors, absolute paths, and dynamic destinations", () => {
  const root = fixture();
  skill(root, undefined, [
    "```md", "[Example](absent.md)", "```", "~~~markdown", "[Example](also-absent.md)", "~~~",
    "[Web](https://example.invalid/missing)", "[Anchor](#missing)", "[Absolute](/some/user/file.md)",
    "[Variable](${ROOT}/notes.md)", "[Placeholder](references/{topic}.md)", "[Template](references/<topic>.md)",
  ].join("\n"));
  expect(run(root).code).toBe(0);
});

test("ignores hidden provider bundles and hidden nested documents", () => {
  const root = fixture();
  skill(root);
  write(root, "skills/.system/broken/SKILL.md", "invalid");
  write(root, "skills/.provider/SKILL.md", "invalid");
  write(root, "skills/example/.cache/notes.md", "[Missing](absent.md)");
  expect(run(root).code).toBe(0);
});

test("reports a missing skills root and missing SKILL.md", () => {
  const root = fixture();
  mkdirSync(join(root, "skills/example"));
  expect(run(root).output).toMatch(/SKILL\.md:1:.*missing/i);
  rmSync(join(root, "skills"), { recursive: true });
  const result = run(root);
  expect(result.code).toBe(1);
  expect(result.output).toMatch(/skills:1:.*missing/i);
});

test("resolves the default repository from the script when cwd is unrelated", () => {
  const root = fixture();
  skill(root);
  const copiedScript = join(root, "skills/writing-for-agents/scripts/validate.ts");
  write(root, "skills/writing-for-agents/SKILL.md", "---\nname: writing-for-agents\ndescription: Write instructions\n---\nWrite.\n");
  mkdirSync(dirname(copiedScript), { recursive: true });
  copyFileSync(script, copiedScript);
  const result = run(root, copiedScript, false);
  expect(result.code).toBe(0);
  expect(result.output).toMatch(/PASS.*2 skills/i);
});
