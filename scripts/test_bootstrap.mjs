#!/usr/bin/env node

import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = resolve(import.meta.dirname, "..");
const CLI = join(ROOT, "scripts", "agent-os.mjs");

function execute(command, args, cwd, env = process.env, allowFailure = false) {
  const result = spawnSync(command, args, { cwd, env, encoding: "utf8" });
  if (result.error) throw result.error;
  if (!allowFailure && result.status !== 0) throw new Error(result.stderr || result.stdout);
  return result;
}

function output(command, args, cwd, env = process.env) {
  return execute(command, args, cwd, env).stdout;
}

const sandbox = await mkdtemp(join(tmpdir(), "agent-os-bootstrap-test-"));
const project = join(sandbox, "project");
const home = join(sandbox, "home");
const skillsHome = join(home, ".agents", "skills");
await mkdir(project, { recursive: true });
await mkdir(home, { recursive: true });
output("git", ["init", "-q"], project);
output("git", ["config", "user.email", "test@example.com"], project);
output("git", ["config", "user.name", "Agent OS Test"], project);
await writeFile(join(project, "README.md"), "fixture\n");
output("git", ["add", "README.md"], project);
output("git", ["commit", "-qm", "fixture"], project);
await writeFile(join(project, "dirty.txt"), "preserve me\n");

const snapshot = async () => ({
  head: output("git", ["rev-parse", "HEAD"], project),
  branch: output("git", ["symbolic-ref", "--short", "HEAD"], project),
  status: output("git", ["status", "--porcelain=v2", "--untracked-files=all"], project),
  config: await readFile(join(project, ".git", "config"), "utf8"),
});

const before = await snapshot();
const result = JSON.parse(output("node", [CLI, "bootstrap", "--target", project, "--skills-home", skillsHome, "--json"], ROOT, { ...process.env, HOME: home }));
const after = await snapshot();
assert.equal(result.ok, true);
assert.equal(result.projectMutationCheck.passed, true);
assert.equal(result.cleanup.passed, true);
assert.deepEqual(after, before, "bootstrap must preserve the exact dirty repository state");
assert.ok(result.skills.every((skill) => ["install", "skip", "update"].includes(skill.action)));

const second = JSON.parse(output("node", [CLI, "bootstrap", "--target", project, "--skills-home", skillsHome, "--json"], ROOT, { ...process.env, HOME: home }));
assert.ok(second.skills.every((skill) => skill.action === "skip"), "a repeated bootstrap must be idempotent");

const linkedSkills = join(sandbox, "linked-skills");
await symlink(join(project, ".git"), linkedSkills, "dir");
const escaped = execute("node", [CLI, "bootstrap", "--target", project, "--skills-home", linkedSkills], ROOT, { ...process.env, HOME: home }, true);
assert.notEqual(escaped.status, 0);
assert.match(escaped.stderr, /must resolve outside the target repository/);
assert.deepEqual(await snapshot(), before, "a rejected symlink escape must not change the repository");

const linkedWorktree = join(sandbox, "linked-worktree");
output("git", ["worktree", "add", "-qb", "linked-fixture", linkedWorktree], project);
const commonGitEntriesBefore = (await readdir(join(project, ".git"))).sort();
const linkedEscape = execute("node", [CLI, "bootstrap", "--target", linkedWorktree, "--skills-home", join(project, ".git")], ROOT, { ...process.env, HOME: home }, true);
assert.notEqual(linkedEscape.status, 0);
assert.match(linkedEscape.stderr, /must resolve outside the target repository/);
assert.deepEqual((await readdir(join(project, ".git"))).sort(), commonGitEntriesBefore, "a linked worktree must not write Skills into the shared Git directory");
assert.ok(!(await readdir(join(project, ".git"))).some((entry) => entry.startsWith("agent-os-")));

const externalHooks = join(sandbox, "external-hooks");
await mkdir(externalHooks, { recursive: true });
output("git", ["config", "core.hooksPath", externalHooks], project);
const hooksEntriesBefore = (await readdir(externalHooks)).sort();
const hooksEscape = execute("node", [CLI, "bootstrap", "--target", project, "--skills-home", externalHooks], ROOT, { ...process.env, HOME: home }, true);
assert.notEqual(hooksEscape.status, 0);
assert.match(hooksEscape.stderr, /effective Hooks directory/);
assert.deepEqual((await readdir(externalHooks)).sort(), hooksEntriesBefore, "bootstrap must not write Skills into the effective external Hooks directory");
output("git", ["config", "--unset", "core.hooksPath"], project);

const unmanaged = join(sandbox, "unmanaged-skills");
await mkdir(join(unmanaged, "agent-os-prepare-development-workspace"), { recursive: true });
await writeFile(join(unmanaged, "agent-os-prepare-development-workspace", "SKILL.md"), "---\nname: prepare-development-workspace\ndescription: Unmanaged fixture.\n---\n");
const conflict = execute("node", [CLI, "bootstrap", "--target", project, "--skills-home", unmanaged], ROOT, { ...process.env, HOME: home }, true);
assert.notEqual(conflict.status, 0);
assert.match(conflict.stderr, /Refusing to overwrite unmanaged Skill destination/);

console.log("Bootstrap tests passed.");
