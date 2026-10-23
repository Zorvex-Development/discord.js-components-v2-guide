# 01 · Sending a Components V2 Message

This chapter covers the message envelope: where the layout is attached, which flags are needed, and how the same format works for channel messages and interaction responses.

## A channel message

```js
const {
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
} = require('discord.js');

const panel = new ContainerBuilder().addTextDisplayComponents(
  new TextDisplayBuilder().setContent('## System status\nAll services are responding.'),
);

await channel.send({
  components: [panel],
  flags: MessageFlags.IsComponentsV2,
});
```

## Replying to a slash command

```js
const {
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
} = require('discord.js');

const panel = new ContainerBuilder().addTextDisplayComponents(
  new TextDisplayBuilder().setContent('Your configuration is ready.'),
);

await interaction.reply({
  components: [panel],
  flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
});
```

`MessageFlags.Ephemeral` makes an interaction response visible only to the invoking user. It is a visibility choice, not a permission system: the handler must still check whether that user is allowed to perform the requested operation.

## Defer first when work takes time

Discord expects an interaction to be acknowledged quickly. If the operation may involve a database, network call or multiple checks, defer it before doing that work.

```js
await interaction.deferReply({ ephemeral: true });

// Perform the slower operation here.
const panel = buildResultPanel();

await interaction.editReply({
  components: [panel],
  flags: MessageFlags.IsComponentsV2,
});
```

For a deferred ephemeral reply, the visibility choice is established when deferring. The final edit supplies the V2 components. Do not try to send a second initial reply after the interaction has already been acknowledged.

## Top-level components

The `components` property is an array. You can place a container in it, or combine supported top-level display components where the layout calls for that. For maintainable interfaces, a container is often the easiest way to keep related text, separators and controls together.

```js
await channel.send({
  components: [
    new ContainerBuilder().addTextDisplayComponents(
      new TextDisplayBuilder().setContent('# First panel'),
    ),
    new ContainerBuilder().addTextDisplayComponents(
      new TextDisplayBuilder().setContent('A separate panel below it.'),
    ),
  ],
  flags: MessageFlags.IsComponentsV2,
});
```

## Editing a previously sent V2 message

Use `message.edit()` or an interaction update method to replace the component tree. If the message was originally sent as V2, keep using the V2 format. For conversions from legacy messages, see [the migration guide](14-migration-from-embeds.md): editing rules differ from a fresh send and should be tested against the exact message type.

## Mistakes to avoid

**Mixing old and new visible content:** don't set both `content` and a V2 component tree in the same payload. Put the text in a `TextDisplayBuilder` instead.

**Forgetting the flag:** builders alone do not enable the V2 message format.

**Deferring with the wrong response type:** use `deferReply()` when you plan to send a response, or `deferUpdate()` when the action should acknowledge a component and keep/update its existing message.

**Assuming ephemeral means safe:** ephemeral messages reduce who sees the response; they do not replace authorization, validation or audit logging.
