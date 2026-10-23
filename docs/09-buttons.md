# 09 · Buttons

Buttons expose a small number of clear actions. Their visual style helps express priority, but the server-side handler is what decides whether the action is allowed and what it changes.

## The available styles

| Style | Typical role | Interaction behaviour |
|---|---|---|
| `Primary` | Main action for this panel | Sends a component interaction |
| `Secondary` | Alternative or neutral action | Sends a component interaction |
| `Success` | Confirm or enable action | Sends a component interaction |
| `Danger` | Remove, revoke or close action | Sends a component interaction |
| `Link` | Open a website or external route | Opens a URL; does not trigger a button interaction |

## Construct buttons

```js
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId('case:approve:1042')
    .setLabel('Approve case')
    .setStyle(ButtonStyle.Success),
  new ButtonBuilder()
    .setCustomId('case:reject:1042')
    .setLabel('Reject case')
    .setStyle(ButtonStyle.Danger),
  new ButtonBuilder()
    .setLabel('Read policy')
    .setStyle(ButtonStyle.Link)
    .setURL('https://example.com/policy'),
);
```

Link buttons use `.setURL()` instead of `.setCustomId()`. Since they navigate externally, there is no component-click event for the bot to process.

## Handle button interactions

```js
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'case:approve:1042') {
    if (!interaction.memberPermissions?.has('ModerateMembers')) {
      return interaction.reply({
        content: 'You do not have permission to approve this case.',
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: 'The case approval request was received.',
      ephemeral: true,
    });
  }
});
```

This is a routing illustration, not a complete case-management system. In a real application, do not hardcode one case ID into the handler. Parse the identifier, load the case, verify that the current member is permitted to manage it, confirm that the case remains pending, write the database change, and then update the UI. If the operation may exceed the interaction acknowledgement window, defer first.

## Custom ID conventions

Use a predictable scheme such as `ticket:close:12345` or `music:skip:<sessionId>`. Keep the identifier concise. Treat all ID fragments as input: the message may be old, a record may have been deleted, and users may click a component after the underlying state changes.

Avoid placing API keys, passwords, payment secrets or other sensitive data in a custom ID. It is an identifier, not a secure storage mechanism.

## Avoid double acknowledgements

Each interaction gets one initial acknowledgement. Do not call `reply()` in two branches, and do not call `reply()` after `deferReply()`. After deferring, use `editReply()` or `followUp()` as appropriate. When updating the component's own message, `update()` or `deferUpdate()` may be the correct path.

## Disable or remove actions when state changes

After a successful action, refresh the panel to reflect the new state. Disabling a button can reduce accidental repeat clicks, but your database logic must still reject duplicate or stale operations. The UI is a hint to the user, not a concurrency lock.
