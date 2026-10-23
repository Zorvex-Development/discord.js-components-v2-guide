# 03 · TextDisplayBuilder

`TextDisplayBuilder` is the main way to write visible copy in a Components V2 message. It supports Discord's message Markdown, so headings, inline code, links, lists and emphasis can be used to create hierarchy without relying on embeds.

## Basic text

```js
const { TextDisplayBuilder } = require('discord.js');

const heading = new TextDisplayBuilder().setContent('## Queue overview');
const description = new TextDisplayBuilder().setContent(
  'The worker is processing **3 jobs**. The next job is waiting for an available slot.',
);
```

## Markdown patterns worth using

```js
new TextDisplayBuilder().setContent('# Page title');
new TextDisplayBuilder().setContent('**State:** `Running`');
new TextDisplayBuilder().setContent('- First item\n- Second item\n- Third item');
new TextDisplayBuilder().setContent('> This line is a quoted note.');
new TextDisplayBuilder().setContent('[Open documentation](https://discord.js.org/)');
new TextDisplayBuilder().setContent('-# Updated automatically when settings change');
```

Use headings sparingly. A main panel usually needs one clear heading, then smaller headings or bold labels for secondary details. If every line is bold, nothing looks important.

## Compose dynamic content

JavaScript template strings are convenient, but dynamic values should be validated and formatted before rendering.

```js
function makeMemberSummary(member) {
  const safeName = String(member.displayName).slice(0, 80);
  const joined = member.joinedAt
    ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>`
    : 'Unknown';

  return new TextDisplayBuilder().setContent(
    `## Member summary\n**Member:** ${safeName}\n**Joined:** ${joined}`,
  );
}
```

The example is intentionally small. If an untrusted string can contain Markdown, mention syntax or line breaks, do not assume that `String()` makes it safe. For user-submitted content, consider a format/escape helper and set `allowedMentions` on the message send when mentions should not ping anyone. Also keep the entire message within Discord's current text limits.

## Avoid giant text blocks

Long text can technically be split across several text display components, but splitting does not make an unreadable message readable. Prefer a short summary and a few labelled values. Put detailed output in a file component or a follow-up message when appropriate.

## Reusable helper

```js
function textLine(label, value) {
  return new TextDisplayBuilder().setContent(`**${label}:** ${value}`);
}
```

Use this only for values you have already normalised for Markdown and mention behaviour. A stronger application helper might handle date formatting, missing values, mention suppression and truncation centrally.

## Quick diagnostic

If text does not appear, first check the V2 flag and the parent layout. If the message is rejected, inspect the full payload for forbidden legacy fields and confirm component and text limits. When formatting looks wrong, remember that Markdown is parsed by Discord, not by JavaScript: a string can be valid JavaScript and still produce unintended Markdown.
