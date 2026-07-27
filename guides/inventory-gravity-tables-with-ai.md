---
title: Inventory your Gravity Tables with an AI agent
description: Have Claude or Cursor list the data tables you publish from Gravity Forms, read their configuration, and follow them through to the underlying entries, read-only.
date: "2026-07-27"
integration: gravity-tables
order: 30
---

# Inventory your Gravity Tables with an AI agent

If you use **Gravity Tables** (Advanced Data Tables for Gravity Forms) to
publish tables from your form entries, WP MCP now lets an AI agent read those
table definitions, and, because the Gravity Forms integration is there too,
follow a table straight through to the form and entries behind it.

This is **read-only**: tables are built and edited in the Gravity Tables
builder, and the agent reads their configuration rather than changing it.

## What you need

- WP MCP installed and connected to your AI client.
- Gravity Tables active (it registers the `gravitytables-read` ability when its
  own database table is present).
- Gravity Forms active too, if you want the agent to read the entries a table
  is built from.

## List what you publish

```
› List the data tables on this site, and tell me which Gravity Forms form each
  one is built from.
```

The agent calls `gravitytables-read` with `list-tables` and returns each active
table's title, linked `form_id`, and shortcode.

## Read a table's configuration

```
› Read the configuration for the Sellers table. Which columns does it show, and
  which are sortable or filterable?
```

It calls `get-table`, which returns the decoded settings: the selected fields,
their labels, and which columns are editable, sortable, and filterable.

## Follow a table to its data

Because the [Gravity Forms integration](/integrations/gravity-forms.html) is
available in the same session, you can go one step further:

```
› The Sellers table is built from form 5. Show me the last 10 entries on that
  form and check they line up with the table's columns.
```

The agent reads the table config, then reads the form's entries through
`gravityforms-read`, and reconciles the two. All read-only, so it is safe to
let it explore.

## What is next

Building and editing tables through MCP is deferred until it can be done with
one-click rollback. For now this gives an agent a complete read picture: the
tables you publish, how they are configured, and the form data underneath them.
