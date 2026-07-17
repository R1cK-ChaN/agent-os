#!/usr/bin/env node

import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = resolve(import.meta.dirname, "..");
const CLI = join(ROOT, "scripts", "agent-os.mjs");

function run(command, args, cwd, env = process.env) {
  const result = spawnSync(command, args, { cwd, env, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  return result.stdout;
}

const sandbox = await mkdtemp(join(tmpdir(), "agent-os-bootstrap-test-"));
const project = join(sandbox, "project");
const home = join(sandbox, "home");
const runtime = join(sandbox, "runtime");
const skillsHome = join(home, ".agents", "skills");
await mkdir(project, { recursive: true });
await mkdir(home, { recursive: true });
run("git", ["init", "-q"], project);
run("git", ["config", "user.email", "test@example.com"], project);
run("git", ["config", "user.name", "Agent OS Test"], project);
await writeFile(join(project, "README.md"), "fixture\n");
run("git", ["add", "README.md"], project);
run("git", ["commit", "-qm", "fixture"], project);
await writeFile(join(project, "dirty.txt"), "preserve me\n");

const before = run("git", ["status", "--porcelain=v2", "--untracked-files=all"], project);
const output = run("node", [CLI, "bootstrap", "--target", project, "--agent-os-home", runtime, "--skills-home", skillsHome, "--issue", "TEST-1", "--json"], ROOT, { ...process.env, HOME: home });
const result = JSON.parse(output);
const after = run("git", ["status", "--porcelain=v2", "--untracked-files=all"], project);

assert.equal(result.ok, true);
assert.equal(result.handoff.projectMutationCheck.passed, true);
assert.equal(result.handoff.task.linearIssue, "TEST-1");
assert.equal(before, after, "bootstrap must preserve the exact dirty worktree state");
assert.ok(result.handoffPath.startsWith(runtime));
assert.ok((await readFile(result.handoffPath, "utf8")).includes('"prepare-development-workspace"'));

const installation = JSON.parse(await readFile(join(runtime, "installation.json"), "utf8"));
assert.ok(installation.managedSkills.length >= 1);
for (const skill of installation.managedSkills) {
  assert.ok(skill.destination.startsWith(skillsHome));
  assert.ok(!skill.destination.startsWith(project));
}

const status = JSON.parse(run("node", [CLI, "status", "--agent-os-home", runtime, "--skills-home", skillsHome, "--json"], ROOT, { ...process.env, HOME: home }));
assert.equal(status.ok, true);

const removed = JSON.parse(run("node", [CLI, "uninstall", "--agent-os-home", runtime, "--skills-home", skillsHome, "--json"], ROOT, { ...process.env, HOME: home }));
assert.equal(removed.ok, true);
assert.equal(removed.removed.length, installation.managedSkills.length);

console.log("Bootstrap tests passed.");
