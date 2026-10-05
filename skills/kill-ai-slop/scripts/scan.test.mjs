import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const scanner = fileURLToPath(new URL("./scan.mjs", import.meta.url));

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "kill-ai-slop-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}

function scan(root, cwd = tmpdir()) {
  return spawnSync(process.execPath, [scanner, root, "--json"], {
    cwd,
    encoding: "utf8",
  });
}

test("scans source from another working directory and excludes generated files", (t) => {
  const root = fixture(t);
  writeFileSync(join(root, "hero.tsx"), '<h1 className="bg-clip-text text-transparent">Hello</h1>');
  mkdirSync(join(root, "node_modules"));
  writeFileSync(join(root, "node_modules", "vendor.tsx"), '<span className="font-serif">Vendor</span>');

  const result = scan(root);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.filesScanned, 1);
  assert.ok(report.findings.some((finding) => finding.id === "02" && finding.hits.some((hit) => hit.file === "hero.tsx" && hit.line === 1)));
  assert.ok(report.findings.every((finding) => finding.hits.every((hit) => !hit.file.includes("node_modules"))));
});

test("missing roots fail without reporting a successful empty scan", (t) => {
  const result = scan(join(fixture(t), "missing"));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /ENOENT/);
  assert.equal(result.stdout, "");
});

test("file roots fail because the scanner requires a directory", (t) => {
  const path = join(fixture(t), "source.ts");
  writeFileSync(path, "export const value = 1;");
  const result = scan(path);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /ENOTDIR/);
  assert.equal(result.stdout, "");
});

test("unreadable source fails instead of hiding incomplete coverage", {
  skip: process.platform === "win32" || process.getuid?.() === 0,
}, (t) => {
  const root = fixture(t);
  const path = join(root, "private.tsx");
  writeFileSync(path, '<span className="font-serif">Private</span>');
  chmodSync(path, 0);
  try {
    const result = scan(root);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /EACCES|EPERM/);
    assert.equal(result.stdout, "");
  } finally {
    chmodSync(path, 0o600);
  }
});
