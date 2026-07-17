#!/usr/bin/env node

import { createHash } from "node:crypto";
import { access, cp, mkdir, mkdtemp, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "..");
const PLUGIN_ROOT = join(REPO_ROOT, "plugins", "agent-os");
const SOURCE_SKILLS = join(PLUGIN_ROOT, "skills");
const PLUGIN_MANIFEST = join(PLUGIN_ROOT, ".codex-plugin", "plugin.json");
const SCHEMA_VERSION = 1;

function parseArgs(argv) {
  const [command = "help", ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    if (["check-only", "json", "force"].includes(key)) options[key] = true;
    else {
      const value = rest[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for --${key}`);
      options[key] = value;
      index += 1;
    }
  }
  return { command, options };
}

function paths(options = {}) {
  const home = resolve(options["agent-os-home"] || process.env.AGENT_OS_HOME || join(homedir(), ".agent-os"));
  return {
    home,
    userSkills: resolve(options["skills-home"] || join(homedir(), ".agents", "skills")),
    installation: join(home, "installation.json"),
    handoffs: join(home, "handoffs"),
    backups: join(home, "backups"),
  };
}

function isWithin(parent, candidate) {
  const base = resolve(parent);
  const path = resolve(candidate);
  return path === base || path.startsWith(`${base}/`) || path.startsWith(`${base}\\`);
}

async function nearestExisting(path) {
  let current = resolve(path);
  while (!(await exists(current))) {
    const parent = dirname(current);
    if (parent === current) throw new Error(`No existing parent for ${path}`);
    current = parent;
  }
  return current;
}

function run(command, args, cwd, allowFailure = false) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (!allowFailure && result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr.trim() || result.stdout.trim()}`);
  }
  return { status: result.status, stdout: result.stdout || "", stderr: result.stderr || "" };
}

async function exists(path) {
  try { await stat(path); return true; } catch { return false; }
}

async function sha256(path) {
  const hash = createHash("sha256");
  hash.update(await readFile(path));
  return hash.digest("hex");
}

async function directoryDigest(root) {
  if (!(await exists(root))) return null;
  const hash = createHash("sha256");
  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const path = join(directory, entry.name);
      const relative = path.slice(root.length + 1);
      hash.update(relative);
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile()) hash.update(await readFile(path));
      else if (entry.isSymbolicLink()) hash.update("symlink");
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
    const skillFile = join(SOURCE_SKILLS, entry.name, "SKILL.md");
    if (!(await exists(skillFile))) throw new Error(`Skill ${entry.name} has no SKILL.md`);
    const content = await readFile(skillFile, "utf8");
    const name = content.match(/^name:\s*([^\n]+)$/m)?.[1]?.trim();
    const description = content.match(/^description:\s*([^\n]+)$/m)?.[1]?.trim();
    if (!name || !description) throw new Error(`Skill ${entry.name} is missing name or description`);
    skills.push({ folder: entry.name, name, source: join(SOURCE_SKILLS, entry.name), digest: await directoryDigest(join(SOURCE_SKILLS, entry.name)) });
  }
  if (skills.length === 0) throw new Error("Agent OS contains no skills");
  return { manifest, skills };
}

async function scanSkillNames(userSkills) {
  const names = new Map();
  if (!(await exists(userSkills))) return names;
  for (const entry of await readdir(userSkills, { withFileTypes: true })) {
    if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
    const file = join(userSkills, entry.name, "SKILL.md");
    if (!(await exists(file))) continue;
    const content = await readFile(file, "utf8");
    const name = content.match(/^name:\s*([^\n]+)$/m)?.[1]?.trim();
    if (name) names.set(name, join(userSkills, entry.name));
  }
  return names;
}

async function gitSnapshot(target) {
  const inside = run("git", ["rev-parse", "--is-inside-work-tree"], target, true);
  if (inside.status !== 0 || inside.stdout.trim() !== "true") throw new Error(`Target is not a Git worktree: ${target}`);
  const gitDirRaw = run("git", ["rev-parse", "--git-dir"], target).stdout.trim();
  const gitDir = resolve(target, gitDirRaw);
  const config = join(gitDir, "config");
  const hooks = join(gitDir, "hooks");
  return {
    head: run("git", ["rev-parse", "HEAD"], target).stdout.trim(),
    branch: run("git", ["symbolic-ref", "--quiet", "--short", "HEAD"], target, true).stdout.trim() || null,
    status: run("git", ["status", "--porcelain=v2", "--untracked-files=all"], target).stdout,
    configDigest: (await exists(config)) ? await sha256(config) : null,
    hooksDigest: await directoryDigest(hooks),
  };
}

function sameSnapshot(before, after) {
  return JSON.stringify(before) === JSON.stringify(after);
}

async function readInstallation(location) {
  if (!(await exists(location))) return null;
  return JSON.parse(await readFile(location, "utf8"));
}

async function atomicJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.tmp-${process.pid}`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  await rename(temporary, path);
}

async function installSkills(info, locations, checkOnly = false) {
  const previous = await readInstallation(locations.installation);
  const managed = new Map((previous?.managedSkills || []).map((item) => [item.name, item]));
  const discovered = await scanSkillNames(locations.userSkills);
  const planned = [];
  for (const skill of info.skills) {
    const destination = join(locations.userSkills, `agent-os-${skill.folder}`);
    const conflict = discovered.get(skill.name);
    const ownedPath = managed.get(skill.name)?.destination;
    if (await exists(destination) && resolve(ownedPath || "") !== resolve(destination)) {
      throw new Error(`Refusing to overwrite unmanaged Skill destination: ${destination}`);
    }
    if (conflict && resolve(conflict) !== resolve(destination) && resolve(conflict) !== resolve(ownedPath || destination)) {
      throw new Error(`Skill name conflict for ${skill.name}: ${conflict}`);
    }
    planned.push({ ...skill, destination });
  }
  if (checkOnly) return planned;
  await mkdir(locations.userSkills, { recursive: true });
  await mkdir(locations.backups, { recursive: true });
  const installed = [];
  for (const skill of planned) {
    const stagingRoot = await mkdtemp(join(locations.userSkills, ".agent-os-stage-"));
    const staged = join(stagingRoot, basename(skill.destination));
    await cp(skill.source, staged, { recursive: true, errorOnExist: true });
    if ((await directoryDigest(staged)) !== skill.digest) throw new Error(`Copied skill failed integrity check: ${skill.name}`);
    let backup = null;
    if (await exists(skill.destination)) {
      backup = join(locations.backups, `${basename(skill.destination)}-${Date.now()}`);
      await rename(skill.destination, backup);
    }
    try {
      await rename(staged, skill.destination);
      await rm(stagingRoot, { recursive: true, force: true });
      if (backup) await rm(backup, { recursive: true, force: true });
    } catch (error) {
      if (backup && !(await exists(skill.destination))) await rename(backup, skill.destination);
      throw error;
    }
    installed.push({ name: skill.name, folder: skill.folder, destination: skill.destination, digest: skill.digest });
  }
  return installed;
}

function sanitizeRemote(remote) {
  if (!remote) return null;
  return remote.replace(/^(https?:\/\/)[^/@]+@/, "$1[redacted]@").replace(/[?#].*$/, "");
}

async function bootstrap(options) {
  const target = resolve(options.target || process.cwd());
  const locations = paths(options);
  if (isWithin(target, locations.home) || isWithin(target, locations.userSkills)) {
    throw new Error("AGENT_OS_HOME and the user Skill directory must be outside the target repository");
  }
  const before = await gitSnapshot(target);
  const info = await pluginInfo();
  const installed = await installSkills(info, locations, Boolean(options["check-only"]));
  const after = await gitSnapshot(target);
  if (!sameSnapshot(before, after)) throw new Error("Bootstrap changed the target repository; inspect it before continuing");
  const remoteResult = run("git", ["remote", "get-url", "origin"], target, true);
  const handoff = {
    schemaVersion: SCHEMA_VERSION,
    createdAt: new Date().toISOString(),
    agentOs: { version: info.manifest.version, source: REPO_ROOT },
    target: {
      path: target,
      repository: options.repo || sanitizeRemote(remoteResult.status === 0 ? remoteResult.stdout.trim() : null),
      branch: before.branch,
      head: before.head,
      dirty: before.status.length > 0,
    },
    task: { linearIssue: options.issue || null },
    requiredCapabilities: options.issue ? ["github", "linear"] : ["github"],
    activation: { mode: "user-skills-copy", checkOnly: Boolean(options["check-only"]), skills: installed.map((item) => item.name) },
    projectMutationCheck: { passed: true },
    nextAction: { skill: "prepare-development-workspace" },
  };
  let handoffPath = null;
  if (!options["check-only"]) {
    const stamp = handoff.createdAt.replace(/[:.]/g, "-");
    handoffPath = join(locations.handoffs, `${stamp}-${basename(target)}.json`);
    await atomicJson(handoffPath, handoff);
    await atomicJson(locations.installation, {
      schemaVersion: SCHEMA_VERSION,
      plugin: "agent-os",
      pluginVersion: info.manifest.version,
      source: REPO_ROOT,
      installedAt: handoff.createdAt,
      managedSkills: installed,
    });
  }
  return { ok: true, command: "bootstrap", handoffPath, handoff };
}

async function doctor(options) {
  const target = resolve(options.target || process.cwd());
  const locations = paths(options);
  const checks = [];
  const check = async (name, operation) => {
    try { const detail = await operation(); checks.push({ name, status: "available", detail }); }
    catch (error) { checks.push({ name, status: "unavailable", detail: error.message }); }
  };
  await check("plugin", async () => `${(await pluginInfo()).skills.length} skills`);
  await check("target-git", async () => (await gitSnapshot(target)).head);
  await check("user-skills-parent", async () => {
    const parent = await nearestExisting(locations.userSkills);
    await access(parent, fsConstants.W_OK);
    return parent;
  });
  await check("installation", async () => (await readInstallation(locations.installation))?.pluginVersion || "not installed");
  return { ok: checks.every((item) => item.status === "available"), command: "doctor", checks };
}

async function status(options) {
  const locations = paths(options);
  const installation = await readInstallation(locations.installation);
  return { ok: Boolean(installation), command: "status", installation };
}

async function uninstall(options) {
  const locations = paths(options);
  const installation = await readInstallation(locations.installation);
  if (!installation) return { ok: true, command: "uninstall", removed: [] };
  const removed = [];
  for (const skill of installation.managedSkills || []) {
    if (!(await exists(skill.destination))) continue;
    const current = await directoryDigest(skill.destination);
    if (current !== skill.digest && !options.force) {
      throw new Error(`Managed skill changed since installation; refusing to remove ${skill.destination}`);
    }
    await rm(skill.destination, { recursive: true, force: true });
    removed.push(skill.destination);
  }
  await rm(locations.installation, { force: true });
  return { ok: true, command: "uninstall", removed };
}

function help() {
  return {
    ok: true,
    usage: [
      "node scripts/agent-os.mjs bootstrap --target <git-worktree> [--issue TEAM-123] [--check-only]",
      "node scripts/agent-os.mjs doctor --target <git-worktree>",
      "node scripts/agent-os.mjs status",
      "node scripts/agent-os.mjs uninstall [--force]",
    ],
  };
}

function print(result, json) {
  if (json) { process.stdout.write(`${JSON.stringify(result, null, 2)}\n`); return; }
  if (result.command === "bootstrap") {
    console.log("Agent OS bootstrap completed without changing the target repository.");
    if (result.handoffPath) console.log(`Handoff: ${result.handoffPath}`);
    console.log("Start a new Codex task and use prepare-development-workspace to recover from this handoff.");
  } else console.log(JSON.stringify(result, null, 2));
}

try {
  const { command, options } = parseArgs(process.argv.slice(2));
  const actions = { bootstrap, doctor, status, uninstall, help };
  if (!actions[command]) throw new Error(`Unknown command: ${command}`);
  const result = await actions[command](options);
  print(result, options.json);
  if (!result.ok) process.exitCode = 1;
} catch (error) {
  console.error(`Agent OS: ${error.message}`);
  process.exitCode = 1;
}
