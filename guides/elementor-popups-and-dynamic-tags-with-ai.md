---
title: Create Elementor popups and bind dynamic tags with your AI agent
description: WP MCP creates Elementor popups, sets their triggers, and binds dynamic tags to element settings, each write snapshotted so it is reversible.
date: "2026-07-28"
integration: elementor
order: 58
---

# Create Elementor popups and bind dynamic tags with your AI agent

Two of Elementor's most useful features are popups (a lead-capture modal, an
announcement, an exit-intent offer) and dynamic tags (settings that pull live
data like the post title, a custom field, or the site name). WP MCP now gives
your AI agent both, snapshotted so every change is reversible.

## What you need

- WP MCP installed and connected to your AI client, with its Pro tier active.
- Elementor active. Popups are `elementor_library` posts. Dynamic tags are
  mostly provided by Elementor Pro, so the tag list is short or empty without
  it, and `list-dynamic-tags` reports what your site actually has.

## Build a popup

```
› Create a popup called "Newsletter" and show it 5 seconds after page load.
```

`create-popup` makes the popup template, and `set-popup-settings` sets its
open/close triggers and timing. The settings merge into the popup, so you can
adjust the trigger later without rebuilding it, and each change is snapshotted.

## Bind a dynamic tag

```
› What dynamic tags are available on this site?
› Make the heading on /blog pull the current post title dynamically.
```

`list-dynamic-tags` reports the registered tags with their groups.
`set-dynamic-tag` binds one to a specific element setting, writing it in
Elementor's own `[elementor-tag ...]` format under the element's dynamic
settings, and it preserves any other dynamic bindings already on that element.

## Why it is safe

Popup settings and dynamic bindings are stored as post meta, captured by WP
MCP's snapshot before every write, so a trigger tweak or a tag binding is one
click from undone with `rollback-operation`. Dynamic bindings are written
exactly as Elementor stores them, so they resolve correctly when the tag's
source (a field, the post, the author) is available.
