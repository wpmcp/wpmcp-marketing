---
title: Bulk-edit SEOPress metadata with your AI agent
description: Have Claude or Cursor rewrite titles, descriptions, canonicals, and robots flags across your site through SEOPress, every change snapshotted and one click from undone.
date: "2026-07-27"
integration: seopress
order: 50
---

# Bulk-edit SEOPress metadata with your AI agent

WP MCP writes SEO metadata through **SEOPress**'s own fields, so an AI agent can
do the tedious metadata work across your whole site, and every write is
snapshotted first, so a bulk pass that goes wrong is one click from restored.
SEOPress is the third SEO plugin the same tools support, after Yoast and Rank
Math, so nothing here is SEOPress-specific to learn.

## What you need

- WP MCP installed and connected to your AI client.
- SEOPress active. WP MCP detects it and routes the `get-seo-meta` /
  `update-seo-meta` tools to SEOPress's postmeta fields automatically.

## Read before you write

```
› What is the current meta title and description on the Pricing page, and is it
  set to noindex?
```

The agent calls `get-seo-meta`, which returns the neutral field set (title,
description, focus keyword, canonical, and normalized noindex/nofollow
booleans) read from SEOPress's own fields.

## Do a bulk pass

```
› Rewrite the meta descriptions across the blog to be under 155 characters and
  action-oriented. Keep the titles.
```

The agent works through the posts calling `update-seo-meta`, which writes
SEOPress's `_seopress_titles_*` and `_seopress_robots_*` fields (encoding
noindex/nofollow the way SEOPress expects). Every write is snapshotted and
grouped into one session.

## Undo if it goes wrong

```
› That noindex change went too wide. Roll back the last SEO session.
```

`rollback-session` restores every post touched in the run to its prior
metadata in one call. You can also restore a single post with
`rollback-operation`.

## Switching plugins later

If you migrate from SEOPress to Yoast or Rank Math (or the reverse), the same
prompts keep working: WP MCP detects whichever SEO plugin is active and writes
that plugin's fields. Your agent workflow does not change.
