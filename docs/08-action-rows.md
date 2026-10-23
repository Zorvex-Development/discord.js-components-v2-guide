# 08 · ActionRowBuilder

An action row groups interactive controls into a single row. In Components V2 layouts, rows commonly sit inside a container so the descriptive copy and controls remain part of one panel.

## A row with buttons

```js
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
} = require('discord.js');

const controls = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId('settings:open')
    .setLabel('Settings')
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId('settings:close')
    .setLabel('Close')
    .setStyle(ButtonStyle.Secondary),
);

const panel = new ContainerBuilder()
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent('## Server settings'),
    new TextDisplayBuilder().setContent('Choose an action below.'),
  )
  .addActionRowComponents(controls);

await channel.send({
  components: [panel],
  flags: MessageFlags.IsComponentsV2,
});
```

## A row with a select menu

```js
const menuRow = new ActionRowBuilder().addComponents(
  new StringSelectMenuBuilder()
    .setCustomId('settings:section')
    .setPlaceholder('Choose a section')
    .addOptions(
      { label: 'General', value: 'general', description: 'Basic server preferences' },
      { label: 'Logging', value: 'logging', description: 'Audit and event settings' },
    ),
);
```

This second fragment expects `StringSelectMenuBuilder` to be imported. A row should contain the kind of controls Discord currently permits for that context; do not mix a select menu and buttons in a way that violates the current component rules. Confirm the official reference if you're combining less common component types.

## Rows are layout, not logic

Adding a button to a row does not attach a callback. Every interactive `customId` needs a handler. The handler should verify the invoker, check the target resource still exists, perform the state change and acknowledge the interaction exactly once.

## Design practices

- Arrange buttons in the same order users will think about the task.
- Keep destructive actions visually distinct and separated from the primary action.
- Use button labels that fit on mobile and describe an outcome.
- Keep IDs meaningful, for example `ticket:close:<ticketId>`, but do not embed secrets or trust an ID as proof of permission.
- Avoid creating a new row for every single button unless the layout genuinely needs separation.

## Debugging

If controls don't appear, check the flag, parent container and payload validation. If they appear but do nothing, inspect your `interactionCreate` handler, the exact `customId`, and whether the interaction is acknowledged before it times out.
