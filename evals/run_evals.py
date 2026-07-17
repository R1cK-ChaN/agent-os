#!/usr/bin/env python3
"""Derive Agent OS decisions from current policies and assert behavior contracts.

Contract: read synthetic JSON inputs and current plugin policy sources without
network or external writes, derive an observation for each named contract, and
exit non-zero for invalid fixtures, missing policy, or violated assertions.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
FIXTURE_ROOT = Path(__file__).with_name("fixtures")
REQUIRED_FIELDS = {"name", "contract", "input", "assertions"}
SUPPORTED_OPERATORS = {
    "equals",
    "equals_path",
    "is_empty",
    "is_false",
    "is_true",
    "not_contains",
}
POLICY_SOURCES = {
    "workspace-recovery": "plugins/agent-os/skills/prepare-development-workspace/SKILL.md",
    "repository-precedence": "plugins/agent-os/skills/design-software-change/references/design-precedence.md",
    "github-privacy": "plugins/agent-os/skills/execute-linear-issue/references/github-privacy.md",
    "fast-staging": "plugins/agent-os/skills/execute-linear-issue/references/release-safety.md",
    "production-authority": "plugins/agent-os/skills/execute-linear-issue/references/authority-policy.md",
    "deep-modules": "plugins/agent-os/skills/design-software-change/references/deep-modules.md",
    "database-compatibility": "plugins/agent-os/skills/execute-linear-issue/references/database-change.md",
    "workspace-readiness": "plugins/agent-os/skills/execute-linear-issue/SKILL.md",
    "project-fact-ownership": "plugins/agent-os/skills/design-software-change/references/design-precedence.md",
    "checkpoint-consistency": "plugins/agent-os/skills/checkpoint-development-work/references/checkpoint-consistency.md",
    "workspace-security": "plugins/agent-os/skills/prepare-development-workspace/references/workspace-security.md",
    "verification-strategy": "plugins/agent-os/skills/execute-linear-issue/references/verification-strategy.md",
}


class FixtureError(ValueError):
    """Report invalid scenario or policy evidence with its fixture context."""


def read_path(document: dict[str, Any], dotted_path: str) -> Any:
    value: Any = document
    for part in dotted_path.split("."):
        if not isinstance(value, dict) or part not in value:
            raise FixtureError(f"unknown assertion path: {dotted_path}")
        value = value[part]
    return value


def has_policy(policy: str, *markers: str) -> bool:
    normalized = policy.lower()
    return all(marker.lower() in normalized for marker in markers)


def derive_observation(
    contract: str, inputs: dict[str, Any], policy: str
) -> dict[str, Any]:
    if contract == "workspace-recovery":
        remote_preferred = has_policy(policy, "prefer remote git", "chat history")
        use_remote = inputs.get("remote_branch_available") is True and remote_preferred
        return {
            "recovery_source": "remote_git" if use_remote else "local_state",
            "requires_chat_history": not remote_preferred,
        }

    if contract == "repository-precedence":
        normalized = policy.lower()
        repository_position = normalized.find("closest repository")
        default_position = normalized.find("agent os design defaults")
        repository_wins = (
            repository_position >= 0
            and default_position >= 0
            and repository_position < default_position
        )
        return {
            "selected_command": inputs.get(
                "repository_verify_command" if repository_wins else "plugin_suggestion"
            )
        }

    if contract == "github-privacy":
        candidate = inputs.get("candidate_text", "")
        privacy_applies = has_policy(policy, "never publish", "private task")
        rejected = (
            inputs.get("destination") == "github_pull_request"
            and "private-task://" in candidate
            and privacy_applies
        )
        return {"published_text": "[rejected private task metadata]" if rejected else candidate}

    if contract == "fast-staging":
        ordinary = inputs.get("environment") == "staging" and not inputs.get(
            "unsafe_side_effect"
        )
        enabled = ordinary and has_policy(
            policy, "staging is the default enabled integration environment"
        )
        avoids_gate = ordinary and has_policy(policy, "do not add a feature flag")
        return {
            "enabled": enabled,
            "release_controls": [] if avoids_gate else ["production_rollout_gate"],
        }

    if contract == "production-authority":
        authority_required = has_policy(policy, "require explicit authority", "production")
        authorized = inputs.get("explicit_authority") is True
        requested = inputs.get("requested_exposure") is True
        return {"expose_to_users": requested and (authorized or not authority_required)}

    if contract == "deep-modules":
        recognizes_shallow = has_policy(policy, "pass-through", "deletion test")
        shallow_input = (
            inputs.get("module_behavior") == "pass_through"
            and inputs.get("hidden_decisions") == 0
        )
        return {"classification": "shallow" if recognizes_shallow and shallow_input else "deep"}

    if contract == "database-compatibility":
        conditional = has_policy(policy, "expand-and-contract", "concurrent")
        needs_compatibility = bool(inputs.get("concurrent_application_versions")) or bool(
            inputs.get("external_clients")
        )
        expand = conditional and needs_compatibility
        return {
            "migration_strategy": "expand-and-contract" if expand else "direct",
            "expand_and_contract": expand,
        }

    if contract == "workspace-readiness":
        explicit_degradation = has_policy(policy, "report a missing dependency")
        missing = inputs.get("required_tool_available") is False
        return {
            "reported_status": "unavailable" if missing and explicit_degradation else "available",
            "claimed_success": not (missing and explicit_degradation),
        }

    if contract == "project-fact-ownership":
        target_owns_truth = has_policy(policy, "target repository owns project truth")
        return {
            "persisted_location": "target_repository" if target_owns_truth else "plugin"
        }

    if contract == "checkpoint-consistency":
        rejects_inconsistent = has_policy(policy, "uncheckpointable", "do not commit")
        inconsistent = inputs.get("coherent_slice") is False
        return {
            "checkpoint_state": (
                "uncheckpointable" if inconsistent and rejects_inconsistent else "reviewable"
            ),
            "represented_as_delivered": not (inconsistent and rejects_inconsistent),
        }

    if contract == "workspace-security":
        candidate = inputs.get("candidate_output", "")
        secret_safe = has_policy(policy, "never expose secrets", "command output")
        rejected = "secret-value://" in candidate and secret_safe
        return {"output": "[redacted]" if rejected else candidate}

    if contract == "verification-strategy":
        proportional = has_policy(policy, "smallest sufficient evidence", "full suite")
        reference_only = (
            inputs.get("change_surface") == "skill_reference"
            and inputs.get("runtime_behavior_changed") is False
        )
        targeted = proportional and reference_only
        return {
            "targeted_static_check": targeted,
            "full_suite": not targeted,
            "staging": not targeted,
        }

    raise FixtureError(f"unsupported behavior contract: {contract}")


def evaluate_assertion(
    document: dict[str, Any], assertion: dict[str, Any]
) -> tuple[bool, str]:
    path = assertion.get("path")
    operator = assertion.get("operator")
    if not isinstance(path, str) or not isinstance(operator, str):
        raise FixtureError("each assertion requires string path and operator")
    if operator not in SUPPORTED_OPERATORS:
        raise FixtureError(f"unsupported operator: {operator}")

    actual = read_path(document, path)
    expected = assertion.get("value")
    if operator == "equals":
        passed = actual == expected
    elif operator == "equals_path":
        if not isinstance(expected, str):
            raise FixtureError("equals_path requires a string value path")
        expected = read_path(document, expected)
        passed = actual == expected
    elif operator == "is_true":
        passed, expected = actual is True, True
    elif operator == "is_false":
        passed, expected = actual is False, False
    elif operator == "is_empty":
        passed = isinstance(actual, (dict, list, str)) and len(actual) == 0
        expected = "an empty dict, list, or string"
    else:
        if not isinstance(actual, (list, str)):
            raise FixtureError("not_contains requires a list or string observation")
        if isinstance(actual, str) and not isinstance(expected, str):
            raise FixtureError("not_contains on a string requires a string value")
        passed = expected not in actual
        expected = f"without {expected!r}"

    return passed, f"{path}={actual!r}, expected {expected!r} via {operator}"


def evaluate_fixture(path: Path, policy_root: Path) -> tuple[bool, str]:
    try:
        document = json.loads(path.read_text())
    except (OSError, json.JSONDecodeError) as error:
        raise FixtureError(f"cannot read JSON fixture: {error}") from error
    if not isinstance(document, dict):
        raise FixtureError("fixture root must be an object")

    missing = REQUIRED_FIELDS - document.keys()
    if missing:
        raise FixtureError(f"missing fields: {', '.join(sorted(missing))}")
    if "observed" in document:
        raise FixtureError("fixtures must not provide observed decisions")
    if not isinstance(document["input"], dict):
        raise FixtureError("input must be an object")
    if not all(
        isinstance(document[field], str) and document[field]
        for field in ("name", "contract")
    ):
        raise FixtureError("name and contract must be non-empty strings")
    if not isinstance(document["assertions"], list) or not document["assertions"]:
        raise FixtureError("assertions must be a non-empty list")

    relative_policy = POLICY_SOURCES.get(document["contract"])
    if relative_policy is None:
        raise FixtureError(f"no policy source for contract: {document['contract']}")
    policy_path = policy_root / relative_policy
    try:
        policy = policy_path.read_text()
    except OSError as error:
        raise FixtureError(f"cannot read policy source {relative_policy}: {error}") from error

    evaluation_document = dict(document)
    evaluation_document["observed"] = derive_observation(
        document["contract"], document["input"], policy
    )
    results = []
    for assertion in document["assertions"]:
        if not isinstance(assertion, dict):
            raise FixtureError("every assertion must be an object")
        results.append(evaluate_assertion(evaluation_document, assertion))

    failures = [detail for passed, detail in results if not passed]
    identity = f"{document['contract']} :: {document['name']}"
    if failures:
        return False, f"{identity} ({'; '.join(failures)})"
    return True, f"{identity} (derived contract satisfied)"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "fixtures",
        nargs="*",
        type=Path,
        help="JSON fixtures to run; defaults to evals/fixtures/*.json",
    )
    parser.add_argument(
        "--policy-root",
        type=Path,
        default=ROOT,
        help="repository root containing current Agent OS policy sources",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    fixtures = sorted(args.fixtures or FIXTURE_ROOT.glob("*.json"))
    if not fixtures:
        print("No behavior fixtures found.", file=sys.stderr)
        return 1

    failures = 0
    for path in fixtures:
        try:
            passed, message = evaluate_fixture(path, args.policy_root)
        except FixtureError as error:
            passed, message = False, f"{path.name} (invalid eval: {error})"
        print(f"[{'PASS' if passed else 'FAIL'}] {message}")
        failures += not passed

    print(f"Behavior evals: {len(fixtures) - failures}/{len(fixtures)} passed.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
