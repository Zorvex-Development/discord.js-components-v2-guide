# 11 · Interaction Lifecycle and Routing

A V2 layout can be perfectly valid while its controls are completely inert. The interaction lifecycle connects the UI to your application's actual behaviour.

## The basic lifecycle

1. A member clicks a button or chooses a menu option.
2. Discord sends an interaction payload to your bot.
3. The handler identifies the interaction type and routes it using `customId`.
4. The application validates the actor, target and current state.
5. The handler acknowledges the interaction within Discord's deadline.
6. The application completes the operation and responds by updating the original message, editing a deferred reply or sending a follow-up.

## Respond exactly once

Common acknowledgement paths:

- `reply()` sends the first response to an interaction.
- `deferReply()` acknowledges now and lets the bot edit the eventual response later.
- `update()` acknowledges a component interaction and edits its source message.
- `deferUpdate()` acknowledges a component interaction without immediately changing the source message.
- `editReply()` edits a response that the interaction has already acknowledged.
- `followUp()` sends an additional response after the initial acknowledgement.

Do not mix these paths casually. A common bug is calling `reply()` twice or calling `reply()` after deferring. Decide which response path the handler owns before you begin slow work.

## Route by component ID

```js
client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton()) {
      return handleButton(interaction);
    }

    if (interaction.isStringSelectMenu()) {
      return handleStringSelect(interaction);
    }

    if (interaction.isUserSelectMenu()) {
      return handleUserSelect(interaction);
    }

    if (interaction.isRoleSelectMenu()) {
      return handleRoleSelect(interaction);
    }

    if (interaction.isChannelSelectMenu()) {
      return handleChannelSelect(interaction);
    }

    if (interaction.isMentionableSelectMenu()) {
      return handleMentionableSelect(interaction);
    }
  } catch (error) {
    console.error('Component interaction failed:', error);

    if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: 'The action could not be completed. Please try again.',
        ephemeral: true,
      }).catch(() => {});
    }
  }
});
```

This router expects the handler functions to be defined elsewhere. In a larger bot, split routes by feature (tickets, moderation, music, settings) instead of maintaining a single file with every business rule.

## Use `deferUpdate()` for panel actions

When a button simply toggles a settings view or advances a page in the same message, the UI often should remain in place and be refreshed after the work finishes.

```js
await interaction.deferUpdate();
const nextPanel = await loadNextPanelFor(interaction.user.id);
await interaction.message.edit({
  components: [nextPanel],
  flags: MessageFlags.IsComponentsV2,
});
```

This is only a pattern; `loadNextPanelFor()` is application-specific. Confirm that the handler is editing the correct message and that the requester is allowed to access the underlying data. Use the exact edit API and flags appropriate to the message state.

## Stale interactions

Components can outlive the data they refer to. A ticket may be closed, a playlist may be deleted, or a moderation case may already be resolved before someone clicks an old button. Load the latest state from your authoritative store and reject duplicate transitions. Do not treat the button's label or a custom ID as current truth.

## Logging and failure handling

Log enough context to debug the event: interaction type, custom ID, guild ID, actor ID and the operation outcome. Avoid logging secrets or sensitive message content. Catch errors at the routing boundary, but keep feature handlers responsible for useful validation and precise error messages.
