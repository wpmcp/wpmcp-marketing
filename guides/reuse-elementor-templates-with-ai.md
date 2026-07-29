---
title: Save, apply, and move Elementor templates with your AI agent
description: WP MCP exports a page to portable JSON, saves it as an Elementor library template, and applies templates to other pages with regenerated ids, snapshotted so every apply is reversible.
date: "2026-07-28"
integration: elementor
order: 52
---

# Save, apply, and move Elementor templates with your AI agent

Elementor's template library lets you reuse a section, a header, or a whole
page layout across your site. WP MCP now gives your AI agent that library:
export a page to portable JSON, save a page as a template, apply a template to
another page, and import a design from JSON. Every apply is snapshotted, so a
layout you drop onto a page is one click from undone.

## What you need

- WP MCP installed and connected to your AI client, with its Pro tier active.
- Elementor active. Templates are stored as ordinary `elementor_library` posts.

## Save a page as a reusable template

```
› Save the current /about layout as a section template called "Team block".
```

`save-as-template` copies the page's element tree into a new library template
of the type you choose (section, header, footer, single, archive, popup, and
more). Because a template is a normal post, you can remove it later with the
standard content tools.

## Apply a template to another page

```
› Add the "Team block" template under the hero on /services.
› Replace the whole /landing page with the "Campaign" template.
```

`apply-template` reads the target page first (with an expected hash, so a
concurrent edit is refused rather than clobbered), then copies the template in
with **freshly regenerated element ids** so nothing collides with what is
already on the page. Append it under a specific container, or use replace mode
to swap the whole page. The write is snapshotted, so undo it per change or per
session with `rollback-operation`.

## Export and import across pages or sites

```
› Export /pricing as JSON so I can reuse it.
› Import this exported layout as a template called "Pricing v2".
```

`export-page` returns a portable envelope: the content tree, the page settings,
and the Elementor version. Hand that envelope to `import-template` and WP MCP
builds a new library template from it, so a design moves cleanly between pages,
or between two sites running WP MCP.

## Why it is safe

Applying a template is the only one of these that changes an existing page, and
it goes through the same snapshot-first path as every other Elementor edit:
`_elementor_data` is ordinary post meta, captured before the write, so a
template you apply is always reversible.
