# Behavior eval map

This directory owns deterministic, production-isolated evaluation of Agent OS decisions.

- `run_evals.py` reads scenario inputs and current plugin policy sources, derives decisions, evaluates generic assertions, and exits non-zero when a named behavior contract is violated.
- `fixtures/` contains minimal synthetic inputs and assertions. Fixtures never author the observed decision they are testing.

Fixtures must remain secret-free, network-independent, deterministic, and focused on public Agent OS behavior contracts. Do not copy real projects, credentials, private task metadata, or production payloads here. Extend the generic assertion vocabulary only when a new behavior cannot be expressed with the existing operators.

Run:

```bash
python3 -B evals/run_evals.py
```
