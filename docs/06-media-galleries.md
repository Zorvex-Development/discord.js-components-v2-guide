# 06 · MediaGalleryBuilder

A media gallery displays multiple visual items in one part of a Components V2 message. It works well for image comparisons, documentation screenshots, track artwork collections, event photos or a set of user-submitted images that passed validation.

## One item

```js
const {
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  ContainerBuilder,
  MessageFlags,
} = require('discord.js');

const gallery = new MediaGalleryBuilder().addItems(
  new MediaGalleryItemBuilder()
    .setURL('https://example.com/dashboard-preview.png')
    .setDescription('Dashboard preview'),
);

const panel = new ContainerBuilder().addMediaGalleryComponents(gallery);

await channel.send({
  components: [panel],
  flags: MessageFlags.IsComponentsV2,
});
```

## Several items

```js
const gallery = new MediaGalleryBuilder().addItems(
  new MediaGalleryItemBuilder()
    .setURL('https://example.com/overview.png')
    .setDescription('Overview screen'),
  new MediaGalleryItemBuilder()
    .setURL('https://example.com/settings.png')
    .setDescription('Settings screen'),
  new MediaGalleryItemBuilder()
    .setURL('https://example.com/audit-log.png')
    .setDescription('Audit log screen'),
);
```

Discord lays the items out as a gallery. Preview the final layout in your own client because image dimensions and device width affect how the result feels.

## Spoiler media

```js
const concealed = new MediaGalleryItemBuilder()
  .setURL('https://example.com/unreleased-artwork.png')
  .setDescription('Unreleased artwork preview')
  .setSpoiler(true);
```

A spoiler protects only the viewing experience. It should never be treated as a replacement for channel permissions or private storage.

## Local uploads

You can attach a local file and refer to it using an `attachment://` URL, provided the filename matches the uploaded attachment's name. The message must include the file in its `files` option. See [File components](07-file-components.md) for a complete upload pattern.

## Choosing good gallery content

- Use images with a clear purpose and enough resolution to be legible.
- Write descriptions that explain what each image represents instead of repeating a generic label.
- Group images that belong together; use separate galleries or messages for unrelated content.
- Validate remote URLs and avoid accepting arbitrary URLs from untrusted members without checking your product's safety requirements.
- Keep useful text outside the gallery so the message still makes sense when media fails to load.

## Troubleshooting

If an image is missing, test the URL directly, check whether the host allows public access and verify the URL or attachment filename. If the gallery is too crowded, reduce the item count and split it across messages rather than shrinking the content into an unreadable dump.
