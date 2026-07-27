---
title: Read your GiveWP donation forms with an AI agent
description: Have Claude or Cursor list your GiveWP donation forms and read their pricing, goals, and running totals through WP MCP, with clean named fields.
date: "2026-07-27"
integration: givewp
order: 80
---

# Read your GiveWP donation forms with an AI agent

WP MCP gives an AI agent a curated read view of your **GiveWP** donation forms:
list them with their running totals, and read any form's pricing, levels, and
goal, without needing to know Give's `_give_*` meta-key names.

## What you need

- WP MCP installed and connected to your AI client.
- GiveWP active. WP MCP registers the `give-read` ability when the `give_forms`
  post type is present.

## List your forms and their totals

```
› How much has each donation form raised so far?
› Which form has the most sales this year?
```

The agent calls `give-read` with `list-forms` and gets each form's id, title,
status, and running `earnings` and `sales`.

## Read a form's configuration

```
› Read the Annual Fund form: its set price, donation levels, and goal.
```

`get-form` returns a curated config: `price`, `price_option`,
`donation_levels`, `goal_option`, `goal`, `earnings`, and `sales`, resolved
from Give's `_give_*` meta (which the generic tools keep hidden as protected
meta) into clean named fields.

## Creating and editing forms

The `give-read` surface is read-only, and individual donation *records* are not
exposed yet (they live in Give's own tables). But donation *forms* are an
ordinary custom post type, so an agent can create and edit them through WP
MCP's general [content tools](/docs.html):

```
› Create a draft donation form titled "Winter Appeal".
```

That runs `create-post` with `post_type: give_forms`, snapshotted first like
every WP MCP write, and it shows up in the curated `list-forms` read.
