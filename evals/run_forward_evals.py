#!/usr/bin/env python3
"""Run live Agent forward evals in isolated synthetic repositories."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
FIXTURE_ROOT = Path(__file__).with_name("forward-fixtures")
WORKSPACE_SKILL = ROOT / "plugins" / "agent-os" / "skills" / "prepare-development-workspace"
REQUIRED_FIELDS = {"name", "task", "repository_files", "expected"}
OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "scenario": {"type": "string"},
        "first_action": {"type": "string"},
        "capability_status": {"type": "string"},
        "claimed_success": {"type": "boolean"},
        "actions": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1,
        },
        "evidence": {"type": "array", "items": {"type": "string"}},
    },
    "required": [
        "scenario",
        "first_action",
        "capability_status",
        "claimed_success",
        "actions",
        "evidence",
    ],
    "additionalProperties": False,
}


class ForwardEvalError(RuntimeError):
    """Report an invalid fixture, failed Agent run, or unmet expectation."""


def load_fixture(path: Path) -> dict[str, Any]:
    try:
        fixture = json.loads(path.read_text())
    except (OSError, json.JSONDecodeError) as error:
        raise ForwardEvalError(f"cannot read fixture: {error}") from error
    if not isinstance(fixture, dict):
        raise ForwardEvalError("fixture root must be an object")
    missing = REQUIRED_FIELDS - fixture.keys()
    if missing:
        raise ForwardEvalError(f"missing fields: {', '.join(sorted(missing))}")
    if not isinstance(fixture["repository_files"], dict):
        raise ForwardEvalError("repository_files must be an object")
    if not isinstance(fixture["expected"], dict) or not fixture["expected"]:
        raise ForwardEvalError("expected must be a non-empty object")
    return fixture


def create_repository(root: Path, fixture: dict[str, Any]) -> Path:
    repository = root / "repository"
    repository.mkdir()
    for relative_name, content in fixture["repository_files"].items():
        if not isinstance(relative_name, str) or not isinstance(content, str):
            raise ForwardEvalError("repository file names and contents must be strings")
        target = repository / relative_name
        if repository not in target.resolve().parents:
            raise ForwardEvalError(f"repository path escapes fixture root: {relative_name}")
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content)
    shutil.copytree(WORKSPACE_SKILL, repository / ".agent-os-skill")
    subprocess.run(
        ["git", "init", "--quiet"],
        cwd=repository,
        check=True,
        capture_output=True,
        text=True,
    )
    return repository


def snapshot_repository(repository: Path) -> dict[str, tuple[str, int, str]]:
    """Capture path, mode, and content without relying on Git status."""
    snapshot: dict[str, tuple[str, int, str]] = {}
    for path in sorted(repository.rglob("*")):
        relative = path.relative_to(repository).as_posix()
        mode = path.lstat().st_mode & 0o7777
        if path.is_symlink():
            snapshot[relative] = ("symlink", mode, os.readlink(path))
        elif path.is_file():
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            snapshot[relative] = ("file", mode, digest)
        elif path.is_dir():
            snapshot[relative] = ("directory", mode, "")
    return snapshot


def assert_repository_unchanged(
    repository: Path, before: dict[str, tuple[str, int, str]]
) -> None:
    """Fail when the Agent changed any file, mode, link, or directory."""
    after = snapshot_repository(repository)
    if before == after:
        return
    changed = sorted(set(before) | set(after))
    changed = [path for path in changed if before.get(path) != after.get(path)]
    raise ForwardEvalError(
        "Agent modified repository despite read-only contract: " + ", ".join(changed)
    )


def run_agent(repository: Path, fixture: dict[str, Any], root: Path) -> dict[str, Any]:
    schema_path = root / "output-schema.json"
    result_path = root / "agent-result.json"
    schema_path.write_text(json.dumps(OUTPUT_SCHEMA))
    prompt = f"""Use the prepare-development-workspace Skill at
.agent-os-skill/SKILL.md faithfully. Perform only a read-only workspace
assessment for the raw user task below. The repository is synthetic and must
not contact external services. Do not install anything or mutate the
repository.

Raw user task:
{fixture['task']}

Return the requested JSON. `first_action` must describe the first workflow
action actually taken after reading the Skill, using one of these semantic
labels when applicable: load_workspace_security, inspect_git, read_repository,
probe_capability, or other. `actions` must list the workflow actions in the
order taken. Classify the task's required capability as available,
unavailable, requires authorization, or unknown. Do not claim success without
evidence.
"""
    command = [
        "codex",
        "exec",
        "--ephemeral",
        "--ignore-user-config",
        "--sandbox",
        "read-only",
        "--skip-git-repo-check",
        "--output-schema",
        str(schema_path),
        "--output-last-message",
        str(result_path),
        "--cd",
        str(repository),
        prompt,
    ]
    before = snapshot_repository(repository)
    try:
        completed = subprocess.run(command, capture_output=True, text=True, timeout=240)
    finally:
        assert_repository_unchanged(repository, before)
    if completed.returncode != 0:
        detail = (completed.stderr or completed.stdout).strip()
        raise ForwardEvalError(f"codex exec failed: {detail[-1200:]}")
    try:
        result = json.loads(result_path.read_text())
    except (OSError, json.JSONDecodeError) as error:
        raise ForwardEvalError(f"invalid Agent result: {error}") from error
    if not isinstance(result, dict):
        raise ForwardEvalError("Agent result must be an object")
    return result


def validate_result(result: dict[str, Any], fixture: dict[str, Any]) -> None:
    """Validate structural ordering and scenario-specific Agent outcomes."""
    actions = result.get("actions")
    if not isinstance(actions, list) or not actions:
        raise ForwardEvalError("Agent result must contain at least one action")
    if not all(isinstance(action, str) and action for action in actions):
        raise ForwardEvalError("Agent actions must be non-empty strings")

    failures = []
    for field, expected in fixture["expected"].items():
        actual = result.get(field)
        if actual != expected:
            failures.append(f"{field}={actual!r}, expected {expected!r}")
    if actions[0] != result.get("first_action"):
        failures.append("actions[0] must match first_action")
    if failures:
        raise ForwardEvalError("; ".join(failures))


def evaluate(path: Path) -> tuple[bool, str]:
    fixture = load_fixture(path)
    with tempfile.TemporaryDirectory(prefix="agent-os-forward-eval-") as temp_name:
        temp_root = Path(temp_name)
        repository = create_repository(temp_root, fixture)
        result = run_agent(repository, fixture, temp_root)

    validate_result(result, fixture)
    return True, f"{fixture['name']} (Agent actions satisfied)"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "fixtures",
        nargs="*",
        type=Path,
        help="forward fixtures to run; defaults to evals/forward-fixtures/*.json",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    fixtures = sorted(args.fixtures or FIXTURE_ROOT.glob("*.json"))
    if not fixtures:
        print("No forward eval fixtures found.", file=sys.stderr)
        return 1

    failures = 0
    for path in fixtures:
        try:
            passed, message = evaluate(path)
        except (ForwardEvalError, subprocess.TimeoutExpired) as error:
            passed, message = False, f"{path.name} ({error})"
        print(f"[{'PASS' if passed else 'FAIL'}] {message}")
        failures += not passed

    print(f"Forward evals: {len(fixtures) - failures}/{len(fixtures)} passed.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
