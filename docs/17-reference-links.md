# 17 · Reference Links and Version Notes

This handbook was written as an independent guide for Zorvex Development projects, with examples targeting the `discord.js` 14.26.x API surface. The code should still be checked against the exact version installed by each bot.

## Official Discord documentation

- [Components Overview](https://discord.com/developers/docs/components/overview) — introduction to the component-driven message system.
- [Components Reference](https://discord.com/developers/docs/components/reference) — component types, supported combinations and constraints.
- [Message resource and flags](https://discord.com/developers/docs/resources/message) — message payload and flag behaviour.
- [Discord API changelog](https://discord.com/developers/docs/change-log) — API changes that may affect implementation.

## discord.js documentation

- [discord.js 14.26.4 API index](https://discord.js.org/docs/packages/discord.js/14.26.4)
- [Message options for 14.26.4](https://discord.js.org/docs/packages/discord.js/14.26.4/BaseMessageOptions%3AInterface)
- [Interaction reply options for 14.26.4](https://discord.js.org/docs/packages/discord.js/14.26.4/InteractionReplyOptions%3AInterface)
- [Interaction update options for 14.26.4](https://discord.js.org/docs/packages/discord.js/14.26.4/InteractionUpdateOptions%3AInterface)
- [discord.js guide: Components V2](https://discordjs.guide/popular-topics/components-v2)

## Version discipline

When upgrading `discord.js`, review the official docs for any changes to builder method names, supported accessory types, message-edit options and interaction flags. Avoid installing an unreviewed major version in production just to fix one missing method. Pin the dependency or use a controlled version range, test the examples in a development guild, and deploy the upgrade intentionally.

## Contribution standard for Zorvex Development

New pages should:

- explain when a component is useful, not just list its methods;
- include a minimal example and a practical example where appropriate;
- import every symbol used in a complete snippet;
- call out prerequisites and edge cases;
- identify which rules come from Discord and which are application design advice;
- avoid copying another guide's prose, branding, server invites or examples;
- link to official references for rules that can change.

When a rule is uncertain or has changed since a page was written, verify the official reference and update the relevant section rather than preserving a stale snippet for consistency's sake.
