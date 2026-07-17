# Evaluation map

This directory separates deterministic policy contract tests from live Agent forward evals.

- `run_evals.py` owns policy contract tests. It reads scenario inputs and current plugin policy sources, exercises focused Python adapters, and catches missing or contradictory policy text. It does not prove Agent behavior.
- `fixtures/` contains minimal synthetic inputs and assertions. Fixtures never author the observed decision they are testing.
- `run_forward_evals.py` invokes `codex exec` with a read-only sandbox against isolated synthetic repositories, requires non-empty ordered actions, verifies the repository snapshot is unchanged, and checks security-first recovery plus honest missing-tool degradation.
- `test_forward_eval_contract.py` deterministically protects the non-empty-action and no-mutation harness invariants.
- `forward-fixtures/` contains the raw tasks, synthetic repository files, and expected Agent outcomes for those forward evals.

All fixtures must remain secret-free and production-isolated. Policy contract tests are network-independent and deterministic. Forward evals require a configured Codex runtime, use a disposable workspace with instructions forbidding mutation or external services, may vary across model versions, and must report the exact scenario failure rather than replacing the policy tests. Do not copy real projects, credentials, private task metadata, or production payloads here.

Run:

```bash
python3 -B evals/run_evals.py
python3 -B -m unittest evals.test_forward_eval_contract
python3 -B evals/run_forward_evals.py
```
