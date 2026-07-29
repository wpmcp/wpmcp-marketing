---
title: Build Elementor headers, footers, and archives with your AI agent
description: WP MCP creates Elementor theme-builder templates and sets their display conditions, so an agent can build a header, footer, single, or archive template and control where it renders.
date: "2026-07-28"
integration: elementor
order: 54
---

# Build Elementor theme parts with your AI agent

Elementor's theme builder is where you design the parts that wrap your content:
the site header, the footer, the single-post layout, the archive layout, the
404 page. WP MCP now gives your AI agent those templates and, just as important,
the display conditions that decide where each one renders.

## What you need

- WP MCP installed and connected to your AI client, with its Pro tier active.
- Elementor active. Theme templates are `elementor_library` posts. Display
  conditions apply through Elementor Pro's conditions manager when it is
  installed, and are stored in the same place either way.

## Create a theme template

```
› Create an Elementor header template called "Main header".
› Create a single-post template called "Blog single".
```

`create-theme-template` makes a library template of the location you name:
`header`, `footer`, `single`, `archive`, `loop-item`, `search-results`, or
`error-404`. You can seed it with elements up front or build it out afterward
with the widget and container tools.

## Set where it renders

```
› Make "Main header" the global header for the whole site.
› Apply "Blog single" only to posts, not pages.
```

`set-template-conditions` writes the display rules Elementor uses, given as
readable parts (`["include","singular","post"]`) or slash strings
(`include/general`, `exclude/singular/page`). The conditions are snapshotted
before the write, so a targeting change is one click from undone.

## Review and clean up

```
› List all my theme templates and where each one shows.
› Trash the old "Legacy footer" template.
```

`list-theme-templates` and `get-theme-template` report each template's type and
conditions, and `delete-theme-template` trashes one reversibly through the
WordPress trash.

## Why it is safe

Theme templates are ordinary posts and their conditions live in post meta, so
every conditions change is captured by WP MCP's snapshot and reversible with
`rollback-operation`. You can retarget a site-wide header without fear of losing
the previous rule.
