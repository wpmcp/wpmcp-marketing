---
title: Read Gravity Forms submissions with your AI agent
description: Connect Claude or Cursor to WP MCP and have it list forms, read fields, and triage Gravity Forms entries, read-only and safe.
date: "2026-07-27"
integration: gravity-forms
order: 10
---

# Read Gravity Forms submissions with your AI agent

This guide shows how to point an AI agent at your Gravity Forms data through WP
MCP. When you are done, you can ask your agent things like "how many Contact
entries came in this week, and what are the common themes?" and it will read the
real submissions and answer.

The Gravity Forms integration is **read-only** today, so nothing here can change
or delete a form or an entry. It is a safe first step.

## What you need

- WordPress with WP MCP installed and connected to your AI client (see the
  [WordPress MCP plugin guide](/wordpress-mcp-plugin.html) if you have not done
  that yet).
- Gravity Forms active on the same site. Any Gravity Forms license level works;
  the integration uses the standard GFAPI.

When Gravity Forms is active, WP MCP registers a `gravityforms-read` ability. If
Gravity Forms is not active, the ability still lists itself but reports the
integration as unavailable, so nothing breaks.

## Step 1: Confirm the integration is live

Ask your agent to list the operations it can run against Gravity Forms:

```
› List the Gravity Forms read operations available through WP MCP.
```

It calls `gravityforms-read` with the reserved `list-operations` and gets back
the catalog: `list-forms`, `get-form`, `list-entries`, `get-entry`, `get-notes`.

## Step 2: Find your forms

```
› List my Gravity Forms forms with their entry counts.
```

The agent runs `list-forms` and returns each form's id, title, active state,
field count, and entry count. Note the id of the form you care about.

## Step 3: Read the entries

```
› Show me the last 10 entries on form 1, and summarize what people asked for.
```

The agent pages through `list-entries` (newest first, with an optional
`active` / `spam` / `trash` status filter), reads individual submissions with
`get-entry` when it needs full detail, and writes you a summary. Because every
call is read-only, you can let it explore freely.

## Step 4: Triage

A useful pattern once it is connected:

```
› Go through the Contact form entries from the last week, group them by topic,
  and flag anything that reads as urgent or upset.
```

The agent reads the entries and their notes and hands you a triaged list. It
cannot mark, move, or delete entries yet; that lands when it can be done with
one-click rollback.

## What is next

Entry management (status changes, notes) is deferred until WP MCP can snapshot
Gravity Forms entries for reversibility. Until then, pair this read access with
WP MCP's [content tools](/docs.html) so the agent can, for example, read form
submissions and draft a follow-up post, every write to your content
snapshotted first.
