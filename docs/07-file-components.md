# 07 · File Components

`FileBuilder` places an uploaded file inside the component layout. This is useful for ticket transcripts, diagnostic reports, configuration exports and other generated artifacts that should be part of a structured response rather than a detached upload.

## Complete local-file example

```js
const {
  AttachmentBuilder,
  ContainerBuilder,
  FileBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
} = require('discord.js');

const attachment = new AttachmentBuilder('./exports/ticket-1042.txt')
  .setName('ticket-1042.txt');

const panel = new ContainerBuilder()
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent('## Ticket transcript'),
    new TextDisplayBuilder().setContent('The transcript is attached below.'),
  )
  .addSeparatorComponents(
    new SeparatorBuilder()
      .setDivider(true)
      .setSpacing(SeparatorSpacingSize.Small),
  )
  .addFileComponents(
    new FileBuilder().setURL('attachment://ticket-1042.txt'),
  );

await channel.send({
  components: [panel],
  files: [attachment],
  flags: MessageFlags.IsComponentsV2,
});
```

The name in `attachment://ticket-1042.txt` must match the uploaded attachment name. The `FileBuilder` references the file; it does not read a path from disk by itself. The `AttachmentBuilder` (or another supported attachment source) supplies the actual bytes.

## Dynamic filenames

If filenames are generated dynamically, create the attachment and component from the same final filename variable so they cannot drift apart.

```js
const filename = `report-${Date.now()}.txt`;
const attachment = new AttachmentBuilder(reportBuffer, { name: filename });
const display = new FileBuilder().setURL(`attachment://${filename}`);
```

This example expects `reportBuffer` to contain the generated report bytes. Use trusted, normalised filenames. Do not let a member choose arbitrary filesystem paths for generated attachments.

## Common use cases

- **Ticket closure:** attach a transcript and a short summary of who closed the ticket.
- **Moderation:** export a case log for authorised staff.
- **Diagnostics:** send a text report alongside a readable status panel.
- **Data export:** provide a CSV or JSON file while showing the export's time range and filters.

## Security and reliability

- Check who may request or receive the file before generating it.
- Redact tokens, passwords, personal data and internal stack traces from reports.
- Apply your own maximum file-size policy before uploading.
- Make sure temporary files are cleaned up if you write them to disk.
- Use a stable, unique filename and keep the attachment reference synchronised with it.
- Grant the bot the required permission to attach files in the destination channel.

A successful message send does not guarantee that the contents are appropriate to share. Data access rules must be enforced before the attachment is built.
