# Deep Modules

Treat a module as deep when a small, stable interface hides substantial, cohesive complexity. Evaluate interface cost as everything a caller must know: concepts, configuration, ordering, lifecycle, errors, retries, side effects, data representation, and implementation leakage.

## Make modules deeper

- Use information hiding to keep algorithms, storage layout, provider quirks, defaults, recovery, and compatibility decisions behind the owning boundary.
- Pull mechanical complexity downward so callers express intent instead of assembling procedures.
- Prefer a domain operation such as `approveClaim` over a generic `updateEntity` when the domain operation can own authorization, invariants, transition rules, and audit behavior.
- Make interfaces somewhat general within their bounded context, not universal across unrelated domains.
- Eliminate special cases through better semantics or safe defaults when doing so does not hide an important policy choice.
- Keep important decisions visible when the caller genuinely owns them.

## Detect shallow modules

- The interface exposes nearly every implementation decision.
- A wrapper consists mainly of pass-through methods without translating policy, representation, failure, or ownership.
- Callers repeat the same ordering, conversion, retry, validation, or error handling.
- A new abstraction adds names and navigation but removes no knowledge from callers.
- Many tiny classes divide one coherent responsibility and require coordinated reading.

Apply the deletion test: imagine deleting the module. If its interface disappears but the same complexity simply spreads across callers, deepen or merge it. If deleting it removes accidental complexity with little replacement, the module may not earn its interface.

Do not optimize for the fewest methods, shortest functions, or most classes. Optimize for reduced cognitive load, localized change, explicit ownership, and independently testable behavior.
