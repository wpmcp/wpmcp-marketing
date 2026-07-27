---
title: Read your Modern Events Calendar events with an AI agent
description: Have Claude or Cursor list upcoming Modern Events Calendar events and read their schedules through WP MCP, with clean named fields instead of raw meta keys.
date: "2026-07-27"
integration: modern-events-calendar
order: 70
---

# Read your Modern Events Calendar events with an AI agent

WP MCP gives an AI agent a curated read view of your **Modern Events Calendar**
events: list what's coming up, and read any event's full schedule without
needing to know MEC's `mec_*` meta-key names.

## What you need

- WP MCP installed and connected to your AI client.
- Modern Events Calendar active (the free version is enough). WP MCP registers
  the `mec-read` ability when the `mec-events` post type is present.

## List what's on

```
› What events are coming up, and when?
› List the events in August with their dates.
```

The agent calls `mec-read` with `list-events` and gets each event's id, title,
status, and start/end date, newest first.

## Read a schedule

```
› Read the Launch Party event, tell me its start and end time, whether it's
  all-day, and its location.
```

`get-event` returns a curated schedule: `start_date`, `end_date`,
`start_time`, `end_time`, `all_day`, `location_id`, `organizer_id`, and `cost`,
resolved from MEC's meta so the agent works with named fields.

## Creating and editing events

The `mec-read` surface is read-only, but MEC events are an ordinary custom post
type, so an agent can create and edit them through WP MCP's general
[content tools](/docs.html):

```
› Create a new event titled "Autumn Fair" as a draft.
```

That runs `create-post` with `post_type: mec-events`, and, like every WP MCP
write, it is snapshotted first so you can roll it back in one click. Set the
`mec_*` schedule meta the same way, through the content tools, and the event
shows up in the curated `get-event` read.
