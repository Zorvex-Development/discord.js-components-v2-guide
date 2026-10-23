# Zorvex Development | Components V2 Handbook

> A practical, implementation-focused handbook for building reliable Discord message interfaces with `discord.js`.

**Maintained by Zorvex Development** · **Language:** JavaScript · **Library target:** `discord.js` 14.26.x (Components V2 support begins in 14.19.0)

Components V2 changes how a message is composed. Instead of treating the message as a block of text or an embed with a few controls attached, you assemble a small interface from display components, layout blocks, media and interactive controls. This handbook explains the building blocks and, more importantly, how to combine them without creating brittle interaction flows.

This is an independent community guide from Zorvex Development. It is not an official Discord publication. API behaviour can change, so the official Discord and discord.js references linked at the end should be treated as the final authority.

## Start here

1. Read [the foundations](docs/00-foundations.md) before writing a layout.
2. Follow [the message setup guide](docs/01-message-foundation.md) to send your first V2 message.
3. Learn each display component in its own reference: [containers](docs/02-containers.md), [text](docs/03-text-display.md), [separators](docs/04-separators.md), [sections and thumbnails](docs/05-sections-and-thumbnails.md), [media galleries](docs/06-media-galleries.md), and [file components](docs/07-file-components.md).
4. Add controls with [action rows](docs/08-action-rows.md), [buttons](docs/09-buttons.md), and [select menus](docs/10-select-menus.md).
5. Build dependable behaviour using [the interaction lifecycle](docs/11-interaction-lifecycle.md) and [production patterns](docs/12-production-patterns.md).
6. Study [complete examples](docs/13-complete-examples.md), [migration advice](docs/14-migration-from-embeds.md), [layout and accessibility](docs/15-layout-and-accessibility.md), and [troubleshooting](docs/16-troubleshooting.md).

## Handbook map

| File | What it covers |
|---|---|
| `docs/00-foundations.md` | Mental model, requirements, limits and terminology |
| `docs/01-message-foundation.md` | Flags, sending, replying, editing and ephemeral responses |
| `docs/02-containers.md` | Grouping components, accent colours and spoiler containers |
| `docs/03-text-display.md` | Markdown text, headings, dynamic values and safe formatting |
| `docs/04-separators.md` | Dividers, visual rhythm and spacing |
| `docs/05-sections-and-thumbnails.md` | Side-by-side content, thumbnails and accessory buttons |
| `docs/06-media-galleries.md` | Image and video galleries, attachment URLs and spoiler media |
| `docs/07-file-components.md` | Displaying uploaded attachments inside the layout |
| `docs/08-action-rows.md` | Grouping interactive controls correctly |
| `docs/09-buttons.md` | Button styles, custom IDs and handling clicks |
| `docs/10-select-menus.md` | String, user, role, channel and mentionable selects |
| `docs/11-interaction-lifecycle.md` | Acknowledge, defer, update, reply and error handling |
| `docs/12-production-patterns.md` | Reusable builders, state checks, permissions and security |
| `docs/13-complete-examples.md` | Practical panels for tickets, moderation and settings |
| `docs/14-migration-from-embeds.md` | A gradual route from embeds to Components V2 |
| `docs/15-layout-and-accessibility.md` | UI hierarchy, concise text and accessible controls |
| `docs/16-troubleshooting.md` | Frequent errors and a debugging checklist |
| `docs/17-reference-links.md` | Official references and version notes |

## Quick start

Install or update the library in your bot project:

```bash
npm install discord.js@^14.26.0
```

Create a small V2 panel:

```js
const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
} = require('discord.js');

async function sendWelcomePanel(channel) {
  const panel = new ContainerBuilder()
    .setAccentColor(0x5F00FF)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('# Welcome to Zorvex'),
      new TextDisplayBuilder().setContent(
        'A clean message layout, assembled from dedicated display components.'
      ),
    )
    .addSeparatorComponents(
      new SeparatorBuilder()
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Small),
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('-# Built with Components V2'),
    );

  return channel.send({
    components: [panel],
    flags: MessageFlags.IsComponentsV2,
  });
}
```

The V2 flag is not decoration. It tells Discord to interpret the payload as a component-driven message. With that flag set, do not include the traditional `content`, `embeds`, `stickers` or `poll` fields in the same payload; place visible copy inside display components instead.

## Design principle

A good V2 message is not a pile of boxes. Use the smallest layout that makes the user's next action obvious. Keep data presentation separate from interaction logic, validate every user-controlled value, and acknowledge interactions before doing slow work.

## Official documentation

- [Discord Components Overview](https://discord.com/developers/docs/components/overview)
- [Discord Components Reference](https://discord.com/developers/docs/components/reference)
- [discord.js 14.26.4 API documentation](https://discord.js.org/docs/packages/discord.js/14.26.4)
- [discord.js Components V2 guide](https://discordjs.guide/popular-topics/components-v2)
