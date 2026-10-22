# Avoid generic AI patterns

These patterns appear in generated interfaces regardless of the product. Each is legitimate when the repository's design or the user's request calls for it. Otherwise, treat it as a default to remove.

## Text and labels

- Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining. Drop subtitles, helper text, and captions that restate what the heading, grouping, or control already makes clear.
- Keep text that carries information the layout cannot: accessible names for icon-only controls, units, error and validation messages, and warnings before destructive actions.
- No small all-caps eyebrow label above every heading.
- No single word or phrase accented in a heading with bold, italic, or a different color.
- No `01 / 02 / 03` numbering unless the content is an actual sequence.
- No arrow or emoji appended to every button and link.
- No meta strings stitched together with middle dots when separate, aligned fields would read better.

## Visual treatment

- No purple-to-indigo or other decorative gradients used as a default background or button style.
- Do not default to Inter or another fallback font. Use the project's typeface.
- No grid of identical rounded cards with the same soft shadow as the default structure. Use cards only where content is a set of comparable, independent items.
- One accent color carries emphasis; everything else stays neutral. Do not add colors that have no role.
- No decorative borders, dividers, badges, or icons that encode no information.
- Do not center everything. Product screens read best left-aligned, with alignment following the content.

## Motion

- Use motion to answer a user action: opening, expanding, confirming, or showing what changed.
- No entrance animation on every section and no hover lift on every card.

## Copy

- Name actions by what happens: "Save changes", not "Submit". Keep one name for an action through the flow, so "Publish" leads to "Published".
- Use the user's words, not the system's. People manage notifications, not webhook configuration.
- Errors say what went wrong and how to fix it, without apologizing or staying vague.
- An empty state tells people what to do next.
- Use sentence case and plain verbs. No marketing filler inside the product.
