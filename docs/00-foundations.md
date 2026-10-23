# 00 · Foundations: How Components V2 Fits Together

Components V2 is a message composition system. The message is still sent through familiar methods such as `channel.send()`, `interaction.reply()` and `message.edit()`, but the visible body is built out of components rather than the legacy `content` string and embed array.

## The core mental model

Think in three layers:

1. **Message envelope** — the send/reply/edit call and its flags.
2. **Layout** — containers, sections, separators and galleries determine how information is arranged.
3. **Behaviour** — buttons and select menus create interactions that your bot must handle separately.

A builder only describes the interface. It does not automatically run a button callback, persist a setting, check permissions or verify that a user is allowed to act. Those responsibilities belong to your interaction handler and application logic.

## Important vocabulary

| Term | Meaning |
|---|---|
| `MessageFlags.IsComponentsV2` | Enables the V2 message format for that message. |
| `ContainerBuilder` | A grouped panel that can contain text, sections, rows, separators, galleries and files. |
| `TextDisplayBuilder` | Renders Markdown-capable text within the component layout. |
| `SectionBuilder` | Places one or more text displays alongside an accessory such as a thumbnail or button. |
| `SeparatorBuilder` | Adds a divider, spacing, or both. |
| `MediaGalleryBuilder` | Presents multiple media items as a gallery. |
| `FileBuilder` | Represents an uploaded attachment inside the layout. |
| `ActionRowBuilder` | A wrapper for interactive controls such as buttons and select menus. |
| `customId` | The application-defined identifier returned when an interactive component is used. |

## Version and setup

The examples in this handbook use CommonJS (`require`) and target `discord.js` 14.26.x. Components V2 support was introduced in the 14.19 line, so older installations may not expose the required builders or flags. Check your installed version with:

```bash
npm ls discord.js
```

If a builder is missing, confirm the version before copying random snippets from old posts. A dependency mismatch is a surprisingly popular way to turn ten minutes of UI work into a lost afternoon.

## Payload rules you should memorise

- Include `MessageFlags.IsComponentsV2` when sending a V2 message.
- Do not combine that payload with the legacy `content`, `embeds`, `stickers` or `poll` properties. Put visible text in `TextDisplayBuilder` components.
- Components V2 is opt-in per message; a bot can continue sending ordinary messages elsewhere.
- Once a message has been marked as Components V2, you cannot convert that same message back to the legacy format by removing the flag. Plan message edits and migrations accordingly.
- Interactive components require an `interactionCreate` handler. A button appearing on screen is not proof that its behaviour exists.
- Keep component IDs stable, unique within their intended context, and short enough to fit Discord's ID constraints.

## Limits are real

Discord imposes limits on component counts, nesting, option counts and text size. Those limits can change and some count rules apply across nested components. Do not build layouts that sit exactly on every boundary. Leave room for future labels and actions, and verify current limits in the official Components Reference before releasing a large panel.

## A practical planning checklist

Before implementing a UI, decide:

- What is the one thing the user needs to understand first?
- Which values are important enough to be visible immediately?
- Which actions should be primary, secondary or destructive?
- Does a control act on the current user, a server, a ticket, or a specific stored record?
- What happens if the interaction is stale, the user lacks permission, or a database request fails?
- How will the bot communicate success and failure without sending duplicate responses?

Those decisions are product behaviour. The builders come after them.
