# 15 · Layout Quality, Accessibility and Mobile Design

Components V2 gives you more freedom over message layout, but flexibility does not automatically create good design. The goal is to make the content easy to understand and the next action easy to find.

## Establish a visible hierarchy

A reliable panel often follows this order:

1. **Heading:** name the feature or the current item.
2. **Summary:** explain the status or why the user is seeing the panel.
3. **Details:** show a short group of labels and values.
4. **Divider or space:** separate information from actions when useful.
5. **Controls:** present the available next steps.

Not every message needs all five layers. A short confirmation may need one line and no controls; a settings panel may need several grouped sections.

## Use colour as support, not meaning

An accent colour can reinforce a brand or category. It should not be the only indicator that something failed or succeeded. Add explicit text such as `**Status:** Failed` alongside a visual accent, and choose button styles that are consistent across your bot.

## Write for the small screen first

Discord is frequently used on phones. Long labels, dense multi-column-like layouts and paragraphs packed with inline formatting all become harder to scan on narrow screens.

- Keep headings short enough to understand at a glance.
- Put the most useful information first.
- Prefer compact labels over walls of prose.
- Use galleries for visual collections and sections for one image next to short text.
- Avoid making every item a button; menus are better for long option lists.
- Include an explicit empty state when there is nothing to show.

## Labels should describe outcomes

Prefer `Close ticket` over `Action 2`, `View logs` over `Open`, and `Disable autoplay` over `Toggle`. Use `Cancel` only when the user is actually cancelling the current flow. This reduces ambiguity and helps users who rely on consistent interaction patterns.

## Destructive actions need extra clarity

A destructive button should be clearly labelled, visually distinct and backed by a confirmation or strong server-side validation where the action is costly or irreversible. Never rely on red styling alone to communicate what will happen.

## Keep output accessible and robust

- Provide descriptions for meaningful images when supported by the component.
- Do not convey important state through colour alone.
- Avoid rapid message edits that make a panel flicker while users are reading it.
- Preserve a text explanation for important information that also appears in an image.
- Show useful fallback text if a remote image or external service is unavailable.
- Ensure every interactive control has a visible purpose and a working handler.

## Design review checklist

Before releasing a panel, ask someone who did not build it to use it without a walkthrough. If they cannot identify the current state, understand the key information and predict what each button will do, simplify the panel before adding more decoration.
