# Follow the design system

An interface drifts when each change makes its own small styling decisions. Reuse the project's decisions instead.

## Tokens

- Use theme tokens for color, typography, spacing, radius, shadow, and motion. Do not hard-code hex values, pixel sizes, font stacks, or one-off shadows when a token exists.
- Choose colors by role, such as surface, text, muted text, border, accent, danger, or success, not by appearance. Roles keep dark mode and theme changes working without per-screen fixes.
- Support dark mode through tokens. Do not add per-component color overrides for one theme.
- When a needed value is missing, add it to the token set where the repository defines tokens, and use it from there. Do not create a local constant.

## Components

- Use the shared component for every control it covers, including buttons, inputs, selects, checkboxes, dialogs, menus, tooltips, tabs, and tables. Do not rebuild one locally or restyle it per screen.
- Do not use unstyled native controls, such as a bare `<select>`, `<input type="date">`, `<dialog>`, or browser `alert`/`confirm`, when the project has a themed equivalent.
- Extend a shared component through its existing variants and props. When a real new variant is needed, add it to the shared component, not a copy.
- Use one icon set at consistent sizes and stroke widths. Do not mix icon libraries or use emoji as icons.

## Typography

- Use the project's type families. Most product interfaces need one family; a second, usually monospace, appears only where its role is clear, such as code or aligned numbers.
- Use the type scale's existing sizes and a small set of weights. Express hierarchy with size, weight, and color from the scale.
- Use tabular figures for numbers that people compare in columns.

## Layout

- Use the spacing scale for every gap and padding, and keep spacing rhythm consistent between similar elements.
- Match the structure of comparable existing screens: page header, navigation, content width, and where actions sit.
- Use radius and elevation to express hierarchy. A page section, a card, and a button do not all need the same radius and shadow.
