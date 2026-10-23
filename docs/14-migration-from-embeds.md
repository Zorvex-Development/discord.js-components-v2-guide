# 14 · Migrating from Embeds to Components V2

Do not convert an entire bot in one pass just because a new layout system exists. Components V2 can be introduced one message at a time, which gives you a safer path for a production bot.

## Step 1 · Pick one message type

Choose a message whose layout benefits from the new structure: a ticket panel, settings dashboard, moderation result or media-heavy status card. Leave unrelated messages on embeds until you have a working pattern.

## Step 2 · Map embed content to builders

| Legacy embed feature | Components V2 direction |
|---|---|
| Embed title | A heading in `TextDisplayBuilder` |
| Embed description | One or more `TextDisplayBuilder` components |
| Embed fields | Label/value text blocks, optionally separated into groups |
| Embed colour | `ContainerBuilder.setAccentColor()` |
| Thumbnail beside text | `SectionBuilder` + `ThumbnailBuilder` |
| Large image or multiple images | `MediaGalleryBuilder` |
| Buttons/selects | `ActionRowBuilder` within the component layout |
| Attached transcript or export | `FileBuilder` with the uploaded attachment |

The mapping is not one-to-one. Embed fields have a structured field grid; V2 often calls for clearer labels, short lines and separators rather than reproducing the same dense visual arrangement.

## Step 3 · Rebuild the layout

Start with the heading and summary. Add the important values in reading order, then add separators only where they help, and finish with the available actions. Make the primary action obvious and make destructive actions visually distinct.

## Step 4 · Add the V2 flag and remove legacy fields

A V2 payload must include `MessageFlags.IsComponentsV2`. Its visible content belongs in components, not the old `content` or `embeds` properties. The same restrictions apply to `stickers` and `poll` fields.

```js
await channel.send({
  components: [buildNewPanel(data)],
  flags: MessageFlags.IsComponentsV2,
});
```

## Step 5 · Treat message edits carefully

A fresh V2 message is straightforward. Converting an existing legacy message is more delicate: message flags have persistence rules, and a V2 message cannot simply be switched back to the legacy format. For edits, check the exact discord.js version's `MessageEditOptions` and test a representative message in a development guild before rolling out the conversion.

Do not assume that sending an empty `content` or removing `embeds` will reverse the V2 format. Design the migration around the irreversible flag behaviour.

## Step 6 · Keep behaviour separate from presentation

A new panel may look different while its application logic remains the same. Keep the existing business rules, database calls and permission checks in their own functions; change only the presentation path first. Then update the interaction handlers to refresh the new layout when the data changes.

## Step 7 · Test the migration

Verify:

- the panel renders with all intended text and media;
- mobile and desktop layouts remain understandable;
- every custom ID reaches a handler;
- ephemeral vs public visibility matches the old behaviour;
- error and empty states are still handled;
- edits do not conflict with the message's existing format;
- the bot has permissions to post files, media and controls as required.

## Recommended rollout

Ship one panel, collect feedback, and monitor interaction errors. Once the pattern is stable, migrate the next message type. A measured rollout is boring, which is precisely why it tends to work.
