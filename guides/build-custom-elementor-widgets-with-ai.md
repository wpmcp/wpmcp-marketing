---
title: Build custom Elementor widgets with your AI agent
description: WP MCP builds custom Elementor widgets from a data spec (controls plus an HTML template), rendered safely at runtime with no code generation and no eval.
date: "2026-07-30"
integration: elementor
order: 62
---

# Build custom Elementor widgets with your AI agent

Need a reusable widget that Elementor does not ship, a testimonial card, a
pricing row, a branded call-to-action? WP MCP lets your AI agent build one from
a description, and it does so safely: a widget is a data spec, never generated
PHP.

## What you need

- WP MCP installed and connected to your AI client, with its Pro tier active.
- Elementor active. Custom widgets appear in the editor like any other.

## How a custom widget is defined

A widget is a spec with three parts:

- **Controls**, the fields you edit in Elementor (text, rich text, URL, image,
  icon, color, and more). Ask `list-control-types` for the full list.
- **A template**, HTML with `{{control_name}}` placeholders.
- **Metadata**, a title, an icon, and search keywords.

```
› Build a testimonial widget with a quote (rich text), an author name, and an
  avatar image, laid out as a card.
```

`create-custom-widget` validates the spec, stores it, and registers it as a
real Elementor widget. `validate-widget-spec` checks a spec first without
storing it.

## Safe by design: no code generation, no eval

This is where WP MCP differs from other tools. A custom widget is **interpreted
data, not generated code**. A single dynamic widget renders every spec by
substituting your control values into the template, escaping each value by its
control type: plain text is escaped, rich text is filtered with `wp_kses_post`,
and URLs are passed through `esc_url`. There is no `eval` anywhere in the
feature, so a stored widget can never execute arbitrary code.

## Manage your widgets

```
› List my custom widgets.
› Change the testimonial widget's default quote.
› Disable the old promo widget for now.
```

`list-custom-widgets`, `update-custom-widget`, `set-widget-status`, and
`delete-custom-widget` manage the set. Widgets are stored as ordinary posts, so
disabling or deleting one is reversible.
