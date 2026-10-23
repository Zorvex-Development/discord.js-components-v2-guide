const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} = require('discord.js');

function buildQuickStartPanel() {
  const actions = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('zorvex:demo:details')
      .setLabel('View details')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('zorvex:demo:dismiss')
      .setLabel('Dismiss')
      .setStyle(ButtonStyle.Secondary),
  );

  return new ContainerBuilder()
    .setAccentColor(0x5F00FF)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('# Zorvex Development'),
      new TextDisplayBuilder().setContent(
        'This starter panel combines display text, spacing and interactive controls.',
      ),
    )
    .addSeparatorComponents(
      new SeparatorBuilder()
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Small),
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('-# Demo UI · Connect the custom IDs to your own handlers.'),
    )
    .addActionRowComponents(actions);
}

async function sendQuickStart(channel) {
  return channel.send({
    components: [buildQuickStartPanel()],
    flags: MessageFlags.IsComponentsV2,
  });
}

module.exports = { buildQuickStartPanel, sendQuickStart };
