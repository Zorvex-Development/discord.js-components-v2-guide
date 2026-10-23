# 12 · Production Patterns

Moving a demo into a live bot is mostly about the parts the demo leaves out: validation, repeated clicks, permissions, data consistency, stale messages and graceful failure.

## Keep layout and business logic separate

A useful structure is:

```text
src/
  ui/
    panels/
      ticketPanel.js
      serverSettingsPanel.js
    components/
      buttons.js
      menus.js
  interactions/
    buttons/
      tickets.js
      settings.js
    selects/
      settings.js
  services/
    ticketService.js
    settingsService.js
```

The exact folder names are up to your project. The important boundary is that a UI factory returns builders, a service validates and performs application operations, and an interaction handler connects the two.

## Build a reusable panel factory

```js
const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
} = require('discord.js');

function buildStatusPanel({ title, state, details }) {
  return new ContainerBuilder()
    .setAccentColor(state === 'healthy' ? 0x2ECC71 : 0xE67E22)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ${title}`),
      new TextDisplayBuilder().setContent(`**State:** ${state}`),
    )
    .addSeparatorComponents(
      new SeparatorBuilder()
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Small),
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(details),
    );
}
```

The sample uses a small, explicit state mapping. For production, define the allowed states instead of passing arbitrary values. Ensure `title` and `details` have length limits and are safe to render as Markdown.

## Permissions must be checked in the handler

Hiding a button is not an authorization strategy. A handler should verify:

- the actor has the necessary Discord permission or application-level role;
- the actor belongs to the correct guild or owns the relevant resource;
- the bot itself has permission to perform the requested Discord action;
- the target still exists and the requested state transition is valid;
- a duplicate request cannot cause the operation to run twice.

For moderation actions, also consider Discord role hierarchy and protected targets. For tickets or billing, verify ownership or staff scope using trusted database records rather than client-provided IDs alone.

## Make operations idempotent

If a member clicks “Close ticket” twice, the second request should not close or bill the same ticket again. Store an explicit state such as `open`, `closing`, `closed`; perform a conditional state transition; and return a clear message when the record is already closed. UI disabling is helpful but cannot guarantee that simultaneous interactions will not reach the backend.

## Control mentions

When generating text from user-provided strings, be deliberate about mentions. Where supported by the send method, set `allowedMentions` to the smallest set you intend to permit, such as no automatic parsing. Do not trust a display name, ticket subject or external API response to be plain harmless text.

## Avoid stale and expensive panels

- Rebuild the UI from current state instead of trying to mutate many isolated labels by hand.
- Cache only data that can tolerate being stale, and set a clear cache lifetime.
- Defer the interaction before slow queries or external requests.
- Handle a deleted message, unavailable channel or missing database row without crashing the process.
- Set sensible file size, input length and request rate limits.

## Keep observability useful

Record operation names and outcomes, not secrets. In exception logs, include the trace and enough non-sensitive identifiers to locate the event. In user-facing responses, explain what the user can do next without exposing stack traces, SQL details or credentials.
