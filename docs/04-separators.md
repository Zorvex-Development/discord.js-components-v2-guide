# 04 · SeparatorBuilder

A separator is a layout tool, not just a horizontal line. It can create a visible divider, add whitespace, or do both depending on its configuration. Consistent spacing makes complex panels easier to scan.

## Visible divider

```js
const {
  SeparatorBuilder,
  SeparatorSpacingSize,
} = require('discord.js');

const divider = new SeparatorBuilder()
  .setDivider(true)
  .setSpacing(SeparatorSpacingSize.Small);
```

## Space without a line

```js
const breathingRoom = new SeparatorBuilder()
  .setDivider(false)
  .setSpacing(SeparatorSpacingSize.Large);
```

Use `SeparatorSpacingSize.Small` when two components belong closely together. Use `Large` when changing from one group of information to another. A separator should help the reader understand structure, not appear after every single line.

## Inside a container

```js
const panel = new ContainerBuilder()
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent('## Ticket details'),
    new TextDisplayBuilder().setContent('**Ticket:** `#support-1042`'),
  )
  .addSeparatorComponents(
    new SeparatorBuilder()
      .setDivider(true)
      .setSpacing(SeparatorSpacingSize.Small),
  )
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent('**Status:** Waiting for staff'),
    new TextDisplayBuilder().setContent('**Opened by:** @ExampleUser'),
  );
```

This fragment assumes the other builders have also been imported. In a real message, replace the sample mention-like text with a real mention only when that is intended.

## Choosing a spacing pattern

- **Heading → description:** a small gap is usually enough; a line may be unnecessary.
- **Summary → settings:** use a divider when the groups represent different tasks.
- **Status → destructive action:** create clear separation and label the destructive action plainly.
- **Every item in a short list:** do not add a line between all items. It creates visual noise.

## Debugging

If spacing appears too large or too small, inspect the chosen `SeparatorSpacingSize` and preview the message on desktop and mobile. If the divider is missing, check whether `.setDivider(true)` is set. A spacer with `setDivider(false)` is expected to have no visible line.
