"""Deterministic checks for forward-eval harness invariants."""

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from evals.run_forward_evals import (
    ForwardEvalError,
    assert_repository_unchanged,
    snapshot_repository,
    validate_result,
)


class ForwardEvalContractTest(unittest.TestCase):
    def test_empty_actions_cannot_satisfy_ordering(self) -> None:
        fixture = {
            "name": "synthetic",
            "expected": {"first_action": "load_workspace_security"},
        }
        result = {
            "first_action": "load_workspace_security",
            "actions": [],
        }

        with self.assertRaisesRegex(ForwardEvalError, "at least one action"):
            validate_result(result, fixture)

    def test_repository_mutation_fails_the_harness(self) -> None:
        with tempfile.TemporaryDirectory() as temp_name:
            repository = Path(temp_name)
            tracked = repository / "fixture.txt"
            tracked.write_text("before")
            before = snapshot_repository(repository)
            tracked.write_text("after")

            with self.assertRaisesRegex(ForwardEvalError, "modified repository"):
                assert_repository_unchanged(repository, before)


if __name__ == "__main__":
    unittest.main()
