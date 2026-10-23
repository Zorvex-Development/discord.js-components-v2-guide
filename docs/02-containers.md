# 02 · ContainerBuilder

`ContainerBuilder` is the main grouping element for a composed V2 panel. It keeps related information in one visible block and can apply an accent colour or spoiler treatment to the entire container.

## Start with a minimal panel

```js
const {
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
} = require('discord.js');

const panel = new ContainerBuilder()
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent('## Zorvex status'),
    new TextDisplayBuilder().setContent('The API is reachable and the worker queue is healthy.'),
  );

await channel.send({
  components: [panel],
  flags: MessageFlags.IsComponentsV2,
});
```

## Add an accent colour

```js
const panel = new ContainerBuilder()
  .setAccentColor(0x5F00FF)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent('# Premium overview'),
    new TextDisplayBuilder().setContent('Manage the features enabled for this server.'),
  );
```

The number passed to `setAccentColor()` is a hexadecimal colour written as a JavaScript number. For example, `0x5F00FF` is the Zorvex purple used in this sample. Colour should reinforce hierarchy, not be the only way to communicate a state such as success or failure.

## Spoiler container

A spoiler container obscures the entire group until a member reveals it. This can be useful for puzzle answers, unreleased content or sensitive previews.

```js
const revealPanel = new ContainerBuilder()
  .setSpoiler(true)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent('## Hidden result'),
    new TextDisplayBuilder().setContent('The answer is revealed only after the user opens the spoiler.'),
  );
```

Spoiler presentation is not access control. Do not place secrets, private data or authorization tokens inside a spoiler and assume they are protected.

## What belongs inside a container?

Depending on the layout, a container can group:

- text display components for headings, explanations and status;
- separators that break content into readable stages;
- sections that place text next to an image or button;
- action rows for buttons or select menus;
- media galleries and file components.

Organise components in reading order. A title should normally come before explanatory text, which should come before controls. Avoid nesting unrelated settings into one enormous panel just because the API permits many components.

## Reusable container factory

```js
function createInfoPanel({ title, description, color = 0x5F00FF }) {
  const panel = new ContainerBuilder()
    .setAccentColor(color)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ${title}`),
      new TextDisplayBuilder().setContent(description),
    );

  return panel;
}
```

In production, validate or escape values that originate from users before inserting them into Markdown. Never accept arbitrary user text as a trusted title without thinking about mentions, formatting and length. The helper assumes `ContainerBuilder` and `TextDisplayBuilder` have been imported from `discord.js`.

## Common problems

- **Nothing renders:** confirm the outbound message has `MessageFlags.IsComponentsV2`.
- **Unsupported payload:** check that legacy `content`, `embeds`, `stickers` and `poll` fields are not included in the same V2 payload.
- **Crowded panel:** split unrelated content into two panels or provide a select menu to navigate between sections.
- **Spoiler mistaken for privacy:** use permissions and private responses for access control, not visual obfuscation.
