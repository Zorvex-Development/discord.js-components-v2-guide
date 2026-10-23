# 16 · Troubleshooting and Debugging

Most Components V2 problems fall into four categories: unsupported payload, incorrect builder nesting, interaction routing, or stale application state. Debug them in that order rather than rewriting the layout at random.

## Symptom: the message is rejected or no components appear

Check:

1. Is `MessageFlags.IsComponentsV2` present on the outgoing payload?
2. Does the payload contain legacy `content`, `embeds`, `stickers` or `poll` fields?
3. Are you running a version of `discord.js` that supports the builders you're using?
4. Are the components placed in a supported container/row hierarchy?
5. Have text, option and component-count limits been exceeded?

Print the payload structure during development, but do not log tokens or private attachment contents.

## Symptom: button appears but clicking it does nothing

- Confirm the bot has an `interactionCreate` listener.
- Check `interaction.isButton()` and the exact value of `interaction.customId`.
- Confirm the handler is registered only once and is not blocked by an early return.
- Respond or defer within Discord's acknowledgement deadline.
- Check console errors and promise rejections.
- Remember that link buttons do not generate component interactions.

## Symptom: `Interaction has already been acknowledged`

The same interaction has been replied to or deferred more than once. Choose one initial acknowledgement path and make downstream functions return data rather than independently replying. After deferring, use `editReply()` or `followUp()` depending on the desired response.

## Symptom: `Unknown interaction` or an expired interaction

The initial acknowledgement came too late or the interaction is no longer valid. Acknowledge early, then carry out the slower database or network work. Do not sleep or perform a long request before acknowledging a user interaction.

## Symptom: an attachment component is blank

- Check that the file was added to the message's `files` array.
- Ensure the `attachment://name.ext` URL matches `AttachmentBuilder.setName()` or the final attachment name exactly.
- Confirm the file path or buffer exists and the bot can read it.
- Check attachment size and channel permissions.

## Symptom: media is missing

Test the source URL without requiring authentication. Confirm the host serves an image/video type supported by Discord and that the URL has not expired. If using an attachment URL, ensure the matching file is uploaded in the same message.

## Symptom: a select menu returns unexpected values

Use the correct type guard and interaction property. String selects return an array of string values; multi-select menus can return more than one value. Treat selections as untrusted and verify them against an allowlist and current database state.

## Symptom: an old button acts on an outdated record

The component was rendered before the data changed. Load the latest record, verify that the action is still allowed, and reject duplicate state transitions. Consider updating or disabling stale controls after a successful operation.

## A useful development error handler

```js
client.on('interactionCreate', async (interaction) => {
  try {
    await routeInteraction(interaction);
  } catch (error) {
    console.error('Interaction handler failed', {
      type: interaction.type,
      customId: 'customId' in interaction ? interaction.customId : undefined,
      guildId: interaction.guildId,
      userId: interaction.user?.id,
      error,
    });

    if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: 'Something went wrong while processing that action.',
        ephemeral: true,
      }).catch(() => {});
    }
  }
});
```

Define `routeInteraction()` in your application. This is an observability pattern; refine the error response and logging policy for your project, and do not include credentials, payment secrets or other sensitive values in log entries.

## Release checklist

- [ ] Verify installed `discord.js` version.
- [ ] Verify the V2 flag on every V2 send/edit payload.
- [ ] Check for forbidden legacy payload fields.
- [ ] Confirm all custom IDs have handlers.
- [ ] Confirm every handler acknowledges exactly once.
- [ ] Test permission denial and stale-record cases.
- [ ] Test image, attachment and empty-state behaviour.
- [ ] Test from both desktop and mobile clients.
