---
title: Build custom Gutenberg blocks with your AI agent
description: WP MCP builds custom Gutenberg blocks from a data spec (attributes plus an HTML template), registered with register_block_type and rendered safely with no code generation and no eval.
date: "2026-07-30"
integration: gutenberg
order: 30
---

# Build custom Gutenberg blocks with your AI agent

WP MCP already lets your AI agent use any registered Gutenberg block. Now it can
also **create new block types** from a description, safely: a block is a data
spec, never generated PHP.

## What you need

- WP MCP installed and connected to your AI client, with its Pro tier active.
- The block editor (Gutenberg), which every modern WordPress site has.

## How a custom block is defined

A block is a spec with three parts:

- **Attributes**, the editable fields (string, rich text, URL, image, number,
  boolean, color). Ask `list-block-control-types` for the full list.
- **A template**, HTML with `{{attribute_name}}` placeholders.
- **Metadata**, a title and category.

```
› Make a "callout" block with a heading, a rich-text body, and a link.
```

`create-custom-block` validates the spec, stores it, and registers it under the
`wpmcp/` namespace with `register_block_type`, so it appears in the inserter.
`validate-block-spec` checks a spec first without storing it.

## Safe by design: no code generation, no eval

A custom block is **interpreted data, not generated code**. A single
render callback renders every block by substituting your attribute values into
the template, escaping each by its type: plain text is escaped, rich text is
filtered with `wp_kses_post`, and URLs go through `esc_url`. There is no `eval`
anywhere, so a stored block can never execute arbitrary code.

## Manage your blocks

```
› List my custom blocks.
› Update the callout block's default heading.
› Disable the seasonal-banner block after the sale.
```

`list-custom-blocks`, `update-custom-block`, `set-block-status`, and
`delete-custom-block` manage the set. Blocks are stored as ordinary posts, so
disabling or deleting one is reversible.
