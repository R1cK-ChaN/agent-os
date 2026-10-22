---
name: design-user-interface
description: Build or change product user interfaces (apps, tools, dashboards, admin screens) so they follow the project's design system and avoid generic AI-generated patterns. Use whenever creating, editing, or reviewing any user-facing screen, component, style, or interface copy, including small tweaks. Not for marketing or landing pages that need a new visual identity.
---

# Design a user interface

Product interfaces should look like one product: consistent and restrained, so people learn them once. Most interfaces that look AI-generated come from ignoring the project's existing design system. Generic defaults are the second cause. Follow the system first and add distinctiveness only when the user asks for a new visual direction.

## Workflow

1. Read the nearest repository instructions and any design document, such as `DESIGN.md`, a design-system package, a theme file, or a component library's documentation. The repository's rules override this Skill.
2. Before writing UI, inventory what exists: theme and design tokens, shared components, layout primitives, icons, and a similar existing screen to match. Read [ui-system.md](references/ui-system.md).
3. When the project has no design system, propose a minimal token set before building: 4–6 named colors with roles, one type family and scale, a spacing scale, and radii. Agree on it with the user, or record it in the issue for issue-driven work.
4. Build with existing tokens and components only. Read [ui-tells.md](references/ui-tells.md) and avoid its patterns while writing layout and copy.
5. Run the repository's style, lint, and design-token checks when they exist, such as rules against hard-coded colors or arbitrary values.
6. Render the result and look at it: light and dark themes when both exist, plus a narrow mobile width. When the environment cannot render, say so and name the checks that remain unverified. Code alone does not show spacing, hierarchy, or contrast problems.
7. Make one subtraction pass against [ui-tells.md](references/ui-tells.md). Remove decoration, text, and effects that carry no information.

## Quality floor

- Text and controls meet WCAG AA contrast in every theme.
- Every interactive element has a visible keyboard focus state and an accessible name.
- Motion respects `prefers-reduced-motion`.
- Layouts work at mobile width without horizontal scrolling or overlap.
- Interactive components cover their states: hover, focus, active, disabled, loading, empty, and error.
