async function handleDemoButton(interaction) {
  if (interaction.customId === 'zorvex:demo:details') {
    return interaction.reply({
      content: 'Connect this route to the feature your panel is meant to demonstrate.',
      ephemeral: true,
    });
  }

  if (interaction.customId === 'zorvex:demo:dismiss') {
    await interaction.deferUpdate();
    return interaction.message.delete().catch(() => null);
  }
}

function registerDemoInteractions(client) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith('zorvex:demo:')) return;

    try {
      await handleDemoButton(interaction);
    } catch (error) {
      console.error('Zorvex demo interaction failed:', error);

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: 'The demo action could not be completed.',
          ephemeral: true,
        }).catch(() => {});
      }
    }
  });
}

module.exports = { registerDemoInteractions };
