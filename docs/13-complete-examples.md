# 13 · Complete Examples

These examples combine multiple builders into realistic, adaptable patterns. They are starting points, not complete ticket or moderation systems: connect them to your own database and permission policy before deployment.

## Example A · Ticket status panel

```js
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
} = require('discord.js');

function buildTicketPanel(ticket) {
  const actions = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`ticket:claim:${ticket.id}`)
      .setLabel('Claim ticket')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`ticket:close:${ticket.id}`)
      .setLabel('Close ticket')
      .setStyle(ButtonStyle.Danger),
  );

  return new ContainerBuilder()
    .setAccentColor(0x5F00FF)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## Support ticket · ${ticket.id}`),
      new TextDisplayBuilder().setContent(
        `**Status:** ${ticket.status}\n**Opened by:** <@${ticket.ownerId}>`,
      ),
    )
    .addSeparatorComponents(
      new SeparatorBuilder()
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Small),
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('Staff actions are recorded in the ticket audit log.'),
    )
    .addActionRowComponents(actions);
}

// Sending example:
await channel.send({
  components: [buildTicketPanel(ticket)],
  flags: MessageFlags.IsComponentsV2,
  allowedMentions: { parse: [] },
});
```

Because the panel includes a user mention built from stored data, `allowedMentions` is restricted so the message will not ping users unexpectedly. The interaction handlers still need to check staff permissions, ticket ownership rules and current ticket state.

## Example B · Server settings picker

```js
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
} = require('discord.js');

function buildSettingsMenu() {
  const menu = new StringSelectMenuBuilder()
    .setCustomId('server-settings:page')
    .setPlaceholder('Choose a settings page')
    .addOptions(
      { label: 'General', value: 'general', description: 'Core server options' },
      { label: 'Moderation', value: 'moderation', description: 'Safety and enforcement settings' },
      { label: 'Logging', value: 'logging', description: 'Audit channels and event logs' },
    );

  return new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('## Server settings'),
      new TextDisplayBuilder().setContent('Choose which section to open. Changes should be saved only after validation.'),
    )
    .addActionRowComponents(
      new ActionRowBuilder().addComponents(menu),
    );
}

await interaction.reply({
  components: [buildSettingsMenu()],
  flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
});
```

On menu selection, validate the chosen value against an allowlist, check the actor's permission, load the latest guild configuration and render the selected page. Do not accept arbitrary setting names and blindly write them to a database.

## Example C · Transcript export

```js
const {
  AttachmentBuilder,
  ContainerBuilder,
  FileBuilder,
  TextDisplayBuilder,
  MessageFlags,
} = require('discord.js');

async function sendTranscript(channel, transcriptBuffer, ticketId) {
  const filename = `ticket-${ticketId}-transcript.txt`;
  const upload = new AttachmentBuilder(transcriptBuffer, { name: filename });
  const panel = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('## Transcript exported'),
      new TextDisplayBuilder().setContent(`The transcript for ticket \`${ticketId}\` is attached below.`),
    )
    .addFileComponents(
      new FileBuilder().setURL(`attachment://${filename}`),
    );

  return channel.send({
    components: [panel],
    files: [upload],
    flags: MessageFlags.IsComponentsV2,
  });
}
```

`transcriptBuffer` should already have been generated, filtered and redacted by your application. The channel and request should be authorised before sending the file.

## Example D · Compact information card with image

```js
const {
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  MessageFlags,
} = require('discord.js');

const card = new SectionBuilder()
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent('## Release 2.4.0'),
    new TextDisplayBuilder().setContent('**Channel:** Stable\n**State:** Available'),
  )
  .setThumbnailAccessory(
    new ThumbnailBuilder()
      .setURL('https://example.com/release-icon.png')
      .setDescription('Release icon'),
  );

const panel = new ContainerBuilder()
  .addSectionComponents(card)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent('This release includes stability fixes and revised server settings.'),
  );

await channel.send({
  components: [panel],
  flags: MessageFlags.IsComponentsV2,
});
```

## Before copying an example into production

- Import every builder referenced in the snippet.
- Replace sample IDs, URLs and data sources with values from your app.
- Add interaction handlers for each non-link custom ID.
- Check permissions, current state and error paths.
- Validate text lengths, mention behaviour, attachments and component counts.
- Test the result in a private development server first.
