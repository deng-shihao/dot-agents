import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? join(import.meta.dir, "../../.."));
const skillsRoot = join(root, "skills");
const issues: string[] = [];
let skillCount = 0;
let documentCount = 0;

function issue(file: string, line: number, message: string) {
  issues.push(`${file}:${line}: ${message}`);
}

function checkSkill(file: string) {
  if (!existsSync(file)) {
    issue(file, 1, "Missing SKILL.md for this skill directory.");
    return;
  }
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (lines[0]?.trim() !== "---" || end < 0) {
    issue(file, 1, "Frontmatter must start and end with --- lines.");
    return;
  }
  let metadata: unknown;
  try {
    metadata = Bun.YAML.parse(lines.slice(1, end).join("\n"));
  } catch (error) {
    issue(file, 2, `Invalid YAML: ${error instanceof Error ? error.message : error}`);
    return;
  }
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    issue(file, 2, "Frontmatter must be a YAML mapping.");
    return;
  }
  const fields = metadata as Record<string, unknown>;
  const fieldLine = (key: string) => {
    const index = lines.slice(1, end).findIndex((line) => new RegExp(`^["']?${key}["']?\\s*:`).test(line));
    return index < 0 ? 2 : index + 2;
  };
  for (const key of ["name", "description"]) {
    if (typeof fields[key] !== "string" || !(fields[key] as string).trim()) {
      issue(file, fieldLine(key), `${key} must be a nonempty string.`);
    }
  }
  if (typeof fields.name === "string" && fields.name.trim()) {
    if (fields.name.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.name)) {
      issue(file, fieldLine("name"), "name must use lowercase letters, digits, and single hyphens, with at most 64 characters.");
    }
    if (fields.name !== basename(dirname(file))) {
      issue(file, fieldLine("name"), `name must match directory ${basename(dirname(file))}.`);
    }
  }
  if (typeof fields.description === "string" && fields.description.length > 1024) {
    issue(file, fieldLine("description"), "description must contain at most 1024 characters.");
  }
  if ("disable-model-invocation" in fields && typeof fields["disable-model-invocation"] !== "boolean") {
    issue(file, fieldLine("disable-model-invocation"), "disable-model-invocation must be a boolean.");
  }
  if (!lines.slice(end + 1).join("\n").trim()) {
    issue(file, end + 2, "Skill body must be nonempty.");
  }
}

function checkLink(file: string, line: number, destination: string) {
  let target = destination.startsWith("<") ? destination.slice(1, -1) : destination;
  // Runtime paths and template placeholders cannot be resolved from this repository.
  if (/^(?:[a-z][a-z0-9+.-]*:|[/#~])|[$*{}<>]/i.test(target)) return;
  target = target.split(/[?#]/, 1)[0];
  try {
    target = decodeURIComponent(target);
  } catch {
    issue(file, line, `Invalid URL encoding in local link: ${destination}`);
    return;
  }
  if (target && !existsSync(resolve(dirname(file), target))) {
    issue(file, line, `Missing local link target: ${target}`);
  }
}

function checkLinks(file: string) {
  documentCount++;
  let fence = "";
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) fence = "";
      continue;
    }
    if (fence) continue;
    // Handle explicit inline links and reference definitions, not arbitrary prose paths.
    const text = line.replace(/(`+).*?\1/g, "");
    for (const link of text.matchAll(/\[[^\]]*\]\(\s*(<[^>]*>|[^\s)]+)(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g)) {
      checkLink(file, index + 1, link[1]);
    }
    const reference = text.match(/^ {0,3}\[[^\]]+\]:\s*(<[^>]*>|\S+)/);
    if (reference) checkLink(file, index + 1, reference[1]);
  }
}

function checkDocuments(directory: string) {
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith(".")) continue;
    const file = join(directory, entry.name);
    if (entry.isDirectory()) checkDocuments(file);
    else if (entry.isFile() && entry.name.endsWith(".md")) checkLinks(file);
  }
}

if (!existsSync(skillsRoot) || !statSync(skillsRoot).isDirectory()) {
  issue(skillsRoot, 1, "Missing skills directory. Pass the repository root as the first argument.");
} else {
  for (const entry of readdirSync(skillsRoot, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith(".") || !entry.isDirectory()) continue;
    skillCount++;
    const directory = join(skillsRoot, entry.name);
    checkSkill(join(directory, "SKILL.md"));
    checkDocuments(directory);
  }
  const agents = join(root, "AGENTS.md");
  if (existsSync(agents)) checkLinks(agents);
}

if (issues.length) {
  console.error(issues.join("\n"));
  console.error(`FAIL: ${issues.length} issue(s) in ${skillCount} skills and ${documentCount} Markdown documents.`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${skillCount} skills and ${documentCount} Markdown documents validated.`);
}
