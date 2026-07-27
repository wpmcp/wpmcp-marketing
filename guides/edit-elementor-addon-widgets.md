---
title: Edit Elementor addon widgets (Essential Addons, UAE, Unlimited Elements)
description: WP MCP's Elementor tools insert and edit any registered widget through a tested raw-settings escape hatch, so third-party addon widgets are handled like core ones.
date: "2026-07-27"
integration: elementor-addons
order: 60
---

# Edit Elementor addon widgets with your AI agent

If your Elementor site uses an addon pack, **Essential Addons**, **Ultimate
Addons (UAE)**, or **Unlimited Elements**, WP MCP already handles their widgets.
The Elementor deep-editing tools work on any registered widget, so an agent can
read, insert, and update addon widgets with no addon-specific integration, and
every write is snapshotted first.

## Two kinds of widget, one toolset

- **Cataloged core widgets** (a curated 44-widget catalog) take typed,
  validated params, so the agent gets guardrails.
- **Every other registered widget**, including all addon-pack widgets, inserts
  through a **raw settings escape hatch** on `add-widget` and reads back through
  `get-elementor-data`. This path is covered by a regression test that inserts a
  non-cataloged registered widget with raw settings.

## Read what's on the page

```
› Read the element tree on /home and tell me which Essential Addons or UAE
  widgets it uses.
```

`get-elementor-data` returns the full parsed tree with every element's type,
id, and settings, addon widgets included.

## Insert and update

```
› Add an Essential Addons widget of this type under the hero, with these
  settings.
› Change the settings on the UAE widget with element id abc123.
```

For an addon widget, pass its `widget_type` and a raw `settings` object to
`add-widget` (or `update-widget`). WP MCP writes it into `_elementor_data`,
which is ordinary post meta, so the change is snapshotted and one click from
undone.

## Why no dedicated integration

Addon packs register standard Elementor widgets. Because `add-widget`'s
escape hatch accepts any registered widget and `get-elementor-data` reads the
whole tree, there is nothing addon-specific to build. Curated typed params are
reserved for the core catalog; addon widgets use raw settings, validated by
Elementor itself when the page renders.
