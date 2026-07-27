---
title: Read your Paid Memberships Pro levels with an AI agent
description: Have Claude or Cursor list your PMPro membership levels, their pricing, and active member counts through WP MCP, no SQL required.
date: "2026-07-27"
integration: paid-memberships-pro
order: 90
---

# Read your Paid Memberships Pro levels with an AI agent

WP MCP gives an AI agent a read view of your **Paid Memberships Pro** setup:
list your membership levels with their pricing and billing, and see how many
active members each level has, all without touching the database by hand.

## What you need

- WP MCP installed and connected to your AI client.
- Paid Memberships Pro active. WP MCP registers the `pmpro-read` ability when
  PMPro's `pmpro_membership_levels` table is present.

## List your levels

```
› List the membership levels and how many active members each has.
```

The agent calls `pmpro-read` with `list-levels` and returns each level's id,
name, initial and recurring price, billing cycle, whether signups are open, and
its active member count (counted from PMPro's `pmpro_memberships_users` table,
active statuses only).

## Read one level in detail

```
› What does the Gold level cost, how often does it bill, and how many members
  are on it?
```

`get-level` returns that level's full configuration plus its active member
count.

## What it does and does not do

This is a read-only view of **levels and aggregate member counts**, not
individual member records. Levels and memberships are managed through PMPro's
own admin and its custom tables, which WP MCP does not snapshot, so it does not
write them. The tools are capability-gated like everything else in WP MCP, so
the agent only sees what the connected WordPress user is allowed to.
