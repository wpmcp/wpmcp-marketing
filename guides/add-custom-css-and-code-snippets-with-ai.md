---
title: Add custom CSS and code snippets with your AI agent
description: WP MCP writes site-wide custom CSS through WordPress core Additional CSS (no Elementor Pro needed) and manages Elementor Custom Code snippets, snapshotted so changes are reversible.
date: "2026-07-28"
integration: elementor
order: 60
---

# Add custom CSS and code snippets with your AI agent

Sometimes the fastest fix is a few lines of CSS, or a tracking snippet in the
head. WP MCP gives your AI agent both, and the CSS path works on any site, not
just Elementor Pro.

## What you need

- WP MCP installed and connected to your AI client, with its Pro tier active.
- For custom CSS: nothing else. It uses WordPress core Additional CSS, so it
  works on every site.
- For code snippets: Elementor Pro's Custom Code renders them. WP MCP stores
  and manages them on any site, and they run once Pro is active.

## Add site-wide CSS

```
› Add CSS to make all H2 headings dark blue.
› Replace the custom CSS with this block instead.
```

`add-custom-css` appends to your site's Additional CSS by default, or replaces
it with `replace: true`. Because it writes through WordPress core, the CSS
applies site-wide regardless of your builder, and the change is snapshotted, so
`get-custom-css` shows you the current state and any edit is reversible.

## Manage code snippets

```
› Add a snippet that prints my analytics tag in the head.
› List all my code snippets.
› Delete the old chat-widget snippet.
```

`create-code-snippet` stores an Elementor Custom Code snippet with its location
(`wp_head`, `wp_body_open`, or `wp_footer`) and priority. `list-code-snippets`
shows what you have, and `delete-code-snippet` trashes one reversibly.

## Why it is safe

Custom CSS is captured by WP MCP's snapshot before every write, so a styling
change is one click from undone. Code snippets are ordinary posts, created and
trashed reversibly, so nothing you add is permanent unless you want it to be.
