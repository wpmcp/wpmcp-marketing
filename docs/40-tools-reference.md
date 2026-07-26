---
title: Tools Reference
order: 40
---

# Tools Reference

WP MCP currently registers **188 abilities** in the canonical test environment: **163 free** and **25 Pro**. Every tool below is registered as a WordPress ability named `wpmcp/<tool-name>` via the official Abilities API, each with its own `permission_callback` (content tools require `edit_posts`; sensitive domains are gated by stronger capabilities).

Every mutating tool routes through `Safe_Mutation::run()`, so it is snapshotted before it runs and can be undone with `rollback-operation` or `rollback-session` — except the small set of deliberately risky operations that are disabled by default and honestly say so in their descriptions. See [The safety model](30-safety-model.md) for how the engine works.

_This page is generated from the plugin source and its ability manifest; the descriptions below are the exact ones the AI agent sees._

## Safety & history (3 tools)

- `list-operations`: List recent safety snapshot operations
- `rollback-operation`: Undo a single operation by restoring its pre-change snapshot
- `rollback-session`: Undo all operations from a session by restoring each object's pre-session snapshot

## Content & pages (13 tools)

- `create-post`: Create a post, page, or custom post type
- `delete-post`: Delete a post, page, or custom post type. Trash by default (reversible). force:true permanently deletes: that path is disabled by default (site must opt in via the wpmcp_enable_delete_post filter) and requires confirm:true. Force-delete is snapshotted so the record can be rolled back
- `get-page`: Read a page
- `get-post`: Read a single post, page, or custom post type
- `get-revision`: Read a single post revision's fields
- `list-post-types`: List registered post types (posts, pages, custom post types)
- `list-posts`: List/search posts, pages, or custom post types
- `list-revisions`: List a post's revisions (id, author, date, change excerpt)
- `list-taxonomies`: List registered taxonomies (categories, tags, custom taxonomies)
- `restore-revision`: Restore a post to a given revision
- `set-post-terms`: Assign taxonomy terms to a post (replace, append, or remove)
- `update-blocks`: Update a page's block content
- `update-post`: Partially update a post, page, or custom post type

## Gutenberg blocks (5 tools)

- `convert-html-to-blocks`: Convert raw HTML into valid Gutenberg block markup. Maps common top-level elements to core blocks (h1-h6 to core/heading, p to core/paragraph, img to core/image, ul/ol to core/list, blockquote to core/quote, pre/code to core/code, hr to core/separator, table to core/table); anything unrecognized is wrapped in a core/html block so no content is lost. A pure transform, not a database write: it never touches a post. To write the resulting markup to a post use the existing update-blocks tool
- `get-block-type`: Return full detail for a single registered block type by name: its attributes schema, declared supports, and block-context wiring (uses_context, provides_context). Read-only
- `list-block-types`: List the block types registered with WP_Block_Type_Registry: name, title, category, whether the block renders dynamically (is_dynamic), and its declared attribute names. Optional category (exact match) and/or search (substring match on block name) filters narrow the result. Read-only
- `parse-blocks`: Parse block markup into its block tree via parse_blocks(). Accepts either "blocks" (raw markup) or "id" (an existing post, parses its post_content). Each node reports blockName, attrs, recursively parsed innerBlocks, and an innerHTML summary. Read-only
- `serialize-blocks`: Serialize a block tree (as produced by parse-blocks, or any array shaped the same way) back into valid block markup via serialize_blocks(). A pure transform, not a database write: it never touches a post. To write the resulting markup to a post use the existing update-blocks tool

## Surgical block edits & patterns (7 tools)

- `add-block`: Surgically insert ONE block (given as "<!-- wp:... -->" delimited markup) into a post so it lands at "path" (array of zero-based indexes into the parse-blocks tree; the final segment may equal the sibling count to append; nested paths descend innerBlocks). Requires expected_hash (the content_hash from parse-blocks) and refuses stale reads. Snapshot-first; every other block stays byte-identical
- `duplicate-block`: Duplicate the block at "path" (deep copy, inserted immediately after the original within the same parent) and return the copy's new_path. Requires expected_hash (the content_hash from parse-blocks) and refuses stale reads. Snapshot-first
- `insert-pattern`: Insert a registered block pattern's parsed blocks into a post starting at "path" (same path semantics as add-block; pure-whitespace filler nodes are dropped). Requires expected_hash (the content_hash from parse-blocks) and refuses stale reads. Snapshot-first; every pre-existing block stays byte-identical
- `list-patterns`: List the block patterns registered with WP_Block_Patterns_Registry: name, title, description, and categories. Optional search (case-insensitive substring match on name or title) narrows the result. Pattern markup is inserted server-side by insert-pattern, so it is not returned here. Read-only
- `move-block`: Move the block at "from_path" to position "to_index" among its own siblings (same parent only; compose remove-block + add-block to move across parents). Requires expected_hash (the content_hash from parse-blocks) and refuses stale reads. Snapshot-first
- `remove-block`: Surgically remove ONE block by "path" (array of zero-based indexes into the parse-blocks tree, descending innerBlocks); nested removals keep the container wrapper intact. Requires expected_hash (the content_hash from parse-blocks) and refuses stale reads. Snapshot-first and fully restorable via rollback-operation
- `update-block`: Surgically update ONE block in place by "path" (array of zero-based indexes into the parse-blocks tree, descending innerBlocks): replace its attributes ("attrs", full replacement) and/or its inner HTML ("inner_html", leaf blocks only — target a container's children by their own paths). Requires expected_hash (the content_hash from parse-blocks) and refuses stale reads. Snapshot-first; every other block stays byte-identical

## Composite page builds (1 tool)

- `build-page`: Compose a complete page from ONE declarative spec: title, a recursive sections/blocks tree, media references (existing attachment ids), and optional menu placement. The whole composition is a single atomic, recoverable operation: the spec is strictly validated (node-path-addressed errors, bounded size/nodes/depth) before any write, a mid-build failure automatically removes everything it created, and on success one operation_id is returned whose rollback-operation removes the page and its menu placement entirely. Markup is composed deterministically from the spec; nothing in the spec is evaluated or executed. dialect "gutenberg" (default, free) builds block markup; dialect "elementor" (PRO, requires Elementor) builds an _elementor_data element tree

## Media library & stock images (11 tools, 1 Pro)

- `delete-media`: Delete a Media Library attachment. Disabled by default (site must opt in via the wpmcp_enable_delete_media filter) and requires confirm:true. force:true permanently deletes, routed through the safety snapshot so it can be rolled back
- `get-media`: Read full detail for a Media Library attachment: title, URL, every registered image size, dimensions, mime type, alt text, caption, and description
- `import-stock-image`: Sideload a stock search result into the Media Library. The fetch is SSRF-guarded: https-only, host allowlist checked before any request (wpmcp_remote_media_allowed_hosts filter), redirects refused, size caps enforced, and the bytes must verify as a real image. Attribution/license metadata is persisted on the attachment; rollback deletes the import
- `insert-stock-image` — **Pro**: Composite stock-image flow: run the same SSRF-guarded import as import-stock-image, then insert the image into the post's builder content as a Gutenberg image block. Returns two independently rollbackable operation ids (undo the insert, undo the import)
- `list-media`: List Media Library attachments with type ("image" or an exact mime like "image/png"), date-range (after/before), and search filters, paged newest first with a total/pages envelope
- `resize-media`: Regenerate the specified registered image sizes for an attachment from its original file and report each resulting file (name, dimensions, URL). Snapshot-first with a physical-file backup, so the operation is rollbackable
- `search-stock-images`: Search openly-licensed stock images. Providers: openverse (keyless, Creative Commons results), pexels and unsplash (bring-your-own key via set-stock-key). Results are provider-attributed with license, license_url, attribution, and source_url, ready to pass to import-stock-image
- `set-stock-key`: Store (or clear, by passing an empty api_key) a bring-your-own stock-provider API key for pexels or unsplash. Keys are encrypted at rest with a site-salt-derived key and are never echoed back
- `sideload-image`: Download an image from a URL and add it to the Media Library as a new attachment
- `update-media`: Update a Media Library attachment's title, alt text, caption, and/or description
- `upload-svg`: Add an SVG to the Media Library from raw markup or an allowlisted URL. Every SVG passes a bundled fail-closed sanitizer (script/foreignObject/event handlers/external references are rejected outright); only the sanitized markup is stored. Rollback deletes the upload

## Options & post meta (4 tools)

- `get-option`: Read a single wp_options value by name. Refuses a conservative denylist of sensitive/core option names (auth keys and salts, siteurl, home, active_plugins, and secret/password/token-shaped names)
- `get-post-meta`: Read a post's meta, either the full map or a single key. Protected meta (a leading underscore, or is_protected_meta) is always skipped
- `set-post-meta`: Set a single meta key/value on a post. Refuses protected meta keys (a leading underscore, or is_protected_meta). Snapshotted via object_type post; rollback-operation restores the prior value
- `update-option`: Update a single wp_options value by name. Refuses the same denylist as get-option, and is disabled by default until a site opts in with the wpmcp_enable_option_write filter. Snapshotted via object_type option; rollback-operation restores the prior value (or removes the option if it did not exist before)

## Site settings (2 tools)

- `get-settings`: Read WordPress site settings (general, reading, writing, discussion, media, permalinks), each with its group, type, and whether it is writable
- `update-settings`: Update WordPress site settings from a strict allowlist. Validates/coerces each value (enum, int range, bool), rejects unsafe permalink structures, skips read-only or non-allowlisted keys, and applies the valid subset even if some keys fail

## Users (4 tools)

- `create-user`: Create a new non-admin user. Auto-generates a strong password (never returned) and emails the new user so they can set their own. Rejects admin and unknown roles; defaults to subscriber
- `get-user`: Read one user's profile detail, including an is_admin flag derived from live capabilities. Never returns the password hash
- `list-users`: List WordPress users as safe summary rows (id, username, display name, email, roles, registration date). Never returns password hashes or other secrets
- `update-user`: Update a non-admin user's profile fields (display name, email, url, nickname, first/last name, description). Refuses admin-capable users. Never changes role or password. Snapshotted so the change can be rolled back

## Comments (5 tools)

- `delete-comment`: Permanently delete a comment. Disabled by default (site must opt in via the wpmcp_enable_delete_comment filter) and requires confirm:true. Routed through the safety snapshot so it can be rolled back, though the resurrected comment gets a new ID
- `edit-comment`: Edit a comment's content and/or author fields (name, email, url). Snapshotted so the change can be rolled back
- `get-comment`: Read one comment's detail (post, parent, author fields, content, status, date)
- `list-comments`: List comments as safe summary rows (id, post, author, content, status, date), optionally filtered by post and moderation status, with paging
- `moderate-comment`: Change a comment's moderation status: approve, unapprove, spam, trash or untrash. Snapshotted so the change can be rolled back

## Navigation menus (9 tools)

- `add-menu-item`: Add an item to a navigation menu (custom link by title and url, or an object link via type, object, object_id). Additive; a mistaken item can be removed with remove-menu-item
- `assign-menu-to-location`: Assign a navigation menu to a registered theme location. The assignment lives in the nav_menu_locations theme_mod, so this is snapshotted via object_type option and rollback-operation restores the prior assignment
- `create-menu`: Create a new navigation menu (a nav_menu term). Creation has no prior state to snapshot; a mistaken menu can be removed with delete-menu
- `delete-menu`: Delete a navigation menu (a nav_menu term). Disabled by default (site must opt in via the wpmcp_enable_delete_menu filter) and requires confirm:true. This is not automatically reversible: the menu name and its items are returned so it can be rebuilt manually
- `get-menu`: Read one navigation menu with its ordered items (id, title, url, type, parent, order)
- `list-menu-locations`: List the theme's registered menu locations and the menu (if any) assigned to each
- `list-menus`: List the site's navigation menus as safe summary rows (id, name, slug, item count)
- `remove-menu-item`: Remove an item from a navigation menu. The item is a post, so this is snapshotted via object_type post and rollback-operation resurrects it at its original id, re-attached to its menu
- `update-menu-item`: Update a navigation menu item's title, url, parent, or position. A menu item is a post, so this is snapshotted via object_type post and rollback-operation restores the prior values exactly

## Plugins & themes (13 tools)

- `activate-plugin`: Activate an installed plugin. Snapshots the prior active_plugins option so it can be rolled back
- `deactivate-plugin`: Deactivate a plugin. Refuses protected packages (wpmcp, Elementor). Snapshots the prior active_plugins option so it can be rolled back
- `delete-plugin`: Permanently delete an installed plugin's files. Disabled by default (wpmcp_enable_delete_plugin filter) and requires confirm:true. Refuses protected or active plugins. Not rollback-able
- `delete-theme`: Permanently delete an installed theme's files. Disabled by default (wpmcp_enable_delete_theme filter) and requires confirm:true. Refuses the active theme (or its active parent). Not rollback-able
- `get-plugin-info`: Fetch full wordpress.org plugin directory info for a slug: version, rating, installs, homepage, download link, and compatibility
- `install-plugin`: Install a plugin from wordpress.org by slug, optionally activating it. Additive only; nothing to roll back
- `install-theme`: Install a theme from wordpress.org by slug, optionally activating it. Additive only; nothing to roll back
- `list-plugins`: List installed plugins with active status, protected-package flag, and pending update info
- `list-themes`: List installed themes with active status, parent theme, and pending update info
- `search-plugins`: Search the wordpress.org plugin directory by keyword, with optional tag/author filters and a capped per_page
- `switch-theme`: Activate (switch to) an installed theme. Snapshots the prior template/stylesheet options so it can be rolled back
- `update-plugin`: Update an installed plugin to the latest wordpress.org version. Disabled by default (wpmcp_enable_update_plugin filter) and requires confirm:true. File changes are not rollback-able
- `update-theme`: Update an installed theme to the latest wordpress.org version. Disabled by default (wpmcp_enable_update_theme filter) and requires confirm:true. File changes are not rollback-able

## WooCommerce (11 tools)

- `add-order-note`: Add an internal or customer-facing note to a WooCommerce order. Additive only; nothing to roll back
- `create-product`: Create a simple WooCommerce product via the CRUD layer. Creation has no prior state to snapshot; a mistaken product can be removed with delete-product
- `delete-product`: Delete a WooCommerce product (trash by default, force for permanent). Disabled by default (site must opt in via the wpmcp_enable_delete_product filter) and requires confirm:true. Snapshotted so it can be rolled back: force-delete resurrects the product at its original id with its price, stock, and terms
- `get-order`: Read full detail for one WooCommerce order (status, billing email, payment method, line items, customer note). HPOS- and CPT-safe
- `get-product`: Read full detail for one WooCommerce product (prices, stock, description, categories, tags)
- `get-sales-report`: Read-only sales summary over a date range: order count, gross sales, items sold, and top products by quantity. Aggregated over wc_get_orders() (HPOS- and CPT-safe)
- `list-orders`: List WooCommerce orders as safe summary rows (id, number, status, total, currency, date), filterable by status and customer, with paging. HPOS- and CPT-safe
- `list-product-categories`: List WooCommerce product categories (the product_cat taxonomy) as summary rows (id, name, slug, parent, count)
- `list-products`: List WooCommerce products as safe summary rows (id, name, sku, price, stock status), filterable by search, status, type, or category, with paging
- `update-order-status`: Change a WooCommerce order's status, validated against the store's registered statuses. Snapshotted via the wc_order object type so rollback-operation restores the prior status exactly. HPOS- and CPT-safe
- `update-product`: Update a WooCommerce product's fields (price, stock, description, etc.). A product is a post, so this is snapshotted via object_type post and rollback-operation restores the prior price and stock exactly

## SEO metadata (Yoast SEO / Rank Math) (3 tools)

- `get-seo-meta`: Read a post's SEO title, meta description, focus keyword, canonical URL, and robots flags (noindex/nofollow) via the active SEO plugin's postmeta keys
- `get-seo-status`: Report which SEO plugin (Yoast SEO or Rank Math) is active on this site, by name and version
- `update-seo-meta`: Set a post's SEO title, meta description, focus keyword, canonical URL, and/or robots flags (noindex/nofollow) via the active SEO plugin's postmeta keys. A field value is ordinary postmeta, so this is snapshotted via object_type post and rollback-operation restores the prior values exactly

## Internal linking (3 tools)

- `find-orphan-posts`: List published posts or pages that have zero incoming internal links (orphans), by scanning the most-recent posts for links that resolve to this site's own content
- `get-link-map`: Summarize the internal-link graph: per-post outgoing and incoming link counts, the orphan list, and the most-linked posts
- `suggest-internal-links`: Suggest related published posts a given post should link to, ranked by shared categories/tags and title keyword overlap, excluding posts it already links to

## Content analysis (accessibility, SEO, contrast) (4 tools, 4 Pro)

- `analyze-accessibility` — **Pro**: Scan a post's stored HTML for common WCAG issues (images missing alt text, heading order jumps, empty or non-descriptive link text, and form controls without labels) and return scored findings with the offending element locations. Read-only
- `analyze-seo` — **Pro**: Score a post's on-page SEO (0-100) with severity-tagged findings: title and meta-description length, H1 and heading structure, word count, image alt coverage, internal/external link counts, focus-keyword density, and a Flesch reading-ease readability score. Read-only
- `check-contrast` — **Pro**: Compute the WCAG contrast ratio between a foreground and background hex color and report AA/AAA pass/fail for normal and large text. Read-only
- `extract-content` — **Pro**: Extract a post's readable plain text and a structural summary (headings, word count, link and image counts) from its stored content. Read-only

## Elementor catalog (free) (2 tools)

- `get-widget-schema`: Return the settings schema for one Elementor widget type: the curated typed params (defaults, enums, responsive hints, required plugin) for cataloged widgets by default, or the full introspected control stack with full:true (also the fallback for non-cataloged widgets). Read-only
- `list-widgets`: List Elementor registered widget types (name, title, categories, icon, tier, availability), annotated from the curated widget catalog (purpose line, cataloged flag). Filter by tier (free/pro), category, or a case-insensitive search over name/title/catalog keywords. Read-only

## Elementor deep editing (7 tools, 7 Pro)

- `add-widget` — **Pro**: Add a widget to a page's _elementor_data under parent_id (or top level) at an optional position. Any cataloged widget_type (see list-widgets) takes typed params, validated against the curated schema before anything is written; non-cataloged registered widgets take raw settings. Requires expected_hash from get-elementor-data. Undoable via rollback-operation
- `generate-widget` — **Pro**: Generate a widget element of any cataloged type from the curated settings schema (see list-widgets / get-widget-schema) and insert it into a page's _elementor_data, as a child of parent_id or at the top level when parent_id is omitted, with a deterministic seedable element id. Unknown types and invalid or missing required settings are rejected before anything is written. Undoable via rollback-operation
- `get-elementor-data` — **Pro**: Return a page's parsed Elementor element tree (id, elType, widgetType, settings, and nested elements for every node), read directly from its _elementor_data postmeta. Read-only
- `move-element` — **Pro**: Reparent an element by id: remove it from its current location and append it as a child of a new parent element in the page's _elementor_data. Refuses moves into the element itself or one of its own descendants. Undoable via rollback-operation since _elementor_data is ordinary postmeta captured by the existing post snapshot
- `remove-element` — **Pro**: Remove an element (and its children) from a page's _elementor_data by id. Undoable via rollback-operation since _elementor_data is ordinary postmeta captured by the existing post snapshot
- `update-element` — **Pro**: Update an Elementor element's settings by id, merging the given settings into its existing settings. Reads and writes the page's _elementor_data; undoable via rollback-operation since _elementor_data is ordinary postmeta captured by the existing post snapshot
- `update-widget` — **Pro**: Patch a cataloged widget's settings by element id from typed curated params (same schema add-widget uses; see get-widget-schema), validated and merged into the existing settings. Non-cataloged widgets are refused toward update-element. Requires expected_hash from get-elementor-data. Undoable via rollback-operation

## Elementor structural suite (8 tools, 8 Pro)

- `add-container` — **Pro**: Create an Elementor layout element (container by default, or section/column) at the top level or nested under parent_id, at an optional position among its siblings. Columns require a parent; widgets are never valid parents. Requires expected_hash from get-elementor-data (stale reads are refused with no partial write). Undoable via rollback-operation
- `batch-update` — **Pro**: Apply N Elementor element settings updates atomically under ONE snapshot: every {element_id, settings} entry is validated before anything is written, one unknown id refuses the whole batch, and any failure rolls the entire batch back. Requires expected_hash from get-elementor-data. Undoable as a single rollback-operation
- `duplicate-element` — **Pro**: Deep-copy an Elementor element (and its whole subtree) with recursively regenerated ids, inserted immediately after the original among its siblings. Fresh ids use Elementor's 7-char hex format and are checked against every id on the page, so the builder opens the result without warnings. Requires expected_hash from get-elementor-data. Undoable via rollback-operation
- `find-element` — **Pro**: Search a page's Elementor element tree by el_type, widget_type, setting_key + setting_value, and/or css_class token (criteria AND-combined; at least one required). Each match reports element_id, types, navigator label, and ancestor id path; the response carries the current data_hash so a structural mutation can be chained without a second read. Read-only
- `reorder-elements` — **Pro**: Reorder the children of one Elementor parent element (or the top level when parent_id is omitted) to an explicit id order. The order must be an exact permutation of the current children; anything else is refused before any write. Requires expected_hash from get-elementor-data. Undoable via rollback-operation
- `set-element-label` — **Pro**: Set an Elementor element's navigator label (stored as the _title setting); an empty label clears the custom name. All other settings survive untouched. Requires expected_hash from get-elementor-data. Undoable via rollback-operation
- `update-container` — **Pro**: Merge settings non-destructively into an Elementor layout element (container, section, or column) by id: given keys are overwritten or added, all other settings survive. Widgets are refused (use update-element). Requires expected_hash from get-elementor-data. Undoable via rollback-operation
- `update-page-settings` — **Pro**: Merge settings non-destructively into a page's Elementor page settings (_elementor_page_settings): given keys are overwritten or added, all other settings survive. Post field keys (post_title, post_status, template, ...) are refused — use the post tools. Requires expected_hash = the settings_hash from get-elementor-data. Undoable via rollback-operation

## Bricks & Divi builders (3 tools, 3 Pro)

- `detect-builder` — **Pro**: Detect which page builder authored a post (elementor / bricks / divi / gutenberg / classic), by inspecting plain postmeta/post_content markers: Elementor's _elementor_edit_mode, Bricks' _bricks_page_content_2, Divi's _et_pb_use_builder, or Gutenberg block comments in post_content, falling back to classic. Read-only
- `get-builder-content` — **Pro**: Return the raw builder structure for a post: for Bricks, the decoded _bricks_page_content_2 postmeta JSON; for Divi, the post_content shortcode string plus the use-builder flag. Returns a WP_Error for posts detected as elementor, gutenberg, or classic. Read-only
- `update-builder-content` — **Pro**: Replace the builder structure for a post. Bricks: validates the given string is well-formed JSON decoding to an array, then writes _bricks_page_content_2. Divi: validates the given content is a string, then writes post_content and ensures _et_pb_use_builder is on. Undoable via rollback-operation since both are ordinary postmeta/post_content captured by the existing post snapshot

## Theme structure (sidebars, shortcodes) (4 tools)

- `list-shortcodes`: List the shortcode tags registered in the global $shortcode_tags array: tag name and a short description of the registered callback where resolvable. Optional search (substring match on tag name) narrows the result. Read-only
- `list-sidebar-widgets`: List the widgets assigned to a single sidebar (by sidebar_id): widget id and display name, from wp_get_sidebars_widgets() resolved against the registered widgets. Read-only
- `list-sidebars`: List the sidebars/widget areas registered via register_sidebar(): id, name, description. Read-only
- `render-shortcode`: Render a shortcode string (e.g. "[gallery ids=\"1,2\"]") via do_shortcode() and return the resulting HTML. Only invokes tags already present in the registered shortcode registry; input must contain an opening "[" or it is refused

## Content export & import (3 tools)

- `export-content`: Generate a WordPress eXtended RSS (WXR) export of site content via the native WordPress exporter (export_wp()). Optional content (post type: all/post/page/attachment/a custom post type), author, start_date, end_date, and status narrow what is included. Writes the XML to a protected directory under uploads and returns the file path, size, and item count. Read-only: does not mutate the site. WordPress's own export_wp() can only be safely called once per PHP process (a core limitation, not specific to this tool), so a second call in the same long-lived process is refused with a clear message rather than fataling
- `import-content`: Import a WordPress eXtended RSS (WXR) file, creating posts via wp_insert_post() (title, content, status, post_type, postmeta). Disabled by default (site must opt in via the wpmcp_enable_import filter) and always requires confirm:true. Content creation at scale has no single object_type/object_id to snapshot, so this honestly reports recoverable:false; every created post id is returned in created_post_ids so a caller can follow up with delete-post for each one. Uses a lightweight built-in WXR parser, not the WordPress Importer plugin
- `list-exports`: List the WXR export files previously generated by export-content: file name, size in bytes, and created timestamp for each. Read-only

## Async backups (4 tools)

- `cancel-backup-job`: Cancel a queued backup job: unschedule its WP-Cron event and mark it canceled. Refuses with an error if the job is no longer queued (already running or in a terminal status) or unknown
- `get-backup-status`: Return a backup job's current record (status: queued/running/completed/failed/canceled, result artifact reference or error, timestamps) by job id. Read-only
- `list-backup-jobs`: List backup jobs, newest first, with an optional status filter (queued/running/completed/failed/canceled). Read-only
- `trigger-backup`: Queue an asynchronous backup job and schedule a WP-Cron event that produces the backup artifact (a WXR export via export-content) and flips the job's status to completed or failed. Returns the job id immediately, before the backup itself has run, so a large-site backup does not have to complete within a single request

## Database (6 tools)

- `delete-rows`: Delete rows matching a mandatory equality WHERE via $wpdb->delete() (parameterized). Requires confirm:true. Refuses protected tables. Disabled by default (wpmcp_enable_db_writes filter). Snapshot-backed and restorable via rollback-operation (rows reinserted with their original primary-key ids) when the table has a primary key and the WHERE stays under the before-image cap; otherwise reports recoverable:false with a reason and logs the before-image to the write audit log
- `describe-table`: Return the columns, types, and keys of a database table
- `insert-row`: Insert a row into a table via $wpdb->insert() (parameterized). Refuses protected tables. Disabled by default (wpmcp_enable_db_writes filter)
- `list-tables`: List database tables with estimated row counts and sizes
- `query`: Run a read-only SQL query (SELECT/SHOW/DESCRIBE/EXPLAIN/WITH). Writes, DDL, stacked statements, and file-access SQL are rejected before execution. Results are capped
- `update-rows`: Update rows matching a mandatory equality WHERE via $wpdb->update() (parameterized). Requires confirm:true. Refuses protected tables. Disabled by default (wpmcp_enable_db_writes filter). Snapshot-backed and restorable via rollback-operation when the table has a primary key and the WHERE stays under the before-image cap; otherwise reports recoverable:false with a reason and logs the before-image to the write audit log

## Filesystem (6 tools)

- `delete-file`: Delete a file inside the WordPress install. Requires confirm:true. Backs up the file first (recoverable via restore). Refuses wp-config.php/.htaccess. Disabled by default (wpmcp_enable_fs_writes filter); requires edit_files and honors DISALLOW_FILE_EDIT
- `edit-file`: Replace an exact string in a file (must match once unless replace_all). Backs up the original first (recoverable via restore). Refuses wp-config.php/.htaccess. Disabled by default (wpmcp_enable_fs_writes filter); requires edit_files and honors DISALLOW_FILE_EDIT
- `list-directory`: List entries (files/dirs with size and mtime) of a directory inside the WordPress install. Optional bounded recursive listing
- `read-file`: Read a file inside the WordPress installation (core, plugins, themes, uploads). Path is confined to the WP install
- `search-files`: Search file contents for a substring across a directory tree inside the WordPress install. Filterable by extension; results are capped
- `write-file`: Create or overwrite a file inside the WordPress install. Backs up an existing file first (recoverable via restore). Refuses wp-config.php/.htaccess. Disabled by default (wpmcp_enable_fs_writes filter); requires edit_files and honors DISALLOW_FILE_EDIT

## Scanners & cache (4 tools)

- `analyze-performance`: Scan server configuration, WordPress internals (database size, autoloaded options, cron backlog, object cache, OPcache, plugin count), and a target page (defaults to the frontpage; pass "url" or "post_id" for a specific page) for performance issues and bottlenecks. Returns a scored report with severities and ranked, actionable recommendations. Read-only; analyzes this site only
- `clear-cache`: Flush this site's caches: the object cache (wp_cache_flush), all transients (per-site and site-wide), OPcache when available and enabled, and any detected page-cache plugin cleared via its own API. Returns a per-layer summary of what was cleared versus not present. Safe and idempotent: clearing a cache has no meaningful before-image to restore, so it is not snapshotted or rolled back
- `get-cache-status`: Report which caching layers are active on this site: the persistent object cache backend (external vs internal), OPcache (available and enabled), and any active page-cache plugin (WP Rocket, W3 Total Cache, WP Super Cache, LiteSpeed Cache, WP Fastest Cache) detected by its signature functions or constants. Read-only; inspects this site only
- `scan-security`: Scan this site for security and malware problems across four areas: PHP malware heuristics (uploads plus active plugins/themes; pass deep=true for the whole tree), WordPress core file integrity (against official wordpress.org checksums), configuration hardening (file editor, debug output, admin username, XML-RPC, version disclosure, HTTPS, security headers), and outdated/abandoned software. Returns a scored report (0-100 plus A-F grade) with severities and ranked, actionable recommendations. Read-only; self-contained; scans this site only

## Diagnostics & transients (4 tools)

- `delete-transient`: Delete a single named transient via delete_transient(). Not snapshotted: transients are cache-like data with no meaningful before-image to restore, the same reasoning documented for clear-cache
- `get-debug-config`: Report the debug-related constants (WP_DEBUG, WP_DEBUG_LOG, WP_DEBUG_DISPLAY, SCRIPT_DEBUG, SAVEQUERIES) and, when logging is on, the resolved debug.log path. Read-only, no secrets
- `get-debug-log`: Return a bounded tail (at most 200 lines / 64KB) of the WordPress debug log, never the whole file. Defaults to WP_CONTENT_DIR/debug.log or the WP_DEBUG_LOG custom path; any path argument is confined to WP_CONTENT_DIR, refusing traversal
- `list-transients`: List transients (name, expiry) from the options table, with an optional search substring filter and a capped limit (default 50, hard cap 500)

## Advanced Custom Fields (3 tools)

- `get-fields`: Read a post's ACF field values, keyed by field name, via get_fields()
- `list-field-groups`: List registered ACF (Advanced Custom Fields) field groups: key, title, a flattened summary of their location rules, and whether each is active
- `update-fields`: Set one or more ACF field values on a post via update_field(). A field value is ordinary postmeta, so this is snapshotted via object_type post and rollback-operation restores the prior values exactly. Disabled by default (site must opt in via the wpmcp_enable_acf_write filter)

## Internationalization (Polylang) (4 tools)

- `get-post-translations`: Read a post's translations (the translated post id and title, keyed by language code) via the active multilingual plugin (Polylang or WPML)
- `link-post-translations`: Link a set of posts as translations of one another, given a list of {language, post_id} pairs, via the active multilingual plugin (Polylang or WPML). The relationship spans multiple posts but only the primary (first) post is snapshotted, so rollback restores only the primary post, not the other linked posts
- `list-languages`: List the site's configured languages (code, human-readable name, and which is the default) via the active multilingual plugin (Polylang or WPML)
- `set-post-language`: Assign a post to a language (by code) via the active multilingual plugin (Polylang or WPML). For Polylang the language is a term in the 'language' taxonomy, so this is snapshotted via object_type post and rollback-operation restores the prior language assignment exactly

## Multisite (4 tools)

- `get-network-info` — _requires an optional companion plugin or multisite_: Report this network's id, name, domain, total site count, and main site id, via get_network()/get_main_site_id(). Read-only
- `get-site-details` — _requires an optional companion plugin or multisite_: Report a single network site's details (blog_id, url, name, last_updated) by blog_id, via get_site()/get_blog_details(). Returns an error for an unrecognized blog_id
- `is-multisite`: Report whether this WordPress install is part of a multisite network. Always registered, even on single-site installs, so a caller can discover network status before using the rest of the multisite tool group
- `list-network-sites` — _requires an optional companion plugin or multisite_: List sites on the network (blog_id, url, name, last_updated) via get_sites(), with optional limit (default 50) and offset for pagination. limit is capped at 500

## Analytics & Search Console (5 tools)

- `get-analytics-connection-status`: Report whether an analytics provider (Google Site Kit or explicitly configured credentials) is active and appears connected. Always registered so a caller can discover state before using the rest of the analytics tool group. Read-only
- `get-analytics-summary`: Read-only sessions/users/pageviews summary over a date range (Y-m-d, defaulting to a trailing 28-day window ending yesterday) via the connected analytics provider. Returns an error when no provider is connected
- `get-search-console-queries`: Read-only list of top search queries by clicks over a date range (Y-m-d, defaulting to a trailing 28-day window ending yesterday) via the connected Search Console provider, with optional limit (default 10, capped at 100). Returns an error when no provider is connected
- `get-search-console-summary`: Read-only clicks/impressions/ctr/position summary over a date range (Y-m-d, defaulting to a trailing 28-day window ending yesterday) via the connected Search Console provider. Returns an error when no provider is connected
- `get-top-pages`: Read-only list of top pages by pageviews over a date range (Y-m-d, defaulting to a trailing 28-day window ending yesterday) via the connected analytics provider, with optional limit (default 10, capped at 100). Returns an error when no provider is connected

## Cron (4 tools)

- `list-cron-events`: List the scheduled WP-Cron events (hook, next-run timestamp, recurrence/schedule, interval in seconds, callback args) from the cron array, plus the available schedules from wp_get_schedules(). Optional hook filter. Read-only
- `run-event`: Fire a scheduled cron hook now via do_action(), for debugging scheduled jobs. Disabled by default until a site opts in with the wpmcp_enable_run_cron_event filter, and only fires a hook actually present in the cron array (never an arbitrary string). Always replays the stored event args, never caller-supplied ones. Not snapshotted: firing a hook is an irreversible side effect
- `schedule-event`: Schedule a recurring event (wp_schedule_event, when a recurrence is given) or a single event (wp_schedule_single_event). The recurrence is validated against wp_get_schedules(). Refuses scheduling core-critical hooks (wp_version_check, wp_update_plugins/themes, wp_scheduled_delete, delete_expired_transients, wp_privacy_delete_old_export_files). Snapshotted via object_type option (the cron option); rollback-operation restores the prior cron array
- `unschedule-event`: Unschedule a single occurrence (wp_unschedule_event, when a timestamp and matching args are given) or every event for a hook (wp_clear_scheduled_hook). Unrestricted, including core hooks, but made safe by undoability: snapshotted via object_type option (the cron option), so rollback-operation restores the prior cron array

## Maintenance mode (3 tools)

- `disable-maintenance`: Turn maintenance mode off: sets enabled=false on the wpmcp_maintenance option (message and retry_after are preserved for a later re-enable). Snapshotted via object_type option (the wpmcp_maintenance option); rollback-operation restores the prior state
- `enable-maintenance`: Turn maintenance mode on: sets the wpmcp_maintenance option (enabled=true, message, retry_after seconds). Front-end visitors who are not logged in as a manage_options user then receive a 503 with the configured message until maintenance mode is disabled again. Snapshotted via object_type option (the wpmcp_maintenance option); rollback-operation restores the prior state
- `get-maintenance-status`: Report whether maintenance mode is on and, when it is, the configured message and Retry-After seconds. Read-only

## Site context (1 tool)

- `get-site-context`: Report a single orientation payload for an agent connecting to this site: name, URL, tagline, WordPress and PHP versions, active theme, active plugin count and slugs, registered public post types with counts, public taxonomies, user count, locale, timezone, multisite status, and which integrations (Elementor, WooCommerce, ACF, Yoast, RankMath) are active. Excludes the admin email. Read-only

## REST passthrough (2 tools)

- `call-rest`: Perform an internal WP REST API request (rest_do_request) against any route registered on this site and return its HTTP status and body. Authorization is inherited from the REST API itself: the target endpoint's own permission_callback runs against the current user exactly as it would for a real HTTP request, so this tool cannot grant or widen access beyond what that endpoint already allows. GET/HEAD are always permitted (subject to the endpoint's own permission check). POST/PUT/PATCH/DELETE are refused unless a site has opted in via the wpmcp_enable_rest_writes filter (disabled by default) AND the caller passes confirm:true; a successful write reports recoverable:false because an arbitrary REST write cannot be generically snapshotted or undone
- `list-rest-routes`: List the routes registered on this site's WP REST API server (core plus every active plugin's namespace): route path, allowed HTTP methods, and a short summary of each route's args. Optional namespace and/or search filters narrow the result by substring match on the route path; limit caps the number of rows returned (default 50, max 200). Read-only: never executes a route

## Onboarding & connection info (2 tools)

- `get-connection-info`: Return how to connect an MCP client to this site: the MCP server endpoint URL and ready-to-paste connection snippets for Claude Code, Cursor, and Claude Desktop, each using an Application Password placeholder. Never returns a real credential. Read-only
- `list-tool-catalog`: List every wpmcp ability registered on this site, grouped by domain, with each entry's tier (free/pro), operation, required capability, and read-only/destructive hints, plus a per-domain summary count. Optional domain and/or tier filters narrow the result. Read-only

## Tool dispatch (compact mode) (3 tools)

- `call-tool`: Invoke any wpmcp-registered tool by name with the given arguments object — the dispatch path for tools hidden from tools/list by compact mode. The target tool's own permission checks (capability, governance, identity scope, license), rate limit, input validation, and snapshot/rollback safety behavior all apply exactly as if it were called directly; this tool can never widen access. Refuses tools not registered by wpmcp and the meta-tools themselves
- `get-tool-schema`: Read one registered wpmcp tool's full contract by name: the exact input schema it was registered with, its complete description, MCP annotations, and its domain/operation/tier classification. Read-only. Use wpmcp/list-tools to discover names
- `list-tools`: List every tool this wpmcp install currently registers: name, a short summary, domain, operation, and tier, sorted by name. Optional domain filter narrows the result; full:true adds complete descriptions and MCP annotations. Schemas stay behind get-tool-schema. Read-only. With compact mode active this is the discovery entry point for every tool not directly listed

## Governance & scoped identities (6 tools)

- `create-identity`: Create (or overwrite, by name) a scoped identity: a named restriction that, once active (see the wpmcp_current_identity filter), narrows which abilities are usable on top of the caller's capability and Governance. Accepts name (required), and optional domains/operations/abilities allowlists plus mode (allow, the default, or deny). Optional exposure (full or compact) sets this identity's tool-surface mode, overriding the site-wide setting; omit to inherit
- `delete-identity`: Delete a scoped identity by name. Returns an error if no identity with that name exists
- `get-governance-settings`: Return the stored governance toggle maps (ability, domain, operation): explicit enable/disable decisions layered on top of the wpmcp_ability_enabled/wpmcp_domain_enabled/wpmcp_operation_enabled filters. Read-only
- `list-governance-audit-log`: List governance-decision audit log entries (ability, active identity or "none", allowed/denied, timestamp), newest first. Optional limit (default 20). Read-only
- `list-identities`: List every registered scoped identity. Read-only
- `update-governance-settings`: Batch-update stored governance toggles across the ability, domain, and operation dimensions, e.g. {ability: {"wpmcp/delete-post": false}, domain: {"database": false}, operation: {"delete": false}}. Invalid individual entries are skipped and reported, not thrown for; only entirely empty input throws

## PHP snippet validation (1 tool)

- `validate-php-snippet`: Statically validate a PHP code snippet without executing it: report syntax validity (with error message and line if invalid) and safety findings (severity-tagged warnings for dangerous constructs such as eval, exec, shell_exec, backticks, obfuscation decoders, request-driven execution, and outbound HTTP calls). Read-only, never runs the snippet

## Guarded WP-CLI (1 tool, 1 Pro)

- `run-wp-cli` — **Pro**: Run a guarded, allowlisted wp-cli subcommand (e.g. "core version", "plugin list", "option get siteurl") and return its stdout, stderr, and exit code. Disabled by default (opt in via the WPMCP_ALLOW_WP_CLI constant or wpmcp_allow_wp_cli filter); refuses to run on a production environment unless a separate override is also set; only subcommands on the wpmcp_wp_cli_allowlist filter's allowlist are permitted; arguments containing shell metacharacters are rejected before anything runs

## Guarded PHP execution (1 tool, 1 Pro)

- `run-php-snippet` — **Pro**: Run a guarded, arbitrary PHP snippet and return its return value, echoed output, and any thrown error. THIS IS REMOTE CODE EXECUTION: disabled by default (opt in via the WPMCP_ALLOW_PHP_EXEC constant or wpmcp_allow_php_exec filter); refuses to run on a production environment or any unrecognized environment unless a separate WPMCP_ALLOW_PHP_EXEC_ON_PRODUCTION override is also set; snippets flagged unsafe by the static validator are rejected before execution as a usability speed-bump only, not a security boundary. Its effects are not captured by this plugin's snapshot/rollback system and cannot be undone.

## Integrations (ACF dispatcher) (2 tools)

- `acf-read`: Dispatch a read operation against Advanced Custom Fields (field groups and per-post field values). Pass operation (use the reserved "list-operations" to discover every operation with its input schema) plus args matching that operation's schema. Read-only
- `acf-write`: Dispatch a write operation against Advanced Custom Fields (field groups and per-post field values). Pass operation plus args matching that operation's schema (discoverable via list-operations on the read half). Every operation with a snapshotable target is snapshotted first via Safe_Mutation and restorable with rollback-operation; destructive operations additionally require confirm:true
