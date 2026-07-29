#!/usr/bin/env node

import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = resolve(import.meta.dirname, "..");
const CLI = join(ROOT, "scripts", "agent-os.mjs");

function execute(command, args, cwd, allowFailure = false) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8" });
  if (result.error) throw result.error;
  if (!allowFailure && result.status !== 0) throw new Error(result.stderr || result.stdout);
  return result;
}

function output(command, args, cwd) {
  return execute(command, args, cwd).stdout;
}

const sandbox = await mkdtemp(join(tmpdir(), "agent-os-handbook-test-"));
const project = join(sandbox, "project");
await mkdir(project, { recursive: true });
output("git", ["init", "-q"], project);
output("git", ["config", "user.email", "test@example.com"], project);
output("git", ["config", "user.name", "Agent OS Test"], project);
await writeFile(join(project, "README.md"), "existing README\n");
await mkdir(join(project, "docs"), { recursive: true });
await writeFile(join(project, "docs", "architecture.md"), "existing architecture\n");

const beforeCheck = output("git", ["status", "--porcelain=v1", "--untracked-files=all"], project);
const check = JSON.parse(output("node", [CLI, "init-handbook", "--target", project, "--check-only", "--json"], ROOT));
assert.equal(check.ok, true);
assert.equal(check.command, "init-handbook");
assert.equal(check.checkOnly, true);
assert.equal(await stat(join(project, "docs", "INDEX.md")).then(() => true).catch(() => false), false);
assert.equal(output("git", ["status", "--porcelain=v1", "--untracked-files=all"], project), beforeCheck);

const result = JSON.parse(output("node", [CLI, "init-handbook", "--target", project, "--json"], ROOT));
assert.equal(result.ok, true);
assert.equal(result.checkOnly, false);
assert.ok(result.files.some((file) => file.path === "README.md" && file.action === "skip"));
assert.ok(result.files.some((file) => file.path === "docs/architecture.md" && file.action === "alias"));
assert.ok(result.files.some((file) => file.path === "docs/INDEX.md" && file.action === "create"));
assert.equal(await readFile(join(project, "README.md"), "utf8"), "existing README\n");
assert.equal(await readFile(join(project, "docs", "architecture.md"), "utf8"), "existing architecture\n");
assert.match(await readFile(join(project, "docs", "INDEX.md"), "utf8"), /\[Architecture\]\(architecture\.md\)/);
assert.equal(await stat(join(project, "docs", "ARCHITECTURE.md")).then(() => true).catch(() => false), false);

const handbookContract = await readFile(join(ROOT, "plugins", "agent-os", "skills", "project-handbook", "references", "handbook-contract.md"), "utf8");
const index = await readFile(join(project, "docs", "INDEX.md"), "utf8");
const requirements = await readFile(join(project, "docs", "REQUIREMENTS.md"), "utf8");
const interfaces = await readFile(join(project, "docs", "INTERFACES.md"), "utf8");
const now = await readFile(join(project, "docs", "NOW.md"), "utf8");
const collaborationRules = await readFile(join(project, "AGENTS.md"), "utf8");
const decisionsGuide = await readFile(join(project, "docs", "decisions", "README.md"), "utf8");
const implementationLifecycle = await readFile(join(ROOT, "plugins", "agent-os", "skills", "execute-linear-issue", "references", "implementation-lifecycle.md"), "utf8");
const engineeringQuality = await readFile(join(ROOT, "plugins", "agent-os", "skills", "execute-linear-issue", "references", "engineering-quality.md"), "utf8");

assert.match(handbookContract, /normative intent/i);
assert.match(handbookContract, /boundary contract/i);
assert.match(handbookContract, /implementation evidence/i);
assert.match(handbookContract, /specification defect/i);
assert.match(handbookContract, /implementation defect/i);
assert.match(handbookContract, /verification defect/i);
assert.match(handbookContract, /unrecorded intent change/i);
assert.match(index, /normative intent/i);
assert.match(index, /implementation evidence/i);
assert.match(requirements, /falsifiable verification/i);
assert.match(requirements, /interface or boundary/i);
assert.match(interfaces, /stable interface identifier/i);
assert.match(now, /documentation baseline status/i);
assert.match(implementationLifecycle, /normative inputs/i);
assert.match(implementationLifecycle, /implementation outputs/i);
assert.match(implementationLifecycle, /verification evidence/i);
assert.match(handbookContract, /first commit unique\s+to\s+the issue branch/i);
assert.match(handbookContract, /before (?:that durable checkpoint|executable implementation)/i);
assert.match(handbookContract, /record.*baseline commit.*issue/is);
assert.match(handbookContract, /Red-Green-Refactor.*does not apply/is);
assert.match(handbookContract, /update.*normative document.*before.*implementation/is);
assert.match(handbookContract, /issue approval authorizes/i);
assert.match(handbookContract, /semantically equivalent/i);
assert.match(handbookContract, /without a second full-document review/i);
assert.match(handbookContract, /material semantic delta/i);
assert.match(handbookContract, /one concrete question/i);
assert.match(handbookContract, /update.*issue.*normative document/is);
assert.match(handbookContract, /persist.*automatically.*without.*full-document review/is);
assert.match(handbookContract, /must not be deferred to.*Red-Green-Refactor/is);
assert.doesNotMatch(handbookContract, /present the complete documentation baseline for user review/i);
assert.match(collaborationRules, /documentation(?:-only)? baseline/i);
assert.match(collaborationRules, /first commit unique to the issue branch/i);
assert.match(collaborationRules, /(?:no|do not request a) second full-document review/i);
assert.match(collaborationRules, /material semantic delta/i);
assert.match(decisionsGuide, /why.*decision/is);
assert.match(decisionsGuide, /alternatives/i);
assert.match(decisionsGuide, /consequences/i);
assert.match(decisionsGuide, /architecture.*current/is);
assert.match(implementationLifecycle, /Documentation baseline/i);
assert.match(implementationLifecycle, /first commit unique to the issue branch/i);
assert.match(implementationLifecycle, /before.*Red/is);
assert.match(implementationLifecycle, /issue approval authorizes/i);
assert.match(implementationLifecycle, /one focused question/i);
assert.doesNotMatch(implementationLifecycle, /present the complete baseline for user review/i);
assert.match(engineeringQuality, /documentation-only baseline/i);
assert.match(engineeringQuality, /Red-Green-Refactor.*does not apply/is);
assert.match(engineeringQuality, /deterministic.*document/is);

const expectedFiles = [
  "AGENTS.md",
  "README.md",
  "docs/INDEX.md",
  "docs/INTERFACES.md",
  "docs/NOW.md",
  "docs/REQUIREMENTS.md",
  "docs/architecture.md",
  "docs/decisions/README.md",
  "docs/references/README.md",
  "docs/runbooks/README.md",
];
const actualFiles = [];
async function collect(directory, prefix = "") {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!prefix && entry.name === ".git") continue;
    const path = join(directory, entry.name);
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) await collect(path, relative);
    else actualFiles.push(relative);
  }
}
await collect(project);
assert.deepEqual(actualFiles.sort(), expectedFiles.sort());

const second = JSON.parse(output("node", [CLI, "init-handbook", "--target", project, "--json"], ROOT));
assert.ok(second.files.every((file) => ["skip", "alias"].includes(file.action)));

const unsafeProject = join(sandbox, "unsafe-project");
const outsideDocs = join(sandbox, "outside-docs");
await mkdir(unsafeProject, { recursive: true });
await mkdir(outsideDocs, { recursive: true });
output("git", ["init", "-q"], unsafeProject);
await symlink(outsideDocs, join(unsafeProject, "docs"), "dir");
const unsafe = execute("node", [CLI, "init-handbook", "--target", unsafeProject, "--json"], ROOT, true);
assert.notEqual(unsafe.status, 0);
assert.equal(await stat(join(unsafeProject, "README.md")).then(() => true).catch(() => false), false);
assert.deepEqual(await readdir(outsideDocs), [], "handbook initialization must not write through a parent symlink");

console.log("Project handbook tests passed.");
