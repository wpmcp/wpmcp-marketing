---
title: Build with Kadence, GenerateBlocks, and Spectra through your AI agent
description: WP MCP's Gutenberg block tools work on any registered block, so an agent can discover and edit Kadence, GenerateBlocks, and Spectra blocks with no suite-specific setup.
date: "2026-07-27"
integration: block-suites
order: 40
---

# Build with Kadence, GenerateBlocks, and Spectra through your AI agent

If your site uses a Gutenberg block suite, **Kadence Blocks**, **GenerateBlocks**,
or **Spectra** (UAGB), you do not need a suite-specific integration. WP MCP's
Gutenberg block tools are block-source-agnostic: they read the whole block
registry and operate on raw block markup, so an AI agent handles suite blocks
exactly like core blocks. Every edit is snapshotted first.

## Why it works

Three free tools do the whole job for any block suite:

- `list-block-types` reads `WP_Block_Type_Registry`, so `kadence/*`,
  `generateblocks/*`, and `uagb/*` blocks show up alongside core blocks.
- `get-block-type` returns any block's attributes, whatever registered it.
- `add-block` / `update-block` insert and edit blocks by markup at an index
  path.

There is no allowlist and no suite-specific code, and a regression test drives
a non-core block through list, inspect, and add to keep it that way.

## Discover the suite's blocks

```
› List the Kadence blocks available on this site.
› What blocks does GenerateBlocks register, and what attributes does its
  headline block take?
```

The agent filters `list-block-types` (for example by the `kadence`,
`generateblocks`, or `uagb` namespace) and inspects any block with
`get-block-type`.

## Build and edit

```
› Add a Kadence row-layout with three info-boxes under the hero on /services.
› Change the button label in the Spectra call-to-action block on the homepage.
```

The agent reads the page's blocks, then inserts or updates the suite block by
markup at the right path. Because each write is snapshotted, you can undo any
change from wp-admin or by asking the agent.

## A note on schemas

The blocks must be registered (the suite active) for `list-block-types` and
`get-block-type` to describe them. `add-block` and `update-block` work on raw
markup regardless, but keeping the suite active lets the agent discover and
validate against the real block definitions.
