# 10 · Select Menus

Select menus let a member choose a value from a compact control. Use them when a user needs to choose from a known set, rather than presenting ten buttons that all compete for attention.

## Menu types

| Builder | User selects |
|---|---|
| `StringSelectMenuBuilder` | Options defined by your bot |
| `UserSelectMenuBuilder` | A Discord user |
| `RoleSelectMenuBuilder` | A server role |
| `ChannelSelectMenuBuilder` | A channel |
| `MentionableSelectMenuBuilder` | A user or role |

Each select menu is placed in an `ActionRowBuilder`. A menu's chosen value is returned through its interaction object; your bot must still validate whether the selection is allowed for the current task.

## String menu with defined options

```js
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
} = require('discord.js');

const sectionPicker = new StringSelectMenuBuilder()
  .setCustomId('dashboard:section')
  .setPlaceholder('Choose a dashboard section')
  .addOptions(
    {
      label: 'Overview',
      value: 'overview',
      description: 'Current status and key totals',
    },
    {
      label: 'Activity',
      value: 'activity',
      description: 'Recent actions and trends',
    },
    {
      label: 'Preferences',
      value: 'preferences',
      description: 'Change how this panel behaves',
    },
  );

const panel = new ContainerBuilder()
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent('## Dashboard'),
    new TextDisplayBuilder().setContent('Pick the area you want to inspect.'),
  )
  .addActionRowComponents(
    new ActionRowBuilder().addComponents(sectionPicker),
  );

await channel.send({
  components: [panel],
  flags: MessageFlags.IsComponentsV2,
});
```

## Read the selection

```js
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== 'dashboard:section') return;

  const selectedSection = interaction.values[0];
  const allowedSections = new Set(['overview', 'activity', 'preferences']);

  if (!allowedSections.has(selectedSection)) {
    return interaction.reply({
      content: 'That section is not available.',
      ephemeral: true,
    });
  }

  await interaction.reply({
    content: `Selected section: ${selectedSection}`,
    ephemeral: true,
  });
});
```

The example demonstrates validation and routing only. Your real handler should rebuild or update the panel with the selected section rather than echoing an internal key to the user.

## Multi-select behaviour

String selects can be configured for one or multiple values within Discord's supported minimum and maximum selection rules. When multiple selection is enabled, do not assume `interaction.values[0]` is the only item. Validate every returned value against an allowlist and process the set intentionally.

## User, role and channel selectors

These menus return selected Discord entities or IDs through type-specific interaction properties. Use the appropriate `isUserSelectMenu()`, `isRoleSelectMenu()`, `isChannelSelectMenu()` or `isMentionableSelectMenu()` guard. Then verify requirements such as the channel type, role hierarchy, target membership and the actor's permissions. A user being selectable does not mean the bot is allowed to moderate them.

## UX and validation rules

- Set a useful placeholder so the control has meaning before it is opened.
- Use labels that are understandable without internal system knowledge.
- Give every menu a stable `customId` and a matching handler.
- Validate values on the server, even when the options originated from your own code.
- Treat old messages as stale: available options may have changed since the message was sent.
- Keep option count and label length within current Discord limits. Check the official reference before generating large menus.
