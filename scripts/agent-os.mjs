#!/usr/bin/env node

import { createHash } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import { access, cp, lstat, mkdir, mkdtemp, readFile, readdir, readlink, realpath, rename, rm, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "..");
const PLUGIN_ROOT = join(REPO_ROOT, "plugins", "agent-os");
const SOURCE_SKILLS = join(PLUGIN_ROOT, "skills");
const PLUGIN_MANIFEST = join(PLUGIN_ROOT, ".codex-plugin", "plugin.json");
const MARKER = ".agent-os-managed.json";

function parseArgs(argv) {
  const [command = "help", ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    if (["check-only", "json"].includes(key)) options[key] = true;
    else {
      const value = rest[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for --${key}`);
      options[key] = value;
      index += 1;
    }
  }
  return { command, options };
}

function run(command, args, cwd, allowFailure = false) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (result.error) throw result.error;
  if (!allowFailure && result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr.trim() || result.stdout.trim()}`);
  }
  return { status: result.status, stdout: result.stdout || "", stderr: result.stderr || "" };
}

async function exists(path) {
  try { await stat(path); return true; } catch { return false; }
}

async function nearestExisting(path) {
  const missing = [];
  let current = resolve(path);
  while (!(await exists(current))) {
    missing.unshift(basename(current));
    const parent = dirname(current);
    if (parent === current) throw new Error(`No existing parent for ${path}`);
    current = parent;
  }
  return join(await realpath(current), ...missing);
}

function isWithin(parent, candidate) {
  const value = relative(parent, candidate);
  return value === "" || (!value.startsWith("..") && !isAbsolute(value));
}

async function assertExternal(target, userSkills) {
  const targetRoot = await realpath(target);
  const gitDirRaw = run("git", ["rev-parse", "--git-dir"], target).stdout.trim();
  const gitRoot = await realpath(resolve(target, gitDirRaw));
  const skillRoot = await nearestExisting(userSkills);
  if (isWithin(targetRoot, skillRoot) || isWithin(gitRoot, skillRoot)) {
    throw new Error("The user Skill directory must resolve outside the target repository and its Git directory");
  }
  return { targetRoot, gitRoot, skillRoot };
}

async function sha256(path) {
  const hash = createHash("sha256");
  hash.update(await readFile(path));
  return hash.digest("hex");
}

async function directoryDigest(root, allowSymlinks = false) {
  const hash = createHash("sha256");
  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      if (entry.name === MARKER) continue;
      const path = join(directory, entry.name);
      hash.update(path.slice(root.length + 1));
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile()) hash.update(await readFile(path));
      else if (entry.isSymbolicLink() && allowSymlinks) hash.update(await readlink(path));
      else throw new Error(`Unsupported entry in ${root}: ${path}`);
    }
  }
  await walk(root);
  return hash.digest("hex");
}

async function pluginInfo() {
  const manifest = JSON.parse(await readFile(PLUGIN_MANIFEST, "utf8"));
  if (manifest.name !== "agent-os" || !manifest.version || manifest.skills !== "./skills/") {
    throw new Error("Agent OS plugin manifest is invalid");
  }
  const entries = await readdir(SOURCE_SKILLS, { withFileTypes: true });
  const skills = [];
  for (const entry of entries.filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const source = join(SOURCE_SKILLS, entry.name);
    const content = await readFile(join(source, "SKILL.md"), "utf8");
    const name = content.match(/^name:\s*([^\n]+)$/m)?.[1]?.trim();
    const description = content.match(/^description:\s*([^\n]+)$/m)?.[1]?.trim();
    if (!name || !description) throw new Error(`Skill ${entry.name} is missing name or description`);
    skills.push({ folder: entry.name, name, source, digest: await directoryDigest(source) });
  }
  if (skills.length === 0) throw new Error("Agent OS contains no skills");
  return { manifest, skills };
}

async function gitSnapshot(target) {
  const inside = run("git", ["rev-parse", "--is-inside-work-tree"], target, true);
  if (inside.status !== 0 || inside.stdout.trim() !== "true") throw new Error(`Target is not a Git worktree: ${target}`);
  const gitDir = resolve(target, run("git", ["rev-parse", "--git-dir"], target).stdout.trim());
  return {
    head: run("git", ["rev-parse", "HEAD"], target).stdout.trim(),
    branch: run("git", ["symbolic-ref", "--quiet", "--short", "HEAD"], target, true).stdout.trim() || null,
    status: run("git", ["status", "--porcelain=v2", "--untracked-files=all"], target).stdout,
    configDigest: (await exists(join(gitDir, "config"))) ? await sha256(join(gitDir, "config")) : null,
    hooksDigest: (await exists(join(gitDir, "hooks"))) ? await directoryDigest(join(gitDir, "hooks"), true) : null,
  };
}

async function markerFor(destination) {
  const marker = join(destination, MARKER);
  if (!(await exists(marker))) return null;
  try { return JSON.parse(await readFile(marker, "utf8")); } catch { return null; }
}

async function planSkills(info, userSkills) {
  const plan = [];
  for (const skill of info.skills) {
    const destination = join(userSkills, `agent-os-${skill.folder}`);
    if (!(await exists(destination))) {
      plan.push({ ...skill, destination, action: "install" });
      continue;
    }
    const metadata = await lstat(destination);
    if (metadata.isSymbolicLink() || !metadata.isDirectory()) throw new Error(`Refusing unsafe Skill destination: ${destination}`);
    const currentDigest = await directoryDigest(destination);
    const marker = await markerFor(destination);
    if (currentDigest === skill.digest) {
      plan.push({ ...skill, destination, action: "skip" });
    } else if (marker?.owner === "agent-os" && marker?.skill === skill.name) {
      plan.push({ ...skill, destination, action: "update" });
    } else {
      throw new Error(`Refusing to overwrite unmanaged Skill destination: ${destination}`);
    }
  }
  return plan;
}

async function rollback(operations) {
  for (const operation of [...operations].reverse()) {
    if (await exists(operation.destination)) await rm(operation.destination, { recursive: true, force: true });
    if (operation.backup && await exists(operation.backup)) await rename(operation.backup, operation.destination);
  }
}

async function applyPlan(plan, userSkills, pluginVersion) {
  const operations = [];
  try {
    for (const skill of plan.filter((item) => item.action !== "skip")) {
      const stagingRoot = await mkdtemp(join(userSkills, ".agent-os-stage-"));
      const staged = join(stagingRoot, basename(skill.destination));
      await cp(skill.source, staged, { recursive: true, errorOnExist: true });
      await writeFile(join(staged, MARKER), `${JSON.stringify({ owner: "agent-os", skill: skill.name, pluginVersion }, null, 2)}\n`, { mode: 0o600 });
      if (await directoryDigest(staged) !== skill.digest) throw new Error(`Copied Skill failed integrity check: ${skill.name}`);
      let backup = null;
      if (skill.action === "update") {
        backup = `${skill.destination}.rollback-${process.pid}`;
        await rename(skill.destination, backup);
      }
      try {
        await rename(staged, skill.destination);
        await rm(stagingRoot, { recursive: true, force: true });
        operations.push({ destination: skill.destination, backup });
      } catch (error) {
        if (backup && !(await exists(skill.destination))) await rename(backup, skill.destination);
        throw error;
      }
    }
    return operations;
  } catch (error) {
    await rollback(operations);
    throw error;
  }
}

async function bootstrap(options) {
  const target = resolve(options.target || process.cwd());
  const userSkills = resolve(options["skills-home"] || join(homedir(), ".agents", "skills"));
  const before = await gitSnapshot(target);
  await assertExternal(target, userSkills);
  const info = await pluginInfo();
  const plan = await planSkills(info, userSkills);
  if (options["check-only"]) return { ok: true, command: "bootstrap", checkOnly: true, plan: plan.map(({ name, action }) => ({ name, action })) };

  await mkdir(userSkills, { recursive: true });
  await assertExternal(target, await realpath(userSkills));
  const operations = await applyPlan(plan, userSkills, info.manifest.version);
  try {
    await assertExternal(target, await realpath(userSkills));
    const after = await gitSnapshot(target);
    if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error("Bootstrap changed the target repository");
    for (const operation of operations) if (operation.backup) await rm(operation.backup, { recursive: true, force: true });
  } catch (error) {
    await rollback(operations);
    throw error;
  }

  return {
    ok: true,
    command: "bootstrap",
    pluginVersion: info.manifest.version,
    target,
    projectMutationCheck: { passed: true },
    skills: plan.map(({ name, action }) => ({ name, action })),
  };
}

async function doctor(options) {
  const target = resolve(options.target || process.cwd());
  const userSkills = resolve(options["skills-home"] || join(homedir(), ".agents", "skills"));
  const checks = [];
  const check = async (name, operation) => {
    try { checks.push({ name, status: "available", detail: await operation() }); }
    catch (error) { checks.push({ name, status: "unavailable", detail: error.message }); }
  };
  await check("plugin", async () => `${(await pluginInfo()).skills.length} skills`);
  await check("target-git", async () => (await gitSnapshot(target)).head);
  await check("external-skill-root", async () => {
    const boundary = await assertExternal(target, userSkills);
    const parent = await nearestExisting(boundary.skillRoot);
    await access(parent, fsConstants.W_OK);
    return boundary.skillRoot;
  });
  return { ok: checks.every((item) => item.status === "available"), command: "doctor", checks };
}

function help() {
  return { ok: true, usage: [
    "node scripts/agent-os.mjs bootstrap --target <git-worktree> [--check-only]",
    "node scripts/agent-os.mjs doctor --target <git-worktree>",
  ] };
}

function print(result, json) {
  if (json) return process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.command === "bootstrap" && !result.checkOnly) {
    console.log("Agent OS Skills activated without changing the target repository.");
    console.log("Start a new Codex task and use prepare-development-workspace with the target repository and task identifier.");
  } else console.log(JSON.stringify(result, null, 2));
}

try {
  const { command, options } = parseArgs(process.argv.slice(2));
  const actions = { bootstrap, doctor, help };
  if (!actions[command]) throw new Error(`Unknown command: ${command}`);
  const result = await actions[command](options);
  print(result, options.json);
  if (!result.ok) process.exitCode = 1;
} catch (error) {
  console.error(`Agent OS: ${error.message}`);
  process.exitCode = 1;
}
