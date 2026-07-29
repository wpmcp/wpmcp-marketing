---
title: Edit Elementor global colors and fonts with your AI agent
description: WP MCP reads and updates the active Elementor kit's global colors and typography, so an agent can re-skin a whole site in one step, hex-validated and reversible.
date: "2026-07-28"
integration: elementor
order: 50
---

# Edit Elementor global colors and fonts with your AI agent

Elementor's **Site Settings** hold the global design tokens that skin your whole
site: the four system colors (Primary, Secondary, Text, Accent), any custom
colors you have added, and the matching typography tokens. WP MCP now exposes
that kit to your AI agent, so a single instruction can restyle every page at
once. Every write is snapshotted first, so any change is one click from undone.

## What you need

- WP MCP installed and connected to your AI client, with its Pro tier active.
- Elementor active. The tools read and write the active kit.

## Read the current palette

```
› What are the global colors and fonts on this site right now?
```

`get-global-settings` returns the kit's system and custom colors and
typography, plus a `settings_hash`. On a kit you have never customized, the four
Elementor system tokens are reported from their defaults so the agent can patch
them by id. The hash is a concurrency token: the write tools require it, so a
change made after the read is refused instead of silently overwriting.

## Change brand colors

```
› Set the site's primary brand color to #0e7490 and add a custom color called
  Sunset at #ff7a00.
```

`update-global-colors` patches a system token by its id (`primary`,
`secondary`, `text`, `accent`) and updates or appends custom colors. Colors are
validated as hex before anything is written, and the whole kit is snapshotted,
so a bad value is rejected and any change is reversible from wp-admin or by
asking the agent.

## Change global fonts

```
› Make the primary typography use Poppins at weight 600.
```

`update-global-typography` merges the typography fields you name into a token.
Setting a font family or weight automatically enables custom typography on that
token, so the change actually renders across the site.

## Why it is safe

The kit is an ordinary post, and its tokens live in its `_elementor_page_settings`
meta, so WP MCP's standard post snapshot captures the whole kit before every
write. That means a site-wide restyle is as reversible as editing a single
widget: roll it back per change or per session with `rollback-operation`.
