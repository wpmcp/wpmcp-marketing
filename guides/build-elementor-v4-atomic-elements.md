---
title: Build Elementor v4 atomic elements with your AI agent
description: WP MCP detects Elementor 4.0+ and builds atomic flexbox, div-block, and widget elements with the correct typed-prop format, snapshotted so every edit is reversible.
date: "2026-07-28"
integration: elementor
order: 56
---

# Build Elementor v4 atomic elements with your AI agent

Elementor 4.0 introduced a new element model: atomic containers (`e-flexbox`,
`e-div-block`) and atomic widgets (`e-heading`, `e-paragraph`, `e-button`,
`e-image`) whose settings are stored as typed props rather than plain values.
WP MCP speaks that format, so your AI agent can build on the v4 canvas, and it
tells the agent when to use it.

## Check what the site supports first

```
› Is this site on Elementor v4 with atomic elements?
```

`detect-elementor-version` reports the Elementor version, whether atomic
elements are supported, and a recommended mode (`atomic` or `legacy`). An agent
calls this first to decide between the classic widget tools and the atomic ones.

## Build atomic layout and widgets

```
› Add a flexbox on /home and put a heading "Welcome" and a paragraph inside it.
› Add an atomic button labelled "Get started" linking to /signup.
```

`add-flexbox` and `add-div-block` create atomic containers. `add-atomic-widget`
adds a widget by its `e-*` type. You pass friendly params (`title`, `content`,
`text`, `image_url`, `alt`, `link`) and WP MCP converts them into Elementor's
typed prop shapes, so an atomic heading comes out with a real rich-text value,
not an empty box. Any atomic type also accepts raw typed settings for full
control.

## Edit what is there

```
› Change the heading with id ab12cd3 to "Welcome back".
```

`update-atomic-widget` maps the params you pass into typed props and merges only
those, so untouched props are left alone.

## Why it is safe

Atomic elements are written straight into `_elementor_data` as post meta,
snapshotted before the write, so the typed props are stored exactly as Elementor
expects and every atomic edit is reversible with `rollback-operation`. If the
site is not on v4, `detect-elementor-version` says so, and the classic Elementor
tools remain the right choice.
