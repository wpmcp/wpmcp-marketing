---
title: Manage directory listings with an AI agent
description: Directory listings are custom post types, so WP MCP's content tools let an agent list, read, create, and edit them, snapshotted, with no plugin-specific setup.
date: "2026-07-27"
integration: directories
order: 100
---

# Manage directory listings with an AI agent

If your site runs the **Directories** plugin, WP MCP already lets an AI agent
work with your listings. Directories registers each content type ("bundle") as
a WordPress custom post type, and WP MCP's content tools operate on any post
type, so listings are handled like any other content, with every write
snapshotted first.

## What you need

- WP MCP installed and connected to your AI client.
- Directories active. Its content types show up through `list-post-types`.

## Find your directory types and listings

```
› What directory content types does this site have?
› List the newest 20 listings in the business directory.
```

`list-post-types` surfaces the directory bundles as post types, and
`list-posts` (with that `post_type`) lists their entries.

## Read, create, and edit listings

```
› Read the "Acme Bakery" listing and its details.
› Create a draft listing titled "Riverside Cafe" with this description and phone
  number.
› Update the hours on the Acme Bakery listing.
```

`get-post` reads a listing (including its non-protected custom fields);
`create-post` and `update-post` add and edit listings, each snapshotted so you
can roll back from wp-admin or by asking the agent. This core coverage is
verified by a regression test that drives an arbitrary custom post type through
list, read, create, and update.

## Honest scope

Directories keeps some structured field data in its own `drts_` tables beyond
standard postmeta. Standard listing content and fields are covered through the
content tools today; a curated reader for the plugin's extended field storage
is future work, and we will not claim it until it ships. What works now is real
listing management, snapshotted and reversible.
