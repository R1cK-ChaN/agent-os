# Naming and types

Optimize for semantic consistency, not global cosmetic uniformity. Follow repository tooling for casing, file naming, formatting, and language-specific mechanics.

## Name the domain

- Use the repository's canonical domain term; do not create synonyms for the same concept.
- Give different concepts different names even when their current representations match.
- Name operations by domain intent and observable effect, not implementation technique.
- Use predicate names for booleans and preserve meaningful opposites such as enabled/disabled or accepted/rejected.
- Include units, currency, timezone, or coordinate system when the type does not encode them.
- Distinguish external, database, and domain identifiers when interchange would be unsafe.
- Name collections for their members and mappings for the relationship they represent.

Avoid vague names such as `data`, `info`, `item`, `object`, `handler`, `helper`, `manager`, `service`, or `util` unless that is the precise repository-defined role. Avoid type encodings and redundant context already established by the containing module.

Use shorter names in tiny local scopes and more explicit names at public or long-lived boundaries. Rename an existing public concept only with an approved compatibility path.

Prefer types that encode valid distinctions: value objects for units or validated concepts, closed variants for finite states, and explicit optionality. Do not wrap primitives when the wrapper adds no invariant, behavior, safety, or domain meaning.
