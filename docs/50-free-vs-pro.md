---
title: Free vs Pro
order: 50
---

# Free vs Pro

## The split today

The plugin registers **188 abilities: 163 free and 25 Pro**. Everything is GPL-2.0 licensed either way, the Pro tier gates which abilities register on your site, not the license of the code.

The free tier includes the entire safety net and the broad site-management surface:

- The full safety engine: snapshot, apply, verify, rollback (both operation- and session-level), plus the wp-admin **wpmcp** history and one-click restore screen.
- All content, Gutenberg block, and surgical block-editing tools, and the `build-page` composite.
- Media (including stock-image search/import and sanitized SVG upload), settings, users, comments, navigation menus, plugins and themes.
- The complete WooCommerce surface: products, orders, notes, sales reports.
- SEO metadata through Yoast SEO or Rank Math, internal-link analysis, performance and security scanners.
- Governance, scoped identities, the audit log, onboarding/connection tools, ACF, Polylang, multisite reads, analytics/Search Console, cron, maintenance mode, REST passthrough, and compact tool dispatch.
- Operation history: the last **20** operations.

The 25 Pro abilities are:

- **Elementor deep editing (7):** `get-elementor-data`, `add-widget`, `update-widget`, `generate-widget`, `update-element`, `move-element`, `remove-element`, built on a curated 44-widget catalog with typed, validated settings schemas.
- **Elementor structural suite (8):** `add-container`, `update-container`, `duplicate-element`, `find-element`, `reorder-elements`, `set-element-label`, `update-page-settings`, `batch-update`.
- **Bricks & Divi builders (3):** `detect-builder`, `get-builder-content`, `update-builder-content`.
- **Content analysis (4):** `analyze-accessibility`, `analyze-seo`, `check-contrast`, `extract-content`.
- **Guarded execution (2):** `run-wp-cli` and `run-php-snippet`, both additionally default-off and restricted to development environments; see [the safety model](30-safety-model.md).
- **Stock placement (1):** `insert-stock-image` (searching and importing stock images stays free).

Plus, on Pro: **unlimited operation history** instead of the 20-operation cap.

## The Gate

Free/Pro gating lives in `WPMCP\Pro\Gate`: a single boolean, `Gate::is_pro()`, backed by the Freemius SDK's `can_use_premium_code__premium_only()` when Freemius is active, and falling back safely to `false` when it isn't (no fatal error if the SDK is absent).

The `MCP\Registrar` skips registering any ability tagged `'pro'` when `Gate::is_pro()` is false, so Pro tools do not appear in a free-tier site's tool list. The other concrete difference is history retention:

```php
public static function history_limit(): int
{
    return self::is_pro() ? PHP_INT_MAX : 20;
}
```

Free tier: **20** operations of history, pruned globally (not per-session) after every write. Pro: unlimited. See [Safety model](30-safety-model.md#known-limitations-stated-honestly) for what the free cap means in practice for `rollback-session` on large agent runs.

## Buying Pro

Pro is licensed through **Freemius** (annual plans from $26.99/year for a single site). The plugin is registered with Freemius and ships privacy-first defaults; checkout links are being wired up, until then, the free plugin is fully functional and the Pro abilities light up when a license activates.

## Privacy default: `anonymous_mode`

`Bootstrap::config()` sets `'anonymous_mode' => true` by default:

```php
// Privacy-first defaults: wpmcp does not force telemetry opt-in.
// anonymous_mode skips the Freemius connect/opt-in gate on activation,
// matching our "no telemetry by default" positioning.
'anonymous_mode' => true,
```

This means Freemius's usual connect/opt-in screen is skipped on activation, no telemetry opt-in gate is forced on the site owner. This is a deliberate privacy-first default consistent with the project's "no telemetry by default" positioning, not an accidental omission.
