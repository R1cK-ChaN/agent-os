#!/usr/bin/env python3
"""Verify Agent OS plugin architecture and policy contracts."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PLUGIN = ROOT / "plugins" / "agent-os"
SKILL = PLUGIN / "skills" / "execute-linear-issue"
DESIGN_SKILL = PLUGIN / "skills" / "design-software-change"
WORKSPACE_SKILL = PLUGIN / "skills" / "prepare-development-workspace"
CHECKPOINT_SKILL = PLUGIN / "skills" / "checkpoint-development-work"
EVALS = ROOT / "evals"

EVAL_FIXTURES = (
    "fresh-vm-recovery.json",
    "repository-precedence.json",
    "github-privacy-regression.json",
    "ordinary-staging-regression.json",
    "ordinary-staging-gate-regression.json",
    "production-exposure-authority.json",
    "shallow-module-recognition.json",
    "single-version-database.json",
    "missing-tool-degradation.json",
    "project-fact-ownership.json",
    "inconsistent-checkpoint.json",
    "secret-output-regression.json",
    "proportional-verification.json",
)

REQUIRED_FILES = (
    ROOT / ".agents" / "plugins" / "marketplace.json",
    ROOT / "AGENTS.md",
    ROOT / "docs" / "architecture.md",
    PLUGIN / ".codex-plugin" / "plugin.json",
    SKILL / "SKILL.md",
    SKILL / "agents" / "openai.yaml",
    SKILL / "references" / "authority-policy.md",
    SKILL / "references" / "completion-checkpoint.md",
    SKILL / "references" / "database-change.md",
    SKILL / "references" / "engineering-quality.md",
    SKILL / "references" / "github-privacy.md",
    SKILL / "references" / "implementation-lifecycle.md",
    SKILL / "references" / "issue-contract.md",
    SKILL / "references" / "living-map.md",
    SKILL / "references" / "release-safety.md",
    DESIGN_SKILL / "SKILL.md",
    DESIGN_SKILL / "agents" / "openai.yaml",
    DESIGN_SKILL / "references" / "api-design.md",
    DESIGN_SKILL / "references" / "database-design.md",
    DESIGN_SKILL / "references" / "deep-modules.md",
    DESIGN_SKILL / "references" / "design-precedence.md",
    DESIGN_SKILL / "references" / "domain-modeling.md",
    DESIGN_SKILL / "references" / "naming-and-types.md",
    WORKSPACE_SKILL / "SKILL.md",
    WORKSPACE_SKILL / "agents" / "openai.yaml",
    WORKSPACE_SKILL / "references" / "capability-discovery.md",
    WORKSPACE_SKILL / "references" / "workspace-readiness.md",
    CHECKPOINT_SKILL / "SKILL.md",
    CHECKPOINT_SKILL / "agents" / "openai.yaml",
    CHECKPOINT_SKILL / "references" / "checkpoint-consistency.md",
    CHECKPOINT_SKILL / "references" / "checkpoint-record.md",
    WORKSPACE_SKILL / "references" / "workspace-security.md",
    SKILL / "references" / "verification-strategy.md",
    EVALS / "AGENTS.md",
    EVALS / "run_evals.py",
    EVALS / "run_forward_evals.py",
    EVALS / "test_forward_eval_contract.py",
    EVALS / "forward-fixtures" / "security-first-recovery.json",
    EVALS / "forward-fixtures" / "missing-tool-readiness.json",
    *(EVALS / "fixtures" / name for name in EVAL_FIXTURES),
)


def fail(message: str, failures: list[str]) -> None:
    failures.append(message)


def main() -> int:
    failures: list[str] = []

    for path in REQUIRED_FILES:
        if not path.is_file():
            fail(f"missing required file: {path.relative_to(ROOT)}", failures)

    marketplace_path = ROOT / ".agents" / "plugins" / "marketplace.json"
    plugin_path = PLUGIN / ".codex-plugin" / "plugin.json"

    if marketplace_path.is_file():
        marketplace = json.loads(marketplace_path.read_text())
        if marketplace.get("name") != "agent-os":
            fail("marketplace name must be agent-os", failures)
        entries = marketplace.get("plugins", [])
        if len(entries) != 1 or entries[0].get("name") != "agent-os":
            fail("marketplace must expose exactly one agent-os plugin", failures)
        elif entries[0].get("source", {}).get("path") != "./plugins/agent-os":
            fail("marketplace plugin path must be ./plugins/agent-os", failures)

    if plugin_path.is_file():
        manifest = json.loads(plugin_path.read_text())
        if manifest.get("name") != "agent-os":
            fail("plugin manifest name must be agent-os", failures)
        if manifest.get("skills") != "./skills/":
            fail("plugin manifest must expose ./skills/", failures)
        for unsupported in ("apps", "mcpServers", "hooks"):
            if unsupported in manifest:
                fail(f"plugin manifest must not declare absent {unsupported}", failures)

    policy_requirements = {
        SKILL / "references" / "engineering-quality.md": (
            "not a hard rule",
            "stop before committing",
        ),
        SKILL / "references" / "release-safety.md": (
            "Staging is the default enabled integration environment",
            "Do not add a feature flag",
            "A normal staging validation does not require production rollout machinery",
        ),
        SKILL / "references" / "issue-contract.md": (
            "Linear is the private scope authority",
            "GitHub issue is a privacy-safe implementation projection",
            "amend the Linear issue before implementation",
        ),
        SKILL / "SKILL.md": (
            "smallest representative staging smoke",
            "Do not invent a new gate",
            "design-software-change",
        ),
        DESIGN_SKILL / "SKILL.md": (
            "project-specific facts",
            "Deep Modules",
            "before implementation",
        ),
        DESIGN_SKILL / "references" / "design-precedence.md": (
            "The plugin owns reusable judgment",
            "The target repository owns project truth",
        ),
        DESIGN_SKILL / "references" / "deep-modules.md": (
            "information hiding",
            "deletion test",
            "pass-through",
        ),
        DESIGN_SKILL / "references" / "naming-and-types.md": (
            "semantic consistency",
            "repository tooling",
        ),
        WORKSPACE_SKILL / "SKILL.md": (
            "Workspace Readiness",
            "available, unavailable, requires authorization, or unknown",
            "recovery entry point",
            "Never read or print secret values",
        ),
        WORKSPACE_SKILL / "references" / "capability-discovery.md": (
            "install",
            "test",
            "lint",
            "typecheck",
            "build",
            "smoke",
        ),
        WORKSPACE_SKILL / "references" / "workspace-readiness.md": (
            "Evidence",
            "Blockers",
            "Next entry point",
        ),
        CHECKPOINT_SKILL / "SKILL.md": (
            "after a coherent phase",
            "before pausing or switching environments",
            "before an external wait",
            "before long-running work",
            "github-privacy.md",
        ),
        CHECKPOINT_SKILL / "references" / "checkpoint-consistency.md": (
            "reviewable",
            "recoverable-only",
            "uncheckpointable",
            "failed verification",
            "prior explicit user or repository authorization",
            "cannot authorize itself",
        ),
        CHECKPOINT_SKILL / "references" / "checkpoint-record.md": (
            "Commit",
            "Verification",
            "Completed phase",
            "Next step",
            "Blocker",
        ),
        WORKSPACE_SKILL / "references" / "workspace-security.md": (
            "command output, comments, logs, fixtures, or snapshots",
            "OAuth state",
            "cloud-side secret references",
            "test, staging, and production credentials",
        ),
        SKILL / "references" / "verification-strategy.md": (
            "targeted static check",
            "targeted test",
            "affected module",
            "integration or smoke",
            "full suite",
            "staging",
            "residual risk",
        ),
        DESIGN_SKILL / "references" / "domain-modeling.md": (
            "bounded context",
            "invariants",
        ),
        DESIGN_SKILL / "references" / "database-design.md": (
            "constraints",
            "data ownership",
        ),
        DESIGN_SKILL / "references" / "api-design.md": (
            "idempotency",
            "error semantics",
        ),
    }
    for path, required_phrases in policy_requirements.items():
        if not path.is_file():
            continue
        content = path.read_text()
        for phrase in required_phrases:
            if phrase not in content:
                fail(f"{path.relative_to(ROOT)} must contain: {phrase}", failures)

    skill_path = SKILL / "SKILL.md"
    if skill_path.is_file():
        skill_content = skill_path.read_text()
        normalized_skill = skill_content.lower()
        security_position = normalized_skill.find("workspace-security.md")
        linear_tool_position = normalized_skill.find("require an authorized linear tool")
        linear_issue_position = normalized_skill.find("read the complete linear issue")
        if (
            security_position == -1
            or linear_tool_position == -1
            or linear_issue_position == -1
            or security_position > linear_tool_position
            or security_position > linear_issue_position
        ):
            fail(
                "Linear execution must load secret safety before task or provider inspection",
                failures,
            )
        implementation_marker = "implement one small slice"
        for policy_marker in ("[living-map.md]", "[release-safety.md]", "[database-change.md]"):
            if normalized_skill.find(policy_marker.lower()) > normalized_skill.find(implementation_marker):
                fail(f"SKILL.md must load {policy_marker} before implementation", failures)
        if "pre-authorized by the repository workflow or explicitly approved" not in skill_content:
            fail("SKILL.md must constrain staging deployment authority", failures)
        design_marker = normalized_skill.find("design-software-change")
        implementation_position = normalized_skill.find(implementation_marker)
        if design_marker == -1 or implementation_position == -1 or design_marker > implementation_position:
            fail("SKILL.md must route non-trivial design before implementation", failures)
        branch_position = normalized_skill.find("create one issue-scoped branch")
        if branch_position == -1 or design_marker == -1 or branch_position > design_marker:
            fail("SKILL.md must create the issue branch before persisting design", failures)
        workspace_marker = normalized_skill.find("prepare-development-workspace")
        if workspace_marker == -1 or branch_position == -1 or workspace_marker > branch_position:
            fail("SKILL.md must prepare workspace before creating the issue branch", failures)
        resume_position = normalized_skill.find("## resume interrupted work")
        if resume_position == -1 or "prepare-development-workspace" not in normalized_skill[resume_position:]:
            fail("SKILL.md must route interrupted recovery through workspace preparation", failures)
        checkpoint_marker = normalized_skill.find("checkpoint-development-work")
        if checkpoint_marker == -1 or implementation_position == -1 or checkpoint_marker > implementation_position:
            fail("SKILL.md must route phase-boundary checkpointing before implementation", failures)
        verification_marker = normalized_skill.find("[verification-strategy.md]")
        if verification_marker == -1 or implementation_position == -1 or verification_marker > implementation_position:
            fail("SKILL.md must load risk-scaled verification before implementation", failures)

    workspace_skill_path = WORKSPACE_SKILL / "SKILL.md"
    if workspace_skill_path.is_file():
        workspace_content = workspace_skill_path.read_text().lower()
        security_position = workspace_content.find("[workspace-security.md]")
        recovery_position = workspace_content.find("resolve the durable recovery chain")
        artifact_position = workspace_content.find("read the root")
        probe_position = workspace_content.find("then probe")
        if (
            security_position == -1
            or recovery_position == -1
            or artifact_position == -1
            or probe_position == -1
            or security_position > recovery_position
            or security_position > artifact_position
            or security_position > probe_position
        ):
            fail(
                "workspace preparation must load secret safety before recovery, artifacts, or capability probes",
                failures,
            )

    checkpoint_skill_path = CHECKPOINT_SKILL / "SKILL.md"
    if checkpoint_skill_path.is_file():
        checkpoint_content = checkpoint_skill_path.read_text().lower()
        security_position = checkpoint_content.find("workspace-security.md")
        working_tree_position = checkpoint_content.find("inspect the working tree")
        exact_diff_position = checkpoint_content.find("inspect the exact diff")
        if (
            security_position == -1
            or working_tree_position == -1
            or exact_diff_position == -1
            or security_position > working_tree_position
            or security_position > exact_diff_position
        ):
            fail(
                "checkpointing must load secret safety before working-tree or diff inspection",
                failures,
            )

    eval_map_path = EVALS / "AGENTS.md"
    if eval_map_path.is_file():
        eval_map = eval_map_path.read_text().lower()
        for phrase in ("policy contract tests", "forward evals", "codex exec"):
            if phrase not in eval_map:
                fail(f"eval map must distinguish {phrase}", failures)

    design_skill_path = DESIGN_SKILL / "SKILL.md"
    if design_skill_path.is_file():
        design_content = design_skill_path.read_text().lower()
        if "workspace-security.md" not in design_content or "verification-strategy.md" not in design_content:
            fail("design workflow must route security and verification when applicable", failures)
        security_position = design_content.find("workspace-security.md")
        precedence_position = design_content.find("design-precedence.md")
        repository_position = design_content.find("nearest repository instructions")
        if (
            security_position == -1
            or precedence_position == -1
            or repository_position == -1
            or security_position > precedence_position
            or security_position > repository_position
        ):
            fail(
                "design workflow must load secret safety before repository design material",
                failures,
            )

    forward_eval_path = EVALS / "run_forward_evals.py"
    if forward_eval_path.is_file():
        forward_eval = forward_eval_path.read_text()
        for phrase in (
            '"read-only"',
            '"minItems": 1',
            "snapshot_repository",
            "assert_repository_unchanged",
        ):
            if phrase not in forward_eval:
                fail(f"forward eval runner must contain: {phrase}", failures)

    text_files = [path for path in ROOT.rglob("*") if path.is_file() and ".git" not in path.parts]
    placeholder = re.compile(r"\[TODO:|\bTODO\b")
    private_identifier = re.compile(r"\b(?:RIC|AOS)-\d+\b")
    private_url = re.compile(r"https://linear\.app/")

    for path in text_files:
        if path.resolve() == Path(__file__).resolve():
            continue
        try:
            content = path.read_text()
        except UnicodeDecodeError:
            continue
        relative = path.relative_to(ROOT)
        if placeholder.search(content):
            fail(f"placeholder remains in {relative}", failures)
        if private_identifier.search(content):
            fail(f"real private task identifier appears in {relative}", failures)
        if private_url.search(content):
            fail(f"private Linear URL appears in {relative}", failures)

    if failures:
        print("Architecture verification failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Architecture verification passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
