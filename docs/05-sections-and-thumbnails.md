# 05 · Sections and Thumbnail Accessories

`SectionBuilder` is useful when a text block needs a compact accessory beside it. The accessory can be a thumbnail, or a supported button. Typical uses include a member profile summary, a track card, a ticket status block or a small feature announcement.

## Text with a thumbnail

```js
const {
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  MessageFlags,
} = require('discord.js');

const profile = new SectionBuilder()
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent('## Nova Player'),
    new TextDisplayBuilder().setContent('**Status:** Online\n**Role:** Moderator'),
  )
  .setThumbnailAccessory(
    new ThumbnailBuilder()
      .setURL('https://example.com/avatar.png')
      .setDescription('Nova Player avatar'),
  );

const panel = new ContainerBuilder().addSectionComponents(profile);

await channel.send({
  components: [panel],
  flags: MessageFlags.IsComponentsV2,
});
```

Replace the example URL with a publicly reachable image URL or an attachment URL supported by the message. Use a meaningful description when the image carries information. Decorative imagery can use concise descriptive text or omit redundant wording where supported.

## Section with a button accessory

```js
const section = new SectionBuilder()
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent('## Open support ticket'),
    new TextDisplayBuilder().setContent('A staff member can review the issue once the ticket is created.'),
  )
  .setButtonAccessory(
    new ButtonBuilder()
      .setCustomId('support:create-ticket')
      .setLabel('Create ticket')
      .setStyle(ButtonStyle.Primary),
  );
```

This fragment additionally needs `ButtonBuilder` and `ButtonStyle` imported from `discord.js`. The button still produces an interaction: the section does not implement the ticket-creation logic.

## How many text components?

A section is best for a compact group. Put the title and one or two short lines in the section, then move lengthy explanations into regular text displays beneath it. Too many lines next to a small thumbnail create a cramped card, especially on narrow screens.

## Thumbnail versus gallery

Use a **thumbnail accessory** when one small image supports a specific text block. Use a **media gallery** when several images are the primary content or users need to compare them.

## Operational advice

- Validate image URLs before using dynamic sources.
- Do not depend on a remote image server being perfectly reliable; provide useful text even if imagery is unavailable.
- Do not put private or sensitive data into an image URL or assume that a thumbnail has permission semantics.
- Make button labels describe the action, not the internal event name.
